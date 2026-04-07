// ===========================
// LOAD TASKS FROM STORAGE
// ===========================
// This line gets tasks from browser storage (localStorage)
// If no tasks exist, it creates an empty array [] instead
// Clear localStorage on first load for fresh start
let tasks = [];
try {
    const saved = localStorage.getItem('tasks');
    tasks = saved ? JSON.parse(saved) : [];
} catch (e) {
    console.error('Error loading tasks:', e);
    tasks = [];
}

// ===========================
// MOTIVATIONAL MESSAGES
// ===========================
// Array of different motivational messages that change each time you add a task
const motivationalMessages = [
    "🌟 You can do it! Keep going!",
    "💪 Don't give up! You're amazing!",
    "🎯 Great job! One step closer!",
    "✨ Believe in yourself! You got this!",
    "🚀 Let's goooo! You're doing great!",
    "💕 You're awesome! Keep it up!",
    "🌈 Stay positive! You can achieve it!",
    "⭐ Fantastic! Keep pushing forward!",
    "🎉 Yes! You're on fire! 🔥",
    "💖 Remember: Progress > Perfection!",
    "🌸 Beautiful! One task at a time!",
    "🦋 Transform yourself! You've got this!",
    "🌺 Every task brings you closer!",
    "💝 Love your progress! Keep going!",
    "🎀 You're unstoppable! Keep shining!",
    "✨ This is amazing! Proud of you!",
    "🌟 Make it happen! Believe in yourself!",
    "💖 You're crushing it! Don't stop!"
];

// Function to show a random motivational message
function showMotivationalMessage() {
    // Get a random message from the array
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    const message = motivationalMessages[randomIndex];
    
    // Get the message element
    const messageElement = document.getElementById('motivationMessage');
    
    // Set the message text
    messageElement.textContent = message;
    
    // Show the message by adding the 'show' class
    messageElement.classList.add('show');
    
    // Automatically hide the message after 3 seconds (3000 milliseconds)
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
}

// ===========================
// ADD NEW TASK FUNCTION
// ===========================
// This function runs when user clicks "Add Task" button or presses Enter
function addTask() {
    // Get the input field where user types the task
    const input = document.getElementById('taskInput');
    
    // Get the text from input and remove extra spaces with .trim()
    const taskText = input.value.trim();
    
    // Check if input is empty - if yes, show alert and stop the function
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create a new task object with all the information we need
    const task = {
        id: Date.now(),                           // Unique ID using current timestamp
        text: taskText,                           // The task text entered by user
        completed: false,                         // Not completed yet - ALWAYS FALSE for new tasks
        createdAt: new Date().toLocaleString()   // When task was created
    };
    
    // Debug: Log that we're adding a task
    console.log('Adding task:', task);
    
    // Add the new task to the tasks array
    tasks.push(task);
    
    // Save all tasks to browser storage (localStorage)
    saveTasks();
    
    // Update the display to show the new task
    renderTasks();
    
    // Show a motivational message
    showMotivationalMessage();
    
    // Clear the input field so it's ready for next task
    input.value = '';
    
    // Focus back on input field so user can type next task immediately
    input.focus();
}

// ===========================
// DELETE TASK FUNCTION
// ===========================
// This function removes a task from the list by its ID
function deleteTask(id) {
    // Debug: Log deletion
    console.log('Deleting task with id:', id);
    
    // .filter() keeps only tasks that DON'T match the ID we're deleting
    // So task with matching ID gets removed
    tasks = tasks.filter(task => task.id !== id);
    
    // Save the updated tasks list to browser storage
    saveTasks();
    
    // Update the display to show tasks without deleted one
    renderTasks();
}

// ===========================
// TOGGLE TASK COMPLETION
// ===========================
// This function marks a task as done/undone when user clicks the checkbox
function toggleTask(id) {
    // Debug: Log toggle
    console.log('🔘 Toggling task with id:', id);
    console.log('Current tasks:', tasks);
    
    // .find() searches for the task with matching ID
    const task = tasks.find(t => t.id === id);
    
    // If task exists, change its completed status (true becomes false, false becomes true)
    if (task) {
        // Flip the completed status
        task.completed = !task.completed;
        
        console.log(`✅ Task ${id} completed status changed to: ${task.completed}`);
        console.log('Updated tasks array:', tasks);
        
        // Save the updated task to browser storage
        saveTasks();
        
        // Update the display to show the change
        renderTasks();
    } else {
        console.error('❌ Task not found with id:', id);
    }
}

