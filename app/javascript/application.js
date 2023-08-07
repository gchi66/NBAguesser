import "@hotwired/turbo-rails"
import "./controllers"
import "bootstrap"
import Rails from "@rails/ujs"
//= require rails-ujs
//= require turbolinks
//= require_tree .


// AJAX LOGIC VVVV

document.addEventListener("DOMContentLoaded", function(){
  console.log("domcontentloaded");
  document.addEventListener("turbo:load", function() {
    console.log('turbo loaded');
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
              formContainer.classList.add("hide-element");
              headingContainer.classList.remove("hide-element");
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
                console.log("hello");
                const playerName = card.dataset.playerName;

                if (playerName === correctPlayerName) {
                  window.location.href = winPageURL;
                } else {
                  window.location.href = losePageURL;
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
