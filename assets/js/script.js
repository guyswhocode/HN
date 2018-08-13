let newsContainer = document.getElementById('news-container');
const topStoriesURL = 'https://hacker-news.firebaseio.com/v0/topstories.json';
let topStoriesList = [];
// timeago().format(1473245023718);

function renderStory(story) {
  console.log('story', story);
  return new Promise((resolve, reject) => {
    return resolve(`<div class="ui card">
      <div class="content">
      <a class="header">${story.title}</a>
      <div class="meta">
      <span class="date">${story.by}</span>
      </div>
      </div>
      <div class="content">
      <span class="right floated">
      ${story.type}
      </span>
      <i class="star icon"></i>
      ${story.score}
      </div>
      </div>`);
  });
}

function renderSampleCards(n) {
  let data = '';
  for (let i = 0; i < n; i++) data += renderStory();
    return data;
}

function getStory(storyId) {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
  .then(res => {
    return res.json();
  })
  .then(dataParsed => {
    return renderStory(dataParsed);
  });
}

function renderTheseStories(stories, skip, limit) {
  stories = stories.slice(skip, skip + limit);
  let storyPromises = [];
  stories.forEach(storyId => {
    storyPromises.push(getStory(storyId));
  });
  return Promise.all(storyPromises).then(response => {
    return response;
  });
}

function getTopStories() {
  fetch(topStoriesURL)
  .then(res => {
    return res.json();
  })
  .then(storyList => {
    topStoriesList = storyList;
    return renderTheseStories(topStoriesList, 15, 15);
  })
  .then(storiesRendered => {
    console.log('storiesRendered.join()', storiesRendered.join(''));
    console.log('storiesRendered.join()', storiesRendered);
    newsContainer.innerHTML = storiesRendered.join('');
  })
  .catch(err => {
    console.log('err', err);
  });
}

getTopStories();