// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const scoreDiv = document.getElementById('score');
  const strengthsDiv = document.getElementById('strengths');
  const weaknessesDiv = document.getElementById('weaknesses');

  analyzeBtn.addEventListener('click', async () => {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    // Send a message to the content script to analyze the page
    chrome.tabs.sendMessage(tab.id, { action: 'analyzeListing' }, (response) => {
      if (chrome.runtime.lastError) {
        scoreDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }
      if (response) {
        scoreDiv.textContent = `Score: ${response.score.toFixed(1)}/10`;
        strengthsDiv.innerHTML = response.strengths.map(s => `<li>${s}</li>`).join('');
        weaknessesDiv.innerHTML = response.weaknesses.map(w => `<li>${w}</li>`).join('');
      }
    });
  });
});