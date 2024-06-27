# CodeAlpha_To_Do_List
To-do list application, that I built in my internship in Code Alpha.

## Application Description:
### App features:
The app gives you 6 main features:
- Creating Tasks.
- Organizing your tasks, by creating them inside a To-Do List.
- Saving your data, in your browser LocalStorage.
- Deleting your Do Lists and tasks.
- Tracking your progress by progress in the To-Do List.
- Determine your To Do Lists and tasks priority, by reordering them.

### App technologies:
For this app, I used these technologies:
- HTML5: To design the structure of the app.
- CSS3: To add styling to the design.
- JS: To make the site more dynamic.

### Challenges I face in this project:
In this project, I have two challenges:

#### 1. Applying DB to the project.
##### Problem description:
The project is a task, that limits me to use HTM, CSS, and JS, and I think there is no problem with using some DB, like SQLite, but to make the project used online, I need a way to deploy the project with SQLite and I didn't have any experience with that, and the main problem is that I need to increase the project complexity to support logics like Sign/Register, and more complex design for the DB, and adding technologies to support the back-end like NodeJs, express and many modules to complete the express work, and surly what makes all the previous is problem is the time, I don't have enough time to do all of this.
##### Problem solution:
I found that the 1st version of the application doesn't have huge data, and it supports basic functionalities, so I chose the browser LocalStorage to be my DB. It can support that each user with his/her browser can have own LocalStorage. And because the project data is not huge and complex, LocalStorage can save a good amount of data.

#### 2. Support handling multiple to-do lists on several pages.
##### Problem description:
You can click on the To Do List title and drag it to open the To-Do List in a new tap, so I asked myself how to move the To-Do List to the opened page, and I have a basic solution, by adding a field in the Browser LocalStorage that contain the title(it's unique) of the clicked list. But the real question is what if the user dragged multiple titles of To Do Lists? the LocalStorage will update to contain just the last opened To Do List. So how to solve this problem?!

##### Problem solution:
I find that instead of saving the browser data in LocalStorage, which updates each time when you open a new To Do List, I can contain the unique information about the opened List, in the page URL, each page can contain its URL, so each page can deal with its To Do List. So multi-to-do list handling is now supported.

## Installing and Running:
### Installing:
> You can deal directly with the project by discovering [project site](https://ahmed101mohammed.github.io/CodeAlpha_To_Do_List/).
> 
> Or if you want to download it locally on your machine you can write this command in your terminal:
> ```
> git clone https://github.com/Ahmed101Mohammed/CodeAlpha_To_Do_List.git
> ```

### Running:
[Guiding Youtube video]( https://youtu.be/6BlZ7qfT0jU?si=vOrNjvl9BItbroBs)
