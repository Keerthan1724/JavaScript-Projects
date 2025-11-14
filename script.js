const searchForm = document.querySelector('#search-form');
const searchBox = document.querySelector('#search-box');
const searchResult = document.querySelector('#search-result');
// const showMoreBtn = document.querySelector('#show-more-btn');

const accessKey = 'KsTwg-A2vospeZERNPY9RSGo6H3XkdYkAq0Wj0h7Vbg';

let keyword = "";
let page = 1;
let isLoading = false;
let lastScroll = 0;   // FIXED

const sentinel = document.createElement('div');
sentinel.id = 'scroll-sentinel';
sentinel.style.cssText = 'height:1px;width:100%';

async function searchImages() {
  if (isLoading) return;
  isLoading = true;

  keyword = searchBox.value;
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

  const response = await fetch(url);
  const data = await response.json();

  if (page == 1) {
    searchResult.innerHTML = '';
  }

  const results = data.results;

  results.map((result) => {

    const imageLink = document.createElement('a');
    imageLink.href = result.links.html;
    imageLink.target = '_blank';

    const image = document.createElement('img');
    image.src = result.urls.small;
    image.onload = () => image.classList.add('loaded');

    imageLink.appendChild(image);
    searchResult.appendChild(imageLink);
  });

  searchResult.appendChild(sentinel);
  isLoading = false;
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  page = 1;
  searchImages();
});

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoading) {
        const k = searchBox.value.trim();
        if (!k || searchResult.children.length === 0) return;
        page++;
        searchImages();
      }
    });
  }, { root: null, rootMargin: '200px', threshold: 0 });
  io.observe(sentinel);
}

const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});