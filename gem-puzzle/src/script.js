class gemPuzzle {
  constructor() {
    this.size = 4;
    this.finalArray = [];
    this.randomArray = [];
    this.time = 0;
    this.steps = 0;
    this.timeValue = document.querySelector(".time__value");
    this.timerId;
    this.imgCheckbox = false;
    this.imgSrc = "";
  }

  // array create and check
  createFinalArray() {
    for (let i = 0; i < this.size ** 2 - 1; i++) {
      this.finalArray.push(i + 1);
    }
    this.finalArray.push(0);
  }

  createRandomArray() {
    //clear array
    this.randomArray = [];
    //rewrite array
    for (let i = 0; i < this.size ** 2 - 1; i++) {
      this.randomArray.push(i + 1);
    }
    this.randomArray.push(0);
    //random
    this.randomArray = this.randomArray.sort(function () {
      return Math.random() - 0.5;
    });
    this.checkArray();
  }

  checkArray() {
    const length = this.randomArray.length;
    let sum = 0;
    for (let i = 0; i < length; i++) {
      for (let j = i + 1; j <= length; j++) {
        if (this.randomArray[i] > this.randomArray[j]) {
          sum += 1;
        }
      }
    }
    sum += Math.trunc(this.randomArray.indexOf(0) / this.size) + 1;
    if (sum % 2 === 1) this.createRandomArray();
  }

  createElement(typeElem, className, parent, text) {
    const elem = document.createElement(typeElem);
    elem.className = className;
    if (text) elem.innerHTML = text;
    parent.appendChild(elem);
    return elem;
  }

  loadPage() {
    const wrapper = this.createElement("div", "wrapper", document.body);

    const buttons__wrapper = this.createElement(
      "div",
      "buttons__wrapper",
      wrapper
    );
    this.start = this.createElement(
      "button",
      "buttons buttons__start",
      buttons__wrapper,
      "New game"
    );
    this.save = this.createElement(
      "button",
      "buttons buttons__save",
      buttons__wrapper,
      "Save game"
    );
    this.load = this.createElement(
      "button",
      "buttons buttons__load",
      buttons__wrapper,
      "Load game"
    );
    this.results = this.createElement(
      "button",
      "buttons buttons__results",
      buttons__wrapper,
      "Best score"
    );

    const counters = this.createElement("div", "counters", wrapper);
    const step = this.createElement("div", "counters__item step", counters);
    this.stepsDescription = this.createElement(
      "div",
      "step__description",
      step,
      "Total steps: "
    );
    this.stepsValue = this.createElement("div", "step__value", step, "0");
    const time = this.createElement("div", "counters__item time", counters);
    this.timeDescription = this.createElement(
      "div",
      "time__description",
      time,
      "Total time: "
    );
    this.timeValue = this.createElement("div", "time__value", time, "00 : 00");

    this.field = this.createElement("div", "game__field", wrapper);
    this.resultWrapper = this.createElement("div", "result__wrapper", wrapper);

    const footerWrapper = this.createElement("div", "footer__wrapper", wrapper);
    this.start = this.createElement(
      "button",
      "buttons buttons__finish",
      footerWrapper,
      "Finish game"
    );

    //img number switch
    const switchButton = this.createElement(
      "div",
      "switch__button",
      footerWrapper
    );
    switchButton.id = "switch__button";
    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.className = "checkbox";
    switchButton.appendChild(this.checkbox);
    this.knobs = this.createElement("div", "checkbox__knobs", switchButton);
    this.layer = this.createElement("div", "checkbox__layer", switchButton);

    const fieldSize = this.createElement("div", "size", footerWrapper);

    const select = document.createElement("select");
    select.className = "size__select";
    select.id = "size__select";
    fieldSize.appendChild(select);
    for (let i = 3; i < 9; i += 1) {
      let option = document.createElement("option");
      option.id = `size__select_${i}`;
      option.innerHTML = `${i}x${i}`;
      select.appendChild(option);
    }
    select.options[1].selected = true;
    select.addEventListener("change", changeSize);
  }

  loadResultDiv(arrayResult) {
    this.stopTimer();
    this.results.classList.add("disabled");
    const gameField = document.querySelector(".game__field");

    const buttonDiv = this.createElement(
      "div",
      "result__close-button",
      this.resultWrapper
    );
    this.resultWrapper.style.top = gameField.offsetTop + "px";
    this.resultWrapper.style.position = "absolute";
    const button = this.createElement("button", "buttons__close", buttonDiv);

    button.addEventListener("click", deleteResultDiv);

    const img = this.createElement("img", "close__img", button);
    img.src = "img/close.svg";
    this.createElement(
      "div",
      "result__title",
      this.resultWrapper,
      "best results in the number of steps"
    );
    const resultDescription = this.createElement(
      "div",
      "result__description description",
      this.resultWrapper
    );
    let pElem = this.createElement(
      "p",
      "description__title",
      resultDescription
    );
    let span = this.createElement("span", "description__span", pElem, "№");
    span = this.createElement("span", "description__span", pElem, "size");
    span = this.createElement("span", "description__span", pElem, "time");
    span = this.createElement(
      "span",
      "description__span",
      pElem,
      "total steps"
    );

    let j = 1;
    for (let i = 0; i < arrayResult.length; i += 3) {
      pElem = this.createElement("p", "description__p", resultDescription);
      span = this.createElement("span", "description__span", pElem, j);
      span = this.createElement(
        "span",
        "description__span",
        pElem,
        arrayResult[i]
      );
      span = this.createElement(
        "span",
        "description__span",
        pElem,
        arrayResult[i + 1]
      );
      span = this.createElement(
        "span",
        "description__span",
        pElem,
        arrayResult[i + 2]
      );
      j++;
    }
  }

  loadField() {
    const gameField = document.querySelector(".game__field");
    gameField.classList.toggle("disabled", false);
    const buttonsFinish = document.querySelector(".buttons__finish");
    buttonsFinish.classList.toggle("disabled", false);
    for (let i = 0; i < this.randomArray.length; i++) {
      let elemNumber =
        this.randomArray[i] === 0
          ? this.randomArray.length - 1
          : this.randomArray[i] - 1;
      let elem = document.getElementsByClassName("game__item")[elemNumber];
      elem.style.order = i;
    }
    if (this.imgCheckbox) {
      document.querySelectorAll(".game__img").forEach((item) => {
        item.addEventListener("click", moveItem);
      });
    } else {
      document.querySelectorAll(".game__item").forEach((item) => {
        item.addEventListener("click", moveItem);
      });
    }
  }

  correctField() {
    let j = 0,
      imgWidth = 0,
      imgHeight = 0;
    let randomNumber = Math.floor(Math.random() * 46);
    let imgSrc = this.imgSrc === "" ? `img/${randomNumber}.jpg` : this.imgSrc;
    this.imgSrc = imgSrc;

    for (let i = 0; i < this.finalArray.length; i++) {
      const text =
        this.finalArray[i] === 0 || game.imgCheckbox ? "" : this.finalArray[i];
      const className =
        this.finalArray[i] === 0
          ? `game__item game__item_${this.size} zero dropzone`
          : `game__item game__item_${this.size} draggable`;
      const parrentDiv = this.createElement(
        "div",
        className,
        this.field,
        `${text}`
      );
      parrentDiv.id = this.finalArray[i];
      let offset = this.field.offsetWidth / this.size;

      if (game.imgCheckbox && this.finalArray[i] !== 0) {
        parrentDiv.classList.add("item__img");
        const img = document.createElement("img");
        img.className = "game__img";
        img.src = imgSrc;
        img.width = this.field.offsetWidth;
        img.style.left = "-" + imgWidth + "px";
        img.style.top = "-" + imgHeight + "px";
        img.draggable = false;
        imgWidth += offset;
        if (j === this.size - 1) {
          j = -1;
          imgHeight += offset;
          imgWidth = 0;
        }
        parrentDiv.appendChild(img);
      }
      j++;

      if (this.finalArray[i] !== 0) {
        parrentDiv.draggable = true;
      }
    }
  }

  deleteField() {
    document.querySelectorAll(".game__item").forEach((item) => {
      item.removeEventListener("click", moveItem);
    });

    this.field.innerHTML = "";
  }

  //timer
  startTimer() {
    this.timerId = setInterval(() => {
      this.time += 1;
      this.timeValue.innerHTML = this.getTime();
    }, 1000);
  }

  stopTimer() {
    clearTimeout(this.timerId);
  }

  getTime() {
    const time = this.time;
    let min = Math.floor(time / 60);
    min = min < 10 ? `0${min}` : min;
    let sec = Math.floor(time % 60);
    sec = sec < 10 ? `0${sec}` : sec;
    return `${min} : ${sec}`;
  }

  clearTimer() {
    clearTimeout(this.timerId);
    this.time = 0;
    this.timeValue.innerHTML = "00 : 00";
  }

  //check finish
  checkFinish() {
    for (let i = 0; i < this.randomArray.length; i += 1) {
      if (this.randomArray[i] !== this.finalArray[i]) return false;
    }
    return true;
  }
}

