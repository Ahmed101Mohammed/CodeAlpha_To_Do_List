const listId = window.URL.parse(window.location.href).searchParams.get("listId");

// prevent accessing without to-do list
const preventAccessingWithoutToDoList = ()=>
{
    if(!listId)
    {
        window.location.href = "index.html";
    }
}
preventAccessingWithoutToDoList();

// set the global data 
const toDoList = JSON.parse(localStorage.getItem("db")).lists.find(list => 
    {
        return (list.id === listId);
    });
if(!toDoList)
{
    window.location.href = "index.html";
}

let toDoListObject = ToDoList(toDoList.title, toDoList.description, toDoList.date, toDoList.id, ...toDoList.items);
toDoListObject.setInToDoListPageDOM();

// add event for addig new list item to db and dom
const addNewListItem = document.querySelector("form button");
addNewListItem.addEventListener("click", (event) => {
    event.preventDefault();
    let errorMessageElement = document.querySelector(".error-message-container .error-message");
    const content = document.querySelector("form input").value;
    if(content)
    {
        const isSuccess = toDoListObject.addItemToDBAndDom(content, false)
        if(!isSuccess)
        {
            errorMessageElement.textContent = "List item with this content already exists, please choose another one";
        }
        else
        {
            errorMessageElement.textContent = "";
            document.querySelector("form input").value = "";
        }
    }
    else
    {
        errorMessageElement.textContent = "Please enter content";
    }
})

// add event to clear error message in the input is in onchange
const input = document.querySelector("form input");
input.addEventListener("input", ()=>
{
    let errorMessageElement = document.querySelector(".error-message-container .error-message");
    errorMessageElement.textContent = "";
})
// add event for delete button
const listItemsContainer = document.querySelector("ul");
listItemsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("delete-item"))
    {
        const listItem = event.target.parentNode.parentNode.parentNode;
        const parentId = listItem.classList[0];
        const content = listItem.querySelector("p").textContent;
        const isDone = listItem.querySelector("input").checked;
        const id = listItem.id;
        toDoListObject.deleteListItemFromDBAndDom({content, isDone, parentId, id});
    }
})

// add event for check button
listItemsContainer.addEventListener("click", (event) => {
    if(event.target.tagName == "INPUT")
    {
        const listItem = event.target.parentNode.parentNode;
        const parentId = listItem.classList[0];
        const content = listItem.querySelector("p").textContent;
        const isDone = listItem.querySelector("input").checked;
        const id = listItem.id;
        toDoListObject.updateListItemInDB({content, isDone, parentId, id});
    }
})

// item-list-up click event: change the item-list order in the db, and dom to be more previous
listItemsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("item-up"))
    {
        const listItem = event.target.parentNode.parentNode.parentNode;
        const parentId = listItem.classList[0];
        const content = listItem.querySelector("p").textContent;
        const isDone = listItem.querySelector("input").checked;
        const id = listItem.id;
        toDoListObject.priorityUpForListItem({content, isDone, parentId, id});
    }
})

// item-list-down click event: change the item-list order in the db, and dom to be more next
listItemsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("item-down"))
    {
        const listItem = event.target.parentNode.parentNode.parentNode;
        const parentId = listItem.classList[0];
        const content = listItem.querySelector("p").textContent;
        const isDone = listItem.querySelector("input").checked;
        const id = listItem.id;
        toDoListObject.priorityDownForListItem({content, isDone, parentId, id});
    }
})

// add event for storage change
addEventListener("storage", (event) => 
{
    const dbStatus = JSON.parse(localStorage.getItem("db")).status;
    const listId = dbStatus.effectedListId;

    if(dbStatus.name === "DeletingItem" ||
        dbStatus.name === "AddingNewItem" ||
        dbStatus.name === "UpdatingItemData" ||
        dbStatus.name === "UpdatingItemPeriority"
    )
    {
        const listItemsContainer = document.querySelector("main ul");
        listItemsContainer.innerHTML = "";
        const targetList = JSON.parse(localStorage.getItem("db")).lists.find(list => list.id === listId);
        const targetListObject = ToDoList(targetList.title, targetList.description, targetList.date, targetList.id, ...targetList.items);
        targetListObject.addItemsToDom();
    }
});

// add event for editing listItem
let previousListItemContent = "";
listItemsContainer.addEventListener("click", (event) => 
{
    if(event.target.nodeName == "P")
    {
        let listConentElement = event.target;
        previousListItemContent = listConentElement.textContent;
        listConentElement.setAttribute("contenteditable", "true");
        listConentElement.focus();
        listConentElement.classList.add("editable-element")
    }
})

listItemsContainer.addEventListener("focusout", (event) => 
{
    if(event.target.nodeName == "P")
    {
        let listConentElement = event.target;
        let currentListItemContent = listConentElement.textContent;
        listConentElement.setAttribute("contenteditable", "false");
        listConentElement.classList.remove("editable-element")

        if(currentListItemContent === previousListItemContent)
        {
            return;
        }
        // change in db
        let listItem = listConentElement.parentNode.parentNode;
        const parentId = listItem.classList[0];
        const content = listConentElement.textContent;
        const isDone = listItem.querySelector("input").checked;
        const id = listItem.id;
        const isSuccess = toDoListObject.updateListItemInDB({content, isDone, parentId, id});

        if(!isSuccess)
        {
            listConentElement.textContent = previousListItemContent;
        }
    }
})

// add event for editing description
const descriptionContainer = document.querySelector("header .list-description");
const previousDescription = descriptionContainer.textContent;
descriptionContainer.addEventListener("click", (event) => 
{
    let descriptionElement = event.target;
    descriptionElement.setAttribute("contenteditable", "true");
    descriptionElement.focus();
    descriptionElement.classList.add("editable-element")
})

descriptionContainer.addEventListener("focusout", (event) => 
{
    let descriptionElement = event.target;
    descriptionElement.setAttribute("contenteditable", "false");
    descriptionElement.classList.remove("editable-element")
    const currentDescription = descriptionContainer.textContent;
    if(currentDescription === previousDescription)
    {
        return;
    }
    // change in db
    toDoListObject.description = descriptionElement.textContent;
    const isSuccess = toDoListObject.updateListInDB();

    if(isSuccess)
    {
       temperoryMessage("List description updated successfuly");
    }
    else
    {
        temperoryMessage("List description updated failed: may due to empty description");
        descriptionContainer.textContent = previousDescription;
    } 
})

// add event for editing title
const titleContainer = document.querySelector("header .list-title");
const previousTitle = titleContainer.textContent;
titleContainer.addEventListener("click", (event) => 
{
    let titleElement = event.target;
    titleElement.setAttribute("contenteditable", "true");
    titleElement.focus();
    titleElement.classList.add("editable-element")
})

titleContainer.addEventListener("focusout", (event) => 
{
    let titleElement = event.target;
    titleElement.setAttribute("contenteditable", "false");
    titleElement.classList.remove("editable-element")
    const currentTitle = titleContainer.textContent;
    if(currentTitle === previousTitle)
    {
        return;
    }
    // change in db
    toDoListObject.title = titleElement.textContent;
    const isSuccess = toDoListObject.updateListInDB();

    if(isSuccess)
    {
       temperoryMessage("List title updated successfuly");
    }
    else
    {
        temperoryMessage("List title updated failed: may due to empty title or duplicate title");
        titleContainer.textContent = previousTitle;
    } 
})