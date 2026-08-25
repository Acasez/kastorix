import re
from pathlib import Path

import markdown

wikibox_field_mapping = {
    "Location": "Location",
    "Size": "Size",
    "Population": "Population",
    "Military Strength": "Military Strength",
    "Government": "Government",
    "Species": "Species",
    "Exports": "Exports",
    "Imports": "Imports",
    "Founded": "History",
}

nations_sections = {
    "Overview": "### Overview",
    "Geography": "### Geography",
    "Government": "### Government",
    "History": "### History",
    "Economy": "### Economy",
    "Society and Culture": "### Society and Culture",
    "Military": "### Military",
}
geography_sections = {
    "Overview": "### Overview",
    "Geography": "### Geography",
    "Biodiversity": "### Biodiversity",
    "Settlements": "### Settlements",
}
species_sections = {
    "Overview": "### Overview",
    "Physical": "### Physical Characteristics",
    "Society": "### Society and Culture",
    "Economy": "### Economy and Craftsmanship",
    "Religion": "### Religion and Beliefs",
    "Life": "### Daily Life and Practices",
    "Interaction": "### Interaction with Other Species",
    "Military": "### Military and Defense",
    "Magic": "### Magic",
}
creatures_sections = {
    "Overview": "### Overview",
    "Physical": "### Physical Characteristics",
    "Magic": "### Magic",
    "Habitat": "### Habitat and Behavior",
    "Diet": "### Diet",
    "Interaction": "### Interaction with Other Species",
    "Reproduction": "### Reproduction",
    "Uses": "### Uses of parts",
}

CATEGORIES = [
    {
        "name": "Nations",
        "html_dir": Path("../Worldbuilding/Nations"),
        "wikibox_mapping": wikibox_field_mapping,
        "sections": nations_sections,
        "sources": [
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Nations\Meibor"),
                "articles": [
                    "Aldarna", "Deshir", "Deyton", "Ellios", "Ganderei", "Heksan", "Ishyin Academy",
                    "Jadiar", "Levia", "Narrei", "Renue", "Saursi", "Skyreach", "Straix", "Theze",
                    "Thune", "Vern",
                ],
            },
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Nations\Santsim"),
                "articles": ["El-Shavri", "Glarnast", "Odiana", "Qual", "Quarthax", "Tharn", "Terill"],
            },
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Nations\Avijor"),
                "articles": ["The Draconium"],
            },
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Nations\Maritime"),
                "articles": ["Horizon", "Te-Ohuvi", "The Windsong Conclave"],
            },
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Nations\Caverns Below"),
                "articles": ["Crimson Spire", "Emerald Empire"],
            },
        ],
    },
    {
        "name": "Geography",
        "html_dir": Path("../Worldbuilding/Geography"),
        "sections": geography_sections,
        "sources": [
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Geography\Meibor"),
                "articles": [
                    "Diavar Bar", "Everglow Mountains", "Glademeet", "Heksan Forest",
                    "Island of Shadows", "Jadieran Desert", "Lake Yatinue", "Meibor",
                    "Mistlands", "Najanova Jungle", "Renuanan Peninsula", "Sezei Highlands",
                    "The Yearning", "Walawi Forest",
                ],
            },
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Geography\Santsim"),
                "articles": ["Ashen Lands", "Lazelor", "Quarthax Plains", "Santsim"],
            },
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Geography\Avijor"),
                "articles": ["Avijor", "Revonia", "Neihalor"],
            },
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Geography\The Sea"),
                "articles": ["Grand Sea", "Jasman Strait", "Neuvi", "Paratu", "The Galeward", "The Shattered Isles"],
            },
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Geography\The Caverns Below"),
                "articles": ["Crystalline Lake", "The Caverns Below", "The Deeper Reaches"],
            },
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Stellar"),
                "articles": ["Kastorix"],
            },
        ],
    },
    {
        "name": "Species",
        "html_dir": Path("../Worldbuilding/Species"),
        "sections": species_sections,
        "sources": [
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Species"),
                "articles": [
                    "Aruna", "Brannur", "Coatl", "Dragonkin", "Dragon", "Elf", "Gnome",
                    "Human", "Muunderlin", "Naga", "Shyvarjarna", "Troll", "Vesper", "Yirte",
                ],
            },
        ],
    },
    {
        "name": "Creatures",
        "html_dir": Path("../Worldbuilding/Creatures"),
        "sections": creatures_sections,
        "sources": [
            {
                "path": Path(r"C:\NewPrograms\Github\Kastorix-Obsidian\Lore\Creatures"),
                "articles": ["Drake", "Wyvern", "Hydra"],
            },
        ],
    },
]


OBSIDIAN_LINK_RE = re.compile(r"\[\[([^|\]]+)(?:\|([^\]]+))?\]\]")

