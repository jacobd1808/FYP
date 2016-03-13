
var myApp = angular.module('myApp', ['onsen']);

myApp.controller('menuController', function($scope){
  $(function(){

  });
});

myApp.controller('calandarController', function($scope, $http){
	$scope.init = function(){
	  	$http({
		    method : "GET",
		    url : "api/races/junior",
	  	}).then(function mySucces(response) {
	       	$scope.race = response.data;
	    }, function myError(response) {
	      $scope.myWelcome = response.statusText;
	  	}); 
	};
	$scope.init();
});

ons.ready(function() {

	function init() { 
		setDefaultChamp()
	}
	// Set Default Champ (In Menu)
	function setDefaultChamp() {
		if (localStorage.getItem("activeChamp") === null) {
		  	var champ = 'junior';
		} else {
			var champ = localStorage.getItem("activeChamp");
		}
		$('#select-champ li[data-champ="'+champ+'"]').addClass('active');
	}
	// On Menu Open
	leftMenu.on("preopen", function() {
		$('#menu-icon, .onsen-sliding-menu__main').addClass('active');
	});
	// On Menu Close 
	leftMenu.on("preclose", function() {
		$('#menu-icon, .onsen-sliding-menu__main').removeClass('active');
	});
	// Show Championship Select Modal
	$( "body" ).on( "click", "#show-champ-modal", function() {
		setDefaultChamp();
	    myModal.show();
  	});
	// Close Championship Select Modal 
  	$( "body" ).on( "click", "#close-champ-modal", function() {
	    myModal.hide();
  	});

  	// Set Active Championship 
	$( "body" ).on( "click", "#select-champ li", function() {
	 	var champ = $(this).data('champ');
	 	if (typeof(Storage) !== "undefined") {
    		localStorage.setItem("activeChamp", champ);
    		$('#select-champ li').removeClass('active');
    		$(this).addClass('active');
		} else {
	 		ons.notification.alert({
			  message: 'Your device isn\'t compatibe with this app',
			  title: 'Error',
			  buttonLabel: 'OK',
			  animation: 'default',
			  callback: function() {
			    myModal.hide();
			  }
			});
		}
	});
	// Initialise Everything
	init()
});