function finishGame() {
  game.stopTimer();
  saveResult();
  let gameField = document.querySelector(".game__field");
  gameField.classList.add("disabled");
  let snd = new Audio("src/win.mp3");
  snd.play();
  snd.currentTime = 0;
  setTimeout(() => {
    alert(
      `Ура! Вы решили головоломку за ${game.timeValue.innerHTML} и ${game.steps} ходов!`
    );
  }, 400);
}

function moveItem(e) {
  const element = game.imgCheckbox ? e.path[1] : e.path[0];
  let zeroPos = game.randomArray.indexOf(0);
  let curPos = game.randomArray.indexOf(Number(element.id));
  let diffPos = Math.abs(zeroPos - curPos);
  if ((zeroPos + 1) % game.size === 0 && Math.abs(zeroPos - curPos) === 1) {
    diffPos = zeroPos - curPos;
  } else if (zeroPos % game.size === 0 && Math.abs(zeroPos - curPos) === 1) {
    diffPos = curPos - zeroPos;
  }
  let diffPos2 = zeroPos - curPos;
  let translate;
  if (diffPos2 === -1) {
    translate = "translateX(-101%)";
  } else if (diffPos2 === 1) {
    translate = "translateX(101%)";
  } else if (diffPos2 % game.size === 0 && diffPos2 < 0) {
    translate = "translateY(-101%)";
  } else if (diffPos2 % game.size === 0 && diffPos2 > 0) {
    translate = "translateY(101%)";
  }

  if (diffPos === game.size || diffPos === 1) {
    //audio
    let snd = new Audio("src/audio.mp3");
    snd.play();
    snd.currentTime = 0;

    //меняем order

    element.classList.add("transition");
    element.style.transform = translate;
    setTimeout(() => {
      element.classList.toggle("transition");
      element.style.transform = "none";
      element.style.order = zeroPos;
      document.querySelectorAll(".zero")[0].style.order = curPos;
    }, 350);

    game.randomArray[zeroPos] = Number(element.id);
    game.randomArray[curPos] = 0;
    if (game.steps === 0) {
      game.startTimer();
    }
    //set steps
    game.steps += 1;
    document.querySelectorAll(".step__value")[0].innerHTML = game.steps;

    //check finish
    if (game.checkFinish()) {
      finishGame();
    }
  }
}

