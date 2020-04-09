const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder

module.exports = {
    takeAction,
    getTable,
    getBalance,
    getRecord
}


const url = 'https://8888-d90c080d-b724-475b-bc51-cc5371c98765.ws-us02.gitpod.io'

async function getBalance(req, res, next) {
    const rpc = new JsonRpc(url, { fetch });
    const balance = await rpc.get_currency_balance('tokenacc', req.query.username, 'HOK')
    .then(result => res.json(result))
    .catch(err => next(err));
}
async function getTable(req, res, next) {
    const rpc = new JsonRpc(url, { fetch });
    const result = await rpc.get_table_rows({
      "json": true,
      "code": "hokietokacc",   	// contract who owns the table
      "scope": "hokietokacc",  	// scope of the table
      "table": req.query.tableName,		// name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => res.json(result))
    .catch(err => next(err));
}

async function getRecord(req, res, next) {
    const rpc = new JsonRpc(url, { fetch });
    const lower_bound = req.query.id;
    const upper_bound = (req.query.id + 1);

    const result = await rpc.get_table_rows({
      "json": true,
      "code": "hokietokacc",   	// contract who owns the table
      "scope": "hokietokacc",  	// scope of the table
      "table": req.query.tableName,		// name of the table as specified by the contract abi
      "index_position": "primary",
      "key_type": "uint64_t",
      "lower_bound": lower_bound,
      "upper_bound": upper_bound,
      "limit": 1,
    }).then(result => {
        res.json(result);
    })
    .catch(err => {
        next(err);
    });
}

async function takeAction(req, res, next) {
    const privateKey = req.body.privateKey;
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const rpc = new JsonRpc(url, { fetch });
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    // Main call to blockchain after setting action, account_name and data
    try {
      const resultWithConfig = await api.transact({
        actions: [{
          account: "hokietokacc",
          name: req.body.action,
          authorization: [{
            actor: req.body.username,
            permission: 'owner',
          }],
          data: req.body.dataValue,
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
      .then(result => res.json(JSON.stringify(result, null, 2)))
      .catch(err => next(err));
      return resultWithConfig;
    } catch (err) {
        console.log('Caught exception' + err);
        if (err instanceof RpcError) {
            console.log(JSON.stringify(err.json, null, 2));
        }
        next(err);
        throw(err);
    }
}
  
