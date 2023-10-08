let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
//let sourceFile = "eyes/hazel-eye.jpg";
//let maskFile   = "eyes/iris-masks/hazel-eye-iris-mask.jpg";
let sourceFile = "eyes/face.jpg";
let maskFile   = "eyes/iris-masks/face-mask.png";

let outputFile = "output_half_face.png";

let eyePixels = []

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);

}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(20, 0, 0);
  sourceImg.loadPixels();
  maskImg.loadPixels();

}
function draw () {
  for (let x = sourceImg.width; x > 0; x--) {
    for (let y = 0; y < sourceImg.height; y++) {
      let pix = sourceImg.get(x, y);
      let mask = maskImg.get(x, y);
      stroke(pix)
      strokeWeight(0)
      customPixel(pix,mask,x,y)
    }
  }
  eyePixels.reverse();
  eyePixels.forEach(eyePix => {
    pix = eyePix.pix
    if (eyePix.y % 10 == 1) {
        strokeWeight(7)
        if (eyePix.x < sourceImg.width/2) {
          stroke(pix[2],pix[1],pix[0])
        } else {
          stroke(pix[0],pix[1],pix[2])
        }
        
      } else {
        strokeWeight(1)
        if (eyePix.x < sourceImg.width/2) {
          stroke(pix[1], pix[2], pix[0])
        } else {
          stroke(pix[0], pix[2], pix[1])
        }
        
      }

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
    saveArtworkImage(outputFile);
  }
}

function customPixel(pix, maskGiven, x, y) {
  if(maskGiven[0] > 128) {
      eyePixels.push({
        "pix" : pix,
        "maskGiven" : maskGiven,
        "x" : x,
        "y" : y
      })

  } else {
    h = 1
    stroke(pix[0]-40, pix[1]-40, pix[2]-40)
    if (pix[0] > 120 && pix[1] > 100 && pix[1] > 100) {
      if (y % 9 == 1) {
        h =7.2
        if (x < sourceImg.width/2) {
          fill(pix[0]*1.2-80,pix[1]/2-40,pix[2]/2-60)
        } else {
          fill(pix[2]/2-60,pix[1]/2-40,pix[0] * 1.2 - 80)
        }
        
      } else {
        h=1
        if (x < sourceImg.width/2) {
          fill(pix[0]/2 + 20-40,pix[1]/2-40,pix[2]/2-60)
        } else {
          fill(pix[2]/2-60,pix[1]/2-40,pix[0]/2 + 20-40)
        }
        
      }  
    } else {
      if (y % 9 == 1) {
        h=7.2
        if (x < sourceImg.width/2) {
          fill(pix[0]-45,pix[1]-55,pix[2]-55)
        } else {
          fill(pix[2]-55,pix[1]-55,pix[0]-45)
        }
      } else {
        h=1
        if (x < sourceImg.width/2) {
          fill(pix[0]-45,pix[1]-25,pix[2]-55)
        } else {
          fill(pix[2]-55,pix[1]-25,pix[0]-45)
        }
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
