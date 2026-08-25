/* -- SQLite 
DROP TABLE arcaneFeats;
CREATE TABLE arcaneFeats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    prerequisites TEXT,
    level INTEGER,
    repeatable INTEGER DEFAULT 0, -- 0 for no, 1 for yes
    unlockedFeats TEXT,
    spellsLearned TEXT,
    metamagicsLearned TEXT,
    choice TEXT,
    gadgets TEXT
); */

/*  DROP TABLE ancestryFeats;
 CREATE TABLE ancestryFeats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT,
    prerequisites TEXT,
    level INTEGER,
    unlockedFeats TEXT,
    speeds TEXT,
    resistances TEXT
);   */
/* DROP TABLE advantages;
CREATE TABLE advantages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    level INTEGER,
    unlockedFeats TEXT,
    speeds TEXT,
    resistances TEXT,
    choice TEXT,
    health TEXT,
    mana TEXT
);    */

/* CREATE TABLE golemUpgrades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    prerequisites TEXT,
    level INTEGER
);  */
/* CREATE TABLE runegunUpgrades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    prerequisites TEXT,
    level INTEGER
);  */
/* DROP TABLE spells;
CREATE TABLE spells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    actions TEXT,
    aspects TEXT,
    traits TEXT,
    range TEXT,
    target TEXT,
    duration TEXT,
    effect TEXT,
    upcast TEXT,
    rank TEXT
);  */

/* DROP TABLE combatManeuvers;
CREATE TABLE combatManeuvers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    actions TEXT,
    traits TEXT,
    description TEXT,
    prerequisites TEXT,
    type TEXT,
    level INTEGER
);  */

/* CREATE TABLE metamagic (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    spellType TEXT,
    effect TEXT,
    dc INTEGER,
    level INTEGER
); */

/* CREATE TABLE actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    actions TEXT,
    trigger TEXT,
    effect TEXT,
    traits TEXT
); */
/* DROP TABLE armors;
CREATE TABLE armors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    resistances TEXT,
    weakPointDiff INTEGER,
    penalties INTEGER,
    manaRecovery INTEGER,
    traits TEXT,
    description TEXT,
    price TEXT,
    type TEXT,
    phy INTEGER
);  */
/* CREATE TABLE weapons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    damage TEXT,
    hands INTEGER,
    range INTEGER,
    traits TEXT,
    description TEXT,
    price TEXT,
    type TEXT,
    weaponGroup TEXT
);   */
/* CREATE TABLE potions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    effect TEXT,
    duration TEXT,
    price TEXT,
    level INTEGER
);  
*/
/* CREATE TABLE gadgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    effect TEXT,
    level INTEGER,
    requirement TEXT
);   */
/* DROP TABLE species;   

CREATE TABLE species (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    size TEXT,
    health INTEGER,
    mana INTEGER,
    traitOne TEXT,
    traitOneDescription TEXT,
    traitTwo TEXT,
    traitTwoDescription TEXT,
    traitThree TEXT,
    traitThreeDescription TEXT,
    traitFour TEXT,
    traitFourDescription TEXT,
    unlockedFeats TEXT,
    spellsLearned TEXT,
    speeds TEXT,
    resistances TEXT, 
    gadgets TEXT
);   */
--DROP Table runes;
/* CREATE TABLE runes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    effect TEXT,
    item TEXT,
    price INTEGER,
    level INTEGER,
    requirement TEXT,
    striking INTEGER,
    auraCleaving INTEGER,
    elementalWard INTEGER,
    hardening INTEGER
);  */ 

/* CREATE TABLE conditions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    effect TEXT,
    type TEXT,
    disappears TEXT,
    neutrality TEXT
);
*/
/* DROP TABLE weaponTraits;
CREATE TABLE weaponTraits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    effect TEXT,
    specialAction TEXT,
    type TEXT
);  */

/*  DROP TABLE conditions; */

/* CREATE TABLE damageTypes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    damageGroup TEXT,
    resistance TEXT,
    rarity TEXT
); */

/* CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    stat TEXT,
    armorPenalties TEXT
);  */

--DROP TABLE backgrounds;
/* CREATE TABLE backgrounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    unlockedFeats TEXT
);  */

/* DROP TABLE generalFeats;
CREATE TABLE generalFeats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    prerequisites TEXT,
    level INTEGER,
    repeatable INTEGER DEFAULT 0, -- 0 for no, 1 for yes
    unlockedFeats TEXT,
    speeds TEXT,
    resistances TEXT,
    combatManeuversLearned TEXT,
    health TEXT,
    choice TEXT
);  */

/* DROP TABLE golemModel;
CREATE TABLE golemModels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    phy INTEGER,
    dex INTEGER,
    int INTEGER, 
    wil INTEGER,
    resistances INTEGER,
    speeds TEXT,
    featureOne TEXT,
    featureOneDescription TEXT,
    featureTwo TEXT,
    featureTwoDescription TEXT,
    skills TEXT,
    saves TEXT,
    weapons TEXT,
    naturalWeapon TEXT,
    naturalWeaponDescription TEXT
);  */
/* DROP TABLE aspects;
CREATE TABLE aspects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    opposite TEXT,
    basicMagic TEXT,
    aura TEXT,
    infusion TEXT
);   */
