const parseData = (data) => {
  const feeds = [];
  const posts = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/xml");

  const parsererrors = doc.querySelector("parsererror");

  if (parsererrors !== null) {
    const error = new Error();
    error.name = "ParserError";
    throw error;
  }

  const feedTitle = doc.querySelector("title").textContent;
  const feedDescription = doc.querySelector("description").textContent;
  feeds.push({ title: feedTitle, description: feedDescription });

  const items = doc.querySelectorAll("item");
  Array.from(items).forEach((item) => {
    const postTitle = item.querySelector("title").textContent;
    const postLink = item.querySelector("link").textContent;
    const postDescription = item.querySelector("description").textContent;
    posts.push({
      title: postTitle,
      link: postLink,
      description: postDescription,
    });
  });

  return { feeds, posts };
};

export default parseData;
