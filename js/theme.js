/**
 * Initializes the dark/light theme toggle.
 * Defaults to light theme unless a user preference is saved.
 */
export function initThemeSwitch() {
  const switchInput = document.getElementById('themeSwitch');

  document.documentElement.setAttribute('data-theme', 'light');

  switchInput?.addEventListener('change', function () {
    if (this.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  });

}