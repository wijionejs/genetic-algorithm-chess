import { Canvas } from "./Canvas.js";
import { GeneticAlgorithm } from "./GeneticAlgorithm.js";

const boardCanvasEl = document.getElementById("board-canvas");
const overlayCanvasEl = document.getElementById("overlay-canvas");
const currentGenerationEl = document.getElementById("current-generation-element");
const solutionFoundEl = document.getElementById("solution-found-text");

const boardSizeInput = document.getElementById("board-size-input");
const queensNumberInput = document.getElementById("queens-number-input");
const populationSizeInput = document.getElementById("population-size-input");
const mutationRateInput = document.getElementById("mutation-input");
const pauseTimeInput = document.getElementById("pause-input");

const startButton = document.getElementById("start-button");

let sleepTime;
let canvas = new Canvas(boardCanvasEl, overlayCanvasEl, boardSizeInput.value);
let geneticAlgorithm;

canvas.renderBoard();

boardSizeInput.addEventListener("input", (event) => {
  canvas.clearBoard();
  canvas = new Canvas(boardCanvasEl, overlayCanvasEl, parseInt(event.target.value));
  canvas.renderBoard();
});
startButton.addEventListener("click", start);

async function render() {
  currentGenerationEl.textContent = geneticAlgorithm.generationNumber;

  for (let i = 0; i < geneticAlgorithm.currentGeneration.length; i++) {
    const currentChromosome = geneticAlgorithm.currentGeneration[i];
    canvas.renderQueens(currentChromosome.positions);

    if (currentChromosome.fitness === geneticAlgorithm.maxFitness) {
      finish();
      return;
    }

    await new Promise(res => setTimeout(res, sleepTime));
  }

  geneticAlgorithm.breedNewGeneration();
  requestAnimationFrame(render);
}

function start() {
  disableInputs();
  const { boardSize, queensNumber, populationSize, mutationRate } = extractInputValues();

  geneticAlgorithm = new GeneticAlgorithm(queensNumber, populationSize, mutationRate, boardSize);
  render();
}

function finish() {
  solutionFoundEl.classList.remove("hidden");
}

function disableInputs() {
  boardSizeInput.disabled = true;
  queensNumberInput.disabled = true;
  populationSizeInput.disabled = true;
  mutationRateInput.disabled = true;
  pauseTimeInput.disabled = true;

  startButton.classList.add("hidden");
}

function extractInputValues() {
  const boardSize = parseInt(boardSizeInput.value);
  const queensNumber = parseInt(queensNumberInput.value);
  const populationSize = parseInt(populationSizeInput.value);
  const mutationRate = parseFloat(mutationRateInput.value) / 100;
  sleepTime = parseInt(pauseTimeInput.value);

  return { boardSize, queensNumber, populationSize, mutationRate };
}