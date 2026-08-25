function initializeModalList({ 
    title, 
    listId = 'modalList', 
    detailsId = 'modal-details',
    selectButtonLabel = 'Select', 
    detailsRenderer, 
    itemType,
    characterLevel = null,
    tabName = null,
    itemList = null,
    oldItem = null,
}) {
    //console.log("Opening modal for " + itemType)
    
    const selectButtonClass = 'choose-item-button'; 
    // Get the modal and find the container inside modal-content
    const modal = document.getElementById("mainModal");
    const container = modal.querySelector('.modal-content > div');

    if (!container || container == undefined) {
        console.error(`Container not found for modal "${itemType}"`);
        return;
    }
    // Set modal title
    const titleElem = container.querySelector('.modal-title');
    if (titleElem) {
        if (!isNaN(characterLevel)) {
            titleElem.textContent = title + " [Level " + characterLevel + "]";
        } else {
            titleElem.textContent = title; // Fallback
        }
    }

    const listElement = document.getElementById(listId);
    if (!listElement) {
        console.error(`List element with id "${listId}" not found in modal of type "${itemType}"`);
        return;
    }
    listElement.innerHTML = '';
    const tabsContainer = document.getElementById('tabsContainer');
    if (!tabsContainer) {
        console.error(`Tabs container not found in modal of type "${itemType}"`);
        return;
    }
    tabsContainer.innerHTML = '';

    const data = globalData[itemType]

    // Check if data has an "All" key or multiple categories
    if (Array.isArray(data)) {
        // Single "All" category: show everything in one list
        // Use the existing list element instead of creating a new one
        listElement.innerHTML = '';
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name + (item.level ? " [" + item.level + "]" : "");
            var isUnavailable = characterLevel !== null && item.level && characterLevel < item.level;
            var isCurrentlySelected = false;
            if (itemList && itemList.some(listItem => listItem.name === item.name) && !item.repeatable) {
                if (oldItem && item.name == oldItem){
                    isCurrentlySelected = true;
                }
                else {
                    isUnavailable = true;
                }
            }

            if (isUnavailable) {
                li.classList.add('item-unavailable');
                li.style.cursor = 'not-allowed';
            }
            else {
                if (isCurrentlySelected){
                    li.classList.add('item-current');
                }
                li.addEventListener('click', () => showDetails(item, detailsId, detailsRenderer, selectButtonClass, selectButtonLabel, itemType));
            }
            listElement.appendChild(li);
        });
    } else {
        // Multiple categories: create tabs for each
        Object.keys(data).forEach(category => {
            if (category == "Special"){
                console.log("Skipping Special category")
                return;
            }
            // Remove the number prefix (e.g., "(1) Apprentice" -> "Apprentice")
            const cleanedCategory = category.replace(/^\(\d+\)\s*/, '').trim();

            const tabButton = document.createElement('button');
            tabButton.className = 'tab-button';
            tabButton.setAttribute('data-tab', cleanedCategory);
            tabButton.textContent = cleanedCategory;

            tabsContainer.appendChild(tabButton);

            const categoryList = document.createElement('ul');
            categoryList.className = 'item-list';
            categoryList.id = `${listId}-${cleanedCategory}`;
            categoryList.style.display = 'none';
            listElement.parentNode.appendChild(categoryList);

            data[category].forEach(item => {
                const li = document.createElement('li');
                if (item.actions) {
                    // Check if the spell is a reaction spell
                    if (item.actions.includes("Reaction.png")) {
                        // Extract only the image tag for reaction spells
                        const reactionImgMatch = item.actions.match(/<img[^>]+>/);
                        li.innerHTML = item.name + (reactionImgMatch ? " " + reactionImgMatch[0] : "") + (item.level ? " " + item.level : "");
                    } else {
                        // Display the full content for non-reaction spells
                        li.innerHTML = item.name + " " + item.actions + (item.level ? " " + item.level : "");
                    }
                } else {
                    li.textContent = item.name + (item.level ? " " + item.level : "");
                }
                const isUnavailable = characterLevel !== null && item.level && characterLevel < item.level;
                if (isUnavailable) {
                    li.classList.add('item-unavailable');
                    li.style.cursor = 'not-allowed';
                } else {
                    li.addEventListener('click', () => showDetails(item, detailsId, detailsRenderer, selectButtonClass, selectButtonLabel, itemType));
                }
                categoryList.appendChild(li);
            });
        });

        // Show the first tab by default, or the requested tab name
        if (Object.keys(data).length > 0) {
            let targetCategory = null;
            
            // If a specific tab name was requested, try to find it
            if (tabName) {
                // Handle special case where "Grand Magus" is stored as "GrandMagus" in JSON
                let searchName = tabName;
                if (tabName === 'Grand Magus') {
                    searchName = 'GrandMagus';
                }
                
                // Find the matching category (account for number prefix)
                const matchingKey = Object.keys(data).find(key => {
                    const cleanedKey = key.replace(/^\(\d+\)\s*/, '').trim();
                    return cleanedKey === tabName || cleanedKey === searchName;
                });
                
                if (matchingKey) {
                    targetCategory = matchingKey.replace(/^\(\d+\)\s*/, '').trim();
                }
            }
            
            // If target category wasn't found, use the first one
            if (!targetCategory) {
                console.log("Couldn't find category ", tabName)
                const firstCategory = Object.keys(data)[0];
                targetCategory = firstCategory.replace(/^\(\d+\)\s*/, '').trim();
            }
            
            const tabButton = container.querySelector(`[data-tab="${targetCategory}"]`);
            if (tabButton) {
                tabButton.classList.add('active');
                const targetListId = `${listId}-${targetCategory}`;
                const targetList = document.getElementById(targetListId);
                if (targetList) {
                    targetList.style.display = 'block';
                }
            }
        }

        // Add event listeners for tab switching
        container.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                container.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                container.querySelectorAll('.item-list').forEach(list => list.style.display = 'none');
                document.getElementById(`${listId}-${button.getAttribute('data-tab')}`).style.display = 'block';
                //Set up custom weapons
                if (button.getAttribute('data-tab') == "Custom") {
                    const detailsElement = document.getElementById(detailsId);
                    // Clear previous content in the details area
                    detailsElement.innerHTML = '';

                    insertCustomWeaponOptions(detailsElement);
                }
            });
        });

    }

    function showDetails(item, detailsId, detailsRenderer, selectButtonClass, selectButtonLabel, itemType) {
        const detailsElement = document.getElementById(detailsId);
        detailsElement.innerHTML = detailsRenderer(item, selectButtonClass, selectButtonLabel);

        let spellrank = null;
        if (itemType === 'spell') {
            const raw = item.rank || '';
            spellrank = raw.replace(/^\(\d+\)\s*/, '').trim() || null;
        }

        let selectedChoice = null; // For non-rune choices (e.g., aspects, golem models)
        let selectedRunes = [];    // Track selected runes (array for multi-select)

        const choiceDescription = document.createElement('p');
        detailsElement.appendChild(choiceDescription);


        // --- Handle Runes for Weapons/Armors ---
        if (itemType === "weapon" || itemType === "armor") {
            const applicableRunes = globalData.runes.filter(
                rune => rune.item.toLowerCase() === "all" || rune.item.toLowerCase() === itemType
            );

            if (applicableRunes.length > 0) {
                const runeContainer = document.createElement('div');
                runeContainer.className = 'runeContainer';

                const runeLabel = document.createElement('p');
                runeLabel.textContent = 'Optional Runes (Select 0 or more):';
                runeContainer.appendChild(runeLabel);

                applicableRunes.forEach(rune => {
                    const runeButton = document.createElement('button');
                    runeButton.className = 'runeButton'; // Style this class in CSS
                    runeButton.setAttribute('rune', rune.name);
                    runeButton.textContent = rune.name;

                    runeButton.onclick = () => {
                        // Toggle selection: add/remove from selectedRunes
                        const index = selectedRunes.indexOf(rune);
                        if (index === -1) {
                            selectedRunes.push(rune);
                            runeButton.classList.add('selected'); // Visual feedback
                        } else {
                            selectedRunes.splice(index, 1);
                            runeButton.classList.remove('selected');
                        }
                    };

                    runeContainer.appendChild(runeButton);
                });

                detailsElement.appendChild(runeContainer);
            }
        }

        // --- Handle Non-Rune Choices (e.g., aspects, golem models) ---
        if (item.choice) {
            const choiceContainer = document.createElement("div");
            choiceContainer.className = "choiceContainer";

            const choiceLabel = document.createElement("p");
            const choiceType = item.choice.split(" - ")[0].toLowerCase();
            choiceLabel.textContent = `Choose a ${choiceType}:`;
            choiceContainer.appendChild(choiceLabel);

            let choicesArray = [];
            const choiceTypeKey = choiceType.replace(" ", "_").toUpperCase();

            //console.log("choiceTypeKey", choiceTypeKey)
            if (CHOICE_TYPES[choiceTypeKey]) {
                choicesArray = globalData[CHOICE_TYPES[choiceTypeKey]] || [];
            } else {
                console.log(choiceTypeKey)
                console.log(globalData)
                console.error(`Unknown choice type: ${choiceType}`);
                return;
            }

            choicesArray = choicesArray.filter(element => !EXCLUDED_CHOICES.has(element.name));

            for (const element of choicesArray) {
                const choiceButton = document.createElement("button");
                choiceButton.className = "inItemChoiceButton";
                choiceButton.dataset.choice = element.name ?? element;
                choiceButton.textContent = element.name ?? element;

                choiceButton.addEventListener("click", () => {
                    selectedChoice = element;
                    const selectBtn = document.querySelector(`.${selectButtonClass}`);
                    if (selectBtn) selectBtn.disabled = false;

                    document.querySelectorAll(".inItemChoiceButton").forEach(button => {
                        button.classList.remove("selected");
                    });
                    choiceButton.classList.add("selected");

                    const displayValue = itemToJsonValue[item.name];
                    if (displayValue && Object.hasOwn(element, displayValue)) {
                        choiceDescription.textContent = element[displayValue];
                    }
                });

                choiceContainer.appendChild(choiceButton);
            }

            detailsElement.appendChild(choiceContainer);
        }

        // --- Select Button Logic ---
        const selectBtn = document.querySelector(`.${selectButtonClass}`);
        if (selectBtn) {
            // Disable only if there's a mandatory choice (non-rune) and nothing is selected
            selectBtn.disabled = (item.choice && !selectedChoice);

            selectBtn.onclick = () => {
                if (item.choice && !selectedChoice) {
                    alert(`Please select a ${item.choice.split(' - ')[0].toLowerCase()} first.`);
                    return;
                }

                // Pass selectedRunes as an array to onChooseItem
                onChooseItem(item, itemType, spellrank, selectedChoice, selectedRunes);

                closeModal();
            };
        }
    }
};

