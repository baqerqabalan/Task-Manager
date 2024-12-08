document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const fiterButtons = document.querySelectorAll('.filter button');

    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    function renderTodos(filter = "all"){
        todoList.innerHTML = "";
        const filterTodos = todos.filter((todo) => {
            if(filter === "all") return true;
            if(filter === "active") return !todo.completed;
            if(filter === "completed") return todo.completed;
        });

        filterTodos.forEach((todo) => {
            const li = document.createElement('li');
            li.className = todo.completed ? "completed" : "";
            li.dataset.id = todo.id;

            li.innerHTML=`
                <span> ${todo.text} </span>
                <div>
                    <button class="edit-btn">✏️</button>
                    <button class="complete-btn">✅</button>
                    <button class="delete-btn">🗑️</button>
                </div>
            `;
            todoList.appendChild(li);
        })
    }

    function addTodo(text){
        const todo = {
            id: Date.now(),
            text,
            completed: false,
        };
        todos.push(todo);
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos();
    }

    function deleteTodo(id){
        todos = todos.filter((todo) => todo.id !== id);
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos();
    }

    function toggleComplete(id){
        todos = todos.map((todo) => {
            if(todo.id === id){
                todo.completed = !todo.completed;
            }
            return todo;
        })
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos();
    }

    function editTodo(id, newText){
        todos = todos.map((todo) => {
            if(todo.id === id){
                todo.text = newText;
            }
            return todo;
        });
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos();
    }

    todoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const text = todoInput.value.trim();
        if(text){
            addTodo(text);
            todoInput.value = "";
        }
    });

    todoList.addEventListener("click", (event) => {
        const id = parseInt(event.target.closest("li").dataset.id, 10);
        if(event.target.classList.contains("delete-btn")){
            deleteTodo(id);
        }
        else if(event.target.classList.contains("complete-btn")){
            toggleComplete(id);
        }
        else{
            const currentText = todos.find((todo) => todo.id === id).text;
            const newText = prompt("Edit your todo item: ", currentText);
            if(newText && newText.trim()){
                editTodo(id, newText.trim());
            }
            
        }
    });

    fiterButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const filter = button.dataset.filter;
            renderTodos(filter);
        })
    })

    renderTodos();
})