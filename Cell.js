const cells = [];
const adultSize = 40;
const childSize = 20;

// temp values
const aggro = 0;
const compan = 0;
const intel = 0;
const speed = 0;
const color = 'red';

const interactionRadius = 50;
const repellentRadius = 50;
const repelForce = 0.1;
let selectedCell;
const displayId = document.getElementById('display-id');
const aggroStat = document.getElementById('aggro');
const companStat = document.getElementById('compan');

// creates a new cell
function createCell(x, y, aggro, compan, intel, speed, size, targetX, targetY, color) {
    const cell = {
        x,
        y,
        aggro,
        compan,
        intel,
        speed,
        size,
        color,
        id: cells.length,
        targetX,
        targetY,
        lastTime: performance.now()
    };

    cells.push(cell);
}

// move cells
function moveCells() {
    const now = performance.now();

    // move each cell to a new position based on its speed and direction
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        for (let j = i + 1; j < cells.length; j++) {
            const otherCell = cells[j];
            //handleInteraction(cell, otherCell);
        }
        for (let j = i + 1; j < cells.length; j++) {
            const otherCell = cells[j];
            handleRepel(cell, otherCell);
        }
        
        const elapsedTime = now - cell.lastTime;
        
        const currentX = cell.x;
        const currentY = cell.y;

        const diffX = cell.targetX - currentX;
        const diffY = cell.targetY - currentY;

        const distance = Math.sqrt(diffX * diffX + diffY * diffY);
        
        cell.speed = .05/ distance;
     

        cell.x += diffX * cell.speed * elapsedTime;
        cell.y += diffY * cell.speed * elapsedTime;

        
        if (distance < 1) {
            cell.targetX = Math.random() * window.innerWidth + 100;
            cell.targetY = Math.random() * window.innerHeight + 100;
        }
        cell.lastTime = now;
        
    }

    requestAnimationFrame(moveCells);
}

// repel cells
function handleRepel(cell, otherCell) {
    const diffX = otherCell.x - cell.x;
    const diffY = otherCell.y - cell.y;

    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    if (distance < repellentRadius) {
        const forceX = diffX  /distance * repelForce;
        const forceY = diffY  /distance * repelForce;

        cell.targetX += forceX;
        cell.targetY += forceY;

        otherCell.targetX -= forceX;
        otherCell.targetY -= forceY;
    }
}

// handles cell interaction
function handleInteraction(cell, otherCell) {
    const diffX = otherCell.x - cell.x;
    const diffY = otherCell.y - cell.y;

    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    if (distance < interactionRadius) {
        cell.targetX = Math.random() * window.innerWidth + 100;
        cell.targetY = Math.random() * window.innerHeight + 100;

        otherCell.targetX = Math.random() * window.innerWidth + 100;
        otherCell.targetY = Math.random() * window.innerHeight + 100;
    }


}

// returns the aggro level of a cell
function getAggroLevel(cell) {
    switch(cell.aggro) {
        case 0:
        case 1:
        case 2:
            return 'A';
            break;
        case 3:
        case 4:
            return 'B';
            break;
        case 5:
        case 6:
            return 'C';
            break;
        case 7:
        case 8:
            return 'D';
            break;
        case 9:
        case 10:
            return 'E';
            break;
        default:
            return 'error';
            break;
    }
}

function updateCell(cell) {
    
    moveCells();
    
}

function drawCell(cell) {
    fill(cell.color);
    ellipse(cell.x, cell.y, cell.size, cell.size);
}

function draw() {
    background(0);
    for (const cell of cells) {
        
        updateCell(cell);
        drawCell(cell);
    }
}

function setup() {
    createCanvas(window.innerWidth + 100, window.innerHeight + 100);

    
}



// shows the cell's stats when clicked
document.addEventListener("click", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    for (cell of cells) {
        if ((mouseX  <= cell.x + interactionRadius && mouseX >= cell.x - interactionRadius) && 
            (mouseY <= cell.y + interactionRadius && mouseY >= cell.y - interactionRadius)) {
            selectedCell = cell;
             
            console.log(selectedCell.id);
            displayId.innerText = selectedCell.id;
        }
        
    }

});

// temporary function to create a new cell
document.addEventListener("click", function(event) {
    const randomY = Math.random() * window.innerHeight + 100;
    const randomX = Math.random() * window.innerWidth + 100;
    const randomInitX = Math.random() * window.innerWidth;
    const randomInitY = Math.random() * window.innerHeight;
    createCell(mouseX, mouseY, aggro, compan, intel, speed, adultSize, randomX, randomY, color);
});


// creates a new cell at mouse x and mouse y when 'a' is pressed
document.addEventListener("keydown", function(event) {
    if (event.key === 'a') {
        const randomY = Math.random() * window.innerHeight + 100;
        const randomX = Math.random() * window.innerWidth + 100;
        const randomInitX = Math.random() * window.innerWidth;
        const randomInitY = Math.random() * window.innerHeight;
        createCell(mouseX, mouseY, aggro, compan, intel, speed, adultSize, randomX, randomY, color);
        
    }
});

