import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import resources from './locales/index.js';
import initStartView from './view/initStartView.js';
import viewFeedAndPosts from './view/view.js';
import validator from './utils/validator.js';
import getProxy from './utils/proxify.js';
import parserToXml from './utils/parser.js';
import { updatePosts, updateInterval } from './utils/updater.js';

const app = () => {
  const { ru } = resources;
  const state = {
    rssForm: {
      stateForm: 'filling',
      inputValueStatus: true,
      error: null,
    },
    feeds: [],
    posts: [],
    uiState: {
      visitedLinks: new Set(),
      modalId: null,
    },
  };

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  const elementsForStartView = {
    header: document.querySelector('h1'),
    headerDescription: document.querySelector('p[class="lead"]'),
    labelForUrlInput: document.querySelector('.form-floating label'),
    inputPlaceholder: document.querySelector('.form-floating input'),
    exampleLink: document.querySelector('p[class="mt-2 mb-0 text-white-50"]'),
    rssButtonAdd: document.querySelector('.col-auto button'),
    modalButtonReadFully: document.querySelector('.modal-footer a'),
    modalButtonClose: document.querySelector('.modal-footer button'),
  };

  initStartView(elementsForStartView, i18nextInstance);

  const elementsForInitFeedAndPosts = {
    form: document.querySelector('form'),
    inputEl: document.querySelector('#url-input'),
    buttonAdd: document.querySelector('button[type="submit"]'),
    feedbackEl: document.querySelector('.feedback'),
    feedsEl: document.querySelector('.feeds'),
    postsEl: document.querySelector('.posts'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalFooter: document.querySelector('.modal-footer'),
  };

  const watchedState = viewFeedAndPosts(
    state,
    elementsForInitFeedAndPosts,
    i18nextInstance,
  );

  elementsForInitFeedAndPosts.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.rssForm.stateForm = 'filling';
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const urlsList = watchedState.feeds.map((feed) => feed.url);
    validator(url, urlsList, i18nextInstance)
      .then((validUrl) => {
        watchedState.rssForm.error = null;
        watchedState.rssForm.stateForm = 'processing';
        return axios.get(getProxy(validUrl));
      })
      .then((response) => {
        const [feed, posts] = parserToXml(response.data.contents);
        const newFeed = { ...feed, id: _.uniqueId(), url };
        const newPosts = posts.map((post) => ({
          ...post,
          id: _.uniqueId(),
          feedId: newFeed.id,
        }));
        watchedState.feeds = [newFeed, ...watchedState.feeds];
        watchedState.posts = [...newPosts, ...watchedState.posts];
        watchedState.rssForm.stateForm = 'sucess';
      })
      .catch((err) => {
        watchedState.rssForm.inputValueStatus = false;
        if (err.name === 'ValidationError') {
          watchedState.rssForm.error = err.message;
        } else if (err.isParseError) {
          watchedState.rssForm.error = 'form.errors.notContainValidRss';
        } else if (axios.isAxiosError(err)) {
          watchedState.rssForm.error = 'form.errors.networkError';
        } else {
          watchedState.rssForm.error = err;
        }
        watchedState.rssForm.stateForm = 'filling';
      });

    elementsForInitFeedAndPosts.postsEl.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        const { id } = event.target.dataset;
        watchedState.uiState.visitedLinks.add(id);
      }
      if (event.target.closest('button')) {
        const { id } = event.target.dataset;
        watchedState.uiState.visitedLinks.add(id);
        watchedState.uiState.modalId = id;
      }
    });

    setTimeout(() => updatePosts(watchedState), updateInterval);
  });
};

export default app;
