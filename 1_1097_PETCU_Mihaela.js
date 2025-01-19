const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const color = document.getElementById("shape_color_picker");
const backgroundColor = document.getElementById("background_color_picker");
const lineWidth = document.getElementById("line_width");
const saveJPEGButton = document.getElementById("raster_btn");
const saveSVGButton = document.getElementById("svg_btn"); // big fail :') 
const newFileButton = document.getElementById("new_btn");
const layers = document.getElementById("layers");

const lineShape = document.getElementById("line");
const rectangleShape = document.getElementById("rectangle");
const ellipseShape = document.getElementById("ellipse");
const circleShape = document.getElementById("circle");
const triangleShape = document.getElementById("triangle");

let isDrawing = false;
let startX, startY;
let shapes = []; // shapes drawn by the user
let currentShape = 'line'; 


function setBackgroundColor(color) {
    canvas.style.backgroundColor = color;
}

function setColor(color) {
    context.strokeStyle = color;
}

function setLineWidth(width) {
    context.lineWidth = width;
    document.getElementById("line_width_label").textContent = `Line width ${width}px`;
}

lineWidth.addEventListener("input", function() {
    setLineWidth(lineWidth.value);
});

color.addEventListener("input", function() {
    setColor(color.value);
});

backgroundColor.addEventListener("change", redraw);

document.querySelectorAll(".shapes span").forEach((span) => {
    span.addEventListener("click", function() {
        currentShape = span.id; 
    });
});

// event for starting drawing
canvas.addEventListener("mousedown", function(event) {
    isDrawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
});

// event for previewing the shape
canvas.addEventListener("mousemove", function(event) {
    if (!isDrawing) return;

    const width = event.offsetX - startX;
    const height = event.offsetY - startY;

    redraw(); 
    switch (currentShape) {
        case 'line':
            drawLine(startX, startY, event.offsetX, event.offsetY);
            break;

        case 'ellipse':
            drawEllipse(startX, startY, width, height); 
            break;
                
        case 'rectangle':
            drawRectangle(startX, startY, width, height);
            break;

        case 'circle':
            drawCircle(startX, startY, width, height);
            break;

        case 'triangle':
            drawTriangle(startX, startY, event.offsetX, startY, startX + width / 2, startY + height);
            break;
    }
});

// event for finishing drawing
canvas.addEventListener("mouseup", function(event) {
    if (!isDrawing) return;

    const currentX = event.offsetX;
    const currentY = event.offsetY;
    const width = currentX - startX;
    const height = currentY - startY;

    shapes.push({
        type: currentShape,
        color: color.value,
        lineWidth: lineWidth.value,
        X: startX,
        Y: startY,
        width: width,
        height: height
    });

    isDrawing = false;
    redraw();
    updateLayers();
});


function newFile() {
    if (confirm("Are you sure you want to perform this action?\nOnce deleted, you will not be able to recover your work.")) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        shapes = [];
        setBackgroundColor("#FFFFFF");
        updateLayers();
    }
}


function redraw() {
    context.fillStyle = backgroundColor.value;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let shape of shapes) {
        context.lineWidth = shape.lineWidth;
        context.strokeStyle = shape.color;

        switch (shape.type) {
            case 'line':
                drawLine(shape.X, shape.Y, shape.X + shape.width, shape.Y + shape.height);
                break;

            case 'ellipse':
                drawEllipse(shape.X, shape.Y, shape.width, shape.height);
                break;

            case 'rectangle':
                drawRectangle(shape.X, shape.Y, shape.width, shape.height);
                break;

            case 'circle':
                drawCircle(shape.X, shape.Y, shape.width, shape.height);
                break;

            case 'triangle':
                drawTriangle(shape.X, shape.Y, shape.X + shape.width, shape.Y, shape.X + shape.width / 2, shape.Y + shape.height);
                break;
        }
    }
}

// drawing various shapes
function drawEllipse(x, y, w, h) {
    w = Math.abs(w);
    h= Math.abs(h);
    
    context.beginPath();
    context.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
    context.stroke();
}

function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

function drawRectangle(x, y, w, h) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.stroke();
}

function drawCircle(x, y, w, h) {
    context.beginPath();
    const r = Math.sqrt(w ** 2 + h ** 2) / 2;
    context.arc(x + w / 2, y + h / 2, r, 0, 2 * Math.PI);
    context.stroke();
}

function drawTriangle(x1, y1, x2, y2, x3, y3) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.closePath();
    context.stroke();
}

function saveRaster() {
    const link = document.createElement("a");
    link.download = "drawing.jpg";
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
}

function saveSVG(){
    alert("Not implemented yet!"); 
}

function updateLayers() {
    layers.innerHTML = "";
    
    shapes.forEach((shape, index) => {
        const item = document.createElement("li");

        const starts = ` - Start X: ${shape.X}, Start Y: ${shape.Y}`;
        switch(shape.type) {
            case 'line':
                item.textContent = (index+1) + '. Line'+ starts;
                break;

            case 'ellipse':
                item.textContent = (index+1) + '. Ellipse' + starts; 
                break;

            case 'rectangle':
                item.textContent = (index+1) + '. Rectangle' + starts;
                break;

            case 'circle':
                item.textContent = (index+1) + '. Circle' + starts;
                break;

            case 'triangle':
                item.textContent = (index+1) + '. Triangle' + starts;
                break;
        }

        layers.appendChild(item);
    })
}