def custom_markdown_to_html(md_content, link_to_type):
    md_content = convert_obsidian_links(md_content, link_to_type)
    html_content = markdown.markdown(
        md_content,
        extensions=["extra", "nl2br"],
        output_format="html5",
    )
    html_content = re.sub(r"<br>\s*(<h4 class=\"portfolio-subtitle\">)", r"\1", html_content)
    return html_content

HEADER_LEVEL_4_RE = re.compile(r"^#### (.*)$", flags=re.MULTILINE)
WIKIBOX_FIELD_RE = re.compile(r"\*\*([^:]+):\*\*(.*?)(?=\n\*\*|\Z)", re.DOTALL)


def build_link_map(categories):
    link_to_type = {}
    for category in categories:
        for source in category["sources"]:
            for article in source["articles"]:
                link_to_type[article] = category["name"]
    return link_to_type


def convert_obsidian_links(text, link_to_type, default_type="Geography"):
    def replace(match):
        target = match.group(1)
        label = match.group(2) or target
        article_type = link_to_type.get(target, default_type)
        return f'<a href="Worldbuilding/{article_type}/{target}.html">{label}</a>'

    return OBSIDIAN_LINK_RE.sub(replace, text)

def extract_wikibox_values(md_content, mapping):
    fields = {}
    if not mapping:
        return fields

    for key, html_key in mapping.items():
        match = re.search(rf"\*\*{re.escape(key)}:\*\*(.*?)(?=\n\*\*|\Z)", md_content, flags=re.DOTALL)
        if match:
            fields[html_key] = match.group(1).strip()
    return fields


def update_wikibox_lines(template_lines, field_values):
    if not field_values:
        return template_lines

    for index, line in enumerate(template_lines):
        if '<div class="wikibox">' in line:
            for offset in range(index + 1, min(index + 25, len(template_lines))):
                updated_line = template_lines[offset]
                for field, value in field_values.items():
                    if f"<b>{field}:</b>" in updated_line:
                        updated_line = re.sub(
                            rf"(<b>{re.escape(field)}:</b>).*?(<br>)",
                            rf"\1 {value}\2",
                            updated_line,
                        )
                template_lines[offset] = updated_line
            break
    return template_lines


def extract_section_content(md_content, section_header):
    section_re = re.compile(
        rf"{re.escape(section_header)}\s+(.*?)(?=\n### |\Z)",
        re.DOTALL,
    )
    match = section_re.search(md_content)
    return match.group(1).strip() if match else None


def insert_section_html(template_lines, section_name, html_section):
    marker = f"<!-- {section_name} Text Below -->"
    for index, line in enumerate(template_lines):
        if marker in line:
            end_index = index + 1
            while end_index < len(template_lines) and "<!-- Stop Here -->" not in template_lines[end_index] and "</div>" not in template_lines[end_index]:
                end_index += 1
            template_lines[index + 1:end_index] = [f"                                    {html_section}\n"]
            return


def process_article(md_path, html_path, category_name, link_to_type, sections, wikibox_mapping=None):
    md_content = md_path.read_text(encoding="utf-8")
    template_lines = html_path.read_text(encoding="utf-8").splitlines(keepends=True)

    if wikibox_mapping:
        field_values = extract_wikibox_values(md_content, wikibox_mapping)
        template_lines = update_wikibox_lines(template_lines, field_values)

    for section_name, section_header in sections.items():
        section_text = extract_section_content(md_content, section_header)
        if not section_text:
            continue

        section_text = HEADER_LEVEL_4_RE.sub(r'<h4 class="portfolio-subtitle">\1</h4>', section_text)
        html_section = custom_markdown_to_html(section_text, link_to_type)
        html_section = re.sub(r"<br>\s*<h4 class=\"portfolio-subtitle\">", r"<h4 class=\"portfolio-subtitle\">", html_section)
        html_section = re.sub(r"</p>\s*<br>\s*<p>", r"</p><p>", html_section)

        insert_section_html(template_lines, section_name, html_section)

    html_path.write_text("".join(template_lines), encoding="utf-8")
    print(f"Processed {md_path.name} -> {html_path}")


def process_category(category, link_to_type):
    for source in category["sources"]:
        for article in source["articles"]:
            md_path = source["path"] / f"{article}.md"
            html_path = category["html_dir"] / f"{article}.html"

            if not md_path.exists():
                print(f"Skipped missing markdown: {md_path}")
                continue
            if not html_path.exists():
                print(f"Skipped missing template: {html_path}")
                continue

            process_article(
                md_path,
                html_path,
                category["name"],
                link_to_type,
                category["sections"],
                category.get("wikibox_mapping"),
            )


def main():
    link_to_type = build_link_map(CATEGORIES)
    for category in CATEGORIES:
        process_category(category, link_to_type)


if __name__ == "__main__":
    main()

