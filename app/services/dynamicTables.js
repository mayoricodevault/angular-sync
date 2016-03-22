/**
 * Created by mike.mayori on 3/22/16.
 */
'use strict';
var $templateUrl  = 'app/views/ReportTable.html';

var $dictionary   = {
    'en': {
        'ROW': 'row',
        'ROWS': 'rows',
        'SHOWING': 'Showing',
        'TOTAL': 'Total',

        'EDIT': 'Edit',
        'DELETE': 'Delete',
        'SAVE': 'Save',
        'CANCEL': 'Cancel',
        'NEW': 'New',
        'FILTER': 'Filter Data',
        'SUBMIT': 'Submit',
        'APPLY': 'Apply',

        'CHECK_ALL_ROWS': 'Check all rows',
        'CHECK_THIS_ROW': 'Check this row',

        'SORT_BY_ASC': 'Sort By {{label}} ASC',
        'SORT_BY_DESC': 'Sort By {{label}} DESC',

        'GO_TO_PAGE': 'Go to page',
        'CURRENT_PAGE': 'Page',
        'SHOW_NUM_ROWS_PER_PAGE': 'Show {{numRows}} rows per page',

        'ERROR_REQUIRED': '{{label}} is required and must be valid.',
        'ERROR_EMAIL': '{{label}} is not valid email',
        'ERROR_MIN': '{{label}} must be greater than {{min}}',
        'ERROR_MAX': '{{label}} must be smaller than {{max}}',
        'ERROR_MIN_LENGTH': '{{label}} must contain at least {{minlength}} characters',
        'ERROR_MAX_LENGTH': '{{label}} must contain at most {{maxlength}} characters',

        'SELECT': 'Select',
        'SELECT_CONDITION': 'Select condition',
        'SELECT_CONDITION_FIRST': 'Select filter condition first',
        'FILTER_EQUAL': 'Equal',
        'FILTER_LESS': 'Less than',
        'FILTER_MORE': 'More than',
        'FILTER_BETWEEN': 'Between',
        'FILTER_MATCH': 'Match exactly',
        'FILTER_SEARCH': 'Search like',
        'FILTER_MULTI_SELECT': 'Select multi options',
        'FILTER_SINGLE_SELECT': 'Select only one option',

        'NO_RECORDS_FOUND': 'No records',
        'SELECT_LANGUAGE': 'Select language',

        'VIEW_AS_TABLE': 'Table view',
        'VIEW_AS_GRID': 'Grid view',
        'DRAG_DROP_TO_REORDER': 'Drag and drop to re-order columns',
        'HIDE_COLUMNS': 'Hide columns',
    },
    'es': {
        'ROW': 'row',
        'ROWS': 'rows',
        'SHOWING': 'Showing',
        'TOTAL': 'Total',

        'EDIT': 'Edit',
        'DELETE': 'Delete',
        'SAVE': 'Save',
        'CANCEL': 'Cancel',
        'NEW': 'New',
        'FILTER': 'Filter Data',
        'SUBMIT': 'Submit',
        'APPLY': 'Apply',

        'CHECK_ALL_ROWS': 'Check all rows',
        'CHECK_THIS_ROW': 'Check this row',

        'SORT_BY_ASC': 'Sort By {{label}} ASC',
        'SORT_BY_DESC': 'Sort By {{label}} DESC',

        'GO_TO_PAGE': 'Go to page',
        'CURRENT_PAGE': 'Page',
        'SHOW_NUM_ROWS_PER_PAGE': 'Show {{numRows}} rows per page',

        'ERROR_REQUIRED': '{{label}} is required and must be valid.',
        'ERROR_EMAIL': '{{label}} is not valid email',
        'ERROR_MIN': '{{label}} must be greater than {{min}}',
        'ERROR_MAX': '{{label}} must be smaller than {{max}}',
        'ERROR_MIN_LENGTH': '{{label}} must contain at least {{minlength}} characters',
        'ERROR_MAX_LENGTH': '{{label}} must contain at most {{maxlength}} characters',

        'SELECT': 'Select',
        'SELECT_CONDITION': 'Select condition',
        'SELECT_CONDITION_FIRST': 'Select filter condition first',
        'FILTER_EQUAL': 'Equal',
        'FILTER_LESS': 'Less than',
        'FILTER_MORE': 'More than',
        'FILTER_BETWEEN': 'Between',
        'FILTER_MATCH': 'Match exactly',
        'FILTER_SEARCH': 'Search like',
        'FILTER_MULTI_SELECT': 'Select multi options',
        'FILTER_SINGLE_SELECT': 'Select only one option',

        'NO_RECORDS_FOUND': 'No records',
        'SELECT_LANGUAGE': 'Select language',

        'VIEW_AS_TABLE': 'Table view',
        'VIEW_AS_GRID': 'Grid view',
        'DRAG_DROP_TO_REORDER': 'Drag and drop to re-order columns',
        'HIDE_COLUMNS': 'Hide columns',
    }
};
angular.module('reportTableDirective', [])
    .factory('translatorService', ['$interpolate', function($interpolate) {
        var currentLanguage = 'en';
        var dictionary = $.extend(true, {}, $dictionary);
        return {
            setCurrentLanguage: function(newCurrentLanguage) {
                currentLanguage = newCurrentLanguage;
            },
            getCurrentLanguage: function() {
                return currentLanguage;
            },
            translator: function(phraseKey, params) {
                if(params === null || $.isEmptyObject(params)) {
                    return dictionary[currentLanguage][phraseKey];
                } else {
                    return $interpolate(dictionary[currentLanguage][phraseKey])(params);
                }
            }
        };
    }])
    .filter('translator', ['translatorService', function(translatorService) {
        return function(phraseKey, params) {
            return translatorService.translator(phraseKey, params);
        };
    }])
    .directive('timestamp', function(){
        return {
            restrict: 'A',
            scope: {
                timestamp: '=', //timestamp attribute, a number.
            },
            link: function postLink(scope, element){
                var date = new Date(scope.timestamp*1000);
                element.text(('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear());
                element.removeAttr('timestamp');
            }
        };
    })
    .directive('shortenText', function(){
        return {
            restrict: 'A',
            scope: {
                shortenText: '=',
            },
            link: function postLink(scope, element){
                var text =  scope.shortenText;
                element.attr('title', text);
                element.text(text.substring(0,100)+'...');
                element.removeAttr('shorten-text');
            }
        };
    })
    .directive('reportTable', function () {
        return {

            templateUrl: $templateUrl,
            restrict: 'E',
            scope: {
                config: '=', // config object of this directive
            },
            controller: ['$scope','$http','$routeParams','$location','$window','$route','translatorService',function($scope, $http, $routeParams, $location, $window, $route, translatorService){
                //Config default objects
                $scope.reportTableId    =   $scope.$id;
                $scope.supportedLanguagesArray  = ['en'];
                $scope.supportedLanguages = [
                    {
                        slug: 'en',
                        label: 'English',
                    }
                ];
                if ($window.localStorage.lang && $scope.supportedLanguagesArray.indexOf($window.localStorage.lang) > -1) {
                    translatorService.setCurrentLanguage($window.localStorage.lang);
                    $scope.currentLanguage  = $window.localStorage.lang;
                }
                $scope.config.rowsPerPageOptions   = (angular.isArray($scope.config.rowsPerPageOptions))  ? $scope.config.rowsPerPageOptions   :   [5,15,30,40,50];
                $scope.config.maxPagesLoops        = ($scope.config.maxPagesLoops) ? parseInt($scope.config.maxPagesLoops) :   5;
                $scope.config.baseApiUrl           = ($scope.config.baseApiUrl) ? $scope.config.baseApiUrl   :   '';
                $scope.modeView = ($window.localStorage.modeview) ? $window.localStorage.modeview : 'table';
                $scope.errors   = [];
                //End Config default objects
                $scope.onReorderColsCompleted = function(dstIndex, srcObj, evt){
                    var dstObj = $scope.config.cols[dstIndex];
                    var srcIndex = $scope.config.cols.indexOf(srcObj);
                    $scope.config.cols[dstIndex] = srcObj;
                    $scope.config.cols[srcIndex] = dstObj;
                    var   $colsOrderList  = {};
                    $colsOrderList.fetchDataUrl   = $scope.checkAbsUrl($scope.config.apiRequestLink);
                    $colsOrderList.cols   = {};
                    for (var i = 0; i < $scope.config.cols.length; i++) {
                        $colsOrderList.cols[$scope.config.cols[i].model]  = i;
                    }
                    $window.localStorage.setItem('colsOrderList', JSON.stringify($colsOrderList));
                };
                $scope.setLanguage  = function($lang){
                    if ($scope.supportedLanguagesArray.indexOf($lang) > -1) {
                        translatorService.setCurrentLanguage($lang);
                        $scope.currentLanguage  = $lang;
                        $window.localStorage.setItem('lang', $lang);
                    }
                };
                $scope.setModeView  = function($mode){
                    $mode   = ($mode === 'grid') ? 'grid' : 'table';
                    $scope.modeView   = $mode;
                    $window.localStorage.setItem('modeview', $mode);
                };
                $scope.checkAbsUrl   = function($url){
                    var r   = new RegExp('^(?:[a-z]+:)?//', 'i');
                    if (r.test($url)) {
                        return $url;
                    } else{
                        return $scope.config.baseApiUrl + $url;
                    }
                };

                //End check the advance filter
                //Check the editForm with type == select
                $scope.initColsConfig   =   function(){
                    if ($window.localStorage.colsOrderList) {
                        try {
                            var $colsOrderList  = JSON.parse($window.localStorage.colsOrderList);
                            if ($colsOrderList.fetchDataUrl === $scope.checkAbsUrl($scope.config.apiRequestLink)) {
                                var $tempCols   = {};
                                for (var i = 0; i < $scope.config.cols.length; i++) {
                                    $tempCols[$scope.config.cols[i].model]  = $scope.config.cols[i];
                                }
                                angular.forEach($colsOrderList.cols, function(colIndex, colModel) {
                                    $scope.config.cols[colIndex]  = $tempCols[colModel];
                                });
                            }
                        }
                        catch(err) {
                            $window.localStorage.removeItem('colsOrderList');
                        }
                    }
                };
                $scope.allRowChecked = false;   //Variable true if all rows were checked.
                $scope.checkedRows  = [];       //An array stores ids of checked rows.
                /*
                 Pagination function
                 $totalRows: the totalRows of the table
                 $curPage: Current page display
                 $perPage: Number of rows displayed on a page
                 return the object of paging includes: Prev, pages, Next
                 */
                $scope.pagination =   function($totalRows, $curPage, $perPage){
                    var $maxPagesLoops   = $scope.config.maxPagesLoops;  // Display 5 pages on the screen.
                    var $totalPages  = Math.ceil($totalRows/$perPage); //Calculate the total pages
                    var $start      = (Math.ceil($curPage/$maxPagesLoops) - 1) * $maxPagesLoops + 1;
                    var $prev       = ($start > $maxPagesLoops) ? ($start - 1) : 0;
                    var $end;
                    if ($totalPages < $maxPagesLoops) {
                        $end  = $totalPages;
                    } else{
                        $end  = (($start + $maxPagesLoops - 1) > $totalPages) ? $totalPages : ($start + $maxPagesLoops - 1);
                    }
                    var $next   = ($end < $totalPages) ? ($end + 1) : 0;
                    var $paging = {};
                    $paging.first = 1;
                    $paging.prev  = $prev;
                    $paging.pages = [];
                    for (var i = $start; i < ($end + 1); i++) {
                        $paging.pages.push(i);
                    }
                    $paging.next  = $next;
                    $paging.current = $curPage;
                    $paging.last  = $totalPages;
                    return $paging; //The returned paging object.
                };
                /*
                 setOrder function
                 $orderBy: the row to be sorted by.
                 $order: ASC or DESC
                 result: Reload this page.
                 */
                $scope.setOrder   = function($orderBy, $order){
                    if ($scope.requestData.order.orderBy !== $orderBy || $scope.requestData.order.order !== $order) {
                        $location.search('orderBy', $orderBy);
                        $location.search('order', $order);
                        $location.search('page', 1);
                    } else {
                        return;
                    }
                };
                /*
                 setLimitLength function
                 $length: the rows per page: 10 20 50.
                 result: Reload this page.
                 */
                $scope.setLimitLength   = function($length){
                    $location.search('length', $length);
                    $location.search('page', 1);
                };
                /*
                 setPage function
                 $page: the page number to go.
                 result: Reload this page.
                 */
                $scope.setPage  =   function($page){
                    $location.search('page', $page);
                };
                /*
                 checkAllRow function
                 Checked all rows, and storing the ids into the array $scope.checkedRows.
                 */
                $scope.checkAllRow  = function(){
                    $scope.allRowChecked  = !$scope.allRowChecked;
                    if (!$scope.allRowChecked) {
                        for (var i = 0; i < $scope.rows.length; i++) {
                            $scope.rows[i].checked  = false;
                        }
                        $scope.checkedRows  = [];
                    } else{
                        $scope.checkedRows  = [];
                        for (var j = 0; j < $scope.rows.length; j++) {
                            $scope.rows[j].checked  = true;
                            $scope.checkedRows.push($scope.rows[j].id);
                        }
                    }
                };
                /*
                 checkOneRow function
                 $row: passing the row as param, so we can find it's id to push into the checkedRows array.
                 if all rows checked, the variable allRowChecked will be set to true.
                 result: Reload this page.
                 */
                $scope.checkOneRow  = function($row){
                    $row.checked  = !$row.checked;
                    if ($row.checked) {
                        $scope.checkedRows.push($row[$scope.config.rowIdModel]);
                    } else{
                        for (var i = 0; i < $scope.checkedRows.length; i++) {
                            if ($scope.checkedRows[i] === $row[$scope.config.rowIdModel]) {
                                $scope.checkedRows.splice(i, 1);
                                break;
                            }
                        }
                    }
                    if ($scope.checkedRows.length === $scope.rowsPerPage) {
                        $scope.allRowChecked  = true;
                    } else{
                        $scope.allRowChecked  = false;
                    }
                };

                $scope.fetchData  = function(){
                    $scope.showLoading();
                    $scope.rowsPerPage  =   ($routeParams.length) ? parseInt($routeParams.length) : $scope.config.rowsPerPageOptions[0];
                    $scope.rowsPerPage  =   ($scope.rowsPerPage < 1) ? $scope.config.rowsPerPageOptions[0] : $scope.rowsPerPage;
                    $scope.currentPage  =   ($routeParams.page) ? parseInt($routeParams.page) : 1;
                    $scope.currentPage  =   ($scope.currentPage < 1) ? 1 : $scope.currentPage;
                    $http({
                        url:      $scope.checkAbsUrl($scope.config.apiRequestLink),
                        method:   'POST',
                        data:     {},
                        headers:  { "content-type":"application/json", "api_key": "root"}
                    })
                    .success(function(results){
                        if (results.error) {
                            $scope.errors.push('500 Internal Server Error 1: '+results.message);
                        } else{

                            $scope.rows           =   results.results;
                            $scope.totalRows      =   results.total;
                            $scope.paging         =   $scope.pagination($scope.totalRows, $scope.currentPage, $scope.rowsPerPage);
                        }
                        $scope.hideLoading();
                    })
                    .error(function(results){
                        if (results.message) {
                            $scope.errors.push('500 Internal Server Error : '+results.message);
                        } else{
                            $scope.errors.push('500 Internal Server Error : ');
                        }
                        $scope.hideLoading();
                    });
                $window.scrollTo(0,0);
                };
                $scope.hideLoading  = function(){
                    $('.admin-table-loading-spinner').remove();
                };
                $scope.showLoading  = function(){
                    var $spinner   = angular.element("<div class='admin-table-loading-spinner'><div class='loading-spinner'></div></div>");
                    $('.admin-table-body-wrapper').append($spinner);
                };
                $scope.fetchData();
                $scope.initColsConfig();
            }],
        };
    });