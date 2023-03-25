const cells = [];
const adultSize = 40;
const childSize = 20;
const cellLimit = 20;

// temp values
const aggro = 0;
const compan = 0;
const intel = 0;
const speed = 0;
const color = 'red';
const now = new Date();
let chasing = true;



const interactionRadius = 100;
const repellentRadius = 40;
const repelForce = 1;
let selectedCell;
const displayId = document.getElementById('display-id');
const aggroStat = document.getElementById('aggro');
const companStat = document.getElementById('compan');

// creates a new cell


class Cell {
    constructor(x, y, aggro, compan, intel, speed, size, velocity, direction, color) {
        this.x = x;
        this.y = y;
        this.aggro = aggro;
        this.compan = compan;
        this.intel = intel;
        this.speed = speed;
        this.size = size;
        this.color = color;
        this.id = cells.length;
        this.velocity = { x: velocity.x, y: velocity.y };
        this.direction = { x: direction.x, y: direction.y };
        this.lastTime = performance.now();
    }

    move() {
        const now = performance.now();
        const elapsedTime = now - this.lastTime;
        const angle = Math.atan2(this.direction.y, this.direction.x);
        this.x += this.velocity.x * elapsedTime * Math.cos(angle);
        this.y += this.velocity.y * elapsedTime * Math.sin(angle);
        this.lastTime = now;
    }


}


// move cells
function moveCells() {
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.move();
        //newDirection(cell);
        handleEdges(cell);
        for (let j = i + 1; j < cells.length; j++) {
            const otherCell = cells[j];
            handleInteraction(cell, otherCell);
            handleCollison(cell, otherCell);
        }
    }
    

    requestAnimationFrame(moveCells);
}

// random number between -1 and 1
function randomDirection() {
    return Math.random() * 2 - 1;
}

function newDirection(cell) {
    const angle = Math.atan2(randomDirection(), randomDirection());
    cell.direction.x = Math.cos(angle);
    cell.direction.y = Math.sin(angle);
}


// hanndle the collision of the cells
function handleCollison(cell, otherCell) {
    const angle = Math.atan2(otherCell.y - cell.y, otherCell.x - cell.x);
    const distance = Math.sqrt((otherCell.x - cell.x) * (otherCell.x - cell.x) + (otherCell.y - cell.y) * (otherCell.y - cell.y));
    const distanceToMove = (cell.size + otherCell.size) / 2 - distance;
    const radiSum = cell.size / 2 + otherCell.size / 2;

    if ( distance <= radiSum) {
        otherCell.x += distanceToMove * Math.cos(angle);
        otherCell.y += distanceToMove * Math.sin(angle);
        return true;
    }
    handleEdges(cell);
    handleEdges(otherCell);
    return false;
}

// handle edges of the canvas
function handleEdges(cell) {
    if (cell.x > window.innerWidth + 100) {
        cell.direction.x = -1;
    } else if (cell.x < 0) {
        cell.direction.x = 1;
    } else if (cell.y > window.innerHeight + 100) {
        cell.direction.y = -1;
    } else if (cell.y < 0) {
        cell.direction.y = 1;
    }
}


// TODO: make the cells interact with each other
// handles cell interaction
function handleInteraction(cell, otherCell) {
    const diffX = otherCell.x - cell.x;
    const diffY = otherCell.y - cell.y;

    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    if (distance < interactionRadius) {

        if (cell.aggro > 7 && otherCell.aggro < cell.aggro) {
            chasing = true;
            // needs to be fixed so that it only chases for a certain amount of time
            /*
            chasing = true;
            let seconds = 0;
            const timer = setInterval(() =>{
                seconds++;
                
                if (seconds <= 3) {
                    aggroChase(cell, otherCell);
                    
                } else {
                    chasing = false;
                    clearInterval(timer);
                }

            }, 1000);
            */
            aggroChase(cell, otherCell);
            



        }
        else {
            chasing = false;
            const forceX = diffX  / distance * repelForce;
            const forceY = diffY  / distance * repelForce;

            cell.direction.x += forceX;
            cell.direction.y += forceY;
            otherCell.direction.x -= forceX;
            otherCell.direction.y -= forceY;
        }
        

    }
    handleEdges(cell);
    handleEdges(otherCell);


}

// chase other cell if aggro is high enough
function aggroChase(cell, otherCell) {
    
    if (chasing) {
        cell.velocity = { x: .2, y: .2 };
        cell.direction = { x: otherCell.x - cell.x, y: otherCell.y - cell.y };
        handleEdges(cell);
        otherCell.velocity = { x: .2, y: .2 };
        // other cell goes opposite direction of cell
        otherCell.direction = { x: cell.x, y: cell.y};
        handleEdges(otherCell);
   
        if (handleCollison(cell, otherCell)) {
            cells.splice(otherCell.id, 1);
            cell.velocity = { x: .1, y: .1 };
            cell.direction = { x: randomDirection(), y: randomDirection() };
        } else if (!chasing) {
            cell.velocity = { x: .1, y: .1 };
            cell.direction = { x: randomDirection(), y: randomDirection() };
            otherCell.velocity = { x: .1, y: .1 };
            otherCell.direction = { x: randomDirection(), y: randomDirection() };
        } 
    }
    

    handleEdges(cell);
    handleEdges(otherCell);

   

}
    

function drawCell(cell) {
    fill(cell.color);
    ellipse(cell.x, cell.y, cell.size, cell.size);
}

function draw() {
    background(0);
    for (const cell of cells) {
        drawCell(cell);
    }
    moveCells();
}

function setup() {
    createCanvas(window.innerWidth + 100, window.innerHeight + 100);
    
}

// random color hex
function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

//create temporary agro cell
const agroCell = new Cell(window.innerWidth/2, window.innerHeight/2, 10, 0, 0, 0, adultSize, { x: .1, y: .1 }, { x: randomDirection(), y: randomDirection() }, 'red');
cells.push(agroCell);

// TODO: fix where the mouse is clicked and the cells location
// shows the cell's stats when clicked
document.addEventListener("click", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    for (cell of cells) {
        if ((mouseX  <= cell.x + cell.size && mouseX >= cell.x - cell.size) && 
            (mouseY <= cell.y + cell.size && mouseY >= cell.y - cell.size)) {
            selectedCell = cell;
             
            console.log(selectedCell.id);
            displayId.innerText = selectedCell.id;
        }
        
    }

});

/*
// temporary function to create a new cell
document.addEventListener("click", function(event) {
    const randomY = Math.random() * window.innerHeight + 100;
    const randomX = Math.random() * window.innerWidth + 100;
    const randomInitX = Math.random() * window.innerWidth;
    const randomInitY = Math.random() * window.innerHeight;
    createCell(mouseX, mouseY, aggro, compan, intel, speed, adultSize, randomX, randomY, color);
});
*/

// creates a new cell at mouse x and mouse y when 'a' is pressed
document.addEventListener("keydown", function(event) {
    if (event.key === 'a') {
        const randomY = Math.random() * window.innerHeight + 100;
        const randomX = Math.random() * window.innerWidth + 100;
        const vel = { x: .1, y:  .1};
        const direction = { x: randomDirection(), y: randomDirection()};
        console.log(direction);
        const randomInitX = Math.random() * window.innerWidth;
        const randomInitY = Math.random() * window.innerHeight;
        cells.push(new Cell(mouseX, mouseY, aggro, compan, intel, speed, adultSize, vel, direction, randomColor()));
        
    }
});

