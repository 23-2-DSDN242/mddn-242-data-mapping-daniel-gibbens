let sourceImg=null;
let maskImg=null;
let ringMaskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "eyes/hazel-eye.jpg";
let maskFile   = "eyes/iris-masks/hazel-eye-iris-mask.jpg";
let pupilMask   = "eyes/pupil-masks/hazel-eye-pupil-mask.jpg";
//let sourceFile = "eyes/face.jpg";
//let maskFile   = "eyes/iris-masks/face-mask.png";

let outputFile = "Ringmask.png";

let eyePixels = []

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

  // Calculate the average color in the neighborhood
  r /= count;
  g /= count;
  b /= count;

  return [r, g, b];
}

ringMask = [];

function makeRingMask() {
  for (let x = 0; x < sourceImg.width; x++) {
    let col = [];
    for (let y = 0; y < sourceImg.height; y++) {

      let pupil = pupilMaskImg.get(x, y);
      strokeWeight(0)

      const IS_WHITE = pupil[0] === 255 && pupil[1] === 255 && pupil[2] === 255;
      if (IS_WHITE) {
        pupil = blurPixel(x, y, 5);
      }
      col.push(pupil)
    }
    ringMask.push(col)
  }
  for (let x = sourceImg.width-1; x >= 0; x--) {
    for (let y = 0; y < sourceImg.height; y++) {

      let pupil = ringMask[x][y];

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
  makeRingMask();

  for (let x = sourceImg.width; x > 0; x--) {
    for (let y = 0; y < sourceImg.height; y++) {
      let pix = sourceImg.get(x, y);
      let mask = maskImg.get(x, y);
      let pupil = ringMask[x-1][y];
      stroke(pix)
      strokeWeight(0)
      customPixel(pix, mask, x, y, pupil)
    }
  }
  eyePixels.reverse();
  eyePixels.forEach(eyePix => {
    pix = eyePix.pix
    if (eyePix.ringMask[0] > 128) {
      stroke(255,255,255);
    } else {
      if (eyePix.y % 10 == 1) {
        strokeWeight(7)
        stroke(pix[2],pix[1],pix[0])
        
      } else {
        strokeWeight(1)
        stroke(pix[1], pix[2], pix[0])
      }
    }
    
    // reflective part in the eye
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
      eyePixels.push({
        "pix" : pix,
        "maskGiven" : maskGiven,
        "x" : x,
        "y" : y,
        "ringMask" : pupil
      })
  } else {
    h = 1
    if (pix[0] > 80 && pix[1] > 80 && pix[1] > 80) {
      if (y % 9 == 1) {
        h =7.2
        fill(pix[0]*1.2-80,pix[1]/2-40,pix[2]/2-60)
      } else {
        h=1
        fill(pix[0]/2 + 20-40,pix[1]/2-40,pix[2]/2-60)
      }  
    } else {
      if (y % 9 == 1) {
        h=7.2
        fill(pix[0]-45,pix[1]-55,pix[2]-55)
      } else {
        h=1
        fill(pix[0]-45,pix[1]-25,pix[2]-55)
      } 
    }
    noStroke()
    rect(x,y,h)  
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
