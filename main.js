//pages
const mainPage = document.querySelector(".main");
const questionsPage = document.querySelector(".questions");
const loading = document.querySelector(".load");
const pabaigaWinnerPage = document.querySelector(".pabaiga--winner");
const pabaigaLooserPage = document.querySelector(".pabaiga--looser");
//buttons
const startGame = document.getElementById("startGame");
//selects
const difficulty = document.getElementById("difficulty");
const category = document.getElementById("category");
//questions go here
const questionsText = document.getElementById("question");
//points go here
const pointsWin = document.getElementById("pointsWin");
const pointsLost = document.getElementById("pointsLost");

let receivedQuestions;
let userData = {
  difficulty: "easy",
  category: 9,
  correct: 0,
  incorrect: 0,
  questions: 10,
};

//get selected values
difficulty.addEventListener("change", (e) => {
  userData.difficulty = e.target.value;
});
category.addEventListener("change", (e) => {
  userData.category = e.target.value;
});

//start game
startGame.addEventListener("click", (e) => {
  //hide main page
  mainPage.classList.add("hide");
  //show load
  loading.classList.remove("hide");
  //fetch data
  fetchData(userData.questions, userData.category);

  setTimeout(() => {
    //hide load
    loading.classList.add("hide");

    //show questions
    questionsPage.classList.remove("hidden");
  }, 3000);
});

//fetch data function
const fetchData = (questions, category) => {
  fetch(
    `https://opentdb.com/api.php?amount=${questions}&type=boolean&category=${category}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let receivedQuestions = data.results;
      let i = 0;

      //game logic
      game(receivedQuestions, i);
    })
    .catch((err) => {
      console.log(err);
    });
};

const game = (receivedQuestions, i) => {
  getQuestion(receivedQuestions, i);
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("questions__controls-btn") && i < 10) {
      let chosenAnswer = e.target.getAttribute("data-value");

      //get answer
      if (
        chosenAnswer.toLowerCase() ===
        receivedQuestions[i].correct_answer.toLowerCase()
      ) {
        //increase correct count
        userData.correct++;
      } else {
        //increase incorrect count
        userData.incorrect++;
      }

      if (i === 9) {
        //hide questions page
        questionsPage.classList.add("hidden");

        if (userData.correct >= 6) {
          //show winner page
          pabaigaWinnerPage.classList.remove("hidden");
          pointsWin.innerText = `${userData.correct}/${userData.questions} correct answers`;
        } else {
          //show looser page
          pabaigaLooserPage.classList.remove("hidden");
          pointsLost.innerText = `${userData.correct}/${userData.questions} correct answers`;
        }
      } else {
        //increase count
        i++;
        //get new question
        getQuestion(receivedQuestions, i);
      }
    }
  });
};

const getQuestion = (receivedQuestions, i) => {
  //question
  questionsText.innerHTML = receivedQuestions[i].question;
};
