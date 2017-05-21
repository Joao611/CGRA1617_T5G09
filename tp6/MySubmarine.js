// Obligatory measurements
let CYLINDER_LENGTH = 4.08;
let CYLINDER_WIDTH = 0.73;
let TOTAL_LENGTH = 5;
let SEMISPHERE_LENGTH = (TOTAL_LENGTH - CYLINDER_LENGTH) / 2;
let PROP_DIAMETER = 0.4;
let TOWER_HEIGHT = 0.57;
let TOWER_LENGTH = 0.88;
let TOWER_ELEVATOR_BIG_LENGTH = 1.42;
let RUDDER_SMALL_HEIGHT = 1.64; // Unused.
let RUDDER_BIG_HEIGHT = 2.34;
let PROP_LENGTH = 0.3;
let PROP_OFFSET_LENGTH = 0.04;

let VEL_CONST = 1000000;

// Custom measurements
let CYLINDER_HEIGHT = 1;
let TOWER_WIDTH = 0.55;
let PERISCOPE_HEIGHT = TOWER_HEIGHT;
let TOWER_ELEVATOR_WIDTH = TOWER_LENGTH / 3;



function sub_vecs(vec1, vec2 ){

    var res = [0, 0, 0];

    for (var i = 0; i < 3; i++) {
        res[i] = vec1[i] - vec2[i];
    }
    return res;
}

function normalize(vec1) {

    var res = [0, 0, 0];
    let length = Math.sqrt(vec1[0] * vec1[0] + vec1[1] * vec1[1] + vec1[2] * vec1[2]);
    if (length == 0)
        return vec1;

    for (var i = 0; i < 3; i++) {
        res[i] = vec1[i] / length;
    }
    return res;
}

function m_multiply(a, b) {
	var aNumRows = a.length;
	var aNumCols = a[0].length;
  	var bNumRows = b.length;
	var bNumCols = b[0].length;
	var m = new Array(aNumRows);  // initialize array of rows

	for (var r = 0; r < aNumRows; ++r) {
    	m[r] = new Array(bNumCols); // initialize the current row
    	for (var c = 0; c < bNumCols; ++c) {
    		m[r][c] = 0;             // initialize the current cell
    		for (var i = 0; i < aNumCols; ++i) {
        		m[r][c] += a[r][i] * b[i][c];
      		}
    	}
  	}
  return m;
}

function scal_mul(mat, k) {
    var res = mat;
    for (var i = 0; i < 3; i++) {
        for (var k = 0; k < 3; k++) {
            res[i][k] *= k;
        }
    }
    return res;
}

function dot_prod(vec1, vec2) {
    return (vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2]);
}

function vec_norm(vec){
	return Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1] +vec[2]*vec[2]  );
}

function crossProduct(a, b) {

    // Check lengths
    if (a.length != 3 || b.length != 3) {
        return;
    }

    return [a[1] * b[2] - a[2] * b[1],
        	a[2] * b[0] - a[0] * b[2],
        	a[0] * b[1] - a[1] * b[0]
    ];

}

/*
function compute_orientation(ori_vec, vel_vec){
	 let v = vec3.create() //crossProduct(ori_vec, vel_vec);
	 let s = vec_norm(v) * Math.sin(Math.acos(dot_prod(ori_vec, vel_vec)/(vec_norm(ori_vec)*vec_norm(vel_vec))));
	 let c = crossProduct(a, b)* dot_prod(ori_vec, vel_vec)/(vec_norm(ori_vec)*vec_norm(vel_vec));
	 let v_s = skew_mat(v);
	 let l = 1/(1+c);
	 let lr = scal_mul(m_multiply(v_s,v_s), l);

	 let i = [ [1,1,1], [1,1,1] , [1,1,1]];

	 return (add_matrix( add_matrix(i, v_s), lr));
} */


