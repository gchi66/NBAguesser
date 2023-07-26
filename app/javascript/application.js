// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import "bootstrap"

document.addEventListener("DOMContentLoaded", function(){
  const playerCards = document.querySelectorAll(".player-card");

  playerCards.forEach(card => {
    card.addEventListener("click", function(){
      console.log("hello");
    });
  });
});
