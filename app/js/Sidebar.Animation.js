/**
 * @author mrdoob / http://mrdoob.com/
 */
import {
	Sidebar
} from "./Sidebar"


Sidebar.Animation = function(editor) {

	var signals = editor.signals;

	var options = {};
	var possibleAnimations = {};

	var container = new UI.CollapsiblePanel();
	container.setCollapsed(editor.config.getKey('ui/sidebar/animation/collapsed'));
	container.onCollapsedChange(function(boolean) {

		editor.config.setKey('ui/sidebar/animation/collapsed', boolean);

	});


	container.addStatic(new UI.Text('Animation').setTextTransform('uppercase'));
	container.add(new UI.Break());

	var animationsRow = new UI.Row();
	container.add(animationsRow);



	var animations = {};

	this.animations = animations
	var self = this
	signals.objectAdded.add(function(object) {
		self.scan(object)
		object.traverse(function(child) {
			self.scan(child)
		});

	});

	signals.editorCleared.add(function() {
		THREE.AnimationHandler.clear()
	})

	signals.objectSelected.add(function(object) {

		// container.setDisplay( 'none' );

		if (object instanceof THREE.SkinnedMesh || object instanceof THREE.MorphAnimMesh || object instanceof THREE.SEA3D.VertexAnimationMesh) {

			animationsRow.clear();

			var animation = animations[object.id] || {};
			for (let key in animation) {
				let playButton = new UI.Button('Play: ' + key).onClick(function() {

					animation[key].play();

				});
				animationsRow.add(playButton);

				let pauseButton = new UI.Button('Stop').onClick(function() {

					animation[key].stop();

				});
				animationsRow.add(pauseButton);

				animationsRow.add(new UI.Break())


			}

			container.setDisplay('block');

		}

	});



	return container;

}

Sidebar.Animation.prototype.scan = function(child) {
	if (child instanceof THREE.SkinnedMesh) {

		var material = child.material;

		if (material instanceof THREE.MultiMaterial) {

			for (var i = 0; i < material.materials.length; i++) {

				material.materials[i].skinning = true;

			}

		} else {

			child.material.skinning = true;

		}

		//animations[ child.id ] = new THREE.Animation( child, child.geometry.animation );

		const animationClips = child.geometry.animations || []
		child.mixer = new THREE.AnimationMixer(child)

		THREE.AnimationHandler.add(child.mixer)

		if (this.animations[child.id] == null)
			this.animations[child.id] = {}

		animationClips.forEach((itm, i) => {
			this.animations[child.id][itm.name] = child.mixer.clipAction(itm)
		})

	} else if (child instanceof THREE.MorphAnimMesh || child instanceof THREE.SEA3D.VertexAnimationMesh) {

		const animationClips = child.geometry.animations || []
		animationClips.forEach((itm, i) => {
			var animation = new THREE.MorphAnimation(child);
			animation.duration = itm.duration;
			animation.frames = itm.tracks.length

			THREE.AnimationHandler.add(animation)

			// temporal hack for THREE.AnimationHandler
			animation._play = animation.play;
			animation.play = function() {
				this._play();
			};
			animation.resetBlendWeights = function() {};
			animation.stop = function() {
				this.pause();
			};

			if (this.animations[child.id] == null)
				this.animations[child.id] = {}

			this.animations[child.id][itm.name] = animation;
		})
	}
};