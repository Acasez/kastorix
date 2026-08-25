// Define formatOption and formatOptionSelection globally
function formatOption(option) {
    if (!option.id) {
        return option.text;
    }
    var imageUrl = $(option.element).data('image');
    var $option = $(
        '<span><img src="' + imageUrl + '" class="action-icon" /></span>'
    );
    return $option;
}

function formatOptionSelection(option) {
    if (!option.id) {
        return option.text;
    }
    var imageUrl = $(option.element).data('image');
    var $option = $(
        '<span><img src="' + imageUrl + '" class="action-icon" /></span>'
    );
    return $option;
}

document.addEventListener('click', function(event) {
    // Add Action
    if (event.target.classList.contains('addAction')) {
        const container = event.target.closest('.extendableList');
        const actionsContainer = container.querySelector('.actionsContainer');
        const template = document.getElementById('actionTemplate');
        if (actionsContainer && template) {
            const clone = template.content.cloneNode(true);
            actionsContainer.appendChild(clone);
            // Initialize Select2 for the new action dropdown
            const newSelect = actionsContainer.lastElementChild.querySelector('.image-select');
            $(newSelect).select2({
                templateResult: formatOption,
                templateSelection: formatOptionSelection,
                escapeMarkup: function(m) { return m; }
            });
        }
    }

    if (event.target.classList.contains('addPassive')) {
        const container = event.target.closest('.extendableList');
        const passivesContainer = container.querySelector('.passivesContainer');
        const template = document.getElementById('passiveTemplate');
        if (passivesContainer && template) {
            const clone = template.content.cloneNode(true);
            passivesContainer.appendChild(clone);
        }
    }

    // Remove Action
    if (event.target.classList.contains('removeAction')) {
        const section = event.target.closest('.spellSection');
        if (section) {
            const select = section.querySelector('.image-select');
            if (select && $(select).data('select2')) {
                $(select).select2('destroy');
            }
            section.remove();
        }
    }

    if (event.target.classList.contains('removePassive')) {
        const section = event.target.closest('.spellSection');
        if (section) {
            const select = section.querySelector('.image-select');
            if (select && $(select).data('select2')) {
                $(select).select2('destroy');
            }
            section.remove();
        }
    }
});

//Action select dropdown
$(document).ready(function() {
    $('.image-select').select2({
        templateResult: formatOption,
        templateSelection: formatOptionSelection,
        escapeMarkup: function(m) { return m; }
    });
});

function updateCreatureActions(creatureIndex, actionsContainer) {
    const actions = [];
    const actionSections = actionsContainer.querySelectorAll('.spellSection');

    actionSections.forEach(section => {
        const name = section.querySelector('.actionName').value;
        const actionsValue = section.querySelector('.image-select').value;
        const requirement = section.querySelector('.actionRequirement').value;
        const effect = section.querySelector('.actionEffect').value;

        actions.push({
            name: name,
            actions: actionsValue,
            requirement: requirement,
            effect: effect
        });
    });

    if (window.creatures && window.creatures[creatureIndex]) {
        window.creatures[creatureIndex].actions = actions;
        //console.log(`Updated actions for creature ${creatureIndex}:`, actions);
    }
}

function updateCreaturePassives(creatureIndex, passivesContainer) {
    const passives = [];
    const passiveSections = passivesContainer.querySelectorAll('.spellSection');

    passiveSections.forEach(section => {
        const name = section.querySelector('.passiveName').value;
        const requirement = section.querySelector('.passiveRequirement').value;
        const effect = section.querySelector('.passiveEffect').value;

        passives.push({
            name: name,
            requirement: requirement,
            effect: effect
        });
    });

    if (window.creatures && window.creatures[creatureIndex]) {
        window.creatures[creatureIndex].passives = passives;
        console.log(`Updated passives for creature ${creatureIndex}:`, passives);
    }
}