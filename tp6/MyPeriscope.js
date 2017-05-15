let PERISCOPE_HEIGHT = 1.5;
let PERISCOPE_DIAMETER = 0.1;

function MyPeriscope(scene, slices, stacks) {
	CGFobject.call(this, scene);

	this.tallCylinder = new MyCylinder(scene, slices, stacks);
	this.topCylinder = new MyCylinder(scene, slices, stacks);
}

MyPeriscope.prototype = Object.create(CGFobject.prototype);
MyPeriscope.prototype.constructor = MyPeriscope;

MyPeriscope.prototype.display = function() {
    this.scene.pushMatrix();
    	this.scene.scale(PERISCOPE_DIAMETER, PERISCOPE_HEIGHT, PERISCOPE_DIAMETER);
    	this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.tallCylinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.translate(0, PERISCOPE_HEIGHT - PERISCOPE_DIAMETER, 0);
    	this.scene.scale(PERISCOPE_DIAMETER, PERISCOPE_DIAMETER, 0.2);
        this.topCylinder.display();
    this.scene.popMatrix();
}