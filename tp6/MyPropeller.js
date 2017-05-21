// Center: Origin
// Blade Starting Orientation: Horizontal

let CENTER_DIAMETER = 0.4;
let BLADE_LENGTH = 1.7 // diameter
let BLADE_WIDTH = CENTER_DIAMETER;
let BLADE_THICKNESS = 0.05;

function MyPropeller(scene, slices, stacks) {
    CGFobject.call(this,scene);

    this.centerSphereHalf = new MyLamp(scene, slices, stacks);
    this.blade = new MyUnitCubeQuad(scene);
    this.casing = new MyTwoSidedCylinder(scene, slices, stacks);

    this.s_angle = 0;
    this.angle = 0;

}

MyPropeller.prototype = Object.create(CGFobject.prototype);
MyPropeller.prototype.constructor = MyPropeller;

MyPropeller.prototype.display = function() {
    this.scene.pushMatrix();
        this.scene.scale(CENTER_DIAMETER/2, CENTER_DIAMETER/2, CENTER_DIAMETER/2);
        this.centerSphereHalf.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.scale(CENTER_DIAMETER/2, CENTER_DIAMETER/2, CENTER_DIAMETER/2);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.centerSphereHalf.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.rotate(Math.PI*2*this.angle, 0, 0, 1);
        this.scene.scale(BLADE_LENGTH, BLADE_WIDTH, BLADE_THICKNESS);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.blade.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.casing.display();
    this.scene.popMatrix();
}

// Angle in degrees.
MyPropeller.prototype.set_s_angle = function(angle) {
    
    this.s_angle = angle;
}
