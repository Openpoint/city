"use strict";
/**
 * @module map
 * @chapter client
 * */
 
/**
 * The outside master scope of the map module
 * 
 * @ngdoc controller
 * @name main
 * */
controller.main=function($scope,$mdSidenav,$city,$timeout,$window,$map){

	/**
	 * The controller scope
	 * 
	 * @namespace module:client/map~main.$scope
	 * */
	
	//angular.extend($scope,$city);
	//$scope.extend(this,'main');
	
	/**
	 * @namespace module:client/map~main.$scope.g
	 * */	
	$scope.g={}; //set up a global with prototypical inheritance - values
	$scope.f={}; //set up a global with prototypical inheritance - functions
	$scope.s={}; //set up a global with prototypical inheritance - styles

	//set the map
	Map.map = $map.make();

	$scope.g.boogaloo='new';
	
	
	//get the window dimensions and update on resize, set the size of the panels
	$scope.g.sidepanelwidth=300;
	$scope.f.wsize=function(){
		$timeout(function(){
			$scope.g.width=$window.innerWidth;
			$scope.g.height=$window.innerHeight;
			$scope.s.sidepanel={'width':$scope.g.sidepanelwidth+'px','height':$scope.g.height+'px'};
			$scope.s.mapview={'width':($scope.g.width-$scope.g.sidepanelwidth)+'px','height':$scope.g.height+'px'};
			
		});
		$timeout(function(){
			Map.map.updateSize();
		})
	}
	$scope.f.wsize();
	var w = angular.element($window);
	w.bind('resize', function () {
		$scope.f.wsize();
	});	
}
/**
 * A test controller
 * 
 * @ngdoc controller
 * @name test
 * @param {object} $city - injects core city functions
 * */
controller.test=function($scope,$city,$tabs,$timeout){

	new $city.extend('test',$scope);
	
	$scope.test=function(foo,foo2){
		console.log('test');
		console.log(foo+foo2);
	}
	
	$scope.tabsAdd('test',[
		{
			val:'on',
			order:10,
			fnc:['test',['p1','p2']]
		},
		{
			val:'+',
			order:20,
			fnc:['tabsAdd',['test',[{
				val:'add',
				fnc:['g.boogaloo','boo']
			}]]]
		},
		{
			val:'toot',
			order:30,
			fnc:['toot','tooted']
		}
	]);
	
}


City.controller('main',['$scope','$mdSidenav','$city','$timeout','$window','$map',controller.main])
.controller('sidebar',function($scope,$city,$timeout,$crud,$parse,$window){
	$timeout(function(){
		$scope.$broadcast('rebuild:me');		
	});
	var w = angular.element($window);
	w.bind('resize', function () {
		$scope.$broadcast('rebuild:me');
	});
	console.log($window);
	$scope.crud=$crud;
	
	socket.on('json',function(data){
		console.log(data);
		$scope.g.features = new ol.format.GeoJSON().readFeatures(data, {
			featureProjection: 'EPSG:3857'
		});
		$scope.g.vectorSource = new ol.source.Vector({
			features: $scope.g.features
		});	
		$scope.g.layer=new ol.layer.Vector({
			title: 'added Layer',
			source: $scope.g.vectorSource
		})
		$scope.g.map.addLayer($scope.g.layer);
		
	})
	socket.on('feature',function(data){
		//console.log(data);
		var feature=new ol.format.GeoJSON().readFeature(data);
		//console.log(feature);
		$scope.g.vectorSource.addFeature(feature);
	})
	/*
	$scope.test=function(x,y){
		alert(x+' '+y);
	}
	* */
	//$city.extend('sidebar',['$scope'],[$scope]);
	
	
}).controller('test2',function($scope,$city,$tabs){
	/*
	$city.extend('test2',[$scope,$tabs],function($scope,$tabs){
		
		$tabs.add('test2',[
			{
				val:'a',
				order:10,
				fnc:['test',['p1','p2']]
			},
			{
				val:'+b',
				order:20,
				fnc:['tabs.add',['test2',[{
					val:'add'
				}]]]
			},
			{
				val:'c',
				order:30
			}
		]);		
	});
	* */
	
	
}).controller('test',controller.test)


