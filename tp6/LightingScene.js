var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

var BOARD_A_DIVISIONS = 30;
var BOARD_B_DIVISIONS = 100;

function LightingScene() {
	CGFscene.call(this);
}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);

	this.option1 = true;
	this.option2 = false;
	this.speed = 3;

	this.initCameras();
	this.enableTextures(true);
	this.initLights();

	this.gl.clearColor(0.0, 0.0, 0.5, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);

	// Scene elements
	this.submarine = new MySubmarine(this);
	this.sea = new MyQuad(this, 0, 15, 0, 15);
	this.clock = new MyClock(this);
	this.post = new MyCylinder(this, 12, 1);

	// Materials
	this.defaultMaterial = new CGFappearance(this);

	let seaSpecular = 0.5;
	let seaDiffuse = 1;
	this.seaMaterial = new CGFappearance(this);
	this.seaMaterial.loadTexture("/resources/images/sand_scaled.jpg");
	this.seaMaterial.setSpecular(seaSpecular, seaSpecular, seaSpecular, 1);
	this.seaMaterial.setDiffuse(seaDiffuse, seaDiffuse, seaDiffuse, 1);
	
	this.clockSideAppearance = new CGFappearance(this);

	this.clockFaceAppearance = new CGFappearance(this);
 	this.clockFaceAppearance.loadTexture("/resources/images/clock.png");

 	this.clockHandsAppearance = new CGFappearance(this);
 	this.clockHandsAppearance.setSpecular(0,0,0,1);
 	this.clockHandsAppearance.setDiffuse(0,0,0,1);

	this.setUpdatePeriod(100);

	this.translate(-1, 0, 0);
	this.rotate(Math.PI/2, 0, 1, 0);
	this.subOrientation = [1, 0, 0];
	this.subMatrix = this.getMatrix();
}

LightingScene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
};

LightingScene.prototype.initLights = function() {
	this.setGlobalAmbientLight(0.3, 0.3, 0.3, 1.0);

	// Positions for four lights
	this.lights[0].setPosition(4, 6, 1, 1);
	this.lights[0].setVisible(true); // show marker on light position (different from enabled)

	this.lights[1].setPosition(10.5, 6.0, 1.0, 1.0);
	this.lights[1].setVisible(true); // show marker on light position (different from enabled)

	this.lights[2].setPosition(10.5, 6.0, 5.0, 1.0);
	this.lights[2].setVisible(true);

	this.lights[0].setAmbient(0, 0, 0, 1);
	this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].setSpecular(1.0, 1.0, 1.0, 1.0);
	this.lights[0].enable();

	this.lights[1].setAmbient(0, 0, 0, 1);
	this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[1].setSpecular(1.0, 1.0, 1.0, 1.0);
	this.lights[1].enable();

	this.lights[2].setAmbient(0, 0, 0, 1);
	this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[2].setSpecular(1.0, 1.0, 1.0, 1.0);
	this.lights[2].setConstantAttenuation(0.0);
	//this.lights[2].setLinearAttenuation(0.2);
	this.lights[2].setLinearAttenuation(1.0);
	this.lights[2].setQuadraticAttenuation(0.0);
	this.lights[2].enable();
};

LightingScene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
}


LightingScene.prototype.display = function() {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation)
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Update all lights used
	this.updateLights();

	// Draw axis
	this.axis.display();

	this.defaultMaterial.apply();

	// ---- END Background, camera and axis setup

	// ---- BEGIN Primitive drawing section

	// Submarine
	this.pushMatrix();
		this.multMatrix(this.subMatrix);
		this.submarine.display();
	this.popMatrix();

	// Sea
	this.pushMatrix();
		this.seaMaterial.apply();
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.scale(60, 60, 60);
		this.sea.display();
	this.popMatrix();

	// Clock
	this.pushMatrix();
		this.defaultMaterial.apply();
		this.translate(8, 5, 0);
		this.clock.display();
	this.popMatrix();

	// Post
	this.pushMatrix();
		this.defaultMaterial.apply();
		this.translate(8, 5, 0);
		this.scale(0.1, 5, 0.1)
		this.rotate(Math.PI/2, 1, 0, 0);
		this.post.display();
	this.popMatrix();

	// ---- END Primitive drawing section
};

LightingScene.prototype.update = function(currTime) {
	this.clock.update(currTime);
};

LightingScene.prototype.doSomething = function() {
	console.log("Doing something...");
};

// forward: bool
LightingScene.prototype.moveSubmarine = function(forward) {
	let subMovement = 1;
	let subOrientCopy = this.subOrientation;
	this.pushMatrix();
		this.setMatrix(this.subMatrix);
		if (forward) {
			let transArg = subOrientCopy.map(x => x * subMovement);
			this.translate(transArg[0], transArg[1], transArg[2]);
		} else {
			let transArg = subOrientCopy.map(x => x * -subMovement);
			this.translate(transArg[0], transArg[1], transArg[2]);
		}
		this.subMatrix = this.getMatrix();
	this.popMatrix();
}

// right: bool
LightingScene.prototype.rotateSubmarine = function(right) {
	if (right) {

	} else {

	}
}

function translateMatrix(x, y, z) {
	return [  1.0, 0.0, 0.0, x,
              0.0, 1.0, 0.0, y,
              0.0, 0.0, 1.0, z,
              5.0, 0.0, 2.0, 1.0  ];
}

function rotateMatrix(a, x, y, z) {
	return [ Math.cos(a),  0.0,  -Math.sin(a),  0.0,
             0.0,    1.0,   0.0,    0.0,
             Math.sin(a),  0.0,   Math.cos(a),  0.0,
             0.0,    0.0,   0.0,    1.0 ];
}