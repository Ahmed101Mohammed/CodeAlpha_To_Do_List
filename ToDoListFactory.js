const ToDoList = (title, description, date, id, ...items) => {
    const convertListItemsToObjects = function(listItems)
    {
        let listItemsAsObjects = [];
        for(let item of listItems)
        {
            let listItem = ListItem(item.content, item.isDone, item.parentId, item.id);
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
        id: id? id : `list${Date.now()}`,
        htmlCodeForCard () {
            return `
            <div class="to-do-list-card" id="${this.id}" draggable="true">
                    <div class="head">
                        <div class="info-header">
                            <a href="to-do-list-page.html?listId=${this.id}"><h2 class="list-title">${this.title}</h2></a>
                            <p class="list-description">${this.description}</p>
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
            const newListLink = `<li class="list-link"><a href="#${this.id}">${this.title}</a></li>`;
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

            lists.push({title: this.title, description: this.description, date: this.date, id: this.id, items: this.items});
            db.status = {name: "AddingNewList", effectedListId: this.id};
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
        addItemToDBAndDom(content, isDone)
        {
            // create item js object
            const parentId = this.id;
            let newListItem = ListItem(content, isDone, parentId);

            // Modify the List in the db and dom
            const isSuccess = newListItem.addListItemToDBAndDOM();

            if(isSuccess){this.items.push(newListItem)}
            
            return isSuccess;
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
            db.status = {name: "DeletingList", effectedListId: this.id};
            localStorage.setItem("db", JSON.stringify(db));

            const listCard = document.querySelector(`#${this.id}`);
            listCard.remove();

            const listCardLink = document.querySelector(`a[href="#${this.id}"]`).parentNode;
            listCardLink.remove();
            return true;
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
            const pageTitle = document.querySelector(".list-title");
            pageTitle.textContent = this.title;
            const descriptionElement = document.querySelector(".list-description");
            descriptionElement.textContent = this.description;

            this.addItemsToDom();
        },
        deleteListItemFromDBAndDom(listItem)
        {
            // delete from list object
            this.items = this.items.filter(item => item.content !== listItem.content);

            // create ListItem object
            const listItemObject = ListItem(listItem.content, listItem.isDone, listItem.parentId, listItem.id);
            listItemObject.deleteFromDBAndDom();
        },
        updateListItemInDB(listItem)
        {
            const listItemObject = ListItem(listItem.content, listItem.isDone, listItem.parentId, listItem.id);
            return listItemObject.updateInDB();
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
                db.status = {name: "UpdatingListPeriority", effectedListId: this.id};
                localStorage.setItem("db", JSON.stringify(db));

                // rerender dom
                this.updateListCardPositionInUI()
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
                db.status = {name: "UpdatingListPeriority", effectedListId: this.id};
                localStorage.setItem("db", JSON.stringify(db));

                // rerender dom
                this.updateListCardPositionInUI()
            }
        },
        priorityUpForListItem(listItemData)
        {
            const listItemObject = ListItem(listItemData.content, listItemData.isDone, listItemData.parentId, listItemData.id);
            listItemObject.priorityUp();
        },
        priorityDownForListItem(listItemData)
        {
            const listItemObject = ListItem(listItemData.content, listItemData.isDone, listItemData.parentId, listItemData.id);
            listItemObject.priorityDown();
        },
        updateProgressComponentLive()
        {
            let progresUI = document.querySelector(`#${this.id} .progress`);
            let progressTextValue = progresUI.querySelector(".text-info span.progress-value")
            progressTextValue.textContent = `${this.isDoneItemsNumber()}/${this.items.length}`;
            let progressDone = progresUI.querySelector(".progress-bar .progress-done");
            progressDone.style.width = `${this.progress_percentage()}%`;
            if(this.progress_percentage() === 100)
            {
                progressDone.classList.add("progress-done-green");
            }
            else
            {
                progressDone.classList.remove("progress-done-green");
            }
        },
        updateListCardPositionInUI()
        {
            const lists = JSON.parse(localStorage.getItem("db")).lists;
            for(let listIndex = 0; listIndex < lists.length; listIndex++)
            {
                let list = lists[listIndex];
                let listObject = ToDoList(list.title, list.description, list.date, list.id, ...list.items);
                let listCard = document.querySelector(`#${listObject.id}`);
                let listLink = document.querySelector(`a[href="#${listObject.id}"]`).parentNode;
                listCard.style.order = listIndex;
                listLink.style.order = listIndex;
            }
        },
        updateListInDB()
        {
            if(this.validDescription() && this.validTitle())
            {
                const db = JSON.parse(localStorage.getItem("db"));
                const targetList = db.lists.find(list => list.id === this.id);
                targetList.title = this.title;
                targetList.description = this.description;
                targetList.date = this.date;
                db.status = {name: "UpdatingList", effectedListId: this.id};
                localStorage.setItem("db", JSON.stringify(db));
                return true;
            }
            return false;
        },
        updateListInDom()
        {
            const listCard = document.querySelector(`#${this.id}`);
            listCard.querySelector(".list-title").textContent = this.title;
            listCard.querySelector(".list-description").textContent = this.description;
            this.updateProgressComponentLive();
        },
        validTitle()
        {
            if(this.title === "")
            {
                return false;
            }
            return true;
        },
        validDescription()
        {
            const listWithSameTitle = JSON.parse(localStorage.getItem("db")).lists.find(list => list.title === this.title);
            if(this.description === "" || (listWithSameTitle && listWithSameTitle.id !== this.id))
            {
                return false;
            }
            return true;
        }
    }
}