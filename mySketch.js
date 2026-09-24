// horizontizer for horizontize.it
// Heiko Gölzer 2025

let input;
let output;
let img_org = null; // original image
let img_sub; // low resolution copy
let img_disp; // displayed 1 line image with filters applied
let cnv;
let nMargin;
let hpos;
let phase;
let vres;
let nblur;
let animate;
let fr, scanRate;

function preload() {
  img_org = loadImage('beach.jpg');
}

function setup() {
	// Settings
	nMargin = 10;
	vres = 400;
	hpos_phase = 0;
	hpos = 0;
	fr = 20;
	nblur = 2;
	hpos = 0.5;
	scanRate = 0.1/fr;
	frameRate(fr);
	//noLoop();
  cnv = createCanvas(windowWidth, windowHeight);
	img_sub = createImage(100, vres);
	if (img_org) {
		interpolateImage(); 
		updateCanvas();
	}	
	makeGUI();
	hpos = slpos.value();
	nblur = slblur.value();
}

function makeGUI() {
	input = createFileInput(handleInput);
  input.position(0, 0);
	
	lblpos = createP('position'); // relative x position into image [0,1]
	lblpos.position(5, 25);
	slpos = createSlider(0, 1, 0.5, 0.01);
	slpos.position(5, 60);
	// allow keyboard and mouse control
	slpos.changed(function() {
		hpos = slpos.value();
		updateCanvas();
	})
	slpos.mouseMoved(function() {
		hpos = slpos.value();
		updateCanvas();
	})
	
	lblblur = createP('blur');
	lblblur.position(5, 75);
	slblur = createSlider(0, 10, 2, 1);
	slblur.position(5, 110);
	slblur.changed(function() {
		nblur = slblur.value();
		updateCanvas();
	})
	slblur.mouseMoved(function() {
		nblur = slblur.value();
		updateCanvas();
	})
	
	chkanimate = createCheckbox('animate', false);
	chkanimate.position(5, 150);
	chkanimate.changed(function() {
		//pick up current hpos phase
		if (chkanimate.checked()) { 
			if (((frameCount*scanRate) % 2.0) < 1.0) {
				phase = hpos-abs(((frameCount*scanRate) % 2.0)-1.0);
			} else {
				phase = abs(((frameCount*scanRate) % 2.0)-1.0)-hpos;
			}
			//print([phase, hpos,(frameCount*scanRate) % 2.0]);
		}
		animate = chkanimate.checked();
	});

	output = createButton('Save image');
	let ow = output.size().width; // get button width
  output.position(windowWidth-ow-2, 0); // align right with window 
  output.mousePressed(saveImage);
}

function draw() {
  
	if (animate) {
		//hpos = sin(frameCount*0.01)*0.5+0.5; // oscillate position 
		//hpos = frameCount*0.01 % 1.0; // linear
		hpos = abs(((frameCount*scanRate-phase) % 2.0)-1.0); // saw
		slpos.value(hpos);
		updateCanvas();
	}
}

function updateCanvas() {
		if (!img_sub) { return; } // p5 may fire resize before setup() ran
		let index = floor(map(hpos,0,1,nMargin,img_sub.width-nMargin));
		img_disp = img_sub.get(index, 0, index+1, img_sub.height); // copy image for processing
		img_disp.filter(BLUR, nblur);
 		image(img_disp, 0, 0, width, height, 0, 0, 1, img_sub.height);
}

function handleInput(file) {
	// Load and interpolate image.
  if (file.type === 'image') {
		// updateCanvas() runs in the load callback, once the image is ready
		img_org = loadImage(file.data, interpolateImage);
	} else {
    img_org = null;
  }
}

function interpolateImage() {
	// make a low resolution copy of original image
	if (img_org) {
		img_sub.copy(img_org,0,0,img_org.width,img_org.height,0, 0, img_sub.width, img_sub.height);
	}
}

function saveImage() {
	// download current canvas to disk
	save(cnv, 'horizontized.png');
}

function keyPressed() {
	if (key === ' ') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
	updateCanvas();
	if (!output) { return; } // GUI may not exist yet during early resize
	let ow = output.size().width; // get button width
  output.position(windowWidth-ow-2, 0); // align right with window 
}