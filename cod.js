document.addEventListener('DOMContentLoaded', () => {
    /* Asignación de contantes.
    querySelector ->Devolverá el primer descendiente del elemento elementoBase que coincida con el grupo de selectores especificado*/
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    // Asignación de valores a variables y constantes
    const width = 15
    let nextRandom = 0
    let timerId
    let score = 0
    //Array.from() -> Crea una nueva instancia de Array a partir de un objeto iterable, es decir, convierte los div´s en un array.
    let squares = Array.from(document.querySelectorAll('.grid div'))
    //Creación de array con colores que conformaran los tetrominos
    const colors = [
        '#ffce2e',
        '#ff8775',
        '#bc70ff',
        '#9BFBE1',
        '#19e8ff'
    ]

    //Creacion de tetrominos mediante arrays, cada array contendrá dentro de si mismo 4 arrays que conforma las variaciones de giros posibles de los tetrominos. 
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

    // Asignación de un array que contenga los tetrominos creados
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    //Asignación de posición inicial de los tetrominos
    let currentPosition = 4
    let currentRotation = 0

    /* Se empleó los siguientes métodos:
    Math.random() -> Nos da un número random de los elementos de array junto al .length
    .length       -> Es un metodo introducído que nos ayuda a saber qué tan largo es nuestro array
    Math.floor()  -> Redondea un número decimal a su base ej: 4.9 -> 4 , o 3.4 -> 3 */

    let random = Math.floor(Math.random() * theTetrominoes.length) //La variable random que escoge un número random del array theTetrominoes.length y lo redondea a su base
    let current = theTetrominoes[random][currentRotation] //El primer array llama a un tetromino al azar, el segundo lo deja en su primer posición

    //Funcion dibujar
    function draw() {
        current.forEach(index => { //para cada elemento con forEach se le agrega: Código dentro del parénresis con un arrow function al index de cada array (index0, index1, index2, ...))
            squares[currentPosition + index].classList.add('tetromino') //Accedemos a la clase de ese elemento con classList y añadimos con add la clase de tetromino
            squares[currentPosition + index].style.backgroundColor = colors[random] //Asignacion de color de manera aleatoria
        })
    }

    //Función Desdibujar
    function undraw() { //Se crea la función de borrar
        current.forEach(index => {//para cada elemento con forEach se le agrega: Código dentro del parénresis con un arrow function al index de cada array (index0, index1, index2, ...))
            squares[currentPosition + index].classList.remove('tetromino')  //Removemos la clase de tetromino
            squares[currentPosition + index].style.backgroundColor = '' 

        })
    }

    /*Función controlador de fichas
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
    document.addEventListener('keydown', control)

    //Funcion mover abajo

    /* Para esta sección del código usamos el método 
    setInterval() para realizar una funciónnen la que cada 1000 ms el tetromino se desplace hasta abajo
    dentro de la sección de código add functionality to the button encontamos en su parámetro el move moveDown.
    timerId = setInterval(moveDown, 1000) -> timerId ya está declarada como variable en dentro de las primeras líneas del código  */

    function moveDown() { //Se crea la función moveDown
        undraw() //Des dibujamos la figura de su posición actual con la función undraw
        currentPosition += width // le añadimos un width a su posición actual
        draw() // Dibujamos la figura de su posición en su nueva posición con la función draw
        freeze() // Detenemos el movimiento de "caída" con la función freeze
    }

    //Funcion congelar
    function freeze() {
        // Si algúno (some) de los squares que crea el tetromino actual con index y width (Los que ejecutan el movimiento de caída) contiene un squeare con la clase taken
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) { 
            //para cada uno de los cuadrados que formen la figura añada la clase de taken
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

    //Funcion mover izquierda. unless is at the edge or there is a blockage
    function moveLeft() { //Se crea la función moveLeft
        undraw() //Des dibuja la figura
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0) //Se crea una variable que con el currentPosition y su item (index0) dividido por su ancho deje exactamente 0 en su residuo 

        if (!isAtLeftEdge) currentPosition -= 1 // si el statement es ture el bang (!) hará que este sea falso, ejecuntamdo el if y permitiendo que la figura se pueda desplazar a la izquierda

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1 //Si alguno de los tetrominos va hacia la izquierda y choca con un square de clase taken retrocede un espacio
        }
        draw() //Dibuja la figura
    }

   //Funcion mover derecha. unless is at the edge or there is a blockage
    function moveRight() {
        undraw() //Desdibuja la figura creada
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1) //Crea una constante con nombre isAtRightEdge para limitar el movimiento a la derecha,
        if (!isAtRightEdge) currentPosition += 1 //Si no se cumple la condición avanza una posición a la derecha
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) { 
            currentPosition -= 1 //Si alguno de los tetrominos va hacia la derecha y choca con un square de clase taken retrocede un espacio
        }
        draw() //Dibuja la figura
    }


    /*Funcion es derecha 
    Se crea la funcion para limitar la rotación de las fichas posteriormente*/
    function isAtRight() {
        return current.some(index => (currentPosition + index + 1) % width === 0)
    }
    /*Funcion es izquierda 
    Se crea la funcion para limitar la rotación de las fichas posteriormente*/
    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

    // Funcion verificar posicion de rotacion
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

    //Funcion rotar
    function rotate() {
        undraw() //Desdibuja la fugra
        currentRotation++ //pasa por cada uno de los arrays con un increment operator
        if (currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
            currentRotation = 0 //Regresa a 0
        }
        current = theTetrominoes[random][currentRotation] //Si es falso vuelve a su código base
        checkRotatedPosition()
        draw() //Se dibuja la figura
    }

    const displaySquares = document.querySelectorAll('.mini-grid div') //Seleccionamos dentro del documento todos los elementos de clase .mini-grid y etiquetas div
    const displayWidth = 4 //width de nuestros tetrominos
    const displayIndex = 0 //index 0 de nuestros tetrominos (posición)

    const upNextTetrominoes = [ //Creamos un array con la figura inicial de los tetrominos
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    //Funcion forma de pantalla
    function displayShape() { //Se crea lafunción displayShape
        //removemos  cualquier rastro de los tetrominos de todo el grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino') //removemos la clase de tetromino
            square.style.backgroundColor = ''
        })
        //Llamamos la variable de nextRandom 
        upNextTetrominoes[nextRandom].forEach(index => {//para cada nextRandom hacemos lo siguiente
            displaySquares[displayIndex + index].classList.add('tetromino') //Añadimos la clase tetromino
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    startBtn.addEventListener('click', () => {//Añadomos un evento de click al botón de pausa
        //Si el botón es presionado restablecemos el tiempo de intervalo a 0 (timerId = setInterval(moveDown, 1000) -> timerId = setInterval(0))
        if (timerId) {
            clearInterval(timerId)//Usamos el metodo clearInterval y en su parámetro seleccionamos el timerId
            timerId = null //El tiempo de 1000 ns ahora será de 0
            document.removeEventListener('keydown', control);
            //Se elimina el evento click con la finalidad en que las fichas no tengas moviemiento en pausa
            document.getElementById('btnLeft').removeEventListener('click', moveLeft); //Remoción del evento click del boton izquierdo
            document.getElementById('btnRigth').removeEventListener('click', moveRight); //Remoción del evento click del boton derecha
            document.getElementById('btnRotate').removeEventListener('click', rotate); //Remoción del evento click del boton girar
            document.getElementById('btnDown').removeEventListener('click', moveDown); //Remoción del evento click del boton bajar
            document.querySelector('#start-button').style.backgroundColor = "#52525d"; 
            document.querySelector('#start-button').innerHTML = '<i class="fa-solid fa-play"></i>'

        } else {//Si el botón vuelve a ser presionado
            draw()//Se dibuja la figura en el grid principal
            timerId = setInterval(moveDown, 1000)//Se activa el timerId con la función moveDown cada 1000ms
            nextRandom = Math.floor(Math.random() * theTetrominoes.length) //Se seleciona la proxima figura que queremos que aparezca en el mini-grid
            displayShape()//Dibuja la figura acabada de determinar con nextRandom
            document.addEventListener('keydown', control);
            //Se agrega el evento click cuando este en despausa o inicie el juego con la finalidad en que las fichas tengan movimiento 
            document.getElementById('btnLeft').addEventListener('click', moveLeft); //Agrega el evento click del boton izquierdo
            document.getElementById('btnRigth').addEventListener('click', moveRight); //Agrega el evento click del boton derecho 
            document.getElementById('btnRotate').addEventListener('click', rotate); //Agrega el evento click del boton girar
            document.getElementById('btnDown').addEventListener('click', moveDown); //Agrega el evento click del boton abajo
            document.querySelector('#start-button').style.backgroundColor = "#27bead";
            document.querySelector('#start-button').innerHTML = '<i class="fa-solid fa-pause"></i>'
        }
    })

    //Función añadir puntaje
    function addScore() {//Se crea la función addScore
        for (let i = 0; i < 374; i += width) { //se añade una nueva fila si el número de divs es menor a 374 (cantidad de elementos de dis contados como array)
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9, i + 10, i +11, i + 12, i + 13, i + 14] /* Cantidad de divs en el ancho
            del juego (15 en nuestro caso) representadas dentro de una variable constante*/

            if (row.every(index => squares[index].classList.contains('taken'))) {//Si cada uno de los skuares dentro de una fila contienen la clase taken
                score += 15 //Se añade 15 al score
                scoreDisplay.innerHTML = score //se muestra el resultado con el método innerHMTL
                row.forEach(index => { //para cada index/item de una fila
                    squares[index].classList.remove('taken')//se remueve la clase de taken
                    squares[index].classList.remove('tetromino')/* se remueve la clase de tetromino (de esta manera los elemenos del appendChild
                    no reapareceran en la parte superior de la cuadrícula) */

                    squares[index].style.backgroundColor = ''//color de los cuadrados
                })
                const squaresRemoved = squares.splice(i, width)//eliminamos la fila creando una varible y eliminando squares co  el método .splice()
                squares = squaresRemoved.concat(squares)//juntamos los array de squares dentro de squaresRemoved usando el método de .concat
                squares.forEach(cell => grid.appendChild(cell))//para cada fila eliminada añadimos otra con appendChild
            }
        }
    }

    //Funcion perder
    function gameOver() { //se crea la función gameOver
        //Si alguno de los suquares actuales contiene la clase de taken
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            //Termina el contador de score y reemplaza el conenido por "end"
            scoreDisplay.innerHTML = 'end'
            //Termina el intervalo
            clearInterval(timerId)
            undraw()
            reload()
            document.removeEventListener('keyup', control)
        }
    }

    //Función recargar
    function reload(){
        //Muestra en pantalla alerta sobre el estado del juego y el puntaje alcanzado
        alert("¡Perdiste! Tu puntaje fué de: " + score)
        if (alert){
            //Recarga el juego
            window.location.reload();
        }
    }
})