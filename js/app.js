console.log('Project #1')

let color = ["red", "yellow", "green", "orange", "violet", "indigo", "pink", "rgb(0,0,0)","rgb(255,255,255)"];
let ballsArray = []
let startButton = document.querySelector("#new-game")
let gameWindow = document.querySelector("#game")
let tube = document.querySelectorAll(".tube")
let nextLevelButton = document.querySelector("#next-level")
let addTube = document.querySelector("#add-tube")
let faq = document.querySelector("#faq")
let faqWindow = document.querySelector("#model")
let faqClose = document.querySelector("#close-button")
let levelWon = document.querySelector("#won-level")
let gameWon = document.querySelector("#won-game")
let restart = document.querySelector("#restart")

restart.addEventListener("click", ()=>{
    removeBalls()
    displayTheGame()
    createBalls()
    assignBalls()
    assignBallsId()
})

function addNewTube () {
    let newTube = document.createElement("div")
    newTube.setAttribute("class", "tube")
    newTube.setAttribute("ondrop", "drop(event)")
    newTube.setAttribute("ondragover", "allowDrop(event)")
    newTube.style.display = "flex"
    gameWindow.appendChild(newTube)
    tube = document.querySelectorAll(".tube")
}

faq.addEventListener("click", ()=>{
    faqWindow.className = "open"
    gameWindow.style.display = "none"
    document.getElementById("add-tube").disabled = true
})

faqClose.addEventListener("click", ()=>{
    faqWindow.className = "close"
    setTimeout(function() {
        gameWindow.style.display = "flex"
    },1000)
    document.getElementById("add-tube").disabled = false
})

addTube.addEventListener("click", ()=>{
    addNewTube()
    let assignID = document.querySelector(".tube")
    assignID.id = "remove"
    document.getElementById("add-tube").disabled = true
})

function displayTheGame () {
    startButton.style.display = "none"
    nextLevelButton.style.display = "none"
    addTube.style.display = "inline-block"
    faq.style.display = "inline-block"
    restart.style.display = "inline-block"
    document.getElementById("add-tube").disabled = false
    for(let i = 0; i < tube.length; i++){
        tube[i].style.display = "flex"
    }
}

function createBalls() {
    for(let i = 0; i < tube.length-1; i++){
        for(let j = 0; j < 4; j++){
            let coloredBall = document.createElement("div")
            coloredBall.setAttribute("draggable", "true")
            coloredBall.setAttribute("ondragstart", "drag(event)")
            coloredBall.style.background = `radial-gradient(circle at 15px 15px, ${color[i]}, rgb(70,70,70))`
            coloredBall.setAttribute("class", `balls ${color[i]}`)
            ballsArray.push(coloredBall)
        }
    }
}

function assignBalls() {
    let ballsArrayLength = ballsArray.length
    let tubeArray = []
    for(let i = 0; i < tube.length; i++){
        tubeArray.push(i)
    }
    for(let i = 0; i < ballsArrayLength; i++){
        let numberOfBalls = Math.floor(Math.random()*(ballsArray.length))
        let numberOfArray = Math.floor(Math.random()*(tubeArray.length))
        let numberOfTubes = tubeArray[numberOfArray]
        tube[numberOfTubes].appendChild(ballsArray[numberOfBalls])
        ballsArray.splice(numberOfBalls,1)
        if(tube[numberOfTubes].children.length > 3){
            tubeArray.splice(numberOfArray,1)
        }
    }
}

function assignBallsId(){
    let balls = document.querySelectorAll(".balls")
    for(let i = 0; i < balls.length; i++){
        balls[i].setAttribute("id",`ball${i}`)
    }   
}

startButton.addEventListener("click", ()=>{
    displayTheGame()
    createBalls()
    assignBalls()
    assignBallsId()  
})

nextLevelButton.addEventListener("click", ()=>{ 
    addNewTube()
    displayTheGame()
    createBalls()
    assignBalls()
    assignBallsId()
})

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    let parent = ev.target.parentNode
    if(ev.target === parent.lastChild){
        ev.dataTransfer.setData("text", ev.target.id);
    } 
}
  
function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let selectedBall = document.querySelector(`#${data}`).getAttribute("class").split(' ')[1]
    let lengthOfTheTube = ev.target.children.length -1
    try { lastBall = ev.target.children[lengthOfTheTube].getAttribute("class").split(' ')[1]} catch(err) {
        if(ev.target.getAttribute("class") === "tube"){
            lastBall = selectedBall     
        }
    }
    if(selectedBall !== lastBall || ev.target.getAttribute("class").split(' ')[0] === "balls"){
        console.log('These balls are different colors') 
    } else {
        ev.target.appendChild(document.getElementById(data));
    }
    checkTheGame()
}

function checkTheGame () {
    let checkResults = []
    for(let i = 0; i < tube.length; i++) {
        let numberOfChildren = tube[i].children.length
        let checkColor = []
        let checkLength = []
        
        for(let j = 0; j < numberOfChildren; j++){
            let checkBalls = tube[i].children[j].getAttribute("class").split(' ')[1]
            checkColor.push(checkBalls)
        }
        let allEqualColor = arr => arr.every(val => val === arr[0]);
        let resultColor = allEqualColor(checkColor)
        checkResults.push(resultColor)
        let allEqualLength = arr => arr.every(val => val === 0 || val === 4);
        checkLength.push(numberOfChildren)
        let resultLength = allEqualLength(checkLength)
        checkResults.push(resultLength)
    }
    let allEqualResults = arr => arr.every(val => val === true);
    let results = allEqualResults(checkResults)
    if(results === true){
        setTimeout(function(){ 
            if(tube.length<color.length+2) {
                buttonDisplay()
                for(let i = 0; i < tube.length; i++){
                    tube[i].style.display = "none"
                }
                levelWon.className = "open"
                setTimeout(function(){
                    levelWon.className = "close"
                    setTimeout(function(){
                        nextLevelButton.style.display = "inline-block"
                    },1000)
                },1000)
            } else {
                buttonDisplay()
                for(let i = 0; i < tube.length; i++){
                tube[i].style.display = "none"  
                gameWon.className = "open" 
            }
        }
            removeBalls()
        }, 100);
    }
}

function removeBalls () {
    let balls = document.querySelectorAll(".balls")
    for(let i = 0; i < balls.length; i++){
        balls[i].remove()
    }
    try{
        let removeAdditionalTube = document.querySelector("#remove")
        removeAdditionalTube.remove()
    } catch(err) {
        console.log("There is no additional tubes")
    }
    tube = document.querySelectorAll(".tube")
}

function buttonDisplay (){
    addTube.style.display = "none"
    faq.style.display = "none"
    restart.style.display = "none"
}
