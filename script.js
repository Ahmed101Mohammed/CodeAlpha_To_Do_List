// application DB
if(!localStorage.getItem("lists", JSON.stringify([])))
{
    console.log("DB created");
    localStorage.setItem("lists", JSON.stringify([introductionAppToDoList]));
}

// evenr for plus sign to create new to-do-list
const addSign = document.querySelector("aside .material-symbols-outlined");
addSign.addEventListener("click", () => {
    const addNewListForm = document.querySelector(".add-new-list-form");
    addNewListForm.style.display = "flex";
})

// event for close button
const closeBtn = document.querySelector(".add-new-list-form .close");
closeBtn.addEventListener("click", () => {
    const addNewListForm = document.querySelector(".add-new-list-form");
    addNewListForm.style.display = "none";
})

// event for add button
const addBtn = document.querySelector(".add-new-list-form button");
addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const titleInput = document.querySelector(".add-new-list-form input[name='title']");
    const descriptionInput = document.querySelector(".add-new-list-form input[name='description']");
    const title = titleInput.value;
    const description = descriptionInput.value;

    if(title && description) 
    {
        const list = ToDoList(title, description);
        list.addToDoListToDBAndDOM();
    }

    titleInput.value = "";
    descriptionInput.value = "";
    const addNewListForm = document.querySelector(".add-new-list-form");
    addNewListForm.style.display = "none";
})


// event for delete button
const lestsContainer = document.querySelector(".lists-cards-container");
lestsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("delete"))
    {
        // delete list-card from DOM
        const listDom = event.target.parentNode.parentNode;
        const listId = listDom.id;
        let targetlist = JSON.parse(localStorage.getItem("lists")).find(list =>
            {
                const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                return listObject.convertTitleToDashedLowerCase() == listId;
            }
        )

        let targetListObject = ToDoList(targetlist.title, targetlist.description, targetlist.date, ...targetlist.items);
        targetListObject.deleteFromDBAndDom();
    }
})

// set predefined lists from local storage
const lists = JSON.parse(localStorage.getItem("lists"));
lists.forEach(list => {
    let newList = ToDoList(list.title, list.description, list.date, ...list.items);
    newList.addToDom();
})

// list title click event => moving to to-do-list-page
lestsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("list-tilte"))
    {
        // detect list-card from DOM
        const list = event.target.parentNode.parentNode.parentNode;
        const listId = list.id;

        window.open(`to-do-list-page.html?listId=${listId}`, "_blank");
    }
})

// add click event for nav-btn
const navBtns = document.querySelector(".nav-btn");
navBtns.addEventListener("click", (event) => {
    const aside = document.querySelector("aside");
    if(aside.style.display == "flex")
    {
        aside.style.removeProperty("display");
        navBtns.querySelector('span').textContent = "menu";
    }
    else
    {
        aside.style.display = "flex";
        navBtns.querySelector('span').textContent = "close";
    }
})


// when click in link of aside when window width is less than 480px => close aside
const aside = document.querySelector("aside");
aside.addEventListener("click", (event) => {
    if(event.target.nodeName == "A" && window.innerWidth < 700)
    {
        aside.style.removeProperty("display");
        navBtns.querySelector('span').textContent = "menu";
    }
})

// list-up click event: change the list order in the db, and dom to be more previous
const listsContainer = document.querySelector(".lists-cards-container");
listsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("list-up"))
    {
        const list = event.target.parentNode.parentNode.parentNode;
        const listId = list.id;

        let targetlist = JSON.parse(localStorage.getItem("lists")).find(list =>
            {
                const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                return listObject.convertTitleToDashedLowerCase() == listId;
            }
        )        
        let targetListObject = ToDoList(targetlist.title, targetlist.description, targetlist.date, ...targetlist.items);
        targetListObject.priorityUp();
    }
})

// list-down click event: change the list order in the db, and dom to be more next
listsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("list-down"))
    {
        const list = event.target.parentNode.parentNode.parentNode;
        const listId = list.id;

        let targetlist = JSON.parse(localStorage.getItem("lists")).find(list =>
            {
                const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                return listObject.convertTitleToDashedLowerCase() == listId;
            }
        )        
        let targetListObject = ToDoList(targetlist.title, targetlist.description, targetlist.date, ...targetlist.items);
        targetListObject.priorityDown();
    }
})