// Avsaar Autofill Assistant - Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Avsaar Autofill Assistant extension installed successfully.');
    // We can open the options or popup onboarding page on first install
    chrome.tabs.create({
      url: chrome.runtime.getURL('src/popup/index.html')
    });
  } else if (details.reason === 'update') {
    console.log('Avsaar Autofill Assistant updated to version', chrome.runtime.getManifest().version);
  }
});
