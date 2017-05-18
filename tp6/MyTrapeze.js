// These commented variables may not work as expected by directly changing them.
// Big height: 2.34
// Small height: 1.64
// Width: 0.5

let BIG_HEIGHT = 2.34;
let SMALL_HEIGHT = 1.64
let WIDTH = 0.5;
let THICKNESS = 0.09;
let TOP_ANGLE = WIDTH * Math.cos(45 * degToRad);

function MyTrapeze(scene) {
	CGFobject.call(this,scene);

	this.minS = 0;
	this.maxS = 1;
	this.minT = 0;
	this.maxT = 1;

	this.initBuffers();
};

MyTrapeze.prototype = Object.create(CGFobject.prototype);
MyTrapeze.prototype.constructor = MyTrapeze;

MyTrapeze.prototype.initBuffers = function () {
	this.vertices = [
            -THICKNESS/2, -1.17, 0.25,
            THICKNESS/2, -1.17, 0.25,
            -THICKNESS/2, 1.17, 0.25,
            THICKNESS/2, 1.17, 0.25, //Face frente  0 a 3
            -THICKNESS/2, -0.82, -0.25,
            THICKNESS/2, -0.82, -0.25,
            -THICKNESS/2, 0.82, -0.25,
            THICKNESS/2, 0.82, -0.25,  //Face tras  4 a 7
            THICKNESS/2, -1.17, 0.25,
            THICKNESS/2, -0.82, -0.25,
			THICKNESS/2, 1.17, 0.25,
			THICKNESS/2, 0.82, -0.25, //Face direita   8 a 11
			-THICKNESS/2, -1.17, 0.25,
			-THICKNESS/2, -0.82, -0.25,
			-THICKNESS/2, 1.17, 0.25,
			-THICKNESS/2, 0.82, -0.25, //Face esquerda   12 a 15
			-THICKNESS/2, -1.17, 0.25,
			THICKNESS/2, -1.17, 0.25,
			-THICKNESS/2, -0.82, -0.25,
			THICKNESS/2, -0.82, -0.25, //Face baixo   16 a 19
			-THICKNESS/2, 1.17, 0.25,
			THICKNESS/2, 1.17, 0.25,
			-THICKNESS/2, 0.82, -0.25,
			THICKNESS/2, 0.82, -0.25,  // Face cima    20 a 23
	];

	this.indices = [
           0,1,2,
           1,3,2, //Face da frente
           8,9,11,
           8,11,10, //Face da direita
           12,15,13,
           12,14,15, //Face da esquerda
           4,6,5,
           5,6,7, //Face da tras
           16,19,17,
           16,18,19, //Face de baixo
           20,21,23,
           20,23,22 //Face de cima
         ];

	this.normals = [
 	0,0,1,
 	0,0,1,
 	0,0,1,
 	0,0,1,
 	0,0,-1,
 	0,0,-1,
 	0,0,-1,
 	0,0,-1,
 	1,0,0,
 	1,0,0,
 	1,0,0,
 	1,0,0,
 	-1,0,0,
 	-1,0,0,
 	-1,0,0,
 	-1,0,0,
 	0, Math.sin(-TOP_ANGLE), Math.cos(-TOP_ANGLE),
 	0, Math.sin(-TOP_ANGLE), Math.cos(-TOP_ANGLE),
 	0, Math.sin(-TOP_ANGLE), Math.cos(-TOP_ANGLE),
 	0, Math.sin(-TOP_ANGLE), Math.cos(-TOP_ANGLE),
 	0, Math.sin(TOP_ANGLE), Math.cos(TOP_ANGLE),
 	0, Math.sin(TOP_ANGLE), Math.cos(TOP_ANGLE),
 	0, Math.sin(TOP_ANGLE), Math.cos(TOP_ANGLE),
 	0, Math.sin(TOP_ANGLE), Math.cos(TOP_ANGLE),
 	];

	this.texCoords = [
		this.minS, this.maxT ,
    	this.maxS/2, this.maxT ,
   		this.minS, this.minT ,
   		this.maxS/2, this.minT, //frente
    	this.minS/2, this.maxT/2 ,
    	this.maxS/4, this.maxT/2 ,
    	this.minS/2, this.minT/2 ,
    	this.maxS/4, this.minT/2, //tras
    	this.maxS/2, this.maxT ,
    	this.maxS/4, this.maxT/2 ,
    	this.minS, this.minT ,
		this.minS/2, this.minT/2 ,//direita
		this.minS, this.maxT ,
		this.minS/2, this.maxT/2 ,
		this.maxS/2, this.minT,
		this.maxS/4, this.minT/2,//esquerda
		this.minS, this.maxT ,
    	this.maxS/2, this.maxT ,
		this.minS/2, this.maxT/2 ,
    	this.maxS/4, this.maxT/2 , //baixo
    	this.minS, this.minT ,
    	this.maxS/2, this.minT,
		this.minS/2, this.minT/2 ,
    	this.maxS/4, this.minT/2  //cima
	];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
