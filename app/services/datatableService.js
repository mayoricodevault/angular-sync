app.factory('datatableService', ['$rootScope', '$q',  'sync', '$resource','_','objectDiff','store', function ($rootScope, $q, sync, $resource,_,objectDiff, store) {
    var cacheDef ;
    var repoRequest;
    var repodetails;
    console.log( "Service Datatables instantiated." );
    var dataServiceFactory = {};

    repodetails = $resource('http://healthcare.mojix.com:8080/riot-core-services/api/reportExecution/3', {},{
        getData: {
            method: 'POST',
            isArray: false,
            cancellable: true,
            headers : { "content-type":"application/json", "api_key": "root"}
        }
    });
    repoRequest = sync.get(repodetails, {
        action: 'getData',
        argumentsArray: [{}],
        delay: 20000,
        autosolve: true
    });
    repoRequest.promise.then(null, null, function(data){
        //process

        //console.log(rowsdata);
        $rootScope.$broadcast("SyncRows", data);
    });

    var repoDefinition = $resource('http://healthcare.mojix.com:8080/riot-core-services/api/reportDefinition/3', {},{
        getData: {
            method: 'GET',
            isArray: false,
            cancellable: true,
            headers : { "content-type":"application/json", "api_key": "root"}
        }
    });
    var repoDefRequest = sync.get(repoDefinition, {
        action: 'getData',
        argumentsArray: [{}],
        delay: 30000,
        autosolve: true
    });
    repoDefRequest.promise.then(null, null, function(data){
        var newData = _.pick(data,'name','reportType','timeoutCache','autoRefreshInterval', 'reportProperty');
        $rootScope.$broadcast("SyncCols", newData);
    });

    dataServiceFactory.stop = function () {
        repoRequest.stop();
    }

    dataServiceFactory.restart = function () {
        repoRequest.restart();
    }

    dataServiceFactory.faster = function () {
        repoRequest = sync.get(repodetails, {
            action: 'getData',
            argumentsArray: [{}],
            delay: 300,
            autosolve: true
        });
    }

    dataServiceFactory.slower = function () {
        repoRequest = sync.get(repodetails, {
            action: 'getData',
            argumentsArray: [{}],
            delay: 3000,
            autosolve: true
        });
    }


    //
    //dataServiceFactory.get = function (force, status) {
    //    var deferred = $q.defer();
    //    $http({
    //        method: 'http://demo7783456.mockable.io/testdata',
    //        url: endpoint
    //    }).success(function (response) {
    //        deferred.resolve(response);
    //    }).error(function (message) {
    //        deferred.reject(message);
    //    });
    //
    //    return deferred.promise;
    //}
    //dataServiceFactory.getColumns = function () {
    //    var deferred = $q.defer();
    //    cacheDef = store.get('def');
    //    if (_.isObject(cacheDef)) {
    //        var coldefs = agGridColumns.mapdata(cacheDef);
    //        agGridRows.columnsMap(coldefs);
    //        deferred.resolve(coldefs);
    //    }
    //    return deferred.promise;
    //}
    return dataServiceFactory;
}
]);