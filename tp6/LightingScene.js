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

	this.explosionapp = new CGFappearance(this);
 	//this.explosionapp.setSpecular(0,0,0,1);
 	this.explosionapp.setDiffuse(256,165,0,1);

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
	//	this.multMatrix(this.subMatrix);
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
	for (torpedo of this.torpedoes) {
		torpedo.display();
	}


	// ---- END Primitive drawing section
};

LightingScene.prototype.update = function(currTime) {
	this.clock.update(currTime);
	this.submarine.update(currTime);

	/*let pos_vec = vec3.fromValues(this.submarine.update_vec[0]-10, this.submarine.update_vec[1]+3, this.submarine.update_vec[2]);
	this.camera.setPosition(pos_vec);

	let tar_vec = vec4.fromValues(this.submarine.update_vec[0]+1, this.submarine.update_vec[1], this.submarine.update_vec[2],1);
	this.camera.setTarget(tar_vec); */

	for (let k = 0; k < this.targets.length; k++) {
			this.targets[k].update(currTime);
			let targetInd = this.targets.indexOf(this.targets[k]);
			if(this.targets[k].radius < 0.1 && this.targets[k].target_explode)
				this.targets.splice(targetInd, 1);
	}

	for (let i = 0; i < this.torpedoes.length; i++) {
		if (this.torpedoes[i].collidedWithTarget(this.torpedoes[i].target)) {
			this.torpedoes.splice(i, 1);
			let targetInd = this.targets.indexOf(this.targets[i]);
			this.targets[targetInd].target_explode = true;
			//if(this.targets[targetInd].radius < 0.1)
			//	this.targets.splice(targetInd, 1);
		} else {
			this.torpedoes[i].update(currTime);
		}
	}
};

LightingScene.prototype.Clock = function() {
	this.clock.work(!this.clock.working);
};

//(0, 0) rads = [1, 0, 0]
function getOrientationVector(xzAngle, xyAngle) {
	return [Math.cos(xzAngle * degToRad), Math.sin(xyAngle * degToRad), Math.sin(xzAngle * degToRad)];
}

// forward: 1 or -1
LightingScene.prototype.moveSubmarine = function(forward) {
	this.submarine.speed += forward;
// 	let subMovement = 1;
// 	this.pushMatrix();
// 		this.loadIdentity();
// 		if (forward) {
// 			let transArg = getOrientationVector(this.submarine.xzOrientation, this.submarine.xyOrientation).map(x => x * forward * subMovement);
// 			this.translate(transArg[0], transArg[1], transArg[2]);
// 			this.submarine.x += transArg[0];
// 			this.submarine.y += transArg[1];
// 			this.submarine.z += transArg[2];
// 		} else {
// 			let transArg = getOrientationVector(this.submarine.xzOrientation, this.submarine.xyOrientation).map(x => x * -subMovement);
// 			this.translate(transArg[0], transArg[1], transArg[2]);
// 			this.submarine.x += transArg[0];
// 			this.submarine.y += transArg[1];
// 			this.submarine.z += transArg[2];
// 		}
// 		this.multMatrix(this.subMatrix);
// 		this.subMatrix = this.getMatrix();
// 	this.popMatrix();
	

// 	if (forward) {
// 		this.submarine.vel_vec[0] += forward;
// 	} else {
// 		this.submarine.vel_vec[0] -= forward;
// 	}
}

// right: 1 or -1
LightingScene.prototype.rotateSubmarine = function(right) {
	let rotAng = 5; // degrees
	//this.pushMatrix();
	//	this.loadIdentity();
	//	this.translate(this.submarine.x, this.submarine.y, this.submarine.z); //move back to actual position
	//	if (right) {
		//	this.rotate(right * rotAng * degToRad, 0, 1, 0);
			this.submarine.xzOrientation += -right * rotAng;
	//	} else {
	//		this.rotate(-rotAng * degToRad, 0, 1, 0);
	//		this.submarine.xzOrientation += rotAng;
	//	}
		this.submarine.xzOrientation %= 360;
	//	this.translate(-this.submarine.x, -this.submarine.y, -this.submarine.z); //move to origin
	//	this.multMatrix(this.subMatrix);
	//	this.subMatrix = this.getMatrix();
	//this.popMatrix();
	

	/*this.submarine.update_vec_r[1] += 0.01*right;
	if(this.submarine.elevator_r == 0)
		this.submarine.elevator_r = 0.09;
	if(right != 0)
		this.submarine.elevator_r = (right+0.1);*/

	/*
	if (right) {
		this.submarine.update_vec_r[1] += rotAng * degToRad;
	} else {
		this.submarine.update_vec_r[1] -= rotAng * degToRad;
	} */

}

LightingScene.prototype.rotateSubmarine_up = function(up){
// 	this.submarine.update_vec_r[2] += 0.01*up;
	this.submarine.rudder_r = up;

	let rotAng = 5; // degrees
	this.submarine.xyOrientation += up * rotAng;
	this.submarine.xyOrientation %= 360;
}

LightingScene.prototype.periscope_up = function(up){
	this.submarine.peris_height += 0.1*up;
}

LightingScene.prototype.launchTorpedo = function() {
	if (this.targets.length == 0) {
		return;
	}
// 	let torpX = this.submarine.update_vec[0];
// 	let torpY = this.submarine.update_vec[1] - CYLINDER_HEIGHT;
// 	let torpZ = this.submarine.update_vec[2];
	let torpX = this.submarine.x;
	let torpY = this.submarine.y;
	let torpZ = this.submarine.z;
	let torpedo = new MyTorpedo(this, torpX, torpY, torpZ, this.submarine.xyOrientation, this.submarine.xzOrientation);
	torpedo.lockTarget(this.targets[0]);
	this.torpedoes.push(torpedo);
	//torpedo = null;
	//delete torpedo;
}
