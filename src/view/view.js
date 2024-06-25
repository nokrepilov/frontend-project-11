import onChange from 'on-change';

const renderFeeds = (state, elements, i18nextInstance) => {
  elements.feedsEl.innerHTML = '';
  const divEl = document.createElement('div');
  divEl.classList.add('card', 'border-0');
  elements.feedsEl.append(divEl);

  const divFeedTitle = document.createElement('div');
  divFeedTitle.classList.add('card-body');
  divEl.append(divFeedTitle);

  const h2Feed = document.createElement('h2');
  h2Feed.classList.add('card-title', 'h4');
  h2Feed.textContent = i18nextInstance.t('feeds.title');
  divFeedTitle.append(h2Feed);

  const ulFeedDescription = document.createElement('ul');
  ulFeedDescription.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach((feed) => {
    const liDescription = document.createElement('li');
    liDescription.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3Description = document.createElement('h3');
    h3Description.classList.add('h6', 'm-0');
    h3Description.textContent = feed.title;
    liDescription.append(h3Description);

    const pDescription = document.createElement('p');
    pDescription.classList.add('m-0', 'small', 'text-black-50');
    pDescription.textContent = feed.description;
    liDescription.append(pDescription);

    ulFeedDescription.append(liDescription);
  });

  divEl.append(ulFeedDescription);
};

const renderPosts = (state, elements, i18nextInstance) => {
  elements.postsEl.innerHTML = '';
  const divEl = document.createElement('div');
  divEl.classList.add('card', 'border-0');
  elements.postsEl.append(divEl);

  const divPostsTitle = document.createElement('div');
  divPostsTitle.classList.add('card-body');
  divEl.append(divPostsTitle);

  const h2El = document.createElement('h2');
  h2El.classList.add('card-title', 'h4');
  h2El.textContent = i18nextInstance.t('posts.title');
  divPostsTitle.append(h2El);

  const ulPosts = document.createElement('ul');
  ulPosts.classList.add('list-group', 'border-0', 'rounded-0');

  state.posts.forEach(({ id, title, link }) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const aEl = document.createElement('a');
    const currentClass = state.uiState.visitedLinks.has(id) ? 'fw-normal' : 'fw-bold';
    aEl.classList.add(currentClass);
    aEl.setAttribute('href', link);
    aEl.setAttribute('data-id', id);
    aEl.setAttribute('target', '_blank');
    aEl.setAttribute('rel', 'oopener noreferrer');
    aEl.textContent = title;
    liEl.append(aEl);

    const buttonEl = document.createElement('button');
    buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonEl.setAttribute('type', 'button');
    buttonEl.setAttribute('data-id', id);
    buttonEl.setAttribute('data-bs-toggle', 'modal');
    buttonEl.setAttribute('data-bs-target', '#modal');
    buttonEl.textContent = i18nextInstance.t('posts.buttonText');

    liEl.append(buttonEl);

    ulPosts.append(liEl);
  });
  divEl.append(ulPosts);
};

const renderError = (error, elements, i18nextInstance) => {
  elements.feedbackEl.textContent = '';
  if (error) {
    elements.buttonAdd.disabled = false;
    elements.feedbackEl.classList.remove('text-success');
    elements.feedbackEl.classList.add('text-danger');
    elements.feedbackEl.textContent = i18nextInstance.t(error);
  }
};

const renderModalWindow = (state, elements, modId) => {
  const post = state.posts.find(({ id }) => modId === id.toString());
  elements.modalTitle.textContent = post.title;
  elements.modalBody.textContent = post.description;
  elements.modalFooter.setAttribute('href', post.link);
};

const renderVisitedLinks = (links) => {
  const currentVisitedID = [...links.values()][links.size - 1];
  const currentLink = document.querySelector(`[data-id="${currentVisitedID}"]`);
  currentLink.classList.toggle('fw-bold');
  currentLink.classList.toggle('fw-normal');
};

const renderFeedAndPosts = (state, elements, i18nextInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'uiState.modalId':
      renderModalWindow(state, elements, value);
      break;
    case 'uiState.visitedLinks':
      renderVisitedLinks(value);
      break;
    case 'feeds':
      renderFeeds(state, elements, i18nextInstance);
      break;
    case 'posts':
      renderPosts(state, elements, i18nextInstance);
      break;
    case 'rssForm.error':
      renderError(value, elements, i18nextInstance);
      break;
    case 'rssForm.inputValueStatus':
      if (!value) {
        elements.inputEl.classList.add('is-invalid');
        return;
      }
      elements.inputEl.classList.remove('is-invalid');
      break;
    case 'rssForm.stateForm':
      if (value === 'filling') {
        elements.buttonAdd.disabled = false;
        return;
      }
      if (value === 'processing') {
        elements.buttonAdd.disabled = true;
        return;
      }
      if (value === 'sucess') {
        elements.buttonAdd.disabled = false;
        elements.form.reset();
        elements.form.focus();
        elements.feedbackEl.classList.remove('text-danger');
        elements.feedbackEl.classList.add('text-success');
        elements.feedbackEl.textContent = i18nextInstance.t('form.succesAdd');
      }
      break;
    default:
      throw new Error('Unknown path');
  }
});

export default renderFeedAndPosts;
