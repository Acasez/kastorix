import re
import sqlite3
import subprocess
import sys
from pathlib import Path

TABLE_CONFIGS = [
    {"table": "generalFeats", "headers": ["Feat Name", "Description", "Prerequisites", "Level", "unlockedAction"], "columns": [1, 2, 3, 4, 12], "output": "build/generalFeats.html", "table_id": "generalFeatsTable"},
    {"table": "arcaneFeats", "headers": ["Feat Name", "Description", "Prerequisites", "Level", "unlockedAction"], "columns": [1, 2, 3, 4, 11], "output": "build/arcaneFeats.html", "table_id": "arcaneFeatsTable"},
    {"table": "ancestryFeats", "headers": ["Feat Name", "Description", "Type", "Prerequisites", "Level", "unlockedAction"], "columns": [1, 2, 3, 4, 5, 9], "output": "build/ancestryFeats.html", "table_id": "ancestryFeatsTable"},
    {"table": "advantages", "headers": ["Feat Name", "Description", "Level", "unlockedAction"], "columns": [1, 2, 3, 10], "output": "build/advantages.html", "table_id": "advantagesTable"},
    {"table": "backgrounds", "headers": ["Feat Name", "Description", "Unlocked Feats"], "columns": [1, 2, 3], "output": "build/backgrounds.html", "table_id": "backgroundsTable"},
    {"table": "spells", "headers": ["Name", "Actions", "Aspects", "Traits", "Range", "Target", "Duration", "Effect", "Upcast", "Rank"], "columns": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "output": "build/spells.html", "table_id": "spellsTable"},
    {"table": "combatManeuvers", "headers": ["Name", "Actions", "Traits", "Description", "Prerequisites", "Type", "Level"], "columns": [1, 2, 3, 4, 5, 6, 7], "output": "build/combatManeuvers.html", "table_id": "combatManeuversTable"},
    {"table": "metamagic", "headers": ["Name", "Spell Type", "Effect", "DC Change", "Level"], "columns": [1, 2, 3, 4, 5], "output": "build/metamagics.html", "table_id": "metamagicsTable"},
    {"table": "actions", "headers": ["Name", "Actions", "Trigger", "Description", "Traits"], "columns": [1, 2, 3, 4, 5], "output": "build/actions.html", "table_id": "actionsTable"},
    {"table": "armors", "headers": ["Name", "Resistances", "Weak Point Difficulty", "Penalties", "Mana Recovery Speed", "Traits", "Description", "Price", "Type", "PHY"], "columns": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "output": "build/armors.html", "table_id": "armorsTable"},
    {"table": "weapons", "headers": ["Name", "Damage", "Hands", "Range", "Traits", "Description", "Price", "Type", "Weapon Group"], "columns": [1, 2, 3, 4, 5, 6, 7, 8, 9], "output": "build/weapons.html", "table_id": "weaponsTable"},
    {"table": "potions", "headers": ["Name", "Effect", "Duration", "Price", "Level"], "columns": [1, 2, 3, 4, 5], "output": "build/potions.html", "table_id": "potionsTable"},
    {"table": "gadgets", "headers": ["Name", "Type", "Effect", "Level", "Requirement"], "columns": [1, 2, 3, 4, 5], "output": "build/gadgets.html", "table_id": "gadgetsTable"},
    {"table": "species", "headers": ["Name", "Size", "Health", "Mana", "Trait One", "Trait One Description", "Trait Two", "Trait Two Description", "Trait Three", "Trait Three Description", "Trait Four", "Trait Four Description"], "columns": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "output": "build/species.html", "table_id": "speciesTable"},
    {"table": "runes", "headers": ["Name", "Effect", "Item", "Price (GP)", "Level", "Requirement"], "columns": [1, 2, 3, 4, 5, 6], "output": "build/runes.html", "table_id": "runesTable"},
    {"table": "conditions", "headers": ["Name", "Effect", "Type", "Disappears", "Neutrality"], "columns": [1, 2, 3, 4, 5], "output": "build/conditions.html", "table_id": "conditionsTable"},
    {"table": "weaponTraits", "headers": ["Name", "Effect", "Special Action", "Type"], "columns": [1, 2, 3, 4], "output": "build/weaponTraits.html", "table_id": "weaponTraitsTable"},
    {"table": "golemUpgrades", "headers": ["Name", "Description", "Prerequisites", "Level"], "columns": [1, 2, 3, 4], "output": "build/golemUpgrades.html", "table_id": "golemUpgradesTable"},
    {"table": "runegunUpgrades", "headers": ["Name", "Description", "Prerequisites", "Level"], "columns": [1, 2, 3, 4], "output": "build/runegunUpgrades.html", "table_id": "runegunUpgradesTable"},
    {"table": "damageTypes", "headers": ["Name", "Group", "Resistance", "Rarity"], "columns": [1, 2, 3, 4], "output": "build/damageTypes.html", "table_id": "damageTypesTable"},
    {"table": "skills", "headers": ["Name", "Stat", "Armor Penalties"], "columns": [1, 2, 3], "output": "build/skills.html", "table_id": "skillsTable"},
    {"table": "aspects", "headers": ["Name", "Type", "Opposite", "Basic Magic", "Elemental Aura", "Infusion", "Elementalization"], "columns": [1, 2, 3, 4, 5, 6, 7], "output": "build/aspects.html", "table_id": "aspectsTable"},
]

