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

	this.light0 = false;
	this.light1 = false;
	this.light2 = false;

	this.submarineAppearanceList = {"Metal 1" : 0, "Rusty 1" : 1};
	this.currSubmarineAppearance = 0;
	this.submarineAppearances = [];

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
	
	this.targets = [];
	this.initTargets();

	this.torpedoes = [];

	// Materials
	this.defaultMaterial = new CGFappearance(this);

	this.metalAppearance1 = new CGFappearance(this);
	this.metalAppearance1.loadTexture("/resources/images/metal_texture_1.jpg");
	this.submarineAppearances.push(this.metalAppearance1);

	this.rustyAppearance1 = new CGFappearance(this);
	this.rustyAppearance1.loadTexture("/resources/images/rusty_texture_1.jpg");
	this.submarineAppearances.push(this.rustyAppearance1);

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

	this.setUpdatePeriod(1/60*1000);

	this.pushMatrix();
		this.loadIdentity();
		this.subMatrix = this.getMatrix();
	this.popMatrix();
	this.submarine.x = 0;
	this.submarine.y = 0;
	this.submarine.z = 0;
	this.submarine.xyOrientation = 0;
	this.submarine.xzOrientation = 0;
}

LightingScene.prototype.initTargets = function() {
	let target1 = new MyTarget(this, 6, 0, 0);
	this.targets.push(target1);

	let target2 = new MyTarget(this, 0, 0, 6);
	this.targets.push(target2);
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
	this.light0 = true;

	this.lights[1].setAmbient(0, 0, 0, 1);
	this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[1].setSpecular(1.0, 1.0, 1.0, 1.0);
	this.lights[1].enable();
	this.light1 = true;

	this.lights[2].setAmbient(0, 0, 0, 1);
	this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[2].setSpecular(1.0, 1.0, 1.0, 1.0);
	this.lights[2].setConstantAttenuation(0.0);
	//this.lights[2].setLinearAttenuation(0.2);
	this.lights[2].setLinearAttenuation(1.0);
	this.lights[2].setQuadraticAttenuation(0.0);
	this.lights[2].enable();
	this.light2 = true;
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
		this.submarineAppearances[this.currSubmarineAppearance].apply();
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

	// Targets
	for (i = 0; i < this.targets.length; i++) {
		this.targets[i].display();
	}

	// Torpedoes
	for (torpedo in this.torpedoes) {
		torpedo.display();
	}
	

	// ---- END Primitive drawing section
};

LightingScene.prototype.update = function(currTime) {
	this.clock.update(currTime);
	this.submarine.update(currTime);
};

LightingScene.prototype.Clock = function() {
	this.clock.work(!this.clock.working);
};

//(0, 0) rads = [1, 0, 0]
function getOrientationVector(xzAngle, xyAngle) {
	return [Math.cos(xzAngle * degToRad), Math.sin(xyAngle * degToRad), Math.sin(xzAngle * degToRad)];
}

// forward: bool
LightingScene.prototype.moveSubmarine = function(forward) {
	let subMovement = 1;
	/*this.pushMatrix();
		this.loadIdentity();
		if (forward) {
			let transArg = getOrientationVector(this.submarine.xzOrientation, this.submarine.xyOrientation).map(x => x * subMovement);
			this.translate(transArg[0], transArg[1], transArg[2]);
			this.submarine.x += transArg[0];
			this.submarine.y += transArg[1];
			this.submarine.z += transArg[2];
		} else {
			let transArg = getOrientationVector(this.submarine.xzOrientation, this.submarine.xyOrientation).map(x => x * -subMovement);
			this.translate(transArg[0], transArg[1], transArg[2]);
			this.submarine.x += transArg[0];
			this.submarine.y += transArg[1];
			this.submarine.z += transArg[2];
		}
		this.multMatrix(this.subMatrix);
		this.subMatrix = this.getMatrix();
	this.popMatrix();
	*/

	if (forward) {
		this.submarine.vel_vec[0] += subMovement;		
	} else {
		this.submarine.vel_vec[0] -= subMovement;
	}
}

// right: bool
LightingScene.prototype.rotateSubmarine = function(right) {
	let rotAng = 5; // degrees
	/*this.pushMatrix();
		this.loadIdentity();
		this.translate(this.submarine.x, this.submarine.y, this.submarine.z); //move back to actual position
		if (right) {
			this.rotate(rotAng * degToRad, 0, 1, 0);
			this.submarine.xzOrientation -= rotAng;
		} else {
			this.rotate(-rotAng * degToRad, 0, 1, 0);
			this.submarine.xzOrientation += rotAng;
		}
		this.submarine.xzOrientation %= 360;
		this.translate(-this.submarine.x, -this.submarine.y, -this.submarine.z); //move to origin
		this.multMatrix(this.subMatrix);
		this.subMatrix = this.getMatrix();
	this.popMatrix();
	*/
	
	if (right) {
		this.submarine.update_vec_r[1] += rotAng * degToRad;
	} else {
		this.submarine.update_vec_r[1] -= rotAng * degToRad;
	}
}

LightingScene.prototype.rotateSubmarine_up = function(up){
	this.submarine.update_vec_r[2] += 0.01*up;
}

LightingScene.prototype.launchTorpedo = function() {
	let torpedo = new MyTorpedo(scene);
	this.torpedoes.push(torpedo);
}