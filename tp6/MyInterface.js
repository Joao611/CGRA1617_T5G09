/**
 * MyInterface
 * @constructor
 */


function MyInterface() {
	//call CGFinterface constructor
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui

	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); };

	this.gui.add(this.scene, 'Clock');

	// add a group of controls (and open/expand by defult)

	var lightsGroup = this.gui.addFolder("Lights");
	lightsGroup.open();

	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;

	let light0 = lightsGroup.add(this.scene, 'light0');
	let light1 = lightsGroup.add(this.scene, 'light1');
	let light2 = lightsGroup.add(this.scene, 'light2');

	let self = this;
	light0.onChange(function(value) {
		if (value) {
			self.scene.lights[0].enable();
		} else {
			self.scene.lights[0].disable();
		}
	});
	light1.onChange(function(value) {
		if (value) {
			self.scene.lights[1].enable();
		} else {
			self.scene.lights[1].disable();
		}
	});
	light2.onChange(function(value) {
		if (value) {
			self.scene.lights[2].enable();
		} else {
			self.scene.lights[2].disable();
		}
	});

	// add a slider
	// must be a numeric variable of the scene, initialized in scene.init e.g.
	// this.speed=3;
	// min and max values can be specified as parameters
	
	this.gui.add(this.scene, 'speed', -5, 5);

	let subAppearanceController = this.gui.add(this.scene, 'submarineAppearanceList', this.scene.submarineAppearanceList);

	subAppearanceController.onChange(function(value) {
		self.scene.currSubmarineAppearance = parseInt(value);
	})

	return true;
};

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars

	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (String.fromCharCode(event.keyCode || event.which).toUpperCase())
	{
		case ('W'):
			this.scene.moveSubmarine(true);
			break;
		case ('S'):
			this.scene.moveSubmarine(false);
			break;
		case ('A'):
			this.scene.rotateSubmarine(true);
			break;
		case ('D'):
			this.scene.rotateSubmarine(false);
			break;
		case ('Q'):
			this.scene.rotateSubmarine_up(true);
			break;
		case ('E'):
			this.scene.rotateSubmarine_up(false);
			break;
		case ('F'):
			this.scene.launchTorpedo();
			break;
	};
};
