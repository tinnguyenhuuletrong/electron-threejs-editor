/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue integer representing a hex color value
 * @constructor
 */

export var SetMaterialColorCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetMaterialColorCommand';
	this.name = 'Set Material.' + attributeName;
	this.updatable = true;

	this.mat = object.material

	if(this.mat.materials || object._subMatID != null) {
		this.mat = this.mat.materials.find(itm => { return itm.uuid == object._subMatID })
	}

	this.object = object;
	this.attributeName = attributeName;
	this.oldValue = ( object !== undefined ) ? this.mat[ this.attributeName ].getHex() : undefined;
	this.newValue = newValue;

};

SetMaterialColorCommand.prototype = {

	execute: function () {

		this.mat[ this.attributeName ].setHex( this.newValue );
		this.editor.signals.materialChanged.dispatch( this.mat );

	},

	undo: function () {

		this.mat[ this.attributeName ].setHex( this.oldValue );
		this.editor.signals.materialChanged.dispatch( this.mat );

	},

	update: function ( cmd ) {

		this.newValue = cmd.newValue;

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;

	}

};
