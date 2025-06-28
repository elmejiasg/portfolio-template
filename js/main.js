import { getGitHubRepos, renderProjects } from "./github.js";
import { initThemeSwitch } from "./theme.js";
import { initLanguageSelector, updateLanguage  } from "./i18n.js";

document.addEventListener("DOMContentLoaded", async () => {
  initThemeSwitch();
  initLanguageSelector();

  const lang = localStorage.getItem("lang") || "es";
  await updateLanguage(lang);
  
  // Replace "YOUR GITHUB USER NAME" with your actual GitHub username
  const repos = await getGitHubRepos("YOUR GITHUB USER NAME"); 
  renderProjects(repos, lang);
});