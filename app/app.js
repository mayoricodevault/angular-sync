var app = angular.module("mvpapp", ['ngResource', 'ngRoute', 'datatables', 'vzx.sync','angular-storage']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/dt', {
            templateUrl: "app/views/datatables.html",
            controller: "dTCntlr"
        })
        .otherwise({
            redirectTo: "/dt"
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
