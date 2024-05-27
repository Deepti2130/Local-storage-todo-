const cl = console.log;
const todoform = document.getElementById("todoform");
const submitbtn = document.getElementById("submitbtn");
const updatebtn = document.getElementById("updatebtn");
const todoItemcontrol = document.getElementById("todoItem");
const todoListcontainer = document.getElementById("todoListcontainer");
const maxupdatetime = document.getElementById("maxupdatetime");

const generateUuid = () => {
    return (
        String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
    ).replace(/[xy]/g, (character) => {
        const random = (Math.random() * 16) | 0;
        const value = character === "x" ? random : (random & 0x3) | 0x8;

        return value.toString(16);
    });
};


const onEdit = (ele) => {
let getEditId = ele.closest(`li`).id;

localStorage.setItem("edited", getEditId);
let getObject = todoArr.find (todo => todo.todoId === getEditId)
cl(getObject)
if(getObject.updatedcount <= 5){
    maxupdatetime.classList.remove(`d-none`);
    todoItemcontrol.value = getObject.todoItem
    submitbtn.classList.add('d-none')
    updatebtn.classList.remove('d-none')
}else{
    Swal.fire({
        title: `can't update, it reaches its max update count`,
        timer: 2500,
        icon: "question"
      });   
}

}

const templetingoflist = (arr) =>{
  let result = " ";

  arr.forEach(todo => {
     result += `<li class="list-group-item d-flex justify-content-between" id=${todo.todoId}>
                <span>${todo.todoItem}</span>
                <span>
                <button class="btn btn-primary btn-sm" onclick="onEdit(this)">Edit Item</button>
                <button class="btn btn-danger btn-sm" onclick="onRemove(this)">Remove Item</button>
                </span>
               </li>` 
  });
  todoListcontainer.innerHTML = result;
  
}


//let todoArr = [];

//if(localStorage.getItem("todoArr")){
   // todoArr = JSON.parse(localStorage.getItem("todoArr"));
//}

let todoArr = JSON.parse(localStorage.getItem("todoArr")) || []

if (todoArr.length > 0){
    templetingoflist(todoArr);
}

const Onsubmittodo = (event) =>{
  event.preventDefault();

  let todoobj = {
     todoItem:todoItemcontrol.value,
     todoId:generateUuid(),
     updatedcount:0

  }
  event.target.reset();
  //New object added in array.

  todoArr.unshift(todoobj);

  //store/update array in local storage in the form of JSON.

  localStorage.setItem("todoArr", JSON.stringify(todoArr));

  //get array from local storage in the form of JSON
  
  todoArr = JSON.parse(localStorage.getItem("todoArr"));

  //send that array in the form of object into templeting function 
  //templetingoflist(todoArr);
  //we will create new "li" and prepend in "ul"//
  let li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between";
  li.id = todoobj.todoId;
  li.innerHTML = `<span>${todoobj.todoItem}</span>
  <span>
  <button class="btn btn-primary btn-sm" onclick="onEdit(this)">Edit Item</button>
  <button class="btn btn-danger btn-sm" onclick="onRemove(this)">Remove Item</button>
  </span>`
  todoListcontainer.prepend(li);
  Swal.fire({
    title: `New todo item ${todoobj.todoItem} is added!!!`,
    timer: 2500,
    icon: "success"
  });   
}

const ontodoupdate =() => {
    let getupdatedId =localStorage.getItem("edited");
    cl(getupdatedId);

    let updatedObj = {
        todoItem:todoItemcontrol.value,
        todoId:getupdatedId
    }
    maxupdatetime.classList.add(`d-none`);
    cl(updatedObj);
    todoItemcontrol.value = ' '

    let getIndex = todoArr.findIndex(todo => todo.todoId === getupdatedId);
    cl(getIndex);
    let oldobj = todoArr[getIndex]
    todoArr[getIndex] = {...updatedObj, updatedcount:oldobj.updatedcount + 1};
    localStorage.setItem("todoArr", JSON.stringify(todoArr));
    //templetingoflist(todoArr);
    let li = document.getElementById(getupdatedId);
   cl(li);
   li.innerHTML = `<span>${updatedObj.todoItem}</span>
   <span>
   <button class="btn btn-primary btn-sm" onclick="onEdit(this)">Edit Item</button>
   <button class="btn btn-danger btn-sm" onclick="onRemove(this)">Remove Item</button>
   </span>`
    submitbtn.classList.remove('d-none')
    updatebtn.classList.add('d-none')
    Swal.fire({
        title: `The todo item ${oldobj.todoItem} is updated to ${updatedObj.todoItem}`,
        timer: 2500,
        icon: "success"
      });   
}  

const onRemove = (ele) => {
    let removeId = ele.closest(`li`).id;
    cl(removeId)
    let getIndex = todoArr.findIndex(todo => todo.todoId = removeId);

    todoArr.splice(getIndex,1)
    localStorage.setItem('todoArr', JSON.stringify(todoArr));

    document.getElementById(removeId).remove()
    Swal.fire({
        title: `Are you sure to delete`,
        timer: 2500,
        icon: "question"
      });   
}

todoform.addEventListener("submit", Onsubmittodo);
updatebtn.addEventListener("click", ontodoupdate);