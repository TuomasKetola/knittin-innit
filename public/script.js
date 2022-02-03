let filledRectsCanvasTop = [];
let filledRectsCanvasBottom = [];
let filledRectsCanvas2 = [];
let filledRectsCanvas3 = [];
// let filledRectsCanvas3 = ['392,2,#00ff00', '377,17,#00ff00', '392,32,#00ff00', '377,47,#00ff00', '392,62,#00ff00', '377,77,#00ff00', '392,92,#00ff00', '377,122,#00ff00', '392,137,#00ff00', '377,152,#00ff00', '392,167,#00ff00', '377,182,#00ff00', '392,197,#00ff00', '377,212,#00ff00', '392,227,#00ff00', '377,242,#00ff00', '392,257,#00ff00', '377,272,#00ff00', '392,287,#00ff00', '377,302,#00ff00', '392,317,#00ff00', '377,332,#00ff00', '392,347,#00ff00', '377,362,#00ff00', '392,377,#00ff00', '377,392,#00ff00', '392,407,#00ff00', '377,437,#00ff00', '392,452,#00ff00', '377,467,#00ff00', '392,482,#00ff00', '377,497,#00ff00', '392,512,#00ff00', '377,527,#00ff00']
// let filledRectsCanvas3NoDeductions = [];
let mainPatternSizes = [];
// let deductions = ['482,422', '482,47', '197,392', '197,137'];
// let deductions  = ['242,92', '242,392', '197,77', '197,377']
let deductions = []
// let deductions = ['362,257', '362,107', '257,2', '257,122']
// let deductions = ["62,152","62,107","512,62","512,212","422,77","422,197","317,77","317,182","182,92","182,167"];
let currentWindowIndex = 0;
let windowTop = 0;

let currentColorId = 0;
let currentColorDivId = undefined;

let mouseToDragY = 1;
let mouseDown = false;
let minY = 10000;
let maxY = 1;
let minX = 10000;
let maxX = 1;

let currentWindowTop = 0;
let currentWindowBotttom = 1000;

// let mainCanvasWidth = 36;
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
let drawMain = false;
let deductionYs = [];

let patternIX = 0;

let isChecked = false;

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
var p = 2;
var cw = 15;

// get colours
let backgroundColor = document.getElementById("background-color").value
let drawingColor = undefined;

