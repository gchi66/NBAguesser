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

    // 6 AM LOGIC VVVVVVVV
    function scheduleResetAt6AM() {
      // Calculate the time until the next 6 am
      const now = new Date();
      const sixAM = new Date(now);
      sixAM.setHours(6, 0, 0, 0);

      // If it's already past 6 am, schedule it for tomorrow
      if (now > sixAM) {
        sixAM.setDate(now.getDate() + 1);
      }

      const timeUntil6AM = sixAM - now;

      // reset the guesses at 6am
      setTimeout(function () {
        // Reset total guesses and any other relevant counters
        localStorage.setItem("total_guesses", 0);

        // Call any other functions or logic needed for the reset
        // ...

        // Schedule the next reset for the following day
        scheduleResetAt6AM();
      }, timeUntil6AM);
    }

    // Initial call to schedule the first reset
    scheduleResetAt6AM();


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
    const dailyChallengesCompleted = parseInt(localStorage.getItem("daily_challenges_completed")) || 0;
    // var pageContainer = document.querySelector(".page-container");


    // STATS MODAL VVVV
    btnStats.onclick = function() {
      modal.style.display = "block";
      statsContainer.classList.remove("hide-element");
      instructionsContainer.classList.add("hide-element");
      // star emoji for each time they've completed a challenge
      const starEmoji = "⭐".repeat(dailyChallengesCompleted);
      // initializing daily streak
      const dailyStreak = parseInt(localStorage.getItem("daily_streak")) || 0;
      const streakStartDate = localStorage.getItem("streak_start_date");
      const today = new Date().toISOString().split("T")[0];
      // figuring out the current streak
      const consecutiveDays = streakStartDate === today ? dailyStreak : 0;
      // calculating win percentage
      const correctGuesses = parseInt(localStorage.getItem("correct_guesses")) || 0;
      const totalGuesses = parseInt(localStorage.getItem("total_guesses")) || 0;
      const winPercentage = totalGuesses > 0 ? (correctGuesses / totalGuesses) * 100 : 0;

      // updating the modal content
      const statsContent = document.getElementById("statsContent");
      const statsContent1 = document.getElementById("statsContent1");
      const statsContent2 = document.getElementById("statsContent2");

      statsContent.innerHTML = `Daily Challenges Completed: ${starEmoji}<br>`;
      statsContent1.innerHTML = `Current Streak: ${consecutiveDays}<br>`;
      statsContent2.innerHTML = `Win Percentage: ${winPercentage.toFixed(2)}%`;
    }

    btnInstructions.onclick = function() {
      modal.style.display = "block";
      statsContainer.classList.add("hide-element");
      instructionsContainer.classList.remove("hide-element");
      const starEmoji = "⭐"

      const instructionsContent = document.getElementById("instructionsContent");
      const instructionsContent1 = document.getElementById("instructionsContent1");
      const instructionsContent2 = document.getElementById("instructionsContent2");

      instructionsContent.innerHTML = "Select a season, then guess the NBA player based on the stats provided.<br>";
      instructionsContent1.innerHTML = `Each day you can try to guess 5 players. Get 3/5 correct and you'll have completed the daily challenge and earned yourself a ${starEmoji}!<br>`;
      instructionsContent2.innerHTML = `Complete the daily challenge and get a ${starEmoji} everyday to keep your daily streak going!<br>`;
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

        const formData = new FormData(form);

        console.log(formData);

        Rails.ajax({
          type: form.method,
          url: form.action,
          data: formData,
          success: function(data) {
            console.log("ajax successfully fired");


            // initializing the total guesses variable
            const totalGuesses = parseInt(localStorage.getItem("total_guesses")) || 0;

            // Checking if the user has exceeded the daily limit of 5 guesses
            // if (totalGuesses >= 5) {
            //   // TODO IMPLEMENT LOGIC FOR GOING TO THE "EXCEEDED DAILY GUESSES PAGE"
            //   // window.location.href = LimitPageURL;
            //   return; // Exit the function, no further processing
            // }
            // SEASON SELECTION LOGIC AND APPEARING HEADER LOGIC

            const headingContainer = document.querySelector(".heading-container");
            const messageContainer = document.getElementById("message-container");
            const welcomeHeader = document.getElementById("welcome-header");
            const formContainer = document.querySelector(".form-container");
            const playerCardContainer = data.querySelector(".player-card-container");
            const correctPlayerCard = data.querySelector(".correct-player-card");

            if (totalGuesses  >= 5) {
              messageContainer.innerHTML = "Out of guesses, try again tomorrow"
            }
            else if (formData.get("season[season]")) {
              messageContainer.innerHTML = `<h4>Selected season: ${formData.get("season[season]")}</h4>`;
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

            // GAME LOGIC VVVVVVVVVV

            actualPlayerCards.forEach(card => {
              card.addEventListener("click", function() {

                const currentDate = new Date().toISOString().split("T")[0];

                // incrementing total guesses
                localStorage.setItem("total_guesses", totalGuesses + 1);

                const playerName = card.dataset.playerName;
                const userGuessCorrect = playerName === correctPlayerName

                localStorage.setItem("user_guess_correct", userGuessCorrect);
                // const userGuess = JSON.parse(localStorage.getItem("user_guess_correct"));


                  // checking if the user guess is correct and also storing stats for the modal
                  if (userGuessCorrect) {
                    const currentStreak = parseInt(localStorage.getItem("daily_streak")) || 0;
                    const correctGuesses = parseInt(localStorage.getItem("correct_guesses")) || 0;

                    // user must get 3/5 guesses correct
                    if (correctGuesses % 5 === 2) {
                      localStorage.setItem("daily_streak", currentStreak + 1);
                      localStorage.setItem("streak_start_date", currentDate);
                    }
                    // incrementing daily challenges
                    localStorage.setItem("daily_challenges_completed", dailyChallengesCompleted + 1);

                    // incrementing correct guesses count
                    localStorage.setItem("correct_guesses", correctGuesses + 1);
                    window.location.href = winPageURL;

                  } else {
                    window.location.href = losePageURL;
                    localStorage.removeItem("daily_streak");
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
