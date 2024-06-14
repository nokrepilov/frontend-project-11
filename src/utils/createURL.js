const createURL = (link) => {
  const allOriginsProxyUrl = "https://allorigins.hexlet.app/get";
  const url = new URL(allOriginsProxyUrl);
  url.searchParams.set("url", link);
  url.searchParams.set("disableCache", "true");
  return url;
};

export default createURL;
