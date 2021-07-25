var app = {
  version: 1,
  currentQuestionNumber: 0,
  jsonFile: "questions.json",
  area: $('.gameArea'),
  board: $('.gameBoard'),
  buttons: $(".btnHolder"),
  // Utility functions
  jsonLoaded: function (data) {
    console.clear()
    app.questions = data;
    app.showTitleThenQuestion(0);
  },
  disablePointsButtons: function () {
    app.buttons.find("#awardTeam1").prop("disabled",true);
    app.buttons.find("#awardTeam2").prop("disabled",true);
  },
  enablePointsButtons: function () {
    app.buttons.find("#awardTeam1").prop("disabled",false);
    app.buttons.find("#awardTeam2").prop("disabled",false);
  },
  resetBoard: function () {
    var boardScore = app.board.find("#boardScore");
    boardScore.html(0)
    var col1 = app.board.find(".col1");
    var col2 = app.board.find(".col2");
    col1.empty();
    col2.empty();
    for(var i = 0; i < 4; i++) {
      $("<div class='cardHolder empty'><div></div></div>").appendTo(col1);
      $("<div class='cardHolder empty'><div></div></div>").appendTo(col2);
    }
  },
  showTitleThenQuestion: function (currentQuestionNumber) {
    var currentQuestion = app.questions[currentQuestionNumber];
    var question = $(".question");

    app.resetBoard();
    
    if(currentQuestion.title) {
      question.html(currentQuestion.title);
      app.disablePointsButtons();
      app.buttons.find("#newQuestion").off("click").on("click", () => app.makeQuestion(currentQuestion));
    } else {
      app.makeQuestion(currentQuestion);
    }
  },
  // Action functions
  makeQuestion: function (currentQuestion) {

    var answers = currentQuestion.answers;
    app.enablePointsButtons();
    app.buttons.find("#newQuestion").off("click").on("click", app.changeQuestion);

    // numberOfAnswers is 8 or the nearest even number (rounded up), whichever is highest
    var numberOfAnswers = 2 * Math.ceil(Math.max(8, currentQuestion.answers.length) / 2);

    var boardScore = app.board.find("#boardScore");
    var question = $(".question");
    var col1 = app.board.find(".col1");
    var col2 = app.board.find(".col2");

    boardScore.html(0);
    question.html(currentQuestion.question);
    col1.empty();
    col2.empty();

    for (var i = 0; i < numberOfAnswers; i++) {
      var aLI;
      if (answers[i]) {
        aLI = $(
          "<div class='cardHolder'>" +
          "<div class='card'>" +
          "<div class='front'>" +
          "<span class='DBG'>" +
          (i + 1) +
          "</span>" +
          "</div>" +
          "<div class='back DBG'>" +
          "<span>" +
          answers[i].text +
          "</span>" +
          "<b class='LBG'>" +
          answers[i].points +
          "</b>" +
          "</div>" +
          "</div>" +
          "</div>"
        );
      } else {
        aLI = $("<div class='cardHolder empty'><div></div></div>");
      }
      var parentDiv = i < numberOfAnswers / 2 ? col1 : col2;
      $(aLI).appendTo(parentDiv);
    }

    var cardHolders = app.board.find(".cardHolder");
    var cards = app.board.find(".card");
    var backs = app.board.find(".back");
    var cardSides = app.board.find(".card>div");

    TweenLite.set(cardHolders, { perspective: 800 });
    TweenLite.set(cards, { transformStyle: "preserve-3d" });
    TweenLite.set(backs, { rotationX: 180 });
    TweenLite.set(cardSides, { backfaceVisibility: "hidden" });

    cards.data("flipped", false);

    function showCard() {
      var card = $(".card", this);
      var flipped = $(card).data("flipped");
      var cardRotate = flipped ? 0 : -180;
      TweenLite.to(card, 1, { rotationX: cardRotate, ease: Back.easeOut });
      flipped = !flipped;
      $(card).data("flipped", flipped);
      app.getBoardScore();
    }
    cardHolders.on("click", showCard);
  },
  getBoardScore: function () {
    var cards = app.board.find(".card");
    var boardScore = app.board.find("#boardScore");
    var currentScore = { var: boardScore.html() };
    var score = 0;
    function tallyScore() {
      if ($(this).data("flipped")) {
        var value = $(this).find("b").html();
        score += parseInt(value);
      }
    }
    $.each(cards, tallyScore);
    TweenMax.to(currentScore, 1, {
      var: score,
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut,
    });
  },
  awardPoints: function (num) {
    var num = $(this).attr("data-team");
    var boardScore = app.board.find("#boardScore");
    var currentScore = { var: parseInt(boardScore.html()) };
    var team = $("#team" + num);
    var teamScore = { var: parseInt(team.html()) };
    var teamScoreUpdated = teamScore.var + currentScore.var;
    TweenMax.to(teamScore, 1, {
      var: teamScoreUpdated,
      onUpdate: function () {
        team.html(Math.round(teamScore.var));
      },
      ease: Power3.easeOut,
    });

    TweenMax.to(currentScore, 1, {
      var: 0,
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut,
    });
  },
  changeQuestion: function () {
    if(app.currentQuestionNumber < app.questions.length) {
      console.log("Incrementing question")
      app.currentQuestionNumber++;
    }
    app.showTitleThenQuestion(app.currentQuestionNumber);
  },
  lastQuestion: function () {
    if(app.currentQuestionNumber > 0) {
      app.currentQuestionNumber--;
    }
    app.showTitleThenQuestion(app.currentQuestionNumber);
  },
  // Inital function
  init: function () {
    $.getJSON(app.jsonFile, app.jsonLoaded);
    app.buttons.find("#newQuestion").off("click").on("click", app.changeQuestion);
    app.buttons.find("#lastQuestion").on("click", app.lastQuestion);
    app.buttons.find("#awardTeam1").on("click", app.awardPoints);
    app.buttons.find("#awardTeam2").on("click", app.awardPoints);
  },
};
app.init();
//http://www.qwizx.com/gssfx/usa/ff.htm
