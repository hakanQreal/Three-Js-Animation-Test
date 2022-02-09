let camera, scene, renderer;
init();
animate();
var clock = new THREE.Clock();
var mixer;
var AnimationValue = 0
var animationAction;
var animation
function init() {

	camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1,20000);
	  camera.position.z = 5; 
	  camera.position.x = 0;
	  camera.position.y = 0;

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);
	const loader = new THREE.TextureLoader();
	//loader.load('stars.jpg' , function(texture)
	//			{
	//			 scene.background = texture;  
	//			});
	
	const loadingManager = new THREE.LoadingManager( () => {
	
		const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );
		
		// optional: remove loader from DOM via event listener
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
		
	} );

	// gltf

	const gltfLoader = new THREE.GLTFLoader(loadingManager);
  	gltfLoader.load('Med_animation.glb', (gltf) => {
	const model = gltf.scene;
	mixer= new THREE.AnimationMixer(model);
	animation = gltf.animations
	animationAction = mixer.clipAction(animation[AnimationValue])
	animationAction.play()
    // gltf.animations.forEach((clip) => {mixer.clipAction(clip).play(); });
	console.log(gltf.animations[0])
	model.position.set(0,-0.8,0)
	scene.add( model );

					
  });

  // Galaxy
let galaxyGeometry = new THREE.SphereGeometry(1000,32,32);
let galaxyMaterial = new THREE.MeshBasicMaterial({
  side: THREE.BackSide
});
let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);

// Load Galaxy Textures
loader.crossOrigin = true;
loader.load(
  'bg.png',
  function(texture) {
    galaxyMaterial.map = texture;
    scene.add(galaxy);
  }
);

  let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
  hemiLight.position.set(0, 50, 0);
  // Add hemisphere light to scene
  scene.add(hemiLight);
  
  let d = 8.25;
  let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
  dirLight.position.set(-8, 12, 8);
  dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 1500;
  dirLight.shadow.camera.left = d * -1;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = d * -1;
  // Add directional Light to scene
  scene.add(dirLight);

	//

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//

	const controls = new THREE.OrbitControls( camera, renderer.domElement );
	
	controls.update();

	//

	window.addEventListener( 'resize', onWindowResize, false );

}
var options = {
	anim1: function() {
	  AnimationValue = 0
	  mixer.stopAllAction()
	  animationAction = mixer.clipAction(animation[AnimationValue])
		animationAction.play()
		console.log("clicked")
	},
	anim2: function() {
		AnimationValue = 1
		mixer.stopAllAction()
		animationAction = mixer.clipAction(animation[AnimationValue])
		animationAction.play()
	},
	anim3: function() {
		AnimationValue = 2
		mixer.stopAllAction()
		animationAction = mixer.clipAction(animation[AnimationValue])
		animationAction.play()
	}
  };
  
var gui = new dat.GUI();
gui.add(options, 'anim1');
gui.add(options, 'anim2');
gui.add(options, 'anim3');
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
	//  clock.getDelta();

	if ( mixer ) mixer.update( clock.getDelta() );
	requestAnimationFrame( animate );
	render();

}

function render() {

	
	renderer.render( scene, camera );

}

function onTransitionEnd( event ) {

	event.target.remove();
	
}