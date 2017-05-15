function MyClosedCylinder(scene, slices, stacks) {
    CGFobject.call(this, scene);

    this.cylinderSide = new MyCylinder(scene, slices, stacks);
    this.cylinderTop = new MyCircle(scene, slices);
}

MyClosedCylinder.prototype = Object.create(CGFobject.prototype);
MyClosedCylinder.prototype.constructor = MyClosedCylinder;

MyClosedCylinder.prototype.display = function() {
    this.cylinderSide.display();

    this.scene.pushMatrix();
        this.scene.translate(0, 0, 1);
        this.cylinderTop.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.cylinderTop.display();
    this.scene.popMatrix();
}