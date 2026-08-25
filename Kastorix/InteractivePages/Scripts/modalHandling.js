let modalIsOpen = false;
let currentModal;

function resolveModalOwner(owner = null) {
    if (owner && owner !== window) {
        return owner;
    }

    if (typeof collectionOwner !== 'undefined' && collectionOwner) {
        return collectionOwner;
    }

    if (typeof characterState !== 'undefined' && characterState) {
        return characterState;
    }

    return window;
}

function getModalItemList(config, owner = null) {
    if (typeof config.getItemList === 'function') {
        return config.getItemList(owner);
    }

    return config.itemList;
}

function openModal(button, itemType, tab = null, level = null) {
    if (modalIsOpen == true) {
        console.log("Modal is already open")
        return;
    }
    const oldItemName = button.getAttribute('data-selected-feat');
    button.classList.add('modal-open');
    //console.log("Open modal for " + itemType)
    currentModal = document.getElementById("mainModal");
    currentModal.style.display = 'block';
    currentTargetButton = button;

    currentModalLevel = level;
    if (currentModalLevel == 0) {
        currentModalLevel = 1;
    }

    // Find config directly by itemType
    const config = MODAL_CONFIGS.find(config => config.itemType === itemType);
    if (config) {
        modalIsOpen = true;
        const owner = resolveModalOwner(button?.dataset?.creatureIndex !== undefined ? window.creatures?.[button.dataset.creatureIndex] : null);
        const itemList = getModalItemList(config, owner);
        // Create consistent listId and detailsId
        const listId = 'modalList-' + itemType;
        const detailsId = 'modal-details-' + itemType;
        
        // Recreate the modal structure fresh each time it's opened
        createModal({
            title: config.title,
            itemType: itemType,
            listId: listId,
            detailsId: detailsId,
        });
        
        // Prepare tab name if provided
        let requestedTabName = null;
        //console.log("requested tab is " + tab)
        if (tab && tab != null) {
            const cleanTab = tab.replace('spellsContainer-', '');
            requestedTabName = cleanTab === "GrandMagus" ? "Grand Magus" : cleanTab;
        }
        //console.log("requested tab is " + tab)
        // Now initialize with the current level and requested tab
        initializeModalList({
            title: config.title,
            listId: listId,
            detailsId: detailsId,
            selectButtonLabel: config.selectButtonLabel,
            detailsRenderer: config.detailsRenderer,
            itemType: config.itemType,
            characterLevel: currentModalLevel,
            tabName: requestedTabName,
            itemList: itemList,
            oldItem: oldItemName,
        }); 
    }
}
let modalButton;
function openStatsModal(button) {
    modalButton = button;
    currentModal = document.getElementById("statsModal");
    currentModal.style.display = 'block';
    modalIsOpen = true;
    resetStatSelector();
}

function openStatIncreaseModal(button) {
    modalButton = button;
    currentModal = document.getElementById("statIncreaseModal");
    currentModal.style.display = 'block';
    modalIsOpen = true;
}

function closeModal() {
    currentModal.style.display = 'none';
    modalIsOpen = false;
}

const MODAL_CONFIGS = [
    {
        title: 'Species List',
        detailsRenderer: speciesDetailsRenderer,
        itemType: 'species',
        selectButtonLabel: 'Select Species'
    },
    {
        title: 'Backgrounds List',
        detailsRenderer: backgroundDetailsRenderer,
        itemType: 'background',
        selectButtonLabel: 'Select Background',
        getItemList: owner => owner?.backgrounds || characterState?.backgrounds || []
    },
    {
        title: 'Advantages List',
        detailsRenderer: advantageDetailsRenderer,
        itemType: 'advantage',
        selectButtonLabel: 'Select Advantage',
        getItemList: owner => owner?.advantages || characterState?.advantages || []
    },
    {
        title: 'Arcane Feats List',
        detailsRenderer: arcaneFeatsDetailsRenderer,
        itemType: 'arcaneFeat',
        selectButtonLabel: 'Select Arcane Feat',
        getItemList: owner => owner?.arcaneFeats || characterState?.arcaneFeats || []
    },
    {
        title: 'General Feats List',
        detailsRenderer: generalFeatsDetailsRenderer,
        itemType: 'generalFeat',
        selectButtonLabel: 'Select General Feat',
        getItemList: owner => owner?.generalFeats || characterState?.generalFeats || []
    },
    {
        title: 'Ancestry Feats List',
        detailsRenderer: ancestryFeatsDetailsRenderer,
        itemType: 'ancestryFeat',
        selectButtonLabel: 'Select Ancestry Feat',
        getItemList: owner => owner?.ancestryFeats || characterState?.ancestryFeats || []
    },
    {
        title: 'Spells List',
        detailsRenderer: spellsDetailsRenderer,
        itemType: 'spell',
        selectButtonLabel: 'Select Spell',
        getItemList: owner => owner?.spellsByRank ? Object.values(owner.spellsByRank).flat() : (window.spells || [])
    },
    {
        title: 'Metamagic List',
        detailsRenderer: metamagicsDetailsRenderer,
        itemType: 'metamagic',
        selectButtonLabel: 'Select Metamagic',
        getItemList: owner => owner?.metamagics || characterState?.metamagics || []
    },
    {
        title: 'Weapon List',
        detailsRenderer: weaponsDetailsRenderer,
        itemType: 'weapon',
        selectButtonLabel: 'Select Weapon',
        getItemList: owner => owner?.weapons || characterState?.weapons || []
    },
    {
        title: 'Combat Maneuvers List',
        detailsRenderer: combatManeuversDetailsRenderer,
        itemType: 'combatManeuvers',
        selectButtonLabel: 'Select Combat Maneuver',
        getItemList: owner => owner?.combatManeuvers || characterState?.combatManeuvers || []
    },
    {
        title: 'Gadget List',
        detailsRenderer: gadgetsDetailsRenderer,
        itemType: 'gadgets',
        selectButtonLabel: 'Select Gadget',
        getItemList: owner => owner?.gadgets || characterState?.gadgets || []
    },
    {
        title: 'Armor List',
        detailsRenderer: armorsDetailsRenderer,
        itemType: 'armor',
        selectButtonLabel: 'Select Armor'
    },
    {
        title: 'Golem Upgrades List',
        detailsRenderer: golemUpgradesDetailsRenderer,
        itemType: 'golemUpgrade',
        selectButtonLabel: 'Select Golem Upgrades',
        getItemList: owner => owner?.golemUpgrades || characterState?.golemUpgrades || []
    },
    {
        title: 'Runegun Upgrades List',
        detailsRenderer: runegunUpgradesDetailsRenderer,
        itemType: 'runegunUpgrade',
        selectButtonLabel: 'Select Runegun Upgrades',
        getItemList: owner => owner?.runegunUpgrades || characterState?.runegunUpgrades || []
    },
];

// When the user clicks anywhere outside of the modal, close it
window.onclick =function(event) {
    if (modalIsOpen && event.target == currentModal) {
        closeModal();
    }
};