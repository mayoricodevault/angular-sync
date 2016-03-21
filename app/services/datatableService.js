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
        delay: 3000,
        autosolve: true
    });
    repoRequest.promise.then(null, null, function(data){
        //process
        var rowsdata = agGridRows.mapdata(data);
        //console.log(rowsdata);
        $rootScope.$broadcast("SyncRows", rowsdata);
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
        delay: 3000,
        autosolve: true
    });
    repoDefRequest.promise.then(null, null, function(data){
        var newData = _.pick(data,'name','reportType','timeoutCache','autoRefreshInterval', 'reportProperty');
        cacheDef = store.get('def');
        var coldefs = agGridColumns.mapdata(newData);
        if (_.isObject(cacheDef)) {
            var diff = objectDiff.diffOwnProperties(cacheDef, newData);
            agGridRows.columnsMap(coldefs);
            //console.log(diff);
            if (diff.changed != 'equal') {
                //var coldefs = agGridColumns.mapdata(newData);
                //agGridRows.columnsMap(coldefs);
                $rootScope.$broadcast("SyncCols", coldefs);
                //console.log('1------------->')
                //console.log(coldefs);
                store.set('def', newData);
            } //else{
            //    agGridRows.columnsMap(coldefs);
            //    $rootScope.$broadcast("SyncCols", coldefs);
            //}
            //    var coldefs = agGridColumns.mapdata(newData);
            //    agGridRows.columnsMap(coldefs);
            //    $rootScope.$broadcast("SyncCols", coldefs);
            //}
        }
        // else {
        //    store.set('def', newData);
        //    var coldefs = agGridColumns.mapdata(cacheDef);
        //    agGridRows.columnsMap(coldefs);
        //    $rootScope.$broadcast("SyncCols", coldefs);
        //}
    });

    dataServiceFactory.getColumns = function () {
        var deferred = $q.defer();
        cacheDef = store.get('def');
        if (_.isObject(cacheDef)) {
            var coldefs = agGridColumns.mapdata(cacheDef);
            agGridRows.columnsMap(coldefs);
            deferred.resolve(coldefs);
        }
        return deferred.promise;
    }

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

    return dataServiceFactory;
}
]);