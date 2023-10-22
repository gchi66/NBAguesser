//= require turbolinks
//= require turbo-rails
//= require turbolinks-compatibility
//= require rails-ujs
//= require_tree .
import "@hotwired/turbo-rails"
import "./controllers"
import "bootstrap"
import Rails from "@rails/ujs"




// MODAL LOGIC VVVV

var modal = document.getElementById("myModal");
var btnStats = document.getElementById("showStats");
var btnInstructions = document.getElementById("showInstructions");
const statsContainer = document.querySelector(".stats-container");
const instructionsContainer = document.querySelector(".instructions-container");

// STREAK AND TOTAL GUESSES LOGIC VVVVVVVVVVVVVVVVVV

const dailyChallengesCompleted = parseInt(localStorage.getItem("daily_challenges_completed")) || 0;
const totalDailyGuesses = parseInt(localStorage.getItem("total_daily_guesses")) || 0;
const totalGuesses = parseInt(localStorage.getItem("total_guesses")) || 0;


function calculateConsecutiveDays(){
  // initializing daily streak
  let consecutiveDays = 0;
  const dailyStreak = parseInt(localStorage.getItem("daily_streak")) || 0;
  const streakStartDate = localStorage.getItem("streak_start_date");
  const today = new Date().toISOString().split("T")[0];
  // figuring out the current streak
  consecutiveDays = streakStartDate === today ? dailyStreak : 0;
  return consecutiveDays;
}

// LOCAL STORAGE FUNCTIONS
function updateLocalGuessValues() {
  const totalDailyGuesses = parseInt(localStorage.getItem("total_daily_guesses")) || 0;
  localStorage.setItem("total_daily_guesses", totalDailyGuesses + 1);
  // console.log(`Daily guesses after function: ${totalDailyGuesses}`)
  const totalGuesses = parseInt(localStorage.getItem("total_guesses")) || 0;
  localStorage.setItem("total_guesses", totalGuesses + 1);
  // console.log(`Total Guesses after function ${totalGuesses}`);
}

function updateStreakAndCorrectGuesses() {
  const currentDate = new Date().toISOString().split("T")[0];
  const currentStreak = parseInt(localStorage.getItem("daily_streak")) || 0;
  const correctGuesses = parseInt(localStorage.getItem("correct_guesses")) || 0;
  const streakStartDate = localStorage.getItem("streak_start_date");

  // user must get 3/5 guesses correct
  if (correctGuesses % 5 === 2) {
    localStorage.setItem("daily_streak", currentStreak + 1);
    // incrementing daily challenges
    localStorage.setItem("daily_challenges_completed", dailyChallengesCompleted + 1);
    if (!streakStartDate) {
      localStorage.setItem("streak_start_date", currentDate);
    }
  }
  // incrementing correct guesses count
  localStorage.setItem("correct_guesses", correctGuesses + 1);
  return correctGuesses;
}


// setting stats content/social media
const dailyStreakAlert = document.getElementById("dailyStreakAlert");
const statsContent = document.getElementById("statsContent");
const statsContent1 = document.getElementById("statsContent1");
const statsContent2 = document.getElementById("statsContent2");
const shareHeader =  document.getElementById("share-header");
const shareButtonsContainer = document.getElementById("share-buttons-container");
const shareButtonX = document.getElementById("x-share-button");
const shareButtonWa = document.getElementById("wa-share-button");

// twitter sharing message
shareButtonX.onclick = function shareOnTwitter() {
  let correctGuesses = updateStreakAndCorrectGuesses();
  let consecutiveDays = calculateConsecutiveDays();
  const message = `I got my 🏀 from NBA guesser today with ${correctGuesses === 1 ? '1 guess' : `${correctGuesses}/5 guesses`} correct and a streak of ${consecutiveDays === 1 ? '1 day' : `${consecutiveDays} days`}!`;
  const encodedMessage = encodeURIComponent(message);
  const twitterIntentURL = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
  window.open(twitterIntentURL, "_blank");
}

