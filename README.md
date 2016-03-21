# Angular Persistent Request

## Quick configuration
angular.module('myApp', ['vzx.sync']);

myModule.controller('myController', function($scope, $resource, sync) {

    // Define your resource object.
    var myResource = $resource(url[, paramDefaults]);

    var mySync = sync.get(myResource);

    // Update view. Since a promise can only be resolved or rejected once but we want
    // to keep track of all requests, the service uses the notifyCallback. By default
    // sync only gets notified of success responses.
    mySync.promise.then(null, null, callback);

    // Stop .
    mySync.stop();

    // Restart.
    mySync.restart();

    // Remove .
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

    var mySync = sync.get(myResource, {
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

### Customize $http 
```javascript
myModule.controller('myController', function($scope, sync) {

    var mySync = sync.get('api/test/123', {
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

    mySync.promise.then(null, null, callback);
});
```
The format of `argumentsArray` is:
- `GET`, `DELETE`, `HEAD` and `JSONP` requests: `[config]`
- `POST`, `PUT`, `PATCH` requests: `data, [config]`

`config` is the object describing the request to be made and how it should be processed. It may contain `params`, `headers`, `xsrfHeaderName` etc. Please see `$http` [documentation](https://docs.angularjs.org/api/ng/service/$http) for more information.

### Customize Restangular
```javascript
myModule.controller('myController', function($scope, Restangular, sync) {

    var mySync = sync.get(Restangular.one('test', 123), {
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

    mySync.promise.then(null, null, callback);
});
```
Angular Sync supports all [Restangular action methods](https://github.com/mgonto/restangular#methods-description). Here `argumentsArray` is exactly the same as the input arguments for the original method function. For instance the `argumentsArray` for element method `getList(subElement, [queryParams, headers])` would be `subElement, [queryParams, headers]`, and the `argumentsArray` for collection method `getList([queryParams, headers])` would be `[queryParams, headers]`, etc.

### Error handling
One way to capture error responses is to use the `catchError` option. It indicates whether sync should get notified of error responses.
```javascript
var mySync = sync.get(myTarget, {
    catchError: true
});

mySunc.promise.then(null, null, function(result) {

    // If catchError is set to true, this notifyCallback can contain either
    // a success or an error response.
    if (result.$resolved) {

        // Success handler ...
    } else {

        // Error handler: (data, status, headers, config)
        if (result.status === 503) {
            // Stop sync or provide visual feedback to the user etc
            sync.stopAll();
        }
    }
});
```

Alternatively you can use AngularJS `interceptors` for global error handling like so:
```javascript
angular.module('myApp', ['vzx.sync'])
    .config(function($httpProvider) {
        $httpProvider.interceptors.push(function($q, sync) {
            return {
                'responseError': function(rejection) {
                    if (rejection.status === 503) {
                        // Stop sync or provide visual feedback to the user etc
                        sync.stopAll();
                    }
                    return $q.reject(rejection);
                }
            };
        });
    });
```

You may also use `setErrorInterceptor` if you are using Restangular.

### Multiple
```javascript
var myModule = angular.module('myApp', ['vzx.sync']);

myModule.controller('myController', function($scope, sync) {

    var sync1 = sync.get(target1),
        sync2 = sync.get(target2);

    sync1.promise.then(null, null, callback);
    sync2.promise.then(null, null, callback);

    // Total number of syncs
    console.log(sync.size());

    // Stop all
    sync.stopAll();

    // Restart all
    sync.restartAll();

    // Stop and remove all
    sync.reset();
});
```