function MySubmarine(scene) {
    CGFobject.call(this, scene);

    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.xzOrientation = 90; // degrees
    this.xyOrientation = 0; // degrees //TODO
    this.speed = 1;

//     this.vel_vec = [-1, 0, 0];
//     this.update_vec = [0, 0, 0];
//     this.update_vec_r = [0, 0, 0];
//     this.init_ori = [-1, 0, 0];

    this.rot_matrix;

    this.oldtime = 0;
    this.time = 0;

		this.peris_height = 0;

		this.rudder_r = 0;
		this.elevator_r = 0;

    this.frontSphere = new MyLamp(scene, 12, 8);
    this.mainCylinder = new MyCylinder(scene, 12, 8);
    this.rearSphere = new MyLamp(scene, 12, 8);

    this.towerSide = new MyCylinder(scene, 12, 8);
    this.towerTop = new MyCircle(scene, 12);
    this.periscope = new MyPeriscope(scene, 12, 8, PERISCOPE_HEIGHT);

    this.propeller = new MyPropeller(scene, 12, 8);

    this.towerElevator = new MyTrapeze(scene);
    this.rearElevator = new MyTrapeze(scene);
    this.rudder = new MyTrapeze(scene);
};

MySubmarine.prototype = Object.create(CGFobject.prototype);
MySubmarine.prototype.constructor = MySubmarine;

MySubmarine.prototype.display = function() {

	//	var old_pos = this.update_vec.slice(0);

//let vec_length = vec_norm(this.update_vec);

/*    this.scene.rotate(this.update_vec_r[0]/vec_length, 1, 0, 0);
    this.scene.rotate(this.update_vec_r[1]/vec_length, 0, 1, 0);
    this.scene.rotate(this.update_vec_r[2]/vec_length, 0, 0, 1);
*/



//	this.scene.translate(this.update_vec[0], this.update_vec[1], this.update_vec[2]);

// 	this.scene.rotate(this.update_vec_r[0], 1, 0, 0);
// 	this.scene.rotate(this.update_vec_r[1], 0, 1, 0);
// 	this.scene.rotate(this.update_vec_r[2], 0, 0, 1);

	this.scene.translate(this.x, this.y, this.z);
	this.scene.rotate(-this.xyOrientation * degToRad, 0, 0, 1);
	this.scene.rotate(-this.xzOrientation * degToRad, 0, 1, 0);

    this.scene.pushMatrix();



    //	this.scene.translate((CYLINDER_LENGTH/2) - PROP_OFFSET_LENGTH,0,0);

    //		this.scene.translate(-(CYLINDER_LENGTH/2) - PROP_OFFSET_LENGTH,0,0);
    //				this.scene.multMatrix(this.rot_matrix);
    //this.scene.translate(-this.update_vec[0], -this.update_vec[1], -this.update_vec[2]);
    //	this.scene.rotate(this.update_vec_r[0], 1 ,0,0);
    //	this.scene.rotate(this.update_vec_r[1], 0,1, 0);
    //	this.scene.rotate(this.update_vec_r[2], 0, 0, 1);
//		this.scene.translate(old_pos[0], old_pos[1], old_pos[2]);

	//	this.scene.translate(-old_pos[0], -old_pos[1], -old_pos[2]);

	//this.update_vec_r = normalize(this.update_vec_r);

	/*	this.scene.translate(
				rotate_vect(this.update_vec, this.update_vec_r[0]*Math.PI*2, 'x')[0],
				rotate_vect(this.update_vec, this.update_vec_r[1]*Math.PI*2, 'y')[1],
				rotate_vect(this.update_vec, this.update_vec_r[2]*Math.PI*2, 'z')[2]); */

			//	this.scene.rotate(this.update_vec_r[0], 1, 0, 0);
			//	this.scene.rotate(this.update_vec_r[1], 0, 1, 0);
			//	this.scene.rotate(this.update_vec_r[2], 0, 0, 1);




//

    this.scene.pushMatrix();
    this.scene.translate(-CYLINDER_LENGTH / 2, 0, 0);
    this.scene.scale(SEMISPHERE_LENGTH, CYLINDER_HEIGHT / 2, CYLINDER_WIDTH / 2);
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.rearSphere.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-CYLINDER_LENGTH / 2, 0, 0);
    this.scene.scale(CYLINDER_LENGTH, CYLINDER_HEIGHT / 2, CYLINDER_WIDTH / 2);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.mainCylinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(CYLINDER_LENGTH / 2, 0, 0);
    this.scene.scale(SEMISPHERE_LENGTH, CYLINDER_HEIGHT / 2, CYLINDER_WIDTH / 2);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.frontSphere.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(TOWER_LENGTH / 2, CYLINDER_HEIGHT / 2 + TOWER_HEIGHT, TOWER_WIDTH / 2);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.towerSide.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, CYLINDER_HEIGHT / 2 + TOWER_HEIGHT, 0);
    this.scene.scale(TOWER_LENGTH / 2, 1, TOWER_WIDTH / 2);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.towerTop.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();

		if(this.peris_height > 0.57)
			this.peris_height = 0.57;
		else if(this.peris_height < 0)
			this.peris_height = 0.0;

		this.scene.translate(0, this.peris_height, 0);
    this.scene.translate(0, CYLINDER_HEIGHT, 0);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.periscope.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-CYLINDER_LENGTH / 2, -CYLINDER_HEIGHT / 4, -CYLINDER_WIDTH / 2 - PROP_DIAMETER / 2);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.scale(PROP_DIAMETER / 2, PROP_DIAMETER / 2, PROP_LENGTH);
    this.propeller.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-CYLINDER_LENGTH / 2, -CYLINDER_HEIGHT / 4, CYLINDER_WIDTH / 2 + PROP_DIAMETER / 2);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.scale(PROP_DIAMETER / 2, PROP_DIAMETER / 2, PROP_LENGTH);
    this.propeller.display();
    this.scene.popMatrix();

    // Tower Elevator
    // 0.5 = trapezoid width
    this.scene.pushMatrix();
    this.scene.translate(0, CYLINDER_HEIGHT / 2 + TOWER_HEIGHT / 2, 0);
    this.scene.scale(TOWER_ELEVATOR_WIDTH / 0.5, 1, TOWER_ELEVATOR_BIG_LENGTH / 2.34);
    this.scene.rotate(-Math.PI / 2, 0, 0, 1);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.towerElevator.display();
    this.scene.popMatrix();


    // Rudder
    // 2.34 = trapezoid height
    this.scene.pushMatrix();
    this.scene.translate(-CYLINDER_LENGTH / 2, 0, 0);
	this.scene.rotate(this.elevator_r*Math.PI/6, 0, 1,0);
    this.scene.scale(-1, RUDDER_BIG_HEIGHT / 2.34, -1);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.rudder.display();
    this.scene.popMatrix();

    // Rear Elevator

    this.scene.pushMatrix();
    this.scene.translate(-CYLINDER_LENGTH / 2, 0, 0);
	this.scene.rotate(this.rudder_r*Math.PI/6, 0,0,1);
    this.scene.scale(1, 1, RUDDER_BIG_HEIGHT / 2.34);
    this.scene.rotate(-Math.PI / 2, 0, 0, 1);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.rearElevator.display();
    this.scene.popMatrix();


    this.scene.popMatrix();
}