function drawBoard(gridWidth, gridHeight, cellWidth, ctx, Ytop, Ybottom, nrDeductions){
  // draws all the boards
  ctx.beginPath();
  var top = Ytop - p || 0;
  if (top < 0) {top = 0}
  var gridHeight = Math.round((Ybottom  - Ytop) / 15)  || gridHeight
  var xStart = (nrDeductions * cw) / 2 + p + 0.5 || 0.5 + p;
  var gridWidth  = gridWidth - nrDeductions || gridWidth

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
    ctx.fillStyle = "black";
    for (var x = 0  ; x <= cellWidth * gridWidth - (1 * cellWidth); x += cellWidth) {
      ctx.font = 10 +"px Arial";
      ctx.fillText(x /cw + 1 , x + (cw / 3), gridHeight*cw + cw);
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
  let new_coords = [cx, cy,drawingColor].toString();
  const find = filledRects.includes(new_coords);
  ctx.beginPath();


  // make sure the drawing is on the canvas
  if (cx < drawingCanvasWidth * cw && cy < drawingCanvasHeight * cw) { 
    
    if (find){
      
      const ix = filledRects.indexOf(new_coords);
      ctx.clearRect(cx+1, cy+1, cw-1, cw-1);  
      filledRects.splice(ix, 1)
      ctx.strokeStyle = "black";
      ctx.stroke();
    }
    else {
      ctx.fillStyle = drawingColor;
      ctx.fillRect(cx+1, cy+1, cw-1, cw-1);
      filledRects.push(new_coords) 
    };
  }
  let Xs = [];
  let Ys = [];
  for (const coordsString of filledRects){
    coords = coordsString.split(',');
    Xs.push(Number(coords[0]));
    Ys.push(Number(coords[1]))
  }
  minX = p;
  maxX = Math.max(...Xs);
  minY = Math.min(...Ys);
  maxY = Math.max(...Ys);
}


function drawFigToCanvas(canvas, event, cw, ctx, filledRects) {
  // drag and drop fig from canvas to another 
  let Xs = [];
  let Ys = [];
  for (const coordsString of filledRects){
    coords = coordsString.split(',');
    Xs.push(Number(coords[0]));
    Ys.push(Number(coords[1]))
  }

  patternIX += 1
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const mouseY = (y - (y%cw)) + p;
  const mouseX = (x - (x%cw)) + p;
  var shapeSize = drawingCanvasWidth;
  
  
  var patternSize = 0;
  
  let sortedFilledRects = filledRects.sort(function(x,y){
    var xp = Number(x.substring(0, x.indexOf(',')));
    var yp = Number(y.substring(0, y.indexOf(',')));
    return xp == yp ? 0 : xp < yp ? -1 : 1;
  });
  const nrReps = mainCanvasWidth / shapeSize;
  let nrDeductions = nrDeducationsWindow(currentWindowIndex)
  if (mouseX > 0) { // make sure on the right canvas
    for(let i = 0; i <= nrReps - 1; i++) {  
      for (const x of sortedFilledRects) {
        coords = x.split(',');
        y_ = Number(coords[1]) - minY + mouseY - (mouseToDragY - minY);
        x_ = Number(coords[0]) + i * shapeSize * cw;
        
        color = coords[2];
        console.log('x',x_, color,i * shapeSize * cw)
         // dont draw outside canvas
        if (x_+1 < mainCanvasWidth * cw - nrDeductions * cw
          && y_ < currentWindowBotttom + cw && y_ > currentWindowTop - cw
          && x_ > 0) {
          new_coordsMain = [y_, x_,color,patternIX].toString();
          filledRectsCanvas3.push(new_coordsMain);
          patternSize += 1;
        }
      }
    }
    mainPatternSizes.push(patternSize);
  }
  reDrawMainCanvas();
}


function reDrawMainCanvas() {
  // clear canvas
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

  // set background
  ctx3.fillStyle = backgroundColor;
  ctx3.fillRect(p, p, mainCanvasWidth * cw + p, mainCanvasHeight*cw +p);
  
  // draw lines
  drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3);
  
  // empty pixels after deductions
  for (const ded of deductions) {
    coords = ded.split(',');
    deductionY = Number(coords[0]); deductionX = Number(coords[1]);
    ctx3.clearRect(deductionX+1, 0, cw-1, deductionY+cw)
    }
  
  
  // new fill rects
  let dedXs = [];
  var deducationsDict = {};
  var pIXPrevious = 0;
  for (const coordString of deductions) {
    coordsDeduction = coordString.split(',');
    coordsDedX = Number(coordsDeduction[1]); coordsDedY = Number(coordsDeduction[0]);
    deducationsDict[coordsDedX] = coordsDedY
    dedXs.push(coordsDedX)
  }

  let coordIx = 0;
  let addOn = 0;
  

  // console.log(filledRectsCanvasTop)
  // console.log(filledRectsCanvas3)
  let filledRectsCanvas3NoDeductions = [];
  while (coordIx < filledRectsCanvas3.length) {
    coords = filledRectsCanvas3[coordIx].split(',')
    y_ = Number(coords[0]);
    x_ = Number(coords[1]);
    pIX = Number(coords[3])
    
    color = coords[2];
    if (pIX > pIXPrevious) {
      addOn = 0
    }
    if (dedXs.includes(x_+addOn) && y_ <= deducationsDict[x_+addOn]){
      addOn += cw;
    }
    else{
      filledRectsCanvas3NoDeductions.push([y_,x_, color].toString())
      coordIx += 1;
      ctx3.fillStyle = color;
      ctx3.fillRect(x_+1 +addOn, y_+1, cw-1, cw-1);
    }
    pIXPrevious = pIX
  }
  // console.log(filledRectsCanvas3);
  // console.log(filledRectsCanvas3NoDeductions);
  
  // make window
  
  let deductionsReverse = deductions.sort(function(x,y){
    var xp = Number(x.substring(0, x.indexOf(',')));
    var yp = Number(y.substring(0, y.indexOf(',')));
    return xp == yp ? 0 : xp < yp ? -1 : 1;
  }).reverse();
  
  
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
      topY = y + cw;
      if (deductionIndex != 0) {
        dedCoordsPrevious = deductionsReverse[ix - 1].split(',');
        bottomY = Number(dedCoordsPrevious[0]) + cw;
      }
      break
    };
    previousY = y;
    nrDeductions += 1;
  };
  
  if (currentWindowIndex > deductionIndex && deductions.length > 0) {
    bottomY = y + cw;
    topY = 0;

  };
  
  // do window shading
  if (deductions.length > 0){
    updateWindowTopBottom();
    ctx3.fillStyle = "grey";
    ctx3.globalAlpha = 0.4;
    ctx3.fillRect(p, p, mainCanvasWidth*cw, topY-p);
    ctx3.fillRect(p, bottomY, mainCanvasWidth*cw, mainCanvasHeight * cw-bottomY + p);
    ctx3.globalAlpha = 1.0;
  }

  // deductions
  for (const x of deductions) {
    coords = x.split(',');   
    cy_ = Number(coords[0]);
    cx_ = Number(coords[1]);
    ctx3.font = cw +"px Arial";
    ctx3.fillStyle = "black";
    ctx3.fillText("V", cx_ + 3 - cw, cy_ + cw - 1);
  }
  
  //focus window
  // console.log(nrDeductions)
  if (focus) {
    ctx3.clearRect(0,topY, mainCanvasWidth * cw+p, bottomY - topY);
    ctx3.fillStyle = backgroundColor;
    ctx3.fillRect(p, topY, mainCanvasWidth * cw + p, bottomY - topY);
    drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3, topY, bottomY, nrDeductions);
    
    for (const coords of filledRectsCanvas3NoDeductions) {
      coordsArr = coords.split(',')
      x = Number(coordsArr[1]); y = Number(coordsArr[0]); color = coordsArr[2];
      x = x + (nrDeductions / 2) * cw;

      if (y < bottomY && y > topY - cw ) {
        ctx3.fillStyle = color
        ctx3.fillRect(x +1, y+1 , cw - 1, cw - 1)
    
      }
  }
  }
}


