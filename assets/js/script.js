const newsContainer = document.getElementById('news-container');
const paginationContainer = document.getElementById('pagination-container');
const feedTypes = document.querySelectorAll('[data-feedtype]');
const topStoriesContainer = document.getElementById('top-stories');

// const sampleStoryData = {
//   url: 'sample-url',
//   title: 'Sample title',
//   by: 'Author',
//   time: new Date(),
//   type: 'story',
//   score: 124,
// };

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
  })
  .catch((error) => {
    console.log('getStory error', error);
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
  })
  .catch((error) => {
    console.log('renderTheseStories err', error);
  });
}

function getStories(url, skip = 0, limit = 30) {
  return fetch(url)
  .then((res) => {
    return res.json();
  })
  .then((storyList) => {
    topStoriesList = storyList;
    return renderTheseStories(topStoriesList, skip, limit);
  })
  .then((storiesRendered) => {
    newsContainer.innerHTML = storiesRendered.join('');
    return renderPagination(1);
  })
  .then((paginationRendered) => {
    console.log('sr', paginationRendered);
    paginationContainer.innerHTML = paginationRendered;
    if (document.getElementsByClassName('loader')[0]) {
document.getElementsByClassName('loader')[0].setAttribute('class', 'loading');
}
  })
  .catch((err) => {
    console.error('getStories err', err);
  });
}

function renderThese(type) {
  switch (type) {
    case 'askstories':
    getStories(`https://hacker-news.firebaseio.com/v0/askstories.json`);
    break;

    case 'showstories':
    getStories(`https://hacker-news.firebaseio.com/v0/showstories.json`);
    break;

    case 'jobstories':
    getStories(`https://hacker-news.firebaseio.com/v0/jobstories.json`);
    break;

    case 'topstories':
    getStories(`https://hacker-news.firebaseio.com/v0/topstories.json`);
    break;

    case 'newstories':
    getStories(`https://hacker-news.firebaseio.com/v0/newstories.json`);
    break;

    case 'beststories':
    getStories(`https://hacker-news.firebaseio.com/v0/beststories.json`);
    break;

    default:
    getStories(`https://hacker-news.firebaseio.com/v0/jobstories.json`);
    break;
  }
}

function getThisFeed() {
  renderThese(this.getAttribute('data-feedtype'));
  document.getElementsByClassName('loading')[0].setAttribute('class', 'loader');
  document.querySelector('.ui.small.gwc-green.label').setAttribute('class', 'ui small label');
  this.querySelector('.label').setAttribute('class', 'ui small gwc-green label');
}

document.addEventListener('DOMContentLoaded', function() {
  return fetch(`https://hacker-news.firebaseio.com/v0/topstories.json`)
  .then((res) => {
    return res.json();
  })
  .then((topStories) => {
    let sampleStories = [getStory(topStories[0]), getStory(topStories[1])];
    return Promise.all(sampleStories);
  })
  .then((sampleData) => {
    topStoriesContainer.innerHTML = sampleData.join('');
    return getStories('https://hacker-news.firebaseio.com/v0/newstories.json', 0, 30);
  })
  .then((topStoriesRendered) => {
    console.log('topStoriesRendered', topStoriesRendered);
    feedTypes.forEach((feed) => {
     feed.addEventListener('click', getThisFeed, false);
    });
  })
  .catch((error) => {
    console.log('error', error);
  });
});


