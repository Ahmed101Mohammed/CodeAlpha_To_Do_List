// application DB
if(!localStorage.getItem("db"))
{
    localStorage.clear();
    console.log("DB created");
    localStorage.setItem("db", JSON.stringify({
        lists: [introductionAppToDoList],
        status: {name: "Ready", effectedListId: ""}
    }));
}

// evenr for plus sign to create new to-do-list
const addSign = document.querySelector("aside .material-symbols-outlined");
addSign.addEventListener("click", () => {
    const titleInput = document.querySelector(".add-new-list-form input[name='title']");
    const descriptionInput = document.querySelector(".add-new-list-form input[name='description']");
    const errorMessageElement = document.querySelector(".add-new-list-form .error-message");
    titleInput.value = "";
    descriptionInput.value = "";
    errorMessageElement.textContent = "";
    
    const addNewListForm = document.querySelector(".add-new-list-form");
    addNewListForm.style.display = "flex";
})

// event for close add new list form
const closeBtn = document.querySelector(".add-new-list-form .close span");
closeBtn.addEventListener("click", () => {
    const addNewListForm = document.querySelector(".add-new-list-form");
    addNewListForm.style.display = "none";
})

const addNewListFormContainer = document.querySelector(".add-new-list-form");
addNewListFormContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("add-new-list-form"))
    {
        const addNewListForm = document.querySelector(".add-new-list-form");
        addNewListForm.style.display = "none";
    }
})

// event for add button
const addBtn = document.querySelector(".add-new-list-form button");
addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const titleInput = document.querySelector(".add-new-list-form input[name='title']");
    const descriptionInput = document.querySelector(".add-new-list-form input[name='description']");
    const title = titleInput.value;
    const description = descriptionInput.value;
    const errorMessageElement = document.querySelector(".add-new-list-form .error-message");
    const addingTasksDirectlyStatus = document.querySelector(".add-new-list-form .adding-tasks-directly input").checked;
    if(title && description) 
    {
        const list = ToDoList(title, description);
        errorMessageElement.textContent = "";
        const isSuccess = list.addToDoListToDBAndDOM();
        
        if(!isSuccess)
        {
            errorMessageElement.textContent = "List with this title already exists, please choose another one";
        }
        else
        {
            const isNoListsExists = document.querySelector(".no-lists");
            if(isNoListsExists){noListsAppearance(false);}
            if(addingTasksDirectlyStatus)
            {
                window.open(`to-do-list-page.html?listId=${list.id}`, "_blank");
            }
            const addNewListForm = document.querySelector(".add-new-list-form");
            addNewListForm.style.display = "none";
            temperoryMessage("New list added successfuly");
        }
    }
    else
    {
        errorMessageElement.textContent = "Please enter title and description";
    }
})

// clear error message if the user make any input
const titleInput = document.querySelector(".add-new-list-form input[name='title']");
const descriptionInput = document.querySelector(".add-new-list-form input[name='description']");
titleInput.addEventListener("input", ()=>
{
    const errorMessageElement = document.querySelector(".add-new-list-form .error-message");
    errorMessageElement.textContent = "";
})

descriptionInput.addEventListener("input", ()=>
{
    const errorMessageElement = document.querySelector(".add-new-list-form .error-message");
    errorMessageElement.textContent = "";
})

// event for delete button
const lestsContainer = document.querySelector(".lists-cards-container");
lestsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("delete"))
    {
        // delete list-card from DOM
        const listDom = event.target.parentNode.parentNode;
        const listId = listDom.id;
        let targetlist = JSON.parse(localStorage.getItem("db")).lists.find(list =>
            {
                return list.id == listId;
            }
        )

        let targetListObject = ToDoList(targetlist.title, targetlist.description, targetlist.date, targetlist.id, ...targetlist.items);
        const isSuccess = targetListObject.deleteFromDBAndDom();
        if(isSuccess)
        {
            temperoryMessage("List deleted successfuly");
            const lists = listsContainer.querySelectorAll(".to-do-list-card");
            if(lists.length === 0)
            {
                noListsAppearance(true);
            }
        }
    }
})

