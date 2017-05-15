let PERISCOPE_DIAMETER = 0.1;

function MyPeriscope(scene, slices, stacks, periscopeHeight) {
	CGFobject.call(this, scene);

	this.tallCylinder = new MyClosedCylinder(scene, slices, stacks);
	this.topCylinder = new MyClosedCylinder(scene, slices, stacks);

	this.periscopeHeight = periscopeHeight;
}

MyPeriscope.prototype = Object.create(CGFobject.prototype);
MyPeriscope.prototype.constructor = MyPeriscope;

MyPeriscope.prototype.display = function() {
    this.scene.pushMatrix();
    	this.scene.scale(PERISCOPE_DIAMETER/2, this.periscopeHeight, PERISCOPE_DIAMETER/2);
    	this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.tallCylinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.translate(0, this.periscopeHeight - PERISCOPE_DIAMETER/2, 0);
    	this.scene.scale(PERISCOPE_DIAMETER/2, PERISCOPE_DIAMETER/2, 0.15);
        this.topCylinder.display();
    this.scene.popMatrix();
}