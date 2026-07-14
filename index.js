const quizData = [
    {
        id: 1,
        question: "Which famous artist cut off part of his own ear during a mental health crisis?",
        options: [
            "Paul Gauguin",
            "Vincent van Gogh",
            "Edvard Munch",
            "Henri Matisse"
        ],
        correctAnswer: "Vincent van Gogh"
    },
    {
        id: 2,
        question: "The Mona Lisa became world-famous largely because of what event in 1911?",
        options: [
            "It was damaged by a vandal",
            "It was stolen from the Louvre",
            "It was sold at auction for a record price",
            "Da Vinci's diary about it was discovered"
        ],
        correctAnswer: "It was stolen from the Louvre"
    },
    {
        id: 3,
        question: "Caravaggio, one of the greatest Baroque painters, had to flee Rome after doing what?",
        options: [
            "Forging another artist's work",
            "Killing a man in a fight",
            "Insulting the Pope publicly",
            "Stealing from a cathedral"
        ],
        correctAnswer: "Killing a man in a fight"
    },
    {
        id: 4,
        question: "Artist Artemisia Gentileschi's early life and work were shaped by what traumatic event, which she also testified about under torture?",
        options: [
            "Being kidnapped by pirates",
            "Being raped by her painting tutor",
            "Surviving a shipwreck",
            "Stealing food for her family"
        ],
        correctAnswer: "Being raped by her painting tutor"
    },
    {
        id: 5,
        question: "Which famous sculptor believed he could see finished sculptures \"trapped\" inside a block of marble before he even began working?",
        options: [
            "Gian Lorenzo Bernini",
            "Michelangelo",
            "Auguste Rodin",
            "Donatello"
        ],
        correctAnswer: "Michelangelo"
    },
    {
        id: 6,
        question: "What did artist Han van Meegeren do to prove the judge wrong during his 1945 treason trial, where he was accused of selling a national treasure (Johannes Vermeer's work) to the Nazis?",
        options: [
            "He confessed to being an Allied Powers spy",
            "He painted a new \"Vermeer\" in front of the authorities in the exact style of the sold piece, proving that he was its author",
            "He brought the real, original painting into the courtroom to show the sold one was a fake",
            "He showed a secret receipt signed by Adolf Hitler proving it was a trade"
        ],
        correctAnswer:  "He painted a new \"Vermeer\" in front of the authorities in the exact style of the sold piece, proving that he was its author"
    },
    {
        id: 7,
        question: "Banksy shocked the art world in 2018 by rigging a painting to do what immediately after it sold at auction for over $1 million?",
        options: [
            "Burst into flames completely",
            "Self-destruct by shredding itself inside the frame",
            "Reveal a hidden message insulting the buyer",
            "Release smoke that damaged nearby artwork"
        ],
        correctAnswer: "Self-destruct by shredding itself inside the frame"
    },
    {
        id: 8,
        question: "Which famous fresco was nearly destroyed by Allied bombing in WWII and had to be painstakingly restored?",
        options: [
            "The Sistine Chapel ceiling",
            "The Last Supper in Santa Maria delle Grazie",
            "The School of Athens",
            "The Scrovegni Chapel walls"
        ],
        correctAnswer: "The Last Supper in Santa Maria delle Grazie"
    },
    {
        id: 9,
        question: "Which color was once considered so expensive that only royalty and wealthy patrons could afford it in paintings?",
        options: [
            "Emerald Green",
            "Crimson Red",
            "Ultramarine Blue",
            "Burnt Orange"
        ],
        correctAnswer: "Ultramarine Blue"
    },
    {
        id: 10,
        question: "Michelangelo and Leonardo da Vinci were commissioned to paint frescoes in the same room (the Hall of the Five Hundred) in what was meant to be a legendary artistic duel. Why were neither of the works completed?",
        options: [
            "Leonardo experimented too much with his paint formulas and used fire to dry them, which destroyed his initial work. Seeing this, Michelangelo refused to work under such difficult conditions",
            "Michelangelo received the commission for the statue of David and could not finish his fresco, and Leonardo refused to continue working without him",
            "The artists refused to be compared to one another and openly rejected the competition",
            "War broke out between the Pope and Florence, forcing both painters to go into hiding"
        ],
        correctAnswer: "Leonardo experimented too much with his paint formulas and used fire to dry them, which destroyed his initial work. Seeing this, Michelangelo refused to work under such difficult conditions"
    }
];

