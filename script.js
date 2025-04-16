const quoteEl = document.getElementById('quote');
const inputEl = document.getElementById('input');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const restartBtn = document.getElementById('restart');
const submitBtn = document.getElementById('submit');
const messageEl = document.getElementById('message');

const sentencesByDifficulty = {
  easy: [
    "The sun is hot.",
    "I love ice cream.",
    "This is a pen.",
    "He runs fast.",
    "We play games."
  ],
  medium: [
    "Typing tests help improve your speed and accuracy.",
    "Practice makes perfect when learning to type fast.",
    "JavaScript is a powerful language for the web.",
    "Dark mode reduces eye strain in low light.",
    "Never underestimate the power of clean code."
  ],
  hard: [
    "Dream big, work hard, stay focused, and surround yourself with good people.\nThe future belongs to those who prepare for it today.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.\nEvery mistake is a lesson in disguise.",
    "If opportunity doesn’t knock, build a door with your skills.\nHard work beats talent when talent doesn’t work hard.",
    "Typing with speed and accuracy requires daily practice and dedication.\nYour fingers should dance on the keyboard with rhythm.",
    "Code like there's no one watching; test like everyone is.\nDebugging is twice as hard as writing the code in the first place."
  ]
};

let quote = '';
let timer = 60;
let interval = null;
let started = false;

function getRandomSentence() {
  const difficulty = document.getElementById('difficulty').value;
  const list = sentencesByDifficulty[difficulty];
  return list[Math.floor(Math.random() * list.length)];
}

function renderQuote(text) {
  quoteEl.innerHTML = '';
  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char;
    quoteEl.appendChild(span);
  });
}

function startNewTest() {
  clearInterval(interval);
  timer = 60;
  timeEl.textContent = timer;
  started = false;
  inputEl.value = '';
  wpmEl.textContent = '0';
  accuracyEl.textContent = '0';
  inputEl.disabled = false;
  messageEl.textContent = '';
  quote = getRandomSentence();
  renderQuote(quote);
}

function endTest(success) {
  clearInterval(interval);
  inputEl.disabled = true;
  if (success) {
    messageEl.textContent = '🎉 Successfully Completed!';
    messageEl.style.color = '#4caf50';
  } else {
    messageEl.textContent = '⏰ Time\'s Up!';
    messageEl.style.color = '#f44336';
  }
}

function updateTimer() {
  if (timer > 0) {
    timer--;
    timeEl.textContent = timer;
    calculateStats();
  } else {
    endTest(false);
  }
}

inputEl.addEventListener('input', () => {
  if (!started) {
    interval = setInterval(updateTimer, 1000);
    started = true;
  }

  const input = inputEl.value;
  const quoteSpans = quoteEl.querySelectorAll('span');
  let correct = 0;

  quoteSpans.forEach((span, idx) => {
    const typedChar = input[idx];
    span.classList.remove('correct', 'incorrect', 'current');

    if (typedChar == null) {
      // untouched
    } else if (typedChar === span.innerText) {
      span.classList.add('correct');
      correct++;
    } else {
      span.classList.add('incorrect');
    }

    if (idx === input.length) {
      span.classList.add('current');
    }
  });

  calculateStats();

  if (input === quote) {
    endTest(true);
  }
});

function calculateStats() {
  const input = inputEl.value;
  const wordsTyped = input.trim().split(/\s+/).filter(Boolean).length;
  const correctChars = [...input].filter((char, i) => char === quote[i]).length;
  const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 0;
  const wpm = Math.round((wordsTyped / (60 - timer)) * 60) || 0;

  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy;
}

themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.body.classList.add('light-mode');
    themeLabel.textContent = '🌞 Light Mode';
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light-mode');
    themeLabel.textContent = '🌙 Dark Mode';
    localStorage.setItem('theme', 'dark');
  }
});

document.getElementById('difficulty').addEventListener('change', startNewTest);
restartBtn.addEventListener('click', startNewTest);
submitBtn.addEventListener('click', () => {
  if (!inputEl.disabled) {
    endTest(false);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.checked = true;
    themeLabel.textContent = '🌞 Light Mode';
  }
  startNewTest();
});
