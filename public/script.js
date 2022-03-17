import {db, auth, addDoc, collection, doc, getDocs,getDoc, query, where, setDoc, orderBy} from './firebaseThings.js'
let filledRectsCanvasTop = [];
let filledRectsCanvasBottom = [];
let filledRectsCanvas3WithDeductions = [];
let filledRectsCanvas2 = [];
let patternToDelete = false
let previousColorDel = false
let coordsStrsToDeleteColor = [];
let deletePressed = false;
// let filledRectsCanvas3 = [];
// let filledRectsCanvas3 = ['392,2,#00ff00', '377,17,#00ff00', '392,32,#00ff00', '377,47,#00ff00', '392,62,#00ff00', '377,77,#00ff00', '392,92,#00ff00', '377,122,#00ff00', '392,137,#00ff00', '377,152,#00ff00', '392,167,#00ff00', '377,182,#00ff00', '392,197,#00ff00', '377,212,#00ff00', '392,227,#00ff00', '377,242,#00ff00', '392,257,#00ff00', '377,272,#00ff00', '392,287,#00ff00', '377,302,#00ff00', '392,317,#00ff00', '377,332,#00ff00', '392,347,#00ff00', '377,362,#00ff00', '392,377,#00ff00', '377,392,#00ff00', '392,407,#00ff00', '377,437,#00ff00', '392,452,#00ff00', '377,467,#00ff00', '392,482,#00ff00', '377,497,#00ff00', '392,512,#00ff00', '377,527,#00ff00']
// let filledRectsCanvas3NoDeductions = [];
// let mainPatternSizes = [];
// let deductions = ['482,422', '482,47', '197,392', '197,137'];
// let deductions  = ['242,92', '242,392', '197,77', '197,377']
// let deductions = []
// let deductions = ['92,62', '92,182', '437,227', '437,107', '317,2', '317,122', '182,47', '182,167', '17,77', '17,152']
// let deductions = ['362,257', '362,107', '257,2', '257,122']
// let deductions = ["62,152","62,107","512,62","512,212","422,77","422,197","317,77","317,182","182,92","182,167"];
let currentWindowIndex = 0;
let windowTop = 0;

let currentColorId = 0;
var currentColorDivId = undefined;

let mouseToDragY = 1;
let mouseDown = false;
let minY = 10000;
let maxY = 1;
let minX = 10000;
let maxX = 1;
let movingCoords = [];
let belowMoveColor = undefined;
let moveSelected = false;

let currentWindowTop = 0;

// let mainCanvasWidth = 36
let mainCanvasWidth = document.getElementById("mainX").value;
// let mainCanvasWidth = 16;
// let mainCanvasHeight = 42;
let mainCanvasHeight = document.getElementById("mainY").value;
let smallCanvasWidth = document.getElementById("drawingDims").value;
let smallCanvasHeight = document.getElementById("smallY").value;;
let drawingCanvasHeight = document.getElementById("smallY").value;;
let drawingCanvasWidth = smallCanvasWidth;

let selectingColor = false;
let findDeduction = false;
let addingDeduction = false;
let focus = false;
let drawMain = false;
let movePattern_ = false;
let deductionYs = [];



let isChecked = false;

var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

let backgroundColor = document.getElementById("background-color").value

