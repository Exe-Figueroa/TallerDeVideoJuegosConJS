const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#btn-up');
const btnLeft = document.querySelector('#btn-left');
const btnRight = document.querySelector('#btn-right');
const btnDown = document.querySelector('#btn-down');
const spanLives = document.querySelector('#lives');
const spantime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#resultado');
const pResult2 = document.querySelector('#resultadoAlternativo');


let canvaSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;
// const posicionAnterior = {
//     x: undefined,
//     y: undefined,
// }

const playerPosition = {
    x: undefined,
    y: undefined,
}
const giftPos = {
    x: undefined,
    y: undefined,
}
let enemies = [];
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
function startGame() {
    game.font = `${elementsSize}px Verdana`;
    game.textAlign = 'end';
    const map = maps[level];
    if (!map) {
        gameWin();
        return;
    }
    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 75)
        showRecord();
    }
    const mapRows = map.trim().split('\n');
    const mapCol = mapRows.map(row => row.trim().split(''));
    enemies = [];
    game.clearRect(0, 0, canvaSize, canvaSize);
    mapCol.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col]
            const posX = elementsSize * (colI + 1)
            const posY = elementsSize * (rowI + 1)
            if (col== 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY
                }
            }else if (col == 'I'){
                giftPos.x = posX;
                giftPos.y = posY;
            }else if (col == 'X'){
                enemies.push({
                    x: posX,
                    y: posY,
                })
            }
            game.fillText(emoji, posX,posY );
        });
    });
    showLives()
    showTime()
    /* for (let x = 1; x <= 10; x++) {
        for (let y = 1; y <=10; y++) {
            game.fillText(emojis[mapCol[x-1][y-1]], elementsSize*y, elementsSize * x );
        }
    } */
    // game.clearRect()
    // game.fillText()
    // game.font=''
    // game.fillStyle=''
    // game.textAlign = ''
    movePlayer()
    /**
     * ? posicionAnterior.x = playerPosition.x;
     * ?posicionAnterior.y = playerPosition.y;
     * ?console.log(posicionAnterior); 
     * */
}
function fixNumber(n){
    return Number(n.toFixed(2))
}
function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvaSize = (window.innerWidth * 0.70);
    } else {
        canvaSize = (window.innerHeight * 0.70);
    }

    canvaSize = Number(canvaSize.toFixed(2))
    canvas.setAttribute('width', canvaSize);
    canvas.setAttribute('height', canvaSize);
    elementsSize = canvaSize/10
    playerPosition.x = undefined;
    playerPosition.y  = undefined;
    startGame()
}
function movePlayer() {
    const gifCollisionX = playerPosition.x.toFixed(2) == giftPos.x.toFixed(2);
    const gifCollisionY = playerPosition.y.toFixed(2) == giftPos.y.toFixed(2);
    const gifCollision = gifCollisionX && gifCollisionY;
    if (gifCollision){
        levelWin()
    }
    const enemyCollision = enemies.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
        const enemyCollisionY = enemy.y.toFixed(2) == playerPosition.y.toFixed(2);
        return enemyCollisionX && enemyCollisionY;
    })
    if (enemyCollision){
        levelFail();
    }
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    

}
function gameWin() {
    clearInterval(timeInterval)

    const recordTime =  localStorage.getItem('recordTime')
    console.log(recordTime);
    const playerTime = Date.now() - timeStart;
    if (recordTime) {
        if(recordTime >= playerTime){ 
            localStorage.setItem('recordTime', playerTime)
            pResult.innerHTML = 'Felicidades!! Has superado el anterior record'
        }else{
            pResult.innerHTML = 'Que pena. Vuelve a intentarlo.'
        }
    }else{
        localStorage.setItem('recordTime', playerTime )
        pResult.innerHTML = 'Primera vez? Muy bien pero ahora trata de superar tu record '
    }
    pResult2.innerHTML = `Ganaste!! Este es tu record: "${playerTime}"`
}
function showLives(){
    const heartArray = Array(lives).fill(emojis['HEART'])
    spanLives.innerHTML=""
    heartArray.forEach(heart=>spanLives.append(heart))
}
function showTime() {

    spantime.innerHTML = `${Date.now()-timeStart}`;

}
function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('recordTime');
}
function levelWin() {
    
        level++
        startGame();
}
function levelFail() {
    lives--;
    if (lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    console.log('lalal');
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}
window.addEventListener('keydown', moveBtn)
btnUp.addEventListener('click', up);
btnLeft.addEventListener('click',left);
btnRight.addEventListener('click', right);
btnDown.addEventListener('click', down);
function moveBtn(event) {
    switch (event.key) {
        case "ArrowUp":
            up()
            break;
        case "ArrowLeft":
            left()
            break;
        case "ArrowRight":
            right()
            break;
        case "ArrowDown":
            down()
            break;
    
        default:
            break;
    }
}
function up() {
    if ((playerPosition.y - elementsSize) < elementsSize){
        console.log('out');
    }else{
        playerPosition.y -= elementsSize;
        startGame();
    }
}
function left() {
    if ((playerPosition.x -elementsSize)< elementsSize){
        console.log('out');
    }else{
        playerPosition.x -= elementsSize;
        startGame();
    }
}
function right() {
    if ((playerPosition.x + elementsSize)> canvaSize){
        console.log('out');
    }else{
        playerPosition.x += elementsSize;
        startGame();
    }
    
}
function down() {
    if ((playerPosition.y + elementsSize)> canvaSize){
        console.log('out');
    }else{
        playerPosition.y += elementsSize;
        startGame();
    }
}