ACTION_MAPPING = {
    "1": '<img class="action-icon" src="/images/Kastorix/Icons/OneAction.png" alt="1 Action"/>',
    "2": '<img class="action-icon" src="/images/Kastorix/Icons/TwoActions.png" alt="2 Actions"/>',
    "3": '<img class="action-icon" src="/images/Kastorix/Icons/ThreeActions.png" alt="3 Actions"/>',
    "Reaction": '<img class="action-icon" src="/images/Kastorix/Icons/Reaction.png" alt="Reaction Symbol"/>',
    "0": '<img class="action-icon" src="/images/Kastorix/Icons/FreeAction.png" alt="Free Action"/>',
}

ACTION_MAPPING_IN_TEXT = {
    "1": '<img class="action-icon" src="/images/Kastorix/Icons/OneAction.png" alt="1 Action"/>',
    "2": '<img class="action-icon" src="/images/Kastorix/Icons/TwoActions.png" alt="2 Actions"/>',
    "3": '<img class="action-icon" src="/images/Kastorix/Icons/ThreeActions.png" alt="3 Actions"/>',
    "R": '<img class="action-icon" src="/images/Kastorix/Icons/Reaction.png" alt="Reaction Symbol"/>',
    "0": '<img class="action-icon" src="/images/Kastorix/Icons/FreeAction.png" alt="Free Action"/>',
}
ACTION_PATTERN = re.compile(r"\b(Reaction|0|1|2|3)\b")

ACTION_PATTERN_IN_TEXT = re.compile(r"\b(R|0|1|2|3)\s*Action(s)?\b", re.IGNORECASE)

DATA_COLUMNS = {"Repeatable", "Unlocked Feats", "Spells Learned", "Metamagics Learned", "Failed Cast", "Speeds", "Choice", "ResistancesData", "unlockedAction"}

def build_feat_link_cache(cursor):
    tables = ["generalFeats", "arcaneFeats", "ancestryFeats", "advantages", "backgrounds", "potions"]
    cache = {}
    for table in tables:
        cursor.execute(f"SELECT name FROM {table}")
        page_name = re.sub(r"([a-z])([A-Z])", r"\1 \2", table).title() + ".html"
        for (feat_name,) in cursor.fetchall():
            cache[feat_name.lower()] = f"{page_name}#{feat_name.lower().replace(' ', '-')}"
    return cache

def replace_action_numbers(text):
    return ACTION_PATTERN.sub(lambda m: ACTION_MAPPING[m.group(1)], text)

def replace_action_numbers_in_text(text):
    return ACTION_PATTERN_IN_TEXT.sub(lambda m: ACTION_MAPPING_IN_TEXT[m.group(1)], text)

def replace_newlines(text):
    return text.replace("\n", "<br>")

