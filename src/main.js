const board = document.getElementById("board");
const endModal = document.getElementById("end-modal");
const restartGame = document.getElementById("restart-game");
const newMatch = document.getElementById("new-match");
const xScoreHTML = document.getElementById("x-score");
const drayScoreHTML = document.getElementById("draw-score");
const oScoreHTML = document.getElementById("o-score");


let initialPlayerX = true;
let playerX = initialPlayerX;
let xScore = 0;
let oScore = 0;
let draws = 0;
const state = ["","","","","","","","",""];
let moves = 0;
let victoryIndices = [];


const victoryWays = [
  // Horizontais
  { combo: [0, 1, 2], style: "top: 15.1%; left:-5%; width: 110%; rotate: 0deg;" },
  { combo: [3, 4, 5], style: "top: 48.5%; left:-5%; width: 110%; rotate: 0deg;" },
  { combo: [6, 7, 8], style: "top: 81.8%; left:-5%; width: 110%; rotate: 0deg;" },
  // Verticais
  { combo: [0, 3, 6], style: "top: 48.5%; left: -38.4%; width: 110%; rotate: 90deg;" },
  { combo: [1, 4, 7], style: "top: 48.5%; left: -4.9%; width: 110%; rotate: 90deg;" },
  { combo: [2, 5, 8], style: "top: 48.5%; left: 28.5%; width: 110%; rotate: 90deg;" },
  // Diagonais
  { combo: [0, 4, 8], style: "top: 49%; left: -20.5%; width: 142%; rotate: 45deg;" },
  { combo: [2, 4, 6], style: "top: 49%; left: -21.58%; width: 142%; rotate: 135deg;" },
];

function checkVictory() {
  // Verificando vitória nas linhas
  for(let i=0;i<9;i+=3) {
    if(state[i] === "") continue;
    if(state[i] === state[i+1] && state[i+1] === state[i+2]) {
      victoryIndices.push(i, i+1, i+2);
      return true;
    }
  }

  // Verificando vitórias nas colunas
  for(let i=0;i<3;i++) {
    if(state[i] === "") continue;
    if(state[i] === state[i+3] && state[i+3] === state[i+6]) {
      victoryIndices.push(i, i+3, i+6);
      return true;
    }
  }

  // Verificando vitórias nas diagonais
  if(state[4] === "") return false;

  if(state[0] === state[4] && state[4] === state[8]) {
    victoryIndices.push(0, 4, 8);
    return true;
  }

  if(state[2] === state[4] && state[4] === state[6]) {
    victoryIndices.push(2, 4, 6);
    return true;
  }

  return false;
}

function draw() {
  draws++;
  setTimeout(showDrawModal, 500);
}

function win() {
  let colorLine;
  if(playerX) { 
    colorLine = "bg-red-500";
    xScore++;
  } else { 
    colorLine = "bg-green-500";
    oScore++;
  }

  const victoryLine = document.createElement("div");
  victoryLine.classList.add("absolute", colorLine, "h-[3%]", "rounded-full", "z-10", "animate-victory-line");
  
  for(const item of victoryWays) {
    if(item.combo.length === victoryIndices.length && item.combo.every((value, index) => value === victoryIndices[index])) {
      victoryLine.style.cssText = item.style;
    }
  }

  const i0 = document.querySelector(`#s${victoryIndices[0]} svg`);
  const i1 = document.querySelector(`#s${victoryIndices[1]} svg`);
  const i2 = document.querySelector(`#s${victoryIndices[2]} svg`);

  board.classList.add("pointer-events-none");

  setTimeout(() => {
    board.appendChild(victoryLine);
  }, 500);

  setTimeout(() => {
      victoryLine.classList.remove("animate-victory-line");
      victoryLine.classList.add("animate-pop-in-victory");
      i0.classList.remove("animate-pop-in", "temp-animate");
      i1.classList.remove("animate-pop-in", "temp-animate");
      i2.classList.remove("animate-pop-in", "temp-animate");
      i0.classList.add("animate-pop-in-victory");
      i1.classList.add("animate-pop-in-victory");
      i2.classList.add("animate-pop-in-victory");
  }, 1500);

  setTimeout(() => {
    board.classList.remove("pointer-events-none");
    victoryLine.classList.remove("animate-pop-in-victory");
    i0.classList.remove("animate-pop-in-victory");
    i1.classList.remove("animate-pop-in-victory");
    i2.classList.remove("animate-pop-in-victory");
    showWinModal();
  }, 2500);
}

