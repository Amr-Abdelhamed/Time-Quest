let tasks = [];
        let points = 0;
        let initialTimer = 25 * 60; // Default 25 minutes in seconds
        let timer = initialTimer; // Current timer value
        let isRunning = false;
        let intervalId = null;

        function updateInitialTimer() {
            const timerInput = document.getElementById('timerInput');
            const minutes = parseInt(timerInput.value) || 1; // Default to 1 if invalid
            if (minutes < 1) timerInput.value = 1; // Prevent negative or zero
            initialTimer = minutes * 60; // Convert to seconds
            if (!isRunning) {
                timer = initialTimer;
                document.getElementById('timer').textContent = formatTime(timer);
            }
        }

        function addTask() {
            const taskInput = document.getElementById('taskInput');
            const urgentSelect = document.getElementById('urgentSelect');
            const importantSelect = document.getElementById('importantSelect');
            const taskText = taskInput.value.trim();
            if (taskText) {
                tasks.push({
                    text: taskText,
                    completed: false,
                    urgent: urgentSelect.value === 'urgent',
                    important: importantSelect.value === 'important'
                });
                taskInput.value = '';
                renderTasks();
                renderMatrix();
            }
        }

        function completeTask(index) {
            tasks[index].completed = true;
            points += 10; // Earn 10 points per task
            updatePoints();
            renderTasks();
            renderMatrix();
            updateProgress();
        }

        function deleteTask(index) {
            tasks.splice(index, 1);
            renderTasks();
            renderMatrix();
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

        function renderMatrix() {
            const urgentImportant = document.getElementById('urgentImportant');
            const notUrgentImportant = document.getElementById('notUrgentImportant');
            const urgentNotImportant = document.getElementById('urgentNotImportant');
            const notUrgentNotImportant = document.getElementById('notUrgentNotImportant');

            urgentImportant.innerHTML = '';
            notUrgentImportant.innerHTML = '';
            urgentNotImportant.innerHTML = '';
            notUrgentNotImportant.innerHTML = '';

            tasks.forEach((task, index) => {
                if (task.completed) return; // Skip completed tasks

                const li = document.createElement('li');
                li.className = 'p-2 bg-gray-700 rounded';
                li.textContent = task.text;

                if (task.urgent && task.important) {
                    urgentImportant.appendChild(li);
                } else if (!task.urgent && task.important) {
                    notUrgentImportant.appendChild(li);
                } else if (task.urgent && !task.important) {
                    urgentNotImportant.appendChild(li);
                } else {
                    notUrgentNotImportant.appendChild(li);
                }
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
                updateInitialTimer(); // Update timer in case input changed
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
            updateInitialTimer(); // Reset to the input value
            timer = initialTimer;
            document.getElementById('timer').textContent = formatTime(timer);
            document.getElementById('startPauseBtn').textContent = 'Start';
        }

        // Initialize
        updatePoints();
        updateProgress();
        renderMatrix();

        // Update timer display when input changes
        document.getElementById('timerInput').addEventListener('input', () => {
            if (!isRunning) {
                updateInitialTimer();
            }
        });
