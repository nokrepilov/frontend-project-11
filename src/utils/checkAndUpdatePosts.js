import axios from "axios";
import { uniqueId } from "lodash";
import createURL from "./createURL.js";
import parseData from "./parser.js";

const checkAndUpdatePosts = (watchedState) => {
  const postPromises = watchedState.urlUniqueLinks.map((link) =>
    axios
      .get(createURL(link))
      .then((response) => {
        const responseData = response.data.contents;
        const { posts } = parseData(responseData);

        posts.forEach((post) => {
          const isDuplicate = watchedState.posts.some(
            (loadedPost) => loadedPost.title === post.title
          );
          if (!isDuplicate) {
            watchedState.posts.push({ ...post, id: uniqueId() });
          }
        });
      })
      .catch((error) => {
        throw error;
      })
  );

  Promise.all(postPromises).finally(() => {
    setTimeout(() => checkAndUpdatePosts(watchedState), 5000);
  });
};

export default checkAndUpdatePosts;
