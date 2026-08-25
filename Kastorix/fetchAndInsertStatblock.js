async function loadStatblock(statblockName, statblockID) {
    fetch('sqlite/Statblocks/' + statblockName + '.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById(statblockID).innerHTML = html;
        })
        .catch(error => {
            console.error("Error loading statblock:", error);
        });
}