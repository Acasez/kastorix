import json
from jinja2 import Environment, FileSystemLoader

# Define the function to replace action numbers with icons
def replace_action_numbers(text):
    """Replace action numbers with action icons."""
    action_mapping = {
        "1": '<img class="action-icon" src="/images/Kastorix/Icons/OneAction.png" alt="1 Action"/>',
        "2": '<img class="action-icon" src="/images/Kastorix/Icons/TwoActions.png" alt="2 Actions"/>',
        "3": '<img class="action-icon" src="/images/Kastorix/Icons/ThreeActions.png" alt="3 Actions"/>',
        "Reaction": '<img class="action-icon" src="/images/Kastorix/Icons/Reaction.png" alt="Reaction Symbol"/>',
        "0": '<img class="action-icon" src="/images/Kastorix/Icons/FreeAction.png" alt="Free Action"/>',
    }
    for number, icon_html in action_mapping.items():
        text = text.replace(number, icon_html)
    return text

def has_spells(spells_by_rank):
    """Check if any rank has spells."""
    return any(len(spells) > 0 for spells in spells_by_rank.values())

# List of creature names
creatures = {'Aeonfonar', 'Frost Wyvern', 'Wyvern Rider', 'Ancient Storm Wyrm', 'Aqautic Hydra', 'Gargoyle', 'Void Colossi', 'Coatl', 'Draconic Legionary', 'Ralph'}

# Set up Jinja2 environment
env = Environment(loader=FileSystemLoader("."))
env.filters['replace_action_numbers'] = replace_action_numbers  # Add the function as a filter
env.filters['has_spells'] = has_spells  # Add the custom filter
template = env.get_template("StatblockTemplate.html")

# Loop through each creature
for creature_name in creatures:
    json_filename = f"{creature_name}.json"
    try:
        with open(json_filename, "r") as f:
            creature_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: File '{json_filename}' not found. Skipping...")
        continue

    # Render the template
    statblock_html = template.render(**creature_data)

    # Save the output to a file
    output_filename = f"{creature_name} Statblock.html"
    with open(output_filename, "w") as f:
        f.write(statblock_html)
    print(f"Statblock for '{creature_name}' saved to '{output_filename}'.")