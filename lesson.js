// ── Floating tooltips ─────────────────────────────────────
// Uses fixed positioning to escape overflow:hidden on accordions

const tooltip = document.getElementById('floating-tooltip');

document.querySelectorAll('.term').forEach(term => {
  const text = term.querySelector('.term-tooltip').textContent.trim();

  term.addEventListener('mouseenter', e => {
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    positionTooltip(e.currentTarget);
  });
  term.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
  term.addEventListener('focus', e => {
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    positionTooltip(e.currentTarget);
  });
  term.addEventListener('blur', () => {
    tooltip.style.display = 'none';
  });
});

function positionTooltip(el) {
  const rect   = el.getBoundingClientRect();
  const ttW    = 220;
  const margin = 8;
  let left = rect.left + rect.width / 2 - ttW / 2;
  let top  = rect.top - tooltip.offsetHeight - margin;

  // Keep within viewport horizontally
  left = Math.max(margin,
    Math.min(left, window.innerWidth - ttW - margin));

  // Flip below the term if not enough room above
  if (top < margin) top = rect.bottom + margin;

  tooltip.style.left = left + 'px';
  tooltip.style.top  = top  + 'px';
}

// ── Progress bar ──────────────────────────────────────────
function updateProgress() {
  const scrollable =
    document.body.scrollHeight - window.innerHeight;
  const pct = scrollable > 0
    ? Math.min(100,
        Math.round((window.scrollY / scrollable) * 100))
    : 0;
  document.getElementById('progress-bar-fill').style.width =
    pct + '%';
  document.getElementById('progress-label').textContent =
    pct + '% complete';
}
window.addEventListener('scroll', updateProgress, { passive: true });

// ── Accordion ─────────────────────────────────────────────
function toggleAccordion(btn) {
  const body   = btn.nextElementSibling;
  const isOpen = body.classList.contains('open');
  btn.classList.toggle('open',  !isOpen);
  body.classList.toggle('open', !isOpen);
}

// ── Quiz ──────────────────────────────────────────────────

// Version key — increment this if you change any quiz answers.
// This will clear old localStorage data for all students.
const QUIZ_VERSION = 'v1';

function unlockSections() {
  document.querySelectorAll('.step-section.locked').forEach(section => {
    const requires = section.dataset.requires;
    if (!requires) return;

    const allDone = requires.split(' ').every(id => {
      const quiz = document.getElementById(id);
      return quiz && quiz.dataset.completed === 'true';
    });

    if (allDone) section.classList.remove('locked');
  });
}

function completeQuiz(quiz) {
  const quizId   = quiz.id;
  const buttons  = quiz.querySelectorAll('button');
  const feedback = quiz.querySelector('.quiz-feedback');
  const correct  = quiz.querySelector('button[data-correct="true"]');

  quiz.dataset.completed = 'true';
  buttons.forEach(b => { b.disabled = true; });
  if (correct) correct.classList.add('correct');
  feedback.textContent = '✓ Correct!';
  feedback.className = 'quiz-feedback correct';

  // Save to localStorage
  localStorage.setItem(QUIZ_VERSION + '_' + quizId, 'completed');

  unlockSections();
}

function checkAnswer(btn, correct) {
  const quiz     = btn.closest('.quiz-block');
  const feedback = quiz.querySelector('.quiz-feedback');

  if (correct) {
    completeQuiz(quiz);
  } else {
    btn.disabled = true;
    btn.classList.add('wrong');
    feedback.textContent =
      '✗ Not quite — try another option!';
    feedback.className = 'quiz-feedback wrong';
  }
}

// ── Restore quiz state on page load ───────────────────────
document.querySelectorAll('.quiz-block').forEach(quiz => {
  if (localStorage.getItem(QUIZ_VERSION + '_' + quiz.id)
      === 'completed') {
    completeQuiz(quiz);
  }
});

// ── Checklist ─────────────────────────────────────────────
function toggleCheck(li) {
  li.classList.toggle('done');
}

// ── Copy button ───────────────────────────────────────────
function copyCode(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1800);
  }).catch(() => {
    btn.textContent = 'Error';
    setTimeout(() => { btn.textContent = 'Copy'; }, 1800);
  });
}

// ── Reset button ──────────────────────────────────────────
function resetProgress() {
  document.querySelectorAll('.quiz-block').forEach(quiz => {
    localStorage.removeItem(QUIZ_VERSION + '_' + quiz.id);
  });
  location.reload();
}