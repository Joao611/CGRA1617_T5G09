function MyClockHand(scene, handWidth) {
	CGFobject.call(this, scene);
    this.scene = scene;

    this.handWidth = handWidth;

    this.angle = 0; // radians
    this.hand = new MyQuad(scene);
}

MyClockHand.prototype = Object.create(CGFobject.prototype);
MyClockHand.prototype.constructor = MyClockHand;

MyClockHand.prototype.display = function() {
    this.scene.pushMatrix();
        this.scene.rotate(this.angle, 0, 0, 1);
        this.scene.translate(0, 0.5, 0);
        this.scene.scale(this.handWidth, 1, 1);
        this.hand.display();
    this.scene.popMatrix();
}

// Angle in degrees.
MyClockHand.prototype.setAngle = function(angle) {
    let radAngle = angle * Math.PI / 180;
    this.angle = radAngle;
}