// Refactring of javascript:
let Jumper = {
  creator: '',
  mainPatternSizes: [],
  creatorEmail: '',
  name: '',
  id_: ID(),
  createdAt: '',
  patternIX: 0,
  colors: [],
  // deductions: ['482,422', '482,47', '197,392', '197,137'],
  deductions: [],
  filledRectsCanvas3: [],
  // filledRectsCanvas3: ['167,2,#f40b0b,1', '152,17,#f40b0b,1', '167,32,#f40b0b,1', '152,47,#f40b0b,1', '167,62,#f40b0b,1', '152,77,#f40b0b,1', '167,92,#f40b0b,1', '152,107,#f40b0b,1', '167,122,#f40b0b,1', '152,137,#f40b0b,1', '167,152,#f40b0b,1', '152,167,#f40b0b,1', '167,182,#f40b0b,1', '152,197,#f40b0b,1', '167,212,#f40b0b,1', '152,227,#f40b0b,1', '167,242,#f40b0b,1', '152,257,#f40b0b,1', '167,272,#f40b0b,1', '152,287,#f40b0b,1', '167,302,#f40b0b,1', '152,317,#f40b0b,1', '167,332,#f40b0b,1', '152,347,#f40b0b,1', '167,362,#f40b0b,1', '152,377,#f40b0b,1', '167,392,#f40b0b,1', '152,407,#f40b0b,1', '167,422,#f40b0b,1', '152,437,#f40b0b,1', '167,452,#f40b0b,1', '152,467,#f40b0b,1', '362,2,#f40b0b,2', '347,17,#f40b0b,2', '362,32,#f40b0b,2', '347,47,#f40b0b,2', '362,62,#f40b0b,2', '347,77,#f40b0b,2', '362,92,#f40b0b,2', '347,107,#f40b0b,2', '362,122,#f40b0b,2', '347,137,#f40b0b,2', '362,152,#f40b0b,2', '347,167,#f40b0b,2', '362,182,#f40b0b,2', '347,197,#f40b0b,2', '362,212,#f40b0b,2', '347,227,#f40b0b,2', '362,242,#f40b0b,2', '347,257,#f40b0b,2', '362,272,#f40b0b,2', '347,287,#f40b0b,2', '362,302,#f40b0b,2', '347,317,#f40b0b,2', '362,332,#f40b0b,2', '347,347,#f40b0b,2', '362,362,#f40b0b,2', '347,377,#f40b0b,2', '362,392,#f40b0b,2', '347,407,#f40b0b,2', '362,422,#f40b0b,2', '347,437,#f40b0b,2', '362,452,#f40b0b,2', '347,467,#f40b0b,2'],
  backgroundColor:backgroundColor,
  ypixels: mainCanvasHeight,
  xpixels: mainCanvasWidth,
  
  mainPatternWidthPx: function() {
    return this.xpixels * cw + p
  },
  mainPatternHeightPx: function() {
    return this.ypixels * cw + p
  },
  deductionsSortReverse: function() {
    let deductionsReverse = this.deductions.sort(function(x,y){
      var xp = Number(x.substring(0, x.indexOf(',')));
      var yp = Number(y.substring(0, y.indexOf(',')));
      return xp == yp ? 0 : xp < yp ? -1 : 1;
    }).reverse();
    return deductionsReverse
  },

  windows: [],
  findWindows: function() {
    // go through deductions and make an array with {top: x, bottom:y, windowIX}
    let sortedDeductions = this.deductionsSortReverse();
    let yPrev = this.mainPatternHeightPx();
    let windowIx = 0;
    let nrDeductions = 0
    for (var dedStr of sortedDeductions) {
      
      let y = Number(dedStr.split(',')[0]);
      if (y < yPrev) {
        let top_ = y;
        this.windows.push({'top_':top_ + cw, 'bottom':yPrev + cw, 'IX':windowIx, 'nrDeductions':nrDeductions})
        windowIx += 1;
      }
      yPrev = y;
      nrDeductions += 1;
    }
    this.windows.push({'top_':0, 'bottom':yPrev + cw, 'IX':windowIx, 'nrDeductions':nrDeductions})
  },
  calculateCurrentPatternIX: function() {
    let IXs = []
    for (var coordsStr of this.filledRectsCanvas3){
      let coords = coordsStr.split(',')
      IXs.push(coords[3])
    }
    return Math.max(...IXs)
  }
}


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
let currentWindowBotttom = mainCanvasHeight * cw - cw;
// get colours

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
      ctx.fillText(gridWidth - x /cw , x + (cw / 3), gridHeight*cw + cw);
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
    if (movePattern_ && !moveSelected){
      ctx.fillStyle = '#ff007f';
      
      
      var c = canvasTop.getContext('2d');
      var p_ = c.getImageData(cx+1, cy+1, 1, 1).data; 
      var hex = "#" + ("000000" + rgbToHex(p_[0], p_[1], p_[2])).slice(-6);
      movingCoords = [cx,cy];
      belowMoveColor = hex;
      if (belowMoveColor == '#000000') {belowMoveColor = Jumper.backgroundColor}
      ctx.fillRect(cx+1, cy+1, cw-1, cw-1);
      return
    }
    if (find){
      
      const ix = filledRects.indexOf(new_coords);
      ctx.fillStyle = Jumper.backgroundColor
      ctx.fillRect(cx+1, cy+1, cw-1, cw-1);  
      ctx.fillStyle = drawingColor
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
    let coords = coordsString.split(',');
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
  // if (fullPreview) {
  //   return
  // }
  for (const coordsString of filledRects){
    let coords = coordsString.split(',');
    Xs.push(Number(coords[0]));
    Ys.push(Number(coords[1]))
  };
  if (movePattern_) {
    movePattern_ = false;
    turnButtonOff('movePattern');
    ctxTop.fillStyle = belowMoveColor;
    ctxTop.fillRect(movingCoords[0]+1, movingCoords[1]+1, cw-1, cw-1);
    ctxBottom.fillStyle = belowMoveColor;
    ctxBottom.fillRect(movingCoords[0]+1, movingCoords[1]+1, cw-1, cw-1);
    moveSelected = false;
  }

  Jumper.patternIX += 1
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
        let coords = x.split(',');
        let y_ = Number(coords[1]) - minY + mouseY - (mouseToDragY - minY);
        let x_= Number(coords[0]) + i * shapeSize * cw;
        let color = coords[2];
         // dont draw outside canvas
        if (x_+1 < mainCanvasWidth * cw - nrDeductions * cw
          && y_ < currentWindowBotttom + cw && y_ > currentWindowTop
          && x_ > 0) {
          let new_coordsMain = [y_, x_,color,Jumper.patternIX].toString();
          Jumper.filledRectsCanvas3.push(new_coordsMain);
          patternSize += 1;
        }
      }
    }
    Jumper.mainPatternSizes.push(patternSize);
  }
  reDrawMainCanvas();
}