def create_table_html(feats, headers, columns, table_id, cursor, link_cache):
    wide_columns = {"Effect", "Description", "Special Action"}
    narrow_columns = {"Level"}

    # Check if "unlockedAction" is a column in the headers
    unlocked_action_header_index = None
    if "unlockedAction" in headers:
        unlocked_action_header_index = headers.index("unlockedAction")
        #print(f"unlockedAction in headers")

    # Map the header index to the columns list
    unlocked_action_col_index = None
    if unlocked_action_header_index is not None:
        unlocked_action_col_index = columns[unlocked_action_header_index]
        #print(f"unlockedAction column", unlocked_action_col_index)

    html = f"""
    <style>
        #{table_id} {{
            width: 100%;
            border-collapse: collapse;
        }}
        .wide-column {{
            width: 70%;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }}
        .narrow-column {{
            width: 10%;
        }}
        .flavor-text {{
            font-style: italic;
        }}
        .action-title {{
            font-weight: bold;
        }}
        .action-icon {{
            height: 1em;
            width: 1em;
            vertical-align: middle;
        }}
    </style>
    <table id="{table_id}">
        <thead>
            <tr>
                {"".join(f"<th onclick='sortTable({i})'>{header}</th>" for i, header in enumerate(headers) if header not in DATA_COLUMNS)}
            </tr>
        </thead>
        <tbody>
    """

    type_index = headers.index("Type") if "Type" in headers else None

    for feat in feats:
        if type_index is not None and feat[columns[type_index]] == "Special":
            continue

        row_cells = []
        for col_idx, header in zip(columns, headers):
            if header in DATA_COLUMNS:
                continue

            cell_text = str(feat[col_idx])
            cell_text = replace_newlines(cell_text)

            if header == "Actions":
                cell_text = replace_action_numbers(cell_text)

            # Handle Description: Append unlockedAction if it exists
            if header == "Description" and unlocked_action_col_index is not None:
                unlocked_action = str(feat[unlocked_action_col_index]).strip()
                if unlocked_action:
                    # Replace action numbers with icons
                    unlocked_action = replace_action_numbers_in_text(unlocked_action)

                    # Split the unlocked action into title and rest
                    action_parts = unlocked_action.split(" - ", 1)
                    if len(action_parts) > 1:
                        action_title = action_parts[0]
                        action_rest = action_parts[1]
                        action_rest = replace_newlines(action_rest)
                        # Format the action: bold the title
                        formatted_action = f"<span class='action-title'>{action_title}</span> - {action_rest}"
                    else:
                        formatted_action = f"<span class='action-title'>{unlocked_action}</span>"

                    # Append the formatted action to the description
                    cell_text = f"{cell_text}<br>{formatted_action}"

            # Handle flavor text for the first line of Description
            if header == "Description":
                lines = cell_text.split("<br>")
                if len(lines) > 0:
                    lines[0] = f"<span class='flavor-text'>{lines[0]}</span>"
                    cell_text = "<br>".join(lines)

            def feat_link_replacer(match):
                feat_name = match.group(1)
                link = link_cache.get(feat_name.lower())
                return f'<a href="{link}">{feat_name}</a>' if link else f'<a href="{feat_name}.html">{feat_name}</a>'

            cell_text = re.sub(r"\[([^\]]+)\]", feat_link_replacer, cell_text)

            css_class = "wide-column" if header in wide_columns else "narrow-column" if header in narrow_columns else ""
            row_cells.append(f'<td class="{css_class}">{cell_text}</td>' if css_class else f"<td>{cell_text}</td>")

        feat_name = feat[1].lower().replace(" ", "-")
        html += f"""
            <tr id="{feat_name}">
                {"".join(row_cells)}
            </tr>
        """

    html += """
        </tbody>
    </table>
    """
    return html

def generate_feat_table(feats, headers, columns, table_id, output_file, cursor, link_cache):
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(create_table_html(feats, headers, columns, table_id, cursor, link_cache), encoding="utf-8")

def main():
    db_path = Path(__file__).resolve().parent / "KastorixData.db"
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        link_cache = build_feat_link_cache(cursor)

        for config in TABLE_CONFIGS:
            cursor.execute(f"SELECT * FROM {config['table']}")
            feats = cursor.fetchall()
            generate_feat_table(feats, config["headers"], config["columns"], config["table_id"], config["output"], cursor, link_cache)

    subprocess.run([sys.executable, str(Path(__file__).resolve().parent / "3. make_json_files_from_db.py")], check=True)

if __name__ == "__main__":
    main()