const defaultOrder = [...Array(quizData.length)].map((_, i) => i + 1);
let currentQuestionsOrder = [];
let currentQuestionNumber = 1;
let currentPointCount = 0;
let currentQuestion;
let currentOption;

function shuffleArray(array) {
    for (let i = array.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function resetQuiz() {
    currentQuestionsOrder = shuffleArray([...defaultOrder]);
    currentQuestionNumber = 1;
    currentPointCount = 0;
    currentQuestion = undefined;
}

function getQuestionById(id) {
    return quizData.find(q => q.id === id);
}

function selectOption(button, option) {
    const buttons = document.querySelectorAll("#choices .button");
    buttons.forEach(button => {
        button.classList.remove("selected");
    })

    currentOption = option;
    const submitBtn = document.getElementById("submitButton");
    submitBtn.disabled = false;
    button.classList.add("selected")
}

function finishQuiz() {
    document.getElementById("quizScreen").style.display = "none";
    document.getElementById("finalScreen").style.display = "flex";
    document.getElementById("points").textContent = "Your score is " + currentPointCount + "!"
}

function submitOption() {
    const selectedButton = document.querySelector("#choices .button.selected");
    const allButtons = document.querySelectorAll("#choices .button");
    const submitBtn = document.getElementById("submitButton");
    const nextBtn = document.getElementById("nextButton");

    if (!selectedButton) return;

    if (currentOption === currentQuestion.correctAnswer) {
        currentPointCount++;
    } else {
        selectedButton.classList.add("wrong");
    }

    allButtons.forEach(button => {
        if (button.textContent === currentQuestion.correctAnswer) {
            button.classList.add("correct");
        }
    })

    submitBtn.style.display = "none";
    nextBtn.style.display = "flex";

    const buttons = document.querySelectorAll("#choices .button");
    buttons.forEach(button => {
        button.disabled = true;
    })
}


function showQuestion() {
    const submitBtn = document.getElementById("submitButton");
    const nextBtn = document.getElementById("nextButton");

    submitBtn.style.display = "block";
    submitBtn.disabled = true;
    if (nextBtn) {
        nextBtn.style.display = "none";
    }

    const steps = document.querySelectorAll(".stepper-container .step");

    steps.forEach((step, index) => {
        const questionNumber = index + 1;
        step.classList.remove("completed", "active");

        if (questionNumber < currentQuestionNumber) {
            step.classList.add("completed");
        } else if (questionNumber === currentQuestionNumber) {
            step.classList.add("active");
        }
    });

    document.getElementById("question").textContent = currentQuestion.question;

    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";
    const options = shuffleArray([...currentQuestion.options]);

    options.forEach((option, index) => {
        const button = document.createElement("button");
        button.classList.add("button");
        button.textContent = option;
        button.id = `option-${index}`;
        button.addEventListener("click", () => {
            selectOption(button, option);
        });
        choicesDiv.appendChild(button);
    });
}

function fetchCurrentQuestion() {
    return getQuestionById(currentQuestionsOrder[currentQuestionNumber - 1]);
}

function startQuiz() {
    resetQuiz();
    currentQuestion = fetchCurrentQuestion();

    document.getElementById("finalScreen").style.display = "none";
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("quizScreen").style.display = "flex";

    const stepperContainerDiv = document.querySelector(".stepper-container");

    if (stepperContainerDiv) {
        const oldSteps = stepperContainerDiv.querySelectorAll(".step");
        oldSteps.forEach(step => step.remove());

        defaultOrder.forEach(q => {
            const number = document.createElement("div");
            number.classList.add("step");
            number.textContent = q;
            stepperContainerDiv.appendChild(number);
        });
    }

    showQuestion();
}

document.getElementById("startButton").addEventListener("click", startQuiz);
document.getElementById("restartButton").addEventListener("click", startQuiz);
document.getElementById("submitButton").addEventListener("click", submitOption);
document.getElementById("nextButton").addEventListener("click", () => {
    currentQuestionNumber++;
    currentQuestion = fetchCurrentQuestion();
    if (currentQuestionNumber !== quizData.length + 1) {
        showQuestion();
    } else {
        finishQuiz();
    }
});



