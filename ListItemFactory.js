const ListItem = (content, isDone, parentIdFormat)=>
    {
        return {
            content,
            isDone,
            parentIdFormat,
            htmlCode()
            {
                return `
                    <li class="${parentIdFormat}"> 
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
                        const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                        return listObject.convertTitleToDashedLowerCase() === parentIdFormat;
                    }
                );
    
                const listItem = targetList.items.find(item => item.content === this.content);
                if(listItem){return false};
               
                targetList.items.push({content: this.content, isDone: this.isDone, parentIdFormat: this.parentIdFormat});
                db.status = "AddingNewItem"  
                localStorage.setItem("db", JSON.stringify(db));
    
                this.addToDom();
                return true;
            },
            deleteFromDBAndDom()
            {
                let db = JSON.parse(localStorage.getItem("db"));
                let lists = db.lists;
                let targetList = lists.find(list => 
                {
                    const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                    return listObject.convertTitleToDashedLowerCase() === this.parentIdFormat
                });
                targetList.items = targetList.items.filter(item => item.content !== this.content);
                db.status = "DeletingItem";
                localStorage.setItem("db", JSON.stringify(db));
                this.deleteListItemFromDom();
            },
            deleteListItemFromDom()
            {
                const listItems = document.querySelectorAll(`.${this.parentIdFormat}`);
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
                    const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                    return listObject.convertTitleToDashedLowerCase() === this.parentIdFormat;
                });
                let items = targetList.items;
                let item = items.find(item => item.content === this.content);
                item.isDone = this.isDone;
                item.content = this.content;
                item.parentIdFormat = this.parentIdFormat;
                db.status = "UpdatingItemData";
                localStorage.setItem("db", JSON.stringify(db));
            },
            priorityUp()
            {
                let db = JSON.parse(localStorage.getItem("db"));
                let lists = db.lists;
                let listItems = lists.find(list =>
                    {
                        const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                        return listObject.convertTitleToDashedLowerCase() === this.parentIdFormat
                    }
                );
    
                const listItem = listItems.items.find(item => item.content === this.content);
                const listItemIndex = listItems.items.indexOf(listItem);
                if(listItemIndex > 0)
                {
                    // swap list-items in DB
                    listItems.items.splice(listItemIndex, 1);
                    listItems.items.splice(listItemIndex - 1, 0, listItem);
                    db.status = "UpdatingItemPeriority";
                    localStorage.setItem("db", JSON.stringify(db));
    
                    // rerender dom
                    window.location.reload();
                }
            },
            priorityDown()
            {
                let db = JSON.parse(localStorage.getItem("db"));
                let lists = db.lists;
                let listItems = lists.find(list =>
                    {
                        const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                        return listObject.convertTitleToDashedLowerCase() === this.parentIdFormat
                    }
                );
    
                let listItem = listItems.items.find(item => item.content === this.content);
                let listItemIndex = listItems.items.indexOf(listItem);
                if(listItemIndex < listItems.items.length - 1)
                {
                    // swap list-items in DB
                    listItems.items.splice(listItemIndex, 1);
                    listItems.items.splice(listItemIndex + 1, 0, listItem);
                    db.status = "UpdatingItemPeriority"
                    localStorage.setItem("db", JSON.stringify(db));

                    // rerender dom
                    window.location.reload();
                }
            
            }
        }
    }