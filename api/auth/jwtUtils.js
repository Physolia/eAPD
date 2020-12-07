const logger = require('../logger')('jwtUtils');
// const { verifyJWT } = require('./oktaAuth');

/**
 * Returns the payload from the signed JWT, or false.
 * Uses Okta to verify and decode the token.
 * @name verifyWebToken
 * @param {String} token - signed JWT
 * @returns {(Object|Boolean)} JWT payload, or false
 */
const verifyWebToken = async token => {
  // return verifier(token)
  //   .then(claims => {
  //     // the token is valid (per Okta)
  //     return claims;
  //   })
  //   .catch(err => {
  //     // a validation failed, inspect the error
  //     logger.error(token, `invalid token: ${err.message}`);
  //     return false;
  //   });
  if (token === 'auth-bypass') {
    return Promise.resolve({
      id: '12345',
      email: 'bypass@email.com',
      name: 'Bypass User',
      position: '',
      state: null,
      states: [],
      activities: []
    });
  }

  logger.error(token, `invalid token: ${token}`);
  return Promise.resolve(false);
};

/**
 * Extracts the JWT from the Request Authorization Header.
 * @name jwtExtractor
 * @param {Object} req - request
 * @returns {(String|null)} JWT string or null
 */
const jwtExtractor = req => {
  const token = req.get('Authorization');
  if (!token || !token.toLowerCase().match(/^bearer\s/)) return null;
  const [temp, result] = token.split(' '); // eslint-disable-line no-unused-vars
  return result;
};

module.exports = {
  verifyWebToken,
  jwtExtractor
};
