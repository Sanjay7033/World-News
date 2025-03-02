document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("news-container");

    const RSS_FEED = "https://news.google.com/rss";
    const PROXY_URL = "https://api.allorigins.win/get?url=" + encodeURIComponent(RSS_FEED);

    async function fetchNews() {
        newsContainer.innerHTML = "<p>Fetching latest news...</p>";

        try {
            const response = await fetch(PROXY_URL);
            if (!response.ok) throw new Error("Failed to fetch news");

            const data = await response.json();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, "text/xml");
            const items = xmlDoc.querySelectorAll("item");

            newsContainer.innerHTML = ""; // Clear previous content

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

    fetchNews();
    setInterval(fetchNews, 300000); // Refresh every 5 minutes
});
