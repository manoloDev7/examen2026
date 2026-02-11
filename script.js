// --- Configuración y Datos ---
const ACCESS_KEY = "examen2026"; // Clave de acceso
const EXAM_TIME_MINUTES = 30; // 30 minutos reales

const allQuestions = [
  {
    id: "q1",
    text: "1. ¿Qué significa HTML?",
    options: [
      { value: "a", text: "Hyper Text Markup Language" },
      { value: "b", text: "High Tech Modern Language" },
      { value: "c", text: "Hyperloop Machine Learning" },
    ],
    correct: "a",
  },
  {
    id: "q2",
    text: "2. ¿Cuál es la etiqueta correcta para el encabezado más grande?",
    options: [
      { value: "a", text: "&lt;head&gt;" },
      { value: "b", text: "&lt;h6&gt;" },
      { value: "c", text: "&lt;h1&gt;" },
    ],
    correct: "c",
  },
  {
    id: "q3",
    text: "3. ¿Para qué sirve CSS?",
    options: [
      { value: "a", text: "Para estructurar el contenido" },
      { value: "b", text: "Para dar estilo y diseño visual" },
      { value: "c", text: "Para programar la lógica del servidor" },
    ],
    correct: "b",
  },
  {
    id: "q4",
    text: '4. ¿Cómo se selecciona un elemento con id="menu"?',
    options: [
      { value: "a", text: ".menu" },
      { value: "b", text: "#menu" },
      { value: "c", text: "menu" },
    ],
    correct: "b",
  },
  {
    id: "q5",
    text: "5. ¿Cuál es la forma correcta de declarar una variable en JS moderno?",
    options: [
      { value: "a", text: "variable myVar;" },
      { value: "b", text: "let myVar;" },
      { value: "c", text: "v myVar;" },
    ],
    correct: "b",
  },
  {
    id: "q6",
    text: "6. ¿Cuál es el operador de igualdad estricta en JS?",
    options: [
      { value: "a", text: "==" },
      { value: "b", text: "===" },
      { value: "c", text: "=" },
    ],
    correct: "b",
  },
  {
    id: "q7",
    text: "7. ¿Qué propiedad de CSS cambia el color del texto?",
    options: [
      { value: "a", text: "text-color" },
      { value: "b", text: "font-color" },
      { value: "c", text: "color" },
    ],
    correct: "c",
  },
  {
    id: "q8",
    text: "8. ¿Cuál es el elemento HTML para una lista desordenada?",
    options: [
      { value: "a", text: "&lt;ol&gt;" },
      { value: "b", text: "&lt;ul&gt;" },
      { value: "c", text: "&lt;list&gt;" },
    ],
    correct: "b",
  },
  {
    id: "q9",
    text: "9. ¿Cómo se llama a una función en JavaScript?",
    options: [
      { value: "a", text: "call myFunction()" },
      { value: "b", text: "myFunction()" },
      { value: "c", text: "call function myFunction()" },
    ],
    correct: "b",
  },
  {
    id: "q10",
    text: "10. ¿Qué atributo HTML se usa para definir estilos en línea?",
    options: [
      { value: "a", text: "class" },
      { value: "b", text: "styles" },
      { value: "c", text: "style" },
    ],
    correct: "c",
  },
];

// --- Lógica de Usuario / Renderizado ---
let randomizedQuestions = [];
let timerInterval;
const examForm = document.getElementById("examForm");
const submitBtn = document.getElementById("submitBtn");
const timerElement = document.getElementById("timer");

function checkAccess() {
  const input = document.getElementById("accessKey");
  const errorMsg = document.getElementById("loginError");

  if (input.value === ACCESS_KEY) {
    document.getElementById("loginOverlay").style.display = "none";
    document.getElementById("appContainer").style.display = "flex";
    initExam();
  } else {
    errorMsg.style.display = "block";
    input.value = "";
    input.focus();
  }
}