function changeSize() {
  let selection = document.getElementById("size__select");
  let selectedOption = selection.options[selection.selectedIndex];

  game.size = Number(selectedOption.id.slice(-1));
  startGame();
}

function startGame() {
  game.imgSrc = "";
  let gameField = document.querySelector(".game__field");
  gameField.classList.toggle("disabled", true);
  game.finalArray = [];
  game.randomArray = [];
  game.steps = 0;
  game.clearTimer();
  document.querySelectorAll(".step__value")[0].innerHTML = game.steps;
  game.createFinalArray();
  game.createRandomArray();
  game.deleteField();
  game.correctField();
  game.loadField();
}

function saveGame() {
  localStorage.setItem("arrRand", game.randomArray);
  localStorage.setItem("size", game.size);
  localStorage.setItem("time", game.time);
  localStorage.setItem("step", game.steps);
  localStorage.setItem("imgCh", game.imgCheckbox);
  localStorage.setItem("imgSrc", game.imgSrc);
}

function loadGame() {
  game.stopTimer();
  let arrRand = localStorage.getItem("arrRand");
  game.randomArray = arrRand.split(",").map((string) => parseFloat(string));
  game.size = Number(localStorage.getItem("size"));
  game.time = Number(localStorage.getItem("time"));
  game.steps = Number(localStorage.getItem("step"));
  let imgCh = localStorage.getItem("imgCh");
  imgCh = imgCh === "true" ? true : false;
  if (imgCh != game.imgCheckbox) {
    document.querySelector(".checkbox").checked = imgCh;
    game.imgCheckbox = imgCh;
  }
  if (imgCh) {
    game.imgSrc = localStorage.getItem("imgSrc");
  }

  game.finalArray = [];
  game.createFinalArray();
  game.deleteField();
  game.correctField();
  game.loadField();

  document.querySelectorAll(".size__select")[0][game.size - 3].selected = true;
  document.querySelectorAll(".step__value")[0].innerHTML = game.steps;
  game.timeValue.innerHTML = game.getTime();
  if (game.steps !== 0) game.startTimer();
}

