const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder

module.exports = {
    takeAction,
    test
}
async function test(req,res,next) {
  res.json("works");
}

async function takeAction(req, res, next) {
    const privateKey = req.body.privateKey;
    console.log(req.body.privateKey);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const rpc = new JsonRpc('https://8888-b0592fe3-c866-469b-bf75-f901290a5a20.ws-us02.gitpod.io', { fetch });
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
      res.json(JSON.stringify(resultWithConfig, null, 2));
      return resultWithConfig;
    } catch (err) {
      next(err);
      throw(err);
    }
}
  