function reDrawMainCanvas(download_) {
  // clear canvas
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

  // set background
  ctx3.fillStyle = Jumper.backgroundColor;
  ctx3.fillRect(p, p, Jumper.xpixels * cw + p, Jumper.ypixels*cw +p);
  
  // draw lines
  drawBoard(Jumper.xpixels, Jumper.ypixels, cw, ctx3);
  
  // empty pixels after deductions
  for (const ded of Jumper.deductions) {
    let coords = ded.split(',');
    let deductionY = Number(coords[0]); let deductionX = Number(coords[1]);
    ctx3.clearRect(deductionX+1, 0, cw-1, deductionY+cw)
    }
  
  
  // new fill rects
  let dedXs = [];
  var deducationsDict = {};
  var pIXPrevious = 0;
  for (const coordString of Jumper.deductions) {
    let coordsDeduction = coordString.split(',');
    let coordsDedX = Number(coordsDeduction[1]); let coordsDedY = Number(coordsDeduction[0]);
    deducationsDict[coordsDedX] = coordsDedY
    dedXs.push(coordsDedX)
  }

  let coordIx = 0;
  let addOn = 0;
  

  let filledRectsCanvas3NoDeductions = [];
  filledRectsCanvas3WithDeductions = [];

  // sort out stupid padded patterns
  let dedXsSorted = [];
  for (var _x of dedXs) {
    dedXsSorted.push(Number(_x))
  };
  
  dedXsSorted.sort(function(a, b){return a-b});

  let nextDedIX = 0;
  while (coordIx < Jumper.filledRectsCanvas3.length) {
    let coords = Jumper.filledRectsCanvas3[coordIx].split(',')
    let y_ = Number(coords[0]);
    let x_ = Number(coords[1]);
    let pIX = Number(coords[3]);
    let color = coords[2];
    if (pIX > pIXPrevious) {
      addOn = 0
      nextDedIX = 0;
    }
    if (x_+addOn >= dedXsSorted[nextDedIX]){
      let deducationY = deducationsDict[dedXsSorted[nextDedIX]]
      nextDedIX += 1;
      if (y_ <= deducationY) {
        addOn += cw;
      }
    }
    else{
      filledRectsCanvas3NoDeductions.push([y_,x_, color].toString())
      coordIx += 1;
      ctx3.fillStyle = color;
      if (pIX) {
        ctx3.fillRect(x_+1 +addOn, y_+1, cw-1, cw-1);
        filledRectsCanvas3WithDeductions.push([x_+addOn, y_, color, pIX].toString());
      }
      else {
        ctx3.fillRect(x_+1, y_+1, cw-1, cw-1);
        filledRectsCanvas3WithDeductions.push([x_, y_, color, pIX].toString());
      }
    }
    pIXPrevious = pIX
  }
  
  // make window
  
  let deductionsReverse = Jumper.deductionsSortReverse()
  
  
  let previousY = Jumper.ypixels * cw;
  let bottomY = previousY
  let deductionIndex = -1
  let nrDeductions = 0;
  let topY = 0;
  let y = 0;
  for (var ix = 0  ; ix <= deductionsReverse.length - 1; ix ++)  {
    let dedCoords = deductionsReverse[ix].split(',');
    y = Number(dedCoords[0]);
    // let x = Number(dedCoords[1]);
    if (y < previousY) {
      deductionIndex += 1
    }
    if (deductionIndex == currentWindowIndex) {
      topY = y + cw;
      if (deductionIndex != 0) {
        let dedCoordsPrevious = deductionsReverse[ix - 1].split(',');
        bottomY = Number(dedCoordsPrevious[0]) + cw;
      }
      break
    };
    previousY = y;
    nrDeductions += 1;
  };
  
  if (currentWindowIndex > deductionIndex && Jumper.deductions.length > 0) {
    bottomY = y + cw;
    topY = 0;

  };
  
  // do window shading
  if (Jumper.deductions.length > 0 && !download_){
    updateWindowTopBottom();
    ctx3.fillStyle = "grey";
    ctx3.globalAlpha = 0.4;
    ctx3.fillRect(p, p, Jumper.xpixels*cw, topY-p);
    ctx3.fillRect(p, bottomY, Jumper.xpixels*cw, Jumper.ypixels * cw-bottomY + p);
    ctx3.globalAlpha = 1.0;
  }

  // deductions
  for (const x of Jumper.deductions) {
    let coords = x.split(',');   
    let cy_ = Number(coords[0]);
    let cx_ = Number(coords[1]);
    ctx3.font = cw +"px Arial";
    ctx3.fillStyle = "black";
    ctx3.fillText("V", cx_ + 3 - cw, cy_ + cw - 1);
  }
  
  //focus window
  if (focus) {
    ctx3.clearRect(0,topY, Jumper.xpixels * cw+p, bottomY - topY);
    ctx3.fillStyle = Jumper.backgroundColor;
    ctx3.fillRect(p, topY, Jumper.xpixels * cw + p, bottomY - topY);
    drawBoard(Jumper.xpixels, Jumper.ypixels, cw, ctx3, topY, bottomY, nrDeductions);
    
    for (const coords of filledRectsCanvas3NoDeductions) {
      let coordsArr = coords.split(',')
      let x = Number(coordsArr[1]); let y = Number(coordsArr[0]); let color = coordsArr[2];
      x = x + (nrDeductions / 2) * cw;

      if (y < bottomY && y > topY - cw ) {
        ctx3.fillStyle = color
        ctx3.fillRect(x +1, y+1 , cw - 1, cw - 1)
    
      }
    }
  }

  // preview
  // if (fullPreview){
  //   Jumper.findWindows()
  //   for (var win of Jumper.windows) {
  //     console.log(win)
  //     let topY = win['top_'];
  //     let bottomY = win['bottom'];
  //     let nrDeductions = win['nrDeductions'];
  //     ctx3.clearRect(0,topY, Jumper.xpixels * cw+p, bottomY - topY);
  //     ctx3.fillStyle = Jumper.backgroundColor;
  //     ctx3.fillRect(p, topY, Jumper.xpixels * cw + p, bottomY - topY);
  //     drawBoard(Jumper.xpixels, Jumper.ypixels, cw, ctx3, topY, bottomY, nrDeductions);
      
  //     for (const coords of filledRectsCanvas3NoDeductions) {
  //       let coordsArr = coords.split(',')
  //       let x = Number(coordsArr[1]); let y = Number(coordsArr[0]); let color = coordsArr[2];
  //       x = x + (nrDeductions / 2) * cw;

  //       if (y < bottomY && y > topY - cw ) {
  //         ctx3.fillStyle = color
  //         ctx3.fillRect(x +1, y+1 , cw - 1, cw - 1)
      
  //       }
  //     }
  //   }
  // }
 
}

