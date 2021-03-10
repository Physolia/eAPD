const logger = require('../../logger')('document routes');
const { getFile: get } = require('../../files');

const ACCOUNT_REGISTRATION_DOC = 'EUAAccountRegistration.pdf';
const SYSTEM_ACCESS_DOC = 'eAPDSystemAccess.pdf';

module.exports = (app, { getFile = get } = {}) => {
  logger.silly('setting up GET /docs/account-registration route');

  app.get('/docs/account-registration', async (req, res, next) => {
    getFile(ACCOUNT_REGISTRATION_DOC)
      .then(file => {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${ACCOUNT_REGISTRATION_DOC}`
        );
        res.send(file).end();
      })
      .catch(next);
  });

  app.get('/docs/system-access', async (req, res, next) => {
    getFile(SYSTEM_ACCESS_DOC)
      .then(file => {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${SYSTEM_ACCESS_DOC}`
        );
        res.send(file).end();
      })
      .catch(next);
  });
};
