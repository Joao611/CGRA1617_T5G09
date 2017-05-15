function MyPeriscope(scene, slices, stacks) {
	CGFobject.call(this, scene);

	this.tallCylinder = new MyCylinder(scene, slices, stacks);
	this.topCylinder = new MyCylinder(scene, slices, stacks);
}

MyPeriscope.prototype = Object.create(CGFobject.prototype);
MyPeriscope.prototype.constructor = MyPeriscope;

MyPeriscope.prototype.display = function() {
    this.scene.pushMatrix();
        this.tallCylinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.topCylinder.display();
    this.scene.popMatrix();
}