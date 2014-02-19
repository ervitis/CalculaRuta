var mapa = null;
var lng = 0;
var lat = 0;
var lngRutaAnterior, latRutaAnterior;
var lineaRuta = {};
var TIMEOUT = 3000;
var TIMEOUTTRAFFIC = 60000;
var TIMEOUTTRAFFICDISABLED = 750;
var temporizadorInterval;
var origen, destino;
var capaTrafico;
var bActualizaCapaTrafico;
var bDetener;
var servicioDireccion;
var renderizadoDireccion;

/**
 * Crea el mapa usando la API de Google maps
 */
function onCrearMapa(){
	inicioApp();
	
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
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true
				};
		
			if (mapa === null){
				mapa = new google.maps.Map(document.getElementById('divmapa'), opcionesMapa);
				
				var opcionesMarker =
					{
						position: new google.maps.LatLng(lat, lng),
						map: mapa,
						title: "Inicio"
					}
				
				origen = lat + ',' + lng;
				
				var marker = new google.maps.Marker(opcionesMarker);
				
				//Here goes the loop
				temporizadorIntervalTrafico = setTimeout(function(){
					actualizaTraficoMapa(bActualizaCapaTrafico)
				}, TIMEOUTTRAFFICDISABLED);
				
				temporizadorInterval = setInterval(dibujaLineaYActualizaMapa, TIMEOUT);
			}
		});
	}
	else{
		alert("No funciona la geolocalización");
	}
}

/**
 * Inicia variables y botones
 */
function inicioApp(){
	event.preventDefault();
	bDetener = false;
	bActualizaCapaTrafico = true;
	origen = '';
	destino = '';
	document.getElementById('btnDetener').disabled = false;
	document.getElementById('btnComenzar').disabled = true;
	
}

/**
 * Actualiza el trafico del mapa dependiendo de la variable que se le pasa por parametro
 * 
 * @param actualiza true->actualiza false->borra
 */
function actualizaTraficoMapa(actualiza){
	if (actualiza){
		capaTrafico = new google.maps.TrafficLayer();
		capaTrafico.setMap(mapa);
		bActualizaCapaTrafico = false;
		setTimeout(function(){
			actualizaTraficoMapa(bActualizaCapaTrafico)
		}, TIMEOUTTRAFFIC);
	}
	else{
		capaTrafico.setMap(null);
		capaTrafico = null;
		bActualizaCapaTrafico = true;
		setTimeout(function(){
			actualizaTraficoMapa(bActualizaCapaTrafico)
		}, TIMEOUTTRAFFICDISABLED);
	}
}

/**
 * Dibuja una linea en el mapa
 */
function dibujaLineaYActualizaMapa(){
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
				strokeColor: '#666633',
				strokeOpacity: 1.0,
				strokeWeight: 9
			};
		
		posicionRuta = new google.maps.Polyline(lineaRuta);
		posicionRuta.setMap(mapa);
		
		lngRutaAnterior = lngRuta;
		latRutaAnterior = latRuta;
		
	});
}

/**
 * Detiene la navegacion
 */
function detener(){
	document.getElementById('btnComenzar').disabled = false;
	document.getElementById('btnDetener').disabled = true;
	clearInterval(temporizadorInterval);
}

/**
 * Comienza la navegacion
 */
function comenzar(){
	temporizadorInterval = setInterval(dibujaLineaYActualizaMapa, TIMEOUT);
	document.getElementById('btnDetener').disabled = false;
	document.getElementById('btnComenzar').disabled = true;
}

function dibujaRuta(){
	
	if (origen !== '' || destino !== ''){
		if (renderizadoDireccion){
			renderizadoDireccion.setMap(null);
			renderizadoDireccion = null;
		}
		
		if (destino.coordenadas){
			var opcionesDireccion =
				{
					origin: origen,
					destination: destino.coordenadas,
					travelMode: google.maps.DirectionsTravelMode.DRIVING,
					unitSystem: google.maps.UnitSystem.METRIC
				}
			
			servicioDireccion = new google.maps.DirectionsService();
			servicioDireccion.route(opcionesDireccion, function(response, status){
				if (status === google.maps.DirectionsStatus.OK){
					renderizadoDireccion = new google.maps.DirectionsRenderer({
						map: mapa,
						directions: response
					});
				}
				else{
					alert('No ha sido posible obtener la ruta');
				}
			});
		}
		else{
			alert('Destino no localizable');
		}
	}
}

function getAutocomplete(event){
	var servicioAutocomplete;
	var palabraPeticion = '';
	
	if (document.getElementById('txtDestino').value.length > 2){
		
		palabraPeticion = document.getElementById('txtDestino');
		
		var opciones =
			{
				componentRestrictions: {country: 'es'}
			};
		
		try{
			servicioAutocomplete = new google.maps.places.Autocomplete(palabraPeticion, opciones);
			
			servicioAutocomplete.bindTo('bounds', mapa);
			
			google.maps.event.addListener(servicioAutocomplete, 'place_changed', function(){
				var lugar = servicioAutocomplete.getPlace();
				
				if (lugar.geometry){
					//si tiene geometry
					if (lugar.geometry.location){
						destino =
							{
								coordenadas: lugar.geometry.location.lat() + ',' + lugar.geometry.location.lng(),
								nombre: lugar.formatted_address
							};
						
						dibujaRuta();
					}
				}
				else{
					console.log('no se ha encontrado el sitio');
				}
			});
		}catch(e){
			console.log(e);
		}
	}
	
}