function changeCanvasBackground(ctx, color, height, width) {
  // change the color of a canvas bacground
  ctx.fillStyle = color;
  ctx.fillRect(p, p, width * cw + p, height*cw +p);
}

let changeBackgroundElem = document.getElementById('background-color')
changeBackgroundElem.addEventListener('change', function(e) {
  changeBackground();
})

function changeBackground() {
  // change baclground function for html
  var newColour  = document.getElementById("background-color").value;
  backgroundColor = newColour;
  Jumper.backgroundColor = newColour
  changeCanvasBackground(ctxBottom, Jumper.backgroundColor, smallCanvasHeight, smallCanvasWidth);
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
  if (mainCanvasWidth / 2 > 21) {
    div1.style.width = cw * mainCanvasWidth / 2 + p + cw + 'px'
    div3.style.width = cw * mainCanvasWidth + p + cw + 'px'
    resizeCanvas(div1, canvasTop)
    resizeCanvas(div1, canvasBottom)
    resizeCanvas(div3, canvas3)
  };
  if (mainCanvasWidth / 2 < 21) {
    div1.style.width = '390px'
    resizeCanvas(div1, canvasTop)
    resizeCanvas(div1, canvasBottom)
    div3.style.width = '780px'
    resizeCanvas(div3, canvas3)
    
  };
  changeDrawingCanvasSizes();
  }

let drawingDimsElem = document.getElementById('drawingDims')
drawingDimsElem.addEventListener('change', function(e) {
  changeDrawingCanvasSizes()
})

function changeDrawingCanvasSizes() {
  // change canvas sizes for the drawing canvas
  var drawingX = document.getElementById("drawingDims").value;
  drawingCanvasWidth = drawingX;
  drawingCanvasHeight = smallCanvasHeight;
  smallCanvasWidth = drawingCanvasWidth; smallCanvasHeight = drawingCanvasHeight;
  ctxBottom.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  ctxTop.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  drawBoard(drawingCanvasWidth, drawingCanvasHeight, cw, ctxBottom);
  filledRectsCanvasBottom = []; filledRectsCanvasTop = []
  minY = 10000; maxY = 1; minX = 10000; maxX = 1;
  changeBackground();
  reDrawMainCanvas();
}

function clearCanvas(canvas, ctx, filledRects) {
  // clear the rects of a canvas
  for (const x of filledRects) {
    let coords = x.split(',');   
    let y_ = Number(coords[1]);
    let x_ = Number(coords[0]);
    ctx.fillStyle = Jumper.backgroundColor
    ctx.fillRect(x_+1, y_+1, cw-1, cw-1);
    ctx.fillStyle = drawingColor
  }
}



let clearDrawButton = document.getElementById('clearDraw')
clearDrawButton.addEventListener('click', function(e) { 
  clearDraw();
})
function clearDraw() {
  // button function to clear the drawing canvas
  ctxBottom.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  ctxTop.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  changeCanvasBackground(ctxBottom, Jumper.backgroundColor, smallCanvasHeight, smallCanvasWidth);
  drawBoard(drawingCanvasWidth, drawingCanvasHeight, cw, ctxBottom);
  minY = 10000; maxY = 1; minX = 10000; maxX = 1;
  filledRectsCanvasTop = [];
  filledRectsCanvasBottom = [];
}


let undoDrawButton = document.getElementById('undoDrawing')
undoDrawButton.addEventListener('click', function(e) { 
  undoDraw();
})
function undoDraw() {
  // button function to undo draw
  let lastPixel = filledRectsCanvasBottom[filledRectsCanvasBottom.length - 1];
  if (lastPixel) {
    let coords = lastPixel.split(',')
    let y_ = Number(coords[1]);
    let x_ = Number(coords[0]);
    
    ctxBottom.fillStyle = Jumper.backgroundColor;
    ctxTop.fillStyle = Jumper.backgroundColor;
    
    ctxBottom.fillRect(x_+1, y_+1, cw-1, cw-1)
    ctxTop.fillRect(x_+1, y_+1, cw-1, cw-1)

    filledRectsCanvasBottom.pop()
    filledRectsCanvasTop.pop();
    
    ctxBottom.fillRect(movingCoords[0]+1, movingCoords[1]+1, cw-1, cw-1)
    ctxTop.fillRect(movingCoords[0]+1, movingCoords[1]+1, cw-1, cw-1)
    let Xs = [];
    let Ys = [];
    for (const coordsString of filledRectsCanvasBottom){
      let coords = coordsString.split(',');
      Xs.push(Number(coords[0]));
      Ys.push(Number(coords[1]))
    }
    minX = p;
    maxX = Math.max(...Xs);
    minY = Math.min(...Ys);
    maxY = Math.max(...Ys);
  }
}

let undoMainButton = document.getElementById('undoMain')
undoMainButton.addEventListener('click', function(e) {
  undoMain()
})

function undoMain() {
  // button function to undo main
  let lastSize = Jumper.mainPatternSizes[Jumper.mainPatternSizes.length - 1];
  Jumper.filledRectsCanvas3.splice(Jumper.filledRectsCanvas3.length - lastSize);
  Jumper.mainPatternSizes.pop();
  reDrawMainCanvas();
}

