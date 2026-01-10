class SimpleGreeting extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('span');
    wrapper.setAttribute('class', 'wrapper');
    const text = document.createElement('p');
    text.textContent = `Hello, ${this.getAttribute('name') || 'World'}!`;
    const style = document.createElement('style');
    style.textContent = `
      .wrapper {
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: var(--card-bg-color);
        box-shadow: var(--shadow);
        color: var(--text-color);
        transition: background-color 0.3s, color 0.3s;
      }
    `;
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(text);
  }
}

customElements.define('simple-greeting', SimpleGreeting);

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme == 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleButton.textContent = '☀️';
    } else if (currentTheme == 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        toggleButton.textContent = '🌙';
    } else if (prefersDarkScheme.matches) {
        // If no preference is saved, check system preference
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleButton.textContent = '☀️';
    }

    toggleButton.addEventListener('click', function() {
        let theme = 'light';
        // If current theme is light (or not set), switch to dark
        if (!document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') === 'light') {
            theme = 'dark';
            document.documentElement.setAttribute('data-theme', 'dark');
            this.textContent = '☀️';
        } else {
            // Otherwise, switch to light
            document.documentElement.setAttribute('data-theme', 'light');
            this.textContent = '🌙';
        }
        // Save the user preference
        localStorage.setItem('theme', theme);
    });
});