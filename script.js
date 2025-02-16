document.addEventListener('DOMContentLoaded', () => {
    const habitInput = document.getElementById('habitInput');
    const addHabitBtn = document.getElementById('addHabitBtn');
    const habitList = document.getElementById('habitList');

    // Load habits from localStorage
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    
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
}); 