// appearance of .no-lists element
const noListsAppearance = (status) => {
    const noListsElement = document.querySelector(".no-lists");
    if(status)
    {
        noListsElement.style.display = "flex";
    }
    else
    {
        noListsElement.style.removeProperty("display");
    }
}

// set predefined lists from local storage
const initIndexPage = () => {
    const lists = JSON.parse(localStorage.getItem("db")).lists;
    lists.forEach(list => {
        let newList = ToDoList(list.title, list.description, list.date, list.id, ...list.items);
        newList.addToDom();
    })
    if(lists.length === 0)
    {
        noListsAppearance(true);
    }
}
initIndexPage();
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

        let targetlist = JSON.parse(localStorage.getItem("db")).lists.find(list =>
            {
                return list.id == listId;
            }
        )        
        let targetListObject = ToDoList(targetlist.title, targetlist.description, targetlist.date, targetlist.id, ...targetlist.items);
        targetListObject.priorityUp();
    }
})

// list-down click event: change the list order in the db, and dom to be more next
listsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("list-down"))
    {
        const list = event.target.parentNode.parentNode.parentNode;
        const listId = list.id;

        let targetlist = JSON.parse(localStorage.getItem("db")).lists.find(list =>
            {
                return list.id == listId;
            }
        )        
        let targetListObject = ToDoList(targetlist.title, targetlist.description, targetlist.date, targetlist.id, ...targetlist.items);
        targetListObject.priorityDown();
    }
})

// Trager new change in DB (LocalStorage)
addEventListener("storage", (event) => 
{
    const dbStatus = JSON.parse(localStorage.getItem("db")).status;
    const listId = dbStatus.effectedListId;
    if(dbStatus.name === "UpdatingItemData" ||
        dbStatus.name === "DeletingItem" ||
        dbStatus.name === "AddingNewItem"
    )
    {
        let targetList = JSON.parse(localStorage.getItem("db")).lists.find(list =>
            {
                return list.id == listId;
            }
        )        
        let targetListObject = ToDoList(targetList.title, targetList.description, targetList.date, targetList.id, ...targetList.items);
        targetListObject.updateProgressComponentLive();
    }
    else if (dbStatus.name === "DeletingList")
    {
        temperoryMessage("List deleted successfuly")

        const listCard = document.querySelector(`#${listId}`);
        listCard.remove();
    }
    else if(dbStatus.name === "AddingNewList")
    {
        temperoryMessage("New list added successfuly");
        const addedList = JSON.parse(localStorage.getItem("db")).lists.find(list => list.id === listId);
        let addedListObject = ToDoList(addedList.title, addedList.description, addedList.date, addedList.id, ...addedList.items);
        addedListObject.addToDom();
    }
    else if(dbStatus.name === "UpdatingList")
    {
        const targetList = JSON.parse(localStorage.getItem("db")).lists.find(list =>
            {
                return list.id == listId;
            }
        )        
        let targetListObject = ToDoList(targetList.title, targetList.description, targetList.date, targetList.id, ...targetList.items);
        targetListObject.updateListInDom();
    }
});

// search for a list
const searchInput = document.querySelector("form.search input");
searchInput.addEventListener("input", ()=>
{
    let results = 0;
    const value = searchInput.value;
    const listsContainer = document.querySelector(".lists-cards-container");
    const lists = listsContainer.querySelectorAll(".to-do-list-card");
    lists.forEach(list => {
        if(list.querySelector("h2").textContent.toLowerCase().startsWith(value.toLowerCase()))
        {
            results += 1;
            noListsAppearance(false);
            list.style.display = "flex";
            if(value !== "")
            {
                list.querySelector(".up-down").style.display = "none";
            }
            else
            {
                list.querySelector(".up-down").style.removeProperty("display");
            }
        }
        else
        {
            list.style.display = "none";
        }
    })

    const listsLinksContainer = document.querySelector(".lists-links");
    const listsLinks = listsLinksContainer.querySelectorAll(".list-link");
    listsLinks.forEach(listLink => {
        if(listLink.querySelector("a").textContent.toLowerCase().startsWith(value.toLowerCase()))
        {
            listLink.style.display = "flex";
        }
        else
        {
            listLink.style.display = "none";
        }
    })

    if(results === 0)
    {
        noListsAppearance(true);
    }
})