// Elements
const board = document.getElementById("board");
const endModal = document.getElementById("end-modal");
const dropdownDifficulty = document.getElementById("dropdown-difficulty");

// Buttons
const restartGame = document.getElementById("restart-game");
const newMatch = document.getElementById("new-match");
const nPlayers = document.getElementById("number-of-players");
const difficulty = document.getElementById("difficulty");
const easy = document.getElementById("easy");
const medium = document.getElementById("medium");
const hard = document.getElementById("hard");
const impossible = document.getElementById("impossible");
const volume = document.getElementById("volume");
const config = document.getElementById("config");

// Score
const xScoreHTML = document.getElementById("x-score");
const drayScoreHTML = document.getElementById("draw-score");
const oScoreHTML = document.getElementById("o-score");

// Sound
const winSound = new Audio("./src/assets/270402__littlerobotsoundfactory__jingle_win_00.wav");
const loseSound = new Audio("./src/assets/game-over-401236.mp3");
const drawSound = new Audio("./src/assets/270403__littlerobotsoundfactory__jingle_lose_00.wav");
const xSound = new Audio("./src/assets/107140__bubaproducer__button-21.wav");
const oSound = new Audio("./src/assets/107151__bubaproducer__button-4.wav");
const buttonSound = new Audio("./src/assets/107155__bubaproducer__button-8.wav");

winSound.volume = 0.8;
loseSound.volume = 1;
drawSound.volume = 0.8;
xSound.volume = 1;
oSound.volume = 1;
buttonSound.volume = 0.8;

// Variables
let initialPlayerX = true;
let playerX = initialPlayerX;
let onePlayer = true;
let playerIsX = true;
let xScore = 0;
let oScore = 0;
let draws = 0;
const state = ["","","","","","","","",""];
let moves = 0;
let victoryIndices = [];
let difficultyGame = "medium";
let isMuted = false;

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

function playSound(audio) {
  if(isMuted) return;
  audio.currentTime = 0;
  audio.play();
}

function stopAudios() {
  winSound.pause();
  loseSound.pause();
  drawSound.pause();
}

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

    if(onePlayer) {
      if(playerIsX) playSound(winSound);
      else playSound(loseSound);
    } else {
      playSound(winSound);
    }
  } else {
    h1.innerText = "O Venceu!"
    h1.classList.remove("text-red-600", "text-gray-500");
    h1.classList.add("text-green-700");
    
    setTimeout(() => {
      oScoreHTML.innerText  = `${oScore}`;
    }, 10);

    if(onePlayer) {
      if(!playerIsX) playSound(winSound);
      else playSound(loseSound);
    } else {
      playSound(winSound);
    }
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
  playSound(drawSound)
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

function restartGameFunc() {
  initialPlayerX = true;
  resetMatch();
  resetScore();
}

function closeConfigModal() {
  const configModal = document.getElementById("config-modal");
  configModal.remove();
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
    playSound(xSound);
  } else {
    symbol="circle";
    symbolColor = "text-green-500";
    height = "h-[80%]";
    width = "w-[80%]";
    state[square] = "O";
    playSound(oSound);
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
  stopAudios();
  restartGameFunc();
  playSound(buttonSound);
});

newMatch.addEventListener("click", () => {
  stopAudios();
  initialPlayerX = !initialPlayerX;
  resetMatch();
  playSound(buttonSound);
});

nPlayers.addEventListener("click", () => {
  if(onePlayer) {
    difficulty.classList.add("hidden");
    nPlayers.innerHTML = `<i data-lucide="users-round"></i>`;
    onePlayer = false;
  } else {
    difficulty.classList.remove("hidden");
    nPlayers.innerHTML = `<i data-lucide="user-round"></i>`;
    onePlayer = true;
  }

  lucide.createIcons()

  restartGameFunc();
  playSound(buttonSound);
});

// Serve para fechar o dropdown da dificuldade quando se aperta fora dele
window.addEventListener("click", (event) => {
  const dropdownDifficultyIsOpen = !dropdownDifficulty.classList.contains("hidden");

  if(dropdownDifficultyIsOpen && !difficulty.contains(event.target) && !dropdownDifficulty.contains(event.target)) {
    dropdownDifficulty.classList.add("hidden");
  }
});

difficulty.addEventListener("click", () => {
  if(dropdownDifficulty.classList.contains("hidden")) {
    dropdownDifficulty.classList.remove("hidden");
  } else {
    dropdownDifficulty.classList.add("hidden");
  }

  playSound(buttonSound);
});

