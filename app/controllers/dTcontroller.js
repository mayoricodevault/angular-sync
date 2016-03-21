//use markup only
app.controller('dTCntlr', ['$rootScope','$scope' ,'$resource','DTColumnBuilder', 'DTOptionsBuilder', 'DTColumnDefBuilder','datatableService', function ($rootScope,$scope, $resource, DTColumnBuilder, DTOptionsBuilder, DTColumnDefBuilder,datatableService) {

    $scope.reportTable = {
        parentHeader:[],
        header:[],
        body:[]
    };

    $rootScope.$on("SyncCols", function (event, data) {
       if(data){
           $scope.reportTable.header = data.reportProperty;
       }
    });

    $rootScope.$on("SyncRows", function (event, data) {
        if(data){
            console.log(data);
            $scope.reportTable.body = data.results;
        }


    });


    $scope.ReRenderTable = function () {
        //$scope.dtInstance.DataTable.draw();
    };

    $scope.stop = function() {
        datatableService.stop();
    };

    $scope.restart = function() {
        datatableService.restart();
    };

    $scope.faster = function() {
        datatableService.faster();
    };

    $scope.slower = function() {
        datatableService.slower();
    };


}]); 