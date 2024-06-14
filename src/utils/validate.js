import * as yup from "yup";

const validate = (url, urlUniqueLinks) => {
  const schema = yup.object().shape({
    url: yup
      .string()
      .url("feedBackTexts.invalidURLError")
      .notOneOf(urlUniqueLinks, "feedBackTexts.rssExistsError")
      .required(),
  });
  return schema.validate({ url });
};

export default validate;
