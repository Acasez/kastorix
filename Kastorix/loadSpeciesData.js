async function loadSpeciesData(speciesName) {
    try {
        const response = await fetch('sqlite/build/species.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const speciesData = await response.json();
        const speciesList = speciesData.All;

        if (!Array.isArray(speciesList)) {
            throw new Error('Species data is not an array within the "All" category');
        }

        const wikibox = document.querySelector('.wikibox[data-species=' + speciesName + ']');
        if (wikibox) {
            const currentSpeciesName = wikibox.getAttribute('data-species');
            const species = speciesList.find(s => s.name === currentSpeciesName);

            if (species) {
                const gameplayStatsDiv = wikibox.querySelector('.gameplay-stats');
                let traitsHTML = '';

                if (species.traitOne) {
                    traitsHTML += `<p><b>${species.traitOne}:</b> ${formatDescription(species.traitOneDescription)}</p>`;
                }
                if (species.traitTwo) {
                    traitsHTML += `<p><b>${species.traitTwo}:</b> ${formatDescription(species.traitTwoDescription)}</p>`;
                }
                if (species.traitThree) {
                    traitsHTML += `<p><b>${species.traitThree}:</b> ${formatDescription(species.traitThreeDescription)}</p>`;
                }
                if (species.traitFour) {
                    traitsHTML += `<p><b>${species.traitFour}:</b> ${formatDescription(species.traitFourDescription)}</p>`;
                }

                gameplayStatsDiv.innerHTML = `
                    <p><b>Size:</b> ${species.size}</p>
                    <p><b>Starting Health:</b> ${species.health}</p>
                    <p><b>Starting Mana:</b> ${species.mana}</p>
                    ${traitsHTML}
                `;
            } else {
                console.error(`Species not found: ${currentSpeciesName}`);
            }
        }
    } catch (error) {
        console.error('Error loading species data:', error);
    }
}

function formatDescription(description) {
    if (!description) return '';
    return description.replace(/\n/g, '<br>');
}