function blockFinish(item, snd) {
  item.classList.toggle("transition");
  item.style.transform = "none";
  snd.play();
  snd.currentTime = 0;
}

function timer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function finishGameBtn() {
  const buttons = document.querySelectorAll(".buttons");
  buttons.forEach((e) => e.classList.toggle("disabled", true));
  game.stopTimer();
  const gameItem = document.querySelectorAll(".game__item");
  let zeroPos = game.randomArray.indexOf(0);
  let maxNumb = game.size ** 2 - 1;
  let snd = new Audio("src/audio.mp3");
  for (let i = 0; i < maxNumb; i++) {
    if (game.randomArray[i] !== i + 1) {
      let numPos = Number(gameItem[i].style.order);
      if (game.randomArray[i] === 0) {
        let topZero = Math.trunc(zeroPos / game.size),
          topCur = Math.trunc(numPos / game.size),
          leftZero = zeroPos % game.size,
          leftCur = numPos % game.size;
        gameItem[i].classList.add("transition");
        gameItem[i].style.transform = `translateY(${
          (topCur - topZero) * -102
        }%) translateX(${(leftCur - leftZero) * -102}%)`;
        await timer(500);

        game.randomArray[numPos] = 0;
        game.randomArray[i] = i + 1;
        gameItem[i].style.order = i;
        gameItem[maxNumb].style.order = numPos;
        zeroPos = numPos;

        blockFinish(gameItem[i], snd);
      } else {
        //переносим текущую фишку на пустое место
        let curNum = game.randomArray[i];
        let topZero = Math.trunc(zeroPos / game.size),
          topCur = Math.trunc(i / game.size),
          leftZero = zeroPos % game.size,
          leftCur = i % game.size;
        gameItem[curNum - 1].classList.add("transition");
        gameItem[curNum - 1].style.transform = `translateY(${
          (topCur - topZero) * -102
        }%) translateX(${(leftCur - leftZero) * -102}%)`;
        await timer(500);

        game.randomArray[zeroPos] = game.randomArray[i];
        game.randomArray[i] = 0;
        gameItem[curNum - 1].style.order = zeroPos;
        gameItem[maxNumb].style.order = i;
        zeroPos = i;

        gameItem[curNum - 1].classList.toggle("transition");
        gameItem[curNum - 1].style.transform = "none";
        snd.play();
        snd.currentTime = 0;

        //переносим нужную фишку
        topZero = Math.trunc(zeroPos / game.size);
        topCur = Math.trunc(numPos / game.size);
        leftZero = zeroPos % game.size;
        leftCur = numPos % game.size;
        gameItem[i].classList.add("transition");
        gameItem[i].style.transform = `translateY(${
          (topCur - topZero) * -102
        }%) translateX(${(leftCur - leftZero) * -102}%)`;
        await timer(500);

        game.randomArray[numPos] = 0;
        game.randomArray[i] = i + 1;
        gameItem[i].style.order = i;
        gameItem[maxNumb].style.order = numPos;
        zeroPos = numPos;

        blockFinish(gameItem[i], snd);
      }
    }
  }
  let gameField = document.querySelector(".game__field");
  gameField.classList.add("disabled");
  snd = new Audio("src/win.mp3");
  snd.play();
  snd.currentTime = 0;
  buttons.forEach((e) => e.classList.toggle("disabled", false));
  document.querySelector(".buttons__finish").classList.toggle("disabled", true);
}

function switchCheckbox(e) {
  game.imgCheckbox = e.srcElement.checked;
  startGame();
}

let game = new gemPuzzle();

game.loadPage();
startGame();