function changeCanvasBackground(ctx, color, height, width) {
  // change the color of a canvas bacground
  ctx.fillStyle = color;
  ctx.fillRect(p, p, width * cw + p, height*cw +p);
}

function changeBackground() {
  // change baclground function for html
  var newColour  = document.getElementById("background-color").value;
  backgroundColor = newColour;
  changeCanvasBackground(ctxBottom, backgroundColor, smallCanvasHeight, smallCanvasWidth);
  reDrawMainCanvas();
  drawBoard(drawingCanvasWidth, drawingCanvasHeight, cw, ctxBottom);
}

function changeDrawingColor() {
  // change the drawing color
  var newColour  = document.getElementById("drawing-color").value;
  drawingColor = newColour
}

function removeOptions(selectElement) {
  // empty the options for selects
  var i, L = selectElement.options.length - 1;
  for(i = L; i >= 0; i--) {
     selectElement.remove(i);
  }
}

function changeMainCanvasSizes(input_) {
  // change the canvas sizes for main
  var mainX = Number(document.getElementById("mainX").value)
  mainX = mainX - input_ || mainX 
  var mainCanvasWidth = mainX
  var smallCanvasSelect = document.getElementById('drawingDims');
  removeOptions(smallCanvasSelect);
  for (var x = mainCanvasWidth / 2; x >= 2; x -= 1){
    if (mainCanvasWidth % x == 0) {
      var opt = document.createElement('option');
      opt.value = x;
      opt.innerHTML = x;
      smallCanvasSelect.appendChild(opt);
    }
  };
  changeDrawingCanvasSizes();
  }

