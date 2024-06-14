import onChange from "on-change";

const createTitle = (container, text) => {
  const existingTitle = container.querySelector("h4");
  if (!existingTitle) {
    const title = document.createElement("h4");
    title.classList.add("lh-lg");
    title.textContent = text;
    container.prepend(title);
  }
};

export default (i18n, state, elements) => {
  const renderFormTexts = () => {
    const arrayOfElements = Object.entries(elements.staticTextElements);
    arrayOfElements.forEach(([key, value]) => {
      const element = value;
      element.textContent = i18n.t(`interfaceTexts.${key}`);
    });
  };

  const renderErrors = (watchedState) => {
    const { input, feedbackElement } = elements;
    input.classList.remove("is-invalid");
    feedbackElement.classList.remove("text-danger", "text-success");

    if (watchedState.isValid) {
      feedbackElement.textContent = i18n.t("feedBackTexts.correctURL");
      feedbackElement.classList.add("text-success");
      input.value = "";
      input.focus();
    } else {
      feedbackElement.classList.add("text-danger");
      input.classList.add("is-invalid");
      feedbackElement.textContent = i18n.t(watchedState.errors);
    }
  };

  const renderPosts = (watchedState) => {
    const { postContainer } = elements;
    createTitle(postContainer, i18n.t("posts"));

    watchedState.posts.forEach(({ title, link, id }) => {
      const divForPost = document.createElement("div");
      divForPost.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "my-3"
      );

      const post = document.createElement("a");
      post.textContent = title;
      post.setAttribute("href", link);
      post.setAttribute("id", id);
      post.setAttribute("target", "_blank");
      post.classList.add("fw-bold");
      divForPost.append(post);

      const previewButton = document.createElement("button");
      previewButton.setAttribute("type", "button");
      previewButton.setAttribute("class", "btn btn-outline-primary btn-sm");
      previewButton.dataset.bsToggle = "modal";
      previewButton.dataset.bsTarget = "#modal";
      previewButton.dataset.postId = id;
      previewButton.textContent = i18n.t("interfaceTexts.previewButton");
      divForPost.append(previewButton);

      postContainer.append(divForPost);
    });
  };

  const renderModal = (watchedState) => {
    const activePost = watchedState.posts.find(
      (post) => post.id === watchedState.uiState.activePostId
    );

    const { title, link, description } = activePost;

    const { modalTitle, modalBody, readMoreButton, modalCloseButton } =
      elements.modalElements;

    modalTitle.textContent = title;
    modalBody.textContent = description;
    readMoreButton.textContent = i18n.t("interfaceTexts.readButton");
    readMoreButton.href = link;
    modalCloseButton.textContent = i18n.t("interfaceTexts.closeButton");
  };

  const renderFeeds = (watchedState) => {
    const { feedContainer } = elements;
    createTitle(feedContainer, i18n.t("feeds"));

    watchedState.feeds.forEach(({ title, description }) => {
      const divForFeed = document.createElement("div");
      const feedTitle = document.createElement("h6");
      feedTitle.textContent = title;
      const feedDescription = document.createElement("p");
      feedDescription.classList.add("text-secondary");
      feedDescription.textContent = description;
      divForFeed.append(feedTitle, feedDescription);
      feedContainer.append(divForFeed);
    });
  };

  const renderTouchedPosts = (watchedState) => {
    watchedState.uiState.touchedPosts.forEach((postId) => {
      const post = document.getElementById(postId);

      if (!post.classList.contains("fw-normal")) {
        post.classList.remove("fw-bold");
        post.classList.add("fw-normal", "link-secondary");
      }
    });
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case "errors":
        renderErrors(watchedState);
        break;
      case "isValid":
        renderErrors(watchedState);
        break;
      case "posts":
        renderPosts(watchedState);
        break;
      case "feeds":
        renderFeeds(watchedState);
        break;
      case "uiState.touchedPosts":
        renderTouchedPosts(watchedState);
        break;
      case "uiState.activePostId":
        renderModal(watchedState);
        break;
      case "urlUniqueLinks":
        break;
      default:
        throw new Error(`Unknown path: ${path}!`);
    }
  });

  renderFormTexts();
  return watchedState;
};
