let todos = [];
let currentFilter = 'all';

// Load todos from memory
function loadTodos() {
    console.log('Loading todos:', todos);
    const todoList = document.getElementById('todoList');
    
    if (!todoList) {
        console.error('Element #todoList not found!');
        return;
    }
    
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Set minimum date to today
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
    
    // Add todo form handler
    const todoForm = document.getElementById('todoForm');
    if (!todoForm) {
        console.error('Form #todoForm not found!');
        return;
    }
    
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        const taskInput = document.getElementById('todoInput');
        const dateInput = document.getElementById('dateInput');
        const taskError = document.getElementById('taskError');
        const dateError = document.getElementById('dateError');

        if (!taskInput || !dateInput) {
            console.error('Input elements not found!');
            return;
        }

        let isValid = true;

        // Reset errors
        if (taskError) taskError.style.display = 'none';
        if (dateError) dateError.style.display = 'none';

        // Validate task
        if (!taskInput.value.trim()) {
            if (taskError) taskError.style.display = 'block';
            isValid = false;
            console.log('Task is empty');
        }

        // Validate date
        if (!dateInput.value) {
            if (dateError) dateError.style.display = 'block';
            isValid = false;
            console.log('Date is empty');
        }

        if (!isValid) {
            console.log('Validation failed');
            return;
        }

        // Add todo
        const newTodo = {
            id: Date.now(),
            task: taskInput.value.trim(),
            date: dateInput.value,
            completed: false
        };

        console.log('Adding new todo:', newTodo);
        todos.push(newTodo);
        loadTodos();

        // Reset form
        taskInput.value = '';
        dateInput.value = '';
        
        console.log('Todo added successfully! Total todos:', todos.length);
    });

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    console.log('Found filter buttons:', filterBtns.length);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Filter clicked:', this.dataset.filter);
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            loadTodos();
        });
    });

    // Initialize
    loadTodos();
    console.log('Initialization complete!');
});

// Toggle complete
function toggleComplete(id) {
    console.log('Toggle complete:', id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        loadTodos();
    }
}

// Delete todo
function deleteTodo(id) {
    console.log('Delete todo:', id);
    todos = todos.filter(t => t.id !== id);
    loadTodos();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}