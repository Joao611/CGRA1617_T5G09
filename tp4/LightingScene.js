var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

var BOARD_A_DIVISIONS = 30;
var BOARD_B_DIVISIONS = 100;

function LightingScene() {
	CGFscene.call(this);
}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);

	this.initCameras();
	this.enableTextures(true);
	this.initLights();

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);

	// Scene elements
	this.leftWall = new MyQuad(this, -0.5, 1.5, 1.5, -0.5);
	this.wall = new Plane(this);
	this.floor = new MyQuad(this, 0, 10, 0, 12);
	this.ceiling = new Plane(this);

	this.lamp = new MyLamp(this, 8, 4);
	this.table = new MyTable(this);
	this.prism = new MyPrism(this, 8, 4);
	this.cylinder = new MyCylinder(this, 8, 4);
	this.cylinder2 = new MyCylinder(this, 8, 4);

	this.boardA = new Plane(this, BOARD_A_DIVISIONS);
	this.boardB = new Plane(this, BOARD_B_DIVISIONS, 512/372);

	// Materials
	this.materialDefault = new CGFappearance(this);

	this.floorAppearance = new CGFappearance(this);
	this.floorAppearance.loadTexture("floor.png");

	this.windowAppearance = new CGFappearance(this);
	this.windowAppearance.loadTexture("window.png");
	this.windowAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

	this.tableAppearance = new CGFappearance(this);
	this.tableAppearance.setDiffuse(0.7,0.7,0.7,1);
	this.tableAppearance.setSpecular(0.1,0.1,0.1,1);
	this.tableAppearance.loadTexture("table.png");

	this.boardAppearance = new CGFappearance(this);
	this.boardAppearance.setDiffuse(0.3,0.3,0.3,1);
	this.boardAppearance.setSpecular(0.7,0.7,0.7,1);
	this.boardAppearance.setShininess(120);
	this.boardAppearance.loadTexture("board.png");
	//this.boardAppearance.setTextureWrap('MIRRORED_REPEAT', 'MIRRORED_REPEAT');

	this.slidesApparence = new CGFappearance(this);
	this.slidesApparence.setDiffuse(0.7,0.7,0.7,1);
	this.slidesApparence.setSpecular(0.1,0.1,0.1,1);
	this.slidesApparence.setShininess(40);
	this.slidesApparence.loadTexture("slides.png");
	this.slidesApparence.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

	this.columApperance = new CGFappearance(this);
	this.columApperance.setDiffuse(0.7,0.7,0.7,1);
	this.columApperance.setSpecular(0.1,0.1,0.1,1);
	this.columApperance.setShininess(40);
	this.columApperance.loadTexture("stone.jpg");
	this.columApperance.setTextureWrap('REPEAT', 'REPEAT');

	this.materialA = new CGFappearance(this);
	this.materialA.setAmbient(0.3,0.3,0.3,1);
	this.materialA.setDiffuse(0.6,0.6,0.6,1);
	this.materialA.setSpecular(0,0,0.8,1);
	this.materialA.setShininess(120);

	this.materialB = new CGFappearance(this);
	this.materialB.setAmbient(0.3,0.3,0.3,1);
	this.materialB.setDiffuse(0.6,0.6,0.6,1);
	this.materialB.setSpecular(0.8,0.8,0.8,1);
	this.materialB.setShininess(120);

	this.materialTop = new CGFappearance(this);
	this.materialTop.setAmbient(0.3,0.3,0.3,1);
	this.materialTop.setDiffuse(0.67,0.44,0.22,1);
	this.materialTop.setSpecular(0,0,0.2,1);
	this.materialTop.setShininess(30);

	this.materialLeg = new CGFappearance(this);
	this.materialLeg.setAmbient(0.3,0.3,0.3,1);
	this.materialLeg.setDiffuse(0.6,0.6,0.6,1);
	this.materialLeg.setSpecular(0.8,0.8,0.8,1);
	this.materialLeg.setShininess(120);

	this.material_A_Escolha_Dos_Materias_Para_o_Chao_e_Paredes_e_Livre = new CGFappearance(this);
	this.material_A_Escolha_Dos_Materias_Para_o_Chao_e_Paredes_e_Livre.setAmbient(0.3,0.3,0.3,1);
	this.material_A_Escolha_Dos_Materias_Para_o_Chao_e_Paredes_e_Livre.setDiffuse(0.1,0.6,0.2,1);
	this.material_A_Escolha_Dos_Materias_Para_o_Chao_e_Paredes_e_Livre.setSpecular(0.8,0.2,0.2,1);
	this.material_A_Escolha_Dos_Materias_Para_o_Chao_e_Paredes_e_Livre.setShininess(50);
	this.material_A_Escolha_Dos_Materias_Para_o_Chao_e_Paredes_e_Livre.loadTexture("wall_texture.jpg");
};

LightingScene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
};

