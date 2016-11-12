// @flow
const THREE = require("./libs/threejs/Three.js")
const Detector = require("./js/Detector.js")

window.THREE = THREE

if (!Detector.webgl) Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var FLOOR = 0;

var container;

var camera, scene;
var webglRenderer;

var zmesh, geometry;

var mouseDown = 0;
var mouseX = 0,
	mouseY = 0;
var mousemoveX = 0,
	mousemoveY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mouseup', onDocumentMouseUp, false );
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

var closeEl = initCloseBtn();

init();
animate();

function init() {
	container = document.createElement('div');
	document.body.appendChild(container);

	// camera
	camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000);
	camera.position.z = 75;

	//scene
	scene = new THREE.Scene();

	// lights
	var ambient = new THREE.AmbientLight(0x000000);
	scene.add(ambient);

	// more lights
	var directionalLight = new THREE.DirectionalLight(0xffeedd);
	directionalLight.position.set(0, -70, 100).normalize();
	scene.add(directionalLight);

	// renderer
	webglRenderer = new THREE.WebGLRenderer();
	webglRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	webglRenderer.domElement.style.position = "relative";
	container.appendChild(webglRenderer.domElement);

	// load ascii model
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load("models/html5rocks.js", function(geometry, materials) {
		createScene(geometry, materials)
	});

}

function initCloseBtn() {
	var closeEl = document.querySelector(".close");
	if (closeEl) {
		closeEl.addEventListener('click', function() {
			window.close();
		});
	};
	return closeEl;
}

function createScene(geometry, materials) {
	zmesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
	zmesh.position.set(-10, -10, 0);
	zmesh.scale.set(1, 1, 1);
	scene.add(zmesh);
}

function onDocumentMouseDown(event) {
	if (event.target == closeEl) return; // it should deliver click to close button

	++mouseDown;
}

function onDocumentMouseUp(event) {
	--mouseDown;
}

function onDocumentMouseWheel(event) {
	camera.position.z -= event.wheelDelta / 120 * 3;
}

function onDocumentMouseMove(event) {
	if(mouseDown) {
		mouseX = (event.clientX - windowHalfX);
		mouseY = (event.clientY - windowHalfY);
		
		mousemoveX += event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		mousemoveY += event.movementY || event.mozMovementY || event.webkitMovementY || 0;
	}
	
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {

	if (zmesh) {
		zmesh.rotation.set(-(mouseY + mousemoveY) / windowHalfY + 0, -(mouseX + mousemoveX) / windowHalfX, 0);
	}
	webglRenderer.render(scene, camera);
}