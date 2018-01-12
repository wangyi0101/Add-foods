'use strict';

describe('myApp.view1 module', function () {

    beforeEach(module('myApp.view1'));

    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('view1 controller', function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller('View1Ctrl', { $scope: $scope });
        });

        it('should set local storage', function () {
            var store = {};
            spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
                store[key] = value;
            });
            $scope.setLocalStorage('foods', ['other, water']);
            expect(localStorage.setItem).toHaveBeenCalled();
            expect(store['foods']).toEqual('["other, water"]');
        });

        it('should get local storage if value is not null', function () {
            var store = {
                'foods': '["Other, water"]'
            };
            spyOn(localStorage, 'getItem').and.callFake(function (key) {
                return store[key];
            });
            var result = $scope.getLocalStorage('foods');
            expect(result).toEqual(['Other, water']);
        });

        it('should get local storage as null if there is no storage', function () {
            var store = {
                'foods': null
            };
            spyOn(localStorage, 'getItem').and.callFake(function (key) {
                return store[key];
            });
            var result = $scope.getLocalStorage('foods');
            expect(result).toEqual(null);
        });

        it('should set initial foods when there is no value at local storage', function() {
            spyOn($scope, 'getLocalStorage').and.returnValue(null);
            spyOn($scope, 'setLocalStorage');
            $scope.initFoodList();
            expect($scope.setLocalStorage).toHaveBeenCalled();
        });

        it('should set initial foods when where are values at local storage', function () {
            $scope.foods = ['Other'];
            spyOn($scope, 'getLocalStorage').and.returnValue(['Water', 'Other']);
            $scope.initFoodList();
            expect($scope.foods).toEqual(['Water', 'Other']);
        });


        it('should display drop down list when button clicked', function () {
            $scope.hideFoodsList = true;
            $scope.clickHandler();
            expect($scope.hideFoodsList).toEqual(false);
        });

        it('should display the food name if user selected a food option', function () {
            var element = 'Orange';
            $scope.changeHandler(element);
            expect($scope.selectedFood).toEqual(element);
        });

        it('should hide drop down list and input field if user selected a food option', function () {
            var element = 'Orange';
            $scope.changeHandler(element);
            expect($scope.hideFoodInput).toEqual(true);
            expect($scope.hideFoodsList).toEqual(true);
        });

        it('should display input filed and hide drop down list if user selected other option', function () {
            var element = 'Other';
            $scope.changeHandler(element);
            expect($scope.hideFoodInput).toEqual(false);
            expect($scope.hideFoodsList).toEqual(true);
        });

        it('should update food if user enter some inpute', function () {
            $scope.newFood = 'Milk';
            $scope.foods = ['Other'];
            $scope.updateFood();
            expect($scope.foods).toEqual(['Milk', 'Other']);
            expect($scope.selectedFood).toEqual('Milk');
        });
    });
});