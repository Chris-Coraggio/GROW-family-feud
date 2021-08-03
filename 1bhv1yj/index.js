var app = {
  version: 1,
  currentQuestionNumber: 0,
  jsonFile: "questions.json",
  area: document.querySelector('.gameArea'),
  board: document.querySelector('.gameBoard'),
  // Utility functions
  jsonLoaded: function (data) {
    console.clear()
    app.questions = data;
    app.showTitleThenQuestion(0);
  },
  disablePointsButtons: function () {
    document.querySelector("#awardTeam1").disabled = true;
    document.querySelector("#awardTeam2").disabled = true;
  },
  enablePointsButtons: function () {
    document.querySelector("#awardTeam1").disabled = false;
    document.querySelector("#awardTeam2").disabled = false;
  },
  resetBoard: function () {
    var boardScore = app.board.querySelector("#boardScore");
    boardScore.innerHTML = 0;
    var col1 = app.board.querySelector(".col1");
    var col2 = app.board.querySelector(".col2");
    //empty out the two columns
    col1.innerHTML = "";
    col2.innerHTML = "";
    for(var i = 0; i < 4; i++) {
      var cardHolder = document.createElement("button");
      cardHolder.classList.add("cardHolder", "empty");
      var emptyDiv = document.createElement("div");
      cardHolder.appendChild(emptyDiv);
      col1.appendChild(cardHolder);
    }
    for(var i = 0; i < 4; i++) {
      var cardHolder = document.createElement("button");
      cardHolder.classList.add("cardHolder", "empty");
      var emptyDiv = document.createElement("div");
      cardHolder.appendChild(emptyDiv);
      col2.appendChild(cardHolder);
    }
  },
  showTitleThenQuestion: function (currentQuestionNumber) {
    var currentQuestion = app.questions[currentQuestionNumber];
    var question = document.querySelector(".question");

    app.resetBoard();
    
    if(currentQuestion.title) {
      question.innerHTML = currentQuestion.title;
      app.disablePointsButtons();
      document.querySelector("#newQuestion").onclick = () => app.makeQuestion(currentQuestion);
    } else {
      app.makeQuestion(currentQuestion);
    }
  },
  // Action functions
  makeQuestion: function (currentQuestion) {

    var answers = currentQuestion.answers;
    app.enablePointsButtons();
    document.querySelector("#newQuestion").onclick = app.changeQuestion;

    // numberOfAnswers is 8 or the nearest even number (rounded up), whichever is highest
    var numberOfAnswers = 2 * Math.ceil(Math.max(8, currentQuestion.answers.length) / 2);

    var boardScore = !!app.board.querySelector("#boardScore");
    var question = document.querySelector(".question");
    var col1 = app.board.querySelector(".col1");
    var col2 = app.board.querySelector(".col2");

    boardScore.innerHTML = 0;
    question.innerHTML = currentQuestion.question;
    //empty out the two columns
    while(col1.firstChild)
      col1.removeChild(col1.firstChild);
    while(col2.firstChild)
      col2.removeChild(col2.firstChild);

    function showCard() {
      var card = this.querySelector(".card");
      card.classList.toggle("flipped");
      app.getBoardScore();
    }

    for (var i = 0; i < numberOfAnswers; i++) {
      var cardHolder;
      if (answers[i]) {

        cardHolder = document.createElement("button");
        cardHolder.classList.add("cardHolder");
        var card = document.createElement("div");
        card.classList.add("card");
        var cardFront = document.createElement("div");
        cardFront.classList.add("card-face", "front");
        var cardFrontSpan = document.createElement("span");
        cardFrontSpan.classList.add("DBG");
        cardFrontSpan.innerHTML = i + 1;
        var cardBack = document.createElement("div");
        cardBack.classList.add("card-face", "back", "DBG");
        var cardBackSpan = document.createElement("span");
        cardBackSpan.innerHTML = answers[i].text;
        cardBackB = document.createElement("b");
        cardBackB.classList.add("LBG");
        cardBackB.innerHTML = answers[i].points;

        cardHolder.appendChild(card);
        card.appendChild(cardFront);
        cardFront.appendChild(cardFrontSpan);
        card.appendChild(cardBack);
        cardBack.appendChild(cardBackSpan);
        cardBack.appendChild(cardBackB);

      } else {
        cardHolder = document.createElement("div");
        cardHolder.classList.add("cardHolder", "empty");
        var emptyDiv = document.createElement("div");
        cardHolder.appendChild(emptyDiv);
      }

      cardHolder.onclick = showCard;

      if (i < numberOfAnswers / 2) {
        col1.appendChild(cardHolder);
      } else {
        col2.appendChild(cardHolder);
      }
    }
  },
  getBoardScore: function () {
    var cards = app.board.querySelectorAll(".card");
    var boardScore = app.board.querySelector("#boardScore");
    var currentScore = { var: boardScore.innerHTML };
    var score = 0;
    for (var card of cards) {
      if (card.classList.contains("flipped")) {
        score += parseInt(card.querySelector("b").innerHTML);
      }
    }
    boardScore.innerHTML = score;
  },
  awardPoints: function (num) {
    var boardScore = app.board.querySelector("#boardScore");
    var currentScore = parseInt(boardScore.innerHTML);
    var team = document.querySelector("#team" + num);
    var teamScore = parseInt(team.innerHTML);
    console.log(teamScore + " + " + currentScore);
    var teamScoreUpdated = teamScore + currentScore;
    team.innerHTML = teamScoreUpdated;
    boardScore.innerHTML = 0;
  },
  changeQuestion: function () {
    if(app.currentQuestionNumber < app.questions.length) {
      app.currentQuestionNumber++;
    }
    app.showTitleThenQuestion(app.currentQuestionNumber);
  },
  lastQuestion: function () {
    if (app.currentQuestionNumber > 0) {
      app.currentQuestionNumber--;
    }
    app.showTitleThenQuestion(app.currentQuestionNumber);
  },
  // Inital function
  init: function () {
    var request = new XMLHttpRequest();
    request.open('GET', app.jsonFile, true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var data = JSON.parse(this.response);
        app.jsonLoaded(data);
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();
    document.querySelector("#newQuestion").onclick = app.changeQuestion;
    document.querySelector("#lastQuestion").onclick = app.lastQuestion;
    document.querySelector("#awardTeam1").onclick = () => app.awardPoints(1);
    document.querySelector("#awardTeam2").onclick = () => app.awardPoints(2);
  }
};
app.init();
//http://www.qwizx.com/gssfx/usa/ff.htm
