let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "eyes/hazel-eye.jpg";
let maskFile   = "eyes/iris-masks/hazel-eye-iris-mask.jpg";

let outputFile = "output_hazel_pixels.png";

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
  for (let x = 0; x < sourceImg.width; x++) {
    for (let y = 0; y < sourceImg.height; y++) {
      let pix = sourceImg.get(x, y);
      let mask = maskImg.get(x, y);
      stroke(pix)
      strokeWeight(0)
      customPixel(pix,mask,x,y)
    }
  }
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
    stroke(pix[2], pix[1], pix[0])
    if (pix[0] > 200 && pix[1] > 200 && pix[2] > 200) {
      stroke(pix[2] * 7/8,pix[1] * 9/10,pix[0])
    }
    let pointSize = 5;
    //ellipse(x, y, pointSize, pointSize);
    point(x,y)
  } else {
    fill(pix[0]-40, pix[1]-40, pix[2]-40)
    if (pix[0] > 100 && pix[1] > 100 && pix[1] > 100) {
      fill(pix[0]/2 + 100,pix[1]/2+20,pix[2]/2)
    }
    
    let pointSize = 7;
    noStroke();
    rect(x, y, pointSize, pointSize);    
  }
}

function oldDraw() {
  for(let i=0;i<8000;i++) {
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));
    let pix = sourceImg.get(x, y);
    let mask = maskImg.get(x, y);
    fill(pix);
    if(mask[0] > 128) {
      fill(pix[2], pix[1], pix[0])
      if (pix[0] > 200 && pix[1] > 200 && pix[1] > 254) {
        continue;
      }
      let pointSize = 6;
      let circleRadius = 5;
      let numCircles = 5;
      let angleIncrement = TWO_PI / numCircles;
      for (let i = 0; i < numCircles; i++) {
        let x1 = x + cos(i * angleIncrement) * circleRadius;
        let y1 = y + sin(i * angleIncrement) * circleRadius;
        ellipse(x1, y1, pointSize, pointSize);
      }
    //stroke(pix[0], 0, 55)
    //strokeWeight(5);
    //line(x,y,x,y+10);
    } else {
      fill(pix[0]-40, pix[1]-40, pix[2]-40)
      if (pix[0] > 100 && pix[1] > 100 && pix[1] > 100) {
        fill(pix[0]/2 + 70,pix[1]/2+20,pix[2]/2)
      }
      
      let pointSize = 15;
      noStroke();
      rect(x, y, pointSize, pointSize);    
    }
  }
  renderCounter = renderCounter + 1;
  if(renderCounter > 10) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    //saveArtworkImage(outputFile);
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
