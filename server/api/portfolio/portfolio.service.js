import moment from 'moment';
import json2csv from 'json2csv';
import fs from 'fs';
import Robinhood from 'robinhood';

import * as errors from '../../components/errors/baseErrors';

const RobinHoodApi = require('robinhood-api');
const robinhood = new RobinHoodApi();

import credentials from '../../config/environment/credentials.js';

class PortfolioService {
  login(username, password, reply) {
    (async () => {
      try {
        let loginResult = await robinhood.login({ username: username, password: password });
        reply.status(200).send({});
      } catch (e) {
        console.log('Oh noes! Login probably failed!', e);
        reply.status(401).send(e);
      }
    })();
  }

  mfaLogin(username, password, code, reply) {
    console.log('login code: ', code);
    (async () => {
      try {
        let loginResult = await robinhood.mfaCode({ username: username, password: password, mfa_code: code });
        reply.status(200).send(loginResult);
      } catch (e) {
        console.log('Oh noes! Login probably failed!', e);
        reply.status(401).send(e);
      }
    })();
  }

  expireToken(token, reply) {
    Robinhood({ token: token }).expire_token((error, response, body) => {
      if (error) {
        console.error(error);
        reply.status(500).send(error);

      } else {
        reply.status(200).send(body);
      }
    });
  }

  getPortfolio(token, reply) {
    Robinhood({ token: token }).accounts((error, response, body) => {
      if (error) {
        console.error(error);
        reply.status(500).send(error);
      } else {
        reply.status(200).send(body);
      }
    });
  }

  getPositions(token, reply) {
    Robinhood({ token: token }).nonzero_positions((error, response, body) => {
      if (error) {
        console.error(error);
        reply.status(500).send(error);
      } else {
        reply.status(200).send(body);
      }
    });
  }
}

module.exports.PortfolioService = new PortfolioService();