// ===========================
// DISPLAY ALL TASKS
// ===========================
// This function shows all tasks on the webpage
function renderTasks() {
    // Get references to the HTML elements we need to update
    const taskList = document.getElementById('taskList');           // Where tasks appear
    const emptyState = document.getElementById('emptyState');       // "No tasks" message
    const totalCount = document.getElementById('totalCount');       // Total number
    const completedCount = document.getElementById('completedCount'); // Completed number
    
    // Debug: Log current tasks
    console.log('🔄 Rendering tasks:', tasks);
    
    // Clear the task list (remove all displayed tasks)
    taskList.innerHTML = '';
    
    // Check if there are NO tasks in the array
    if (tasks.length === 0) {
        // Show the "No tasks" empty message
        emptyState.style.display = 'flex';
        
        // Update the stats to show 0 tasks
        totalCount.textContent = '0';
        completedCount.textContent = '0';
        
        // Stop function here - nothing more to display
        return;
    }
    
    // Hide the empty message since we have tasks to show
    emptyState.style.display = 'none';
    
    // Update total tasks count
    totalCount.textContent = tasks.length;
    
    // Count and update completed tasks
    const completedTasks = tasks.filter(t => t.completed).length;
    completedCount.textContent = completedTasks;
    console.log(`✅ Completed: ${completedTasks} / Total: ${tasks.length}`);
    
    // Loop through each task and create HTML for it
    tasks.forEach(task => {
        // Create a new <li> (list item) element for this task
        const li = document.createElement('li');
        
        // Add CSS class names: 'task-item' always, plus 'completed' if task is done
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Create the HTML for this task item
        li.innerHTML = `
            <div class="task-content">
                <input 
                    type="checkbox" 
                    class="task-checkbox"
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                >
                <span class="task-text">${escapeHtml(task.text)}</span>
            </div>
            <button class="btn-delete" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        // Add this task to the displayed list on webpage
        taskList.appendChild(li);
    });
}

// ===========================
// SAVE TASKS TO STORAGE
// ===========================
// This function saves all tasks to the browser's localStorage
// So tasks stay even after page is refreshed
function saveTasks() {
    // Convert tasks array to JSON text and save it with key 'tasks'
    try {
        const jsonData = JSON.stringify(tasks);
        localStorage.setItem('tasks', jsonData);
        console.log('✅ Tasks saved to localStorage:', jsonData);
    } catch (e) {
        console.error('❌ Error saving tasks:', e);
    }
}

// ===========================
// ESCAPE HTML - SECURITY
// ===========================
// This function prevents hackers from injecting code through task text
// It converts dangerous characters to safe ones
function escapeHtml(text) {
    // Create a temporary div element
    const div = document.createElement('div');
    
    // Put the text inside it as plain text (not HTML)
    div.textContent = text;
    
    // Get the HTML back - now with dangerous characters converted to safe ones
    return div.innerHTML;
}

// ===========================
// CLEAR ALL TASKS (Debug Function)
// ===========================
// This function clears all tasks - useful for testing
function clearAllTasks() {
    if (confirm('Are you sure you want to delete ALL tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
        console.log('All tasks cleared');
    }
}

// ===========================
// INITIALIZE WHEN PAGE LOADS
// ===========================
// Wait for page to fully load before running this code
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - initializing todo app');
    
    // Get the input field
    const input = document.getElementById('taskInput');
    
    // Listen for when user presses a key in the input field
    input.addEventListener('keypress', function(e) {
        // If user pressed the Enter key
        if (e.key === 'Enter') {
            // Run the addTask function (same as clicking Add button)
            addTask();
        }
    });
    
    // Display all tasks when page first loads
    renderTasks();
});