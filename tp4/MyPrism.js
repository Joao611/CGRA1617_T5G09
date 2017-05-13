/**
 * MyPrism
 * @constructor
 */
function MyPrism(scene, slices, stacks) {
	CGFobject.call(this, scene);

	this.slices = slices;
	this.stacks = stacks;

	this.initBuffers();
};

MyPrism.prototype = Object.create(CGFobject.prototype);
MyPrism.prototype.constructor = MyPrism;

function calculateAng(n) {
	return 2 * Math.PI / n;
}

MyPrism.prototype.initBuffers = function () {

	var ang = calculateAng(this.slices);
	var stack_height = 1/this.stacks;
	
	this.vertices = [];
	this.indices = [];
	this.normals = [];	

	// Duplicated vertices to have 2 normals on each real one.
	for(j = 0; j <= this.stacks; j++) {
		for (i = 0; i <= this.slices; i++) {
			this.vertices.push(Math.cos(ang * i), Math.sin(ang * i), j*stack_height);
			this.vertices.push(Math.cos(ang * i), Math.sin(ang * i), j*stack_height);
		}
	}
	
	for(j = 0; j <= this.stacks; j++) {
		for (i = 0; i <= this.slices; i++) {
		    this.normals.push(Math.cos(ang * i + ang/2), Math.sin(ang * i + ang/2), 0);
	    	this.normals.push(Math.cos(ang * i - ang/2), Math.sin(ang * i - ang/2), 0);
		}
	}
	
	var vertsPerRing = 2*(this.slices+1);
	for(j = 0; j < this.stacks; j++) {
		for (i = 0; i < this.slices; i++) {
			this.indices.push(j*vertsPerRing + 2*i, (j+1)*vertsPerRing + 2*i + 3, (j+1)*vertsPerRing + 2*i);
			this.indices.push(j*vertsPerRing + 2*i, j*vertsPerRing + 2*i + 3, (j+1)*vertsPerRing + 2*i + 3);
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};