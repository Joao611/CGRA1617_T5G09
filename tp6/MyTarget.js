let TARGET_SIZE = 0.5;

function MyTarget(scene, x, y, z) {
	CGFobject.call(this, scene);

	this.x = x;
	this.y = y;
	this.z = z;

	this.target_explode = false;
	this.radius = 1;

	this.object = new MyUnitCubeQuad(this.scene);
	this.explosion = new MyLamp(this.scene, 8,8);
}

MyTarget.prototype = Object.create(CGFobject.prototype);
MyTarget.prototype.constructor = MyTarget;

MyTarget.prototype.display = function() {
	if(this.target_explode == false){
    this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        this.scene.scale(TARGET_SIZE, TARGET_SIZE, TARGET_SIZE);
        this.object.display();
    this.scene.popMatrix();
}
else{
	this.scene.pushMatrix();
			this.scene.translate(this.x, this.y, this.z);
			this.scene.scale(this.radius, this.radius, this.radius);
			this.scene.explosionapp.apply();
			this.explosion.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
			this.scene.translate(this.x, this.y, this.z);
			this.scene.rotate(Math.PI, 1, 0 ,0);
			this.scene.scale(this.radius, this.radius, this.radius);
			this.scene.explosionapp.apply();
			this.explosion.display();
	this.scene.popMatrix();
}
}

MyTarget.prototype.update = function(currTime) {
	if(this.target_explode && this.radius > 0.001)
		this.radius -= 0.05;
	}
