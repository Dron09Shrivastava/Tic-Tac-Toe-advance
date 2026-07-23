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

const updateTurn = ()=>{
    turnText.innerText =
    turno ? "Player O's Turn" : "Player X's Turn";
};

function startTimer(){

    clearInterval(timer);

    timeLeft = 30;

    timerText.innerText = timeLeft;

    timer = setInterval(()=>{

        timeLeft--;

        timerText.innerText = timeLeft;

        if(timeLeft <= 0){

            clearInterval(timer);

            disableBoxes();

            msg.innerText = "⏰ Time's Up! Click Play Again";

            msgcontainer.classList.remove("hide");
        }

    },1000);
}

const resetGame = ()=>{
    turno = true;
    moves = 0;

    moveText.innerText = moves;

    enableBoxes();

    msgcontainer.classList.add("hide");

    updateTurn();

    clearInterval(timer);
    startTimer();
};

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
    });
});

const disableBoxes = ()=>{
    boxes.forEach((box)=>{
        box.disabled = true;
    });
};

const enableBoxes = ()=>{

    boxes.forEach((box)=>{

        box.disabled = false;

        box.innerText = "";

        box.classList.remove("winner-box");
    });
};

const showWinner = (winner)=>{

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

const checkDraw = ()=>{

    let filled = 0;

    boxes.forEach((box)=>{
        if(box.innerText !== ""){
            filled++;
        }
    });

    if(filled === 9){

        totalGames++;
        drawScore++;

        gamesText.innerText = totalGames;
        drawScoreText.innerText = drawScore;

        msg.innerText = "🤝 Match Draw";

        msgcontainer.classList.remove("hide");

        disableBoxes();
    }
};

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

newGameBtn.addEventListener("click",resetGame);
resetbtn.addEventListener("click",resetGame);

updateTurn();
startTimer();