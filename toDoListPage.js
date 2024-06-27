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
    const content = document.querySelector("form input").value;
    if(content)
    {
        toDoListObject.addItemToDBAndDom(content, false);
        document.querySelector("form input").value = "";
    }
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
        const itemId = listItem.id;
        toDoListObject.deleteListItemFromDBAndDom({content, isDone, parentId, itemId});
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
        const itemId = listItem.id;
        toDoListObject.updateListItemInDB({content, isDone, parentId, itemId});
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
        const itemId = listItem.id;
        toDoListObject.priorityUpForListItem({content, isDone, parentId, itemId});
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
        const itemId = listItem.id;
        toDoListObject.priorityDownForListItem({content, isDone, parentId, itemId});
    }
})