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
let toDoListObject;
const initPage = ()=>
{
    const toDoList = JSON.parse(localStorage.getItem("db")).lists.find(list => 
        {
            return (list.id === listId);
        });
    if(!toDoList)
    {
        window.location.href = "index.html";
    }
    toDoListObject = ToDoList(toDoList.title, toDoList.description, toDoList.date, toDoList.id, ...toDoList.items);
    toDoListObject.setInToDoListPageDOM();
}    
initPage();

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

// Scan for items and reorder in DB
const scanItemsAndReorder = () => {
    let db = JSON.parse(localStorage.getItem("db"));
    let lists = db.lists;
    let targetList = lists.find(list => list.id === listId);
    let items = targetList.items;
    let itemsUI = document.querySelector("ul.items").querySelectorAll(".item");
    let newItems = [];
    for(let i = 0; i < itemsUI.length; i++)
    {
        const itemId = itemsUI[i].id;
        const item = items.find(item => item.id === itemId);
        if(item){newItems.push(item);}
    }
    if(newItems.length > 0)
    {
        targetList.items = newItems;
        localStorage.setItem("db", JSON.stringify(db));
    }
}

// remove all items
const removeAllItems = () => {
    let itemsContainer = document.querySelector("ul.items");
    const itmes = itemsContainer.querySelectorAll(".item");
    itmes.forEach(item => {
        item.remove();
    })
}

// is accepted items order
const isAcceptedItemsOrder = () => 
{
    const items = document.querySelector("ul.items").querySelectorAll(".item");
    const itemsdb = JSON.parse(localStorage.getItem("db")).lists.find(list => list.id == listId).items;
    let allowedDone = false;

    for(let i = 0; i < items.length; i++)
    {
        const itemId = items[i].id;
        const item = itemsdb.find(item => item.id === itemId);
        console.log({item, allowedDone})
        if(item && item.isDone !== allowedDone && allowedDone === false)
        {
            allowedDone = true;
        }
        
        if(!item || item.isDone !== allowedDone)
        {
            return false;
        }
    }
    return true;    
}
// draging lap
    // helpers
const getParentWithThisClass = (element, className) => {
    let parent = element;
    while(parent)
    {
        if(parent.classList.contains(className))
        {
            return parent;
        }
        parent = parent.parentElement;
    }
    return false;
}

let globalId = "";
let drageditem;
const itemsContainer = document.querySelector("ul.items");
itemsContainer.addEventListener("dragstart", (event) => {
    if(event.target.classList.contains("item"))
    {
        drageditem = event.target;
        globalId = event.target.id;
        event.target.classList.add("hide-draggable");
    }
})

itemsContainer.addEventListener("dragover", (event) => {
    if(drageditem.style.position !== "absolute")
    {
        drageditem.style.position = "absolute";
    }
    const psudoItem = `
                        <div class="psodu-item">

                        </div>
                        `
    // Get the current mouse position
    const mouseX = window.event.clientX;
    const mouseY = window.event.clientY;

    // Use elementFromPoint to get the element at the mouse position
    const element = document.elementFromPoint(mouseX, mouseY);
    const parent = getParentWithThisClass(element, "item");
    if(parent && parent.id !== globalId)
    {
        const parentDimentions = parent.getBoundingClientRect();
        const middle = parentDimentions.top + parentDimentions.height / 2;
        if(mouseY < middle)
        {   
            if (!parent.previousElementSibling  || !parent.previousElementSibling.classList.contains("psodu-item"))
            {
                if(document.querySelector(".psodu-item"))
                {
                    document.querySelector(".psodu-item").remove();
                }
                parent.insertAdjacentHTML("beforebegin", psudoItem);
            }
        }
        else
        {
            if(!parent.nextElementSibling || !parent.nextElementSibling.classList.contains("psodu-item"))
            {
                if(document.querySelector(".psodu-item"))
                {
                    document.querySelector(".psodu-item").remove();
                }
                parent.insertAdjacentHTML("afterend", psudoItem);    
            }
            
        }

    }
})

itemsContainer.addEventListener("dragend", (event) => {
    const psudoItem = document.querySelector(".psodu-item");
    const realCard = document.querySelector(`#${globalId}`);
    realCard.classList.remove("hide-draggable");
    drageditem.style.removeProperty("position");
    if(psudoItem && realCard)
    {
        psudoItem.insertAdjacentElement("afterend", realCard);
        psudoItem.remove();
        if(isAcceptedItemsOrder())
        {
            scanItemsAndReorder();
            removeAllItems();
            initPage();
        }
        else
        {
            temperoryMessage("Items order not accepted: always done items should be at the end of the list");
            removeAllItems();
            initPage();
        }
    }
})