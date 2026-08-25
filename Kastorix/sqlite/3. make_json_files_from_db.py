import sqlite3
import json
import os

# --- Helper Functions ---
def replace_action_numbers(text):
    """Replace action numbers with action icons."""
    action_mapping = {
        "1": '<img class="action-icon-modalList" src="/images/Kastorix/Icons/OneAction.png" alt="1 Action"/>',
        "2": '<img class="action-icon-modalList" src="/images/Kastorix/Icons/TwoActions.png" alt="2 Actions"/>',
        "3": '<img class="action-icon-modalList" src="/images/Kastorix/Icons/ThreeActions.png" alt="3 Actions"/>',
        "Reaction": '<img class="action-icon-modalList" src="/images/Kastorix/Icons/Reaction.png" alt="Reaction Symbol"/>',
        "0": '<img class="action-icon-modalList" src="/images/Kastorix/Icons/FreeAction.png" alt="Free Action"/>',
    }
    for number, icon_html in action_mapping.items():
        text = text.replace(number, icon_html)
    return text

def fetch_items_from_db(db_path, table_name, category_column_index, categories, item_mapping):
    """Fetch items from the database and group them by category."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    items = cursor.fetchall()

    # Group items by category
    items_by_category = {category: [] for category in categories}

    for item in items:
        item_data = {}
        for key, index in item_mapping.items():
            if key == "actions":
                item_data[key] = replace_action_numbers(item[index])
            else:
                item_data[key] = item[index]

        # Determine the category
        category = item[category_column_index]
        if category in items_by_category:
            items_by_category[category].append(item_data)
        else:
            items_by_category[categories[0]].append(item_data)  # Default to the first category if not found

    conn.close()
    return items_by_category

# --- Configurations ---
# Define all tables, their mappings, and categories
TABLE_CONFIGS = [
    {
        "table_name": "spells",
        "output_file": "build/spells.json",
        "category_column_index": 10,  # Index of the "rank" column
        "categories": ["(1) Apprentice", "(2) Adept", "(3) Magus", "(4) Grand Magus", "(5) Archmage"],
        "mapping": {
            "name": 1,
            "actions": 2,
            "aspects": 3,
            "traits": 4,
            "range": 5,
            "target": 6,
            "duration": 7,
            "effect": 8,
            "upcast": 9,
            "rank": 10,
        },
    },
    {
        "table_name": "weapons",
        "output_file": "build/weapons.json",
        "category_column_index": 8,  # Index of the "weaponGroup" column
        "categories": ["Simple", "Martial", "Advanced", "Unarmed", "Artificers", "Custom", "Special"],
        "mapping": {
            "name": 1,
            "damage": 2,
            "hands": 3,
            "range": 4,
            "traits": 5,
            "description": 6,
            "price": 7,
            "type": 8,
            "weaponGroup": 9,
        },
    },
    {
        "table_name": "species",
        "output_file": "build/species.json",
        "category_column_index": 17,  # Index of the "gadgets" column (default to "All")
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "size": 2,
            "health": 3,
            "mana": 4,
            "traitOne": 5,
            "traitOneDescription": 6,
            "traitTwo": 7,
            "traitTwoDescription": 8,
            "traitThree": 9,
            "traitThreeDescription": 10,
            "traitFour": 11,
            "traitFourDescription": 12,
            "unlockedFeats": 13,
            "spellsLearned": 14,
            "speeds": 15,
            "resistances": 16,
            "gadgets": 17,
        },
    },
    {
        "table_name": "backgrounds",
        "output_file": "build/backgrounds.json",
        "category_column_index": 3,  # Index of the "unlockedFeats" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "description": 2,
            "unlockedFeats": 3,
        },
    },
    {
        "table_name": "arcaneFeats",
        "output_file": "build/arcaneFeats.json",
        "category_column_index": 10,  # Index of the "gadgets" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "description": 2,
            "prerequisites": 3,
            "level": 4,
            "repeatable": 5,
            "unlockedFeats": 6,
            "spellsLearned": 7,
            "metamagicsLearned": 8,
            "choice": 9,
            "gadgets": 10,
            "unlockedAction": 11,
        },
    },
    {
        "table_name": "generalFeats",
        "output_file": "build/generalFeats.json",
        "category_column_index": 11,  # Index of the "choice" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "description": 2,
            "prerequisites": 3,
            "level": 4,
            "repeatable": 5,
            "unlockedFeats": 6,
            "speeds": 7,
            "resistances": 8,
            "combatManeuversLearned": 9,
            "health": 10,
            "choice": 11,
            "unlockedAction": 12,
        },
    },
    {
        "table_name": "ancestryFeats",
        "output_file": "build/ancestryFeats.json",
        "category_column_index": 6,  # Index of the "unlockedFeats" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "description": 2,
            "type": 3,
            "prerequisites": 4,
            "level": 5,
            "unlockedFeats": 6,
            "speeds": 7,
            "resistances": 8,
            "unlockedAction": 9,
        },
    },
    {
        "table_name": "advantages",
        "output_file": "build/advantages.json",
        "category_column_index": 7,  # Index of the "choice" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "description": 2,
            "level": 3,
            "unlockedFeats": 4,
            "speeds": 5,
            "resistances": 6,
            "choice": 7,
            "health": 8,
            "mana": 9,
            "unlockedAction": 10,
        },
    },
    {
        "table_name": "combatManeuvers",
        "output_file": "build/combatManeuvers.json",
        "category_column_index": 6,  # Index of the "type" column
        "categories": ["Basic", "Simple", "Advanced", "Complex", "Masterwork"],
        "mapping": {
            "name": 1,
            "actions": 2,
            "traits": 3,
            "description": 4,
            "prerequisites": 5,
            "type": 6,
        },
    },
    {
        "table_name": "metamagic",
        "output_file": "build/metamagics.json",
        "category_column_index": 3,  # Index of the "effect" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "spelltype": 2,
            "effect": 3,
            "DC": 4,
            "level": 5,
        },
    },
    {
        "table_name": "gadgets",
        "output_file": "build/gadgets.json",
        "category_column_index": 5,  # Index of the "requirement" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "type": 2,
            "effect": 3,
            "level": 4,
            "requirement": 5,
        },
    },
    {
        "table_name": "armors",
        "output_file": "build/armors.json",
        "category_column_index": 10,  # Index of the "phy" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "resistances": 2,
            "weakPointDiff": 3,
            "penalties": 4,
            "manaRecovery": 5,
            "traits": 6,
            "description": 7,
            "price": 8,
            "type": 9,
            "phy": 10,
        },
    },
    {
        "table_name": "golemUpgrades",
        "output_file": "build/golemUpgrades.json",
        "category_column_index": 4,  # Index of the "level" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "description": 2,
            "prerequisites": 3,
            "level": 4,
        },
    },
    {
        "table_name": "runegunUpgrades",
        "output_file": "build/runegunUpgrades.json",
        "category_column_index": 4,  # Index of the "level" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "description": 2,
            "prerequisites": 3,
            "level": 4,
        },
    },
    {
        "table_name": "weaponTraits",
        "output_file": "build/weaponTraits.json",
        "category_column_index": 4,  # Index of the "type" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "effect": 2,
            "specialAction": 3,
            "type": 4,
            "modifiable": 5
        },
    },
    {
        "table_name": "damageTypes",
        "output_file": "build/damageTypes.json",
        "category_column_index": 3,  # Index of the "rarity" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "group": 2,
            "resistance": 3,
            "rarity": 4,
        },
    },
    {
        "table_name": "skills",
        "output_file": "build/skills.json",
        "category_column_index": 3,  # Index of the "armorPenalties" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "stat": 2,
            "armorPenalties": 3,
        },
    },
    {
        "table_name": "golemModels",
        "output_file": "build/golemModels.json",
        "category_column_index": 17,  # Index of the "naturalWeaponDescription" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "description": 2,
            "phy": 3,
            "dex": 4,
            "int": 5,
            "wil": 6,
            "resistances": 7,
            "speeds": 8,
            "featureOne": 9,
            "featureOneDescription": 10,
            "featureTwo": 11,
            "featureTwoDescription": 12,
            "skills": 13,
            "saves": 14,
            "weapons": 15,
            "naturalWeapon": 16,
            "naturalWeaponDescription": 17,
        },
    },
    {
        "table_name": "runes",
        "output_file": "build/runes.json",
        "category_column_index": 10,  # Index of the "hardening" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "effect": 2,
            "item": 3,
            "price": 4,
            "level": 5,
            "requirement": 6,
            "striking": 7,
            "auraCleaving": 8,
            "elementalWard": 9,
            "hardening": 10,
        },
    },
    {
        "table_name": "aspects",
        "output_file": "build/aspects.json",
        "category_column_index": 7,  # Index of the "infusion" column
        "categories": ["All"],
        "mapping": {
            "name": 1,
            "type": 2,
            "opposite": 3,
            "basicMagic": 4,
            "aura": 5,
            "infusion": 6,
            "elementalization": 7,
        },
    },
]

# --- Main Script ---
if __name__ == "__main__":
    # Create build directory if it doesn't exist
    os.makedirs("build", exist_ok=True)

    # Loop through all table configurations
    for config in TABLE_CONFIGS:
        try:
            # Fetch items from the database
            items_by_category = fetch_items_from_db(
                "KastorixData.db",
                config["table_name"],
                config["category_column_index"],
                config["categories"],
                config["mapping"],
            )

            # Save to JSON file
            with open(config["output_file"], "w", encoding="utf-8") as f:
                json.dump(items_by_category, f, ensure_ascii=False, indent=4)

            print(f"Successfully saved {config['table_name']} to {config['output_file']}")
        except Exception as e:
            print(f"Error processing {config['table_name']}: {e}")