LightingScene.prototype.initLights = function() {
	this.setGlobalAmbientLight(0.3, 0.3, 0.3, 1.0);

	// Positions for four lights
	this.lights[0].setPosition(4, 6, 1, 1);
	this.lights[0].setVisible(true); // show marker on light position (different from enabled)

	this.lights[1].setPosition(10.5, 6.0, 1.0, 1.0);
	this.lights[1].setVisible(true); // show marker on light position (different from enabled)

	this.lights[2].setPosition(10.5, 6.0, 5.0, 1.0);
	this.lights[2].setVisible(true);

	//this.lights[1].setVisible(true); // show marker on light position (different from enabled)
	this.lights[3].setPosition(4, 6.0, 5.0, 1.0);
	this.lights[3].setVisible(true); // show marker on light position (different from enabled)

	this.lights[0].setAmbient(0, 0, 0, 1);
	this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].setSpecular(1.0, 1.0, 0.0, 1.0);
	this.lights[0].enable();

	this.lights[1].setAmbient(0, 0, 0, 1);
	this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[1].enable();

	this.lights[2].setAmbient(0, 0, 0, 1);
	this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[2].setSpecular(1.0, 1.0, 1.0, 1.0);
	this.lights[2].setConstantAttenuation(0.0);
	//this.lights[2].setLinearAttenuation(0.2);
	this.lights[2].setLinearAttenuation(1.0);
	this.lights[2].setQuadraticAttenuation(0.0);
	this.lights[2].enable();

	this.lights[3].setAmbient(0, 0, 0, 1);
	this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[3].setSpecular(1.0, 1.0, 1.0, 1.0);
	this.lights[3].setConstantAttenuation(0.0);
	//this.lights[2].setLinearAttenuation(0.2);
	this.lights[3].setLinearAttenuation(0.0);
	this.lights[3].setQuadraticAttenuation(0.2);
	this.lights[3].enable();

	this.lights[4].setPosition(0, 4, 6, 1.0);
	this.lights[4].setVisible(false);
	//this.lights[4].setConstantAttenuation(0.0);
	//this.lights[4].setLinearAttenuation(0.0);
	//this.lights[4].setQuadraticAttenuation(0.2);
	this.lights[4].setAmbient(0.0, 0.0, 0.0, 1.0);
	this.lights[4].setSpecular(0.5, 0.5, 0.5, 1.0);
	this.lights[4].setDiffuse(0.5, 0.5, 0.5, 1.0);
	this.lights[4].enable();

	console.log(this.lights);
};

LightingScene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
}


LightingScene.prototype.display = function() {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation)
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Update all lights used
	this.updateLights();

	// Draw axis
	this.axis.display();

	this.materialDefault.apply();

	// ---- END Background, camera and axis setup


	// ---- BEGIN Geometric transformation section

	// ---- END Geometric transformation section


	// ---- BEGIN Primitive drawing section

	// Floor
	this.pushMatrix();
		this.translate(7.5, 0, 7.5);
		this.rotate(-90 * degToRad, 1, 0, 0);
		this.scale(15, 15, 0.2);
		this.floorAppearance.apply();
		this.floor.display();
	this.popMatrix();

	// Left Wall
	this.pushMatrix();
		this.translate(0, 4, 7.5);
		this.rotate(90 * degToRad, 0, 1, 0);
		this.scale(15, 8, 0.2);
		this.windowAppearance.apply();
		this.leftWall.display();
	this.popMatrix();

	// Plane Wall
	this.pushMatrix();
		this.translate(7.5, 4, 0);
		this.scale(15, 8, 0.2);
		this.material_A_Escolha_Dos_Materias_Para_o_Chao_e_Paredes_e_Livre.apply();
		this.wall.display();
	this.popMatrix();

	// Ceiling
	this.pushMatrix();
		this.translate(7.5, 8, 7.5);
		this.rotate(90 * degToRad, 1, 0, 0);
		this.scale(15, 15, 0.2);
		this.ceiling.display();
	this.popMatrix();

	// Lamp
	this.pushMatrix();
		this.translate(7,8,7);
		this.scale(0.5,0.3,0.5);
		this.rotate(Math.PI/2, 1,0,0);
		this.lamp.display();
	this.popMatrix();

	/*// Prism
	this.pushMatrix();
		this.translate(2, 0, 1);
		this.scale(0.3, 0.2, 0.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.prism.display();
	this.popMatrix(); */

	// Cylinder
	this.pushMatrix();
		this.translate(3, 0, 13);
		this.scale(1, 8, 1);
		this.columApperance.apply();
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.cylinder.display();
	this.popMatrix();

	this.pushMatrix();
		this.translate(12, 0, 13);
		this.scale(1, 8, 1);
		this.columApperance.apply();
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.cylinder2.display();
	this.popMatrix();

	// First Table
	this.pushMatrix();
		this.translate(5, 0, 8);
		this.tableAppearance.apply();
		this.table.display_cover();
	this.popMatrix();
	this.pushMatrix();
		this.translate(5, 0, 8);
		this.materialLeg.apply();
		this.table.display_legs();
	this.popMatrix();

	// Second Table
	this.pushMatrix();
		this.translate(12, 0, 8);
		this.tableAppearance.apply();
		this.table.display_cover();
	this.popMatrix();
	this.pushMatrix();
		this.translate(12, 0, 8);
		this.materialLeg.apply();
		this.table.display_legs();
	this.popMatrix();

	// Board A
	this.pushMatrix();
		this.translate(4, 4.5, 0.2);

		this.slidesApparence.apply();
		this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);

		//this.materialA.apply();

		this.boardA.display();
	this.popMatrix();

	// Board B
	this.pushMatrix();
		this.translate(10.5, 4.5, 0.2);
		this.boardAppearance.apply();
		this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
		this.boardB.display();
	this.popMatrix();

	// ---- END Primitive drawing section
};
