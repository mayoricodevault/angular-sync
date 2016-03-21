//use markup only
app.controller('dTCntlr', ['$rootScope','$scope' ,'$resource','DTColumnBuilder', 'DTOptionsBuilder', 'DTColumnDefBuilder','datatableService', function ($rootScope,$scope, $resource, DTColumnBuilder, DTOptionsBuilder, DTColumnDefBuilder,datatableService) {


    $scope.reportTable = {
        parentHeader:[],
        header:[],
        body:[]
    };

    var gridOptions = {
        debug: true,
        columnDefs: null,
        rowData: null,
        enableSorting: true,
        enableColResize: true,
        enableFilter: true,
        groupHeaders: true,
        rowHeight: 22,
        enableColResize: true,
        onGridReady: function() {
            gridOptions.api.addGlobalListener(function(type, event) {
                if (type.indexOf('column') >= 0) {
                    console.log('Got column event: ' + event);
                }
            });
        }
    };

    var gridDiv = document.querySelector('#nurseStationOne');


    datatableService.getColumns().then(function(data){
        console.log(data);
        gridOptions.api.setColumnDefs(data)
    });

    agGrid.Grid(gridDiv, gridOptions);
    gridOptions.columnApi.sizeColumnsToFit();

    $rootScope.$on("SyncCols", function (event, data) {
       if(data){
           $scope.reportTable.header = data;
           gridOptions.api.setColumnDefs($scope.reportTable.header);

       }
    });

    $rootScope.$on("SyncRows", function (event, data) {
        if(data){
            //console.log(data);
            $scope.reportTable.body = data;
            gridOptions.api.setRowData($scope.reportTable.body);
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