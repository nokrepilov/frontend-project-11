const parserToXml = (response) => {
  const parser = new DOMParser();
  const docXtml = parser.parseFromString(response, 'text/xml');
  const parsererror = docXtml.querySelector('parsererror');
  if (parsererror) {
    const errorParsing = new Error(parsererror.textContent);
    errorParsing.isParseError = true;
    throw errorParsing;
  }

  const feed = {
    title: docXtml.querySelector('channel title').textContent,
    description: docXtml.querySelector('channel description').textContent,
  };

  const posts = Array.from(docXtml.querySelectorAll('item')).map((item) => {
    const newPost = {
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
    return newPost;
  });

  return [feed, posts];
};

export default parserToXml;
