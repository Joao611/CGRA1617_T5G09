// Center: Origin
// Radius: 1
// Normal: (0,0,1)

function MyCircle(scene, sides) {
	CGFobject.call(this,scene);

    this.sides = sides;

    this.initBuffers();
}

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

function calculateAng(n) {
	return 2 * Math.PI / n;
}

MyCircle.prototype.initBuffers = function() {
    let ang = calculateAng(this.sides);
    
    this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

    this.vertices.push(0,0,0);
    this.normals.push(0,0,1);
    this.texCoords.push(0.5,0.5);

    for (i = 0; i < this.sides; i++) {
        this.vertices.push(Math.cos(ang * i), Math.sin(ang * i), 0);
        this.normals.push(0, 0, 1);
		this.texCoords.push(Math.cos(ang * i) / 2 + 0.5, 1 - (Math.sin(ang * i) / 2 + 0.5));
		this.indices.push(0, 1 + i % this.sides, 1 + (i + 1) % this.sides);
     }

    this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}