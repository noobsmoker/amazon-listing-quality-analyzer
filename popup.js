// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const scoreDiv = document.getElementById('score');
  const strengthsDiv = document.getElementById('strengths');
  const weaknessesDiv = document.getElementById('weaknesses');

  analyzeBtn.addEventListener('click', async () => {
    // Reset UI
    scoreDiv.textContent = '--';
    strengthsDiv.innerHTML = '';
    weaknessesDiv.innerHTML = '';

    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      scoreDiv.textContent = 'Error: Could not get active tab';
      return;
    }

    // Check if the tab is on an Amazon domain
    const amazonDomains = [
      'www.amazon.com',
      'www.amazon.co.uk',
      'www.amazon.de',
      'www.amazon.fr',
      'www.amazon.co.jp'
    ];
    const url = new URL(tab.url);
    const isAmazon = amazonDomains.includes(url.hostname);

    if (!isAmazon) {
      scoreDiv.textContent = 'Error: Please navigate to an Amazon product page';
      return;
    }

    // Send a message to the content script to analyze the page
    chrome.tabs.sendMessage(tab.id, { action: 'analyzeListing' }, (response) => {
      if (chrome.runtime.lastError) {
        // More detailed error message
        if (chrome.runtime.lastError.message.includes('Could not establish connection. Receiving end does not exist.')) {
          scoreDiv.textContent = 'Error: Content script not loaded. Try reloading the page or extension.';
        } else {
          scoreDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        }
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