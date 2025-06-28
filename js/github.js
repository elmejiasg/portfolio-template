// Fetch Public GitHub Repos
export async function getGitHubRepos(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos`);

    // Handle GitHub API rate limiting
    if (res.status === 403) {
      showRateLimitMessage();
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    if (!res.ok) throw new Error("Failed to load repositories.");

    const all = await res.json();

    // Filter out forks, private repos, and the GitHub Pages repo
    return all.filter(
      repo =>
        !repo.fork &&
        !repo.private &&
        repo.name !== `${username.toLowerCase()}.github.io`
    );
  } catch (error) {
    console.error("Error loading repositories:", error);
    return [];
  }
}

// Display a warning if the rate limit is reached
function showRateLimitMessage() {
  const container = document.querySelector(".projects-container");
  container.innerHTML = `
    <div class="alert alert-warning w-100 text-center" role="alert">
      <i class="fa-solid fa-triangle-exclamation me-2"></i>
      <strong>Rate limit exceeded</strong>. Please try again later.
    </div>
  `;
}

// Load custom project config (if available)
async function fetchRepoConfig(repo) {
  const configUrl = `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/main/portfolio.config.json`;

  try {
    const res = await fetch(configUrl);
    if (!res.ok) throw new Error("No config found");
    return await res.json();
  } catch {
    return null;
  }
}

// Render Projects from Repos
const defaultBanners = [
  "../assets/img/banners/banner1.png",
  "../assets/img/banners/banner2.png",
  "../assets/img/banners/banner3.png",
  "../assets/img/banners/banner4.png",
  "../assets/img/banners/banner5.png"
];

export async function renderProjects(repos, lang = "es") {
  const projectContainer = document.querySelector(".projects-container");
  projectContainer.innerHTML = "";

  for (const repo of repos) {
    const config = await fetchRepoConfig(repo);

    // Load list of languages used in the repository
    const langRes = await fetch(repo.languages_url);
    const languagesData = await langRes.json();
    const languages = Object.keys(languagesData).join(" | ") || "No languages listed";

    // Internationalized title and description
    const title = config?.title?.[lang] || repo.name;
    const description = config?.description?.[lang] || repo.description || "No description provided.";
    const tags = config?.tags?.join(" | ") || languages;

    // Banner image
    const banner = config?.banner || defaultBanners[Math.floor(Math.random() * defaultBanners.length)];

    const col = document.createElement("div");
    col.classList.add("col");
    col.innerHTML = `
      <a href="${repo.html_url}" target="_blank" class="card-link text-decoration-none text-dark">
        <div class="card h-100 shadow-sm">
          <img src="${banner}" class="card-img-top" alt="Imagen de proyecto" data-i18n-alt="projectPicAlt">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold mb-3">${title}</h5>
            <p class="card-text flex-grow-1">${description}</p>
            <p class="tech">${tags}</p>
          </div>
        </div>
      </a>
    `;
    projectContainer.appendChild(col);
  }
}
