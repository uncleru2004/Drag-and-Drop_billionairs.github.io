import FetchWrapper from "./fetch-wrapper.js";

const draggable_list = document.querySelector(".draggable-list");
const checkBtn = document.querySelector("#check");
const FORM = document.querySelector("#form");
const NUMBER = document.querySelector("#number");
//const BUTTON = document.querySelector("#button");

let dragSrcEl;
let LIST_ITEMS;
let RICHEST_PEOPLE;

const global = {
  apiURL: "https://forbes400.onrender.com/",
  endpoint: "api/forbes400?limit=",
};

// запрос данных из API
function getItemsFromAPI() {
  RICHEST_PEOPLE = [];

  const API = new FetchWrapper(`${global.apiURL}`);
  API.get(`${global.endpoint}${NUMBER.value}`).then((data) => {
        
    data.forEach((name) => {RICHEST_PEOPLE.push(name.personName)});

    createList();
  });
  
  checkBtn.disabled = false;
}

/* запрос данных из API (без FetchWrapper)
async function getItemsFromAPI() {
  RICHEST_PEOPLE = [];
  const response = await fetch(
    `${global.apiURL}${global.endpoint}${NUMBER.value}`
  );
  const data = await response.json();
  data.forEach((name) => RICHEST_PEOPLE.push(name.personName));
  createList();
  checkBtn.disabled = false;
}*/

// insert list items into DOM
function createList() {
  LIST_ITEMS = [];

  [...RICHEST_PEOPLE]
  .map((a) => ({ value: a, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map((a) => a.value)
  .forEach((person, index) => {
    const listItem = document.createElement("li");

    //listItem.setAttribute('data-index', index);

    listItem.innerHTML = `
      <span class="number">${index + 1}</span>
      <div class="draggable" draggable="true">
        <p class="person-name">${person}</p>
        <i class="fas fa-grip-lines"></i>
      </div>
    `;

    LIST_ITEMS.push(listItem);

    draggable_list.appendChild(listItem);
  });

  addEventListeners();
}

// dragStart
function dragStart(e) {
  //DRAG_START_INDEX = +this.closest('li').getAttribute('data-index');

  dragSrcEl = this;// сохраняем в переменную весь перетаскиваемый узел

  e.dataTransfer.effectAllowed = "move";
  
  // сохраняем для перетаскивания только второй дочерний элемент узла
  e.dataTransfer.setData("text/html", this.children[1].innerHTML); 
}

// dragEnter
function dragEnter() {
  this.classList.add("over");
}

// dragOver
function dragOver(e) {
  e.preventDefault();
}

// dragDrop
function dragDrop(e) {
  //const dragEndIndex = +this.getAttribute('data-index');

  if (dragSrcEl !== this) {
    // присваеваем поочередно второму элементу перетаскиваемого узла значение целевого элемента
    dragSrcEl.children[1].innerHTML = this.children[1].innerHTML;
    // а целевому элементу - значение перетаскиваемого, сохраненное в объекте dataTransfer
    this.children[1].innerHTML = e.dataTransfer.getData("text/html");
  }

  // вызов функции для смены карточек
  //swapItems(DRAG_START_INDEX, dragEndIndex);

  this.classList.remove("over");
}

// dragLeave
function dragLeave() {
  this.classList.remove("over");
}

// check persons order
function checkOrder() {
  console.log(LIST_ITEMS)
  console.log(RICHEST_PEOPLE)
  LIST_ITEMS.forEach((listItem, index) => {
    const personName = listItem.querySelector(".draggable").innerText.trim();

    if (personName !== RICHEST_PEOPLE[index]) {
      listItem.classList.add("wrong");
    } else {
      listItem.classList.remove("wrong");
      listItem.classList.add("right");
    }
  });
}

// init listeners
function addEventListeners() {
  
  const dragListItems = document.querySelectorAll(".draggable-list li");

  dragListItems.forEach((item) => {
    item.addEventListener("dragstart", dragStart); // перетаскиваемый элемент
    item.addEventListener("dragover", dragOver); // выделенный элемент или текст перетаскивается на допустимую цель перетаскивания
    item.addEventListener("drop", dragDrop); // обрабатываем перемещение перетаскиваемого элемента из исходного контейнера в зону перетаскивания.
    item.addEventListener("dragenter", dragEnter); // перетаскиваемый элемент или выделенный текст попадает в допустимую цель перетаскивания
    item.addEventListener("dragleave", dragLeave); // перетаскиваемый элемент или выделенный текст покидают допустимую цель перетаскивания
  });
}

checkBtn.addEventListener("click", checkOrder); // кнопка проверки порядка


// обработка события ввода числа в поле и валидация
FORM.addEventListener("submit", (e) => {
  e.preventDefault();

  if (NUMBER.value === '') {
    NUMBER.classList.add("empty");
    alert("Add a number!");

  } else {
    NUMBER.classList.remove("empty");
    // получение данных из API
    getItemsFromAPI();
    
    draggable_list.innerHTML = "";
    NUMBER.value = "";
  }
});

// валидация поля ввода числа (отображение / скрытие красной рамки)
NUMBER.addEventListener("input", () => {
  if (NUMBER.value === '') {
    NUMBER.classList.add("empty");
    
  } else {
    NUMBER.classList.remove("empty");
  }
});

