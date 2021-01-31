const isAlive = (elem) => {
    let col = elem.style.backgroundColor
    if (col === 'black'){
        return true
    }
    return false
}

const shouldRevive = (neighbors) => {
    if (neighbors === 3){
        return true
    }
    return false
}

const shouldLive = (neighbors) => {
    if (neighbors <= 1 || neighbors >= 4){
        return false
    }
    return true
}

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

const colorChange = function () {
    if(this.style.backgroundColor === 'black'){
        this.style.backgroundColor = 'white'
    } else{
        this.style.backgroundColor = 'black'
    }
}

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
let flag = true
let generations = 0
let current = []

createBoard(height, width)
let boardG = document.querySelectorAll('#gol')
for (let i = 0; i < boardG.length; i++){
    boardG[i].addEventListener('click', colorChange)
}

let btnRun = document.querySelector('#run')
btnRun.addEventListener('click', function () {
    flag = true
    current = save()
})
btnRun.addEventListener('click', gameOfLifeAlgo)

let btnStop = document.querySelector('#stop')
btnStop.addEventListener('click', function (){
    flag = false
})

let btnReset = document.querySelector('#reset')
btnReset.addEventListener('click', reset)
btnReset.addEventListener('click', buildCurrent)

let btnClear = document.querySelector('#clear')
btnClear.addEventListener('click', clear)