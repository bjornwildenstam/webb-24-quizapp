const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');


const totalTime = localStorage.getItem('totalTime') || 'N/A'; 
finalScore.innerText = mostRecentScore;


const MAX_HIGH_SCORES = 5;


username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});


saveHighScore = (e) => {
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value,
        time: totalTime 
    };

    const highScores = JSON.parse(localStorage.getItem('highScores')) || []; 
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score || a.time - b.time); 
    highScores.splice(MAX_HIGH_SCORES); 

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('/'); 
};


const timeDisplay = document.getElementById('timeDisplay'); 
if (timeDisplay) {
    timeDisplay.innerText = `Time: ${totalTime} seconds`; 
}


const lastCategory = localStorage.getItem('lastPlayedCategory');
const playAgainBtn = document.querySelector('.btn[href="#"]'); 

if (playAgainBtn) { 
    if (lastCategory === 'sports') {
        playAgainBtn.href = '/sports.html'; 
    } else {
        playAgainBtn.href = '/movies.html'; 
    }
} else {
    console.error('Play Again button not found!');
}
