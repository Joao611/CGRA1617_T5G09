/**
 * MyLamp
 * @constructor
 */
function MyLamp(scene, slices, stacks) {
	CGFobject.call(this, scene);

	this.slices = slices;
	this.stacks = stacks;

	this.initBuffers();
};

MyLamp.prototype = Object.create(CGFobject.prototype);
MyLamp.prototype.constructor = MyLamp;

function getSlicesAng(slices) {
	return 2 * Math.PI / slices;
}

function getStacksAng(stacks) {
	return Math.PI / 2 / stacks;
}

MyLamp.prototype.initBuffers = function () {

	var slicesAng = getSlicesAng(this.slices);
	var stacksAng = getStacksAng(this.stacks);
	var stackHeight = 1/this.stacks;
	
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	for (j = 0; j < this.stacks; j++) {
		var currentStackAng = Math.PI/2 - j*stacksAng;
		for (i = 0; i < this.slices; i++) {
			var currentSliceAng = i*slicesAng;
			var x = Math.sin(currentStackAng) * Math.cos(currentSliceAng);
			var y = Math.sin(currentStackAng) * Math.sin(currentSliceAng);
			var z = Math.cos(currentStackAng);
			this.vertices.push(x,y,z);
			this.normals.push(x,y,z);
			this.texCoords.push(x/2 + 0.5, y/2 + 0.5);
		}
	}
	// Top of the semi-sphere
	this.vertices.push(0,0,1);
	this.normals.push(0,0,1);
	this.texCoords.push(0.5, 0.5);
	
	var vertsPerRing = this.slices;
	for (j = 0; j < this.stacks - 1; j++) {
		for (i = 0; i < this.slices; i++) {
			this.indices.push(j*vertsPerRing + i % vertsPerRing, (j+1)*vertsPerRing + (i + 1) % vertsPerRing, (j+1)*vertsPerRing + i % vertsPerRing);
			this.indices.push(j*vertsPerRing + i % vertsPerRing, j*vertsPerRing + (i + 1) % vertsPerRing, (j+1)*vertsPerRing + (i + 1) % vertsPerRing);
		}
	}
	// Top of the semi-sphere
	for (i = 0; i < this.slices; i++) {
		var firstV = (this.stacks-1) * vertsPerRing + i % vertsPerRing;
		var secondV = (this.stacks-1) * vertsPerRing + (i + 1) % vertsPerRing;
		var topV = this.stacks * vertsPerRing;
		this.indices.push(firstV, secondV, topV);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};