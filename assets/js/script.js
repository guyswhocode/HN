const newsContainer = document.getElementById('news-container');
const paginationContainer = document.getElementById('pagination-container');
const feedTypes = document.querySelectorAll('[data-feedtype]');
const topStoriesContainer = document.getElementById('top-stories');

const sampleStoryData = {
  url: 'sample-url',
  title: 'Sample title',
  by: 'Author',
  time: new Date(),
  type: 'story',
  score: 124
};

let topStoriesList = [];

dayjs.extend(dayjs_plugin_relativeTime);

function renderStory(story) {
  return new Promise((resolve, reject) => {
    return resolve(`<div class="column">
      <div class="ui flat fluid card">
      <div class="content">
      <a href="${story.url}" target="_blank" class="header">${story.title}</a>
      <div class="meta">
      <span class="date">${story.by}</span>
      </div>
      </div>
      <div class="extra content">
      <span class="right floated">
      ${ story.type.charAt(0).toUpperCase() + story.type.substr(1) } 
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
    return renderTheseStories(topStoriesList, 0, 30);
  })
  .then((storiesRendered) => {
    newsContainer.innerHTML = storiesRendered.join('');
    return renderPagination(1);
  })
  .then((paginationRendered) => {
    // console.log('paginationRendered', paginationRendered);
    paginationContainer.innerHTML = paginationRendered;
    document.getElementsByClassName('loader')[0].setAttribute('class', 'loading');
  })
  .catch((err) => {
    console.error('err', err);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  renderThese('topstories');
  let sampleStories = [renderStory(sampleStoryData),renderStory(sampleStoryData)];
  console.log('sampleStories', sampleStories);
  Promise.all(sampleStories)
  .then(sampleData => {
    topStoriesContainer.innerHTML = sampleData.join('');
  })
  .catch(error => {
    console.log('sample data error', error);
  });
  
  feedTypes.forEach((feed) => {
   feed.addEventListener('click', getThisFeed, false);
  });

});

function getThisFeed() {
  renderThese(this.getAttribute('data-feedtype'));
  document.getElementsByClassName('loading')[0].setAttribute('class', 'loader');
  document.querySelector('.ui.small.gwc-green.label').setAttribute('class', 'ui small label');
  this.querySelector('.label').setAttribute('class', 'ui small gwc-green label');
}

