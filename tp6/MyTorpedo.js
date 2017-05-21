TORP = {};

// Obligatory measurements
TORP.TOTAL_LENGTH = 1;

// Custom measurements
TORP.CYLINDER_LENGTH = 0.9;
TORP.TIP_LENGTH = (TORP.TOTAL_LENGTH - TORP.CYLINDER_LENGTH) / 2;
TORP.CYLINDER_WIDTH = 0.1;
TORP.CYLINDER_HEIGHT = TORP.CYLINDER_WIDTH;
TORP.FIN_WIDTH = 0.05;
TORP.FIN_LENGTH = TORP.CYLINDER_WIDTH + 0.3;
TORP.FIN_THICKNESS = 0.01;

function vec_norm(vec){
	return Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1] +vec[2]*vec[2]  );
}

function dot_prod(vec1, vec2) {
    return (vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2]);
}

function MyTorpedo(scene, x, y, z, xyOrientation, xzOrientation) {
    CGFobject.call(this, scene);

    this.x = x;
    this.y = y;
    this.z = z;
    this.xyOrientation = xyOrientation;
    this.xzOrientation = xzOrientation;

//    this.update_r = orientation;

    this.target;

    this.frontSphere = new MyLamp(scene, 12, 8);
	this.mainCylinder = new MyCylinder(scene, 12, 8);
	this.rearSphere = new MyLamp(scene, 12, 8);

	this.rudder = new MyTrapeze(scene);
	this.elevator = new MyTrapeze(scene);

	this.startTime = -1;
	this.unitsPerSec = 1;

	this.t = 0;
}

MyTorpedo.prototype = Object.create(CGFobject.prototype);
MyTorpedo.prototype.constructor = MyTorpedo;

MyTorpedo.prototype.display = function() {
//     let rotAng = getRotAng(this.orientation, this.originalOrientation);
//     let rotAxis = crossProduct(this.originalOrientation, this.orientation);

	this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
		this.scene.rotate(this.xyOrientation * degToRad, 0, 0, 1);
		this.scene.rotate(this.xzOrientation * degToRad, 0, 1, 0);
		
//         this.scene.rotate(this.update_r[0], 1, 0, 0);
//         this.scene.rotate(this.update_r[1]+Math.PI/2, 0, 1, 0);
//         this.scene.rotate(this.update_r[2], 0, 0, 1);


//      	this.scene.rotate(rotAng, rotAxis[0], rotAxis[1], rotAxis[2]);
//       	this.scene.rotate(Math.PI/2, 0, 1, 0);

		// Main body
   		this.scene.pushMatrix();
        	this.scene.scale(TORP.CYLINDER_WIDTH/2, TORP.CYLINDER_HEIGHT/2, TORP.CYLINDER_LENGTH);
        	this.mainCylinder.display();
    	this.scene.popMatrix();

		// Front tip
    	this.scene.pushMatrix();
    		this.scene.translate(0, 0, TORP.CYLINDER_LENGTH);
        	this.scene.scale(TORP.CYLINDER_WIDTH/2, TORP.CYLINDER_WIDTH/2, TORP.TIP_LENGTH);
        	this.frontSphere.display();
    	this.scene.popMatrix();

		// Rear tip
    	this.scene.pushMatrix();
    		this.scene.rotate(Math.PI, 0, 1, 0);
        	this.scene.scale(TORP.CYLINDER_WIDTH/2, TORP.CYLINDER_WIDTH/2, TORP.TIP_LENGTH);
			this.rearSphere.display();
    	this.scene.popMatrix();

		// Elevator
    	this.scene.pushMatrix();
    		this.scene.translate(0, 0, TORP.FIN_WIDTH/2);
    		this.scene.scale(TORP.FIN_LENGTH/2.34, TORP.FIN_THICKNESS/0.05, TORP.FIN_WIDTH/0.5);
    		this.scene.rotate(Math.PI/2, 0, 0, 1);
    		this.scene.rotate(Math.PI, 0, 1, 0);
			this.elevator.display();
    	this.scene.popMatrix();

    	// Rudder
    	this.scene.pushMatrix();
    		this.scene.translate(0, 0, TORP.FIN_WIDTH/2);
    		this.scene.scale(TORP.FIN_THICKNESS/0.05, TORP.FIN_LENGTH/2.34, TORP.FIN_WIDTH/0.5);
    		this.scene.rotate(Math.PI, 0, 1, 0);
    		this.rudder.display();
    	this.scene.popMatrix();

    this.scene.popMatrix();
}


function getRotAng(newOrientation, originalOrientation) {
    let delta = sub_vecs(newOrientation, originalOrientation);

    let opposingLeg = delta[2];
    let hypotenuse = Math.sqrt(delta[0]*delta[0] + delta[1]*delta[1] + delta[2]*delta[2]);
	if (hypotenuse == 0) {
		return 0;
	}
    let ang = Math.asin(opposingLeg / hypotenuse);
    return ang;
}

// Torpedo must have a target set.
MyTorpedo.prototype._initTrajectory = function() {
	this.totalDistance = Math.sqrt(Math.pow(this.target.x - this.x, 2)
								+ Math.pow(this.target.y - this.y, 2)
								+ Math.pow(this.target.z - this.z, 2));
	let normalizedOrientation = normalize(getOrientationVector(this.xzOrientation, this.xyOrientation));
	this.P1 = [this.x, this.y, this.z];
	this.P2 = [this.target.x + 6*normalizedOrientation[0],
				this.target.y + 6*normalizedOrientation[1],
				this.target.z + 6*normalizedOrientation[2]];
	this.P3 = [this.target.x, this.target.y + 3, this.target.z];
	this.P4 = [this.target.x, this.target.y, this.target.z];
}

MyTorpedo.prototype._getPathTime = function(currTime) {
	if (this.startTime == -1) {
		this.startTime = currTime;
		return 0;
	}
	let milliT = (currTime - this.startTime) % (this.totalDistance / this.unitsPerSec * 1000);
	return milliT / 1000;
}

MyTorpedo.prototype._updateLocation = function(t) {
	let newPoint = [];
	for (i = 0; i < 3; i++) {
		let firstTerm = Math.pow(1-t, 3) * this.P1[i];
		let secondTerm = 3 * t * Math.pow(1-t, 2) * this.P2[i];
		let thirdTerm = 3 * t * t * (1-t) * this.P3[i];
		let fourthTerm = t * t * t * this.P4[i];
		newPoint[i] = firstTerm + secondTerm + thirdTerm + fourthTerm;
	}
	let deltaX = newPoint[0] - this.x;
	let deltaY = newPoint[1] - this.y;
	let deltaZ = newPoint[2] - this.z;
	if (deltaZ != 0) {
		this.xzOrientation = Math.atan(deltaX / deltaZ) / degToRad;
	}
//	let rotAng = Math.acos(dot_prod(newOri, this.direction))
//	this.update_r += [newPoint[0]-this.x, newPoint[1]-this.y, newPoint[2]-this.z];
	this.x = newPoint[0];
	this.y = newPoint[1];
	this.z = newPoint[2];
}

MyTorpedo.prototype.lockTarget = function(target) {
	this.target = target;
	this._initTrajectory();
}


MyTorpedo.prototype.update = function(currTime) {
	this.t = this._getPathTime(currTime);
	this._updateLocation(this.t);
}

MyTorpedo.prototype.collidedWithTarget = function(target) {
	let delta = Math.pow(10, -1);
	return Math.abs(this.t - 1) <= delta;
}
