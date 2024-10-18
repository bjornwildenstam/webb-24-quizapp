const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores
  .map(score => {
    const displayTime = score.time !== undefined ? `${score.time} seconds` : 'N/A'; 
    return `<li class="high-score">${score.name} - Score: ${score.score}, Time: ${displayTime}</li>`;
  })
  .join("");