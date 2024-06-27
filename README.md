# CodeAlpha_To_Do_List
To do list application, that I built in my internship in Code Alpha.

## Aplication description:
### App features:
App give you 6 main features:
- Creating Tasks.
- Orgnizing your tasks, by create them inside a To Do Lists.
- Saving your data, in your browser LocalStorage.
- Deleting your To Do Lists, and tasks.
- Tracking your progress by brogress-bar in the To Do List.
- Determin you To Do Lists and tasks periority, by reordered them.

### App technologies:
For this app, I used these technologies:
- HTML5: To design the structure of the app.
- CSS3: To add styling to the design.
- JS: To make the site more dynamic.

### Challenges I face in this project:
In this project I have two challenges:

#### 1. Applaying DB to the project.
##### Problem Descriptin:
The project is a task, that limit me to use HTM, CSS, and JS, and I thing there is no problem to use some DB, like: SQLite, but to make the project used online, I need away to deploy the project with SQLite and I did't have any experiance with that, and the main problem is that I need to increase the project complexity to soppurt logics like Sign/Register, and more complex design for the DB, and adding technologies to subbort the back-end like NodeJs, express and many modules to complate the express work, and surly what make all the previouse is problem is the time, I don't have the enough time to do all of this.
##### Problem Solution:
Basicly I find that the 1st version of the application doesn't have a huge data, and it support basic functionlities, so I shoose the browsers LocalStorage to be my DB. It can support that each user with his/her own browser can has own LocalStorage. And because of the project data is not huge and complex, the LocalStorage, can save some good ammount of data.

#### 2. Support handling multi To-Do-Lists in several pages.
##### Problem Descriptin:
You can click on the To Do List title and drage it to open the To Do List in new tap, so I ask my self how to move the To Do List to the opened page, and I have a basic solution, by adding field in Browser LocalStorage that contain the title(it's unique) of the clicked list. But the real question is what if the user draged multi titles of To Do Lists? the LocalStorage will update to contain jsut the last opened To Do List. So how to solve this problem?!

##### Problem Solution:
I find that instead of saving the prowser data in LocalStorage, that updated each time when you open new To Do List, I can contain the uinque information aboute the opened List, in the page URL, each page can contain its own URL, so each page can deal with its To Do List. So multi To Do Lists handling is now supported.

## Installing and Running:
### Installing:
> You can deal directly with the project by discovering [project site](https://ahmed101mohammed.github.io/CodeAlpha_To_Do_List/).
> 
> Or if you want to download it localy in your machine you can write this command in your termingal:
> ```
> git clone https://github.com/Ahmed101Mohammed/CodeAlpha_To_Do_List.git
> ```

### Running:
Guiding Youtube video will created soon.