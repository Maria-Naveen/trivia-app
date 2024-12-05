const enterBtn = document.querySelector(".enterBtn");
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const playerDetails = document.querySelector(".playerDetails");
const categoryDetails = document.querySelector(".categoryDetails");
const category = document.querySelector("#category");
const turn = document.querySelector(".turn");
const startBtn = document.querySelector(".startBtn");
const question = document.querySelector(".question");
const options = document.querySelector(".options");
const nextBtn = document.querySelector(".nextBtn");
const questionSection = document.querySelector(".questionSection");
const lastSection = document.querySelector(".lastSection");
const firstScore = document.querySelector(".firstScore");
const secondScore = document.querySelector(".secondScore");
const continueBtn = document.querySelector(".continue");
const exitBtn = document.querySelector(".exit");
const result = document.querySelector(".result");
const end = document.querySelector(".end");
const playAgain = document.querySelector(".playAgain");

let firstPlayer = true;
let questions;
let set = new Set();

const points = {
  easy: 10,
  medium: 15,
  hard: 20,
};

let player1Score = 0;
let player2Score = 0;

enterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (player1.value.trim().length === 0 || player2.value.trim().length === 0) {
    alert("Enter the name to start the game!");
    return;
  }
  playerDetails.classList.add("hidden");
  categoryDetails.classList.remove("hidden");
});

startBtn.addEventListener("click", async () => {
  if (!set.has(category.value)) {
    set.add(category.value);
  } else {
    alert("This genre already chosen. Please try a new one!");
    return;
  }
  const promise1 = fetch(
    `https://the-trivia-api.com/v1/questions?categories=${category.value}&difficulty=easy&limit=2`
  ).then((res) => res.json());
  const promise2 = fetch(
    `https://the-trivia-api.com/v1/questions?categories=${category.value}&difficulty=medium&limit=2`
  ).then((res) => res.json());
  const promise3 = fetch(
    `https://the-trivia-api.com/v1/questions?categories=${category.value}&difficulty=hard&limit=2`
  ).then((res) => res.json());
  const [easy, medium, hard] = await Promise.all([
    await promise1,
    promise2,
    promise3,
  ]);
  questions = [...easy, ...medium, ...hard];
  categoryDetails.classList.add("hidden");
  questionSection.classList.remove("hidden");
  turn.innerText = `${player1.value}'s turn`;
  question.innerText = questions[0].question;
  nextBtn.disabled = true;
  let firstQuestionOptions = [
    ...questions[0].incorrectAnswers,
    questions[0].correctAnswer,
  ].sort(() => Math.random() - 0.5);
  firstQuestionOptions.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(questions[0], option));
    options.appendChild(button);
  });
});

let index = 1;
nextBtn.addEventListener("click", () => {
  nextBtn.disabled = true;
  if (index >= questions.length) {
    alert("All questions have been exhausted!");
    questionSection.classList.add("hidden");
    lastSection.classList.remove("hidden");
    playAgain.classList.remove("hidden");
    firstScore.textContent = player1Score;
    secondScore.textContent = player2Score;
    return;
  }

  if (firstPlayer) {
    turn.textContent = `${player1.value}'s turn`;
  } else {
    turn.textContent = `${player2.value}'s turn`;
  }

  const currentQuestion = questions[index];
  question.innerText = currentQuestion.question;
  const choices = [
    ...currentQuestion.incorrectAnswers,
    currentQuestion.correctAnswer,
  ].sort(() => Math.random() - 0.5);

  options.innerHTML = "";
  choices.forEach((opt) => {
    const button = document.createElement("button");
    button.textContent = opt;
    button.addEventListener("click", () => checkAnswer(currentQuestion, opt));
    options.appendChild(button);
  });

  index++;
});

function checkAnswer(question, chosenAnswer) {
  if (question.correctAnswer === chosenAnswer && firstPlayer) {
    player1Score += points[question.difficulty];
  } else if (question.correctAnswer === chosenAnswer && !firstPlayer) {
    player2Score += points[question.difficulty];
  }
  nextBtn.disabled = false;
  firstPlayer = !firstPlayer;
}

continueBtn.addEventListener("click", () => {
  index = 1;
  lastSection.classList.add("hidden");
  categoryDetails.classList.remove("hidden");
});

exitBtn.addEventListener("click", () => {
  firstScore.textContent = `${player1.value}'s score is ${player1Score}`;
  secondScore.textContent = `${player2.value}'s score is ${player2Score}`;
  if (player1Score > player2Score) {
    result.textContent = `${player1.value} has won the game`;
  } else if (player2Score > player1Score) {
    result.textContent = `${player2.value} has won the game`;
  } else {
    result.textContent = "It is a tie";
  }
  end.classList.remove("hidden");
  playAgain.classList.add("hidden");
});