document.querySelector(".buttons__start").addEventListener("click", startGame);
document.querySelector(".checkbox").addEventListener("click", switchCheckbox);
document.querySelector(".buttons__save").addEventListener("click", saveGame);
document.querySelector(".buttons__load").addEventListener("click", loadGame);
document
  .querySelector(".buttons__finish")
  .addEventListener("click", finishGameBtn);
document
  .querySelector(".buttons__results")
  .addEventListener("click", loadResult);

// mouse drop&drag
let dragged;

/* events fired on the draggable target */
document.addEventListener("drag", function (event) {}, false);

document.addEventListener(
  "dragstart",
  function (event) {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    event.target.style.opacity = 0.5;
  },
  false
);

document.addEventListener(
  "dragend",
  function (event) {
    // reset the transparency
    event.target.style.opacity = "";
  },
  false
);

/* events fired on the drop targets */
document.addEventListener(
  "dragover",
  function (event) {
    // prevent default to allow drop
    event.preventDefault();
  },
  false
);

document.addEventListener(
  "dragenter",
  function (event) {
    // highlight potential drop target when the draggable element enters it
    if (event.target.className.includes("dropzone")) {
      event.target.style.background = "lightseagreen";
    }
  },
  false
);

document.addEventListener(
  "dragleave",
  function (event) {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.className.includes("dropzone")) {
      event.target.style.background = "";
    }
  },
  false
);

document.addEventListener(
  "drop",
  function (event) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged elem to the selected drop target
    let zeroPos = game.randomArray.indexOf(0);
    let curPos = game.randomArray.indexOf(Number(dragged.id));
    let diffPos = Math.abs(zeroPos - curPos);
    if ((zeroPos + 1) % game.size === 0 && Math.abs(zeroPos - curPos) === 1) {
      diffPos = zeroPos - curPos;
    } else if (zeroPos % game.size === 0 && Math.abs(zeroPos - curPos) === 1) {
      diffPos = curPos - zeroPos;
    }

    if (diffPos === game.size || diffPos === 1) {
      if (event.target.className.includes("dropzone")) {
        let tmp = event.target.style.order;
        event.target.style.order = dragged.style.order;
        dragged.style.order = tmp;
        event.target.style.background = "";

        let snd = new Audio("src/audio.mp3");
        snd.play();
        snd.currentTime = 0;

        if (game.steps === 0) {
          game.startTimer();
        }
        game.steps += 1;
        document.querySelectorAll(".step__value")[0].innerHTML = game.steps;

        game.randomArray[tmp] = Number(dragged.id);
        game.randomArray[event.target.style.order] = 0;

        //check finish
        if (game.checkFinish()) {
          finishGame();
        }
      }
    } else {
      event.target.style.background = "";
    }
  },
  false
);

//best result
function saveResult() {
  let strResult = localStorage.getItem("arrResult");
  let arrayResult;
  if (strResult === null) {
    arrayResult = [];
  } else {
    arrayResult = strResult.length === 0 ? [] : strResult.split(",");
  }
  let rec = false;

  for (let i = 2; i < arrayResult.length; i += 3) {
    if (Number(arrayResult[i]) >= game.steps) {
      arrayResult.splice(
        i - 2,
        0,
        `${game.size}x${game.size}`,
        game.getTime(),
        game.steps
      );
      rec = true;
      break;
    }
  }
  if (!rec) {
    arrayResult.push(`${game.size}x${game.size}`);
    arrayResult.push(game.getTime());
    arrayResult.push(game.steps);
  }

  if (arrayResult.length < 30) {
    localStorage.setItem("arrResult", arrayResult);
  } else {
    localStorage.setItem("arrResult", arrayResult.slice(0, 30));
  }
}

function loadResult() {
  let strResult = localStorage.getItem("arrResult");
  let arrayResult =
    strResult === "" || strResult === null ? [] : strResult.split(",");
  let gameField = document.querySelector(".game__field");
  gameField.classList.add("invisible");
  game.loadResultDiv(arrayResult);
}

function deleteResultDiv(e) {
  const btnCls = document.querySelector(".buttons__close");
  let gameField = document.querySelector(".game__field");
  document.querySelector(".buttons__results").classList.toggle("disabled");
  if (!gameField.className.includes("disabled") && game.steps !== 0) {
    game.startTimer();
  }
  btnCls.removeEventListener("click", deleteResultDiv);
  btnCls.parentNode.parentNode.innerHTML = "";
  gameField.classList.toggle("invisible");
}