function changeDrawingCanvasSizes() {
  // change canvas sizes for the drawing canvas
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
  // clear the rects of a canvas
  for (const x of filledRects) {
    coords = x.split(',');   
    y_ = Number(coords[1]);
    x_ = Number(coords[0]);
    ctx.clearRect(x_+1, y_+1, cw-1, cw-1);
  }
}

function clearDraw() {
  // button function to clear the drawing canvas
  clearCanvas(canvasBottom, ctxBottom, filledRectsCanvasBottom);
  clearCanvas(canvasTop, ctxTop, filledRectsCanvasTop);
  minY = 10000; maxY = 1; minX = 10000; maxX = 1;
  filledRectsCanvasBottom = [];
  filledRectsCanvasTop = [];
}

function undoDraw() {
  // button function to undo draw
  let lastPixel = filledRectsCanvasBottom[filledRectsCanvasBottom.length - 1];
  if (lastPixel) {
    coords = lastPixel.split(',')
    y_ = Number(coords[1]);
    x_ = Number(coords[0]);
    
    ctxBottom.fillStyle = backgroundColor;
    ctxTop.fillStyle = backgroundColor;
    
    ctxBottom.fillRect(x_+1, y_+1, cw-1, cw-1)
    ctxTop.fillRect(x_+1, y_+1, cw-1, cw-1)

    filledRectsCanvasBottom.pop()
    filledRectsCanvasTop.pop()
  }
}

function undoMain() {
  // button function to undo main
  lastSize = mainPatternSizes[mainPatternSizes.length - 1];
  filledRectsCanvas3.splice(filledRectsCanvas3.length - lastSize);
  mainPatternSizes.pop();
  reDrawMainCanvas();
}

// function selectColorFromCanvas() {
//   // button boolean
//   selectingColor = !selectingColor;
//   if (selectingColor){
//     turnButtonOn("selectColor");
//     for (const but of ["deduction", "drawOnMain", "focus"]){
//       turnButtonOff(but);
//       if (focus){focus=false};
//       if (drawMain){drawMain=false};
//       if (deduction){deduction=false}
//     }
//   }
//   else {turnButtonOff("selectColor")}
//   reDrawMainCanvas();
// }

function deducationBool() {
  // button boolean
  addingDeduction = !addingDeduction;
  if (addingDeduction) {
    turnButtonOn("deduction");
    for (const but of [ "drawOnMain", "focus"]){
      turnButtonOff(but);
      if (focus){focus=false};
      if (drawMain){drawMain=false};
      // if (selectingColor){selectingColor=false}
    }
  }
  else {turnButtonOff("deduction")};
  reDrawMainCanvas();
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}

function changeMainX() {
  // button function change the X axis of main canvas
  mainX = document.getElementById("mainX").value;
  mainCanvasWidth = mainX;
  changeMainCanvasSizes();
  reDrawMainCanvas()
}

function changeMainY() {
  // button function change the Y axis of main canvas
  mainY = document.getElementById("mainY").value;
  mainCanvasHeight = mainY;
  reDrawMainCanvas();
}

function changeSmallY() {
  // button function change the Y axis of drawing canvas
  smallY = document.getElementById("smallY").value;
  smallCanvasHeight = smallY;
  drawingCanvasHeight = smallCanvasHeight
  ctxBottom.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
  filledRectsCanvasBottom = []
  filledRectsCanvasTop = []
  drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxBottom);
  drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxTop);
}

function turnButtonOn(buttonId, color){
  var property = document.getElementById(buttonId);
  property.style.backgroundColor = color || "green"
}

function turnButtonOff(buttonId){

  var property = document.getElementById(buttonId);
  property.style.backgroundColor = "white"
}

