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
const toDoList = JSON.parse(localStorage.getItem("lists")).find(list => 
    {
        let listObject = ToDoList(list.title, list.discription, list.date, ...list.items);
        return (listObject.convertTitleToDashedLowerCase() === listId);
    });
if(!toDoList)
{
    window.location.href = "index.html";
}

let toDoListObject = ToDoList(toDoList.title, toDoList.description, toDoList.date, ...toDoList.items);
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
        const listItem = event.target.parentNode.parentNode;
        const parentIdFormat = listItem.classList[0];
        const content = listItem.querySelector("p").textContent;
        const isDone = listItem.querySelector("input").checked;
        toDoListObject.deleteListItemFromDBAndDom({content, parentIdFormat, isDone});
    }
})

// add event for check button
listItemsContainer.addEventListener("click", (event) => {
    if(event.target.tagName == "INPUT")
    {
        const listItem = event.target.parentNode.parentNode;
        const parentIdFormat = listItem.classList[0];
        const content = listItem.querySelector("p").textContent;
        const isDone = listItem.querySelector("input").checked;
        toDoListObject.updateListItemInDB({content, parentIdFormat, isDone});
    }
})