function generateSkillsTable() {
    const tableBody = document.getElementById('skillsTableBody');
    //console.log(globalData.skills)
    globalData.skills.forEach((skill, index) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.className = 'name-column';
        nameCell.textContent = skill.name;
        row.appendChild(nameCell);

        const statCell = document.createElement('td');
        statCell.className = 'stat-column ' + skill.stat.toLowerCase() + 'Stat';
        statCell.textContent = skill.stat;
        row.appendChild(statCell);

        const modCell = document.createElement('td');
        modCell.className = 'mod-column';

        const proficiencyButton = document.createElement('button');
        proficiencyButton.className = 'proficiency-cycle-button';
        proficiencyButton.setAttribute('data-creature-index', '0');
        proficiencyButton.setAttribute('data-property', skill.name.toLowerCase());
        proficiencyButton.textContent = 'U';
        modCell.appendChild(proficiencyButton);

        const skillParagraph = document.createElement('p');
        skillParagraph.className = 'skill';
        skillParagraph.setAttribute('data-creature-index', '0');
        skillParagraph.setAttribute('data-skill-type', skill.name.toLowerCase());
        skillParagraph.textContent = '0';
        modCell.appendChild(skillParagraph);

        row.appendChild(modCell);
        tableBody.appendChild(row);
    });
}

function addLoreSkill(skillName = null, updateStats = true) {
    const tableBody = document.getElementById('skillsTableBody');
    const skillNameInout = document.getElementById('newSkillName');
    if (skillName == null) {
        skillName = skillNameInout.value;
    }

    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.className = 'name-column';
    nameCell.textContent = skillName + " Lore";
    row.appendChild(nameCell);

    const statCell = document.createElement('td');
    statCell.className = 'stat-column intStat';
    statCell.textContent = "INT";
    row.appendChild(statCell);

    const modCell = document.createElement('td');
    modCell.className = 'mod-column';

    const proficiencyButton = document.createElement('button');
    proficiencyButton.className = 'proficiency-cycle-button';
    proficiencyButton.setAttribute('data-creature-index', '0');
    proficiencyButton.setAttribute('data-property', (skillName + " Lore").toLowerCase());
    proficiencyButton.textContent = 'U';
    modCell.appendChild(proficiencyButton);

    const skillParagraph = document.createElement('p');
    skillParagraph.className = 'skill';
    skillParagraph.setAttribute('data-creature-index', '0');
    skillParagraph.setAttribute('data-skill-type', (skillName + " Lore").toLowerCase());
    skillParagraph.textContent = '0';
    modCell.appendChild(skillParagraph);

    row.appendChild(modCell);
    tableBody.appendChild(row);
    addSkillToDataList(skillName, updateStats)
}

function addSkillToDataList(skillname, updateStats) {
    const newSkill = {
        name: skillname + " Lore",
        stat: "INT",
        armorPenalties: ""
    };
    globalData.skills.push(newSkill);
    if (updateStats) {
        updateOnStatIncrease();
    }
}