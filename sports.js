const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const timeText = document.getElementById('time'); 


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
let timeLeft = 10;
let timer;

function decodeHTMLEntities(text) {
    const tempElement = document.createElement('textarea');
    tempElement.innerHTML = text;
    return tempElement.value;
}


fetch(
    'https://opentdb.com/api.php?amount=5&category=21&difficulty=easy&type=multiple'
)
.then((res) => res.json())
.then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: decodeHTMLEntities(loadedQuestion.question),
            };
            
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );
            
            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = decodeHTMLEntities(choice);
            });
            
            return formattedQuestion;
        });
        
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });
    
   
    const CORRECT_BONUS = 10;
    const MAX_QUESTIONS = 5;
    
   
    let startTime, endTime;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    startTime = performance.now(); 
    localStorage.setItem("lastPlayedCategory", "sports");
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};


getNewQuestion = () => {
    clearInterval(timer); 
    resetTimer(); 

    choices.forEach((choice) => {
        choice.parentElement.classList.remove('correct');
        choice.parentElement.classList.remove('incorrect');
    });

    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        endTime = performance.now(); 
        const totalTime = ((endTime - startTime) / 1000).toFixed(2); 

        saveBestTime(totalTime); 
        localStorage.setItem('totalTime', totalTime); 
        localStorage.setItem('mostRecentScore', score);
        
        
        return window.location.assign(`/end.html`);
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;

    
    startTimer();
};


choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        clearInterval(timer); 

        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        } else {
            const correctChoice = choices.find(choice => choice.dataset['number'] == currentQuestion.answer);
            correctChoice.parentElement.classList.add('correct');
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});


incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};


function startTimer() {
    timeLeft = 15;
    timeText.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timeText.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            
            handleTimeout();
        }
    }, 1000); 
}

function resetTimer() {
    timeLeft = 15;
    timeText.innerText = timeLeft;
}

function handleTimeout() {
    acceptingAnswers = false;

    
    choices.forEach(choice => {
        const choiceNumber = choice.dataset['number'];
        if (choiceNumber == currentQuestion.answer) {
            choice.parentElement.classList.add('correct'); 
        } else {
            choice.parentElement.classList.add('incorrect'); 
        }
    });

    setTimeout(() => {
        
        choices.forEach(choice => {
            choice.parentElement.classList.remove('correct');
            choice.parentElement.classList.remove('incorrect');
        });



        getNewQuestion();
    }, 1000);
}


function saveBestTime(totalTime) {
    const previousBestTime = localStorage.getItem('bestTime');
    
    if (!previousBestTime || totalTime < previousBestTime) {
        localStorage.setItem('bestTime', totalTime);
    }
}
