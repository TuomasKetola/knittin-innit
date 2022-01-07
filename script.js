let filledRectsCanvasTop = [];
let filledRectsCanvasBottom = [];
let filledRectsCanvas2 = [];
let filledRectsCanvas3 = [];
let mainPatternSizes = [];
let mouseToDragY = 1;
let mouseDown = false;
let minY = 10000;
let maxY = 1;
let minX = 10000;
let maxX = 1;

let mainCanvasWidth = 36;
let mainCanvasHeight = 42;
let smallCanvasWidth = 18;
let smallCanvasHeight = 18;
let drawingCanvasWidth = 18;

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

const div2 = document.getElementById('div2')
div2.canvas2 = document.createElement('canvas');

const div3 = document.getElementById('div3')
div3.canvas3 = document.createElement('canvas');

// resize canvases
resizeCanvas(div1, canvasTop)
resizeCanvas(div1, canvasBottom)
resizeCanvas(div2, canvas2)
resizeCanvas(div3, canvas3)

// get canvas contexts
const ctxTop = canvasTop.getContext('2d');
const ctxBottom = canvasBottom.getContext('2d');
const ctx2 = canvas2.getContext('2d');
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
}

function clickDrawToCanvas(canvas, event, cw, ctx, filledRects) {
  // draw to canvas
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const cy = (y - (y%cw)) + p;
  const cx = (x - (x%cw)) + p;
  let new_coords = [cy, cx,drawingColor].toString()
  const find = filledRects.includes(new_coords)
  ctx.beginPath();
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

  if (cx < drawingCanvasWidth * cw) { // make sure the drawing is on the canvas
    if (find){
      
      const ix = filledRects.indexOf(new_coords);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(cx+1, cy+1, cw-1, cw-1);  
      filledRects.splice(ix, 1)
      if (cx == maxX) {
        maxX = maxX - cw
      }
      if (cx == minX) {
        minX = minX + cw
      }
      console.log('here')
      ctx.strokeStyle = "black";
      ctx.stroke();
    }
    else {
      ctx.fillStyle = drawingColor;
      ctx.fillRect(cx+1, cy+1, cw-1, cw-1);
      filledRects.push(new_coords) 
    };
    // console.log("filled rects:", filledRects)
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
  if (mouseX > 0) { // make sure on the right canvas
    for(let i = 0; i <= nrReps - 1; i++) {
      for (const x of filledRects) {
        coords = x.split(',');   
        y_ = coords[0] - minY + mouseY - (mouseToDragY - minY);
        x_ = (coords[1] - minX + p) + i * shapeSize * cw;
        color = coords[2];
        new_coordsMain = [y_, x_,color].toString()

        filledRectsCanvas3.push(new_coordsMain);
        patternSize += 1;

        ctx.fillStyle = color;
        ctx.fillRect(x_+1, y_+1, cw-1, cw-1);
      }
    }
    mainPatternSizes.push(patternSize);
  } 
console.log(mainPatternSizes)
}


function changeCanvasBackground(canvas, ctx, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function changeBackground() {
  var newColour  = document.getElementById("background-color").value;
  backgroundColor = newColour;

  changeCanvasBackground(canvasBottom, ctxBottom, backgroundColor);
  changeCanvasBackground(canvas3, ctx3, backgroundColor);
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
  var mainCanvasHeight = Number(mainDimsArr[1]);
  
  // update main canvas size
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
  drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3);

  // update selection for small canvas size
  var smallCanvasSelect = document.getElementById('drawingDims');
  removeOptions(smallCanvasSelect);
  for (var x = mainCanvasWidth; x >= 2; x -= 1){
    if (mainCanvasWidth % x == 0) {
      var opt = document.createElement('option');
      opt.value = x+"x42";
      opt.innerHTML = x+"x42";
      smallCanvasSelect.appendChild(opt);
    }
  }
  }

function changeDrawingCanvasSizes() {
  var drawingDims = document.getElementById("drawingDims").value;
  var drawingDimsArr = drawingDims.split('x');
  drawingCanvasWidth = Number(drawingDimsArr[0]);
  drawingCanvasHeight = Number(drawingDimsArr[1]);
  smallCanvasWidth = drawingCanvasWidth; smallCanvasHeight = drawingCanvasHeight;
  ctxBottom.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  ctxTop.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  drawBoard(drawingCanvasWidth, drawingCanvasHeight, cw, ctxBottom);
  filledRectsCanvasBottom = []; filledRectsCanvasTop = []; minY = 10000; maxY = 1; minX = 10000; maxX = 1;
  changeBackground();
  redrawRects(ctx3, filledRectsCanvas3);
  // drawBoard(drawingCanvasWidth, drawingCanvasHeight, cw, ctxTop);
}

function redrawRects(ctx, filledRects) {
  for (const x of filledRects) {
    coords = x.split(',');   
    y_ = Number(coords[0]);
    x_ = Number(coords[1]);
    color = coords[2];
    ctx.fillStyle = color;
    console.log(x_+1, y_+1, cw-1, cw-1)
    ctx.fillRect(x_+1, y_+1, cw-1, cw-1);
  }
}

function clearCanvas(canvas, ctx, filledRects) {
  // ctx.fillStyle = backgroundColor;
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
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
  // drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxBottom);
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
}

function undoMain() {
  lastSize = mainPatternSizes[mainPatternSizes.length - 1];
  clearCanvas(canvas3, ctx3, filledRectsCanvas3);
  drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3);
  filledRectsCanvas3.splice(filledRectsCanvas3.length - lastSize);
  redrawRects(ctx3, filledRectsCanvas3);
  mainPatternSizes.pop();
}

// listener for dragging
canvasTop.addEventListener('mousedown', function(e) {
  const rect = canvasTop.getBoundingClientRect();
  const y = e.clientY - rect.top;
  mouseToDragY = (y - (y%cw)) + p;
})

// listener for clicking
canvasTop.addEventListener('click', function(e) {
  clickDrawToCanvas(canvasBottom, e, cw, ctxBottom, filledRectsCanvasTop);
  clickDrawToCanvas(canvasTop, e, cw, ctxTop, filledRectsCanvasBottom);
})

// listener for dragend
canvasTop.addEventListener('dragend', function(e) {
  drawFigToCanvas(canvas3, e, cw, ctx3, filledRectsCanvasTop)
})




drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxBottom)
drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctx2)
drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3)