function MyClock(scene) {
	CGFobject.call(this, scene);
	
	this.scene = scene;
	this.clockHeight = 0.2;
    this.slices = 12;
    this.stacks = 1;

    this.working = 1;

	this.cylinder = new MyCylinder(scene, this.slices, this.stacks);
	this.face = new MyCircle(scene, this.slices);
	this.hourHand = new MyClockHand(scene, 0.15);
	this.minuteHand = new MyClockHand(scene, 0.05);
	this.secondHand = new MyClockHand(scene, 0.02);

	// 3 hours, 30 minutes, 45 seconds
	this.hourHand.setAngle(-90);
	this.minuteHand.setAngle(180);
	this.secondHand.setAngle(90);

	this.initBuffers();
};

MyClock.prototype = Object.create(CGFobject.prototype);
MyClock.prototype.constructor = MyClock;


MyClock.prototype.work = function (work) {
	this.working = work;
}

MyClock.prototype.display = function () {
	this.scene.pushMatrix();
 		this.scene.clockSideAppearance.apply();
		this.scene.scale(1, 1, this.clockHeight);
  		this.cylinder.display();
    this.scene.popMatrix();
	
	this.scene.pushMatrix();
 		this.scene.clockFaceAppearance.apply();
 		this.scene.translate(0, 0, this.clockHeight);
  		this.face.display();
  	this.scene.popMatrix();

  	this.scene.pushMatrix();
  		this.scene.clockHandsAppearance.apply();
  		this.scene.translate(0, 0, 0.25);
  		this.scene.scale(0.4, 0.4, 1);
  		this.hourHand.display();
  	this.scene.popMatrix();

  	this.scene.pushMatrix();
  		this.scene.clockHandsAppearance.apply();
  		this.scene.translate(0, 0, 0.25);
  		this.scene.scale(0.6, 0.6, 1);
  		this.minuteHand.display();
  	this.scene.popMatrix();

  	this.scene.pushMatrix();
  		this.scene.clockHandsAppearance.apply();
  		this.scene.translate(0, 0, 0.25);
  		this.scene.scale(0.9, 0.9, 1);
  		this.secondHand.display();
  	this.scene.popMatrix();
    
    this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
}

MyClock.prototype.update = function(currTime) {

	if (!this.working)
		return;
	
	let seconds = (currTime / 1000) % 60;
	let minutes = (currTime / (1000 * 60)) % 60;
	let hours = (currTime / (1000 * 60 * 60)) % 24;
	
	let hourAngle = hours * 30;
	let minuteAngle = -minutes * 6;
	let secondAngle = -seconds * 6;

	this.hourHand.setAngle(hourAngle);
	this.minuteHand.setAngle(minuteAngle);
	this.secondHand.setAngle(secondAngle);
}