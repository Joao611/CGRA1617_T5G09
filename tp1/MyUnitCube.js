function MyUnitCube(scene) {
	CGFobject.call(this,scene);

	this.initBuffers();
};

MyUnitCube.prototype = Object.create(CGFobject.prototype);
MyUnitCube.prototype.constructor=MyUnitCube;

MyUnitCube.prototype.initBuffers = function () {
	this.vertices = [
            -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,
            // lower plane

            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
            -0.5,  0.5, -0.5,
            // Upper Plane
			];

	this.indices = [
           // front
		   0, 1, 2,
		   2, 3, 0,
		   // top
		   1, 5, 6,
		   6, 2, 1,
		   // back
		   7, 6, 5,
		   5, 4, 7,
		   // bottom
		   4, 0, 3,
		   3, 7, 4,
		   // left
		   4, 5, 1,
		   1, 0, 4,
		   // right
		   3, 2, 6,
		   6, 7, 3,

        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
