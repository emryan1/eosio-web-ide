const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder

module.exports = {
    takeAction
}

async function takeAction(req, res, next) {
    const privateKey = req.body.privateKey;
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const rpc = new JsonRpc('http://localhost:8888', { fetch });
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    // Main call to blockchain after setting action, account_name and data
    try {
      const resultWithConfig = await api.transact({
        actions: [{
          account: "hokietok",
          name: req.body.action,
          authorization: [{
            actor: req.body.username,
            permission: 'active',
          }],
          data: req.body.dataValue,
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      return resultWithConfig;
    } catch (err) {
      throw(err)
    }
}
  