dropdownDifficulty.addEventListener("click", (event) => {
  const liDifficulty = event.target.closest("li");
  const difficultyText = document.querySelector("#difficulty p");

  if(difficultyGame === liDifficulty.id) return;

  const svg = document.querySelector(`#${difficultyGame} svg`);
  svg.remove();

  if(liDifficulty.id === "easy") {
    difficultyGame = "easy";
    difficultyText.innerText = "Fácil";
    liDifficulty.innerHTML = `
      <p>Fácil</p>
      <i data-lucide="check" class="size-5"></i>
    `;
  } else if(liDifficulty.id === "medium") {
    difficultyGame = "medium";
    difficultyText.innerText = "Médio";
    liDifficulty.innerHTML = `
      <p>Médio</p>
      <i data-lucide="check" class="size-5"></i>
    `;
  } else if(liDifficulty.id === "hard") {
    difficultyGame = "hard";
    difficultyText.innerText = "Difícil";
    liDifficulty.innerHTML = `
      <p>Difícil</p>
      <i data-lucide="check" class="size-5"></i>
    `;
  } else if(liDifficulty.id === "impossible") {
    difficultyGame = "impossible";
    difficultyText.innerText = "Impossível";
    liDifficulty.innerHTML = `
      <p>Impossível</p>
      <i data-lucide="check" class="size-5"></i>
    `;
  }

  lucide.createIcons();
  dropdownDifficulty.classList.add("hidden");
  restartGameFunc();

  playSound(buttonSound);
});

volume.addEventListener("click", () => { 
  if(isMuted) volume.innerHTML = `<i data-lucide="volume-2"></i>`;
  else volume.innerHTML = `<i data-lucide="volume-x"></i>`;
  isMuted = !isMuted;
  if(!isMuted) playSound(buttonSound);

  lucide.createIcons();
});

config.addEventListener("click", () => {
  const body = document.querySelector("body");
  const config = document.createElement("div");
  config.id = "config-modal";
  config.classList.add("fixed", "inset-0", "z-50", "flex", "flex-col", "items-center", "justify-center", "bg-black/50",  "backdrop-blur-sm", "p-4");
  config.innerHTML = `
      <div class="relative w-75 h-75 bg-amber-300 border-8 border-amber-500 rounded-xl flex items-center justify-center gap-20 flex-col">
        <h1 class="absolute -top-1 -translate-y-1/2 text-3xl font-semibol px-4 py-2 bg-orange-900 text-white rounded-full">Configurações</h1>
        <div class="w-full flex flex-col items-center justify-center gap-2.5">
          <button id="restart-config" class="bg-orange-600 mt-2 px-5 py-2.5 w-51 font-medium text-white rounded-xl hover:opacity-85 hover:cursor-pointer">Continuar</button>
          <button id="restart-match-config" class="bg-orange-600  px-5 py-2.5 w-51 font-medium text-white rounded-xl hover:opacity-85 hover:cursor-pointer">Reiniciar Partida</button>
          <button id="change-piece-config" ${onePlayer ? "" : "disabled"} class="bg-orange-600 w-51 px-5 py-2.5 font-medium text-white rounded-xl hover:opacity-85 hover:cursor-pointer disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">Jogar com ${playerIsX ? "O" : "X"}</button>
          <button id="credits-config" class="bg-orange-600 w-51 px-5 py-2.5 font-medium text-white rounded-xl hover:opacity-85 hover:cursor-pointer">Créditos</button>
        </div>
      </div>
  `;
  body.appendChild(config);

  playSound(buttonSound);
});

window.addEventListener("click", (event) =>  {
  const button = event.target.closest("button");
  if(!button) return;

  if(button.id === "restart-config") {
    closeConfigModal();
    playSound(buttonSound);
  } else if(button.id === "restart-match-config") {
    resetMatch();
    closeConfigModal();
    playSound(buttonSound);
  } else if(button.id === "change-piece-config") {
    const xScoreName = document.getElementById("x-score-name");
    const oScoreName = document.getElementById("o-score-name");
    if(playerIsX) {
      xScoreName.innerText = "Máquina (X)";
      oScoreName.innerText = "Você (O)";
    } else {
      xScoreName.innerText = "Você (X)";
      oScoreName.innerText = "Máquina (O)";
    }
    playerIsX = !playerIsX;
    restartGameFunc();
    closeConfigModal();
    playSound(buttonSound);
  } else if(button.id === "credits-config") {
    // TODO: Falta colocar os créditos
    playSound(buttonSound);
  }

});

// TODO: Coisas que faltam:
// COlocar a parte dos créditos
// Colocar a parte de jogar sozinho