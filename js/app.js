const decks = [
  { name: "Full PD1 Deck", cards: window.cards },
  { name: "Focus: Dev Fundamentals & Process Automation", cards: window.cardsFocus },
];

let activeDeck = 0;
let cards = decks[activeDeck].cards;

let currentIndex = 0;
let revealed = new Set();

const flashCard = document.getElementById("flashCard");
const questionBadge = document.getElementById("questionBadge");
const questionText = document.getElementById("questionText");
const codeBlock = document.getElementById("codeBlock");
const deckSelect = document.getElementById("deckSelect");
const optionsList = document.getElementById("optionsList");
const answerValue = document.getElementById("answerValue");
const explanation = document.getElementById("explanation");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const revealedCount = document.getElementById("revealedCount");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const navDots = document.getElementById("navDots");

function getCorrectLetters(answer) {
  return answer.split(",").map((s) => s.trim());
}

function renderCard(index) {
  const card = cards[index];
  const correctLetters = getCorrectLetters(card.answer);

  questionBadge.textContent = card.id;
  questionText.textContent = card.question;
  answerValue.textContent = card.answer;
  explanation.textContent = card.explanation;

  if (card.code) {
    codeBlock.textContent = card.code;
    codeBlock.hidden = false;
  } else {
    codeBlock.textContent = "";
    codeBlock.hidden = true;
  }

  optionsList.innerHTML = card.options
    .map(
      (opt) =>
        `<li class="${correctLetters.includes(opt.letter) ? "correct" : ""}">
          <span class="option-letter">${opt.letter}</span>
          <span>${opt.text}</span>
        </li>`
    )
    .join("");

  const isRevealed = revealed.has(index);
  flashCard.classList.toggle("revealed", isRevealed);
  flashCard.setAttribute(
    "aria-label",
    isRevealed
      ? `Flash card ${card.id}. Answer revealed: ${card.answer}.`
      : `Flash card ${card.id}. Click to reveal answer.`
  );

  progressFill.style.width = `${((index + 1) / cards.length) * 100}%`;
  progressText.textContent = `Question ${index + 1} of ${cards.length}`;
  revealedCount.textContent = `${revealed.size} revealed`;

  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === cards.length - 1 ? "Done ✓" : "Next →";

  navDots.querySelectorAll(".nav-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
    dot.classList.toggle("revealed", revealed.has(i));
  });
}

function buildNavDots() {
  navDots.innerHTML = cards
    .map((_, i) => `<button class="nav-dot" aria-label="Go to question ${i + 1}"></button>`)
    .join("");

  navDots.querySelectorAll(".nav-dot").forEach((dot, i) => {
    dot.addEventListener("click", () => goTo(i));
  });
}

function reveal() {
  if (revealed.has(currentIndex)) return;
  revealed.add(currentIndex);
  renderCard(currentIndex);
}

function goTo(index) {
  currentIndex = index;
  renderCard(currentIndex);
}

function next() {
  if (currentIndex < cards.length - 1) {
    goTo(currentIndex + 1);
  }
}

function prev() {
  if (currentIndex > 0) {
    goTo(currentIndex - 1);
  }
}

flashCard.addEventListener("click", reveal);
flashCard.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    reveal();
  }
});

prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);

document.addEventListener("keydown", (e) => {
  if (e.target.closest("button") && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
  if (e.key === " " && !e.target.closest("button")) {
    e.preventDefault();
    reveal();
  }
});

function switchDeck(deckIndex) {
  activeDeck = deckIndex;
  cards = decks[activeDeck].cards;
  currentIndex = 0;
  revealed = new Set();
  buildNavDots();
  renderCard(currentIndex);
}

if (deckSelect) {
  deckSelect.innerHTML = decks
    .map((d, i) => `<option value="${i}">${d.name} (${d.cards.length})</option>`)
    .join("");
  deckSelect.value = String(activeDeck);
  deckSelect.addEventListener("change", (e) => switchDeck(Number(e.target.value)));
}

buildNavDots();
renderCard(currentIndex);