function focusOn(){
  // focus button / boolean
  focus = !focus;
  if (focus){ 
    turnButtonOn("focus");
    for (const but of ["deduction", "drawOnMain"]){
      turnButtonOff(but);
    }
    if (deduction){deduction=false};
    if (drawMain){drawMain=false};
    // if (selectingColor){selectingColor=false}
  }
  else {turnButtonOff('focus')}
  reDrawMainCanvas();
}

function drawOnMainOn(){
  // drawing directly to main on
  drawMain = !drawMain;
  if (drawMain){
    turnButtonOn("drawOnMain", drawingColor);
    for (const but of ["deduction", "focus"]){
      turnButtonOff(but)
    };
    if (deduction){deduction=false};
    if (focus){focus=false};
    // if (selectingColor){selectingColor=false}
  }
  else {turnButtonOff("drawOnMain")}
  reDrawMainCanvas();
}

function nrDeducationsWindow(windowIx) {  
  // give the number of deductions in a given window
  let currentIx = -1;
  nrDeductions = 0;
  previousY = mainCanvasHeight * cw;
  if (currentWindowIndex == 0) {
    return 0
  }
  for (const deduction of deductions.sort().reverse()) {
    coords = deduction.split(',')
    y = Number(coords[0]); x = Number(coords[1]);
    if (y < previousY) {
      currentIx += 1;
      if (currentIx == windowIx) {
        return nrDeductions
      }
    }
    previousY = y
    nrDeductions += 1;
    
  }
  return deductions.length
}

function updateWindowTopBottom(){
  let deductionsSorted = deductions.sort().reverse();
  let previousY__ = mainCanvasHeight * cw;
  let curIndex = -1;
  for (const ded of deductionsSorted){
    coords = ded.split(','); y = Number(coords[0]); x = Number(coords[1]);
    if (y<previousY__) {
      curIndex += 1;
    }
    if (curIndex == currentWindowIndex) {
      currentWindowBotttom = previousY__;
      currentWindowTop = y;
      break

    }
    previousY__ = y
    currentWindowBotttom = y; 
    currentWindowTop = 0;
  };
}

// Add color
function addColor() {
  currentColorId += 1;
  let newColor= document.getElementById("add-color").value;
  newDiv = document.createElement("div");
  newDiv.style.background = newColor;
  newDiv.style.border = "1px solid black";
  newDiv.id = "color-"+String(currentColorId);
  newDiv.className = "float-child";
  document.getElementById("drawing-color-divs").appendChild(newDiv);
  drawingColor = newColor;
}


function changeChosenColor() {
  let newColor = document.getElementById("hidden-color-change").value
  let curDiv = document.getElementById(currentColorDivId)
  let oldColorRGB = curDiv.style.backgroundColor;
  var rgb = oldColorRGB.split("(")[1].split(")")[0].split(',');
  var oldColorHex = "#" + ("000000" + rgbToHex(rgb[0], rgb[1], rgb[2])).slice(-6);
  
  curDiv.style.backgroundColor = newColor;
  drawingColor = newColor;
  for (x = 0; x <= filledRectsCanvas3.length - 1; x++) {
    let coords = filledRectsCanvas3[x].split(',')
    var rectColor = coords[2]; x_ = coords[1]; y_ = coords[0]
    if (rectColor == oldColorHex) {
      filledRectsCanvas3[x] = [y_, x_, newColor].toString();
    }
  };

  for (x = 0; x <= filledRectsCanvas3NoDeductions.length - 1; x++) {
    let coords = filledRectsCanvas3NoDeductions[x].split(',')
    var rectColor = coords[2]; x_ = coords[1]; y_ = coords[0]
    if (rectColor == oldColorHex) {
      filledRectsCanvas3NoDeductions[x] = [y_, x_, newColor].toString()
    }
  }
  reDrawMainCanvas();
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
    if (drawingColor){
      clickDrawToCanvas(canvasBottom, e, cw, ctxBottom, filledRectsCanvasTop);
      clickDrawToCanvas(canvasTop, e, cw, ctxTop, filledRectsCanvasBottom);
    }
  }
})

