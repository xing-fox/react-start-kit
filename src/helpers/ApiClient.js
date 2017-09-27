import superagent from 'superagent';
import config from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    return 'http://' + config.apiHost + ':' + config.apiPort + '/api' + adjustedPath;
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return '/api' + adjustedPath;
}

export default class ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data, head } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        if (params) {
          request.query(params);
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (head) { // 设置头部
          Object.keys(head).map(key => {
            const value = head[key];
            request.set(key, value);
          });
        }
        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => {
          if (err) {
            return reject(body ? {
              code: body.resp_code,
              message: body.resp_msg
            } : err);
          }
          if (body.resp_code === '0000') {
            return resolve(body.resp_data);
          }
          if (body.resp_code !== '0000') {
            return reject({
              code: body.resp_code,
              message: body.resp_msg
            });
          }
        });
      }));
  }

  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {}
}
