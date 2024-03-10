// Hello world! //

// [+] For High Performance
const $ = document;
  
// [+] Variables
let loadingSection       = $.querySelector(".loading-section");
let userInput            = $.querySelector("#userInputTask");
let createdCounterElem   = $.querySelector("#createdCount");
let completedCounterElem = $.querySelector("#completeCount");
let tasks                = $.querySelector(".todos-container");
let rocket               = $.querySelector(".rocket");
let rocketTitle          = $.querySelector(".rocketTitle");
const addTaskBtn         = $.querySelector("#addTaskBtn");

// [+] Flag Variable
let CounterID = 0;

// [+] Local Variable
let userTasks = [];

// [+] Functions
function loadingSectionHandler(){
    setTimeout(() => {
        loadingSection.remove();
    }, 3000)
}
function getTodoFromLocal(){
    if(localStorage.getItem("TodoItems")){
        userTasks = JSON.parse(localStorage.getItem("TodoItems"))
        CounterID = (userTasks[userTasks.length-1].id);
        tasks.classList.add("notEmpty")
        todosGenerator(userTasks);
    }
}
function checkValidectionTask(){
    let taskVale = userInput.value.trim();

    if(taskVale){
        setupTodo(taskVale);
    }else{
        invalidInput();
    }
}
function setupTodo(taskValue){
    userInput.style.borderColor = "var(--color-gray700)";
    userInput.value = "";
    let newTodo = {
        id : (CounterID + 1),
        taskContent : taskValue,
        isDoing: false
    };
    userTasks.push(newTodo);
    if(userTasks.length === 1){
        tasks.classList.add("notEmpty");
    }
    CounterID++;
    localStorage.setItem("localID", JSON.stringify(CounterID));
    localStorage.setItem("TodoItems", JSON.stringify(userTasks));
    todosGenerator(userTasks);
}
function invalidInput(){
    userInput.style.borderColor = "#92130B";
}
function todosGenerator(allTodo){
    tasks.innerHTML = null;
    if(allTodo.length > 0){
        allTodo.forEach((todo) => {
            tasks.insertAdjacentHTML(
                "beforeend",
                `
                <div class="todo d-flex alg-itm-cntr">
                    <input type="checkbox" class="checkbox" id="checkbox${todo.id}" ${concatIsDoingToTask(todo.isDoing)} hidden>
                    <label for="checkbox${todo.id}" data-id="${todo.id}" class="checkbox-label d-flex jst-cnt-cntr alg-itm-cntr">
                        <i class="fa fa-check"></i>
                    </label>
                    <span class="todo-value" style="${styleIsDoingToTask(todo.isDoing)}">${todo.taskContent}</span>
                    <img src="Asset/Picture/trash.svg" alt="trash" class="delete-btn" data-id="${todo.id}">
                </div>
            `
            );
            // [+] Variables
            let checkboxElems = $.querySelectorAll(".checkbox-label");
            let deleteTaskBtn = $.querySelectorAll(".delete-btn");
            // [+] Events
            checkboxElems.forEach((checkbox) => {
                checkbox.addEventListener("click", doTaskHandler)
            })
            deleteTaskBtn.forEach((button) => {
                button.addEventListener("click", deleteTaskHandler)
            })
        });
    }else{
        tasks.classList.remove("notEmpty");
        tasks.innerHTML = `<div class="empty d-flex alg-itm-cntr">
                    <img src="Asset/Picture/Clipboard.svg" alt="clipboard picture">
                    <span class="empty-text">
                        <span>You don't have tasks registered yet</span>
                        <br>
                        <span>Create tasks and organize your to-do items</span>
                    </span>
                </div>`;
    }
    calcCreatedCount();
    calcCompletedCount();
}
function doTaskHandler(event){
    let taskID = Number(event.target.dataset.id);
    let findTaskIndex = userTasks.findIndex((todo) => {
        return todo.id === taskID;
    });
    if(userTasks[findTaskIndex].isDoing === false){
        userTasks[findTaskIndex].isDoing = true;
        event.target.nextElementSibling.style.cssText = "text-decoration: line-through;color: var(--color-gray300);";
    }else{
        userTasks[findTaskIndex].isDoing = false;
        event.target.nextElementSibling.style.cssText = "text-decoration: none;color: var(--color-gray100);";
    }
    localStorage.setItem("TodoItems", JSON.stringify(userTasks));
    calcCompletedCount();
}
function concatIsDoingToTask (bool = "") {
    if (bool) {
        return "checked";
    }
}
function styleIsDoingToTask (bool = "") {
    if (bool) {
        return "text-decoration: line-through;color: var(--color-gray300);";
    }else{
        return "text-decoration: none;color: var(--color-gray100);";
    }
}
function deleteTaskHandler(event){
    let taskID = Number(event.target.dataset.id);
    let findTaskIndex = userTasks.findIndex((todo) => {
        return todo.id === taskID;
    });
    userTasks.splice(findTaskIndex, 1);
    localStorage.setItem("TodoItems", JSON.stringify(userTasks));
    todosGenerator(userTasks);
}
function calcCreatedCount(){
    if(userTasks.length !== 0){
        createdCounterElem.innerHTML = userTasks.length.toString();
    }else{
        createdCounterElem.innerHTML = '0';
    }
}
function calcCompletedCount(){
    let counter = 0;
    if(userTasks.length > 0){
        userTasks.forEach((todo) => {
            if(todo.isDoing === true){
                counter++;
            }
        })
    }
    completedCounterElem.innerHTML = counter.toString();
}
function rocketAnimationHandler(){
    rocket.remove();
    writeHeaderAnimate();
}
function writeHeaderAnimate(){
    let perText    = "todo";
    let targetText = "todo list";
    let firstWord = ""
    let counter    = perText.length;
    rocketTitle.innerHTML = perText;

    let deleteText = setInterval(() => {
        rocketTitle.innerHTML = perText.substring(0, counter);
        counter--;
        if(counter === -1){
            counter = 0;
            clearInterval(deleteText);
            rocketTitle.style.cssText = "gap:5px;margin-left: 62px;";

            let reWrite = setInterval(() => {
                rocketTitle.innerHTML += targetText[counter];
                counter++;
                if(counter === targetText.search(' ')){
                    rocketTitle.innerHTML = `<span>${rocketTitle.innerHTML}</span> `
                    firstWord = rocketTitle.innerHTML;
                }
                if(counter === targetText.length + 1){
                    rocketTitle.innerHTML =  firstWord + `<span>${targetText.substring(targetText.search(' '), targetText.length)}</span>`
                    clearInterval(reWrite);
                }
            },400)
        }
    },200);
}

// [+] Events
addTaskBtn.addEventListener("click", checkValidectionTask);
rocket.addEventListener("animationend", rocketAnimationHandler);
window.addEventListener("load", () => {
    loadingSectionHandler();
    getTodoFromLocal();
});
userInput.addEventListener("keydown", (event) => {
    if(event.key === "Enter"){
        checkValidectionTask();
    }
});