// Whatsapp sharing message
shareButtonWa.onclick = function shareOnWhatsapp() {
  let correctGuesses = updateStreakAndCorrectGuesses();
  let consecutiveDays = calculateConsecutiveDays();
  const message = `I got my 🏀 from NBA guesser today with ${correctGuesses === 1 ? '1 guess' : `${correctGuesses}/5 guesses`} correct and a streak of ${consecutiveDays === 1 ? '1 day' : `${consecutiveDays} days`}!`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappShareURL = `whatsapp://send?text=${encodedMessage}`;
  window.open(whatsappShareURL, "_blank");
};


// setting instructions content
const instructionsWelcome = document.getElementById("instructionsWelcome");
const instructionsContent = document.getElementById("instructionsContent");
const instructionsContent1 = document.getElementById("instructionsContent1");
const instructionsContent2 = document.getElementById("instructionsContent2");


// INSTRUCTIONS MODAL ON STARTUP
const hasShownModal = localStorage.getItem("hasShownModal");

if (!hasShownModal) {
  modal.style.display = "block";
  statsContainer.classList.add("hide-element");
  instructionsContainer.classList.remove("hide-element");
  instructionsWelcome.innerHTML = "Welcome to NBA Guesser!"
  instructionsContent.innerHTML = "Select a season, then guess the NBA player based on the stats provided.";
  instructionsContent1.innerHTML = `Each day you can guess up to 5 players. Guess at least 3 correctly and earn yourself a 🏀!`;
  instructionsContent2.innerHTML = `How long can you keep your daily streak going for? 🤔`;
  // Set a flag in localStorage to indicate that the modal has been shown
  localStorage.setItem("hasShownModal", "true");
}

// STATS MODAL VVVV
btnStats.onclick = function() {
  modal.style.display = "block";
  statsContainer.classList.remove("hide-element");
  instructionsContainer.classList.add("hide-element");
  dailyStreakAlert.classList.add("hide-element");
  let consecutiveDays = calculateConsecutiveDays();
  // bball emoji for each time they've completed a challenge
  const bballEmojis = "🏀".repeat(consecutiveDays);
  // calculating win percentage
  const correctGuesses = parseInt(localStorage.getItem("correct_guesses")) || 0;
  // const totalGuesses = parseInt(localStorage.getItem("total_guesses")) || 0;
  const winPercentage = totalGuesses > 0 ? (correctGuesses / totalGuesses) * 100 : 0;
  // updating the modal content
  statsContent.innerHTML = `Current Streak: (${consecutiveDays})${bballEmojis}<br>`
  statsContent1.innerHTML = `Win Percentage: ${winPercentage.toFixed(2)}%`;
  statsContent2.innerHTML = `Total challenges completed: ${dailyChallengesCompleted}`
  if (totalDailyGuesses >= 5) {
    if (correctGuesses >= 3) {
      shareButtonsContainer.classList.remove("hide-element");
      shareHeader.classList.remove("hide-element");
    }
  }
}

// INSTRUCTIONS MODAL VVVV
btnInstructions.onclick = function() {
  modal.style.display = "block";
  statsContainer.classList.add("hide-element");
  instructionsWelcome.classList.add("hide-element");
  instructionsContainer.classList.remove("hide-element");

  instructionsContent.innerHTML = "Select a season, then guess the NBA player based on the stats provided.";
  instructionsContent1.innerHTML = `Each day you can guess up to 5 players. Guess at least 3 correctly and earn yourself a 🏀!`;
  instructionsContent2.innerHTML = `How long can you keep your daily streak going for? 🤔`;
}

var closeBtn = document.getElementsByClassName("close")[0];

closeBtn.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event){
  event.preventDefault;
  if (event.target === modal) {
    modal.style.display = "none";
  }
}


// landing page variables
const seasonForm = document.getElementById("season-form");
const form = seasonForm ? seasonForm.firstElementChild : null;
const playButton = document.getElementById("play-button");
const loader = document.querySelector(".loader-wrapper");
const landingContainer = document.querySelector(".landing-container");


// Doing things when the landing containers class is changed.
function handleClassChange(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      const isHideElementRemoved = !landingContainer.classList.contains("hide-element");
      if (isHideElementRemoved) {
        popup();
      }
    }
  }
}
const observerConfig = { attributes: true, attributeFilter: ["class"] };
const observer = new MutationObserver(handleClassChange);
observer.observe(landingContainer, observerConfig);

