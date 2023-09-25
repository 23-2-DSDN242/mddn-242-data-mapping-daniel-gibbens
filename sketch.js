let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "flowers/waterlilies.png";
let maskFile   = "flowers/masks/waterlilies_mask.png";
let outputFile = "output_waterlilies.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(0, 0, 0);
  sourceImg.loadPixels();
  maskImg.loadPixels();
}

function draw () {
  for(let i=0;i<8000;i++) {
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));
    let pix = sourceImg.get(x, y);
    let mask = maskImg.get(x, y);
    fill(pix);
    if(mask[0] > 128) {
      let pointSize = 6;
      let circleRadius = 15;
      let numCircles = 5;
      let angleIncrement = TWO_PI / numCircles;
      for (let i = 0; i < numCircles; i++) {
        let x1 = x + cos(i * angleIncrement) * circleRadius;
        let y1 = y + sin(i * angleIncrement) * circleRadius;
        ellipse(x1, y1, pointSize, pointSize);
      }
    //stroke(pix)
    //strokeWeight(5);
    //line(x,y,x,y+10);
    }
    else {
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
