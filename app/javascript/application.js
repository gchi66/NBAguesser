// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import "bootstrap"

document.addEventListener("DOMContentLoaded", function(){
  document.addEventListener("turbo:load", function() {
    const playerCards = document.querySelectorAll(".player-card");
    const correctPlayerCard = document.querySelector(".correct-player-card");
    const correctPlayerName = correctPlayerCard.dataset.correctPlayerName;

    playerCards.forEach(card => {
      card.addEventListener("click", function() {
        const playerName = card.dataset.playerName;

        if (playerName === correctPlayerName) {
          alert("good job you win!");
        } else {
          alert(`So close! The correct answer was ${correctPlayerName}`);
        }

        setTimeout(function() {
          window.location.href = "/";
        }, 1000);
      });
    });
  });
});
