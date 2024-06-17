import * as yup from "yup";

export default (url, urlsList, i18nextInstance) => {
  yup.setLocale({
    string: {
      url: i18nextInstance.t("form.errors.notValidUrl"),
    },
    mixed: {
      required: i18nextInstance.t("form.errors.notBeEmpty"),
      notOneOf: i18nextInstance.t("form.errors.urlAlreadyExists"),
    },
  });

  const schema = yup.string().required().url().notOneOf(urlsList);

  return schema.validate(url);
};