// POPUP TO DETERMINE IF THEY'VE EARNED THEIR STAR FOR THE DAY
function popup() {
  const totalDailyGuesses = parseInt(localStorage.getItem("total_daily_guesses")) || 0;
  const correctGuesses = parseInt(localStorage.getItem("correct_guesses")) || 0;
  let consecutiveDays = calculateConsecutiveDays();
  // bball emoji for each time they've completed a challenge
  const bballEmojis = "🏀".repeat(consecutiveDays);
  // calculating win percentage
  const winPercentage = totalGuesses > 0 ? (correctGuesses / totalGuesses) * 100 : 0;
  if (totalDailyGuesses >= 5) {
    if (correctGuesses >=3) {
      modal.style.display = "block";
      instructionsContainer.classList.add("hide-element");
      statsContainer.classList.remove("hide-element");
      dailyStreakAlert.classList.remove("hide-element");
      dailyStreakAlert.innerHTML = `Congrats, you guessed ${correctGuesses} players correctly and have earned yourself a 🏀. See you tomorrow!`
      statsContent.innerHTML = `Current Streak: (${consecutiveDays})${bballEmojis}<br>`
      statsContent1.innerHTML = `Win Percentage: ${winPercentage.toFixed(2)}%`;
      statsContent2.innerHTML =`Total challenges completed: ${dailyChallengesCompleted}`
      shareButtonsContainer.classList.remove("hide-element");
      shareHeader.classList.remove("hide-element");
    }
    else {
      modal.style.display = "block";
      instructionsContainer.classList.add("hide-element");
      statsContainer.classList.remove("hide-element");
      dailyStreakAlert.classList.remove("hide-element");
      dailyStreakAlert.innerHTML = `So close, but you only got ${correctGuesses} players correct today. Better luck next time!`
      statsContent.innerHTML = `Current Streak: (${consecutiveDays})${starEmojis}<br>`
      statsContent1.innerHTML = `Win Percentage: ${winPercentage.toFixed(2)}%`;
      statsContent2.innerHTML =`Total challenges completed: ${dailyChallengesCompleted}`
    }
  }
}
popup();

