"use strict";

const START_PROF = 2;
window.startProf = START_PROF;

const characterState = {
    characterLevel: 0,
    selectedSpecies: null,

    phy: 0,
    dex: 0,
    int: 0,
    wil: 0,

    health: 0,
    maxHealth: 0,
    mana: 0,
    maxMana: 0,
    aura: 0,
    maxAura: 0,

    initiative: 0,
    spellsByRank: {
        Apprentice: [],
        Adept: [],
        Magus: [],
        GrandMagus: [],
        Archmage: []
    },
    metamagics: [],
    combatManeuvers: [],
    gadgets: [],

    advantages: [],
    arcaneFeats: [],
    backgrounds: [],
    generalFeats: [],
    ancestryFeats: [],
    weapons: [],
    golemUpgrades: [],
    runegunUpgrades: [],
    armorUpgrades: [],

    attunement: null,
    currentArmor: null,

    skillProficiencies: {},
    untrainedImprov: false,

    saves: {},
    statuses: {},
    globalPenalty: 0,

    resistances: {
        physical: 0,
        slashing: 0,
        piercing: 0,
        bludgeoning: 0,

        elemental: 0,
        fire: 0,
        cold: 0,
        lightning: 0,
        acid: 0,
        thunder: 0,

        poison: 0,
        force: 0
    },

    speeds: {
        land: 5,
        swim: 0,
        climb: 0,
        glide: 0,
        fly: 0,
        burrow: 0
    },

    senses: {
        perception: 10,
        manasense: 10,
        preciseSenses: 'Sight',
        impreciseSenses: 'Hearing',
        vagueSenses: 'Smell'
    },

    inventory: {
        gold: 0,
        silver: 0,
        heldItems: '',
        quickAccessItems: '',
        equipment: '',
        notes: '',
        languages: ''
    },

    golem: {
        golemModel: '',
        health: 0,
        currentHealth: 0,
        phy: 0,
        dex: 0,
        int: 0,
        wil: 0,
        strikes: [],
        saves: {},
        skills: {},
        resistances: {
            physical: 0,
            elemental: 0
        }
    }
};

const characterStateAliases = [
    'characterLevel',
    'selectedSpecies',
    'phy',
    'dex',
    'int',
    'wil',
    'health',
    'maxHealth',
    'mana',
    'maxMana',
    'aura',
    'maxAura',
    'initiative',
    'spellsByRank',
    'metamagics',
    'combatManeuvers',
    'gadgets',
    'advantages',
    'arcaneFeats',
    'backgrounds',
    'generalFeats',
    'ancestryFeats',
    'weapons',
    'golemUpgrades',
    'runegunUpgrades',
    'armorUpgrades',
    'attunement',
    'currentArmor',
    'skillProficiencies',
    'untrainedImprov',
    'saves',
    'statuses',
    'globalPenalty',
    'resistances',
    'speeds',
    'senses',
    'inventory',
    'golem'
];

characterStateAliases.forEach((key) => {
    Object.defineProperty(window, key, {
        configurable: true,
        enumerable: true,
        get() {
            return characterState[key];
        },
        set(value) {
            characterState[key] = value;
        }
    });
});

function clearLists() {
    characterState.characterLevel = 0;
    characterState.selectedSpecies = null;

    characterState.phy = 0;
    characterState.dex = 0;
    characterState.int = 0;
    characterState.wil = 0;

    characterState.health = 0;
    characterState.maxHealth = 0;
    characterState.mana = 0;
    characterState.maxMana = 0;
    characterState.aura = 0;
    characterState.maxAura = 0;

    characterState.initiative = 0;

    characterState.spellsByRank = {
        Apprentice: [],
        Adept: [],
        Magus: [],
        GrandMagus: [],
        Archmage: []
    };

    characterState.metamagics = [];
    characterState.combatManeuvers = [];
    characterState.gadgets = [];

    characterState.backgrounds = [];
    characterState.advantages = [];
    characterState.arcaneFeats = [];
    characterState.generalFeats = [];
    characterState.ancestryFeats = [];
    characterState.weapons = [];
    characterState.golemUpgrades = [];
    characterState.runegunUpgrades = [];
    characterState.armorUpgrades = [];

    characterState.attunement = null;
    characterState.currentArmor = null;

    characterState.skillProficiencies = {};
    characterState.untrainedImprov = false;
    characterState.saves = {};
    characterState.statuses = {};
    characterState.globalPenalty = 0;

    characterState.resistances = {
        physical: 0,
        slashing: 0,
        piercing: 0,
        bludgeoning: 0,
        elemental: 0,
        fire: 0,
        cold: 0,
        lightning: 0,
        acid: 0,
        thunder: 0,
        poison: 0,
        force: 0
    };

    characterState.speeds = {
        land: 5,
        swim: 0,
        climb: 0,
        glide: 0,
        fly: 0,
        burrow: 0
    };

    characterState.senses = {
        perception: 10,
        manasense: 10,
        preciseSenses: 'Sight',
        impreciseSenses: 'Hearing',
        vagueSenses: 'Smell'
    };

    characterState.inventory = {
        gold: 0,
        silver: 0,
        heldItems: '',
        quickAccessItems: '',
        equipment: '',
        notes: '',
        languages: ''
    };

    characterState.golem = {
        golemModel: '',
        health: 0,
        currentHealth: 0,
        phy: 0,
        dex: 0,
        int: 0,
        wil: 0,
        strikes: [],
        saves: {},
        skills: {},
        resistances: {
            physical: 0,
            elemental: 0
        }
    };
}

window.characterState = characterState;
