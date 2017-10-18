/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newMaterial THREE.Material
 * @constructor
 */

export var SetMaterialCommand = function ( object, newMaterial ) {

	Command.call( this );

	this.type = 'SetMaterialCommand';
	this.name = 'New Material';

	this.mat = object.material
	this.oldMaterial = ( object !== undefined ) ? this.mat : undefined;

	if(this.mat.materials || object._subMatID != null) {
		this.subMatIndex = this.mat.materials.findIndex(itm => { return itm.uuid == object._subMatID })
		this.oldMaterial = this.mat.materials[this.subMatIndex]
	}

	this.object = object;
	this.newMaterial = newMaterial;

};

SetMaterialCommand.prototype = {

	execute: function () {
		if(this.subMatIndex != null) {
			const oldSubMat = this.mat.materials[this.subMatIndex]
			this.mat.materials[this.subMatIndex] = this.newMaterial
			
			// Update Default info
			this.newMaterial.name = oldSubMat.name
			this.object._subMatID = this.newMaterial.uuid
			this.editor.signals.materialChanged.dispatch( this.newMaterial );

		} else {
			this.object.material = this.newMaterial;
			this.editor.signals.materialChanged.dispatch( this.newMaterial );
		}
	},

	undo: function () {
		this.object.material = this.oldMaterial;
		this.editor.signals.materialChanged.dispatch( this.oldMaterial );
	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.subMatIndex = this.subMatIndex;
		output.oldMaterial = this.oldMaterial.toJSON();
		output.newMaterial = this.newMaterial.toJSON();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.oldMaterial = parseMaterial( json.oldMaterial );
		this.newMaterial = parseMaterial( json.newMaterial );
		this.subMatIndex = json.subMatIndex


		function parseMaterial ( json ) {

			var loader = new THREE.ObjectLoader();
			var images = loader.parseImages( json.images );
			var textures  = loader.parseTextures( json.textures, images );
			var materials = loader.parseMaterials( [ json ], textures );
			return materials[ json.uuid ];

		}

	}

};
