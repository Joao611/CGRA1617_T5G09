/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyQuad(scene, minS, maxS, minT, maxT) {
	CGFobject.call(this,scene);
	
	this.minS = minS || 0;
	this.minT = minT || 0;
	this.maxS = maxS || 1;
	this.maxT = maxT || 1;

// 	if( typeof(minS) ==='undefined') this.minS = 0 ; else this.minS = minS;
// 	if( typeof(minT) ==='undefined') this.minT = 0 ; else this.minT = minT;
// 	if( typeof(maxS) ==='undefined') this.maxS = 1 ; else this.maxS = maxS;
// 	if( typeof(maxT) ==='undefined') this.maxT = 1 ; else this.minS = maxT;
	
	this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

MyQuad.prototype.initBuffers = function () {
	this.vertices = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, 0.5, 0
			];

	this.indices = [
            0, 1, 2, 
			3, 2, 1
        ];
	
	this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
	]

	this.texCoords = [
		this.minS, this.minT,
		this.maxS, this.minT,
		this.minS, this.maxT,
		this.maxS, this.maxT	
	]

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
