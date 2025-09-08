const blogsContainer = document.getElementById("blogs-container");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const limit = 6; // blogs per page

async function fetchBlogs(page = 1) {
    try {
        const res = await fetch(`/get/blogs?page=${page}&limit=${limit}`);
        const data = await res.json();
        console.log(data)

        // Clear container
        blogsContainer.innerHTML = "";

        // Render cards
        data.blogs.forEach(blog => {
            const article = document.createElement("article");
            article.className =
                "rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 shadow-lg";

            article.innerHTML = `
          <div class="h-40 sm:h-48 relative">
            <img src="${blog.featured_image}" 
                 alt="Blog cover" 
                 class="w-full h-full object-cover brightness-90" />
            <div class="absolute inset-0 bg-black/25 backdrop-blur-sm"></div>
          </div>
          <div class="p-4 sm:p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-[5rem] aspect-square rounded-full overflow-hidden bg-gradient-to-br from-[#1384F2] to-zinc-700 flex items-center justify-center text-black font-bold">
                    <img src="${blog.author_image}">
                </div>
                <div>
                  <h3 class="text-lg font-semibold leading-tight w-fit mr-1">${blog.title}</h3>
                  <p class="text-xs text-gray-400">${new Date(blog.created_at).toDateString()}</p>
                </div>
              </div>
              <div class="text-sm text-gray-400">${blog.tags || ""}</div>
            </div>
            <p class="mt-3 text-gray-300 text-sm line-clamp-3">${blog.excerpt}</p>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex gap-2">
                <button class="px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs">Read</button>
                <button class="px-3 py-1 rounded-lg bg-transparent border border-zinc-800 text-xs text-gray-300">Save</button>
              </div>
              <a class="text-xs text-gray-400 hover:text-white" href="/blog?title=${blog.title.split(" ")[0].toLocaleLowerCase()}&id=${blog.id}" target="_blank">Continue →</a>
            </div>
          </div>
        `;
            blogsContainer.appendChild(article);
        });

        // Update pagination info
        currentPage = data.page;
        pageInfo.textContent = `Page ${data.page} of ${data.totalPages}`;

        // Disable buttons when needed
        prevBtn.disabled = data.page === 1;
        nextBtn.disabled = data.page === data.totalPages;
    } catch (err) {
        console.error("Error fetching blogs:", err);
    }
}

// Event Listeners
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) fetchBlogs(currentPage - 1);
});
nextBtn.addEventListener("click", () => {
    fetchBlogs(currentPage + 1);
});

// Initial load
fetchBlogs();







// search logic 
const searchInput = document.getElementById("search-blog");
async function fetchSearchBlogs(query, page = 1) {
    try {
        const res = await fetch(`/search/blogs?q=${encodeURIComponent(query)}&page=${page}`);
        const data = await res.json();

        renderBlogs(blogs);

        // ✅ Pagination logic can go here
        console.log("Pagination info:", data.pagination);

    } catch (err) {
        console.error(err);
    }
}

async function renderBlogs(data) {
    blogsContainer.innerHTML = ""; // clear old blogs
    data.data.forEach(blog => {
        const blogCard = `
          <article class="rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 shadow-lg">
            <div class="h-40 sm:h-48 relative">
              <img src="${blog.featured_image || 'https://via.placeholder.com/600'}"
                alt="${blog.title}" class="w-full h-full object-cover brightness-90" />
              <div class="absolute inset-0 bg-black/25 backdrop-blur-sm"></div>
            </div>
            <div class="p-4 sm:p-5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-14 aspect-square rounded-md bg-gradient-to-br from-[#1384F2] to-zinc-700 flex items-center justify-center text-black font-bold">
                    ${blog.author?.charAt(0) || 'R'}
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold leading-tight">${blog.title}</h3>
                    <p class="text-xs text-gray-400">${new Date(blog.created_at).toDateString()} • ${Math.ceil((blog.content?.split(" ").length || 200) / 200)} min</p>
                  </div>
                </div>
                <div class="text-sm text-gray-400">${blog.tags || ''}</div>
              </div>
              <p class="mt-3 text-gray-300 text-sm line-clamp-3">${blog.excerpt || ''}</p>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex gap-2">
                  <button class="px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs w-fit">Read</button>
                  <button class="px-3 py-1 rounded-lg bg-transparent border border-zinc-800 text-xs text-gray-300 w-fit">Save</button>
                </div>
                <a class="text-xs text-gray-400 hover:text-white" href="#">Continue →</a>
              </div>
            </div>
          </article>
        `;
        blogsContainer.insertAdjacentHTML("beforeend", blogCard);
    });

}

// 🔎 Add typing search with debounce
let debounceTimer;
searchInput.addEventListener("input", e => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetchSearchBlogs(e.target.value);
    }, 400); // delay to avoid too many requests
});



// FILTER LOGIC
document.querySelectorAll("#blog-filters span").forEach(el => {
    el.addEventListener("click", () => {
        const filter = el.dataset.filter;
        fetch(`/search/blogs?filter=${filter}`)
            .then(res => res.json())
            .then(data => {
                console.log("Filtered blogs:", data);
                renderBlogs(data);
            });
    });
});