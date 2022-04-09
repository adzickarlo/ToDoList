//title
const listHeaderTitle = document.querySelector('.todo-list-title');

//containers
const listContainer = document.querySelector('.lists');
const taskDivContainer = document.querySelector('.todo-list');
const taskContainer = document.querySelector('.todo-list-tasks');
const taskTemplateContainer = document.getElementById('task-template-container');

//inputs
const listInput = document.querySelector('.new-list-input');
const taskInput = document.querySelector('.new-task-input');

//buttons
const listAddButton = document.querySelector('.list-form');
const taskAddButton = document.querySelector('.task-form');
const deleteButton = document.querySelector('.delete-list-button');
const completedTaskButton = document.querySelector('.delete-task-button');

//local storage
const local_storage_list_key = 'new.lists';
let todoLists = getListsFromLocalStorage();

const local_storage_selected_id_key = 'selectedId.lists';
let selectedId = getSelectIdFromLocalStorage();

//event listeners
listAddButton.addEventListener('submit', function(e){
    e.preventDefault();
    const listName = listInput.value;
    if(listName.length > 14){
        alert('List name is to long! Please use a shorter name!');
        listInput.value = '';
    }
    else{
        if(listName === '' || listName == null) return;
        const list = createList(listName);
        listInput.value = '';
        todoLists.push(list);
    }

    save();
    render();
});

taskAddButton.addEventListener('submit', function(e){
    e.preventDefault();
    const taskName = taskInput.value;
    if(taskName.length > 28){
        alert('Task name is to long! Please use a shorter name!');
        taskInput.value = '';
    }
    if(taskContainer.childElementCount > 20){
        alert('No more space in a list! Please create a new list or delete completed tasks!');
        taskInput.value = '';
    }
    else {
        if(taskName === '' || taskName == null) return;
        const task = createTask(taskName);
        taskInput.value = '';
        const selectedList = todoLists.find(list => list.id === selectedId);
        selectedList.tasks.push(task);
    }

    save();
    render();
});

deleteButton.addEventListener('click', function(e){
    todoLists = todoLists.filter(list => list.id !== selectedId);
    selectedId = '';
    
    save();
    render();
});

listContainer.addEventListener('click', function(e){
    if(e.target.tagName.toLowerCase() === 'li'){
        selectedId = e.target.dataset.listId;
        
        save();
        render();
    }
});

completedTaskButton.addEventListener('click', function(e){
    const selectedList = todoLists.find(list => list.id === selectedId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.completed);

    save();
    render();
});

taskContainer.addEventListener('click', function(e){
    if(e.target.tagName.toLowerCase() === 'input'){
        const selectedList = todoLists.find(list => list.id === selectedId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.completed = e.target.checked;

        save();
    }
});

//functions
function clearElement(e){
    while (e.firstChild){
        e.removeChild(e.firstChild);   
    }
}

function createList(name){
    return { id: Date.now().toString(), name: name, tasks: [] };
}

function createTask(name){
    return { id: Date.now().toString(), name: name, completed: false };
}

function save(){
    saveListsToLocalStorage();
    saveSeletedIdToLocalStorage();
}

function saveListsToLocalStorage(){
    localStorage.setItem(local_storage_list_key, JSON.stringify(todoLists));
}

function saveSeletedIdToLocalStorage(){
    localStorage.setItem(local_storage_selected_id_key, selectedId);
}

function getSelectIdFromLocalStorage(){
    let storedSelectId = localStorage.getItem(local_storage_selected_id_key);
    return storedSelectId;
}

function getListsFromLocalStorage(){
    let storedList = JSON.parse(localStorage.getItem(local_storage_list_key)) || [];
    return storedList;
}

function render(){
    clearElement(listContainer);
    displayLists();

    const selectedList = todoLists.find(list => list.id === selectedId);
    if(selectedId == ''){
        taskDivContainer.style.display = 'none';
    }
    else {
        taskDivContainer.style.display = '';
        listHeaderTitle.innerText = selectedList.name;
        clearElement(taskContainer);
        displayTasks(selectedList);
    }
}

function displayLists(){
    todoLists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id; //used for selecting certain list
        listElement.classList.add('list-name');
        listElement.innerText = list.name;
        if(list.id === selectedId){
            listElement.classList.add('active-list');
        }
        listContainer.appendChild(listElement);
    });
}

function displayTasks(selectedList){
    selectedList.tasks.forEach(task => {
        const newTaskElement = document.importNode(taskTemplateContainer.content, true);
        const checkbox = newTaskElement.querySelector('input');
        checkbox.id = task.id;
        checkbox.checked = task.completed;
        const label = newTaskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        taskContainer.appendChild(newTaskElement);
    });
}

render();