"use strict";

let currentTargetButton = null;
let currentSlotIndex = null;
let currentModalLevel = null;

function afterLoadedJSON() {
    addBasicCombatManuevers();
    generateSkillsTable();
}