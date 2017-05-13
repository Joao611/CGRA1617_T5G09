/**
 * myFloor
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function myFloor(scene) {
	CGFobject.call(this,scene);

	this.cubeQuad = new MyUnitCubeQuad(this.scene);
};

myFloor.prototype = Object.create(CGFobject.prototype);
myFloor.prototype.constructor = myFloor;

myFloor.prototype.displayLeg = function() {
	this.scene.pushMatrix();
	this.scene.translate(0, 1.75, 0);
	this.scene.scale(0.3, 3.5, 0.3);
	this.cubeQuad.display();
	this.scene.popMatrix();
}

myFloor.prototype.displayCover = function() {
	this.scene.pushMatrix();
	this.scene.translate(2.5, 3.65, 1.5);
	this.scene.scale(5, 0.3, 3);
	this.cubeQuad.display();
	this.scene.popMatrix();
}

myFloor.prototype.display = function() {
    this.scene.pushMatrix();
	this.scene.scale(8, 0.1, 6);
	this.cubeQuad.display();
	this.scene.popMatrix();
}