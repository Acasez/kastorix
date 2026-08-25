// Define the standard array values in one place
const standardArray = [3, 1, 0, -1];

// Track used values
const usedValues = new Set();

// Initialize dropdowns with the standard array values
function initializeDropdowns() {
    const statSelects = document.querySelectorAll('.stat-select');
    statSelects.forEach(select => {
        // Clear existing options (except the default "--")
        select.innerHTML = '<option value="">--</option>';

        // Add options from the standard array
        standardArray.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    });
}

// Update dropdowns when a selection is made
document.querySelectorAll('.stat-select').forEach(select => {
    select.addEventListener('change', function () {
        const selectedValue = this.value;
        const prevValue = this.dataset.prevValue;

        // If a value was previously selected, remove it from usedValues
        if (prevValue) {
            usedValues.delete(prevValue);
            // Re-enable the previous value in all dropdowns
            document.querySelectorAll('.stat-select').forEach(otherSelect => {
                const options = otherSelect.querySelectorAll('option');
                options.forEach(option => {
                    if (option.value === prevValue) {
                        option.disabled = false;
                    }
                });
            });
        }

        // If a new value is selected, add it to usedValues
        if (selectedValue) {
            usedValues.add(selectedValue);
            // Disable this value in other dropdowns
            document.querySelectorAll('.stat-select').forEach(otherSelect => {
                if (otherSelect !== this) {
                    const options = otherSelect.querySelectorAll('option');
                    options.forEach(option => {
                        if (option.value === selectedValue) {
                            option.disabled = true;
                        }
                    });
                    // If the disabled value was selected, reset
                    if (otherSelect.value === selectedValue) {
                        otherSelect.value = '';
                    }
                }
            });
        }

        // Update the previous value for this dropdown
        this.dataset.prevValue = selectedValue;
    });
});

// Confirm button logic
document.getElementById('confirmStats').addEventListener('click', function () {
    const phy = document.getElementById('phySet').value;
    const dex = document.getElementById('dexSet').value;
    const int = document.getElementById('intSet').value;
    const wil = document.getElementById('wilSet').value;

    if (phy && dex && int && wil && usedValues.size === 4) {
        document.getElementById('statsModal').style.display = 'none';
        setBaseStats(phy, dex, int, wil);
    } else {
        alert('Please assign all stats with unique values from the standard array.');
    }
});

// Reset dropdowns to their current values
function resetStatSelector() {
    document.getElementById('phySet').value = characterState.phy || '';
    document.getElementById('dexSet').value = characterState.dex || '';
    document.getElementById('intSet').value = characterState.int || '';
    document.getElementById('wilSet').value = characterState.wil || '';
}

// Initialize dropdowns when the page loads
window.addEventListener('DOMContentLoaded', initializeDropdowns);