window.creatures = []; // Global array to hold all creatures
let currentCreatureIndex = 0;
let sizes = [];
let currentContainer = null;
const creatureContainerCache = new Map();

function getCreatureContainer(creatureIndex = currentCreatureIndex) {
    const cachedContainer = creatureContainerCache.get(creatureIndex);
    if (cachedContainer) {
        return cachedContainer;
    }

    const container = document.querySelector(`.creature-container[data-creature-index="${creatureIndex}"]`);
    if (container) {
        creatureContainerCache.set(creatureIndex, container);
    }
    return container;
}

function setCurrentCreatureIndex(index) {
    const normalizedIndex = Number(index);
    if (Number.isNaN(normalizedIndex)) {
        return null;
    }

    currentCreatureIndex = normalizedIndex;
    currentContainer = getCreatureContainer(normalizedIndex);
    return currentContainer;
}

function getContainerFromTarget(target) {
    if (!target) {
        return null;
    }

    const container = target.closest('.creature-container');
    if (!container) {
        return null;
    }

    const creatureIndex = container.dataset.creatureIndex;
    if (creatureIndex !== undefined) {
        setCurrentCreatureIndex(creatureIndex);
    }

    return getCreatureContainer(creatureIndex ?? currentCreatureIndex);
}

// Call this function when the page loads
window.onload = function() {
    loadInCustomWeaponModal();
    loadJSON('sizes').then(data => {
        sizes = data;
        addNewCreature();
    });
};

// Function to update window.equipment when a field is edited
function updateFields(fieldId, propertyName) {
    var field = document.getElementById(fieldId);
    if (field) {
        field.addEventListener('input', function () {
            //console.log("updating inventory");
            if (field.type === 'number') {
                characterState.inventory[propertyName] = parseInt(field.value) || 0;
            }
            else {
                characterState.inventory[propertyName] = field.value;
            }
        });
    }
}

// Listen for stat input changes in all containers
document.addEventListener('input', function(e) {
    if (['phy', 'dex', 'wil'].includes(e.target.id)) {
        const container = getContainerFromTarget(e.target);
        if (container) updateSkillModifiers(container);
    }
});

// Attach event listeners for all resource bars in all creature blocks
document.addEventListener('input', function (e) {
    const resourceIds = ['health', 'aura', 'mana'];
    if (resourceIds.includes(e.target.id)) {
        const creatureContainer = getContainerFromTarget(e.target);
        if (creatureContainer) {
            updateBar(e.target.id, creatureContainer);
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('contextmenu', (e) => {
        if (e.target.matches('.chooseSpellsModal, .chooseWeaponsModal, .chooseMetamagicModal, .chooseCombatManeuversModal')) {
            e.preventDefault();
            const container = getContainerFromTarget(e.target);
            const index = container?.dataset.creatureIndex ?? e.target.dataset.creatureIndex;
            const creature = creatures[index];
            handleButtonRightClick(e.target, creature);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () { //Left Click
    document.addEventListener('click', (e) => {
        if (e.target.matches('.chooseSpellsModal, .chooseWeaponsModal, .chooseMetamagicModal, .chooseCombatManeuversModal')) {
            e.preventDefault();
            const container = getContainerFromTarget(e.target);
            const index = container?.dataset.creatureIndex ?? e.target.dataset.creatureIndex;
            const creature = creatures[index];
            handleButtonClick(e.target, creature);
        }
    });
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('importCreatureButton')) {
        // Create a hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';

        // When a file is selected, handle it
        fileInput.addEventListener('change', function(e) {
            importCreature(e, event.target);
        });

        // Trigger the file input click
        fileInput.click();
    }
});

function closeCreatureContainer(button) {
    const index = button.dataset.creatureIndex;
    const container = getCreatureContainer(index);
    if (container) {
        container.remove();
        creatureContainerCache.delete(index);
        if (currentCreatureIndex === Number(index)) {
            currentContainer = null;
        }
    }
}

function afterLoadedJSON() {
    
}