MySubmarine.prototype.update = function(currTime) {

    if (this.oldtime == 0) {
        this.oldtime = currTime;
        return;
    }

    this.time = (currTime - this.oldtime);

	let orientation = getOrientationVector(this.xzOrientation, this.xyOrientation);
	this.x += this.speed * orientation[0] * this.time / VEL_CONST;
	this.y += this.speed * orientation[1] * this.time / VEL_CONST;
	this.z += this.speed * orientation[2] * this.time / VEL_CONST;

    //this.update_vec = [-0.0000000000000000000001, 0 ,0];//this.vel_vec * this.time/1000;
//     this.update_vec[0] += this.vel_vec[0] * this.time / VEL_CONST;
//     this.update_vec[1] += this.vel_vec[1] * this.time / VEL_CONST;
//     this.update_vec[2] += this.vel_vec[2] * this.time / VEL_CONST;

		if(this.propeller.angle > 1.0)
			this.propeller.angle = 0;
		else
			this.propeller.angle = ((this.time%1000)/1000)*this.speed;//vec_norm(this.vel_vec);

			this.rudder_r *= 0.95;
			this.elevator_r *= 0.95;
    //this.rot_matrix = compute_orientation(this.init_ori, this.vel_vec);

    //this.update_vec_r[0] = normalize(sub_vecs( this.init_ori , this.vel_vec ))[0]*Math.PI/2;
    //this.update_vec_r[1] = normalize(sub_vecs( this.init_ori ,this.vel_vec) )[1]*Math.PI/2;
    //this.update_vec_r[2] = normalize(sub_vecs(this.init_ori , this.vel_vec) )[2]*Math.PI/2;

    //	alert(sub_vecs( normalize(this.update_vec_r) , normalize(this.vel_vec) ));

    //this.display();
}
