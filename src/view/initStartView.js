const initStartView = (elements, i18next) => {
  elements.header.textContent = i18next.t('startsView.header');
  elements.headerDescription.textContent = i18next.t(
    'startsView.headerDescription'
  );
  elements.labelForUrlInput.textContent = i18next.t(
    'startsView.labelForUrlInput'
  );
  elements.inputPlaceholder.setAttribute(
    'placeholder',
    i18next.t('startsView.inputPlaceholder')
  );
  elements.exampleLink.textContent = i18next.t('startsView.exampleLink');
  elements.rssButtonAdd.textContent = i18next.t('startsView.rssButtonAdd');
  elements.modalButtonReadFully.textContent = i18next.t(
    'startsView.modalButtonReadFully'
  );
  elements.modalButtonClose.textContent = i18next.t(
    'startsView.modalButtonClose'
  );
};
export default initStartView;
