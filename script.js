document.addEventListener('DOMContentLoaded', () => {
    const habitInput = document.getElementById('habitInput');
    const addHabitBtn = document.getElementById('addHabitBtn');
    const habitList = document.getElementById('habitList');
    const calendar = document.getElementById('calendar');

    // Load habits from localStorage
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    let completionDates = JSON.parse(localStorage.getItem('completionDates')) || {};
    
    // Initialize calendar
    initializeCalendar();
    
    // Display existing habits
    habits.forEach(habit => displayHabit(habit));

    addHabitBtn.addEventListener('click', addHabit);
    habitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addHabit();
        }
    });

    function addHabit() {
        const habitText = habitInput.value.trim();
        
        if (habitText === '') {
            alert('Please enter a habit!');
            return;
        }

        // Create new habit object
        const habit = {
            id: Date.now(),
            text: habitText,
            createdAt: new Date(),
            completed: false
        };

        // Add to habits array
        habits.push(habit);
        
        // Save to localStorage
        localStorage.setItem('habits', JSON.stringify(habits));

        // Display the habit
        displayHabit(habit);
        
        // Clear the input
        habitInput.value = '';
        
        // Focus back on the input
        habitInput.focus();
    }

    function displayHabit(habit) {
        const habitElement = document.createElement('div');
        habitElement.classList.add('habit-item');
        habitElement.dataset.id = habit.id;
        
        habitElement.innerHTML = `
            <div class="habit-content">
                <input type="checkbox" class="habit-checkbox" ${habit.completed ? 'checked' : ''}>
                <span class="habit-text">${habit.text}</span>
            </div>
            <button class="delete-btn">×</button>
        `;

        // Add delete functionality
        const deleteBtn = habitElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            habits = habits.filter(h => h.id !== habit.id);
            localStorage.setItem('habits', JSON.stringify(habits));
            habitElement.remove();
        });

        // Add checkbox functionality
        const checkbox = habitElement.querySelector('.habit-checkbox');
        checkbox.addEventListener('change', () => {
            const habitId = parseInt(habitElement.dataset.id);
            const habit = habits.find(h => h.id === habitId);
            habit.completed = checkbox.checked;
            localStorage.setItem('habits', JSON.stringify(habits));

            if (checkbox.checked) {
                celebrateCompletion();
                updateCalendarCompletion();
            }
        });

        habitList.appendChild(habitElement);
    }

    function celebrateCompletion() {
        // Fire confetti from the center
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Fire from the sides
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 250);
    }

    function initializeCalendar() {
        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-header';
            dayHeader.textContent = day;
            calendar.appendChild(dayHeader);
        });

        // Add calendar days
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Get first day of current month
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            addCalendarDay('');
        }
        
        // Add days of current month
        for (let date = 1; date <= lastDay.getDate(); date++) {
            const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
            const dayElement = addCalendarDay(date);
            
            if (completionDates[dateStr]) {
                dayElement.classList.add('completed');
            }
            
            if (date === today.getDate()) {
                dayElement.classList.add('today');
            }
        }
    }

    function addCalendarDay(content) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = content;
        calendar.appendChild(dayElement);
        return dayElement;
    }

    function updateCalendarCompletion() {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        // Check if all habits are completed for today
        const allCompleted = habits.every(habit => habit.completed);
        
        if (allCompleted) {
            completionDates[dateStr] = true;
            localStorage.setItem('completionDates', JSON.stringify(completionDates));
            
            // Update calendar UI
            const todayElement = Array.from(document.querySelectorAll('.calendar-day'))
                .find(day => day.classList.contains('today'));
            if (todayElement) {
                todayElement.classList.add('completed');
            }
        }
    }
}); 