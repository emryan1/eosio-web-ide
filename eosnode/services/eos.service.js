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

async function getTable(tableName) {
    const rpc = new JsonRpc('https://8888-b0592fe3-c866-469b-bf75-f901290a5a20.ws-us02.gitpod.io', { fetch });
    rpc.get_table_rows({
      "json": true,
      "code": "hokietokacc",   	// contract who owns the table
      "scope": "hokietokacc",  	// scope of the table
      "table": tableName,		// name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ ticketTable: result.rows }));
}

async function takeAction(req, res, next) {
    const privateKey = req.body.privateKey;
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const rpc = new JsonRpc('https://8888-b0592fe3-c866-469b-bf75-f901290a5a20.ws-us02.gitpod.io', { fetch });
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
      });
      res.json(JSON.stringify(resultWithConfig, null, 2));
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
  
