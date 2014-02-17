/**
 * Clase Mapa
 */

function Mapa(idDiv){
	return new google.maps.Map(idDiv);
}

function Mapa(opciones, idDiv){
	var jsonOpcionesMapa = setOpciones(opciones)
}

/**
 * Configura las opciones para el mapa
 * 
 * @param stringOpciones una cadena con las opciones del mapa separados por ;
 */
function setOpciones(stringOpciones){
	var arrOpciones = stringOpciones.split(";");
	
}