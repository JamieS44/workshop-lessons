# Lesson Developer README
This document explains the structure and interactive features of the
WSL lesson page so that anyone editing, extending, or riffing off it
can understand how everything works.

The code and much of the README.md was generated with Claude.ai and
is intended to be used by people who can navigate this code fairly
well and make edits where they want.

You can view a sample of this project here:
<https://churslic.github.io/workshop-lessons/wsl.html>

## Developer wishlist
- Take this project so that you do not have to directly code HTML in the main
  wsl-lesson.html file. (There's a way to do this with javascript!)
- Contribute clarifying language to instructions. 
- Point out things to look out if your experience on your Windows machine
  looked different.
- GitHub workflow diagram. They exist, but they're meh. So someone make one.

## Beginner-ish Instructions for contributing to this repo
This assumes you have git set up and ready to go! There will be some 
authentication you need to do. 

1. *Fork* the repo to your GitHub account and <code>git clone</code> locally to 
  your laptop.
  - If you have already done this, then run <code>git status</code> to check if
    you are up to date. Always make sure "main" is up to date! If not, then do
    <code>git pull</code>
2. Create a *branch* and *checkout* (because it's just standard industry 
  practice), even if your edit is small. This is because "main" is treated as 
  the stable product that we don't want to mess with unless we're absolutely 
  sure.
3. Make your edits!
  - Use File Explorer/Finder to double-click and open the HTML file to see your 
    changes in a web browser.
4. Git *add*, *commit*, and *push*!
5. Submit pull request. At this stage, your changes will be reviewed and 
  determined if it's acceptable for merging to main.

*Instructions too vague? Someone should change it. Or ask AI to help.*

---

## File Structure 

```
lesson.html          — lesson content and markup
lesson.css           — all styles for the lesson
lesson.js            — all interactive functionality
```

`lesson.html` links to `lesson.css` and `lesson.js`. 

---

## Features Overview

### 1. Progress Bar

This is a sticky bar at the top of the page that fills as the user 
scrolls. It is driven entirely by the scroll position and requires
no changes when editing content.

**Required HTML** (must be present near the top of `<body>`):
```html
<div id="progress-bar-wrap">
  <div id="progress-bar-track">
    <div id="progress-bar-fill"></div>
  </div>
  <div id="progress-label">0% complete</div>
</div>
```

---

### 2. Key Term Tooltips

These are highlighted words that show a floating definition on
hover. Tooltips use fixed positioning so they are never clipped by
surrounding elements like accordions.

**How to add a term:**
```html
<span class="term" tabindex="0">your term
  <span class="term-tooltip">
    Your definition goes here.
  </span>
</span>
```

The `tabindex=0` makes the tooltip keyboard accessible.

**Required HTML** (must be present near the top of `<body>`):
```html
<div id="floating-tooltip"></div>
```

---

### 3. Accordions

These are expandable/collapsible sections for optional or 
supplementary content. You should use these mostly for interactivity, 
but look out for when the design of the lesson makes it easy to 
overlook the accordion.

**How to add an accordion:**
```html
<div class="accordion">
  <button class="accordion-btn" onclick="toggleAccordion(this)">
    <span>Your section title</span>
    <span class="chevron">▼</span>
  </button>
  <div class="accordion-body">
    <div class="accordion-inner">
      Your content here.
    </div>
  </div>
</div>
```

---

### 4. Code Blocks

These are styled code snippets with a copy button. The copy button
uses the browser clipboard API.

**How to add a code block:**
```html
<div class="code-block">
  <div class="code-block-header">
    <span>bash</span>
    <button class="copy-btn"
      onclick="copyCode(this, 'your command here')"
    >Copy</button>
  </div>
  <pre>your command here</pre>
</div>
```

Arguments for `copyCode`:
- `this` is the button itself
- `your command here` should match what's desplayed in the `pre` tag.

---

### 5. Quiz Blocks

These are multiple choice questions with correct/wrong feedback.
Wrong feedback doesn't actually allow for contextual feedback, so 
keep it generic in the wsl.js file. Wrong answers disable only that
button so the user can keep trying. Correct answers lock all buttons
and trigger section unlocking.

Students must answer questions correctly to move onto the next
section.

**Important:**
- Every quiz block must have a unique `id` (e.g. `quiz-1`, `quiz-2`)
- The correct button must have `data-correct="true"` since this will
  be used by the localStorage restore function to re-highlight the 
  right answer on page reload.
- Pass `true` to `checkAnswer` for the correct answer, `false` for
  all others.

**How to add a quiz block:**
```html
<div class="quiz-block" id="quiz-1">
  <h4>✦ Quick Check</h4>
  <p class="quiz-question">Your question here?</p>
  <ul class="quiz-options">
    <li>
      <button onclick="checkAnswer(this, false)">
        Wrong answer
      </button>
    </li>
    <li>
      <button data-correct="true" onclick="checkAnswer(this, true)">
        Correct answer
      </button>
    </li>
  </ul>
  <p class="quiz-feedback">Answer correctly to move on to the 
    next section.
  </p>
</div>
```

---

### 6. Section Locking

Sections can be locked behind quiz completion. Locked sections are
grayed out and unclickable until their required quizzes are answered
correctly. This is mostly for visual scaffolding.

**The first section should not be locked**
```html
<div class="step-section">
```

**How to lock a section:**
```html
<div class="step-section locked" data-requires="quiz-1">
```

**Requiring multiple quizzes** (space-separated):
```html
<div class="step-section locked" data-requires="quiz-2 quiz-3">
```
**One quiz unlocking multiple sections** is handled automatically,
just add `data-requires` to each section that needs that quiz. There
is no `data-unlocks` on quiz blocks; the relationship is always
declared on the section side.

---

### 7. Practice Checklist

A clickable to-do list that lets students tick off tasks as they
complete them. State is not saved, it resets on refresh.

**How to add a checklist:**
```html
<ul class="checklist">
  <li onclick="toggleCheck(this)">
    <span class="check-icon">✓</span>
    Your task description
  </li>
</ul>
```

---

### 8. localStorage / Quiz Persistence

Completed quiz state is saved to `localStorage` so students do not
have to re-answer quizzes on page reload. The restore function runs
automatically on page load.

**Version key** — at the top of `lesson.js`:
```javascript
const QUIZ_VERSION = 'v1';
```

If you ever change the correct answer to a quiz, increment this
(e.g. `'v2'`). This invalidates all previously saved quiz state for
all students, forcing them to re-answer from scratch.

**Reset button** — optionally include a reset button on the page so
students can clear their own progress:
```html
<button class="reset-btn" onclick="resetProgress()">
  Reset Progress
</button>
```

This is located at the top underneath the lesson header. It can also
be placed elsewhere.

---

### 9. Screenshots (Optional)

The CSS includes a `.screenshot-wrap` pattern for adding images to 
the lesson. Ideally, they are embedded with instructions in 
accordions so that they are not visually dominating the text
instructions. 

**How to add a screenshot:**
```html
<div class="screenshot-wrap">
  <img src="your-image.png" alt="description" class="screenshot" />
  <p class="screenshot-caption">Optional caption text</p>
</div>
```

The caption `<p>` is optional and can be omitted.

---

## Using this for a new Lesson Page

Because the interactive functionality lives in `lesson.js`, any new
lesson page can reuse it by:

1. Linking to `lesson.js` and `wsl.css` (or a new CSS file)
2. Including the required HTML for the progress bar and floating
   tooltip (see sections 1 and 2 above)
3. Using the same HTML patterns for quizzes, accordions, code blocks
   etc. as documented above

Note that `localStorage` keys are prefixed with `QUIZ_VERSION`, so
quiz state from one lesson page will not interfere with another as
long as quiz IDs are unique across pages, or each page has its own
version key.

---

## Common Mistakes

- Forgetting `data-correct="true"` on the correct quiz button —
  localStorage restore will not highlight the right answer
- Mismatched IDs between `data-requires` and quiz block `id`
  attributes — unlocking will silently fail
- Changing a correct answer without bumping `QUIZ_VERSION` —
  students with old saved state will see the wrong button highlighted
- The copy button string not matching the `<pre>` content — students
  will copy something different from what they see
- Leaving `locked` on the first section — it will never unlock since
  nothing triggers it