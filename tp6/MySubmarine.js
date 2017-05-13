function MySubmarine(scene) {
	CGFobject.call(this,scene);

	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.xzOrientation = 90; // degrees
	this.xyOrientation = 0; // degrees

	this.initBuffers();
};

MySubmarine.prototype = Object.create(CGFobject.prototype);
MySubmarine.prototype.constructor = MySubmarine;

MySubmarine.prototype.initBuffers = function() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    this.vertices.push(0.5, 0.3, 0);
    this.vertices.push(-0.5, 0.3, 0);
    this.vertices.push(0, 0.3, 2);

    this.normals.push(0, 1, 0);
    this.normals.push(0, 1, 0);
    this.normals.push(0, 1, 0);
    
    this.indices.push(2, 0, 1);

    this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}