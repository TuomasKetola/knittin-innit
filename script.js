let filledRectsCanvasTop = [];
let filledRectsCanvasBottom = [];
let filledRectsCanvas2 = [];
let filledRectsCanvas3 = [];
// let filledRectsCanvas3 = ['392,2,#00ff00', '377,17,#00ff00', '392,32,#00ff00', '377,47,#00ff00', '392,62,#00ff00', '377,77,#00ff00', '392,92,#00ff00', '377,122,#00ff00', '392,137,#00ff00', '377,152,#00ff00', '392,167,#00ff00', '377,182,#00ff00', '392,197,#00ff00', '377,212,#00ff00', '392,227,#00ff00', '377,242,#00ff00', '392,257,#00ff00', '377,272,#00ff00', '392,287,#00ff00', '377,302,#00ff00', '392,317,#00ff00', '377,332,#00ff00', '392,347,#00ff00', '377,362,#00ff00', '392,377,#00ff00', '377,392,#00ff00', '392,407,#00ff00', '377,437,#00ff00', '392,452,#00ff00', '377,467,#00ff00', '392,482,#00ff00', '377,497,#00ff00', '392,512,#00ff00', '377,527,#00ff00']
let filledRectsCanvas3NoDeductions = [];
let mainPatternSizes = [];
// let deductions = ['482,422', '482,107', '197,392', '197,137'];
let deductions = []
let currentWindowIndex = 1;
let windowTop = 0;


let mouseToDragY = 1;
let mouseDown = false;
let minY = 10000;
let maxY = 1;
let minX = 10000;
let maxX = 1;

let mainCanvasWidth = 36;
let mainCanvasHeight = 42;
let smallCanvasWidth = 4;
let smallCanvasHeight = 18;
let drawingCanvasHeight = 18;
let drawingCanvasWidth = 4;

let selectingColor = false;
let findDeduction = false;
let addingDeduction = false;
let focus = false;
let deductionYs = [];


// get canvas to fit div
function resizeCanvas(div, canvas){

  var bw = div.clientWidth;
  var bh = div.clientHeight;  
  canvas.width = bw;
  canvas.height = bh;
}

// create canvases
const div1 = document.getElementById('div1')
div1.canvasTop = document.createElement('canvas');
div1.canvasBottom = document.createElement('canvas');

const div3 = document.getElementById('div3')
div3.canvas3 = document.createElement('canvas');

// resize canvases
resizeCanvas(div1, canvasTop)
resizeCanvas(div1, canvasBottom)
resizeCanvas(div3, canvas3)

// get canvas contexts
const ctxTop = canvasTop.getContext('2d');
const ctxBottom = canvasBottom.getContext('2d');
const ctx3 = canvas3.getContext('2d');

// define widths, heigths, padding and cell size
var bw = div1.clientWidth;
var bh = div1.clientHeight;
var p = 2;
var cw = 15;

// get colours
let backgroundColor = document.getElementById("background-color").value
let drawingColor = document.getElementById("drawing-color").value

function drawBoard(gridWidth, gridHeight, cellWidth, ctx, Ytop, Ybottom, nrDeductions){
  // draws all the boards
  ctx.beginPath();
  var top = Ytop - p || 0;
  if (top < 0) {top = 0}
  var gridHeight = Math.round((Ybottom  - Ytop) / 15)  || gridHeight
  var xStart = (nrDeductions * cw) / 2 + p || 0.5 + p;
  var gridWidth  = gridWidth - nrDeductions || gridWidth
  // console.log(xStart, gridWidth)
  // vertical 
  for (var x = 0; x <= cellWidth * gridWidth; x += cellWidth) {
      ctx.moveTo(xStart + x, top+p);
      ctx.lineTo(xStart + x, cw * gridHeight + top+p);
  }

  // horizontal

  for (var x = 0; x <= cellWidth * gridHeight; x += cellWidth) {
      ctx.moveTo(xStart, 0.5 + x + p + top);
      ctx.lineTo(cw * gridWidth + xStart, 0.5 + x +top + p);
  }
  ctx.strokeStyle = "black";
  ctx.stroke();
  if (typeof Ytop == 'undefined') {
  // if (!Ytop) {
    
    ctx.fillStyle = "black";
    for (var x = 0  ; x <= cellWidth * gridWidth - (1 * cellWidth); x += cellWidth) {
      ctx.font = 10 +"px Arial";
      ctx.fillText(x /cw + 1, x + (cw / 3), gridHeight*cw + cw);
    }

    for (var y = 0  ; y <= cellWidth * gridHeight - (1 * cellWidth); y += cellWidth) {
      ctx.font = 10 +"px Arial";
      ctx.fillText( gridHeight - (y /cw + 1) + 1, gridWidth*cw + cw / 3, y + cw);
    }
  }
}

