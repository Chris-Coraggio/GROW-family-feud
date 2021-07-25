var app = {
  version: 1,
  currentQ: 0,
  jsonFile: "questions.json",
  area: $('.gameArea'),
  board: $('.gameBoard'),
  buttons: $(".btnHolder"),
  // Utility functions
  shuffle: function (array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },
  jsonLoaded: function (data) {
    console.clear();
    app.allData = data;
    app.questions = Object.keys(data);
    // app.shuffle(app.questions)
    app.makeQuestion(app.currentQ);
  },
  // Action functions
  makeQuestion: function (qNum) {
    var qText = app.questions[qNum];
    var qAnswr = app.allData[qText];

    var qNum = qAnswr.length;
    qNum = qNum < 8 ? 8 : qNum;
    qNum = qNum % 2 != 0 ? qNum + 1 : qNum;

    var boardScore = app.board.find("#boardScore");
    var question = $(".question");
    var col1 = app.board.find(".col1");
    var col2 = app.board.find(".col2");

    boardScore.html(0);
    question.html(qText.replace(/&x22;/gi, '"'));
    col1.empty();
    col2.empty();

    for (var i = 0; i < qNum; i++) {
      var aLI;
      if (qAnswr[i]) {
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
          qAnswr[i][0] +
          "</span>" +
          "<b class='LBG'>" +
          qAnswr[i][1] +
          "</b>" +
          "</div>" +
          "</div>" +
          "</div>"
        );
      } else {
        aLI = $("<div class='cardHolder empty'><div></div></div>");
      }
      var parentDiv = i < qNum / 2 ? col1 : col2;
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
    boardScore.html(score);
  },
  awardPoints: function (num) {
    var num = $(this).attr("data-team");
    var boardScore = app.board.find("#boardScore");
    var currentScore = { var: parseInt(boardScore.html()) };
    var team = $("#team" + num);
    var teamScore = { var: parseInt(team.html()) };
    var teamScoreUpdated = teamScore.var + currentScore.var;
    team.html(teamScoreUpdated);
    boardScore.html(0);
  },
  changeQuestion: function () {
    app.currentQ++;
    app.makeQuestion(app.currentQ);
  },
  lastQuestion: function () {
    app.currentQ--;
    app.makeQuestion(app.currentQ);
  },
  // Inital function
  init: function () {
    $.getJSON(app.jsonFile, app.jsonLoaded);
    app.buttons.find("#newQuestion").on("click", app.changeQuestion);
    app.buttons.find("#lastQuestion").on("click", app.lastQuestion);
    app.buttons.find("#awardTeam1").on("click", app.awardPoints);
    app.buttons.find("#awardTeam2").on("click", app.awardPoints);
  },
};
app.init();
//http://www.qwizx.com/gssfx/usa/ff.htm
