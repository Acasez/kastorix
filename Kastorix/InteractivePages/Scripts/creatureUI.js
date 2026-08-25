const creatureUiCache = new Map();

function getCreatureUi(creatureIndex, container) {
    const cachedEntry = creatureUiCache.get(creatureIndex);
    if (cachedEntry && cachedEntry.container === container) {
        return cachedEntry;
    }

    const uiContext = {
        container,
        actionsContainer: container.querySelector('.actionsContainer'),
        passivesContainer: container.querySelector('.passivesContainer'),
        healthInput: container.querySelector('[data-property="health"]'),
        manaInput: container.querySelector('[data-property="mana"]'),
        auraInput: container.querySelector('[data-property="aura"]')
    };

    creatureUiCache.set(creatureIndex, uiContext);
    return uiContext;
}

function setUpListenersForCreature(creatureContainer, creatureIndex) {
    const uiContext = getCreatureUi(creatureIndex, creatureContainer);

    // Listen for input changes in stat fields
    creatureContainer.addEventListener('input', function (e) {
        if (e.target.matches('.text-field, .stat-input, .input-field, .bar-input')) {
            const property = e.target.dataset.property;
            const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;

            if (window.creatures && window.creatures[creatureIndex]) {
                window.creatures[creatureIndex][property] = value;
            }
            if (e.target.classList.contains('stat-input')) {
                updateOnStatIncrease(creatureIndex);
            }
            else if (e.target.classList.contains('bar-input')) {
                let barType = property;
                if (property.startsWith('max')) {
                    barType = property.substring(3).charAt(0).toLowerCase() + property.substring(4);
                }
                updateBar(barType, creatureContainer, property, creatureIndex);
            }
        }
    });

    // Listen for input changes in action fields
    if (uiContext.actionsContainer) {
        uiContext.actionsContainer.addEventListener('input', function (e) {
            if (e.target.matches('.actionName, .actionRequirement, .actionEffect, .image-select')) {
                updateCreatureActions(creatureIndex, uiContext.actionsContainer);
            }
        });
    }

    // Listen for input changes in passive fields
    if (uiContext.passivesContainer) {
        uiContext.passivesContainer.addEventListener('input', function (e) {
            if (e.target.matches('.passiveName, .passiveRequirement, .passiveEffect')) {
                updateCreaturePassives(creatureIndex, uiContext.passivesContainer);
            }
        });
    }

    // Listen for proficiency button clicks
    creatureContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('proficiency-cycle-button')) {
            const property = e.target.dataset.property;
            const creature = window.creatures ? window.creatures[creatureIndex] : null;
            cycleProficiency(property, e.target, creature.saves, 'saves', creature);
        }
    });
}