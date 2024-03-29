# NBAguesser <www.nbaguesser.com>

Guess the NBA player based on a set of statistics.

#### Video Demo:  <https://youtu.be/rTuKzBSqtO0>

#### Description:

Guess the NBA player based on a set of season averages. The user selects a season, and the data is scraped from a third party source, and then the user must select the player who averaged that set of points, rebounds, and assists. Each day the user gets 5 guesses. If they get 3 out of 5 correct that day, they earn a :basketball: for a daily streak.

The goal is for them to continue their daily streak for as long as possible! Inspired by wordle and other daily guessing games as well as my love for the NBA, I created this project for several reasons: 1. To practice (and hopefully get good at) vanilla javascript, 2. To finish my CS50 final project, and 3. To share with other developers and get feedback, hopefully resulting in me improving as well.

The backend and skeleton of the website is done with Ruby on Rails and Javascript, and the frontend is simple SCSS. For simplicity and ease of access, the user's data including the daily streaks is all done with LocalStorage.

Application.js focuses on hiding and showing the elements of the site rather than using ajax or simply hard refreshing the page. This provides a super smooth user experience with pretty much zero wait time to do anything, except for when the data is scraped. The localstorage values are updated based on different actions, and at times methods need to be called to access these values because of their order in the execution stack and due to the location of these values.

Home.html.erb is the only page of the website. Elements are dynamically handled with app.js, and this file is extremely simple.The structure of the one page website includes both a top navbar that displays the users stats and the instructions for the website within javascript modals. The instructions modal will pop up if the user has never visited the site before with a nice little welcome message as well. The bottom bar includes my logo and link to my portfolio website which was a simple website that I whipped up before this project.

The frontend and design of this website is still a work in progress. The idea is to have everything for the user easily available on both desktop and mobile, so the experience is super easy and seamless. The formatting for the guess counter bar is tricky to fit in the result page and the guess page, so I decided for simplicity sake to just show the user that guess bar only on the main/landing page. Eventually, I will update the design to look more mordern, which will be a nice foray into front-end development.

The data scraping is handled in pages_controller.rb, which after completed, the data is sent to the view, and then gotten by the application.js which then makes an ajax call. Then the dom elements are selected and manipulated so as to avoid any clunky refreshing behavior. Key to this is the hide-element javascript class, which is added and removed as needed. I find that this allows for the user to not experience any long loading times, and with only the need for the single ajax call after the data scraping.
