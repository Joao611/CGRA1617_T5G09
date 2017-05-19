let TARGET_SIZE = 0.5;

function MyTarget(scene, x, y, z) {
	CGFobject.call(this, scene);

	this.x = x;
	this.y = y;
	this.z = z;

	this.object = new MyUnitCubeQuad(this.scene);
}

MyTarget.prototype = Object.create(CGFobject.prototype);
MyTarget.prototype.constructor = MyTarget;

MyTarget.prototype.display = function() {
    this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        this.scene.scale(TARGET_SIZE, TARGET_SIZE, TARGET_SIZE);
        this.object.display();
    this.scene.popMatrix();
}