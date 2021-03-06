/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, slices, stacks) {
	CGFobject.call(this, scene);

	this.slices = slices;
	this.stacks = stacks;

	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

function calculateAng(n) {
	return 2 * Math.PI / n;
}

MyCylinder.prototype.initBuffers = function () {

	var ang = calculateAng(this.slices);
	var stack_height = 1/this.stacks;
	
	this.vertices = [];
	this.indices = [];
	this.normals = [];	

	for(j = 0; j <= this.stacks; j++) {
		for (i = 0; i < this.slices; i++) {
			this.vertices.push(Math.cos(ang * i), Math.sin(ang * i), j*stack_height);
		}
	}
	
	for(j = 0; j <= this.stacks; j++) {
		for (i = 0; i < this.slices; i++) {
		    this.normals.push(Math.cos(ang * i), Math.sin(ang * i), 0);
		}
	}
	
	var vertsPerRing = this.slices;
	for(j = 0; j < this.stacks; j++) {
		for (i = 0; i < this.slices; i++) {
			this.indices.push(j*vertsPerRing + i % vertsPerRing, (j+1)*vertsPerRing + (i + 1) % vertsPerRing, (j+1)*vertsPerRing + i % vertsPerRing);
			this.indices.push(j*vertsPerRing + i % vertsPerRing, j*vertsPerRing + (i + 1) % vertsPerRing, (j+1)*vertsPerRing + (i + 1) % vertsPerRing);
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};