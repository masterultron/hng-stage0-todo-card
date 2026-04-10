/**
 * HNG Stage 0 - Task Logic
 * Handles dynamic time calculation and UI state changes
 */

const dueDate = new Date("2026-04-16T18:00:00");
const checkbox = document.getElementById('complete-checkbox');
const card = document.querySelector('[data-testid="test-todo-card"]');
const statusLabel = document.querySelector('[data-testid="test-todo-status"]');
const timeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');

/**
 * Calculates the difference between now and the deadline.
 * Handles pluralization of time strings for a better human UI.
 */
function updateTimeRemaining() {
    const now = new Date();
    const diff = dueDate - now;

    if (diff <= 0) {
        timeRemaining.textContent = "Overdue!";
        timeRemaining.style.color = "var(--danger)";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    if (days > 0) {
        timeRemaining.textContent = `Due in ${days} day${days > 1 ? 's' : ''}`;
    } else {
        timeRemaining.textContent = `Due in ${hours} hour${hours > 1 ? 's' : ''}`;
    }
}

// Event listener for completion toggle to update UI status
checkbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        card.classList.add('completed');
        statusLabel.textContent = "Done";
    } else {
        card.classList.remove('completed');
        statusLabel.textContent = "Pending";
    }
});

// Setup dummy listeners for the card buttons
document.querySelector('[data-testid="test-todo-edit-button"]').onclick = () => console.log("Edit triggered");
document.querySelector('[data-testid="test-todo-delete-button"]').onclick = () => alert("Delete triggered");

// Initial call and set interval to keep the "time remaining" accurate
updateTimeRemaining();
setInterval(updateTimeRemaining, 60000);