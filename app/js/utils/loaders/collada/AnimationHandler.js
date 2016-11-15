/**
 * @author mikael emtinger / http://gomo.se/
 */

THREE.AnimationHandler = {


	add: function (itm) {
		this.animations.push(itm)
	},
	clear: function () {
		this.animations.animations = []
	},
	remove: function (itm) {
		const index = this.animations.indexOf(itm)
		if(index != -1) {
			this.animations = this.animations.splice(index, 1)
		}
	},

	//

	animations: [],	

	update: function ( deltaTimeMS ) {

		for ( var i = 0; i < this.animations.length; i ++ ) {

			this.animations[ i ].update( deltaTimeMS );

		}

	}

};
