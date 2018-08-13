const newsContainer = document.getElementById('news-container');
const paginationContainer = document.getElementById('pagination-container');
const topStoriesURL = 'https://hacker-news.firebaseio.com/v0/topstories.json';

let topStoriesList = [];

dayjs.extend(dayjs_plugin_relativeTime);

function renderStory(story) {
  console.log('story', story);
  return new Promise((resolve, reject) => {
    return resolve(`<div class="column">
      <div class="ui flat card">
      <div class="content">
      <a class="header">${story.title}</a>
      <div class="meta">
      <span class="date">${story.by}</span>
      </div>
      </div>
      <div class="extra content">
      <span class="right floated">
      ${dayjs(story.time).fromNow()} in <i>${story.type}</i> 
      </span>
      <i class="star icon"></i>
      ${story.score}
      </div>
      </div>
      </div>`);
  });
}

function renderPagination() {
  return new Promise((resolve, reject) => {
    return resolve(`<div class="ui pagination menu">
      <a class="active item">
      1
      </a>
      <div class="disabled item">
      ...
      </div>
      <a class="item">
      10
      </a>
      <a class="item">
      11
      </a>
      <a class="item">
      12
      </a>
      </div>`);
  });
}

function getStory(storyId) {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
  .then((res) => {
    return res.json();
  })
  .then((dataParsed) => {
    return renderStory(dataParsed);
  });
}

function renderTheseStories(stories, skip, limit) {
  stories = stories.slice(skip, skip + limit);
  let storyPromises = [];
  stories.forEach((storyId) => {
    storyPromises.push(getStory(storyId));
  });
  return Promise.all(storyPromises).then((response) => {
    return response;
  });
}

function getTopStories() {
  fetch(topStoriesURL)
  .then((res) => {
    return res.json();
  })
  .then((storyList) => {
    topStoriesList = storyList;
    return renderTheseStories(topStoriesList, 15, 15);
  })
  .then((storiesRendered) => {
    newsContainer.innerHTML = storiesRendered.join('');
    return renderPagination();
  })
  .then(paginationRendered => {
    console.log('paginationRendered', paginationRendered);
    paginationContainer.innerHTML = paginationRendered;
  })
  .catch((err) => {
    console.log('err', err);
  });
}

getTopStories();