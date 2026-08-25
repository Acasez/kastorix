//Statuses
const statusConfigs = {
    dying: { maxLevel: 3 },
    wounded: { maxLevel: 3 },
    fatigue: { maxLevel: 5 },
    frightened: { maxLevel: 5 },
    stupefied: { maxLevel: 5 },
    manaPoisoned: {maxLevel: 5},
    // Add more statuses and their max levels here
};
function getStatusLevels(maxLevel) {
    const levels = [];
    for (let i = 0; i <= maxLevel; i++) {
        levels.push({
            name: i.toString(),
            value: i,
            fullName: `Level ${i}`,
            color: getColorForLevel(i, maxLevel) // Optional: Define a color scale
        });
    }
    return levels;
}

// Optional: Define a simple color scale
function getColorForLevel(level, maxLevel) {
    const intensity = level / maxLevel * 255;
    return `rgb(${255}, ${255 - intensity}, ${255 - intensity})`;
}

function cycleStatus(id, button, statusObject) {
    const config = statusConfigs[id];
    if (!config) return; // Skip if status is not configured

    const statusLevels = getStatusLevels(config.maxLevel);
    const currentValue = (statusObject[id] || 0);
    let currentIndex = statusLevels.findIndex(level => level.value === currentValue);
    if (currentIndex === -1) currentIndex = 0; // Default to 0

    const nextIndex = (currentIndex + 1) % statusLevels.length;
    const nextLevel = statusLevels[nextIndex];

    statusObject[id] = nextLevel.value;
    button.textContent = nextLevel.name;
    button.title = nextLevel.fullName;
    button.style.backgroundColor = nextLevel.color;
    updateOnStatIncrease();
}