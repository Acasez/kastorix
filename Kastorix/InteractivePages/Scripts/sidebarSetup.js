
const SIDEBAR_CONFIG = {
    // Basic info (name, species)
    basicInfo: [
        {
            type: "input",
            id: "charName",
            placeholder: "Character Name",
            label: "Name"
        },
        {
            type: "button",
            id: "SelectedSpecies",
            className: "chooseSpeciesModal",
            modalId: "speciesModal",
            label: "Select Species",
            level: "levelZero",
            itemType: "species"
        },
        {
            type: "info",
            id: "baseStats",
            placeholder: "stats",
            label: "Set Base Stats"
        },
        {
            type: "input",
            id: "level",
            placeholder: "1",
            label: "Level",
            inputType: "number",
            oninput: "updateOnStatIncrease()",
            default: "1"
        }
    ]
};

function generateBasicInfo(container) {
    const levelZeroDiv = document.createElement("div");
    levelZeroDiv.className = "levelSelection";
    levelZeroDiv.id = "levelZero";

    SIDEBAR_CONFIG.basicInfo.forEach(item => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "sidebar-group";

        if (item.type === "input") {
            const label = document.createElement("p");
            label.textContent = item.label;
            const input = document.createElement("input");
            input.type = item.inputType || 'text';
            if (item.className) input.className = item.className;
            input.placeholder = item.placeholder;
            input.id = item.id;
            if (item.default !== undefined) input.value = item.default;
            if (item.oninput) input.setAttribute('oninput', item.oninput);

            // Special layout for the Level input: use stat style (label + compact input inline)
            if (item.id === 'level') {
                const inputWrapper = document.createElement('div');
                inputWrapper.className = 'stat-input-container';
                const statLabel = document.createElement('div');
                statLabel.className = 'stat-label';
                statLabel.textContent = item.label;
                input.className = (input.className ? input.className + ' ' : '') + 'stat-input small-box';
                inputWrapper.appendChild(statLabel);
                inputWrapper.appendChild(input);
                groupDiv.appendChild(inputWrapper);
            } else {
                groupDiv.appendChild(label);
                groupDiv.appendChild(input);
            }
        } else if (item.type === "button") {
            const button = document.createElement("button");
            button.className = item.className;
            button.classList.add("modalButton");
            button.setAttribute("onclick", "openModal(this, '" + item.itemType + "', " + null + ", " + 0 + ")");
            //console.log("Creating button " + item + " id " + item.id + " itemType " + item.itemType);
            button.textContent = item.label;
            button.setAttribute("id", item.id);
            button.setAttribute("level", item.level);

            // Create tooltip div
            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            button.appendChild(tooltip);

            groupDiv.appendChild(button);
        }
        else if (item.type === "info") {
            const border = document.createElement("button");
            border.className = "sideBarInfoBorder";
            border.textContent = item.label;
            border.setAttribute("onclick", "openStatsModal(this)");
            groupDiv.appendChild(border);
        }

        levelZeroDiv.appendChild(groupDiv);
    });

    container.appendChild(levelZeroDiv);
}

function generateLevelFeats(container) {
    const levels = {};
    const levelNames = [
        "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
        "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
        "Fifteen", "Sixteen"
    ];

    // Generate feats for each level from 0 to 16
    for (let level = 0; level <= 16; level++) {
        const levelKey = `level${level}`;
        levels[levelKey] = [];

        // Add Background and Feat from Background only for level 0
        if (level === 0) {
            levels[levelKey].push(
                {
                    id: "SelectedBackground",
                    className: "chooseBackgroundsModal",
                    modalId: "backgroundsModal",
                    featType: "background",
                    label: "Select Background",
                    level: levelKey
                }
            );
        }

        // Add Advantage for every 4th level (0, 4, 8, 12, 16)
        if (level % 4 === 0) {
            levels[levelKey].push({
                id: `Level${level}Advantage`,
                className: "chooseAdvantagesModal",
                modalId: "advantagesModal",
                featType: "advantage",
                label: "Select Advantage",
                level: levelKey
            });
        }

        // Add Ancestry Feat for every 5th level (0, 5, 10, 15)
        if (level % 5 === 0) {
            levels[levelKey].push({
                id: `Level${level}AncestryFeat`,
                className: "chooseAncestryFeatsModal",
                modalId: "ancestryFeatsModal",
                featType: "ancestryFeat",
                label: "Select Ancestry Feat",
                level: levelKey
            });
        }

        // Add Stat Increase for every 3rd level (0, 3, 6, 9, 12, 15, 18)
        if (level != 0 && level % 3 === 0) {
            levels[levelKey].push({
                id: `Level${level}Stat Increase`,
                className: "increaseStat",
                label: "Increase One Stat",
                level: levelKey
            });
        }

        // Add Arcane Feat for every level
        levels[levelKey].push({
            id: `Level${level}ArcaneFeat`,
            className: "chooseArcaneFeatsModal",
            modalId: "arcaneFeatsModal",
            featType: "arcaneFeat",
            label: "Select Arcane Feat",
            level: levelKey
        });

        // Add General Feat for every level except 0
        if (level !== 0) {
            levels[levelKey].push({
                id: `Level${level}GeneralFeat`,
                className: "chooseGeneralFeatsModal",
                modalId: "generalFeatsModal",
                featType: "generalFeat",
                label: "Select General Feat",
                level: levelKey
            });
        }
    }

    // Render the feats
    Object.entries(levels).forEach(([level, feats]) => {
        const levelDiv = document.createElement("div");
        levelDiv.className = "levelSelection";
        levelDiv.id = level;

        const levelHeader = document.createElement("p");
        const levelUnderline = document.createElement("u");

        // Use the levelNames array to display the level name in words
        const levelNumber = parseInt(level.replace("level", ""));
        levelUnderline.textContent = `Level ${levelNames[levelNumber]}`;

        levelHeader.appendChild(levelUnderline);
        levelDiv.appendChild(levelHeader);

        feats.forEach(feat => {
            const groupDiv = document.createElement("div");
            groupDiv.className = "sidebar-group";

            const button = document.createElement("button");
            button.className = feat.className;
            button.classList.add("modalButton");
            if (feat.modalId) {
                button.setAttribute("onclick", `openModal(this, '${feat.featType}', null, '${levelNumber}')`);
                button.setAttribute("oncontextmenu", `clearFeat(this, '${feat.featType}'); return false;`);
                button.setAttribute("data-original-text", feat.label);
            }
            else {
                button.className = 'sideBarInfoBorder';
                button.setAttribute("onclick", "openStatIncreaseModal(this)");
            }
            button.setAttribute("id", feat.id);
            button.setAttribute("level", level);
            button.textContent = feat.label;

            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            button.appendChild(tooltip);

            groupDiv.appendChild(button);
            levelDiv.appendChild(groupDiv);
        });

        container.appendChild(levelDiv);
    });
}