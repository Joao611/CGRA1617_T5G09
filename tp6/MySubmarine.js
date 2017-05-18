// Obligatory measurements
let CYLINDER_LENGTH = 4.08;
let CYLINDER_WIDTH = 0.73;
let TOTAL_LENGTH = 5;
let SEMISPHERE_LENGTH = (TOTAL_LENGTH - CYLINDER_LENGTH) / 2;
let PROP_DIAMETER = 0.4;
let TOWER_HEIGHT = 0.57;
let TOWER_LENGTH = 0.88;
let TOWER_ELEVATOR_BIG_LENGTH = 1.42;
let RUDDER_SMALL_HEIGHT = 1.64; // Unused.
let RUDDER_BIG_HEIGHT = 2.34;
let PROP_LENGTH = 0.3;
let PROP_OFFSET_LENGTH = 0.04;

// Custom measurements
let CYLINDER_HEIGHT = 1;
let TOWER_WIDTH = 0.55;
let PERISCOPE_HEIGHT = TOWER_HEIGHT;
let TOWER_ELEVATOR_WIDTH = TOWER_LENGTH/3;

function MySubmarine(scene) {
	CGFobject.call(this,scene);

	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.xzOrientation = 90; // degrees
	this.xyOrientation = 0; // degrees //TODO

	this.frontSphere = new MyLamp(scene, 12, 8);
	this.mainCylinder = new MyCylinder(scene, 12, 8);
	this.rearSphere = new MyLamp(scene, 12, 8);

	this.towerSide = new MyCylinder(scene, 12, 8);
	this.towerTop = new MyCircle(scene, 12);
	this.periscope = new MyPeriscope(scene, 12, 8, PERISCOPE_HEIGHT);

	this.propeller = new MyPropeller(scene, 12, 8);

	this.towerElevator = new MyTrapeze(scene);
	this.rearElevator = new MyTrapeze(scene);
	this.rudder = new MyTrapeze(scene);
};

MySubmarine.prototype = Object.create(CGFobject.prototype);
MySubmarine.prototype.constructor = MySubmarine;

MySubmarine.prototype.display = function() {
 	this.scene.pushMatrix();
 		this.scene.translate(-CYLINDER_LENGTH/2, 0, 0);
 		this.scene.scale(SEMISPHERE_LENGTH, CYLINDER_HEIGHT/2, CYLINDER_WIDTH/2);
 		this.scene.rotate(-Math.PI/2, 0, 1, 0);
 		this.rearSphere.display();
 	this.scene.popMatrix();

  	this.scene.pushMatrix();
  		this.scene.translate(-CYLINDER_LENGTH/2, 0, 0);
  		this.scene.scale(CYLINDER_LENGTH, CYLINDER_HEIGHT/2, CYLINDER_WIDTH/2);
 		this.scene.rotate(Math.PI/2, 0, 1, 0);
  		this.mainCylinder.display();
  	this.scene.popMatrix();

  	this.scene.pushMatrix();
  		this.scene.translate(CYLINDER_LENGTH/2, 0, 0);
 		this.scene.scale(SEMISPHERE_LENGTH, CYLINDER_HEIGHT/2, CYLINDER_WIDTH/2);
  		this.scene.rotate(Math.PI/2, 0, 1, 0);
  		this.frontSphere.display();
   	this.scene.popMatrix();

 	this.scene.pushMatrix();
 		this.scene.scale(TOWER_LENGTH/2, CYLINDER_HEIGHT/2 + TOWER_HEIGHT, TOWER_WIDTH/2);
 		this.scene.rotate(-Math.PI/2, 1, 0, 0);
 		this.towerSide.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 		this.scene.translate(0, CYLINDER_HEIGHT/2 + TOWER_HEIGHT, 0);
 		this.scene.scale(TOWER_LENGTH/2, 1, TOWER_WIDTH/2);
 		this.scene.rotate(-Math.PI/2, 1, 0, 0);
 		this.towerTop.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 		this.scene.translate(0, CYLINDER_HEIGHT, 0);
 		this.scene.rotate(Math.PI/2, 0, 1, 0);
  		this.periscope.display();
  	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-CYLINDER_LENGTH/2, -CYLINDER_HEIGHT/4, -CYLINDER_WIDTH/2 - PROP_DIAMETER/2);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.scale(PROP_DIAMETER/2, PROP_DIAMETER/2,  PROP_LENGTH);
		this.propeller.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-CYLINDER_LENGTH/2, -CYLINDER_HEIGHT/4, CYLINDER_WIDTH/2 + PROP_DIAMETER/2);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.scale(PROP_DIAMETER/2, PROP_DIAMETER/2,  PROP_LENGTH);
		this.propeller.display();
	this.scene.popMatrix();

	// Tower Elevator
	// 0.5 = trapezoid width
	this.scene.pushMatrix();
		this.scene.translate(0, CYLINDER_HEIGHT/2 + TOWER_HEIGHT/2, 0);
		this.scene.scale(TOWER_ELEVATOR_WIDTH/0.5, 1, TOWER_ELEVATOR_BIG_LENGTH/2.34);
		this.scene.rotate(-Math.PI/2, 0, 0, 1);
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.towerElevator.display();
	this.scene.popMatrix();

	// Rudder
	// 2.34 = trapezoid height
	this.scene.pushMatrix();
		this.scene.translate(-CYLINDER_LENGTH/2, 0, 0);
		this.scene.scale(-1, RUDDER_BIG_HEIGHT/2.34, -1);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.rudder.display();
	this.scene.popMatrix();

	// Rear Elevator
	this.scene.pushMatrix();
		this.scene.translate(-CYLINDER_LENGTH/2, 0, 0);
		this.scene.scale(1, 1, RUDDER_BIG_HEIGHT/2.34);
		this.scene.rotate(-Math.PI/2, 0, 0, 1);
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.rearElevator.display();
	this.scene.popMatrix();
}
