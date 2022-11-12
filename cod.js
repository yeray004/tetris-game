document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 15
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    //The Tetrominoes Cata
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

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    console.log(theTetrominoes[0][0])

    //--------------------------------------------------randomly select a Tetromino and its first rotation yy

    /*  Para esta parte del código utilizamos los siguientes métodos:
    Math.random() -> Nos da un número random de los elementos de array junto al .length
    .length       -> Es un metodo introducído que nos ayuda a saber qué tan largo es nuestro array
    Math.floor()  -> Redondea un número decimal a su base ej: 4.9 -> 4 , o 3.4 -> 3 */

    let random = Math.floor(Math.random() * theTetrominoes.length) //La variable random que escoge un número random del array theTetrominoes.length y lo redondea a su base
    let current = theTetrominoes[random][currentRotation] //El primer array llama a un tetromino al azar, el segundo lo deja en su primer posición

    //draw the Tetromino 
    function draw() {
        current.forEach(index => { //para cada elemento con forEach se le agrega: Código dentro del parénresis con un arrow function al index de cada array (index0, index1, index2, ...))
            squares[currentPosition + index].classList.add('tetromino') //Accedemos a la clase de ese elemento con classList y añadimos con add la clase de tetromino
            squares[currentPosition + index].style.backgroundColor = colors[random] //
        })
    }

    //--------------------------------------------------undraw the Tetromino yy
    function undraw() { //Se crea la función de borrar
        current.forEach(index => {//para cada elemento con forEach se le agrega: Código dentro del parénresis con un arrow function al index de cada array (index0, index1, index2, ...))
            squares[currentPosition + index].classList.remove('tetromino')  //Removemos la clase de tetromino
            squares[currentPosition + index].style.backgroundColor = ''

        })
    }

    //assign functions to keyCodes
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

    //--------------------------------------------------move down function yy

    /* Para esta sección del código usamos el método setInterval() para realizar una funciónnen la que cada 1000 ms el tetromino se desplace hasta abajo
    dentro de la sección de código add functionality to the button encontamos en su parámetro el move moveDown.

    timerId = setInterval(moveDown, 1000) -> timerId ya está declarada como variable en dentro de las primeras líneas del código  */

    function moveDown() { //Se crea la función moveDown
        undraw() //Des dibujamos la figura de su posición actual con la función undraw
        currentPosition += width // le añadimos un width a su posición actual
        draw() // Dibujamos la figura de su posición en su nueva posición con la función draw
        freeze() // Detenemos el movimiento de "caída" con la función freeze
    }

    //--------------------------------------------------freeze function
    function freeze() { //Se crea la función freeze
        /* Si algúno (some) de los squares que crea el tetromino actual con index y width (Los que ejecutan el movimiento de caída) contiene un squeare
        con la clase taken */
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) { 
            //para cada uno de los cuadrados que fromen la figura añada la clase de taken
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length) //Selecciona inmediatamente un tetromino
            current = theTetrominoes[random][currentRotation] //Establece uno rndom en su posición inicial
            currentPosition = 4 //Aparece en la posición del cuadro #4 square 4
            draw() //Dibuja el tetromino
            displayShape()
            addScore()
            gameOver()
        }
    }

    //--------------------------------------------------move the tetromino left, unless is at the edge or there is a blockage yy
    function moveLeft() { //Se crea la función moveLeft
        undraw() //Des dibuja la figura
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0) //Se crea una variable 
        if (!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    //move the tetromino right, unless is at the edge or there is a blockage
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if (!isAtRightEdge) currentPosition += 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }


    ///FIX ROTATION OF TETROMINOS A THE EDGE yy
    function isAtRight() {
        return current.some(index => (currentPosition + index + 1) % width === 0)
    }

    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

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

    //rotate the tetromino
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
    /////////



    //show up-next tetromino in mini-grid display yy
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0


    //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    //display the shape in the mini-grid display yy
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

    //add functionality to the button
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
    })

    //add score yy
    function addScore() {
        for (let i = 0; i < 374; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9, i + 10, i +11, i + 12, i + 13, i + 14]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 15
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
    }

    //game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }

})