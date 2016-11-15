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

	signals.objectAdded.add(function(object) {

		object.traverse(function(child) {

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

				if (animations[child.id] == null)
					animations[child.id] = {}

				animationClips.forEach((itm, i) => {
					animations[child.id][itm.name] = child.mixer.clipAction(itm)
				})

			} else if (child instanceof THREE.MorphAnimMesh) {

				var animation = new THREE.MorphAnimation(child);
				animation.duration = 30;

				// temporal hack for THREE.AnimationHandler
				animation._play = animation.play;
				animation.play = function() {
					this._play();
					THREE.AnimationHandler.play(this);
				};
				animation.resetBlendWeights = function() {};
				animation.stop = function() {
					this.pause();
					THREE.AnimationHandler.stop(this);
				};

				if (animations[child.id] == null)
					animations[child.id] = {}

				animations[child.id]["default"] = animation;

			}

		});

	});

	signals.editorCleared.add(function() {
		THREE.AnimationHandler.clear()
	})

	signals.objectSelected.add(function(object) {

		// container.setDisplay( 'none' );

		if (object instanceof THREE.SkinnedMesh || object instanceof THREE.MorphAnimMesh) {

			animationsRow.clear();

			var animation = animations[object.id] || {};
			for (var key in animation) {
				var playButton = new UI.Button('Play: ' + key).onClick(function() {

					animation[key].play();

				});
				animationsRow.add(playButton);

				var pauseButton = new UI.Button('Stop').onClick(function() {

					animation[key].stop();

				});
				animationsRow.add(pauseButton);
			}

			container.setDisplay('block');

		}

	});



	return container;

}