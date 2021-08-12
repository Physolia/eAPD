/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const axios = require('axios');
const tokens = require('../../../api/seeds/test/tokens.json');
const knex = require('../../../api/db/knex')

const apiUrl = process.env.API_URL || 'http://localhost:8000';
const {removeAffiliationsForUser} = require('./dbUtils')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('task', {
    'db:resetnorole': async () => {
      await removeAffiliationsForUser({
        username: 'norole'
      })
      return null;
    }
  });

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
};
