//Section Menu Logic
document.querySelectorAll('.section-menu').forEach(menu => {
    menu.addEventListener('click', () => {
        // Remove selected class from all menus
        document.querySelectorAll('.section-menu').forEach(m => {
            m.classList.remove('section-menu-selected');
        });
        // Add selected class to clicked menu
        menu.classList.add('section-menu-selected');

        // Hide all tab contents
        document.querySelectorAll('.tabbed-area-display').forEach(display => {
            display.style.display = 'none';
        });
        // Show the selected tab content
        const tabName = menu.getAttribute('data-tab');
        document.querySelector(`.tabbed-area-display[data-tab="${tabName}"]`).style.display = 'block';
        resizeTabDisplay();
    });
});

function resizeTabDisplay() {
    const displays = document.querySelectorAll('.tabbed-area-display');
    displays.forEach(display => {
        display.style.height = 'auto'; // Reset height
        var height = display.scrollHeight;
        height += 5;
        display.style.height = `${height}px`;
    });
}

// Call this function after content loads or changes
window.addEventListener('load', resizeTabDisplay);