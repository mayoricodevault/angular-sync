app.controller('jTCntlr', function ($rootScope, $scope) {
    $scope.dtInstance;
    $scope.dtColumnDefs;
    $rootScope.$on("SyncCols", function (event, colDefs) {
        if(colDefs){
            $scope.dtColumnDefs = dtVzxFactory.dtMapColumns(colDefs, 3 );
            console.log($scope.dtColumnDefs);
        }
    });
    $rootScope.$on("SyncRows", function (event, data) {

        if(data){
            $scope.dtInstance = dtVzxFactory.dtMapRows(data);
        }
    });
});