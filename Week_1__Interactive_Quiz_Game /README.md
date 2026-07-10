# 🎨 Art History Quiz Web Application 

An interactive web application that allows users to test their knowledge about shocking, surprising, and lesser-known facts from art history.

---

##  Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Deployment:** GitHub Pages

---

## Requirements & Features

###  Design & UI
* **Responsiveness:** Fully responsive layout adapted for mobile, tablet, and desktop screens.
* **Interactive States:** Complete styling for different element states (e.g., `hover`, `active`, `disabled`).
* **Pixel-Perfect Implementation:** All sizes, margins, paddings, and layouts follow the provided design specifications exactly.
* **Progress Tracking:** Visual progress bar/line indicating the user's current step in the quiz.

###  JavaScript Functionality
* **Quiz Logic:** Dedicated script handling the core game loop (question switching, score calculation, and state management).
* **Dynamic Validation:** The **"Submit"** button remains `disabled` until the user selects an answer option.
    * Once an option is selected, the "Submit" button becomes `active`.
* **Flow Control:** After clicking "Submit", the correct/incorrect result is revealed, and the **"Next"** button appears to advance the quiz.
* **Score Tracking:** Keeps track of the user's score and displays the final result at the end of the quiz.

### Quiz Data Storage
* **Data Structure:** Questions and answers are stored efficiently within a JavaScript object structure.
* **Content:** Contains exactly **10 distinct questions**, each featuring **4 options**.
* **Replayability:** The order of the questions is randomized on every load to enhance user engagement.
