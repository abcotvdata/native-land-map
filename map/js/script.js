/* script.js 
   Author:
   Date:
*/


$(document).ready(function(){ // begin document.ready block

	// build blank map

		var map = L.map('map', {minZoom: 3}).setView([50.8513826,-118.2170459], 3);
		// var pane = map.createPane('fixedbg', document.getElementById('map'));
		var pane = map.createPane('fixed', document.getElementById('map'));
		var pane = map.createPane('bgfixed', document.getElementById('map'));

		map.getPane('bgfixed').style.zIndex = 300;

		//background layer
		var imageUrl = 'img/Background.png',
		imageBounds = [[30, -112], [37, -125]];
		L.imageOverlay(imageUrl, imageBounds, {pane: 'bgfixed'}).addTo(map).setOpacity(1);


		//tile layer
		L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			subdomains: 'abcd',
			opacity: 0.25,
			pane: 'overlayPane',
			ext: 'png'
		}).addTo(map);

		


		map.createPane("polygonsPane");
		map.createPane("polygonsColor");

	

	$("#submit").on("click", function(){
		var zipval = $("#zip").val()

		zipvallength = zipval.length
		// console.log(zipvallength)

		if (zipvallength<5) {

			$(".tryagain").fadeIn()

			$("#oktryagain").click(function(){
				$(".tryagain").fadeOut()
			});

		} else {

			var geocodeURL = "https://nominatim.openstreetmap.org/search?country=united+states&postalcode="+zipval+"&format=json"

			console.log(geocodeURL)

			 // var geocodeURL = "https://nominatim.openstreetmap.org/search?q=410+myrtle+street+apt+3+glendale+california+united+states+91203&format=json"

			$.getJSON( geocodeURL, function( geocode ) {

				//get lat long from nominatim open street map api json

				console.log(geocode)
				console.log(geocode.length)

				if (geocode.length == 0) {

					$(".tryagain").fadeIn()

					$("#oktryagain").click(function(){
						$(".tryagain").fadeOut()
					});

				} else {

					$(".overlay").fadeOut()
					$(".maptitle").append('<button class="button" id="startover">START OVER</button>')
					$(".maptitle h3").html("Click on the links below for more information")

					var geolat = geocode[0].lat
					var geolon = geocode[0].lon


					//add polygons based on search

					// https://native-land.ca/api/index.php?maps=territories&position=34.1540864,-118.2613275

					console.log(geolat)
					console.log(geolon)

					var territoriesAPIlink = "https://native-land.ca/api/index.php?maps=territories&position="+geolat+","+geolon
					console.log(territoriesAPIlink)

					map.flyTo([geolat,geolon], 8, {animate:true});

					// territories layer
					$.getJSON(territoriesAPIlink,function(polygondata){

						var myStyle = {
						    "color": "white",
						    "weight": 0,
						    "fillOpacity": 0.65
						};

						var layerGroup = L.geoJson(polygondata,  {

							style: myStyle,
							pane: "polygonsPane",
							opacity: 0.55,

							style: function (feature) {

								return {
									fillColor: feature.properties.color,
									className: "territory"
								};
								

							},

							onEachFeature: function (feature, layer) {

								// var popup = L.popup({
								//   	pane: 'fixed',
								//   	className: 'popup-fixed',
								//   	autoPan: false
								// }).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.Name+'</h3></div><div class="text"><p><a href="' + feature.properties.description + '" target="_blank">Click here for more information</a></p></div></div>');

								// layer.bindPopup(popup);

								var tooltip = new L.tooltip({
									permanent: "true",
									interactive: "true"
								}).setContent('<div class="title"><h3>'+feature.properties.Name+' Territory</h3></div><div class="text"><p><a href="' + feature.properties.description + '" target="_Blank">Click here for more information</a></p></div>');

								layer.bindTooltip(tooltip)

							}


						}).addTo(map);

						$(".territory").click(function(){

							$(".leaflet-fixed-pane").show()
							$(this).addClass("selected-polygon")
						});

						$(document.body).on('click', '.new-close-button' ,function(){
							// alert("HIDE POPUP")
							$(".leaflet-fixed-pane").hide().empty()
							// $(".selected-icon").removeClass("selected-icon")
							
						});


					}); //ends getJSON polygon generating function



					$("#startover").click(function(){

						console.log("start over")
						$('#zip').val("");
						location.reload();
					});


				}


				

			}); //ends getJSON geocode function

			

		}





	}); //end click function



	

}); //end document.ready block
