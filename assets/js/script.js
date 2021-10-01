const newsContainer = document.getElementById('news-container');
const paginationContainer = document.getElementById('pagination-container');
const feedTypes = document.querySelectorAll('[data-feedtype]');
const topStoriesContainer = document.getElementById('top-stories');
let topStoriesList = [];
let currentCategoty = 'newstories';
let currentPage = 1;

dayjs.extend(dayjs_plugin_relativeTime);

function renderStory(story) {
  return new Promise((resolve, reject) => {
    return resolve(`
      <div class="column animated fadeInUp">
      <div class="ui flat fluid card">
      <div class="content">
      <a href="${story.url}" target="_blank" class="header">${story.title}</a>
      <div class="meta">
      <span class="date">${story.by}</span>
      </div>
      </div>
      <div class="extra content">
      <span class="right floated" style="text-transform: capitalize;">
      ${ story.type }
      </span>
      <i class="comment alternate outline icon"></i>
      ${story.kids ? story.kids.length : 0 }
      </div>
      </div>
      </div>
      `);
  });
}

function renderPagination(pageNum) {
  return new Promise((resolve, reject) => {
    // let pagesCount = topStoriesList.length/30;
    return resolve(`
      <div class="ui pagination menu">
      <a class="item" onClick="renderPreviousPage()">
      &lt
      </a>
      <div class="active item">
      ${pageNum}
      </div>
      <a class="item" onClick="renderNextPage()">
      &gt
      </a>
      </div>
      `);
  })
  .then((paginationRendered) => {
    paginationContainer.innerHTML = paginationRendered;
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
    return res.json({});
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
    if (document.getElementsByClassName('loader')[0]) {
      document.getElementsByClassName('loader')[0].setAttribute('class', 'loading');
      window.scrollTo(0, 0);
    }
  })
  .catch((err) => {
    console.error('getStories err', err);
  });
}

function renderThese(type, page = 1) {
  let limit = 30;
  let skip = (page - 1) * 30;
  switch (type) {
    case 'askstories':
    return getStories(`https://hacker-news.firebaseio.com/v0/askstories.json`, skip, limit);
    break;

    case 'showstories':
    return getStories(`https://hacker-news.firebaseio.com/v0/showstories.json`, skip, limit);
    break;

    case 'jobstories':
    return getStories(`https://hacker-news.firebaseio.com/v0/jobstories.json`, skip, limit);
    break;

    case 'topstories':
    return getStories(`https://hacker-news.firebaseio.com/v0/topstories.json`, skip, limit);
    break;

    case 'newstories':
    return getStories(`https://hacker-news.firebaseio.com/v0/newstories.json`, skip, limit);
    break;

    case 'beststories':
    return getStories(`https://hacker-news.firebaseio.com/v0/beststories.json`, skip, limit);
    break;

    default:
    return getStories(`https://hacker-news.firebaseio.com/v0/topstories.json`, skip, limit);
    break;
  }
}

function getThisFeed() {
  currentPage = 1;
  document.getElementsByClassName('loading')[0].setAttribute('class', 'loader');
  renderThese(this.getAttribute('data-feedtype'), currentPage)
  .then((renderCompleted) => {
    document.getElementsByClassName('loader')[0].setAttribute('class', 'loading');
    window.scrollTo(0, 0);
  });
  document.querySelector('.ui.fluid.vertical.menu > .active.item').setAttribute('class', 'item');
  document.querySelector('.ui.small.gwc-green.label').setAttribute('class', 'ui small label');
  this.querySelector('.label').setAttribute('class', 'ui small gwc-green label');
  this.setAttribute('class', 'active item');
}

function renderNextPage() { // eslint-disable-line no-unused-vars
  currentPage += 1;
  document.getElementsByClassName('loading')[0].setAttribute('class', 'loader');
  renderThese(currentCategoty, currentPage)
  .then((rendered) => {
    console.log('currentPage', currentPage);
    return renderPagination(currentPage);
  })
  .then((paginationDone) => {
    console.log('Pagination success');
    document.getElementsByClassName('loader')[0].setAttribute('class', 'loading');
    window.scrollTo(0, 0);
  });
}

function getItemsCount(url, type, obj){
  return fetch(url)
  .then((response) => {
    return response.json({});
  })
  .then(responseJson => {
    obj[type] = responseJson.length || 0;
    return obj;
  })
  .catch(error => {
    obj[type] = 0;
    return Promise.resolve(obj);
  })
}

function updateNavigation(){
  let itemCounts = {
    newStories: 0,
    topStories: 0,
    bestStories: 0,
    ask: 0,
    stories: 0,
    jobs: 0
  }

  return Promise.all([
    getItemsCount('https://hacker-news.firebaseio.com/v0/askstories.json', 'ask', itemCounts),
    getItemsCount('https://hacker-news.firebaseio.com/v0/showstories.json', 'stories', itemCounts),
    getItemsCount('https://hacker-news.firebaseio.com/v0/jobstories.json', 'jobs', itemCounts),
    getItemsCount('https://hacker-news.firebaseio.com/v0/topstories.json', 'topStories', itemCounts),
    getItemsCount('https://hacker-news.firebaseio.com/v0/newstories.json', 'newStories', itemCounts),
    getItemsCount('https://hacker-news.firebaseio.com/v0/beststories.json', 'bestStories', itemCounts)
    ])
  .then((result) => {
    document.querySelector('.new-stories .label').innerHTML = itemCounts.newStories;
    document.querySelector('.top-stories .label').innerHTML = itemCounts.topStories;
    document.querySelector('.best-stories .label').innerHTML = itemCounts.bestStories;
    document.querySelector('.ask .label').innerHTML = itemCounts.ask;
    document.querySelector('.stories .label').innerHTML = itemCounts.stories;
    document.querySelector('.jobs .label').innerHTML = itemCounts.jobs;
    return result;
  })
  .catch((error) => {
    console.log('updateNavigation error', error);
    return Promise.resolve();
  })
}

function renderPreviousPage() { // eslint-disable-line no-unused-vars
  currentPage -= 1;
  document.getElementsByClassName('loading')[0].setAttribute('class', 'loader');
  renderThese(currentCategoty, currentPage)
  .then((rendered) => {
    return renderPagination(currentPage);
  })
  .then((paginationDone) => {
    document.getElementsByClassName('loader')[0].setAttribute('class', 'loading');
    window.scrollTo(0, 0);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  updateNavigation()
  .then(updatedNavigation => {
    return fetch(`https://hacker-news.firebaseio.com/v0/topstories.json`)
  })
  .then((res) => {
    return res.json();
  })
  .then((topStories) => {
    let sampleStories = [getStory(topStories[0]), getStory(topStories[1])];
    return Promise.all(sampleStories);
  })
  .then((sampleData) => {
    topStoriesContainer.innerHTML = sampleData.join('');
    return renderThese('newstories', 1);
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
