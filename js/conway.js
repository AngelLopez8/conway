// return true if cell is black ('alive'), return false otherwise
const isAlive = (elem) => {
    let col = elem.style.backgroundColor
    return col === 'black';
}

// return true if cell should be revived due to having 3 alive neighbors, return false otherwise
const shouldRevive = (neighbors) => {
    return neighbors === 3;
}

// return true if cell should stay alive due to not having 2 or 3 neighbors
const shouldLive = (neighbors) => {
    return (neighbors <= 1 || neighbors >= 4);
}

// changes a cell with given row and column from black (alive) or white (dead)
const changeStatus = (aCells, dCells) => { 
    let board = document.querySelectorAll('tr')
    for (let x of aCells){
        let childElem = board[x[0]].childNodes
        childElem[x[1]].style.backgroundColor = 'black'
    }
    for (let y of dCells){
        let childElem = board[y[0]].childNodes
        childElem[y[1]].style.backgroundColor = 'white'
    }
}

// returns the number of neighbors by checking 8 possible neighbors
const countNeighbors = (i, j) => {
    const checks = [
        [i-1, j-1],
        [i-1, j],
        [i-1, j+1],
        [i, j+1],
        [i+1, j+1],
        [i+1, j-1],
        [i+1, j],
        [i, j-1]
    ]
    let board = document.querySelectorAll('tr')
    let count = 0
    for (let comb of checks){
        const x = comb[0]
        const y = comb[1]
        if (x >= 0 && x < height){
            let childElem = board[x].childNodes
            if (y >= 0 && y < width){
                if(childElem[y].style.backgroundColor === 'black'){
                    count++
                }
            }
        }
    }
    return count
}

// iterates through each cell on board and determines whether a cell should be left alive, set to dead and/or revived
const gameOfLifeAlgo = () => {
    let aCells = []
    let dCells = []
    if (flag){
        generations++
        let gen = document.querySelector('#gen')
        gen.innerText = `Generation ${generations}`
        let board = document.querySelectorAll('tr')
        for (let i = 0; i < board.length; i++){
            let childElem = board[i].childNodes
            for (let j = 0; j < childElem.length; j++){
                let n = countNeighbors(i, j)
                let status = isAlive(childElem[j])
                let x = [i, j]
                if (status === true){
                    let future = shouldLive(n)
                    if (future === true){
                        aCells.push(x)
                    } else {
                        dCells.push(x)
                    }
                } else{
                    let reproduce = shouldRevive(n)
                    if (reproduce === true){
                        aCells.push(x)
                    } else{
                        dCells.push(x)
                    }
                }
            }
        }
        changeStatus(aCells, dCells)
        setTimeout(gameOfLifeAlgo, 10)
    }
}

// switches color from one to the other
const colorChange = function () {
    if(this.style.backgroundColor === 'black'){
        this.style.backgroundColor = 'white'
    } else{
        this.style.backgroundColor = 'black'
    }
}

// sets board to previous build before process was begun
const buildCurrent = () => {
    let rows = document.querySelectorAll('tr')
    for (let i = 0; i < rows.length; i++){
        let childElem = rows[i].childNodes
        for(let j = 0; j < childElem.length; j++){
            if (current[i][j] === 1){
                childElem[j].style.backgroundColor = 'black'
            } else {
                childElem[j].style.backgroundColor = 'white'
            }
        }
    }
}

// saves current build for reset
const save = () => {
    let board = []
    let rows = document.querySelectorAll('tr')
    for (let row of rows){
        let boardR = []
        let childElem = row.childNodes
        for (let elem of childElem){
            if (elem.style.backgroundColor === 'black'){
                boardR.push(1)
            } else{
                boardR.push(0)
            }
        }
        board.push(boardR)
    }
    return board
}

// clears board and sets all cells to white, resets current build
const clear = () => {
    let rows = document.querySelectorAll('tr')
    for (let row of rows){
        let childElem = row.childNodes
        for (let elem of childElem){
            elem.style.backgroundColor = 'white'
        }
    }
    current = []
    reset()
}

// resets generation counter
const reset = () => {
    generations = 0
    let gen = document.querySelector('#gen')
    gen.innerText = `Generation ${generations}`
    flag = false
}

const createBoard = (height, width) => {
    let tab = document.querySelector('.gameOfLifeBoard')
    for (let i = 1; i <= height; i++){
        let newRow = document.createElement('tr')
        newRow.setAttribute('id', 'row')
        tab.appendChild(newRow)
        for (let j = 1; j <= width; j++){
            let newSquare = document.createElement('td')
            newSquare.setAttribute('id', 'gol')
            newSquare.style.backgroundColor = 'white'
            newRow.appendChild(newSquare)
        }
    }
}

const height = 50
const width = 70
let flag = true     // used for stopping and running process
let generations = 0
let current = []    // used to save previous state for reset

// builds 50x70 board
createBoard(height, width)
let boardG = document.querySelectorAll('#gol')
for (let i = 0; i < boardG.length; i++){
    boardG[i].addEventListener('click', colorChange)
}

// starts process
let btnRun = document.querySelector('#run')
btnRun.addEventListener('click', function () {
    flag = true
    current = save()
})
btnRun.addEventListener('click', gameOfLifeAlgo)

// stops current run
let btnStop = document.querySelector('#stop')
btnStop.addEventListener('click', function (){
    flag = false
})

// resets to initial setup before run
let btnReset = document.querySelector('#reset')
btnReset.addEventListener('click', reset)
btnReset.addEventListener('click', buildCurrent)

// Clears board
let btnClear = document.querySelector('#clear')
btnClear.addEventListener('click', clear)