function clickDrawToCanvas(canvas, event, cw, ctx, filledRects) {
  // draw to canvas
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const cy = (y - (y%cw)) + p;
  const cx = (x - (x%cw)) + p;
  let new_coords = [cy, cx,drawingColor].toString();
  const find = filledRects.includes(new_coords);
  ctx.beginPath();

  // make sure the drawing is on the canvas
  if (cx < drawingCanvasWidth * cw && cy < drawingCanvasHeight * cw) { 
    
    if (cx < minX) {minX = cx};

    if (cy < minY) {minY = cy};

    if (cy > maxY) {maxY = cy};
    
    if (cx > maxX) {maxX = cx};
    
    if (find){
      
      const ix = filledRects.indexOf(new_coords);
      ctx.clearRect(cx+1, cy+1, cw-1, cw-1);  
      filledRects.splice(ix, 1)
      if (cx == maxX) {
        maxX = maxX - cw
      }
      if (cx == minX) {
        minX = minX + cw
      }
      ctx.strokeStyle = "black";
      ctx.stroke();
    }
    else {
      ctx.fillStyle = drawingColor;
      ctx.fillRect(cx+1, cy+1, cw-1, cw-1);
      filledRects.push(new_coords) 
    };
  }
}

function reDrawMainCanvas() {
  // clear canvas
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

  // set background
  ctx3.fillStyle = backgroundColor;
  ctx3.fillRect(p, p, mainCanvasWidth * cw + p, mainCanvasHeight*cw +p);
  
  // draw lines
  drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3);
  
  // deductions
  for (const x of deductions) {
    coords = x.split(',');   
    cy_ = Number(coords[0]);
    cx_ = Number(coords[1]);
    ctx3.font = cw +"px Arial";
    ctx3.fillStyle = "black";
    ctx3.fillText("V", cx_ + 3 - cw, cy_ + 1 + cw);
  }

  // empty pixels after deductions
  for (const ded of deductions) {
    coords = ded.split(',');
    deductionY = Number(coords[0]); deductionX = Number(coords[1]);
    ctx3.clearRect(deductionX+1, 0, cw-1, deductionY+cw)
    }
  // fill rects
  for (const x of filledRectsCanvas3) {
    coords = x.split(',');   
    y_ = Number(coords[0]);
    x_ = Number(coords[1]);
    color = coords[2];
    ctx3.fillStyle = color;
    ctx3.fillRect(x_+1, y_+1, cw-1, cw-1);
  };
  
  // make window
  deductionsReverse = deductions.sort().reverse();
  
  let previousY = mainCanvasHeight * cw;
  let bottomY = previousY
  let deductionIndex = -1
  let nrDeductions = 0;
  for (var ix = 0  ; ix <= deductionsReverse.length - 1; ix ++)  {
    
    dedCoords = deductionsReverse[ix].split(',');
    y = Number(dedCoords[0]);
    x = Number(dedCoords[1]);
    if (y < previousY) {
      deductionIndex += 1
    }
    if (deductionIndex == currentWindowIndex) {
      topY = y;
      if (deductionIndex != 0) {
        dedCoordsPrevious = deductionsReverse[ix - 1].split(',');
        bottomY = Number(dedCoordsPrevious[0]);
      }
      break
    };
    previousY = y;
    nrDeductions += 1;
  };
  
  if (currentWindowIndex > deductionIndex && deductions.length > 0) {
    bottomY = y;
    topY = 0;
  };
  
  if (deductions.length > 0){
    ctx3.fillStyle = "grey";
    ctx3.globalAlpha = 0.3;
    ctx3.fillRect(p, p, mainCanvasWidth*cw, topY-p);
    ctx3.fillRect(p, bottomY, mainCanvasWidth*cw, mainCanvasHeight * cw-bottomY + p);
    ctx3.globalAlpha = 1.0;
  }
  
  //focus
  if (focus) {
    ctx3.clearRect(0,topY, mainCanvasWidth * cw+p, bottomY - topY);
    drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3, topY, bottomY, nrDeductions);
    
    let startX = 0;
    let padCount = 0;
    let tempFilled = [];
    console.log(filledRectsCanvas3NoDeductions.length)
    console.log(filledRectsCanvas3.length)
    for (const coords of filledRectsCanvas3NoDeductions) {
      coordsArr = coords.split(',')
      x = Number(coordsArr[1]); y = Number(coordsArr[0]); color = coordsArr[2];
      x = x + (nrDeductions / 2) * cw;

      if (y < bottomY && y > topY ) {
        ctx3.fillStyle = color
        ctx3.fillRect(x +1, y+1 , cw - 2, cw - 1)
        console.log('drawing') 
      }
  }
  }
}