document.addEventListener("DOMContentLoaded", function(){
  // console.log('domcontentloaded');

    // MIDNIGHT LOGIC VVVVVVVV
    function scheduleResetAtMidnight() {
      // Calculate the time until the next midnight
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      // If it's already past midnight schedule it for tomorrow
      if (now > midnight) {
        midnight.setDate(now.getDate() + 1);
      }
      const timeUntilMidnight = midnight - now;
      // reset the guesses at midnight
      setTimeout(function () {
        // Reset total daily guesses
        localStorage.setItem("total_daily_guesses", 0);
        scheduleResetAtMidnight();
      }, timeUntilMidnight);
    }
    scheduleResetAtMidnight();

  // GENERATING UNIQUE DEVICE ID BASED ON TIMESTAMP
  function generateDeviceId() {
    const userAgent = window.navigator.userAgent;
    const timestamp = new Date().getTime();
    return `${userAgent}_${timestamp}`;
  }
  // checking to see if the device id exists within localStorage
  let deviceId = localStorage.getItem("device_id");
  // making a new one if not
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem("device_id", deviceId);
  }

  // AJAX LOGIC VVVV
  document.addEventListener("turbo:load", function() {
    // console.log('turbo loaded');
    if (form) {
      form.addEventListener("submit", function(event) {
        event.preventDefault();
        const messageContainer = document.getElementById("message-container");
        const totalDailyGuesses = parseInt(localStorage.getItem("total_daily_guesses")) || 0;

        // disabling the play button until content is loaded.
        playButton.disabled = true;

        // displaying the loader after clicking play
        if (totalDailyGuesses < 5) {
          loader.classList.remove("hide-element");
          landingContainer.classList.add("hide-element");
          messageContainer.classList.add("hide-element");
        }

        // limiting the totalDailyGuesses to 5
        if (totalDailyGuesses  >= 5) {
          // updating the message container if they try to play
          messageContainer.innerHTML = `<h4>Out of guesses, try again tomorrow<h4>`;
          return;
        }

        // AJAX CALL ON FORM SUBMISSION
        const formData = new FormData(form);
        Rails.ajax({
          type: form.method,
          url: form.action,
          data: formData,
          success: function(data) {
            // console.log("ajax successfully fired");
            // SEASON SELECTION LOGIC AND APPEARING HEADER LOGIC
            const headingContainer = document.querySelector(".heading-container");
            const playerCardContainer = data.querySelector(".player-card-container");
            const correctPlayerCard = data.querySelector(".correct-player-card");
            const resultPlayerCard = data.querySelector(".result-player-card");

            if (formData.get("season[season]")) {
              const currentYearString = formData.get("season[season]");
              const currentYear = parseInt(currentYearString, 10);
              const previousYear = currentYear - 1;
              const seasonText = `in the ${previousYear}-${currentYear} season?`;
              headingContainer.classList.remove("hide-element");
              headingContainer.innerHTML = `<h2>${seasonText}</h2>`;
              loader.classList.add("hide-element");
            } else {
              messageContainer.classList.remove("hide-element");
              messageContainer.innerHTML = `<h4>Please select a season</h4>`;
              landingContainer.classList.remove("hide-element");
              playButton.disabled = false;
              loader.classList.add("hide-element");
            }

            // AJAX replaced elements after data scraping
            const actualPlayerCardContainer = document.querySelector(".player-card-container");
            const actualCorrectPlayerCard = document.querySelector(".correct-player-card");
            actualPlayerCardContainer.classList.remove("hide-element");
            actualPlayerCardContainer.innerHTML = playerCardContainer.innerHTML;
            const actualPlayerCards = actualPlayerCardContainer.querySelectorAll(".player-card");
            const actualResultPlayerCard = document.querySelector(".result-player-card");
            actualCorrectPlayerCard.classList.remove("hide-element");
            actualCorrectPlayerCard.innerHTML = correctPlayerCard.innerHTML;
            actualResultPlayerCard.innerHTML = resultPlayerCard.innerHTML;
            const correctPlayerInfo = document.querySelector(".correct-player-info");
            const correctPlayerName = correctPlayerInfo.dataset.correctPlayerName;

            const resultContainer = document.querySelector(".result-container");
            const pageContainer = document.querySelector(".page-container");
            const resultPageContainer = document.querySelector(".result-page-container");
            const pageContainerTwo = document.querySelector(".page-container-two");
            const tryAgainButton = document.getElementById("try-again-button");

            // function to reset to the main page
            function resetGame() {
              form.reset();
              tryAgainButton.removeEventListener("click", resetGame);
              pageContainerTwo.classList.add("hide-element");
              actualPlayerCardContainer.classList.add("hide-element");
              actualCorrectPlayerCard.classList.add("hide-element");
              headingContainer.classList.add("hide-element");
              pageContainer.classList.remove("hide-element");
              landingContainer.classList.remove("hide-element");
              // Unloading unused player cards function
            }
            // re-enabling the play button for next time
            playButton.disabled = false;
            // attaching the event listener to the try again button
            tryAgainButton.addEventListener("click", resetGame);

            // GAME LOGIC VVVVVVVVVV
            actualPlayerCards.forEach(card => {
              card.addEventListener("click", function() {
                const playerName = card.dataset.playerName;
                const userGuessCorrect = playerName === correctPlayerName
                localStorage.setItem("user_guess_correct", userGuessCorrect);
                updateLocalGuessValues();

                // checking if the user guess is correct and also storing stats for the modal
                if (userGuessCorrect) {
                    updateStreakAndCorrectGuesses();
                    pageContainer.classList.add("hide-element");
                    resultContainer.innerHTML = "<h1>Nice work hoophead!</h1>";
                    resultPageContainer.classList.remove("hide-element");
                    pageContainerTwo.classList.remove("hide-element");
                  } else {
                    pageContainer.classList.add("hide-element");
                    pageContainerTwo.classList.remove("hide-element");
                    resultContainer.innerHTML = "<h1>Not quite! Better luck next time.</h1>";
                    resultPageContainer.classList.remove("hide-element");
                    pageContainerTwo.classList.remove("hide-element");
                  }
              });
            });
          },
          error: function() {
            console.log("AJAX request failed");
            playButton.disabled = false;
            window.location.href = "/";
            const messageContainer = document.getElementById("message-container");
            messageContainer.innerHTML = "<p>Oops! Something went wrong. Give it another try.</p>";
          }
        });
      });
    }
  });
});
