var app = angular.module("mvpapp",
    ['ngResource',
        'ngRoute',
        'datatables',
        'vzx.sync',
        'angular-storage',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'ui.sortable',
        'reportTableDirective',
    ]);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/jt', {
            templateUrl: "app/views/dynamicReport.html",
            controller: "jTCntlr"
        })
        .otherwise({
            redirectTo: "/jt"
        });
});
app.constant('_',
    window._
);
app.constant('objectDiff',
    window.objectDiff
);
app.run(
    function initializeApplication(datatableService) {
        // ... this does nothing but require the injected services to be
        // instantiated before other parts of the module run.
    }
);
