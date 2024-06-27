const ListItem = (content, isDone, parentId, id)=>
    {
        return {
            content,
            isDone,
            parentId,
            id: id? id : `item${Date.now()}`,
            htmlCode()
            {
                return `
                    <li class="${parentId} ${this.isDone? "done-list-item" : ""}" id="${this.id}"> 
                        <div class="body">
                            <input type="checkbox" ${this.addCheckedAttribute()}>
                            <p>${content}<p>
                        </div> 
                        <div class="sittings">
                            <div class="up-down">
                                <span class="material-symbols-outlined item-up">
                                    keyboard_arrow_up
                                </span>
                                <span class="material-symbols-outlined item-down">
                                    keyboard_arrow_down
                                </span>
                            </div>
                            <div class="close">
                                <span class="material-symbols-outlined delete-item delete-item">close</span>
                            </div>
                        </div>
                    </li>
                `
            },
            addCheckedAttribute()
            {
                if(isDone)
                {
                    return "checked";
                }
                return "";
            },
            addToDom()
            {
                const ul = document.querySelector("ul");
                ul.insertAdjacentHTML("beforeend", this.htmlCode());
            },
            addListItemToDBAndDOM()
            {
                let db = JSON.parse(localStorage.getItem("db"));
                let lists = db.lists;
                const targetList = lists.find(list =>
                    {
                        return list.id === parentId;
                    }
                );
    
                const listItem = targetList.items.find(item => item.content === this.content);
                if(listItem){return false};

                // first done item index 
                const firstDoneItemIndex = targetList.items.findIndex(item => item.isDone);
                if(firstDoneItemIndex === -1)
                {
                    targetList.items.push({content: this.content, isDone: this.isDone, parentId: this.parentId, id: this.id});
                }
                else
                {
                    targetList.items.splice(firstDoneItemIndex, 0, {content: this.content, isDone: this.isDone, parentId: this.parentId, id: this.id});
                }
               
                db.status = {name: "AddingNewItem", effectedListId: this.parentId};
                localStorage.setItem("db", JSON.stringify(db));
    
                this.addToDom();
                this.updateListItemPositionInUI();
                return true;
            },
            deleteFromDBAndDom()
            {
                let db = JSON.parse(localStorage.getItem("db"));
                let lists = db.lists;
                let targetList = lists.find(list => 
                {
                    return list.id === this.parentId
                });
                targetList.items = targetList.items.filter(item => item.content !== this.content);
                db.status = {name: "DeletingItem", effectedListId: this.parentId};
                localStorage.setItem("db", JSON.stringify(db));
                this.deleteListItemFromDom();
            },
            deleteListItemFromDom()
            {
                const listItems = document.querySelectorAll(`.${this.parentId}`);
                for(let item of listItems)
                {
                    if(item.querySelector(".body p").textContent === this.content)
                    {
                        item.remove();
                    }
                }
            },
            updateInDB()
            {
                let db = JSON.parse(localStorage.getItem("db"));
                let lists = db.lists;
                let targetList = lists.find(list => 
                {
                    return list.id === this.parentId;
                });
                let items = targetList.items;
                let item = items.find(item => item.content === this.content);
                item.isDone = this.isDone;
                item.content = this.content;
                
                items = items.filter(item => item.content !== this.content);
                if(item.isDone)
                {
                    items.push(item);
                    targetList.items = items;
                }
                else
                {
                    // first done item index 
                    const firstDoneItemIndex = items.findIndex(item => item.isDone);
                        
                    if(firstDoneItemIndex === -1)
                    {
                        items.push(item);
                    }
                    else
                    {
                        items.splice(firstDoneItemIndex, 0, item);
                    }
                    targetList.items = items;
                }
                db.status = {name: "UpdatingItemData", effectedListId: this.parentId};
                localStorage.setItem("db", JSON.stringify(db));
                this.updateUIForDoneItem();
                this.updateListItemPositionInUI();
            },
            priorityUp()
            {
                let db = JSON.parse(localStorage.getItem("db"));
                let lists = db.lists;
                let targetList = lists.find(list =>
                    {
                        return list.id === this.parentId
                    }
                );
    
                const listItem = targetList.items.find(item => item.content === this.content);
                const listItemIndex = targetList.items.indexOf(listItem);
                if(listItemIndex > 0)
                {
                    const isItemDone = targetList.items[listItemIndex].isDone;
                    const isPreviousItemDone = targetList.items[listItemIndex - 1].isDone;
                    if(isItemDone !== isPreviousItemDone)
                    {
                        return;
                    }
                    // swap list-items in DB
                    targetList.items.splice(listItemIndex, 1);
                    targetList.items.splice(listItemIndex - 1, 0, listItem);
                    db.status = {name: "UpdatingItemPeriority", effectedListId: this.parentId};
                    localStorage.setItem("db", JSON.stringify(db));
    
                    // rerender dom
                    this.updateListItemPositionInUI();
                }
            },
            priorityDown()
            {
                let db = JSON.parse(localStorage.getItem("db"));
                let lists = db.lists;
                let targetList = lists.find(list =>
                    {
                        return list.id === this.parentId
                    }
                );
    
                let listItem = targetList.items.find(item => item.content === this.content);
                let listItemIndex = targetList.items.indexOf(listItem);
                if(listItemIndex < targetList.items.length - 1)
                {
                    const isItemDone = targetList.items[listItemIndex].isDone;
                    const isNextItemDone = targetList.items[listItemIndex + 1].isDone;
                    if(isItemDone !== isNextItemDone)
                    {
                        return false;
                    }
                    // swap list-items in DB
                    targetList.items.splice(listItemIndex, 1);
                    targetList.items.splice(listItemIndex + 1, 0, listItem);
                    db.status = {name: "UpdatingItemPeriority", effectedListId: this.parentId};
                    localStorage.setItem("db", JSON.stringify(db));

                    // rerender dom
                    this.updateListItemPositionInUI();
                }
            
            },
            updateListItemPositionInUI()
            {
                const targetList = JSON.parse(localStorage.getItem("db")).lists.find(list =>
                    {
                        return list.id == this.parentId
                    }
                )      
                for(let itemIndex = 0; itemIndex < targetList.items.length; itemIndex++)
                {
                    let item = targetList.items[itemIndex];
                    let itemObject = ListItem(item.content, item.isDone, item.parentId, item.id);
                    let itemLi = document.querySelector(`#${itemObject.id}`);
                    itemLi.style.order = itemIndex;
                }
            },
            updateUIForDoneItem()
            {
                const listItem = document.querySelector(`#${this.id}`);
                const isDone =listItem.querySelector("input").checked;
                if(isDone)
                {
                    listItem.classList.add("done-list-item");
                }
                else
                {
                    listItem.classList.remove("done-list-item");
                }
            }
        }
    }