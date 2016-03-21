# Angular Persistent Request

## Quick configuration
angular.module('myApp', ['vzx.sync']);

myModule.controller('myController', function($scope, $resource, sync) {

    // Define your resource object.
    var myResource = $resource(url[, paramDefaults]);

    // Get poller. This also starts/restarts poller.
    var mySync = sync.get(myResource);

    // Update view. Since a promise can only be resolved or rejected once but we want
    // to keep track of all requests, poller service uses the notifyCallback. By default
    // poller only gets notified of success responses.
    myPoller.promise.then(null, null, callback);

    // Stop poller.
    mySync.stop();

    // Restart poller.
    mySync.restart();

    // Remove poller.
    mySync.remove();
});
```

## Advanced usage


myModule.controller('myController', function($scope, $resource, sync) {

    // Define your resource object.
    var myResource = $resource(url[, paramDefaults], {
        myQuery: {
            method: 'GET',
            isArray: true,
            headers: ...
        },
        ...
    });

    // Get poller.
    var mySync = poller.get(myResource, {
        action: 'myQuery',
        delay: 6000,
        argumentsArray: [
            {
                verb: 'pepito',
                salutation: 'Hello'
            }
        ]
    });

    mySync.promise.then(null, null, callback);
});
```
Similar to how you invoke action methods on the class object or instance object directly ([$resource](https://docs.angularjs.org/api/ngResource/service/$resource)), the format of `argumentsArray` is:
- HTTP GET "class" actions: `[parameters]`
- non-GET "class" actions: `[parameters], postData`
- non-GET instance actions: `[parameters]`

### Customize $http poller
```javascript
myModule.controller('myController', function($scope, poller) {

    // Get poller.
    var myPoller = poller.get('api/test/123', {
        action: 'jsonp',
        delay: 6000,
        argumentsArray: [
            {
                params: {
                    param1: 1,
                    param2: 2
                },
                headers: {
                    header1: 1
                }
            }
        ]
    });

    myPoller.promise.then(null, null, callback);
});
```
The format of `argumentsArray` is:
- `GET`, `DELETE`, `HEAD` and `JSONP` requests: `[config]`
- `POST`, `PUT`, `PATCH` requests: `data, [config]`

`config` is the object describing the request to be made and how it should be processed. It may contain `params`, `headers`, `xsrfHeaderName` etc. Please see `$http` [documentation](https://docs.angularjs.org/api/ng/service/$http) for more information.

### Customize Restangular poller
```javascript
myModule.controller('myController', function($scope, Restangular, poller) {

    // Get poller.
    var myPoller = poller.get(Restangular.one('test', 123), {
        action: 'get',
        delay: 6000,
        argumentsArray: [
            {
                param1: 1,
                param2: 2
            },
            {
                header1: 1
            }
        ]
    });

    myPoller.promise.then(null, null, callback);
});
```
Angular Poller supports all [Restangular action methods](https://github.com/mgonto/restangular#methods-description). Here `argumentsArray` is exactly the same as the input arguments for the original method function. For instance the `argumentsArray` for element method `getList(subElement, [queryParams, headers])` would be `subElement, [queryParams, headers]`, and the `argumentsArray` for collection method `getList([queryParams, headers])` would be `[queryParams, headers]`, etc.

### Error handling
One way to capture error responses is to use the `catchError` option. It indicates whether poller should get notified of error responses.
```javascript
var myPoller = poller.get(myTarget, {
    catchError: true
});

myPoller.promise.then(null, null, function(result) {

    // If catchError is set to true, this notifyCallback can contain either
    // a success or an error response.
    if (result.$resolved) {

        // Success handler ...
    } else {

        // Error handler: (data, status, headers, config)
        if (result.status === 503) {
            // Stop poller or provide visual feedback to the user etc
            poller.stopAll();
        }
    }
});
```

Alternatively you can use AngularJS `interceptors` for global error handling like so:
```javascript
angular.module('myApp', ['emguo.poller'])
    .config(function($httpProvider) {
        $httpProvider.interceptors.push(function($q, poller) {
            return {
                'responseError': function(rejection) {
                    if (rejection.status === 503) {
                        // Stop poller or provide visual feedback to the user etc
                        poller.stopAll();
                    }
                    return $q.reject(rejection);
                }
            };
        });
    });
```

You may also use `setErrorInterceptor` if you are using Restangular.

### Multiple pollers
```javascript
// Inject angular poller service.
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.controller('myController', function($scope, poller) {

    var poller1 = poller.get(target1),
        poller2 = poller.get(target2);

    poller1.promise.then(null, null, callback);
    poller2.promise.then(null, null, callback);

    // Total number of pollers
    console.log(poller.size());

    // Stop all pollers.
    poller.stopAll();

    // Restart all pollers.
    poller.restartAll();

    // Stop and remove all pollers.
    poller.reset();
});
```

### Multiple controllers
```javascript
// Inject angular poller service.
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.factory('myTarget', function() {
    // return $resource object, Restangular object or $http url.
    return ...;
});

myModule.controller('controller1', function($scope, poller, myTarget) {
    // Register and start poller.
    var myPoller = poller.get(myTarget);
    myPoller.promise.then(null, null, callback);
});

myModule.controller('controller2', function($scope, poller, myTarget) {
    // Get existing poller and restart it.
    var myPoller = poller.get(myTarget);
    myPoller.promise.then(null, null, callback);
});

myModule.controller('controller3', function($scope, poller, myTarget) {
    poller.get(myTarget).stop();
});
```

### Only send new request if the previous one is resolved
Use the `smart` option to make sure poller only sends new request after the previous one is resolved. It is set to `false` by default.
```javascript
var myPoller = poller.get(myTarget, {
    action: 'query',
    delay: 6000,
    argumentsArray: [
        {
            verb: 'greet',
            salutation: 'Hello'
        }
    ],
    smart: true
});
```

You can also use `pollerConfig` to set `smart` globally for all pollers.

```javascript
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.config(function(pollerConfig) {
    pollerConfig.smart = true;
});
```

### Always create new poller on calling `poller.get`
By default `poller.get(target, ...)` looks for any existing poller by `target` in poller registry. If found, it overwrites
existing poller with new parameters such as `action`, `delay`, `argumentsArray` etc if specified, and then restarts the poller.
If not found, it creates and starts a new poller. It means you will never have two pollers running against the same target.

But if you do want to have more than one poller running against the same target, you can force poller to always create new
poller on calling `poller.get` like so:

```javascript
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.config(function(pollerConfig) {
    pollerConfig.neverOverwrite = true;
});
```

### Automatically stop all pollers when navigating between views
In order to automatically stop all pollers when navigating between views with multiple controllers, you can use `pollerConfig`.
```javascript
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.config(function(pollerConfig) {
    pollerConfig.stopOn = '$stateChangeStart'; // If you use ui-router.
    pollerConfig.stopOn = '$routeChangeStart'; // If you use ngRoute.
});
```
You also have the option to set `pollerConfig.stopOn` to `$stateChangeSuccess` or `$routeChangeSuccess`.

### Automatically reset all pollers when navigating between views
You can also use `pollerConfig` to automatically reset all pollers when navigating between views with multiple controllers.
It empties poller registry in addition to stopping all pollers. It means `poller.get` will always create a new poller.
```javascript
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.config(function(pollerConfig) {
    pollerConfig.resetOn = '$stateChangeStart'; // If you use ui-router.
    pollerConfig.resetOn = '$routeChangeStart'; // If you use ngRoute.
});
```
You also have the option to set `pollerConfig.resetOn` to `$stateChangeSuccess` or `$routeChangeSuccess`.

### Automatically adjust poller speed on page visibility change
Use the `handleVisibilityChange` option to automatically slow down poller delay to `idleDelay` when page is hidden.
By default `idleDelay` is set to 10 seconds.
```javascript
var myModule = angular.module('myApp', ['emguo.poller']);

myModule.config(function(pollerConfig) {
    pollerConfig.handleVisibilityChange = true;
});

myModule.controller('myController', function(poller) {
    poller.get(myTarget, {
        idleDelay: 20000 // Default value is 10000
    });
});