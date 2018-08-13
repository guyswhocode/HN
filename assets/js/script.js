const newsContainer = document.getElementById('news-container');
const paginationContainer = document.getElementById('pagination-container');

let topStoriesList = [];

dayjs.extend(dayjs_plugin_relativeTime);

function renderStory(story) {
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

function renderPagination(pageNum) {
  return new Promise((resolve, reject) => {
    // let pagesCount = topStoriesList.length/30;
    return resolve(`<div class="ui pagination menu">
      <a class="item">
      &lt
      </a>
      <div class="active item">
      ${pageNum}
      </div>
      <a class="item">
      &gt
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

function renderThese(type) {
  console.log('alert');
  switch (type) {
    case 'askstories':
    getTopStories(`https://hacker-news.firebaseio.com/v0/askstories.json`);
    break;

    case 'showstories':
    getTopStories(`https://hacker-news.firebaseio.com/v0/showstories.json`);
    break;

    case 'jobstories':
    getTopStories(`https://hacker-news.firebaseio.com/v0/jobstories.json`);
    break;

    case 'topstories':
    getTopStories(`https://hacker-news.firebaseio.com/v0/topstories.json`);
    break;

    case 'newstories':
    getTopStories(`https://hacker-news.firebaseio.com/v0/newstories.json`);
    break;

    case 'beststories':
    getTopStories(`https://hacker-news.firebaseio.com/v0/beststories.json`);
    break;

    default:
    getTopStories(`https://hacker-news.firebaseio.com/v0/jobstories.json`);
    break;
  }
}

function getTopStories(url) {
console.log('url', url);
  fetch(url)
  .then((res) => {
    return res.json();
  })
  .then((storyList) => {
    topStoriesList = storyList;
    return renderTheseStories(topStoriesList, 15, 15);
  })
  .then((storiesRendered) => {
    newsContainer.innerHTML = storiesRendered.join('');
    return renderPagination(1);
  })
  .then((paginationRendered) => {
    // console.log('paginationRendered', paginationRendered);
    paginationContainer.innerHTML = paginationRendered;
  })
  .catch((err) => {
    console.error('err', err);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // renderThese('askstories');
  renderThese('topstories');
  // renderThese('jobstories');
});

