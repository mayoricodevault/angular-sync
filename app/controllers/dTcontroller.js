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
        //onSelectionChanged: onSelectionChanged
        onGridReady: function(event) {
            gridOptions.api.addGlobalListener(function(type, event) {
                if (type.indexOf('column') >= 0) {
                    console.log('Got column event: ' + event);
                }
            });
            event.api.sizeColumnsToFit();
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

            $scope.reportTable.body = data;
            //setRowData(data);
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

    //function setRowData(allOfTheData) {
    //    var dataSource = {
    //        rowCount: null, // behave as infinite scroll
    //        pageSize: 2,
    //        overflowSize: 1,
    //        maxConcurrentRequests: 2,
    //        maxPagesInCache: 2,
    //        getRows: function (params) {
    //            console.log('asking for ' + params.startRow + ' to ' + params.endRow);
    //            // At this point in your code, you would call the server, using $http if in AngularJS.
    //            // To make the demo look real, wait for 500ms before returning
    //                // take a slice of the total rows
    //            var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
    //            // if on or after the last page, work out the last row.
    //            var lastRow = -1;
    //            if (allOfTheData.length <= params.endRow) {
    //                lastRow = allOfTheData.length;
    //            }
    //            // call the success callback
    //            params.successCallback(rowsThisPage, lastRow);
    //        }
    //    };
    //
    //    gridOptions.api.setDatasource(dataSource);
    //}


}]); 