function drawFigToCanvas(canvas, event, cw, ctx, filledRects) {
  // drag and drop fig from canvas to another 
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const mouseY = (y - (y%cw)) + p;
  const mouseX = (x - (x%cw)) + p;
  const shapeSize = (maxX - minX + cw) / cw;
  const nrReps = mainCanvasWidth / shapeSize;
  
  var patternSize = 0;
  let addOn = 0;
  if (mouseX > 0) { // make sure on the right canvas
    for(let i = 0; i <= nrReps - 1; i++) {
      
      for (const x of filledRects) {
        coords = x.split(',');
        y_ = coords[0] - minY + mouseY - (mouseToDragY - minY);
        x_ = (coords[1] - minX + p) + i * shapeSize * cw;
        color = coords[2];
        
        new_coordsMainNoDed = [y_, x_,color].toString();
        
        // }
        // make sure to jump over deductions
        for (const coordString of deductions) {
          coordsDeduction = coordString.split(',');
          coordsDedX = Number(coordsDeduction[1]); coordsDedY = Number(coordsDeduction[0]);

          if (x_ + addOn == coordsDedX && y_ < coordsDedY) {
            addOn += cw;

          }
        }
        x_ += addOn;
        // 
        
         // dont draw outside canvas
        if (x_+1 < mainCanvasWidth * cw && y_ < mainCanvasHeight * cw) {
          new_coordsMain = [y_, x_,color].toString();
          filledRectsCanvas3.push(new_coordsMain);
          patternSize += 1;
          filledRectsCanvas3NoDeductions.push(new_coordsMainNoDed);

        }
      }
    }
    mainPatternSizes.push(patternSize);
  }
  reDrawMainCanvas();

}


function changeCanvasBackground(ctx, color, height, width) {
  ctx.fillStyle = color;
  ctx.fillRect(p, p, width * cw + p, height*cw +p);
}

function changeBackground() {
  var newColour  = document.getElementById("background-color").value;
  backgroundColor = newColour;

  changeCanvasBackground(ctxBottom, backgroundColor, smallCanvasHeight, smallCanvasWidth);
  reDrawMainCanvas();
  drawBoard(drawingCanvasWidth, drawingCanvasHeight, cw, ctxBottom);
}

function changeDrawingColor() {
  var newColour  = document.getElementById("drawing-color").value;
  drawingColor = newColour
}

function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for(i = L; i >= 0; i--) {
     selectElement.remove(i);
  }
}

function changeMainCanvasSizes() {
  var mainX = document.getElementById("mainX").value;
  var mainCanvasWidth = Number(mainX);
  var smallCanvasSelect = document.getElementById('drawingDims');
  removeOptions(smallCanvasSelect);
  for (var x = mainCanvasWidth / 2; x >= 2; x -= 1){
    if (mainCanvasWidth % x == 0) {
      var opt = document.createElement('option');
      opt.value = x;
      opt.innerHTML = x;
      smallCanvasSelect.appendChild(opt);
    }
  }
  changeDrawingCanvasSizes();
  }

function changeDrawingCanvasSizes() {
  var drawingX = document.getElementById("drawingDims").value;
  drawingCanvasWidth = drawingX;
  drawingCanvasHeight = smallCanvasHeight;
  smallCanvasWidth = drawingCanvasWidth; smallCanvasHeight = drawingCanvasHeight;
  ctxBottom.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  ctxTop.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  drawBoard(drawingCanvasWidth, drawingCanvasHeight, cw, ctxBottom);
  filledRectsCanvasBottom = []; filledRectsCanvasTop = []; minY = 10000; maxY = 1; minX = 10000; maxX = 1;
  changeBackground();
  reDrawMainCanvas();
}

function clearCanvas(canvas, ctx, filledRects) {
  // console.log(filledRects)
  for (const x of filledRects) {
    coords = x.split(',');   
    y_ = Number(coords[0]);
    x_ = Number(coords[1]);
    ctx.clearRect(x_+1, y_+1, cw-1, cw-1);
  }
}

function clearDraw() {
  
  clearCanvas(canvasBottom, ctxBottom, filledRectsCanvasBottom);
  clearCanvas(canvasTop, ctxTop, filledRectsCanvasTop);
  minY = 10000; maxY = 1; minX = 10000; maxX = 1;
  filledRectsCanvasBottom = [];
  filledRectsCanvasTop = [];
}

