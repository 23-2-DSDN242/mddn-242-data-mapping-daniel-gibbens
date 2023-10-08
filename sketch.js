let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "eyes/hazel-eye.jpg";
let maskFile   = "eyes/iris-masks/hazel-eye-iris-mask.jpg";

let outputFile = "output_lines_bg_rect.png";

eyePixels = []

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
        stroke(pix[2],pix[1],pix[0])
      } else {
        strokeWeight(1)
        stroke(pix[1], pix[2], pix[0])
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
      /*if (y % 10 == 1) {
        strokeWeight(7)
        stroke(pix[2],pix[1],pix[0])
      } else {
        strokeWeight(1)
        stroke(pix[1], pix[2], pix[0])
      }

    if (pix[0] > 200 && pix[1] > 200 && pix[2] > 200) {
      stroke(pix[2] * 7/8,pix[1] * 9/10,pix[0])
    }
    point(x,y)*/

  } else {
    h = 1
    stroke(pix[0]-40, pix[1]-40, pix[2]-40)
    if (pix[0] > 100 && pix[1] > 100 && pix[1] > 100) {
      if (y % 9 == 1) {
        //strokeWeight(7)
        h =7
        fill(pix[0]/2 + 90,pix[1]/2+22,pix[2]/2)
      } else {
        //strokeWeight(1)
        h=1
        fill(pix[0]/2 + 20,pix[1]/2+20,pix[2]/2)
      }  
    } else {
      if (y % 9 == 1) {
        //strokeWeight(7)
        h=7
        fill(pix[0]-40,pix[1]-40,pix[2]-40)
      } else {
        //strokeWeight(1)
        h=1
        fill(pix[0]-40,pix[1]-10,pix[2]-40)
      } 
    }
    noStroke()
    rect(x,y,h)
    //point(x,y)   
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
