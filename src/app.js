import i18next from "i18next";
import axios from "axios";
import * as yup from "yup";
import { uniqueId } from "lodash";
import resources from "./locales/index.js";
import watch from "./view.js";
import parseData from "./utils/parser.js";
import validate from "./utils/validate.js";
import createURL from "./utils/createURL.js";
import checkAndUpdatePosts from "./utils/checkAndUpdatePosts.js";

export default async () => {
  const defaultLang = "ru";

  const i18n = i18next.createInstance();
  await i18n.init({
    lng: defaultLang,
    debug: false,
    resources,
  });

  yup.setLocale({
    mixed: {
      url: () => ({ key: "feedBackTexts.invalidURLError" }),
      notOneOf: () => ({ key: "feedBackTexts.rssExistsError" }),
    },
  });

  const elements = {
    staticTextElements: {
      rssAggregatorTitle: document.querySelector("h1.display-3"),
      rssAggregatorDescription: document.querySelector("p.lead"),
      rssFormPlaceholder: document.querySelector('label[for="url-input"]'),
      rssFormButton: document.querySelector('button[aria-label="add"]'),
      rssFormExample: document.querySelector("p.mt-2.mb-0.text-secondary"),
    },
    modalElements: {
      modalTitle: document.querySelector(".modal-title"),
      modalBody: document.querySelector(".modal-body"),
      readMoreButton: document.querySelector(".full-article"),
      modalCloseButton: document.querySelector(".btn-secondary"),
    },
    input: document.querySelector("input"),
    feedbackElement: document.querySelector(".feedback"),
    postContainer: document.querySelector(".posts"),
    feedContainer: document.querySelector(".feeds"),
  };

  const state = {
    errors: "",
    isValid: false,
    urlUniqueLinks: [],
    posts: [],
    feeds: [],
    uiState: {
      touchedPosts: new Set(),
      activePostId: "",
    },
  };

  const watchedState = watch(i18n, state, elements);

  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const url = formData.get("url");

    validate(url, watchedState.urlUniqueLinks)
      .then(() => axios.get(createURL(url)))
      .then((response) => {
        const responseData = response.data.contents;
        const { feeds, posts } = parseData(responseData);
        const feedsWithId = feeds.map((feed) => ({ ...feed, id: uniqueId() }));
        const postsWithId = posts.map((post) => ({ ...post, id: uniqueId() }));
        watchedState.feeds = feedsWithId;
        watchedState.posts = postsWithId;
        watchedState.isValid = true;
        watchedState.urlUniqueLinks.push(url);
        watchedState.errors = "";
      })
      .catch((error) => {
        watchedState.isValid = false;
        switch (error.name) {
          case "AxiosError":
            watchedState.errors = "feedBackTexts.networkError";
            break;
          case "ParserError":
            watchedState.errors = "feedBackTexts.invalidRSSResource";
            break;
          default:
            watchedState.errors = error.message;
            break;
        }
      });
  });

  checkAndUpdatePosts(watchedState);

  elements.postContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      const postId = e.target.id;
      watchedState.uiState.touchedPosts.add(postId);
    }
    if (e.target.tagName === "BUTTON") {
      const button = e.target;
      const { postId } = button.dataset;
      watchedState.uiState.touchedPosts.add(postId);
      watchedState.uiState.activePostId = postId;
    }
  });
};
