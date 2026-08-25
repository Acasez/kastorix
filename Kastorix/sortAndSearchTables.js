let tableID = "";

function setTableId(id) {
    tableID = id;
}


function sortTable(n) {
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.querySelector(`#${tableID} table`);
    switching = true;
    dir = "asc";

    // Helper function to extract numeric value if possible
    const getValue = (cell) => {
        const text = cell.innerHTML.trim();
        const num = parseFloat(text);
        return isNaN(num) ? text.toLowerCase() : num;
    };

    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];

            const xVal = getValue(x);
            const yVal = getValue(y);

            if (dir === "asc") {
                if (xVal > yVal) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (xVal < yVal) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

document.getElementById("searchInput").addEventListener("keyup", function() {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.querySelector(`#${tableID} table`); // Use the variable here
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
});