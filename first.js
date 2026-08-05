/* *****************
 AI MODE 
*******************/

const gameMode = document.querySelector("#game-mode");

let aiEnabled = false;

gameMode.addEventListener("change",()=>{

    aiEnabled = gameMode.value === "ai";

    resetGame();

});

const difficulty = document.querySelector("#difficulty");

let aiDifficulty = "easy";

difficulty.addEventListener("change", () => {
    aiDifficulty = difficulty.value;
});

function aiMove(){

    if(!aiEnabled) return;

    let empty = [];

    boxes.forEach((box,index)=>{

        if(box.innerText===""){
            empty.push(index);
        }

    });

    if(empty.length===0) return;

    let move;

    if(aiDifficulty==="easy"){

        move = empty[Math.floor(Math.random()*empty.length)];

    }

    else if(aiDifficulty==="medium"){

        move = findWinningMove("X");

        if(move===null){
            move = findWinningMove("O");
        }

        if(move===null){
            move = empty[Math.floor(Math.random()*empty.length)];
        }

    }

    else{

        move = findWinningMove("X");

        if(move===null){

            move = findWinningMove("O");

        }

        if(move===null){

            if(boxes[4].innerText===""){
                move=4;
            }

        }

        if(move===null){

            let corners=[0,2,6,8];

            let freeCorners=corners.filter(i=>boxes[i].innerText==="");

            if(freeCorners.length>0){

                move=freeCorners[
                    Math.floor(Math.random()*freeCorners.length)
                ];

            }

        }

        if(move===null){

            move=empty[Math.floor(Math.random()*empty.length)];

        }

    }

    boxes[move].click();

}
function findWinningMove(player){

    for(let pattern of winpatterns){

        let a=pattern[0];
        let b=pattern[1];
        let c=pattern[2];

        let values=[
            boxes[a].innerText,
            boxes[b].innerText,
            boxes[c].innerText
        ];

        if(
            values.filter(v=>v===player).length===2 &&
            values.filter(v=>v==="").length===1
        ){

            if(boxes[a].innerText==="") return a;
            if(boxes[b].innerText==="") return b;
            if(boxes[c].innerText==="") return c;

        }

    }

    return null;

}
/* *****************
 AI MODE ENDS
*******************/

// Select the timer element
let timerText = document.querySelector("#timer");
let timeLeft = 30;
let timer;

const themeBtn = document.querySelector("#theme-btn");

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerText = "☀️ Light Mode";
    }
    else{
        themeBtn.innerText = "🌙 Dark Mode";
    }
});

// Select sound Button element
const clickSound = new Audio("./sound/click.mp3");
const winSound = new Audio("./sound/win.mp3");

clickSound.volume = 1;
winSound.volume = 1;


let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#new-game");

let msgcontainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnText = document.querySelector("#turn-text");

let xScoreText = document.querySelector("#x-score");
let oScoreText = document.querySelector("#o-score");
let drawScoreText = document.querySelector("#draw-score");

let moveText = document.querySelector("#moves");
let gamesText = document.querySelector("#games");

let turno = true;

let moves = 0;

let xScore = 0;
let oScore = 0;
let drawScore = 0;
let totalGames = 0;

// Winning pattern of the game
const winpatterns = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6],
];

// Function to launch confetti animation 

function launchConfetti(){

    for(let i=0;i<80;i++){

        const confetti =
        document.createElement("div");

        confetti.classList.add("confetti");

        confetti.style.left =
        Math.random()*100 + "vw";

        confetti.style.background =
        `hsl(${Math.random()*360},
        100%,70%)`;

        confetti.style.animationDuration =
        (Math.random()*2+2)+"s";

        document.body.appendChild(confetti);

        setTimeout(()=>{
            confetti.remove();
        },4000);
    }
}

// Function to update the turn text
const updateTurn = ()=>{
    turnText.innerText =
    turno ? "Player O's Turn" : "Player X's Turn";
};

