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
                        <div class = "checkbox">
                            <input type="checkbox" ${this.addCheckedAttribute()}>
                        </div>
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
            const targetList = JSON.parse(localStorage.getItem("lists")).find(list =>
                {
                    const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                    return listObject.convertTitleToDashedLowerCase() === parentIdFormat;
                }
            );

            const listItem = targetList.items.find(item => item.content === this.content);
            if(listItem){return false};
           
            targetList.items.push({content: this.content, isDone: this.isDone, parentIdFormat: this.parentIdFormat});
            let newLists = JSON.parse(localStorage.getItem("lists")).filter(list => list.title !== targetList.title);
            newLists.push(targetList);

            localStorage.setItem("lists", JSON.stringify(newLists));

            this.addToDom();
            return true;
        },
        deleteFromDBAndDom()
        {
            const targetList = JSON.parse(localStorage.getItem("lists")).find(list => 
            {
                const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                return listObject.convertTitleToDashedLowerCase() === this.parentIdFormat
            });
            targetList.items = targetList.items.filter(item => item.content !== this.content);
            let newLists = JSON.parse(localStorage.getItem("lists")).filter(list => list.title !== targetList.title);
            newLists.push(targetList);
            localStorage.setItem("lists", JSON.stringify(newLists));

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
            const targetList = JSON.parse(localStorage.getItem("lists")).find(list => 
            {
                const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                return listObject.convertTitleToDashedLowerCase() === this.parentIdFormat
            });
            targetList.items = targetList.items.filter(item => item.content !== this.content);
            targetList.items.push({content, isDone, parentIdFormat});
            let newLists = JSON.parse(localStorage.getItem("lists")).filter(list => list.title !== targetList.title);
            newLists.push(targetList);
            localStorage.setItem("lists", JSON.stringify(newLists));
        },
        priorityUp()
        {
            const lists = JSON.parse(localStorage.getItem("lists"));
            const listItems = lists.find(list =>
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
                localStorage.setItem("lists", JSON.stringify(lists));

                // rerender dom
                window.location.reload();
            }
        },
        priorityDown()
        {
            const lists = JSON.parse(localStorage.getItem("lists"));
            const listItems = lists.find(list =>
                {
                    const listObject = ToDoList(list.title, list.description, list.date, ...list.items);
                    return listObject.convertTitleToDashedLowerCase() === this.parentIdFormat
                }
            );

            const listItem = listItems.items.find(item => item.content === this.content);
            const listItemIndex = listItems.items.indexOf(listItem);
            if(listItemIndex < listItems.items.length - 1)
            {
                // swap list-items in DB
                listItems.items.splice(listItemIndex, 1);
                listItems.items.splice(listItemIndex + 1, 0, listItem);
                localStorage.setItem("lists", JSON.stringify(lists));

                // rerender dom
                window.location.reload();
            }
        
        }
    }
}