let deductionButton  = document.getElementById('deduction')
deductionButton.addEventListener('click', function(e) {
  deducationBool()
})

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


let mainXelem = document.getElementById('mainX')
mainXelem.addEventListener('change', function(e) {
  changeMainX();
})

function changeMainX(value) {
  // button function change the X axis of main canvas
  let mainX = value || document.getElementById("mainX").value;
  mainCanvasWidth = mainX;
  Jumper.xpixels = mainX;
  changeMainCanvasSizes();
  reDrawMainCanvas()
}

let mainYelem = document.getElementById('mainY')
mainYelem.addEventListener('change', function(e) {
  changeMainY();
})
function changeMainY(value) {
  // button function change the Y axis of main canvas
  let mainY = value || document.getElementById("mainY").value;
  mainCanvasHeight = mainY;
  Jumper.ypixels = mainY
  reDrawMainCanvas();
}

let changeSmallYelem = document.getElementById('smallY')
changeSmallYelem.addEventListener('change', function(e) {
  // button function change the Y axis of drawing canvas
  let smallY = document.getElementById("smallY").value;
  smallCanvasHeight = smallY;
  drawingCanvasHeight = smallCanvasHeight
  ctxBottom.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
  ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
  filledRectsCanvasBottom = []
  filledRectsCanvasTop = []
  ctxBottom.fillStyle = Jumper.backgroundColor;
  ctxBottom.fillRect(p, p, smallCanvasWidth * cw + p, smallCanvasHeight*cw +p);
  drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxBottom);
  // drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxTop);
  
})

function turnButtonOn(buttonId, color){
  var property = document.getElementById(buttonId);
  property.style.backgroundColor = color || "green"
}

function turnButtonOff(buttonId){

  var property = document.getElementById(buttonId);
  property.style.backgroundColor = "white"
}

let focusButton = document.getElementById('focus');
focusButton.addEventListener('click', function(e) {
  focusOn();
})

function focusOn(){
  // focus button / boolean
  focus = !focus;
  if (focus){ 
    turnButtonOn("focus");
    for (const but of ["deduction", "drawOnMain"]){
      turnButtonOff(but);
    }
    if (addingDeduction){addingDeduction=false};
    if (drawMain){drawMain=false};
    // if (selectingColor){selectingColor=false}
  }
  else {turnButtonOff('focus')}
  reDrawMainCanvas();
}

let drawMainButton = document.getElementById('drawOnMain')
drawMainButton.addEventListener('click', function(e) {
  drawOnMainOn()
})
function drawOnMainOn(){
  // drawing directly to main on
  drawMain = !drawMain;
  if (drawMain){
    turnButtonOn("drawOnMain", drawingColor);
    for (const but of ["deduction", "focus"]){
      turnButtonOff(but)
    };
    if (addingDeduction){addingDeduction=false};
    if (focus){focus=false};

  }
  else {turnButtonOff("drawOnMain")};
}

function nrDeducationsWindow(windowIx) {  
  // give the number of deductions in a given window
  let currentIx = -1;
  let nrDeductions = 0;
  let previousY = mainCanvasHeight * cw;
  if (currentWindowIndex == 0) {
    return 0
  }
  
  let deductionsReverse = Jumper.deductionsSortReverse()
  for (const deduction of deductionsReverse) {
    let coords = deduction.split(',')
    let y = Number(coords[0]); let x = Number(coords[1]);
    if (y < previousY) {
      currentIx += 1;
      if (currentIx == windowIx) {
        return nrDeductions
      }
    }
    previousY = y
    nrDeductions += 1;
    
  }
  return Jumper.deductions.length
}

function updateWindowTopBottom(){
    
  let deductionsSorted = Jumper.deductionsSortReverse()
  let previousY__ = mainCanvasHeight * cw - cw;
  let curIndex = -1;
  for (const ded of deductionsSorted){
    let coords = ded.split(','); let y = Number(coords[0]); let x = Number(coords[1]);
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
let addColorElem = document.getElementById('add-color');
addColorElem.addEventListener('change', function(e) {
  currentColorId += 1;
  let newColor= document.getElementById("add-color").value;
  let newDiv = document.createElement("div");
  newDiv.style.background = newColor;
  newDiv.style.border = "1px solid black";
  newDiv.id = "color-"+String(currentColorId);
  newDiv.className = "float-child";
  document.getElementById("drawing-color-divs").appendChild(newDiv);
  drawingColor = newColor;
  Jumper.colors.push(newColor)
})


let changeChosenColorElem = document.getElementById('hidden-color-change')
changeChosenColorElem.addEventListener('change', function(e) {
  changeChosenColor();
})
function changeChosenColor() {
  let newColor = document.getElementById("hidden-color-change").value
  
  let curDiv = document.getElementById(currentColorDivId)
  let oldColorRGB = curDiv.style.backgroundColor;
  var rgb = oldColorRGB.split("(")[1].split(")")[0].split(',');
  var oldColorHex = "#" + ("000000" + rgbToHex(rgb[0], rgb[1], rgb[2])).slice(-6);
  
  curDiv.style.backgroundColor = newColor;
  drawingColor = newColor;
  for (let x = 0; x <= Jumper.filledRectsCanvas3.length - 1; x++) {
    let coords = Jumper.filledRectsCanvas3[x].split(',')
    var rectColor = coords[2]; var x_ = coords[1]; var y_ = coords[0]; var pIX=coords[3]
    if (rectColor == oldColorHex) {
      Jumper.filledRectsCanvas3[x] = [y_, x_, newColor, pIX].toString();
    }
  };
  for (var i=0; i<coordsStrsToDeleteColor.length;i++ ) {
    if (coordsStrsToDeleteColor[i] == oldColorHex) {
      coordsStrsToDeleteColor[i] = newColor
    }
  }
  // coordsStrsToDeleteColor
  reDrawMainCanvas();
}


let movePatternButton = document.getElementById('movePattern')
movePatternButton.addEventListener('click', function(e) { 
  movePattern();
})
function movePattern() {
  movePattern_ = !movePattern_;
  if (movePattern_) {
    turnButtonOn('movePattern');

  }
  else {
    turnButtonOff('movePattern');
    ctxTop.fillStyle = belowMoveColor;
    ctxTop.fillRect(movingCoords[0]+1, movingCoords[1] + 1, cw-1, cw-1);
    ctxBottom.fillStyle = belowMoveColor;
    ctxBottom.fillRect(movingCoords[0]+1, movingCoords[1] + 1, cw-1, cw-1);
  }
}

let nameElem = document.getElementById('jumperName')
nameElem.addEventListener('change', function(e) {
  changeName();
})
function changeName() {
  let nameElem = document.getElementById('jumperName');
  Jumper.name = nameElem.value;

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
      if (movePattern_ && moveSelected) {
        moveSelected = !moveSelected;
      }
    }
  }
})