function initExam() {
  // 1. Resetear UI y estado
  examForm.reset();
  const inputs = examForm.querySelectorAll("input");
  inputs.forEach((input) => (input.disabled = false));
  submitBtn.disabled = false;
  submitBtn.textContent = "Enviar Examen";

  // Limpiar estilos anteriores
  document
    .querySelectorAll(".correct-answer, .incorrect-answer")
    .forEach((el) => {
      el.classList.remove("correct-answer", "incorrect-answer");
    });

  // 2. Aleatorizar preguntas
  randomizedQuestions = [...allQuestions].sort(() => 0.5 - Math.random());

  // 3. Renderizar preguntas
  const container = document.getElementById("questionsContainer");
  container.innerHTML = "";

  randomizedQuestions.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "question-card";

    // Ajustamos el número mostrado (1..10) indep. del orden
    const displayQuestionText = q.text.replace(/^\d+\.\s*/, `${index + 1}. `);

    let html = `<h3>${displayQuestionText}</h3>`;
    q.options.forEach((opt) => {
      html += `
        <label>
          <input type="radio" name="${q.id}" value="${opt.value}">
          ${opt.text}
        </label>
      `;
    });

    card.innerHTML = html;
    container.appendChild(card);
  });

  // 4. Iniciar contador
  startTimer();
}

// --- Temporizador ---
let timeLeft;

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timeLeft = EXAM_TIME_MINUTES * 60;
  timerElement.classList.remove("timer-danger");

  updateTimerDisplay(); // Actualizar inmediatamente

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft < 300) {
      timerElement.classList.add("timer-danger");
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      finishExam(null, true); // true = forced by timeout
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// --- Finalización y Bloqueo ---
function finishExam(e, isTimeout = false) {
  if (e) e.preventDefault();

  clearInterval(timerInterval);

  clearInterval(timerInterval);

  // Calcular Score (ANTES de bloquear inputs, porque inputs disabled no se envían)
  const formData = new FormData(examForm);

  // Bloquear TODO
  const inputs = examForm.querySelectorAll("input");
  inputs.forEach((input) => (input.disabled = true));
  submitBtn.disabled = true;
  submitBtn.textContent = isTimeout ? "¡Tiempo Agotado!" : "Examen Finalizado";

  let score = 0;

  randomizedQuestions.forEach((q) => {
    if (formData.get(q.id) === q.correct) {
      score++;
      // Marcar correcta visualmente (input seleccionado)
      const correctInput = document.querySelector(
        `input[name="${q.id}"][value="${q.correct}"]`,
      );
      if (correctInput)
        correctInput.parentElement.classList.add("correct-answer");
    } else {
      // Marcar incorrecta si se seleccionó algo
      const selectedValue = formData.get(q.id);
      if (selectedValue) {
        const wrongInput = document.querySelector(
          `input[name="${q.id}"][value="${selectedValue}"]`,
        );
        if (wrongInput)
          wrongInput.parentElement.classList.add("incorrect-answer");
      }
      // Mostrar la correcta también
      const correctInput = document.querySelector(
        `input[name="${q.id}"][value="${q.correct}"]`,
      );
      if (correctInput)
        correctInput.parentElement.classList.add("correct-answer");
    }
  });

  // Toast si es timeout
  if (isTimeout) {
    showToast("¡Tiempo Agotado! El examen se ha cerrado.");
  }

  // Show Modal
  showResultModal(score, allQuestions.length, isTimeout, formData);

  // Confetti si es perfecto
  if (score === allQuestions.length) {
    triggerConfetti();
  }
}

function showResultModal(score, total, isTimeout, formData) {
  const modal = document.getElementById("resultModal");
  const title = document.getElementById("modalTitle");
  const scoreDisplay = document.getElementById("modalScore");
  const message = document.getElementById("modalMessage");
  const summary = document.getElementById("modalSummary");

  title.textContent = isTimeout ? "¡Tiempo Agotado!" : "Examen Finalizado";
  scoreDisplay.textContent = `${score} / ${total}`;

  if (score === total) message.textContent = "¡Excelente! 🎉";
  else if (score >= total / 2) message.textContent = "¡Bien hecho! 👍";
  else message.textContent = "Sigue estudiando 📚";

  // Generate Summary
  summary.innerHTML = "";
  // const formData ya no se necesita, usamos el pasado como argumento

  randomizedQuestions.forEach((q, index) => {
    const li = document.createElement("li");
    const isCorrect = formData.get(q.id) === q.correct;
    li.className = `summary-item ${isCorrect ? "correct" : "incorrect"}`;
    li.innerHTML = `
      <span>Pregunta ${index + 1}</span>
      <span>${isCorrect ? "✅" : "❌"}</span>
    `;
    summary.appendChild(li);
  });

  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("resultModal").style.display = "none";
}

function resetExam() {
  closeModal();
  initExam();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "show";
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 5000);
}

function triggerConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}

examForm.addEventListener("submit", finishExam);

// --- Modo Oscuro Toggle ---
const toggleBtn = document.getElementById("toggleMode");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  toggleBtn.textContent = document.body.classList.contains("light-mode")
    ? "🌙"
    : "☀️";
});
