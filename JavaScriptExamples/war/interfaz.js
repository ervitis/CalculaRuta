var mapa = null;
var lng = 0;
var lat = 0;
var lngRutaAnterior, latRutaAnterior;
var lineaRuta = {};
var TIMEOUT = 3000;
var temporizadorInterval;

/**
 * Crea el mapa usando la API de Google maps
 */
function onCrearMapa(){
	
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(posicion){
			lng = posicion.coords.longitude;
			lat = posicion.coords.latitude;
			
			lngRutaAnterior = lng;
			latRutaAnterior = lat;
			
			var opcionesMapa =
				{
					zoom: 17,
					center: new google.maps.LatLng(lat, lng),
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
		
			if (mapa === null){
				mapa = new google.maps.Map(document.getElementById('divmapa'), opcionesMapa);
				
				var opcionesMarker =
					{
						position: new google.maps.LatLng(lat, lng),
						map: mapa,
						title: "Inicio"
					}
				
				var marker = new google.maps.Marker(opcionesMarker);
				
				var capaTrafico = new google.maps.TrafficLayer();
				capaTrafico.setMap(mapa);
				
				//Here goes the loop
				temporizadorInterval = setInterval(dibujaLinea, TIMEOUT);
			}
		});
	}
	else{
		alert("No funciona la geolocalización");
	}
}

/**
 * Dibuja una linea en el mapa
 */
function dibujaLinea(){
	var lngRuta, latRuta;
	var posicionRutaAnterior;
	var posicionRuta;
	
	navigator.geolocation.getCurrentPosition(function(posicion){
		lngRuta = posicion.coords.longitude;
		latRuta = posicion.coords.latitude;
		
		posicionRuta = new google.maps.LatLng(latRuta, lngRuta);
		posicionRutaAnterior = new google.maps.LatLng(latRutaAnterior, lngRutaAnterior);
		
		lineaRuta =
			{
				path: [posicionRutaAnterior, posicionRuta],
				geodesic: true,
				strokeColor: '#528ACF',
				strokeOpacity: 1.0,
				strokeWeight: 3
			};
		
		posicionRuta = new google.maps.Polyline(lineaRuta);
		posicionRuta.setMap(mapa);
		
		lngRutaAnterior = lngRuta;
		latRutaAnterior = latRuta;
		
		alert("pasado");
	});
}

function detener(){
	clearInterval(temporizadorInterval);
}

function dibujaRuta(){
	
}