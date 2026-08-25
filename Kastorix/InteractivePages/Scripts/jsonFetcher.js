// Global object to store all fetched data
let globalData = {};

// Object mapping keys to JSON file paths
const jsonPathNames = {
    species: 'sqlite/build/species.json',
    background: 'sqlite/build/backgrounds.json',
    advantage: 'sqlite/build/advantages.json',
    arcaneFeat: 'sqlite/build/arcaneFeats.json',
    generalFeat: 'sqlite/build/generalFeats.json',
    ancestryFeat: 'sqlite/build/ancestryFeats.json',
    spell: 'sqlite/build/spells.json',
    metamagic: 'sqlite/build/metamagics.json',
    weapon: 'sqlite/build/weapons.json',
    combatManeuvers: 'sqlite/build/combatManeuvers.json',
    armor: 'sqlite/build/armors.json',
    golemUpgrade: 'sqlite/build/golemUpgrades.json',
    runegunUpgrade: 'sqlite/build/runegunUpgrades.json',
    //armorUpgrade: 'sqlite/build/armorUpgrades.json',
    skills: 'sqlite/build/skills.json',
    golemModels: 'sqlite/build/golemModels.json',
    runes: 'sqlite/build/runes.json',
    aspects: 'sqlite/build/aspects.json',
    gadgets: 'sqlite/build/gadgets.json',
};

// Fetch all JSON files and store their data in skillsData
async function fetchAllData() {
    const fetchPromises = Object.entries(jsonPathNames).map(async ([key, path]) => {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load ${key}: ${response.statusText}`);
            }
            const data = await response.json();
            globalData[key] = data.All || data; // Store data under the same key
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            globalData[key] = null; // Mark as failed
        }
    });

    await Promise.all(fetchPromises); // Wait for all fetches to complete
    createRunegunModels();
    //console.log('All data fetched and stored in globalData:', globalData);
    afterLoadedJSON();
}

function createRunegunModels() {
    // Flatten all weapon categories into a single array
    const allWeapons = Object.values(globalData.weapon || {}).flat();
    // Filter for Runegun weapons
    globalData.runegunModels = allWeapons.filter(
        weapon => weapon.weaponGroup === "Runegun"
    );
    //console.log("Runegun models:", globalData.runegunModels);
}

// Call this function once at startup
fetchAllData();