function showWinModal() {
  const h1 = endModal.querySelector("h1");
  if(playerX) {
    h1.innerText = "X Venceu!";
    h1.classList.remove("text-green-700", "text-gray-500");
    h1.classList.add("text-red-600");
    setTimeout(() => {
      xScoreHTML.innerText  = `${xScore}`;
    }, 10);
  } else {
    h1.innerText = "O Venceu!"
    h1.classList.remove("text-red-600", "text-gray-500");
    h1.classList.add("text-green-700");
    setTimeout(() => {
      oScoreHTML.innerText  = `${oScore}`;
    }, 10);
  }
  endModal.classList.remove("hidden");
  endModal.classList.add("flex");
}

function showDrawModal() {
  const h1 = endModal.querySelector("h1");
  h1.innerText = "Empate!";
  h1.classList.remove("text-green-700", "text-red-600");
  h1.classList.add("text-gray-500");
  drayScoreHTML.innerText = `${draws}`;
  endModal.classList.remove("hidden");
  endModal.classList.add("flex");
}

function resetMatch() {
  for(const i in state) {
    state[i] = "";
  }

  playerX = initialPlayerX;
  moves = 0;
  victoryIndices = [];

  resetMatchHTML();

  endModal.classList.remove("flex");
  endModal.classList.add("hidden");
}

function resetMatchHTML() {
  board.innerHTML = `
      <button id="s0" class="relative border-r-2 border-b-2 border-indigo-400 w-full flex justify-center items-center"></button>
      <button id="s1" class="relative border-r-2 border-b-2 border-l-2 border-indigo-400 w-full flex justify-center items-center"></button>
      <button id="s2" class="relative border-l-2 border-b-2 border-indigo-400 w-full flex justify-center items-center"></button>
      <button id="s3" class="relative border-r-2 border-b-2 border-t-2 border-indigo-400 w-full flex justify-center items-center"></button>
      <button id="s4" class="relative border-r-2 border-b-2 border-l-2 border-t-2 border-indigo-400 w-full flex justify-center items-center"></button>
      <button id="s5" class="relative border-l-2 border-b-2 border-t-2 border-indigo-400 w-full flex justify-center items-center"></button>
      <button id="s6" class="relative border-r-2 border-t-2 border-indigo-400 w-full flex justify-center items-center"></button>
      <button id="s7" class="relative border-r-2 border-t-2 border-l-2 border-indigo-400 w-full flex justify-center items-center"></button>
      <button id="s8" class="relative border-l-2 border-t-2 border-indigo-400 w-full flex justify-center items-center"></button>
    `;
}

function resetScore() {
  xScore = 0;
  draws = 0;
  oScore = 0;

  xScoreHTML.innerText = `${xScore}`;
  drayScoreHTML.innerText = `${draws}`;
  oScoreHTML.innerText = `${oScore}`;
}

board.addEventListener('click', event => {
  const button = event.target.closest("button");
  if(!button) return;
  if(button.innerHTML.trim() !== "") return;

  const svg = document.querySelector(`.temp-animate`);
  if(svg) {
    svg.classList.remove('animate-pop-in');
    svg.classList.remove('temp-animate');
  }

  let symbol;
  let symbolColor;
  let height;
  let width;
  const square = Number(button.id[1]);

  if(playerX) {
    symbol="x";
    symbolColor = "text-red-500";
    height = "h-full";
    width = "w-full";
    state[square] = "X";
  } else {
    symbol="circle";
    symbolColor = "text-green-500";
    height = "h-[80%]";
    width = "w-[80%]";
    state[square] = "O";
  }

  button.innerHTML = `
    <i data-lucide="${symbol}" class="${symbolColor} temp-animate absolute flex justify-center items-center ${height} ${width} animate-pop-in"></i>
  `;

  lucide.createIcons();

  if(checkVictory()) {
    win();
  } else {
    playerX = !playerX;
    moves++;
  }

  if(moves === 9) {
    draw();
  }
});

restartGame.addEventListener("click", () => {
  initialPlayerX = true;
  resetMatch();
  resetScore();
});

newMatch.addEventListener("click", () => {
  initialPlayerX = !initialPlayerX;
  resetMatch();
});