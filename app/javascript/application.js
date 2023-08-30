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
    var modalContent = document.getElementById("modalContent");
    // var pageContainer = document.querySelector(".page-container");


    // STATS MODAL VVVV
    btnStats.onclick = function() {
      modal.style.display = "block";
      const dailyStreak = parseInt(localStorage.getItem("daily_streak")) || 0;
      const starEmoji = dailyStreak >= 3 ? "⭐" : "";
      const streakStartDate = localStorage.getItem("streak_start_date");
      const today = new Date().toISOString().split("T")[0];
      const consecutiveDays = streakStartDate === today ? dailyStreak : 0;
      const correctGuesses = parseInt(localStorage.getItem("correct_guesses")) || 0;
      const totalGuesses = parseInt(localStorage.getItem("total_guesses")) || 0;
      const winPercentage = totalGuesses > 0 ? (correctGuesses / totalGuesses) * 100 : 0;

      modalContent.innerHTML = `Daily Streak: ${starEmoji}<br>`;
      modalContent.innerHTML += `Current Streak: ${consecutiveDays}<br>`;
      modalContent.innerHTML += `Win Percentage: ${winPercentage.toFixed(2)}%`;
    }

    btnInstructions.onclick = function() {
      modal.style.display = "block";
      modalContent.innerHTML = "Stats will go here later";
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


            // SEASON SELECTION LOGIC AND APPEARING HEADER LOGIC

            const headingContainer = document.querySelector(".heading-container");
            const messageContainer = document.getElementById("message-container");
            const welcomeHeader = document.getElementById("welcome-header");
            const formContainer = document.querySelector(".form-container");
            const playerCardContainer = data.querySelector(".player-card-container");
            const correctPlayerCard = data.querySelector(".correct-player-card");

            if (formData.get("season[season]")) {
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
                // storing the total guesses for calculating stats
                const totalGuesses = parseInt(localStorage.getItem("total_guesses")) || 0;
                localStorage.setItem("total_guesses", totalGuesses + 1);
                const playerName = card.dataset.playerName;
                const userGuessCorrect = playerName === correctPlayerName

                localStorage.setItem("user_guess_correct", userGuessCorrect);
                // const userGuess = JSON.parse(localStorage.getItem("user_guess_correct"));


                  const currentDate = new Date().toISOString().split("T")[0];
                  // checking if the user guess is correct and also storing stats for the modal
                  if (userGuessCorrect) {
                    const currentStreak = parseInt(localStorage.getItem("daily_streak")) || 0;
                    const streakStartDate = localStorage.getItem("streak_start_date");
                    if (!streakStartDate || streakStartDate !== currentDate || correctGuesses % 5 === 0) {
                      localStorage.setItem("daily_streak", currentStreak + 1);
                      localStorage.setItem("streak_start_date", currentDate);
                    }

                    const correctGuesses = parseInt(localStorage.getItem("correct_guesses")) || 0;
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
