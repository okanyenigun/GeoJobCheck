// Description: This script is injected into the LinkedIn job application page to alert the user if the job has location restrictions.

// Configuration object to store constants
const CONFIG = {
  locationRestrictionSelector: "h2.fit-content-width.text-body-medium",
  restrictionMsg: "Your location does not match country requirements",
  alertMessage:
    "Warning: This job has location restrictions that prevent you from applying.",
};

let alertTriggered = false; // Flag to prevent multiple alerts
let mutationTimeout = null; // Timeout ID for debouncing

/*
 * Function to check for the location restriction element and alert the user
 * @param {MutationObserver} observer - The observer instance to disconnect when the alert is triggered
 * @returns {void}
 */
function checkForLocationRestriction(observer) {
  if (alertTriggered) return; // Exit if the alert has already been triggered

  const restrictionElement = document.querySelector(
    CONFIG.locationRestrictionSelector
  );
  if (restrictionElement) {
    const restrictionElText = restrictionElement.textContent.trim();
    if (restrictionElText.includes(CONFIG.restrictionMsg)) {
      alert(CONFIG.alertMessage);
      alertTriggered = true; // Set the flag to prevent further alerts
      observer.disconnect();
    }
  }
}

/*
 * Function to handle mutations and debounce the check for location restrictions
 * @param {MutationObserver} observer - The observer instance to disconnect when the alert is triggered
 * @returns {void}
 */
function handleMutations(observer) {
  if (mutationTimeout) {
    clearTimeout(mutationTimeout); // Clear the previous timeout if a new mutation occurs
  }

  // Set a new timeout to check for location restrictions after 500ms
  mutationTimeout = setTimeout(() => {
    checkForLocationRestriction(observer);
  }, 500);
}

/*
 * Function to observe changes in the page content
 * @returns {void}
 */
function observePage() {
  alertTriggered = false; // Reset the alert flag for new content
  const observer = new MutationObserver(() => {
    handleMutations(observer);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  checkForLocationRestriction(observer);
}

// Initial setup to observe the page
observePage();

// Monitor URL changes in the SPA to re-trigger the observer when navigating to a new job ad
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    observePage();
  }
}).observe(document.body, { childList: true, subtree: true });
