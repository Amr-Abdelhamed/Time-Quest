let tasks = [];
let points = 0;
let timer = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let intervalId = null;

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        renderTasks();
    }
}

function completeTask(index) {
    tasks[index].completed = true;
    points += 10; // Earn 10 points per task
    updatePoints();
    renderTasks();
    updateProgress();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
    updateProgress();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center p-2 bg-gray-700 rounded';
        li.innerHTML = `
            <span class="${task.completed ? 'line-through text-gray-400' : ''}">${task.text}</span>
            <div>
                ${!task.completed ? `<button onclick="completeTask(${index})" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2">Complete</button>` : ''}
                <button onclick="deleteTask(${index})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function updatePoints() {
    document.getElementById('points').textContent = points;
}

function updateProgress() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(intervalId);
        document.getElementById('startPauseBtn').textContent = 'Start';
    } else {
        intervalId = setInterval(() => {
            if (timer > 0) {
                timer--;
                document.getElementById('timer').textContent = formatTime(timer);
            } else {
                clearInterval(intervalId);
                isRunning = false;
                document.getElementById('startPauseBtn').textContent = 'Start';
                points += 25; // Earn 25 points for completing a session
                updatePoints();
                alert('Session complete! +25 points');
            }
        }, 1000);
        document.getElementById('startPauseBtn').textContent = 'Pause';
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(intervalId);
    isRunning = false;
    timer = 25 * 60;
    document.getElementById('timer').textContent = formatTime(timer);
    document.getElementById('startPauseBtn').textContent = 'Start';
}

// Initialize
updatePoints();
updateProgress();