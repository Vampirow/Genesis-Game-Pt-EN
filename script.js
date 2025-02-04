const colorButtons = document.querySelectorAll(".color-btn");
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const scoreElement = document.getElementById("score");
const greenSound = document.getElementById("green-sound");
const redSound = document.getElementById("red-sound");
const yellowSound = document.getElementById("yellow-sound");
const blueSound = document.getElementById("blue-sound");
const errorSound = document.getElementById("error-sound");

let sequence = [];
let playerSequence = [];
let score = 0;
let gameStarted = false;

const keyMap = {
  7: "green",
  9: "red",
  1: "yellow",
  3: "blue",
};

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    score = 0;
    sequence = [];
    updateScore();
    nextRound();
  }
}

function resetGame() {
  gameStarted = false;
  score = 0;
  sequence = [];
  updateScore();
  colorButtons.forEach((btn) => btn.classList.remove("active"));
}

function nextRound() {
  playerSequence = [];
  addToSequence();
  playSequence();
}

function addToSequence() {
  const colors = ["green", "red", "yellow", "blue"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(randomColor);
}

function playSequence() {
  disableButtons();
  let i = 0;
  const intervalId = setInterval(() => {
    const color = sequence[i];
    flashButton(color);
    i++;
    if (i >= sequence.length) {
      clearInterval(intervalId);
      enableButtons();
    }
  }, 1000);
}

function flashButton(color) {
  const button = document.querySelector(`[data-color="${color}"]`);
  button.classList.add("active");
  playSound(color);
  setTimeout(() => {
    button.classList.remove("active");
  }, 500);
}

function playSound(color) {
  switch (color) {
    case "green":
      greenSound.play();
      break;
    case "red":
      redSound.play();
      break;
    case "yellow":
      yellowSound.play();
      break;
    case "blue":
      blueSound.play();
      break;
  }
}

function handleButtonClick(color) {
  if (!gameStarted) return;

  playerSequence.push(color);
  flashButton(color);

  if (
    playerSequence[playerSequence.length - 1] !==
    sequence[playerSequence.length - 1]
  ) {
    errorSound.play();
    setTimeout(endGame, 500);
    return;
  }

  if (playerSequence.length === sequence.length) {
    score++;
    updateScore();
    setTimeout(nextRound, 1000);
  }
}

function updateScore() {
  scoreElement.textContent = score;
}

function endGame() {
  const lang = languageSelect.value;
  alert(translations[lang].gameOverMessage + score);
  updateRanking();
  resetGame();
}

function disableButtons() {
  colorButtons.forEach((btn) =>
    btn.removeEventListener("click", handleColorButtonClick)
  );
  document.removeEventListener("keydown", handleKeyPress);
}

function enableButtons() {
  colorButtons.forEach((btn) =>
    btn.addEventListener("click", handleColorButtonClick)
  );
  document.addEventListener("keydown", handleKeyPress);
}

function handleColorButtonClick(event) {
  const clickedColor = event.target.dataset.color;
  handleButtonClick(clickedColor);
}

function handleKeyPress(event) {
  event.preventDefault();
  const key = event.key;
  if (keyMap.hasOwnProperty(key)) {
    const color = keyMap[key];
    handleButtonClick(color);
  }
}

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

// Inicializar os event listeners para os botões de cor
colorButtons.forEach((btn) =>
  btn.addEventListener("click", handleColorButtonClick)
);

// Adicionar event listener para teclas do teclado
document.addEventListener("keydown", handleKeyPress);

const languageSelect = document.getElementById("language-select");

const translations = {
  pt: {
    gameTitle: "Jogo da Pizza Genesis",
    languageLabel: "Idioma:",
    scoreLabel: "Pontuação:",
    startButton: "Iniciar",
    resetButton: "Reiniciar",
    instructionsTitle: "Como Jogar",
    instructions: [
      "Pressione 'Iniciar' para começar o jogo.",
      "Observe e memorize a sequência das fatias de pizza acendendo.",
      "Repita a sequência clicando nas fatias ou usando o teclado numérico:",
      "7 - Verde (superior esquerdo)",
      "9 - Vermelho (superior direito)",
      "1 - Amarelo (inferior esquerdo)",
      "3 - Azul (inferior direito)",
      "A sequência ficará mais longa a cada rodada.",
      "Se você cometer um erro, o jogo termina.",
      "Tente alcançar a maior pontuação!",
    ],
    gameOverMessage: "Fim de jogo! Sua pontuação no Jogo da Pizza Genesis: ",
    rankingTitle: "Ranking",
  },
  en: {
    gameTitle: "Genesis Pizza Game",
    languageLabel: "Language:",
    scoreLabel: "Score:",
    startButton: "Start",
    resetButton: "Reset",
    instructionsTitle: "How to Play",
    instructions: [
      "Press 'Start' to begin the game.",
      "Watch and remember the sequence of pizza slices lighting up.",
      "Repeat the sequence by clicking the slices or using the number pad:",
      "7 - Green (top-left)",
      "9 - Red (top-right)",
      "1 - Yellow (bottom-left)",
      "3 - Blue (bottom-right)",
      "The sequence will get longer with each round.",
      "If you make a mistake, the game ends.",
      "Try to achieve the highest score!",
    ],
    gameOverMessage: "Game Over! Your Genesis Pizza Game score: ",
    rankingTitle: "Ranking",
  },
};

function updateLanguage(lang) {
  document.getElementById("game-title").textContent =
    translations[lang].gameTitle;
  document.getElementById("language-label").textContent =
    translations[lang].languageLabel;
  document.getElementById("score-label").textContent =
    translations[lang].scoreLabel;
  document.getElementById("start-btn").textContent =
    translations[lang].startButton;
  document.getElementById("reset-btn").textContent =
    translations[lang].resetButton;
  document.getElementById("instructions-title").textContent =
    translations[lang].instructionsTitle;
  document.getElementById("ranking-title").textContent =
    translations[lang].rankingTitle;

  const instructionsList = document.getElementById("instructions-list");
  instructionsList.innerHTML = "";
  translations[lang].instructions.forEach((instruction, index) => {
    const li = document.createElement("li");
    li.textContent = instruction;
    instructionsList.appendChild(li);
    if (index === 2) {
      const ul = document.createElement("ul");
      for (let i = 3; i <= 6; i++) {
        const subLi = document.createElement("li");
        subLi.textContent = translations[lang].instructions[i];
        ul.appendChild(subLi);
      }
      instructionsList.appendChild(ul);
    }
  });
}

languageSelect.addEventListener("change", (event) => {
  updateLanguage(event.target.value);
});

// Inicializar o idioma padrão (português)
updateLanguage("pt");

const rankingList = document.getElementById("ranking-list");
let ranking = [];

function updateRanking() {
  const playerName = prompt("Digite seu nome para o ranking:");
  if (playerName) {
    ranking.push({ name: playerName, score: score });
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 10); // Manter apenas os 10 melhores

    // Atualizar a exibição do ranking
    rankingList.innerHTML = "";
    ranking.forEach((entry, index) => {
      const li = document.createElement("li");
      li.textContent = `${entry.name}: ${entry.score}`;
      rankingList.appendChild(li);
    });

    // Salvar o ranking em um arquivo (simulado, já que não podemos acessar o sistema de arquivos diretamente no navegador)
    console.log("Ranking atualizado:", JSON.stringify(ranking));
  }
}
