/**
 * Created by mike.mayori on 3/24/16.
 */
'use strict';
/**
 * # jsoneditorDirective
 */
var $jsoneditorTemplateUrl 	=	'app/views/viewJsonEditor.html';
var indexOf = function(needle) {
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                if(this[i] === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle);
};
angular.module('jsoneditorDirective', ['ui.sortable'])
    .directive('jsoneditorInputNumberValidator', function ($parse) {
        return {
            link: function (scope, elm, attrs) {
                elm.bind('keypress', function(e){
                    var char = String.fromCharCode(e.which||e.charCode||e.keyCode);
                    if (isNaN(parseInt(char))) {
                        e.preventDefault();
                        return false;
                    }
                    return;
                });
            }
        }
    })
    .directive('jsoneditor', function (store) {
        return {
            templateUrl: $jsoneditorTemplateUrl,
            restrict: 'E',
            scope: {
                ngModel: '=',
                jsonSubmitConfig: '=',
                viewOnly: '=',
            },
            require: 'ngModel',
            controller: ['$scope', '$http', '$window', '$compile','$element', '$timeout', function($scope, $http, $window, $compile, $element, $timeout){
                try {
                    $scope.json 	=	JSON.parse($scope.ngModel);
                    var $tempJson	=	JSON.stringify($scope.json);
                    var $jsonRoot 	=	JSON.stringify($scope.json);
                    $scope.booleanArrays	=	[true, false];
                    $scope.steps 	=	[];
                    $scope.showLoadingText	=	false;
                    $scope.showSavingText 	=	false;
                    $scope.currentStep 	=	0;
                    $scope.hiddenElements 	=	[];
                    $scope.tempValElements 	=	[];
                    $scope.openedModalEditor 	=	false;
                    $scope.openedModalViewer	=	false;
                    $scope.newKeyRoot	=	0;
                    $scope.newKeyNormal	=	0;
                    $scope.savedFirstTime 	=	0;
                    if ($scope.jsonSubmitConfig) {
                        $scope.submitJson 	=	function(){
                            $scope.ngModel 	=	JSON.stringify($scope.json);
                            store.set('JSON', $scope.ngModel);
                            $scope.clearSteps();
                            $scope.closeModalEditor();
                            //$scope.jsonSubmitConfig.data[$scope.jsonSubmitConfig.model]	= 	$scope.ngModel;
                            //
                            //$scope.jsonHttpConfig 	=	{
                            //    url:    $scope.jsonSubmitConfig.url,
                            //    method:   $scope.jsonSubmitConfig.method,
                            //    headers:  {'Content-Type': 'application/x-www-form-urlencoded'}
                            //};
                            //if ($scope.jsonSubmitConfig.method === 'GET') {
                            //    $scope.jsonHttpConfig.params 	=	$scope.jsonSubmitConfig.data;
                            //} else {
                            //    $scope.jsonHttpConfig.data 	=	$.param($scope.jsonSubmitConfig.data);
                            //}
                            //$http($scope.jsonHttpConfig)
                            //    .success(function(results){
                            //        $scope.clearSteps();
                            //        $scope.closeModalEditor();
                            //    })
                            //    .error(function(){
                            //        $scope.showErrorText = true;
                            //    });
                        };
                    }

                    $scope.quitError 	=	function(){
                        $scope.reRenderTemplate();
                        $scope.showErrorText 	=	false;
                    };

                    $scope.openModalViewer 	=	function(){
                        $scope.openedModalViewer	=	true;
                    };

                    $scope.closeModalViewer 	=	function(){
                        $scope.openedModalViewer	=	false;
                    };

                    $scope.openModalEditor 	=	function(){
                        $scope.openedModalEditor	=	true;
                    };

                    $scope.closeModalEditor 	=	function(){
                        $scope.showSavingText	=	false;
                        $scope.showErrorText 	=	false;
                        $scope.openedModalEditor	=	false;
                    };

                    $scope.isObjectAndArray = 	function($var){
                        return (angular.isObject($var) || angular.isArray($var));
                    };

                    $scope.saveStep 	=	function(){
                        $scope.showSavingText 	=	true;
                        $timeout(function() {
                            if (!$scope.savedFirstTime) {
                                $tempJson 	=	$jsonRoot;
                                $scope.savedFirstTime 	=	1;
                            }
                            $scope.steps[$scope.currentStep]	=	$tempJson;
                            $scope.currentStep++;
                            if ($scope.currentStep < $scope.steps.length) {
                                $scope.steps.splice($scope.currentStep, $scope.steps.length-$scope.currentStep);
                            }
                            $tempJson 	=	JSON.stringify($scope.json);
                            $scope.showSavingText	=	false;
                        }, 200);
                    };

                    $scope.clearSteps 	=	function(){
                        $scope.steps 	=	[];
                        $scope.currentStep 	=	0;
                        $scope.savedFirstTime 	=	0;
                    };

                    $scope.saveJson 	=	function(){
                        $scope.ngModel 	=	JSON.stringify($scope.json);
                        $scope.clearSteps();
                        $scope.closeModalEditor();
                    };

                    $scope.reRenderTemplate 	=	function(){
                        $scope.showLoadingText 	=	true;
                        $scope.hiddenElements 	=	[];
                        $scope.tempValElements 		=	[];
                        $http.get($jsoneditorTemplateUrl)
                            .then(function(response){
                                $element.html($compile(response.data)($scope));
                                $scope.openedModalEditor 	=	true;
                                $timeout(function() {
                                    $scope.showLoadingText	=	false;
                                }, 200);
                            });
                    };

                    $scope.stepBack 	=	function(){
                        $scope.steps[$scope.currentStep] = JSON.stringify($scope.json);
                        $scope.currentStep--;
                        angular.copy(JSON.parse($scope.steps[$scope.currentStep]), $scope.json);
                        $scope.reRenderTemplate();
                    };

                    $scope.stepNext 	=	function(){
                        $scope.currentStep++;
                        angular.copy(JSON.parse($scope.steps[$scope.currentStep]), $scope.json);
                        $scope.reRenderTemplate();

                    };

                    $scope.getType 	=	function($var) {
                        if ($var === null) {
                            return 'Null';
                        }
                        switch (typeof $var) {
                            case 'undefined': return 'Undefined';
                            case 'boolean'  : return 'Boolean';
                            case 'number'   : return 'Number';
                            case 'string'   : return 'String';
                            default         : return angular.isArray($var) ? 'Array' : 'Object';
                        }
                    };

                    $scope.getLength 	=	function($var){
                        var length = 0;
                        if (angular.isArray($var)) {
                            for (var i = 0; i < $var.length; i++) {
                                if (typeof $var[i] !== undefined) {
                                    length++;
                                }
                            }
                        } else{
                            var key;
                            for (key in $var) {
                                if ($var.hasOwnProperty(key)) {
                                    length++;
                                }
                            }
                        }
                        return length;
                    };

                    $scope.getClassTextColor =	function($var){
                        if ($var === null) {
                            return 'jsoneditor-text-null';
                        }
                        switch (typeof $var) {
                            case 'undefined': return 'jsoneditor-text-undefined';
                            case 'boolean'  : return 'jsoneditor-text-boolean';
                            case 'number'   : return 'jsoneditor-text-number';
                            case 'string'   : return 'jsoneditor-text-string';
                            default         : return angular.isArray($var) ? 'jsoneditor-text-array' : 'jsoneditor-text-object';
                        }
                    };

                    $scope.changeObjectKey 	=	function($objectParent, $oldKey, $newKey){
                        $tempJson	=	JSON.stringify($scope.json);
                        if ($oldKey !== $newKey) {
                            if (typeof $objectParent[$newKey] !== 'undefined') {
                                $window.alert('This object has already property ' + $newKey);
                                $scope.reRenderTemplate();
                                return;
                            }
                            $objectParent[$newKey] = $objectParent[$oldKey];
                            delete $objectParent[$oldKey];
                            $scope.reRenderTemplate();
                            return;
                        }
                        return;
                    };

                    $scope.changeFieldType 	=	function($parent, $key, $newType){
                        $tempJson	=	JSON.stringify($scope.json);
                        switch ($newType) {
                            case 'Number':
                                $parent[$key] = 0;
                                break;
                            case 'Boolean'  :
                                $parent[$key] = true;
                                break;
                            case 'String'   :
                                $parent[$key] = 'a string';
                                break;
                            default         :
                                $parent[$key] = null;
                                break;
                        }
                        return;
                    };

                    $scope.deleteField 	=	function($parent, $key){
                        $tempJson	=	JSON.stringify($scope.json);
                        if ($window.confirm('Are you sure want to delete this field?')){
                            if (angular.isArray($parent)) {
                                $key 	=	parseInt($key);
                                $parent.splice($key, 1);
                                return;
                            }
                            if (angular.isObject($parent)) {
                                delete $parent[$key];
                                return;
                            }
                        }
                    };

                    $scope.addField 	=	function($parent, $key, $type, $elementIndex){
                        $tempJson	=	JSON.stringify($scope.json);
                        if (angular.isArray($parent[$key])) {
                            switch ($type) {
                                case 'Number':
                                    $parent[$key].push(0);
                                    break;
                                case 'Boolean'  :
                                    $parent[$key].push(true);
                                    break;
                                case 'String'   :
                                    $parent[$key].push('a string');
                                    break;
                                case 'Array'   :
                                    $parent[$key].push([]);
                                    break;
                                case 'Object' 	:
                                    $parent[$key].push({});
                                    break;
                                default         :
                                    $parent[$key].push(null);
                                    break;
                            }
                            $scope.reRenderTemplate();
                            return;
                        }
                        if (angular.isObject($parent[$key])) {
                            var $newKey 	=	'new' + $type + $scope.newKeyNormal;
                            $scope.newKeyNormal++;
                            switch ($type) {
                                case 'Number':
                                    $parent[$key][$newKey]	=	0;
                                    break;
                                case 'Boolean'  :
                                    $parent[$key][$newKey]	=	true;
                                    break;
                                case 'String'   :
                                    $parent[$key][$newKey]	=	'a string';
                                    break;
                                case 'Array'   :
                                    $parent[$key][$newKey]	=	[];
                                    break;
                                case 'Object' 	:
                                    $parent[$key][$newKey]	=	{};
                                    break;
                                default         :
                                    $parent[$key][$newKey]	=	null;
                                    break;
                            }
                            $scope.reRenderTemplate();
                            return;
                        }
                    };
                    $scope.addFieldToRoot 	=	function($type){
                        $tempJson	=	JSON.stringify($scope.json);
                        if (angular.isArray($scope.json)) {
                            switch ($type) {
                                case 'Number':
                                    $scope.json.push(0);
                                    break;
                                case 'Boolean'  :
                                    $scope.json.push(true);
                                    break;
                                case 'String'   :
                                    $scope.json.push('a string');
                                    break;
                                case 'Array'   :
                                    $scope.json.push([]);
                                    break;
                                case 'Object' 	:
                                    $scope.json.push({});
                                    break;
                                default         :
                                    $scope.json.push(null);
                                    break;
                            }
                            $scope.reRenderTemplate();
                            return;
                        }
                        if (angular.isObject($scope.json)) {
                            var $newKey 	=	'_new'	+	$type 	+	$scope.newKeyRoot;
                            $scope.newKeyRoot++;
                            switch ($type) {
                                case 'Number':
                                    $scope.json[$newKey]	=	0;
                                    break;
                                case 'Boolean'  :
                                    $scope.json[$newKey]	=	true;
                                    break;
                                case 'String'   :
                                    $scope.json[$newKey]	=	'a string';
                                    break;
                                case 'Array'   :
                                    $scope.json[$newKey]	=	[];
                                    break;
                                case 'Object' 	:
                                    $scope.json[$newKey]	=	{};
                                    break;
                                default         :
                                    $scope.json[$newKey]	=	null;
                                    break;
                            }
                            $scope.reRenderTemplate();
                            return;
                        }
                    };
                    $scope.getElementIndex 	=	function($val){
                        if (typeof($val) === 'undefined') {
                            $scope.tempValElements.push(false);
                        } else{
                            $scope.tempValElements.push($val);
                        }
                        $scope.hiddenElements.push(false);
                        return $scope.hiddenElements.length - 1;
                    };

                    $scope.sortableConfig = {
                        axis: 'y',
                        placeholder: 'jsoneditor-table-sortable-placeholder',
                        update: function(e, ui){
                            $tempJson	=	JSON.stringify($scope.json);
                            $scope.reRenderTemplate();
                        },
                    };
                }
                catch(err) {
                    $scope.jsonError 	=	1;
                    return;
                }
            }],
        };
    });
