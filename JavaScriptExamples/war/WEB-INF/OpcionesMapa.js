/**
 * clase Opciones del Mapa
 */

/**
 * Constructor para las opciones
 * 
 * @param valorOpciones string con las opciones
 */
function Opciones(valorOpciones){
	this.cadenaOpciones = valorOpciones;
}

Opciones.prototype.setOpciones = function(opciones){
	this.cadenaOpciones = opciones;
}

Opciones.prototype.getOpciones = function(){
	return this.cadenaOpciones;
}

Opciones.prototype.getOpcionesCadenaToJSON = function(){
	
}