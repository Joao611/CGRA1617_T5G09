/**
 * ObjLoader
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function ObjLoader(scene, obj_file) {
	CGFobject.call(this,scene);

    this.file = obj_file;

	this.initBuffers();
};

ObjLoader.prototype = Object.create(CGFobject.prototype);
ObjLoader.prototype.constructor=ObjLoader;

ObjLoader.prototype.initBuffers = function (obj) {
	var verts = [];

	

	this.indices = [
            0, 1, 2, 
			3, 2, 1,
			4 ,6, 5
        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
