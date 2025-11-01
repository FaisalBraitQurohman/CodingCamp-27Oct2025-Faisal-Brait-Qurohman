let todos = [];
let currentFilter = 'all';

// Load todos from memory
function loadTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <h2>No Tasks Found!</h2>
                <p>${currentFilter === 'all' ? 'Add your first task to get started 🚀' : 'No ' + currentFilter + ' tasks'}</p>
            </div>
        `;
        return;
    }

    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.innerHTML = `
            <div class="todo-content">
                <div class="todo-title">${escapeHtml(todo.task)}</div>
                <div class="todo-date">📅 ${formatDate(todo.date)}</div>
            </div>
            <div class="todo-actions">
                <button class="complete-btn" onclick="toggleComplete(${todo.id})">
                    ${todo.completed ? '↩️ Undo' : '✓ Done'}
                </button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">🗑️ Delete</button>
            </div>
        `;
        todoList.appendChild(todoItem);
    });
}

// Add todo
document.getElementById('todoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskInput = document.getElementById('todoInput');
    const dateInput = document.getElementById('dateInput');
    const taskError = document.getElementById('taskError');
    const dateError = document.getElementById('dateError');

    let isValid = true;

    // Reset errors
    taskError.style.display = 'none';
    dateError.style.display = 'none';

    // Validate task
    if (!taskInput.value.trim()) {
        taskError.style.display = 'block';
        isValid = false;
    }

    // Validate date
    if (!dateInput.value) {
        dateError.style.display = 'block';
        isValid = false;
    }

    if (!isValid) return;

    // Add todo
    const newTodo = {
        id: Date.now(),
        task: taskInput.value.trim(),
        date: dateInput.value,
        completed: false
    };

    todos.push(newTodo);
    loadTodos();

    // Reset form
    taskInput.value = '';
    dateInput.value = '';
});

// Toggle complete
function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        loadTodos();
    }
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    loadTodos();
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        loadTodos();
    });
});

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Set minimum date to today
document.getElementById('dateInput').min = new Date().toISOString().split('T')[0];

// Initialize
loadTodos();