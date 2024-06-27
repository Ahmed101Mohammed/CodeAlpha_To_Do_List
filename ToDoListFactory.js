const ToDoList = (title, description, date, ...items) => {
    const convertListItemsToObjects = function(listItems)
    {
        let listItemsAsObjects = [];
        for(let item of listItems)
        {
            let listItem = ListItem(item.content, item.isDone, item.parentIdFormat);
            listItemsAsObjects.push(listItem);
        }
        return listItemsAsObjects;
    }

    const getListItemsAsObjects = function(listItems)
    {
        if(listItems < 1)
        {
            return [];
        }
        
        const firstItem = listItems[0];
        if(firstItem.htmlCode)
        {
            return listItems;
        }
        else
        {
            return convertListItemsToObjects(listItems);
        }
    }
    return {
        title, 
        description,
        date: date? new Date(date) : new Date(),
        items: getListItemsAsObjects(items),
        htmlCodeForCard () {
            return `
            <div class="to-do-list-card" id="${this.convertTitleToDashedLowerCase()}">
                    <div class="head">
                        <div class="info-header">
                            <a href="to-do-list-page.html?listId=${this.convertTitleToDashedLowerCase()}"><h2 class="list-tilte">${this.title}</h2></a>
                            <p class="list-discription">${this.description}</p>
                        </div>
                        <span class="material-symbols-outlined delete">
                            delete
                        </span>
                    </div>
                    <div class="progress">
                        <p class="text-info">
                            <span>Progress</span><span class="progress-value">${this.isDoneItemsNumber()}/${this.items.length}</span>
                        </p>
                        <div class="progress-bar">
                            <div class="progress-done ${this.progressBarColor()}" style="width:${this.progress_percentage()}%"></div>
                        </div>
                    </div>
                    <div class="side-details">
                        <p class="date">${this.convertDateToString()}</p>
                        <div class="up-down">
                            <span class="material-symbols-outlined list-up">
                                keyboard_arrow_up
                            </span>
                            <span class="material-symbols-outlined list-down">
                                keyboard_arrow_down
                            </span>
                        </div>
                    </div>
                </div>
            `
        },
        progress_percentage () {
            if(this.items.length < 1)
            {
                return 0;
            }
            return (this.isDoneItemsNumber()/this.items.length)*100;
        },
        progressBarColor() {
            if(this.progress_percentage() === 100)
            {
                return "progress-done-green";
            }
            return ""
        },
        addToDom()
        {
            const listsLinks = document.querySelector(".lists-links");
            const newListLink = `<li class="list-link"><a href="#${this.convertTitleToDashedLowerCase()}">${this.title}</a></li>`;
            listsLinks.insertAdjacentHTML("beforeend", newListLink);
            const listsContainer = document.querySelector(".lists-cards-container");
            listsContainer.insertAdjacentHTML("beforeend", this.htmlCodeForCard());
        },
        addToDoListToDBAndDOM () 
        {
            let db = JSON.parse(localStorage.getItem("db"));
            let lists = db.lists;
            let listWithSameName = lists.find(list => list.title === this.title);
            if(listWithSameName)
            {
                return false;
            }

            lists.push({title: this.title, description: this.description, date: this.date, items: this.items});
            db.status = "AddingNewList";
            localStorage.setItem("db", JSON.stringify(db));
            this.addToDom();
            return true;
        },
        convertDateToString () {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const day = this.date.getDate();
            const month = this.date.getMonth();
            const year = this.date.getFullYear();
            return `${day} ${months[month]} ${year}`
        },
        convertTitleToDashedLowerCase () {
            return this.title.toLowerCase().replace(/ /g, "-");
        },
        addItemToDBAndDom(content, isDone)
        {
            // create item js object
            const parentId = this.convertTitleToDashedLowerCase();
            let newListItem = ListItem(content, isDone, parentId);
            this.items.push(newListItem);

            // Modify the List in the db and dom
            newListItem.addListItemToDBAndDOM();
        }, 
        addItemsToDom()
        {
            for(let item of this.items)
            {
                item.addToDom();
            }
        },
        deleteFromDBAndDom()
        {
            let db = JSON.parse(localStorage.getItem("db"));
            db.lists = db.lists.filter(list => list.title !== this.title);
            db.status = "DeletingList";
            localStorage.setItem("db", JSON.stringify(db));

            const listCard = document.querySelector(`#${this.convertTitleToDashedLowerCase()}`);
            listCard.remove();

            const listCardLink = document.querySelector(`a[href="#${this.convertTitleToDashedLowerCase()}"]`).parentNode;
            listCardLink.remove();
        },
        isDoneItemsNumber()
        {
            let counter = 0;
            for(let item of this.items)
            {
                if(item.isDone)
                {
                    counter += 1;
                }
            }

            return counter;
        },
        setInToDoListPageDOM()
        {
            const pageTitle = document.querySelector("h1");
            pageTitle.textContent = this.title;
            const descriptionElement = document.querySelector("header p");
            descriptionElement.textContent = this.description;

            this.addItemsToDom();
        },
        deleteListItemFromDBAndDom(listItem)
        {
            // delete from list object
            this.items = this.items.filter(item => item.content !== listItem.content);

            // create ListItem object
            const listItemObject = ListItem(listItem.content, listItem.isDone, listItem.parentIdFormat);
            listItemObject.deleteFromDBAndDom();
        },
        updateListItemInDB(listItem)
        {
            const listItemObject = ListItem(listItem.content, listItem.isDone, listItem.parentIdFormat);
            listItemObject.updateInDB();
        },
        priorityUp()
        {
            let db = JSON.parse(localStorage.getItem("db"));
            let lists = db.lists;
            let listObject = lists.find(list => list.title === this.title);
            let listIndex = lists.indexOf(listObject);
            if(listIndex > 0)
            {
                // swap lists on DB
                lists.splice(listIndex, 1);
                lists.splice(listIndex - 1, 0, listObject);
                db.status = "UpdatingListPeriority";
                localStorage.setItem("db", JSON.stringify(db));

                // rerender dom
                window.location.reload();
            }
        },
        priorityDown()
        {
            let db = JSON.parse(localStorage.getItem("db"));
            let lists = db.lists;
            let listObject = lists.find(list => list.title === this.title);
            let listIndex = lists.indexOf(listObject);
            if(listIndex < lists.length - 1)
            {
                // swap lists on DB
                lists.splice(listIndex, 1);
                lists.splice(listIndex + 1, 0, listObject);
                db.status = "UpdatingListPeriority";
                localStorage.setItem("db", JSON.stringify(db));

                // rerender dom
                window.location.reload();
            }
        },
        priorityUpForListItem(listItemData)
        {
            const listItemObject = ListItem(listItemData.content, listItemData.isDone, listItemData.parentIdFormat);
            listItemObject.priorityUp();
        },
        priorityDownForListItem(listItemData)
        {
            const listItemObject = ListItem(listItemData.content, listItemData.isDone, listItemData.parentIdFormat);
            listItemObject.priorityDown();
        }

    }
}