const itemToJsonValue = {
    "Basic Elemental Magic": 'basicMagic',
    "Elemental Aura": 'aura',
    "Aspect Infusion": 'infusion',
    "Elementalization": "elementalization"
};

const CHOICE_TYPES = {
  ASPECTS: "aspects",
  GOLEM_MODEL: "golemModels",
  RUNEGUN_MODEL: "runegunModels",
};
const EXCLUDED_CHOICES = new Set(["Arcane"]);

function createModal({
    title,
    itemType,
    listId,
    detailsId,
}) {
    const modal = document.getElementById("mainModal");
    if (!modal) {
        console.error(`Modal not found "${itemType}"`);
        return;
    }
    // Find all divs inside modal-content to construct the container ID
    const modalContent = modal.querySelector('.modal-content > div');
    if (!modalContent) {
        console.error(`Modal content not found "${itemType}"`);
        return;
    }
    // Always recreate the structure
    modalContent.innerHTML = '';
    
    // Re-create the structure inside
    const titleElem = document.createElement('p');
    titleElem.className = 'portfolio-title';
    const titleUnderline = document.createElement('u');
    titleUnderline.className = 'modal-title';
    titleUnderline.textContent = title;
    titleElem.appendChild(titleUnderline);

    const interactiveList = document.createElement('div');
    interactiveList.className = "interactive-list";

    // Left panel
    const leftPanel = document.createElement('div');
    leftPanel.className = 'left-panel';
    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    tabs.id = "tabsContainer"
    const tabButton = document.createElement('button');
    tabButton.className = 'tab-button active';
    tabButton.setAttribute('data-tab', 'All');
    tabButton.textContent = 'All';
    tabs.appendChild(tabButton);
    leftPanel.appendChild(tabs);
    const listContainer = document.createElement('div');
    listContainer.className = 'list-container';
    const listElem = document.createElement('ul');
    listElem.className = 'item-list';
    listElem.id = listId;
    listContainer.appendChild(listElem);
    leftPanel.appendChild(listContainer);

    // Right panel
    const rightPanel = document.createElement('div');
    rightPanel.className = 'right-panel';
    const detailsElem = document.createElement('div');
    detailsElem.className = "item-details";
    detailsElem.id = detailsId;
    rightPanel.appendChild(detailsElem);
    const inItemChoice = document.createElement('div');
    inItemChoice.className = "inItemChoicePanel";
    inItemChoice.id = 'inItemChoice';
    detailsElem.appendChild(inItemChoice);

    // Assemble
    interactiveList.appendChild(leftPanel);
    interactiveList.appendChild(rightPanel);

    // Append to container
    modalContent.appendChild(titleElem);
    modalContent.appendChild(interactiveList);
    return modalContent;
}