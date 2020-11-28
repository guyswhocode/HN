function getStoriesByCategory(category, page = 1) {
  let limit = 30;
  let skip = (page - 1) * 30;

  const categoryUrlMap = {
    ask: "https://hacker-news.firebaseio.com/v0/askstories.json",
    show: "https://hacker-news.firebaseio.com/v0/showstories.json",
    job: "https://hacker-news.firebaseio.com/v0/jobstories.json",
    top: "https://hacker-news.firebaseio.com/v0/topstories.json",
    new: "https://hacker-news.firebaseio.com/v0/newstories.json",
    best: "https://hacker-news.firebaseio.com/v0/beststories.json",
    default: "https://hacker-news.firebaseio.com/v0/topstories.json",
  };

  const selectedCategoryUrl =
    categoryUrlMap[category] || categoryUrlMap["default"];
  return getStoriesByUrl(selectedCategoryUrl, skip, limit);
}

function getStoryById(storyId) {
  return fetch(
    `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
  ).then((res) => {
    return res.json();
  });
}

function getStoriesByUrl(url, skip, limit) {
  return fetch(url)
    .then((res) => {
      return res.json({});
    })
    .then((storyIds) => {
      return Promise.all(
        storyIds.slice(0, limit).map((storyId) => getStoryById(storyId))
      );
    });
}

function renderStories(stories = []) {
  let renderedStories = stories.map((story) => {
    return `<div class="col-sm-12 col-md-6 col-lg-4">
       <div class="card">
         <h2 class="card-title">${story.title}</h2>
         <div>
           <span class="badge ml-5">
             <!-- ml-5 = margin-left: 0.5rem (5px) -->
             <i class="fa fa-heart text-danger mr-5" aria-hidden="true"></i> ${story.score}
             Points
             <!-- text-danger = color: danger-color, mr-5 = margin-right: 0.5rem (5px) -->
           </span>
           <span class="badge">
             <i class="fa fa-comments text-primary mr-5" aria-hidden="true"></i>
             ${story.kids?.length} Comments
             <!-- text-primary = color: primary-color, mr-5 = margin-right: 0.5rem (5px) -->
           </span>
         </div>
       </div>
     </div>`;
  });

  return renderedStories.join("\n");
}

document.addEventListener("DOMContentLoaded", function () {
  const storyCardsContainer = document.getElementById("story-cards");

  getStoriesByCategory("top")
    .then((data) => {
      return renderStories(data);
    })
    .then((renderedContent) => {
      storyCardsContainer.innerHTML = renderedContent;
    });
});
