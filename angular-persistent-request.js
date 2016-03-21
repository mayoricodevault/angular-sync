(function(window, angular, undefined) {

    'use strict';

    angular.module('vzx.sync', [])

        .constant('aprConfig', {
            stopOn: null,
            resetOn: null,
            autosolve: false,
            neverOverwrite: false,
            handleVisibilityChange: false
        })

        .run([
            '$rootScope',
            '$document',
            'sync',
            'aprConfig',
            function(
                $rootScope,
                $document,
                poller,
                aprConfig
            ) {
                /**
                 * Automatically stop or reset all pollers before route
                 * change start/success ($routeProvider) or state change
                 * start/success ($stateProvider).
                 */
                function isValid(event) {
                    return event && (
                        event === '$stateChangeStart' ||
                        event === '$routeChangeStart' ||
                        event === '$stateChangeSuccess' ||
                        event === '$routeChangeSuccess');
                }

                if (isValid(aprConfig.stopOn)) {
                    $rootScope.$on(
                        aprConfig.stopOn,
                        function() {
                            poller.stopAll();
                        }
                    );
                }

                if (isValid(aprConfig.resetOn)) {
                    $rootScope.$on(
                        aprConfig.resetOn,
                        function() {
                            poller.reset();
                        }
                    );
                }

                /**
                 * Automatically increase or decrease poller speed on page
                 * visibility change.
                 */
                function delayOnVisibilityChange() {
                    if ($document[0].hidden) {
                        poller.delayAll();
                    } else {
                        poller.resetDelay();
                    }
                }

                if (aprConfig.handleVisibilityChange) {
                    delayOnVisibilityChange();
                    $document.on('visibilitychange', delayOnVisibilityChange);
                }
            }
        ])

        .factory('sync', [
            '$interval',
            '$q',
            '$http',
            'aprConfig',
            function(
                $interval,
                $q,
                $http,
                aprConfig
            ) {
                var requestList = [];
                var defaults = {
                    action: 'get',
                    argumentsArray: [],
                    delay: 5000,
                    idleDelay: 10000,
                    autosolve : aprConfig.autosolve,
                    catchError: false
                };

                /**
                 * model:
                 *  - target: can be $resource object, or Restangular object,
                 *    or $http url
                 *  - action
                 *  - argumentsArray
                 *  - delay
                 *  - idleDelay: a bigger polling interval if page is hidden
                 *  - autosolve: indicates whether poller should only send new
                 *    request if the previous one is resolved
                 *  - catchError: indicates whether poller should get notified
                 *    of error responses
                 *  - promise
                 *  - interval
                 *
                 * @param target
                 * @param options
                 */
                function Sync(target, options) {
                    this.target = target;
                    this.set(options);
                }

                /**
                 * Find by target in a registry if
                 * aprConfig.neverOverwrite is set to false (default).
                 * Otherwise return null to prevent overwriting existing ones.
                 *
                 * @param target
                 * @returns {object}
                 */
                function findSync(target) {
                    var sync = null;
                    if (!aprConfig.neverOverwrite) {
                        angular.forEach(requestList, function(item) {
                            if (angular.equals(item.target, target)) {
                                sync = item;
                            }
                        });
                    }

                    return sync;
                }

                /**
                 * Set action, argumentsArray, delay, normalDelay,
                 * idleDelay, autosolve and catchError flags.
                 *
                 * If options.action is defined, then set action to
                 * options.action, else if action is undefined, then
                 * set it to defaults.action, else do nothing. The same goes
                 * for argumentsArray, delay, idleDelay, autosolve and catchError.
                 * Also keep a copy of delay in normalDelay.
                 *
                 * @param options
                 */
                Sync.prototype.set = function(options) {
                    var props = [
                        'action',
                        'argumentsArray',
                        'delay',
                        'idleDelay',
                        'autosolve',
                        'catchError'
                    ];

                    angular.forEach(props, function(prop) {
                        if (options && options[prop]) {
                            this[prop] = options[prop];
                        } else if (!this[prop]) {
                            this[prop] = defaults[prop];
                        }
                    }, this);

                    this.normalDelay = this.delay;
                };

                /**
                 * Start.
                 */
                Sync.prototype.start = function() {
                    var target = this.target;
                    var action = this.action;
                    var argumentsArray = this.argumentsArray.slice(0);
                    var delay = this.delay;
                    var autosolve = this.autosolve;
                    var catchError = this.catchError;
                    var self = this;
                    var current;
                    var timestamp;

                    this.deferred = this.deferred || $q.defer();

                    /**
                     * $resource: typeof target === 'function'
                     * Restangular: typeof target === 'object'
                     * $http: typeof target === 'string'
                     */
                    if (typeof target === 'string') {

                        /**
                         * Update argumentsArray and target for
                         * target[action].apply(self, argumentsArray).
                         *
                         * @example
                         * $http.get(url, [config])
                         * $http.post(url, data, [config])
                         */
                        argumentsArray.unshift(target);
                        target = $http;
                    }

                    function tick() {
                        // If autosolve flag is true, then only send new
                        // request if the previous one is resolved.
                        if (!autosolve ||
                            angular.isUndefined(current) ||
                            current.$resolved) {

                            timestamp = new Date();
                            current =
                                target[action].apply(target, argumentsArray);
                            current.$resolved = false;

                            /**
                             * $resource: current.$promise.then
                             * Restangular: current.then
                             * $http: current.then
                             */
                            (current.$promise || current).then(
                                function(result) {
                                    // Ignore success response if request is
                                    // sent before poller is stopped.
                                    current.$resolved = true;
                                    if (angular.isUndefined(self.stopTimestamp) ||
                                        timestamp >= self.stopTimestamp) {
                                        self.deferred.notify(result);
                                    }
                                },
                                function(error) {
                                    // Send error response if catchError
                                    // flag is true and request is sent
                                    // before poller is stopped.
                                    current.$resolved = true;
                                    if (catchError &&
                                        (angular.isUndefined(self.stopTimestamp) ||
                                        timestamp >= self.stopTimestamp)) {
                                        self.deferred.notify(error);
                                    }
                                }
                            );
                        }
                    }

                    tick();
                    this.interval = $interval(tick, delay);
                    this.promise = this.deferred.promise;
                };

                /**
                 * Stop if it is running.
                 */
                Sync.prototype.stop = function() {
                    if (angular.isDefined(this.interval)) {
                        $interval.cancel(this.interval);
                        this.interval = undefined;
                        this.stopTimestamp = new Date();
                    }
                };

                /**
                 * Remove
                 */
                Sync.prototype.remove = function() {
                    var index = requestList.indexOf(this);
                    this.stop();
                    requestList.splice(index, 1);
                };

                /**
                 * Restart
                 */
                Sync.prototype.restart = function() {
                    this.stop();
                    this.start();
                };

                return {
                    /**
                     * Return a singleton instance . If sync does
                     * not exist, then register and start it. Otherwise return
                     * it and restart it if necessary.
                     *
                     * @param target
                     * @param options
                     * @returns {object}
                     */
                    get: function(target, options) {
                        var sync = findSync(target);

                        if (!sync) {
                            sync = new Sync(target, options);
                            requestList.push(sync);
                            sync.start();
                        } else {
                            sync.set(options);
                            sync.restart();
                        }

                        return sync;
                    },

                    /**
                     * Total number of syncs in registry.
                     *
                     * @returns {number}
                     */
                    size: function() {
                        return requestList.length;
                    },

                    /**
                     * Stop all services.
                     */
                    stopAll: function() {
                        angular.forEach(requestList, function(p) {
                            p.stop();
                        });
                    },

                    /**
                     * Restart all services.
                     */
                    restartAll: function() {
                        angular.forEach(requestList, function(p) {
                            p.restart();
                        });
                    },

                    /**
                     * Stop and remove all poller services.
                     */
                    reset: function() {
                        this.stopAll();
                        requestList = [];
                    },

                    /**
                     * Increase all poller interval to idleDelay.
                     */
                    delayAll: function() {
                        angular.forEach(requestList, function(p) {
                            p.delay = p.idleDelay;
                            p.restart();
                        });
                    },

                    /**
                     * Reset all poller interval back to its original delay.
                     */
                    resetDelay: function() {
                        angular.forEach(requestList, function(p) {
                            p.delay = p.normalDelay;
                            p.restart();
                        });
                    }
                };
            }
        ]);
})(window, window.angular);