function undoDraw() {
  let lastPixel = filledRectsCanvasBottom[filledRectsCanvasBottom.length - 1];
  // console.log(lastPixel)
  if (lastPixel) {
    coords = lastPixel.split(',')
    y_ = Number(coords[0]);
    x_ = Number(coords[1]);
    
    ctxBottom.fillStyl = backgroundColor;
    ctxTop.fillStyle = backgroundColor;

    ctxBottom.fillRect(x_+1, y_+1, cw-1, cw-1)
    ctxTop.fillRect(x_+1, y_+1, cw-1, cw-1)

    filledRectsCanvasBottom.pop()
    filledRectsCanvasTop.pop()
  }
}

function undoMain() {
  lastSize = mainPatternSizes[mainPatternSizes.length - 1];
  filledRectsCanvas3.splice(filledRectsCanvas3.length - lastSize);
  mainPatternSizes.pop();
  reDrawMainCanvas();
}

function selectColorFromCanvas() {
  selectingColor = !selectingColor;
}

function deducationBool() {
  addingDeduction = !addingDeduction;
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}

function changeMainX() {
  mainX = document.getElementById("mainX").value;
  mainCanvasWidth = mainX;
  changeMainCanvasSizes();
  reDrawMainCanvas()
}

function changeMainY() {
  mainY = document.getElementById("mainY").value;
  mainCanvasHeight = mainY;
  reDrawMainCanvas();
}

function changeSmallY() {
  smallY = document.getElementById("smallY").value;
  smallCanvasHeight = smallY;
  ctxBottom.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
  drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxBottom);
  drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxTop);
}

function focusOn(){
  focus = !focus;
  reDrawMainCanvas()
}

// listener for dragging
canvasTop.addEventListener('mousedown', function(e) {
  const rect = canvasTop.getBoundingClientRect();
  const y = e.clientY - rect.top;
  mouseToDragY = (y - (y%cw)) + p;
})

// listener for clicking
canvasTop.addEventListener('click', function(e) {
  if (selectingColor) {
    const rect = canvasTop.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    var pixelData = ctxTop.getImageData(x, y, 1, 1).data; 
    var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
    drawingColor = hex;
  }
  else {
    clickDrawToCanvas(canvasBottom, e, cw, ctxBottom, filledRectsCanvasTop);
    clickDrawToCanvas(canvasTop, e, cw, ctxTop, filledRectsCanvasBottom);
  }
})

// listener for dragend
canvasTop.addEventListener('dragend', function(e) {
  drawFigToCanvas(canvas3, e, cw, ctx3, filledRectsCanvasTop)
})



canvas3.addEventListener('click', function(e) {
  if (selectingColor) {
    const rect = canvas3.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    var pixelData = ctx3.getImageData(x, y, 1, 1).data; 
    var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
    drawingColor = hex;
    document.getElementById("drawing-color").value = drawingColor;

  }

  else if (addingDeduction){
    
    const rect = canvas3.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cy = (y - (y%cw)) + p;
    const cx = (x - (x%cw)) + p ;
    var new_coords = [cy, cx].toString();
    const findDeduction = deductions.includes(new_coords);
    

    if (!findDeduction) {
      if (cx < mainCanvasWidth * cw){
        deductions.push(new_coords);
      }
    }
    else {
      const ix = deductions.indexOf(new_coords);
      deductions.splice(ix, 1);
    }

    reDrawMainCanvas();
  }
  else {
    const rect = canvas3.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let previousY = mainCanvasHeight * cw;
    deductionsReverse = deductions.sort().reverse();
    let deductionIndex = -1
    for (var ix = 0  ; ix <= deductionsReverse.length - 1; ix ++)  {
            
      dedCoords = deductionsReverse[ix].split(',');
      y_ = Number(dedCoords[0]);
      x_ = Number(dedCoords[1]);
      if (y_ < previousY) {
        deductionIndex += 1;
  
      }

      
      if (ix != deductionsReverse.length - 1) {
        topY = y_;
        if (deductionIndex != 0) {
          previousY = Number(deductionsReverse[ix - 1].split(',')[0]);
        };
        if (y_ != previousY) {
          bottomY = previousY;
          
        }
       
      }
      else {
        topY = p;
        bottomY = y_
        deductionIndex += 1;
      }
      if (y < bottomY && y >topY) {
        currentWindowIndex = deductionIndex
      }
      previousY = y_;
    }
    // console.log(y, y_, y_next, deductionIndex, currentWindowIndex);
  }
  reDrawMainCanvas()
}
)



drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxBottom);
drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3)
reDrawMainCanvas();
