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

function MyTorpedo(scene, x, y, z, orientation) {
    CGFobject.call(this, scene);

    this.x = x;
    this.y = y;
    this.z = z;
    this.orientation = orientation.slice();
    this.originalOrientation = orientation.slice();

    this.target;

    this.frontSphere = new MyLamp(scene, 12, 8);
	this.mainCylinder = new MyCylinder(scene, 12, 8);
	this.rearSphere = new MyLamp(scene, 12, 8);

	this.rudder = new MyTrapeze(scene);
	this.elevator = new MyTrapeze(scene);
}

MyTorpedo.prototype = Object.create(CGFobject.prototype);
MyTorpedo.prototype.constructor = MyTorpedo;

MyTorpedo.prototype.display = function() {
    let rotAng = getRotAng(this.orientation, this.originalOrientation);
    let rotAxis = crossProduct(this.originalOrientation, this.orientation);
	
	this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
     	this.scene.rotate(rotAng, rotAxis[0], rotAxis[1], rotAxis[2]);

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