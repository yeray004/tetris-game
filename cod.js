
document.addEventListener('DOMContentLoaded', () => {
    /* Asignación de variables y contantes
    Array.from() -> Crea una nueva instancia de Array a partir de un objeto iterable, es decir, convierte los div´s en un array.
    */
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 15
    let nextRandom = 0
    var timerId
    let score = 0

    //Asignación de colores para los tetrominos
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]


    //Creacion de figuras o tetrominos mediante arrays con las variaciones posibles de los giros por figura. 
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    //Asignación de un array los tetrominos creados anteriormente
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    //--------------------------------------------------Función dibujar
    /* forEach() -> Ejecuta la función indicada una vez por cada elemento del array current.
    En elmento index es un indicador de posicionamiento dentro del array que recorrerá
    */

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''

        })
    }

    /*--------------------------------------------------Función controlador de fichas
    Asigna una función a cada tecla por medio de un ciclo if*/
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }


    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1

        }
        draw()
    }

    //--------------------------------------------------move the tetromino Right
    function moveRight() { //Cracion de la función moveRight
        undraw() //Desdibuja la figura creada
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1) //Crea una constante con nombre isAtRightEdge para limitar el movimiento a la derecha, 
        if (!isAtRightEdge) currentPosition += 1 //Si no se cumple la condición avanza una posición a la derecha
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1 //Si alguno de los tetrominos va hacia la derecha y choca con un square de clase taken retrocede un espacio
        }
        draw()//Dibuja la figura
    }

    /*--------------------------------------------------Funcion isAtRight 
    Se crea la funcion para limitar la rotación de las fichas posteriormente*/
    function isAtRight() {
        return current.some(index => (currentPosition + index + 1) % width === 0) 
    }

    /*--------------------------------------------------Funcion isAtLeft
    Se crea la funcion para limitar la rotación de las fichas posteriormente*/
    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

    /*--------------------------------------------------Funcion checkRotatedPosition
    Se crea la funcion para limitar la rotación de las fichas posteriormente*/
    function checkRotatedPosition(P) {
        P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P + 1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
            if (isAtRight()) {            //use actual position to check if it's flipped over to right side
                currentPosition += 1    //if so, add one to wrap it back around
                checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
            if (isAtLeft()) {
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }


    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0


    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
        return timerId
    })

    function addScore() {
        for (let i = 0; i < 374; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9, i + 10, i + 11, i + 12, i + 13, i + 14]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
        return score
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }

    let angulo_fondo = Math.random() * 10
        let tono_fondo = Math.random() * 10
        setInterval(() => {
            document.body.style.background = `linear-gradient(
                ${angulo_fondo}deg, 
                hsl(${tono_fondo},100%,50%),
                hsl(${tono_fondo},100%,0%)
            )`
            angulo_fondo += Math.random()
            tono_fondo += Math.random()
        }, 10);

})