// Function to start timer countdown
function startTimer(){

    clearInterval(timer);

    timer = setInterval(()=>{

        timeLeft--;

        timerText.innerText = timeLeft;

        if(timeLeft <= 0 && msgcontainer.classList.contains("hide")){

            clearInterval(timer);

            disableBoxes();

            msg.innerText = "⏰ Time's Up! Click Play Again";

            msgcontainer.classList.remove("hide");

        }

    },1000);

}

// Function to reset the game

const resetGame = ()=>{

    turno = true;
    moves = 0;

    timeLeft = 30;
    timerText.innerText = timeLeft;

    moveText.innerText = moves;

    enableBoxes();

    msgcontainer.classList.add("hide");

    updateTurn();

    clearInterval(timer);

    startTimer();

};

// Add click event listner to each box
boxes.forEach((box)=>{

    box.addEventListener("click",()=>{

        clickSound.currentTime = 0;
        clickSound.play().catch(err => console.log(err));

        if(turno){

            box.innerText = "O";
            box.style.color = "#ec4899";

            turno = false;

        }else{

            box.innerText = "X";
            box.style.color = "#2563eb";

            turno = true;
        }

        moves++;
        moveText.innerText = moves;

        box.disabled = true;

        updateTurn();

        checkWinner();
        // Check if AI is enabled and it's AI's turn to move

        if (aiEnabled &&!turno &&msgcontainer.classList.contains("hide")) {
            setTimeout(() => {

            if(msgcontainer.classList.contains("hide")){
                aiMove();
            }

            },500);
        }
    });
});

// Function to diable all boxes

const disableBoxes = ()=>{
    boxes.forEach((box)=>{
        box.disabled = true;
    });
};

// Function to enable all boxes
const enableBoxes = ()=>{

    boxes.forEach((box)=>{

        box.disabled = false;

        box.innerText = "";

        box.classList.remove("winner-box");
    });
};

// Function to show winner and update score
const showWinner = (winner)=>{

    clearInterval(timer);

    winSound.currentTime = 0;
    winSound.play().catch(err => console.log(err));

    launchConfetti();

    totalGames++;

    gamesText.innerText = totalGames;

    if(winner === "X"){
        xScore++;
        xScoreText.innerText = xScore;
    }
    else{
        oScore++;
        oScoreText.innerText = oScore;
    }

    msg.innerText = `🏆 ${winner} Wins!`;

    msgcontainer.classList.remove("hide");

    disableBoxes();
};
// Function to check if the game is a draw
const checkDraw = ()=>{

    let filled = 0;
    //check if all boexes are filled and no winner
    boxes.forEach((box)=>{
        if(box.innerText !== ""){
            filled++;
        }
    });

    if(filled === 9){

        clearInterval(timer);

        totalGames++;
        drawScore++;

        gamesText.innerText = totalGames;
        drawScoreText.innerText = drawScore;

        msg.innerText = "🤝 Match Draw";

        msgcontainer.classList.remove("hide");

        disableBoxes();
    }
};
// Function to check if there is a winner
const checkWinner = ()=>{

    for(let pattern of winpatterns){

        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if(
            pos1Val !== "" &&
            pos2Val !== "" &&
            pos3Val !== ""
        ){

            if(
                pos1Val === pos2Val &&
                pos2Val === pos3Val
            ){

                boxes[pattern[0]].classList.add("winner-box");
                boxes[pattern[1]].classList.add("winner-box");
                boxes[pattern[2]].classList.add("winner-box");

                showWinner(pos1Val);
                return;
            }
        }
    }

    checkDraw();
};

document.addEventListener("visibilitychange",()=>{

    if(document.hidden){

        // Pause timer completely
        clearInterval(timer);

    }else{

        // Resume timer from current value
        if(msgcontainer.classList.contains("hide")){

            startTimer();

        }

    }

});

newGameBtn.addEventListener("click",resetGame);
resetbtn.addEventListener("click",resetGame);

updateTurn();
startTimer();