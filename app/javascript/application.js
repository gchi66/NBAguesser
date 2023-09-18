import "@hotwired/turbo-rails"
import "./controllers"
import "bootstrap"
import Rails from "@rails/ujs"
//= require rails-ujs
//= require turbolinks
//= require_tree .




document.addEventListener("DOMContentLoaded", function(){
  console.log('domcontentloaded')
  // const csrfToken = document.querySelector("meta[name='csrf-token']").content;
  // console.log(csrfToken);

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
        // Reset total guesses and any other relevant counters

        localStorage.setItem("total_daily_guesses", 0);
        // Call any other functions or logic needed for the reset
        // ...

        // Schedule the next reset for the following day
        scheduleResetAtMidnight();
      }, timeUntilMidnight);
    }

    // Initial call to schedule the first reset
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
    console.log('turbo loaded');


    // MODAL LOGIC VVVV

    var modal = document.getElementById("myModal");
    var btnStats = document.getElementById("showStats");
    var btnInstructions = document.getElementById("showInstructions");
    const statsContainer = document.querySelector(".stats-container");
    const instructionsContainer = document.querySelector(".instructions-container");

    // STREAK AND TOTAL GUESSES LOGIC VVVVVVVVVVVVVVVVVV

    const dailyChallengesCompleted = parseInt(localStorage.getItem("daily_challenges_completed")) || 0;
    // initializing the total daily guesses variable
    const totalDailyGuesses = parseInt(localStorage.getItem("total_daily_guesses")) || 0;
    // initializing the total guesses variable
    const totalGuesses = parseInt(localStorage.getItem("total_guesses")) || 0;

    // initializing daily streak
    const dailyStreak = parseInt(localStorage.getItem("daily_streak")) || 0;
    const streakStartDate = localStorage.getItem("streak_start_date");
    const today = new Date().toISOString().split("T")[0];
    // figuring out the current streak
    const consecutiveDays = streakStartDate === today ? dailyStreak : 0;
    // star emoji for each time they've completed a challenge
    const starEmojis = "⭐".repeat(consecutiveDays);
    // calculating win percentage
    const correctGuesses = parseInt(localStorage.getItem("correct_guesses")) || 0;
    // const totalGuesses = parseInt(localStorage.getItem("total_guesses")) || 0;
    const winPercentage = totalGuesses > 0 ? (correctGuesses / totalGuesses) * 100 : 0;

    // setting stats content
    const dailyStreakAlert = document.getElementById("dailyStreakAlert");
    const statsContent = document.getElementById("statsContent");
    const statsContent1 = document.getElementById("statsContent1");
    const statsContent2 = document.getElementById("statsContent2");
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
      instructionsContent1.innerHTML = `Guess 3 players correct out of your 5 daily guesses to earn yourself a ⭐!`;
      instructionsContent2.innerHTML = `How long can you keep your daily streak going for? 🤔`;
      // Set a flag in localStorage to indicate that the modal has been shown
      localStorage.setItem("hasShownModal", "true");
  }

    // POPUP TO DETERMINE IF THEY'VE EARNED THEIR STAR FOR THE DAY
    if (totalDailyGuesses >= 5) {
      if (correctGuesses >=3) {
        modal.style.display = "block";
        instructionsContainer.classList.add("hide-element");
        statsContainer.classList.remove("hide-element");
        dailyStreakAlert.innerHTML = `Congrats, you guessed ${correctGuesses} players correctly and have earned yourself a ⭐. See you tomorrow!`
        statsContent.innerHTML = `Current Streak: (${consecutiveDays})${starEmojis}<br>`
        statsContent1.innerHTML = `Win Percentage: ${winPercentage.toFixed(2)}%`;
        statsContent2.innerHTML =`Total challenges completed: ${dailyChallengesCompleted}`
      }
      else {
        modal.style.display = "block";
        instructionsContainer.classList.add("hide-element");
        statsContainer.classList.remove("hide-element");
        dailyStreakAlert.innerHTML = `So close, but you only got ${correctGuesses} players correct today. Better luck next time!`
        statsContent.innerHTML = `Current Streak: (${consecutiveDays})${starEmojis}<br>`
        statsContent1.innerHTML = `Win Percentage: ${winPercentage.toFixed(2)}%`;
        statsContent2.innerHTML =`Total challenges completed: ${dailyChallengesCompleted}`
      }
    }


    // STATS MODAL VVVV
    btnStats.onclick = function() {
      modal.style.display = "block";
      statsContainer.classList.remove("hide-element");
      instructionsContainer.classList.add("hide-element");
      dailyStreakAlert.classList.add("hide-element");

      // updating the modal content

      statsContent.innerHTML = `Current Streak: (${consecutiveDays})${starEmojis}<br>`
      statsContent1.innerHTML = `Win Percentage: ${winPercentage.toFixed(2)}%`;
      statsContent2.innerHTML =`Total challenges completed: ${dailyChallengesCompleted}`
    }

    // INSTRUCTIONS MODAL VVVV
    btnInstructions.onclick = function() {
      modal.style.display = "block";
      statsContainer.classList.add("hide-element");
      instructionsWelcome.classList.add("hide-element");
      instructionsContainer.classList.remove("hide-element");

      instructionsContent.innerHTML = "Select a season, then guess the NBA player based on the stats provided.";
      instructionsContent1.innerHTML = `Guess 3 players correct out of your 5 daily guesses to earn yourself a ⭐!`;
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


    const seasonForm = document.getElementById("season-form");
    const form = seasonForm ? seasonForm.firstElementChild : null;
    if (form) {
      form.addEventListener("submit", function(event) {
        event.preventDefault();
        console.log("Form submitted via AJAX");

        // limiting the totalDailyGuesses to 5
        const messageContainer = document.getElementById("message-container");


        // ***********************************************************************************

        // MAKE SURE
        // THIS SHIT
        // if (totalDailyGuesses  >= 5) {
        //   messageContainer.innerHTML = `<h4>Out of guesses, try again tomorrow<h4>`;
        //   return;
        // }
        // IS NOT
        // COMMENTED OUT FOR PRODUCTION
        // U BUM



        // **************************************************************************************

        const formData = new FormData(form);

        console.log(formData);

        Rails.ajax({
          type: form.method,
          url: form.action,
          data: formData,
          success: function(data) {
            console.log("ajax successfully fired");


            // SEASON SELECTION LOGIC AND APPEARING HEADER LOGIC

            const landingContainer = document.querySelector(".landing-container");
            const headingContainer = document.querySelector(".heading-container");
            const welcomeHeader = document.getElementById("welcome-header");
            const formContainer = document.querySelector(".form-container");
            const playerCardContainer = data.querySelector(".player-card-container");
            const correctPlayerCard = data.querySelector(".correct-player-card");
            const resultPlayerCard = data.querySelector(".result-player-card");

            if (formData.get("season[season]")) {
              messageContainer.innerHTML = `<h4>Selected season: ${formData.get("season[season]")}</h4>`;
              landingContainer.classList.add("hide-element");
              seasonForm.classList.add("hide-element");
              welcomeHeader.classList.add("hide-element");
              headingContainer.classList.remove("hide-element");
              formContainer.classList.add("hide-element");
            } else {
              messageContainer.innerHTML = `<h4>Please select a season</h4>`;
            }

            // DEFINING THE VARIABLES TO MAKE AJAX WORK VVVVVVVV


            const actualPlayerCardContainer = document.querySelector(".player-card-container");
            actualPlayerCardContainer.classList.remove("hide-element");
            actualPlayerCardContainer.innerHTML = playerCardContainer.innerHTML;

            const actualCorrectPlayerCard = document.querySelector(".correct-player-card");
            actualCorrectPlayerCard.classList.remove("hide-element");
            actualCorrectPlayerCard.innerHTML = correctPlayerCard.innerHTML;

            const correctPlayerInfo = document.querySelector(".correct-player-info");
            const correctPlayerName = correctPlayerInfo.dataset.correctPlayerName;

            const actualPlayerCards = actualPlayerCardContainer.querySelectorAll(".player-card");

            const actualResultPlayerCard = document.querySelector(".result-player-card");
            actualResultPlayerCard.innerHTML = resultPlayerCard.innerHTML;
``
            const resultContainer = document.querySelector(".result-container");
            const pageContainer = document.querySelector(".page-container");
            const resultPageContainer = document.querySelector(".result-page-container");



            // GAME LOGIC VVVVVVVVVV

            actualPlayerCards.forEach(card => {
              card.addEventListener("click", function() {

                const currentDate = new Date().toISOString().split("T")[0];

                // incrementing total daily guesses
                localStorage.setItem("total_daily_guesses", totalDailyGuesses + 1);

                // incrementing total guesses for all time (to caluculate winning %)
                localStorage.setItem("total_guesses", totalGuesses + 1);

                const playerName = card.dataset.playerName;
                const userGuessCorrect = playerName === correctPlayerName

                localStorage.setItem("user_guess_correct", userGuessCorrect);
                // const userGuess = JSON.parse(localStorage.getItem("user_guess_correct"));


                  // checking if the user guess is correct and also storing stats for the modal
                  if (userGuessCorrect) {
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


                    // showing the results stuff
                    // resultContainer.classList.remove("hide-element");
                    pageContainer.classList.add("hide-element");
                    resultContainer.innerHTML = "Nice work hoophead!";
                    resultPageContainer.classList.remove("hide-element");
                    console.log(resultPlayerCard);
                    console.log(actualCorrectPlayerCard);
                    // subheadingContainer.classList.remove("hide-element");
                    // resultPlayerCard.classList.remove("hide-element");
                    // resultButton.classList.remove("hide-element");

                    // hiding everything else on the page


                  } else {
                    // window.location.href = losePageURL;
                    // localStorage.removeItem("daily_streak");
                    // resultContainer.classList.remove("hide-element");
                    pageContainer.classList.add("hide-element");
                    resultContainer.innerHTML = "Close but no cigar.";
                    resultPageContainer.classList.remove("hide-element");
                    // subheadingContainer.classList.remove("hide-element");
                    // resultPlayerCard.classList.remove("hide-element");
                    // resultButton.classList.remove("hide-element");
                  }
              });
            });
          },
          error: function() {
            console.log("AJAX request failed");
          }
        });
      });
    }
  });
});
