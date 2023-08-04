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
    const turboFrame = document.getElementById("season-form");
    const form = turboFrame ? turboFrame.firstElementChild : null;
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


            // DEFINING THE VARIABLES TO MAKE AJAX WORK VVVVVVVV

            const playerCardContainer = data.querySelector(".player-card-container");
            const correctPlayerCard = data.querySelector(".correct-player-card");

            const actualPlayerCardContainer = document.querySelector(".player-card-container");
            actualPlayerCardContainer.innerHTML = playerCardContainer.innerHTML;

            const actualCorrectPlayerCard = document.querySelector(".correct-player-card");
            actualCorrectPlayerCard.innerHTML = correctPlayerCard.innerHTML;

            const correctPlayerInfo = document.querySelector(".correct-player-info");
            const correctPlayerName = correctPlayerInfo.dataset.correctPlayerName;

            const actualPlayerCards = actualPlayerCardContainer.querySelectorAll(".player-card");

            // DISSAPEARING HEADER LOGIC


            const headingContainer = document.querySelector(".heading-container");
            headingContainer.classList.remove("hide-element");


            // GAME LOGIC VVVVVVVVVV

            actualPlayerCards.forEach(card => {
              card.addEventListener("click", function() {
                console.log("hello");
                const playerName = card.dataset.playerName;

                if (playerName === correctPlayerName) {
                  window.location.href = winPageURL;
                } else {
                  window.location.href = `${losePageURL}?correctPlayerName=${encodeURIComponent(correctPlayerName)}`;
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
