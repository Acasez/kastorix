// globals.d.ts
interface SpellRank {
    Apprentice: any[];
    Adept: any[];
    Magus: any[];
    GrandMagus: any[];
    Archmage: any[];
    [key: string]: any; // Add this line to allow dynamic property access
}

interface SpellsLearnableByRank {
    Apprentice: number;
    Adept: number;
    Magus: number;
    GrandMagus: number;
    Archmage: number;
    [key: string]: any; // Add this line to allow dynamic property access
}

interface Resistances {
    physical: number;
    slashing: number;
    piercing: number;
    bludgeoning: number;
    elemental: number;
    fire: number;
    cold: number;
    lightning: number;
    acid: number;
    thunder: number;
    poison: number;
    force: number;
    [key: string]: any; // Add this line to allow dynamic property access
}

interface Speeds {
    land: number;
    swim: number;
    climb: number;
    glide: number;
    fly: number;
    burrow: number;
    [key: string]: any; // Add this line to allow dynamic property access
}

interface Senses {
    perception: number;
    manasense: number;
    preciseSenses: string;
    impreciseSenses: string;
    vagueSenses: string;
    [key: string]: any; // Add this line to allow dynamic property access
}

interface Inventory {
    gold: number;
    silver: number;
    heldItems: string;
    quickAccessItems: string;
    equipment: string;
    notes: string;
    [key: string]: any; // Add this line to allow dynamic property access
}

interface Window {
    clearLists: () => void;
    characterLevel: number;
    phy: number;
    dex: number;
    int: number;
    wil: number;
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    aura: number;
    maxAura: number;
    initiative: number;
    spellsByRank: SpellRank;
    spellsLearnableByRank: SpellsLearnableByRank;
    metamagicsUnlocked: number;
    metamagics: any[];
    combatManeuversUnlocked: number;
    combatManeuvers: any[];
    backgrounds: any[];
    advantages: any[];
    arcaneFeats: any[];
    generalFeats: any[];
    ancestryFeats: any[];
    weapons: any[];
    skillProficiencies: Record<string, any>;
    saves: Record<string, any>;
    statuses: Record<string, any>;
    resistances: Resistances;
    speeds: Speeds;
    senses: Senses;
    inventory: Inventory;
}
