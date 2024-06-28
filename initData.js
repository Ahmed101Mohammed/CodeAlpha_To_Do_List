const parentId = `item${Date.now()}`
let introductionAppToDoList = {
    title: "Discovering ToDoly application",
    description: "Checklists to check if you know all ToDoly features",
    date: Date.now(),
    id: parentId,
    items: [
        {content: 'Create a new list with any unique name. (Note: you can\'t create two lists with the same name)', 
            isDone: false, 
            parentId: parentId,
            id: `item${Date.now()}`}
        , 
        {content: 'Click on your To Do List title to open the list page.', 
            isDone: false, 
            parentId: parentId,
            id: `item${Date.now()+1}`}
        , 
        {content: "Add any number of items (Note: you can't create two items with the same content)", 
            isDone: false, 
            parentId: parentId,
            id: `item${Date.now()+2}`}
        ,
        {content: 'Click on the checkbox of one of your list items, and go back to home page, and refresh it to see your progress.', 
            isDone: false, 
            parentId: parentId,
            id: `item${Date.now()+3}`}
        ,
        {content: "Change the periority of one of your list items, by click on up or down arrow", 
            isDone: false, 
            parentId: parentId,
            id: `item${Date.now()+4}`}
        ,
        {content: 'Delete one of the items.', 
            isDone: false, 
            parentId: parentId,
            id: `item${Date.now()+5}`}
        ,
        {content: 'Change the periority of your To Do List, to have the 1st periority. (by click on up arrow)', 
            isDone: false, 
            parentId: parentId,
            id: `item${Date.now()+6}`}
        ,
        {content: 'Delete "Discovering TODOly application" To Do List, now you are ready to use all ToDoly features.', 
            isDone: false, 
            parentId: parentId,
            id: `item${Date.now()+7}`}
    ]
}