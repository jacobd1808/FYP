
/*				*/ 
/* ANGULAR CODE */ 
/* 				*/ 

var myApp = angular.module('myApp', ['onsen']);

/*
myApp.controller('calandarController', function($scope, $http){
	$scope.init = function(){
		var champ = localStorage.getItem("activeChamp");
	  	$http({
		    method : "GET",
		    url : "api/races/"+champ,
	  	}).then(function mySucces(response) {
	       	$scope.race = response.data;
	    }, function myError(response) {
	      $scope.myWelcome = response.statusText;
	  	}); 


	};

	$scope.changeChamp = function() { 
		$scope.init();
		console.log('hasChnages');
		myModal.hide();
	};

	$scope.init();

}); */



/* 					*/ 
/*		JQuery 		*/
/*					*/ 


ons.ready(function() {


	/* =======================
		Init
	======================== */

	function init() {
		setDeviceID();

		localStorage.setItem("activePage", 'home');

		setTimeout(function(){
			setChampIconColour();
			setDefaultChamp();
		}, 200);

		loadDrivers()
	}

	/* =======================
		Navigation
	======================== */

	$( "body" ).on( "click", ".loadLink, #backBtn, ons-tab", function() {
		var page = $(this).attr('data-page');
		var tab = $(this).attr('data-tab');
		localStorage.setItem("activePage", page);
	    loadPageContent(page, tab)
  	});

  	function loadPageContent(page, tab) { 
  		if(page == 'local') { page = localStorage.getItem("activePage"); } 
		setTimeout(function(){
			switch (page) { 
			    case 'calandar':
			        loadCalandar();
			        break;
			    case 'circuits':
			        loadCircuits(tab);
			        break;
			    case 'news':
			        loadNews(tab);
			        break;
			    case 'news_article':
			        loadNewsArticle(tab);
			        break;
			    case 'drivers':
			        loadDrivers();
			        break;
			 	case 'driver_profile':
			        loadDriverPage(tab);
			        break;
			 	case 'driver_bio':
			        loadDriverBio(tab);
			        break;
			 	case 'driver_news':
			        loadDriverNews(tab);
			        break;
			    case 'teams':
			        loadTeams();
			        break; 
			}
			setChampIconColour();
			setDefaultChamp();
			}, 200);
	}

	/* =======================
		Helper Functions 
	======================== */

	function fetchChampColour(champ) { 
	switch (champ) {
	    case 'junior':
	        colour = "#7ac943";
	        break;
	    case 'challenge':
	        colour = "#c1272d";
	        break;
	    case 'supercup':
	        colour = "#3fa9f5";
	        break;
	    case 'grdc':
	        colour = "#f7931e";
	        break;
	    case 'grdcplus':
	        colour = "#f15a24";
	        break;
	    case 'g57':
	        colour = "#4F407A";
	        break;
	    case 'global':
	        colour = "#999";
	        break;
	    }
	    return colour; 
	}

	function makeUniqueid(length) {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < length; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	}

	$('body').on("click", '.no-parent-event', function(event){
		//event.stopImmediatePropagation(); 
		event.stopPropagation();
	});

	Handlebars.registerHelper('formatDate', function(date) {
  		return new moment(date).format('D MMM, YYYY');
	});

	/* ======================================================
		Set and Return Device ID (For storing Favourites)
	======================================================= */

	function setDeviceID() { 
		if (typeof(Storage) !== "undefined") {
    		if(localStorage.getItem("device_id") === null)  { 
    			var deviceID = makeUniqueid(5); 
    			localStorage.setItem("device_id", deviceID);
    		} else { 
    			console.log(getDeviceID());
    		}
		} else {
			ons.notification.alert({
			  message: 'Unfortunetly your device does not support been able to favourite items but you should be able to use other areas of the app without a problem',
			  title: 'Error',
			  buttonLabel: 'OK',
			  animation: 'default',
			  callback: function() {
			    myModal.hide();
			  }
			});
		}
	}

	function getDeviceID(){ 
		var deviceID = localStorage.getItem("device_id"); 
		return deviceID; 
	}

	/* =======================
		Main Menu 
	======================== */

	// On Menu Open
	leftMenu.on("preopen", function() {
		$('#menu-icon, .onsen-sliding-menu__main').addClass('active');
	});
	// On Menu Close 
	leftMenu.on("preclose", function() {
		$('#menu-icon, .onsen-sliding-menu__main').removeClass('active');
	});


	/* =======================
		Championship Menu 
	======================== */ 

	// Show Championship Select Modal
	$( "body" ).on( "click", "#show-champ-modal", function() {
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
    		localStorage.setItem("newsFilter", champ);
    		$('#select-champ li').removeClass('active');
    		$(this).addClass('active');
    		setChampIconColour();
			loadPageContent('local');
    		myModal.hide();
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

	// Set Trophy Icon Colour 
	function setChampIconColour() {
		var champ = localStorage.getItem("activeChamp");
		$('#champ-icon').css({color: fetchChampColour(champ)});

		var filter = localStorage.getItem("newsFilter");
		$('#filter-icon').css({color: fetchChampColour(filter)});
	}


	// Set Default Champ (In Menu)
	function setDefaultChamp() { 
		// Set Default Champ 
		if (localStorage.getItem("activeChamp") === null) {
		  	var champ = 'junior';
		  	localStorage.setItem("activeChamp", champ);
		} else {
			var champ = localStorage.getItem("activeChamp");
		}
		// Set Default Filter 
		if (localStorage.getItem("newsFilter") === null) {
		  	var filter = 'junior';
		  	localStorage.setItem("newsFilter", filter);
		} else {
			var filter = localStorage.getItem("newsFilter");
		}
		$('#select-champ li[data-champ="'+champ+'"]').addClass('active');
		$('#news-filter li[data-filter="'+filter+'"]').addClass('active');
	}


	/* =======================
		Save To Favourites 
	======================== */

	$( "body" ).on( "click", ".save-to-fav", function() {
		var el = $(this);
		saveToFavourites(el);
	});

	function saveToFavourites(el) { 

		var action = 'addFav';
		var type = el.data('type');
		var itemID = el.data('item-id');
		var userID = getDeviceID();
		// Defined action 
		if (el.hasClass('fav-active')) { 
			action = 'deleteFav';
		}

		$.ajax({
			context: this,
			method: 'POST', 
			url : "api/"+action, 
			data: favToJSON(type, itemID, userID),
			dataType: 'json',
			success: function(data) {
				if(action == 'deleteFav') {
					el.removeClass('fav-active');
					el.html('<i class="fa fa-star-o"></i>');
				} else { 
					el.addClass('fav-active');
					el.html('<i class="fa fa-star"></i>');
				}
			}
		});
	}

	function favToJSON(type, itemID, userID) {
	    return JSON.stringify({
	        "type": type,
	      	"itemID": itemID,
	      	"userID": userID, 
	    });
	}

	function checkFav() { 
		$( ".fav-icn" ).each(function( index ) {
			var type = $(this).data('type');
			var itemID = $(this).data('item-id');
			var userID = getDeviceID();
			$.ajax({
				context: this,
				method: 'GET', 
				url : "api/getFav/"+ type +"/"+ itemID +"/"+ userID, 
				dataType: 'json',
				success: function(data) {
					if (data) { 
						$(this).addClass('fav-active'); 
						$(this).html('<i class="fa fa-star"></i>');
					}
				}
			});
		}); 
	}

	/* =======================
		Page Specific 
	======================== */

		/* =======================
			Race Calandar 
		======================== */

		function loadCalandar() { 
			var champ = localStorage.getItem("activeChamp");
			$.ajax({
				method: 'GET', 
				url : "api/races/"+champ,
				dataType: 'json',
				success: function(data) {
					$('#calandar-container').empty();
					$.each($(data), function(key, value) {
					    var source   = $("#calandar-template").html();
						var template = Handlebars.compile(source);
						$('#calandar-container').append(template(data[key]));
					});
					checkFav();
				},
				error: function() { 
					console.log('error loading data');
				}
			});
		}

		function loadCircuits(id) { 
			var champ = localStorage.getItem("activeChamp")
			$.ajax({
				method: 'GET', 
				url : "api/races/"+champ,
				dataType: 'json',
				success: function(data) {
					$('#circuit-container').empty();
					$.each($(data), function(key, value) {
					    var source   = $("#circuit-template").html();
						var template = Handlebars.compile(source);
						$('#circuit-container').append(template(data[key]));
					});
					var carouselIndex = $('ons-carousel-item').index($('ons-carousel-item[data-id="'+id+'"]'));

					circuitContainer.setActiveCarouselItemIndex(carouselIndex);
					circuitContainer.refresh();
				},
				error: function() { 
					console.log('error loading data');
				}
			});
		}

		/* =======================
			News
		======================== */

		function loadNews(filter) { 
			filter = localStorage.getItem("newsFilter");
			$.ajax({
				method: 'GET', 
				url : "api/news/"+filter,
				dataType: 'json',
				success: function(data) {
					$('#news-container').empty();
					$.each($(data), function(key, value) {
					    var source   = $("#news-template").html();
						var template = Handlebars.compile(source);
						$('#news-container').append(template(data[key]));
					});
					checkFav();
				},
				error: function() { 
					console.log('error loading data');
				}
			});
		}

		function loadNewsArticle(id) { 
			$.ajax({
				method: 'GET', 
				url : "api/newsArticle/"+id,
				dataType: 'json',
				success: function(data) {
					$('#news-article-container').empty();
				    var source   = $("#news-article-template").html();
					var template = Handlebars.compile(source);
					$('#news-article-container').append(template(data));
				},
				error: function() { 
					console.log('error loading data');
				}
			});
		}

		// News Filter 
		$( "body" ).on( "click", "#news-filter li", function() {
		 	var filter = $(this).data('filter');
			localStorage.setItem("newsFilter", filter);
    		$('#news-filter li').removeClass('active');
    		$(this).addClass('active');

	    	setChampIconColour();

			loadPageContent('local', filter);
	    	myModal.hide();
		});

		/* =======================
			Drivers
		======================== */

		function loadDrivers() { 
			var champ = localStorage.getItem("activeChamp");
			$.ajax({
				method: 'GET', 
				url : "api/drivers/"+champ,
				dataType: 'json',
				success: function(data) {
					$('#drivers-container').empty();
					$.each($(data), function(key, value) {
					    var source   = $("#drivers-template").html();
						var template = Handlebars.compile(source);
						$('#drivers-container').append(template(data[key]));
					});
					checkFav();
				},
				error: function() { 
					console.log('error loading data');
				}
			});
		}

		function loadDriverPage(id) { 
			$.ajax({
				method: 'GET', 
				url : "api/driverInfo/"+id,
				dataType: 'json',
				success: function(data) {
					setTimeout(function(){
						$('#page-title').html(data.driver_fname+' '+data.driver_sname);
						$('#driver-fav-icon').data('item-id', data.driver_id);
						$('#tab-list ons-tab').attr('data-tab', data.driver_id);
						checkFav();
					}, 300);
				},
				error: function() { 
					console.log('error loading data');
				}
			});
		}

		function loadDriverBio(id) {
			$.ajax({
				method: 'GET', 
				url : "api/driverInfo/"+id,
				dataType: 'json',
				success: function(data) {
					$('#drivers-bio').empty();
				    var source   = $("#drivers-bio-template").html();
					var template = Handlebars.compile(source);
					$('#drivers-bio').append(template(data));
				},
				error: function() { 
					console.log('error loading data');
				}
			});
		}

		function loadDriverNews(id) {
			var driverName = $('#page-title').html(); 
			$.ajax({
				method: 'GET', 
				url : "api/driverNews/"+driverName,
				dataType: 'json',
				success: function(data) {
					$('#drivers-news-container').empty();
					if (data) { 
						$.each($(data), function(key, value) {
							console.log(data);
						    var source   = $("#drivers-news-template").html();
							var template = Handlebars.compile(source);
							$('#drivers-news-container').append(template(data[key]));
						});
					} else { 
						$('#drivers-news-container').html('<div class="no-info"> No News for this Driver</div>');
					}
				},
				error: function() { 
					console.log('error loading data');
				}
			});
		}

		/* =======================
			Teams
		======================== */

		function loadTeams() { 
			var champ = localStorage.getItem("activeChamp");
			$.ajax({
				method: 'GET', 
				url : "api/teams",
				dataType: 'json',
				success: function(data) {
					$('#teams-container').empty();
					$.each($(data), function(key, value) {
					    var source   = $("#teams-template").html();
						var template = Handlebars.compile(source);
						$('#teams-container').append(template(data[key]));
					});
					checkFav();
				},
				error: function() { 
					console.log('error loading data');
				}
			});
		}

	/* =======================
		Init 
	======================== */

	init();

});