// listener for dragend || THIS ONLY WORKS WITH CHROME. BELOW SOLUTION
// canvasTop.addEventListener('dragend', function(e) {
//   drawFigToCanvas(canvas3, e, cw, ctx3, filledRectsCanvasTop)
// })
// SOLUTION:
// ################
dragOverHandler = function(e) {
  e.preventDefault();
  return false;
}

document.addEventListener('dragover', dragOverHandler);
document.addEventListener('drop', function(e) {
  drawFigToCanvas(canvas3, e, cw, ctx3, filledRectsCanvasTop)
})  
// 

// listener for clicking main canvas
canvas3.addEventListener('click', function(e) {
  // click to select color
  if (selectingColor) {
    const rect = canvas3.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    var pixelData = ctx3.getImageData(x, y, 1, 1).data; 
    var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
    drawingColor = hex;
    document.getElementById("drawing-color").value = drawingColor;

  }

  // click to add deduction
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

  // click to draw / click on main
  else if (drawMain) {
    const rect = canvas3.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cy = (y - (y%cw)) + p;
    const cx = (x - (x%cw)) + p;
    let new_coords = [cy, cx,drawingColor].toString();
    const find = filledRectsCanvas3.includes(new_coords);

    if (cx < mainCanvasWidth * cw && cy < mainCanvasHeight * cw) { 
      
      if (!find) {
        filledRectsCanvas3.push(new_coords) ;
        mainPatternSizes.push(1)
      }
      else {
        
        const replaceIx = filledRectsCanvas3.indexOf(new_coords);
        if (replaceIx > -1) {filledRectsCanvas3.splice(replaceIx, 1)};

      }
    }
  }

  // click to change windows
  else {
    // isChecked=document.getElementById("switchValue").checked;

    const rect = canvas3.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let previousY = mainCanvasHeight * cw;
    // deductionsReverse = deductions.sort().reverse();
    let deductionsReverse = deductions.sort(function(x,y){
      var xp = Number(x.substring(0, x.indexOf(',')));
      var yp = Number(y.substring(0, y.indexOf(',')));
      return xp == yp ? 0 : xp < yp ? -1 : 1;
    }).reverse();
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
        // break
      }
      previousY = y_;
    };

  };

  let nrDeductions = nrDeducationsWindow(currentWindowIndex);
  changeMainCanvasSizes(nrDeductions);
  reDrawMainCanvas()
}
)


// colorSelect
const colorSelectDiv = document.getElementById('drawing-color-divs')
colorSelectDiv.addEventListener('click', function(e) {
  if (e.target.style.backgroundColor) {
    var rgb = e.target.style.backgroundColor.split("(")[1].split(")")[0].split(',');
    var hex = "#" + ("000000" + rgbToHex(rgb[0], rgb[1], rgb[2])).slice(-6);
    drawingColor = hex;
    curColorBut = document.getElementById('add-color');
    curColorBut.value = drawingColor  
  }
})

colorSelectDiv.addEventListener('dblclick', function(e) {
  currentColorDivId = e.target.id;
  if (currentColorDivId) {
    let curDiv = document.getElementById(currentColorDivId)
    document.getElementById("hidden-color-change").focus();
    document.getElementById("hidden-color-change").value = "#FFCC00";
    document.getElementById("hidden-color-change").click();
  }
})


function download() {
  var dt = canvas3.toDataURL('image/jpeg');
  this.href = dt;
};
let downloadLnk  = document.getElementById('downloadLnk')
downloadLnk.addEventListener('click', download, false);




drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxBottom);
drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3)
reDrawMainCanvas();
// Get the modal
var modal = document.getElementById("manualModal");

// Get the button that opens the modal
var btn = document.getElementById("manualButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}