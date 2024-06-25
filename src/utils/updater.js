import _ from 'lodash';
import axios from 'axios';
import getProxy from './proxify.js';
import parserToXml from './parser.js';

const updatePosts = (watchedState) => {
  const { feeds, posts } = watchedState;
  const promises = feeds.map(({ url, id }) => axios.get(getProxy(url))
    .then((response) => {
      const [, gottenPosts] = parserToXml(response.data.contents);
      const oldPosts = posts.filter((post) => post.feedId === id);
      const allPosts = [...gottenPosts, ...oldPosts];
      const notRepeatedPosts = _.uniqBy(allPosts, 'link');
      if (gottenPosts.length > watchedState.posts.length) {
        watchedState.posts = notRepeatedPosts;
      }
    })
    .catch(console.error));
  Promise.all(promises)
    .finally(() => setTimeout(() => updatePosts(watchedState), 5000));
};

export default updatePosts;
