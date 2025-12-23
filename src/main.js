const board = document.getElementById("board");
let playerX = true;
const state = ["","","","","","","","",""];
let moves = 0;
let victoryIndices = [];

const victoryWays = [
  // Horizontais
  { combo: [0, 1, 2], style: "top: 15.6%; left:-5%; width: 110%; rotate: 0deg;" },
  { combo: [3, 4, 5], style: "top: 49%; left:-5%; width: 110%; rotate: 0deg;" },
  { combo: [6, 7, 8], style: "top: 82.3%; left:-5%; width: 110%; rotate: 0deg;" },
  // Verticais
  { combo: [0, 3, 6], style: "top: -5%; left:16.6%; width: 110%; rotate: 90deg;" },
  { combo: [1, 4, 7], style: "top: -5%; left:50%; width: 110%; rotate: 90deg;" },
  { combo: [2, 5, 8], style: "top: -5%; left: 83.5%; width: 110%; rotate: 90deg;" },
  // Diagonais
  { combo: [0, 4, 8], style: "top: -1%; left: 0%; width: 142%; rotate: 45deg;" },
  { combo: [2, 4, 6], style: "top: 5%; left: 95%; width: 125%; rotate: 135deg;" },
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

  if(state[0] === state[4] === state[8]) {
    victoryIndices.push(0, 4, 8);
    return true;
  }

  if(state[2] === state[4] === state[6]) {
    victoryIndices.push(2, 4, 6);
    return true;
  }

  return false;
}

function win() {

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

  const victoryLine = document.getElementById("victory-line");
  victoryLine.classList.add("animate-victory-line");
  victoryLine.classList.remove("hidden");
});