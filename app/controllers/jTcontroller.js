//use markup only
app.controller('jTCntlr', function ($rootScope, $scope, store) {

    if (store.get('JSON')) {
        $scope._ReportDefinition =  store.get('JSON');
    } else {
        $scope._ReportDefinition=JSON.stringify({
            'boolean': true
        });
    }
    $scope.dtInstance;
    $scope.dtColumnDefs;


    $rootScope.$on("SyncCols", function (event, colDefs) {
        if(colDefs){
            $scope.dtColumnDefs = dtVzxFactory.dtMapColumns(colDefs, 3 );
            var some = dtVzxFactory.dtMapTree(colDefs, 3 );
            console.log('------cols>');
            console.dir(some);
            console.log('------cols>');
        }
    });
    $rootScope.$on("SyncRows", function (event, data) {

        if(data){
            $scope.dtInstance = dtVzxFactory.dtMapRows(data);
            //$scope.dtInstance = data;
            //$scope.dtInstance.reloadData();
            //console.log('------rows>');
            //console.dir($scope.dtInstance);
            //console.log('------rows>');
            //setRowData(data);
        }
    });
});