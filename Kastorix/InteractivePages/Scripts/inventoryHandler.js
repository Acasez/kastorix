// Function to update window.equipment when a field is edited
function updateInventoryField(fieldId, propertyName) {
    var field = document.getElementById(fieldId);
    if (field) {
        field.addEventListener('input', function () {
            //console.log("updating inventory");
            if (field.type === 'number') {
                characterState.inventory[propertyName] = parseInt(field.value) || 0;
            }
            else {
                characterState.inventory[propertyName] = field.value;
            }
        });
    }
}

function clearInventoryFields() {
    document.getElementById('heldItems').value = "";
    document.getElementById('quickAccessItems').value = "";
    document.getElementById('equipment').value = "";
    document.getElementById('notes').value = "";
    document.getElementById('languages').value = "";
    document.getElementById('gold').value = "0";
    document.getElementById('silver').value = "0";
}
