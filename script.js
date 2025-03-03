document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("news-container");
    const toggleButton = document.getElementById("theme-toggle");
    const languageSelector = document.getElementById("language-selector");

    const BASE_NEWS_URL = "https://news.google.com/rss?hl=";
    const LANGUAGE_CODES = {
        "en": "en-US",
        "hi": "hi-IN",
        "es": "es-419",
        "fr": "fr-FR",
        "de": "de-DE",
        "zh": "zh-CN",
        "ar": "ar-SA",
        "ru": "ru-RU",
        "ja": "ja-JP",
        "ko": "ko-KR",
        "it": "it-IT",
        "pt": "pt-BR",
        "nl": "nl-NL",
        "tr": "tr-TR",
        "vi": "vi-VN",
        "th": "th-TH",
        "bn": "bn-BD",
        "ur": "ur-PK",
        "he": "he-IL",
        "sw": "sw-KE"
    };

    async function fetchNews(language) {
        newsContainer.innerHTML = "<p>Fetching latest news...</p>";
        const RSS_FEED = BASE_NEWS_URL + (LANGUAGE_CODES[language] || "en-US");
        const PROXY_URL = "https://api.allorigins.win/get?url=" + encodeURIComponent(RSS_FEED);
        
        try {
            const response = await fetch(PROXY_URL);
            if (!response.ok) throw new Error("Failed to fetch news");

            const data = await response.json();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, "text/xml");
            const items = xmlDoc.querySelectorAll("item");

            newsContainer.innerHTML = "";
            items.forEach(item => {
                const title = item.querySelector("title").textContent;
                const link = item.querySelector("link").textContent;
                const pubDate = item.querySelector("pubDate").textContent;

                const newsItem = document.createElement("div");
                newsItem.classList.add("news-article");
                newsItem.innerHTML = `
                    <h2>${title}</h2>
                    <p>${pubDate}</p>
                    <a href="${link}" target="_blank">Read More</a>
                `;
                newsContainer.appendChild(newsItem);
            });
        } catch (error) {
            newsContainer.innerHTML = `<p>Error fetching news. Please try again.</p>`;
            console.error("Error fetching news:", error);
        }
    }

    fetchNews("en");
    setInterval(() => fetchNews(languageSelector.value), 300000);

    // Language Change Event
    languageSelector.addEventListener("change", (e) => {
        fetchNews(e.target.value);
    });

    // Theme Toggle
    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        toggleButton.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    }

    toggleButton.addEventListener("click", toggleTheme);

    // Apply saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        toggleButton.textContent = "☀️ Light Mode";
    }
});
