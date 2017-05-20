/**
 * MyTable
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTable(scene) {
	CGFobject.call(this,scene);

	this.cubeQuad = new MyUnitCubeQuad(this.scene);
};

MyTable.prototype = Object.create(CGFobject.prototype);
MyTable.prototype.constructor = MyTable;

MyTable.prototype.displayLeg = function() {
	this.scene.pushMatrix();
	this.scene.translate(0, 1.75, 0);
	this.scene.scale(0.3, 3.5, 0.3);
	this.cubeQuad.display();
	this.scene.popMatrix();
}

MyTable.prototype.displayLegs = function() {
	this.scene.pushMatrix();
	// Back left.
	this.scene.translate(-2.5+0.15, 0, -1.5+0.15);
	this.displayLeg();

	// Back right.
	this.scene.translate(4.7, 0, 0);
	this.displayLeg();

 	// Front right.
 	this.scene.translate(0, 0, 2.7);
 	this.displayLeg();

 	// Back right.
 	this.scene.translate(-4.7, 0, 0);
 	this.displayLeg();

	this.scene.popMatrix();
}

MyTable.prototype.displayCover = function() {
	this.scene.pushMatrix();
	this.scene.translate(0, 3.65, 0);
	this.scene.scale(5, 0.3, 3);
	this.cubeQuad.display();
	this.scene.popMatrix();
}

MyTable.prototype.display = function() {
    this.scene.pushMatrix();
    this.displayLegs();
	this.displayCover();
	this.scene.popMatrix();
}

MyTable.prototype.display_legs = function() {
    this.scene.pushMatrix();
    this.displayLegs();
	this.scene.popMatrix();
}

MyTable.prototype.display_cover = function() {
    this.scene.pushMatrix();
    this.displayCover();
	this.scene.popMatrix();
}
