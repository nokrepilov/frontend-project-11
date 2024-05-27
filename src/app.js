import i18next from "i18next";

const yup = require("yup");

// Схема для валидации данных формы
const rssFeedSchema = yup.object().shape({
  url: yup.string().url().required(),
});

// Список уже добавленных URL-ов фидов
let addedFeeds = [];

// Функция для проверки уникальности URL-а
const isUniqueUrl = (url) => {
  return !addedFeeds.includes(url);
};

// Функция для добавления нового фида
const addNewFeed = async (formData) => {
  try {
    await rssFeedSchema.validate(formData);

    if (!isUniqueUrl(formData.url)) {
      throw new Error("Этот URL уже добавлен");
    }

    // Добавление нового фида
    addedFeeds.push(formData.url);

    // Сброс формы к начальному состоянию
    resetForm();
  } catch (error) {
    console.error(error.message);
  }
};

// Функция для сброса формы
const resetForm = () => {
  // Очистка инпута и установка фокуса
  document.getElementById("rss-input").value = "";
  document.getElementById("rss-input").focus();
};
