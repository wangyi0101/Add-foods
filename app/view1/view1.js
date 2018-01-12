'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', function ($scope) {
        var DEFAULT = 'Other';  //@const
        var FOOD_STORAGE_KEY = 'foods'; //@const
        $scope.hideFoodsList = true;
        $scope.hideFoodInput = true;
        $scope.newFood = '';
        $scope.selectedFood = '';
        $scope.foods = [DEFAULT];

        $scope.setLocalStorage = function(key, value) {
            var valueStr = JSON.stringify(value);
            localStorage.setItem(key, valueStr);
        };

        $scope.getLocalStorage = function(key) {
            var value = localStorage.getItem(key);
            return value === null ? null : JSON.parse(value);
        };

        $scope.initFoodList = function () {
            if (storageAvailable('localStorage')) {
                var foods = $scope.getLocalStorage(FOOD_STORAGE_KEY);
                if (foods === null) {
                    $scope.setLocalStorage(FOOD_STORAGE_KEY, $scope.foods);
                }
                if (foods !== DEFAULT) {
                    $scope.foods = $scope.getLocalStorage(FOOD_STORAGE_KEY);
                } else {
                    $scope.hideFoodInput = false;
                }
            }
        };

        $scope.initFoodList();

        $scope.clickHandler = function () {
            $scope.hideFoodsList = !$scope.hideFoodsList;
        };

        $scope.changeHandler = function (element) {
            $scope.selectedFood = element;
            $scope.hideFoodInput = element !== DEFAULT;
            $scope.hideFoodsList = true;
        };

        $scope.updateFood = function () {
            if ($scope.newFood !== '') {
                $scope.foods.unshift($scope.newFood);
                if (storageAvailable('localStorage')) {
                    $scope.setLocalStorage(FOOD_STORAGE_KEY, $scope.foods);
                }
                $scope.selectedFood = $scope.newFood;
            }
            $scope.newFood = '';
        };

        function storageAvailable(type) {
            try {
                var storage = window[type],
                    x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            catch (e) {
                return e instanceof DOMException && (
                        // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                    // acknowledge QuotaExceededError only if there's something already stored
                    storage.length !== 0;
            }
        }
    }]);