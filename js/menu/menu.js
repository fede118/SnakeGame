class Menu {
    constructor(options, updateCallback) {
        this.options = options;
        this.selectedIndex = 0;
        this.updateCallback = updateCallback;
    }

    updateMenu() {
        this.options.forEach((option, index) => {
            const element = document.getElementById(option.id);
            const label = option.label || option.id.charAt(0).toUpperCase() + option.id.slice(1);
            element.innerHTML = (index === this.selectedIndex ? '> ' : '&nbsp;&nbsp;') + label;
        });
    }

    handleInput(event) {
        if (event.key === 'ArrowUp') {
            this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
            this.updateMenu();
        } else if (event.key === 'ArrowDown') {
            this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
            this.updateMenu();
        } else if (event.key === 'Enter') {
            this.options[this.selectedIndex].action();
        }
    }
}

export default Menu;