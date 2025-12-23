const board = document.getElementById("board");
let playerX = true;
const state = ["","","","","","","","",""];
let moves = 0;
let victoryIndices = [];

const victoryWays = [
  // Horizontais
  { combo: [0, 1, 2], style: "top: 15.1%; left:-5%; width: 110%; rotate: 0deg;" },
  { combo: [3, 4, 5], style: "top: 48.5%; left:-5%; width: 110%; rotate: 0deg;" },
  { combo: [6, 7, 8], style: "top: 81.8%; left:-5%; width: 110%; rotate: 0deg;" },
  // Verticais
  { combo: [0, 3, 6], style: "top: -5%; left:16.6%; width: 110%; rotate: 90deg;" },
  { combo: [1, 4, 7], style: "top: -5%; left:50%; width: 110%; rotate: 90deg;" },
  { combo: [2, 5, 8], style: "top: -5%; left: 83.5%; width: 110%; rotate: 90deg;" },
  // Diagonais
  { combo: [0, 4, 8], style: "top: -1.5%; left: 0%; width: 142%; rotate: 45deg;" },
  { combo: [2, 4, 6], style: "top: -1.5%; left: 100%; width: 142%; rotate: 135deg;" },
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

function win() {
  let colorLine;
  if(playerX) colorLine = "bg-red-500";
  else colorLine = "bg-blue-500";

  const victoryLine = document.createElement("div");
  victoryLine.classList.add("absolute", colorLine, "h-[3%]", "rounded-full", "z-10", "origin-left", "animate-victory-line");
  
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
      i0.classList.add("animate-pop-in-victory");
      i1.classList.add("animate-pop-in-victory");
      i2.classList.add("animate-pop-in-victory");
  }, 1500);

  setTimeout(() => {
    board.classList.remove("pointer-events-none");
    i0.classList.remove("animate-pop-in-victory");
    i1.classList.remove("animate-pop-in-victory");
    i2.classList.remove("animate-pop-in-victory", "animate-pop-in");
  }, 3000);
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
    symbolColor = "text-blue-500";
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
  }

  moves++;
  playerX = !playerX;

});