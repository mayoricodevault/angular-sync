//use markup only
app.controller('rTCntlr', ['$rootScope','$scope', function ($rootScope,$scope) {
    var $baseApiUrl 	=	'http://healthcare.mojix.com:8080/riot-core-services/api';
    var reportConfig 	=	{
        title: 'Example',
        apiRequestLink: '/reportExecution/3',
        baseApiUrl: $baseApiUrl,
        rowIdModel: 'Name',
        cols: [
            {
                label: 'Full Name',
                sortable: true,
                model: 'Full Name',
                align: 'center',
                editForm: false,
            },
            {
                label: 'Name',
                sortable: true,
                model: 'Name',
                editForm: false
            }
        ],
        advanceFilter: false,
        actions: false
    };
    $scope.reportTableConfig = reportConfig;


}]); 