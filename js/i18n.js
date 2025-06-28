import { getGitHubRepos, renderProjects } from "./github.js";

/**
 * Loads and applies translations for the selected language.
 * @param {string} lang - Language code (e.g., "en", "es")
 */
export async function updateLanguage(lang) {
  try {
    const res = await fetch(`./lang/${lang}.json`);
    const translations = await res.json();

    localStorage.setItem("lang", lang);

    // Update elements with text content
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = translations[key];
        } else {
          el.textContent = translations[key];
        }
      }
    });

    // Update elements with alt attribute
    document.querySelectorAll("[data-i18n-alt]").forEach(el => {
      const key = el.getAttribute("data-i18n-alt");
      if (translations[key]) {
        el.alt = translations[key];
      }
    });

  } catch (err) {
    console.error(`Error loading language "${lang}":`, err);
  }
}

/**
 * Initializes the language selector dropdown.
 * Handles language switching and re-renders project content accordingly.
 */
export function initLanguageSelector() {
  document.querySelectorAll(".lang-option").forEach(option => {
    option.addEventListener("click", async function (e) {
      e.preventDefault();
      const lang = this.dataset.lang;

      await updateLanguage(lang);

      // Clear current project list before re-rendering
      const projectContainer = document.querySelector(".projects-container");
      projectContainer.innerHTML = "";

      // Replace "YOUR GITHUB USER NAME" with your actual GitHub username
      const githubUsername = "YOUR GITHUB USER NAME";

      // Reload and render projects using the selected language
      const repos = await getGitHubRepos(githubUsername);
      renderProjects(repos, lang);
    });
  });

  // Apply saved language on initial page load
  window.addEventListener("DOMContentLoaded", async () => {
    const savedLang = localStorage.getItem("lang") || "es";
    await updateLanguage(savedLang);
  });
}