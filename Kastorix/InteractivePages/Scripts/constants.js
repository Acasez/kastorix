"use strict";

const golemModels = ['Brawler', 'Soldier', 'Quadruped', 'Scout'];
const runegunModels = ['Pistol', 'Rifle', 'Cannon', 'Sharpshot'];
const weaponRunes = ['Striking', 'Greater Striking', 'Major Striking', 'Aura Cleaving', 'Greater Aura Cleaving', 'Major Aura Cleaving'];

const TYPE_TO_ARRAY = {
    species: null,
    background: 'backgrounds',
    advantage: 'advantages',
    arcaneFeat: 'arcaneFeats',
    generalFeat: 'generalFeats',
    ancestryFeat: 'ancestryFeats',
    spell: 'spells',
    metamagic: 'metamagics',
    weapon: 'weapons',
    combatManeuvers: 'combatManeuvers',
    gadgets: 'gadgets',
    armor: null,
    golemUpgrades: 'golemUpgrades',
    runegunUpgrades: 'runegunUpgrades',
    armorUpgrades: 'armorUpgrades',
};
