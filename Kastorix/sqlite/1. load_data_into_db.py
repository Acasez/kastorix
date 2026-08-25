import sqlite3
import subprocess
from google.oauth2 import service_account
from googleapiclient.discovery import build

# --- Google Sheets Integration ---
def get_sheet_data(spreadsheet_id, sheet_name, credentials_file):
    creds = service_account.Credentials.from_service_account_file(
        credentials_file,
        scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
    )
    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()
    result = sheet.values().get(
        spreadsheetId=spreadsheet_id,
        range=sheet_name
    ).execute()
    return result.get('values', [])

def table_exists(cursor, table_name):
    cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'")
    return cursor.fetchone() is not None

def import_sheet_to_table(spreadsheet_id, sheet_name, table_name, conn, credentials_file):
    cursor = conn.cursor()

    # Clear the table if it exists
    if table_exists(cursor, table_name):
        cursor.execute(f"DELETE FROM {table_name}")
        cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table_name}'")
        print(f"Cleared table: {table_name}")
    else:
        print(f"Table {table_name} does not exist, skipping clear.")

    # Fetch data from Google Sheets
    data = get_sheet_data(spreadsheet_id, sheet_name, credentials_file)
    if not data:
        print(f"No data found for sheet: {sheet_name}")
        return

    # Extract headers (first row) as column names
    columns = data[0]
    rows = data[1:]

    # Pad rows with empty strings if they have fewer columns than headers
    batch_data = []
    for row in rows:
        while len(row) < len(columns):
            row.append('')
        batch_data.append(row)

    # Dynamically build the INSERT statement
    placeholders = ', '.join(['?'] * len(columns))
    columns_str = ', '.join(columns)

    # Perform batch insert
    cursor.executemany(
        f"INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders})",
        batch_data
    )
    conn.commit()
    print(f"Inserted {len(batch_data)} rows into {table_name}")

# --- Main Script ---
if __name__ == "__main__":
    spreadsheet_id = "1rj8eEdbHBlXsfaX9SepSxknKQ26-ZqLBvH_bKkpsvaI"
    credentials_file = "C:/Users/Edvin/Documents/GoogleAPI/GoogleAPI.json"

    # Connect to the database
    conn = sqlite3.connect('KastorixData.db')
    cursor = conn.cursor()

    # List of sheets and their corresponding table names
    sheets_to_tables = [
        ("General Feats", "generalFeats"),
        ("Arcane Feats", "arcaneFeats"),
        ("Advantages", "advantages"),
        ("Ancestry Feats", "ancestryFeats"),
        ("Backgrounds", "backgrounds"),
        ("Species", "species"),
        ("Spells", "spells"),
        ("Metamagic", "metamagic"),
        ("Weapons", "weapons"),
        ("Weapon Traits", "weaponTraits"),
        ("Combat Maneuvers", "combatManeuvers"),
        ("Actions", "actions"),
        ("Armors", "armors"),
        ("Golem Models", "golemModels"),
        ("Runegun Upgrades", "runegunUpgrades"),
        ("Golem Upgrades", "golemUpgrades"),
        ("Potions", "potions"),
        ("Gadgets", "gadgets"),
        ("Runes", "runes"),
        ("Skills", "skills"),
        ("Conditions", "conditions"),
        ("Damage Types", "damageTypes"),
        ("Aspects", "aspects"),
    ]

    # Import all sheets
    for sheet_name, table_name in sheets_to_tables:
        import_sheet_to_table(spreadsheet_id, sheet_name, table_name, conn, credentials_file)

    # Close the connection
    conn.close()

    # Run the HTML generation script
    subprocess.run(["python", "2. generate_html_from_db.py"], check=True)