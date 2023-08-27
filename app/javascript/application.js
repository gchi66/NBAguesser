import "@hotwired/turbo-rails"
import "./controllers"
import "bootstrap"
import Rails from "@rails/ujs"
//= require rails-ujs
//= require turbolinks
//= require_tree .




document.addEventListener("DOMContentLoaded", function(){
  console.log('domcontentloaded')
  const csrfToken = document.querySelector("meta[name='csrf-token']").content;
  console.log(csrfToken);

  // AJAX LOGIC VVVV

  document.addEventListener("turbo:load", function() {
    console.log('turbo loaded');
    // MODAL LOGIC VVVV

    var modal = document.getElementById("myModal");
    var btnStats = document.getElementById("showStats");
    var btnInstructions = document.getElementById("showInstructions");
    var modalContent = document.getElementById("modalContent");
    // var pageContainer = document.querySelector(".page-container");

    btnStats.onclick = function() {
      modal.style.display = "block";
      modalContent.innerHTML = "Stats will go here later";
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
          headers: {
            "X-CSRF-Token": csrfToken,
          },
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
            const userGuessForm = document.getElementById("user-guess-form");

            // GAME LOGIC VVVVVVVVVV

            actualPlayerCards.forEach(card => {
              card.addEventListener("click", function() {
                const playerName = card.dataset.playerName;
                const userGuessInput = userGuessForm.querySelector("#user-guess");
                userGuessInput.value = playerName;
                console.log(userGuessInput.value);
                userGuessForm.submit();
                setTimeout(() => {
                  if (playerName === correctPlayerName) {
                    window.location.href = winPageURL;
                  } else {
                    window.location.href = losePageURL;
                  }
                }, 2000);
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
