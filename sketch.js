let sourceImg=null;
let maskImg=null;
let ringMaskImg=null;
let renderCounter=0;

let sourceFile = "eyes/hazel-eye.jpg";
let maskFile   = "eyes/iris-masks/hazel-eye-iris-mask.jpg";
let pupilMask   = "eyes/pupil-masks/hazel-eye-pupil-mask.jpg";

let outputFile = "hazel_training.png";

// Used for storing pixels that contain the iris
let eyePixels = []

// 2D array treated as ringmask image
let ringMask = [];

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
  pupilMaskImg = loadImage(pupilMask);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(20, 0, 0);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  pupilMaskImg.loadPixels();

}

// Blurs a pixel by using the average pixel colour around it
function blurPixel(x, y, radius) {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  // Loop through neighborhood
  for (let i = -radius; i <= radius; i++) {
    for (let j = -radius; j <= radius; j++) {

      if (i * i + j * j <= radius * radius) {
        // Edge case
        let newX = constrain(x + i, 0, sourceImg.width - 1);
        let newY = constrain(y + j, 0, sourceImg.height - 1);

        let pix = pupilMaskImg.get(newX, newY);

        r += pix[0];
        g += pix[1];
        b += pix[2];
        count++;
      }
    }
  }
  // Calculate the average colour in the neighborhood
  r /= count;
  g /= count;
  b /= count;

  return [r, g, b, 255];
}

// Creates the Ring mask from a pupil mask
function makeRingMask() {
  for (let x = 0; x < sourceImg.width; x++) {
    let col = [];
    for (let y = 0; y < sourceImg.height; y++) {

      let pupil = pupilMaskImg.get(x, y);
      strokeWeight(0)

      // Only blur the white pixels
      const IS_WHITE = pupil[0] === 255 && pupil[1] === 255 && pupil[2] === 255;
      if (IS_WHITE) {
        pupil = blurPixel(x, y, 5);
      }
      col.push(pupil)
    }
    ringMask.push(col)
  }

  // After blurring set pixels to white or black
  for (let x = sourceImg.width-1; x >= 0; x--) {
    for (let y = 0; y < sourceImg.height; y++) {

      let pupil = ringMask[x][y];

      // Set all pure white pixels to be black to cut out the middle
      const IS_WHITE = pupil[0] === 255 && pupil[1] === 255 && pupil[2] === 255;
      if (IS_WHITE) {
        pupil = [0,0,0,255]
      } else if (pupil[0] > 150 && pupil[1] > 150 && pupil[2] > 150) {
        pupil = [255,255,255,255]
      }
      ringMask[x][y] = pupil;
    }
  }
}

function draw () {
  // Creates the ring mask
  makeRingMask();

  for (let x = sourceImg.width; x > 0; x--) {
    for (let y = 0; y < sourceImg.height; y++) {
      let pix = sourceImg.get(x, y);
      let mask = maskImg.get(x, y);
      let pupil = ringMask[x-1][y];
      strokeWeight(0)
      customPixel(pix, mask, x, y, pupil)
    }
  }
  // Flip the eyePixels to draw the iris in the other direction
  eyePixels.reverse();
  eyePixels.forEach(eyePix => {
    pix = eyePix.pix
    // Make white pixel ring around the pupil using the ringmask
    if (eyePix.ringMask[0] > 128) {
      stroke(255,255,255);
    } else {
      // Draw the iris pixels
      if (eyePix.y % 10 == 1) {
        // Main pixels
        strokeWeight(7)
        stroke(pix[2],pix[1],pix[0])
      } else {
        // Fill the gaps
        strokeWeight(1)
        stroke(pix[1], pix[2], pix[0])
      }
    }
    
    // Reflective part in the eye
    if (pix[0] > 200 && pix[1] > 200 && pix[2] > 200) {
      stroke(pix[2] * 7/8,pix[1] * 9/10,pix[0])
    }
    point(eyePix.x,eyePix.y)
  });
  
  renderCounter = renderCounter + 1;
  if(renderCounter > 1) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    //saveArtworkImage(outputFile);
  }
}

function customPixel(pix, maskGiven, x, y, pupil) {
  if(maskGiven[0] > 128) {
    // Store the eye pixels for swapping draw order
      eyePixels.push({
        "pix" : pix,
        "maskGiven" : maskGiven,
        "x" : x,
        "y" : y,
        "ringMask" : pupil
      })
  } else {
    // Draw the background pixels
    thickness = 1
    // Increased red channel on brighter areas
    if (pix[0] > 80 && pix[1] > 80 && pix[1] > 80) {
      if (y % 9 == 1) {
        // Main pixels
        thickness = 7.2
        fill(pix[0]*1.2-80,pix[1]/2-40,pix[2]/2-60)
      } else {
        // Fill the gaps
        thickness = 1
        fill(pix[0]/2 + 20-40,pix[1]/2-40,pix[2]/2-60)
      }  
    } else {
      // Darker pixels
      if (y % 9 == 1) {
        // Main pixels
        thickness = 7.2
        fill(pix[0]-45,pix[1]-55,pix[2]-55)
      } else {
        // Fill the gaps
        thickness = 1
        fill(pix[0]-45,pix[1]-25,pix[2]-55)
      } 
    }
    noStroke()
    rect(x,y,thickness)  
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
