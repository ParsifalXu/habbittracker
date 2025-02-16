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
            createdAt: new Date()
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
            <span class="habit-text">${habit.text}</span>
            <button class="delete-btn">×</button>
        `;

        // Add delete functionality
        const deleteBtn = habitElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            habits = habits.filter(h => h.id !== habit.id);
            localStorage.setItem('habits', JSON.stringify(habits));
            habitElement.remove();
        });

        habitList.appendChild(habitElement);
    }
}); 