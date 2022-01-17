let filledRectsCanvasTop = [];
let filledRectsCanvasBottom = [];
let filledRectsCanvas2 = [];
let filledRectsCanvas3 = [];
let mainPatternSizes = [];
let deductions = [];
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

 


function drawBoard(gridWidth, gridHeight, cellWidth, ctx){
  // draws all the boards
  ctx.beginPath();
  for (var x = 0; x <= cellWidth * gridWidth; x += cellWidth) {
      ctx.moveTo(0.5 + x + p, p);
      ctx.lineTo(0.5 + x + p, 15 * gridHeight + p);
  } 

  for (var x = 0; x <= cellWidth * gridHeight; x += cellWidth) {
      ctx.moveTo(p, 0.5 + x + p);
      ctx.lineTo(15 * gridWidth + p, 0.5 + x + p);
  }
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.fillStyle = "black";
  for (var x = 0  ; x <= cellWidth * gridWidth - (1 * cellWidth); x += cellWidth) {
    ctx.font = 10 +"px Arial";
    ctx.fillText(x /cw + 1, x + (cw / 3), gridHeight*cw + cw);
  }

  for (var y = 0  ; y <= cellWidth * gridHeight - (1 * cellWidth); y += cellWidth) {
    ctx.font = 10 +"px Arial";
    ctx.fillText( gridHeight - (y /cw + 1) + 1, gridWidth*cw + cw / 3, y + cw);
  }

  for (const ded of deductions) {
    coords = ded.split(',');
    deductionX = Number(coords[0]); deductionY = Number(coords[1]);
    ctx.clearRect(deductionX+1, 0, cw-1, deductionY+cw)
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
    if (cx < minX) {
      minX = cx
    }
    if (cy < minY) {
      minY = cy
    }
    if (cy > maxY) {
      maxY = cy
    }
    if (cx > maxX) {
      maxX = cx
    };
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
        
        // make sure to jump over deductions
        for (const coordString of deductions) {
          coordsDeduction = coordString.split(',');
          coordsDedX = coordsDeduction[0]; coordsDedY = coordsDeduction[1];
          if (x_ + addOn == coordsDedX && y_ < coordsDedY) {
            addOn += cw;
          }
        }
        x_ += addOn;
        // 
        color = coords[2];
         // dont draw outside canvas
        if (x_+1 < mainCanvasWidth * cw && y_ < mainCanvasHeight * cw) {
          new_coordsMain = [y_, x_,color].toString()
          filledRectsCanvas3.push(new_coordsMain);
          patternSize += 1;
          ctx.fillStyle = color;
          ctx.fillRect(x_+1, y_+1, cw-1, cw-1);
        }
      }
    }
    mainPatternSizes.push(patternSize);
  } 
}


function changeCanvasBackground(ctx, color, height, width) {
  ctx.fillStyle = color;
  ctx.fillRect(p, p, width * cw + p, height*cw +p);
}

function changeBackground() {
  var newColour  = document.getElementById("background-color").value;
  backgroundColor = newColour;

  changeCanvasBackground(ctxBottom, backgroundColor, smallCanvasHeight, smallCanvasWidth);
  changeCanvasBackground(ctx3, backgroundColor, mainCanvasHeight, mainCanvasWidth);
  drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxBottom);
  drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3);
  redrawRects(ctx3, filledRectsCanvas3);
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
  var mainDims = document.getElementById("mainDims").value;
  var mainDimsArr = mainDims.split('x');
  var mainCanvasWidth = Number(mainDimsArr[0]);
  
  // update main canvas size
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
  drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3);

  // update selection for small canvas size
  var smallCanvasSelect = document.getElementById('drawingDims');
  removeOptions(smallCanvasSelect);
  for (var x = mainCanvasWidth; x >= 2; x -= 1){
    if (mainCanvasWidth % x == 0) {
      var opt = document.createElement('option');
      opt.value = x;
      opt.innerHTML = x;
      smallCanvasSelect.appendChild(opt);
    }
  }
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
  redrawRects(ctx3, filledRectsCanvas3);
}

function redrawRects(ctx, filledRects) {
  for (const x of filledRects) {
    coords = x.split(',');   
    y_ = Number(coords[0]);
    x_ = Number(coords[1]);
    color = coords[2];
    ctx.fillStyle = color;
    ctx.fillRect(x_+1, y_+1, cw-1, cw-1);
  };
  for (const x of deductions) {
    if (findDeduction) {
    coords = x.split(',');   
    cx_ = Number(coords[0]);
    cy_ = Number(coords[1]);
    ctx3.font = cw +"px Arial";
    ctx3.fillStyle = "black";
    ctx3.fillText("V", cx_ + 3 - cw, cy_ + 1 + cw);
    }
  }
}

function clearCanvas(canvas, ctx, filledRects) {
  for (const x of filledRects) {
    coords = x.split(',');   
    y_ = Number(coords[0]);
    x_ = Number(coords[1]);
    ctx.clearRect(x_+1, y_, cw-1, cw-1);
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
  lastPixel = filledRectsCanvasBottom[filledRectsCanvasBottom.length - 1];

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

function undoMain() {
  lastSize = mainPatternSizes[mainPatternSizes.length - 1];
  clearCanvas(canvas3, ctx3, filledRectsCanvas3);
  drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3);
  filledRectsCanvas3.splice(filledRectsCanvas3.length - lastSize);
  redrawRects(ctx3, filledRectsCanvas3);
  mainPatternSizes.pop();
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

function addDeduction(ctx, cx, cy) {
  ctx.font = cw +"px Arial";
  const cy_ = cy - 2
  const cx_ = cx + 2;
  ctx.strokeText("V", cx_ + 1, cy_ + 1);
}


function changeMainX() {
  mainX = document.getElementById("mainX").value;
  mainCanvasWidth = mainX;
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
  drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3);
}

function changeMainY() {
  mainY = document.getElementById("mainY").value;
  mainCanvasHeight = mainY;
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
  drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3);
}

function changeSmallY() {
  smallY = document.getElementById("smallY").value;
  smallCanvasHeight = smallY;
  ctxBottom.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
  drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxBottom);
  drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxTop);
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
  }

  else if (addingDeduction){
    
    const rect = canvas3.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cy = (y - (y%cw)) + p;
    const cx = (x - (x%cw)) + p ;
    const cy_ = cy - 2
    const cx_ = cx + 2;
    var new_coords = [cx, cy].toString();
    const findDeduction = deductions.includes(new_coords);
    console.log(new_coords, deductions, findDeduction)
    if (!findDeduction) {
      ctx3.font = cw +"px Arial";
      ctx3.globalAlpha = 1.0;
      ctx3.fillStyle = "black";
      ctx3.fillText("V", cx_ + 1 - cw, cy_ + 1+ cw);
      deductions.push(new_coords);
      // ctx3.globalAlpha = 0.2;
      // ctx3.fillStyle = "grey";
      // ctx3.fillRect(0,0,mainCanvasWidth*cw, cy_)
      // ctx3.globalAlpha = 1.0;
    }
    else {
      ctx3.clearRect(cx+1, cy+1, cw -1, cw-1);
      const ix = deductions.indexOf(new_coords);
      deductions.splice(ix, 1);
    }
    drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3);
    redrawRects(ctx3, filledRectsCanvas3);
  }
}
)



drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxBottom);
drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3)

