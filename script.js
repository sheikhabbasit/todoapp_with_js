"use strict";
// Global variables
const addTaskBtn = document.getElementById("add-task-button");
const form = document.querySelector("form");
const inputData = document.querySelector(".text-area");
const submitBtn = document.querySelector(".submit");
const container = document.querySelector(".container");
const deleteBtn = document.querySelectorAll(".dlt");
const hideNoTasksFound = document.querySelector(".empty");
let data = localStorage.getItem("data")
  ? JSON.parse([localStorage.getItem("data")])
  : [];
// Function that runs only once to load the data from array at the start if there is something in cookies
function initialListRender() {
  if (data.length > 0) {
    hideNoTasksFound.classList.add("hide");
    data.forEach((item) => renderList(item.task, item.idName));
  }
}
initialListRender();

//
// Submit Button initiates function submit form
submitBtn.addEventListener("click", submitForm);

// Submit Form function
function submitForm(e) {
  e.preventDefault();

  // Prevents from submitting empty form
  if (inputData.value.length === 0) {
    inputData.style.border = "3px solid red";
    inputData.focus();
    return;
  }

  // Takes data from form, stores in object
  const obj = {
    task: inputData.value,
    idName: Math.random().toFixed(4),
  };

  // Pushes data into array as well as local storage
  data.push(obj);
  localStorage.setItem("data", JSON.stringify(data));

  // If it's the first element that was pushed, this runs
  if (data.length === 1) initialListRender();

  // Clears input value, hides the form
  inputData.value = "";
  toggleFormState(false);

  // Takes the last element that was pushed to array and renders it
  if (data.length > 1)
    renderList(data[data.length - 1].task, data[data.length - 1].idName);
}

// Renders the new element to the DOM
function renderList(name, idName) {
  container.insertAdjacentHTML(
    "afterbegin",
    `<div idName="${idName}" class="dark-wrapper task">
    <div class="task-name">
      <h3>${name}</h3>
    </div>
    <div class="align-buttons">
      <button class="btn btn-small"><span class="material-icons">
        edit
        </span></i></button>
      <button class="btn btn-small dlt"><span class="material-icons">delete</span></button>
    </div>
  </div>`
  );
}

//*****//
//*****//
//*****//

// Sets an event listener on whole list container rather than individual elements, using event bubbling and capturing
container.addEventListener("click", function (e) {
  // We get two clicks on each button, one when I click on the icon, one when I click on the rest of the button body, based on that, I declare 4 vaariables depending upon the kind of event.

  const editSpanClick = e.target.parentNode.parentNode.parentElement;
  const editButtonClick = e.target.parentNode.parentElement;
  const deleteSpanClick = e.target.parentNode.parentNode.parentElement;
  const deleteButtonClick = e.target.parentNode.parentElement;

  // When I click on the Edit Button
  if (e.target.innerText === "edit") {
    // Checks if the click happened on the icon
    if (e.target.tagName === "SPAN") {
      // Sends data to a helper function to delete the HTML element
      let id = editSpanClick.getAttribute("idName");
      // calls the function which deletes the original element, transfers its value to the input form for editing
      deleteAndEdit(editSpanClick, id);
    }
    // if the click happens on the rest of the button other than icon
    if (e.target.tagName === "BUTTON") {
      // Same delete logic as in the above if block
      let id = editButtonClick.getAttribute("idName");
      deleteAndEdit(editButtonClick, id);
    }
  }

  // When I click on delete button. With same logic as above block.
  if (e.target.innerText === "delete") {
    if (e.target.tagName === "SPAN") {
      let id = deleteSpanClick.getAttribute("idName");
      // this delete function only deletes the HTML element we want to
      deleteOnly(deleteSpanClick, id);
    }
    if (e.target.tagName === "BUTTON") {
      let id = deleteButtonClick.getAttribute("idName");
      deleteOnly(deleteButtonClick, id);
    }
  }
});

// Helper function to delete the original HTML element and transfers its value to input field
function deleteAndEdit(spanOrButton, id) {
  toggleFormState(true);
  inputData.value = spanOrButton.childNodes[1].innerText;
  inputData.focus();
  spanOrButton.remove();
  deleteItem(id);
}

// Helper function to delete the HTML element
function deleteOnly(spanOrButton, id) {
  spanOrButton.remove();
  deleteItem(id);
}

// Implements the logic to delete the items from the data array as well as localStorage
function deleteItem(id) {
  // filters the data from array, removes the deleted item with the help of id, stores filtered data in a new array
  const tempData = data.filter((item) => item.idName !== id);
  // empties array
  data = [];
  // fills array with filtered data
  data = tempData;
  // sets the localStorage with the filtered array
  localStorage.setItem("data", JSON.stringify(data));
}

// This function is responsible for toggling the form

function toggleFormState(state) {
  if (state) {
    addTaskBtn.classList.add("hide");
    form.classList.remove("hide");
    inputData.focus();
  } else {
    form.classList.add("hide");
    addTaskBtn.classList.remove("hide");
  }
}