// listener for dragend || THIS ONLY WORKS WITH CHROME. BELOW SOLUTION
// canvasTop.addEventListener('dragend', function(e) {
//   drawFigToCanvas(canvas3, e, cw, ctx3, filledRectsCanvasTop)
// })
// SOLUTION:
// ################
let dragOverHandler = function(e) {
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

  else if (deletePressed) {
      deletePressed = !deletePressed;
      turnButtonOff('deletePattern');
      let delIndex = 0
      for (let coordsStr of Jumper.filledRectsCanvas3) {
        let coords = coordsStr.split(',')
        let x_ = Number(coords[1]); let y_ = Number(coords[0]); let color = coords[2]; let pIX = coords[3];
        if (pIX == patternToDelete) {
          let newCoordString = [y_,x_,coordsStrsToDeleteColor[delIndex], pIX].toString()
          Jumper.filledRectsCanvas3[delIndex] = newCoordString;
        }
          delIndex += 1;
        }
        coordsStrsToDeleteColor = [];
        patternToDelete = false;

      }  

  // click to add deduction
  else if (addingDeduction){
    
    const rect = canvas3.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cy = (y - (y%cw)) + p;
    const cx = (x - (x%cw)) + p ;
    var new_coords = [cy, cx].toString();
    const findDeduction = Jumper.deductions.includes(new_coords);
    

    if (!findDeduction) {
      if (cx < mainCanvasWidth * cw){
        Jumper.deductions.push(new_coords);
      }
    }
    else {
      const ix = Jumper.deductions.indexOf(new_coords);
      Jumper.deductions.splice(ix, 1);
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
    let new_coords = [cy, cx, drawingColor].toString();
    const find = Jumper.filledRectsCanvas3.includes(new_coords);
    if (cx < mainCanvasWidth * cw && cy < mainCanvasHeight * cw) { 
      
      if (!find) {
        Jumper.filledRectsCanvas3.push(new_coords);
        Jumper.mainPatternSizes.push(1)
      }
      else {
        const replaceIx = Jumper.filledRectsCanvas3.indexOf(new_coords);
        if (replaceIx > -1) {Jumper.filledRectsCanvas3.splice(replaceIx, 1)};

      }
    }
  }
  

  // click to move pattern
  else if (movePattern_) {
    drawFigToCanvas(canvas3, e, cw, ctx3, filledRectsCanvasTop);
    return
  }

  // click to change windows
  else {
    const rect = canvas3.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let previousY = mainCanvasHeight * cw;
    // deductionsReverse = deductions.sort().reverse();
    let deductionsReverse = Jumper.deductionsSortReverse()
    let deductionIndex = -1
    let topY = 0;
    let bottomY = Jumper.ypixels * cw ;
    for (var ix = 0  ; ix <= deductionsReverse.length - 1; ix ++)  {
            
      let dedCoords = deductionsReverse[ix].split(',');
      let y_ = Number(dedCoords[0]);
      let x_ = Number(dedCoords[1]);
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
    let curColorBut = document.getElementById('add-color');
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

canvas3.resizeAndExport = function(width, height){
  // create a new canvas
  var c = document.createElement('canvas');
  // set its width&height to the required ones
  c.width = width;
  c.height = height;
  // draw our canvas to the new one
  c.getContext('2d').drawImage(this, 0,0,c.width + cw + 10, c.height + cw + 10, 0,0,width, height);
  // return the resized canvas dataURL
  return c.toDataURL();
  }


function download() {

  reDrawMainCanvas('download');
  var img = new Image();
  img.src = canvas3.resizeAndExport(mainCanvasWidth * cw, mainCanvasHeight * cw);
  // var dt = canvas3.toDataURL('image/jpeg');
  this.href = img.src;
  reDrawMainCanvas();
};
let downloadLnk  = document.getElementById('downloadLnk')
downloadLnk.addEventListener('click', download, false);


// esikatselu
// let previewButton = document.getElementById('full-preview-button')
// let fullPreview = false
// previewButton.addEventListener('click', function(e) {
//   fullPreview = !fullPreview
//   if (fullPreview) {
//     turnButtonOn('full-preview-button')
//   }
//   else {
//     turnButtonOff('full-preview-button')
//   }
//   reDrawMainCanvas();
// })



drawBoard(smallCanvasWidth, smallCanvasHeight, cw, ctxBottom);
drawBoard(mainCanvasWidth, mainCanvasHeight, cw, ctx3)
reDrawMainCanvas();

// Get the modal for the manual
var modalMan = document.getElementById("manualModal");
var btn = document.getElementById("manualButton");
var span = document.getElementById("closeManualModal");
btn.onclick = function() {
  modalMan.style.display = "block";
}
span.onclick = function() {
  modalMan.style.display = "none";
}


// Get the modal for the login
var modalLogin = document.getElementById("loginModal");
var btn = document.getElementById("logInButton");
var span = document.getElementById("closeLogInModal");
btn.onclick = function() {
  modalLogin.style.display = "block";
}
span.onclick = function() {
  modalLogin.style.display = "none";
}

// get the modal for the exsisting patterns
var modalExsContent = document.getElementById('exsistingDesignsContainer')
var modalExs = document.getElementById("existingDesignsModal");
var btn = document.getElementById("exsistingButton");
var span = document.getElementById("closeExistingDesignModal");
btn.onclick = function() {
  
  if (auth.currentUser) {
    modalExs.style.display = "block";

  // this is where we load the existing designs
    const q = query(collection(db, "jumpers"), where("creator", "==", auth.currentUser.uid),orderBy('createdAt','desc'));
    async function getUserDocs() {
      let patterns = {}
      const querySnapshot = await getDocs(q);  
      querySnapshot.forEach((doc) => {
        let docId = doc.id;
        let colors = doc.data().colors;
        let name = doc.data().name;
        patterns[docId] = doc.data();
        
        // add to the modular
        let newDivParent = document.createElement("div");
        
        // div for the jumper
        newDivParent.style.border = "1px solid black";
        newDivParent.name = docId;
        newDivParent.className = "exstModel";
        newDivParent.style.overflow = "auto";

        let newDivName = document.createElement("div");
        newDivName.innerHTML = "<p>"+ name+"</p>";
        newDivName.style.width = '30%';
        newDivName.style.height = '70%';
        newDivName.style.float = 'left';
        // newDivName.style.border = "1px solid black";
        newDivName.name = docId;

        // div for the colors 
        let newDivColors = document.createElement("div");
        newDivColors.style.width = '60%';
        newDivColors.style.height = '70%';
        newDivColors.style.float = 'right';
        newDivColors.name = docId;
        // newDivColors.style.border = "1px solid black";

        newDivParent.appendChild(newDivName);
        newDivParent.appendChild(newDivColors);
        for (const color of colors) {
          const newDivColor = document.createElement("div");
          newDivColor.style.float = 'right';
          newDivColor.style.height = '35px';
          newDivColor.style.width = '35px';
          newDivColor.style.padding = '5px';
          newDivColor.style.backgroundColor = color;
          newDivColor.name = docId;
          newDivColor.className = "float-child";
          newDivColors.appendChild(newDivColor);
        }

        modalExsContent.appendChild(newDivParent);        
      })
    }
    getUserDocs();
  }
  else {
    console.log('need to sign in to see previous models')
    window.alert("Kirjaudu sisään nähdäksesi aikaisemmat työsi");
  }
}
span.onclick = function() {
  modalExs.style.display = "none";
}


window.onclick = function(event) {
  if (event.target == modalMan) {
    modalMan.style.display = "none";
  }
  else if (event.target == modalLogin) {
    modalLogin.style.display = "none";
  }
  else if (event.target == modalExs) {
    modalExs.style.display = "none";
    let existingContainer = document.getElementById('exsistingDesignsContainer')
    existingContainer.innerHTML = ''
  }
}


function addNewPattern(uid) {
  const docRef = addDoc(collection(db, "jumpers"), {
    creator: uid,
    creatorEmail: Jumper.creatorEmail,
    name: Jumper.name,
    id_: Jumper.id_,
    createdAt: Date.now(),
    colors: Jumper.colors,
    deductions: Jumper.deductions,
    filledRectsCanvas3: Jumper.filledRectsCanvas3,
    ypixels: Jumper.ypixels,
    xpixels: Jumper.xpixels,
    windows: Jumper.windows,
    backgroundColor: Jumper.backgroundColor,
    mainPatternSizes: Jumper.mainPatternSizes
  })
}

function resavePattern(uid, patternId) {
  const docRef = setDoc(doc(db, "jumpers", patternId), {
    creator: uid,
    creatorEmail: Jumper.creatorEmail,
    name: Jumper.name,
    id_: Jumper.id_,
    createdAt: Date.now(),
    colors: Jumper.colors,
    deductions: Jumper.deductions,
    filledRectsCanvas3: Jumper.filledRectsCanvas3,
    ypixels: Jumper.ypixels,
    xpixels: Jumper.xpixels,
    windows: Jumper.windows,
    backgroundColor: Jumper.backgroundColor,
    mainPatternSizes: Jumper.mainPatternSizes
  }
  
  );
}

// saving and signing in things:
let saveButton = document.getElementById('saveJumper')
saveButton.addEventListener('click', function(e) {
  
  if (auth.currentUser) { 
    let uid  = auth.currentUser.uid;
    Jumper.creatorEmail = auth.currentUser.email
    if (!Jumper.id_) {
      if (Jumper.name) {
        // addNewPattern(uid);
        let jumpId = ID();
        Jumper.id_ = jumpId
        resavePattern(uid, Jumper.id_)
      }
      else {
        window.alert('Anna kuviollesi nimi jotta löydät sen helpommin')
      }
    }

    else {
      if (Jumper.name) {
        resavePattern(uid, Jumper.id_)
      }
      else {
        window.alert('Anna kuviollesi nimi jotta löydät sen helpommin')
      }
    }

  }
  else {
    window.alert("Kirjaudu sisään tallentaaksesi kuvion");
    console.log('you need to sign in to save')
  }
})

let saveAsButton = document.getElementById('saveJumperAs')
saveAsButton.addEventListener('click', function(e) {
  if (auth.currentUser) { 
    Jumper.creatorEmail = auth.currentUser.email
    let uid  = auth.currentUser.uid;
    // addNewPattern(uid);
    let jumpId = ID();
    Jumper.id_ = jumpId;
    resavePattern(uid, Jumper.id_);

  }
  else {
    console.log('you need to sign in to save')
    window.alert("Kirjaudu sisään tallentaaksesi kuvion");
  }
})

let exsistingPatternsDiv = document.getElementById('existingDesignsModalContent')
exsistingPatternsDiv.addEventListener('click', function(e) {
  let jumperId = e.target.name;
  async function getJumper() {
    const docRef = doc(db, "jumpers", jumperId);
    const docSnap = await getDoc(docRef);
    let data = docSnap.data()
    
    Jumper.creator = data.creator;
    Jumper.creatorEmail = data.creatorEmail;
    Jumper.name = data.name;
    Jumper.id_ = jumperId;
    Jumper.colors = data.colors;
    Jumper.deductions = data.deductions;
    Jumper.filledRectsCanvas3 = data.filledRectsCanvas3;
    Jumper.ypixels = data.ypixels;
    Jumper.xpixels = data.xpixels;
    Jumper.windows = data.windows;
    Jumper.backgroundColor = data.backgroundColor;
    Jumper.mainPatternSizes = data.mainPatternSizes
    Jumper.patternIX = Jumper.calculateCurrentPatternIX() + 1;
    console.log(Jumper.patternIX)
    reDrawMainCanvas();

    let backgroundColorElem = document.getElementById("background-color");
    backgroundColorElem.value = Jumper.backgroundColor

    let currentColorId = 0;


    let drawingColorsDiv = document.getElementById("drawing-color-divs");
    var children = drawingColorsDiv.children;
    for (var i = 0; i < children.length; i++) {
      // var tableChild = children[i];
      if (!children[i].id.includes('hidden')){
        drawingColorsDiv.removeChild(children[i])

      }
      // Do stuff
    }
    // drawingColorsDiv.innerHTML = '<input type="color" id="hidden-color-change" tabindex=-1 class="hidden">'
    // const myNode = document.getElementById("foo");
    // while (drawingColorsDiv.firstChild) {
      // if 
        // myNode.removeChild(myNode.lastChild);
    // }

    
    for (const color of data.colors) {
      currentColorId += 1
      let newDiv = document.createElement("div");
      newDiv.style.background = color;
      newDiv.style.border = "1px solid black";
      newDiv.id = "color-"+String(currentColorId);
      newDiv.className = "float-child";
      drawingColorsDiv.appendChild(newDiv);
    };
    changeMainY(data.ypixels);
    mainYelem.value = data.ypixels

    changeMainX(data.xpixels);
    mainXelem.value = data.xpixels;

    nameElem.value = Jumper.name;



  };
  getJumper();
  // Now, lets get the data

})





// poista kuvio


let deleteButton = document.getElementById('deletePattern')


deleteButton.addEventListener('click', function(e) {
  deletePressed = !deletePressed;
  if (!deletePressed) {
    turnButtonOff('deletePattern');
    var filtered = Jumper.filledRectsCanvas3.filter(function(el) { return el.split(',')[3] != patternToDelete; }); 
    Jumper.filledRectsCanvas3 = filtered
  }
  patternToDelete = false;
  previousColorDel = false;
  reDrawMainCanvas();
})



canvas3.addEventListener('dblclick', function(e) {
  const rect = canvas3.getBoundingClientRect();
  const xDel = e.clientX - rect.left;
  const yDel = e.clientY - rect.top;
  const cyDel = (yDel - (yDel%cw)) + p;
  const cxDel = (xDel - (xDel%cw)) + p;
  patternToDelete = false;
  coordsStrsToDeleteColor = [];

  const reverseFilled = [...filledRectsCanvas3WithDeductions].reverse();
  for (let coordsStr of reverseFilled) {
    let coords = coordsStr.split(',');
    let x_del = Number(coords[0]); let y_del = Number(coords[1]); let colorDel = coords[2]; let pIXDel = coords[3];
    if  (cyDel == y_del && cxDel == x_del) {
      patternToDelete = pIXDel;
    }
  }


  
  let delIndex = 0
  for (let coordsStr of Jumper.filledRectsCanvas3) {
    let coords = coordsStr.split(',')
    let x_ = Number(coords[1]); let y_ = Number(coords[0]); let color = coords[2]; let pIX = coords[3];
    coordsStrsToDeleteColor.push(color)
    if (pIX == patternToDelete) {
      let newCoordString = [y_,x_,'#FF9494', pIX].toString()
      Jumper.filledRectsCanvas3[delIndex] = newCoordString;
    }
    else{ 
      Jumper.filledRectsCanvas3[delIndex] = coordsStr;
    }
    delIndex += 1;
  }
  reDrawMainCanvas();
  if (patternToDelete) {
    // makePopUpButton(popUpButtonX + rect.left, popUpButtonY+rect.top);
    deletePressed = true
    turnButtonOn('deletePattern', '#FF9494')
  }

})