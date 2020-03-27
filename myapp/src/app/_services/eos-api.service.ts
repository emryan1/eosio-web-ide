import { Injectable } from '@angular/core';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

@Injectable({
  providedIn: 'root'
})
export class EosApiService {

  constructor() { }

  async takeAction(action, dataValue) {
    const privateKey = localStorage.getItem("cardgame_key");
    const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    // Main call to blockchain after setting action, account_name and data
    try {
      const resultWithConfig = await api.transact({
        actions: [{
          account: process.env.REACT_APP_EOS_CONTRACT_NAME,
          name: action,
          authorization: [{
            actor: localStorage.getItem("cardgame_account"),
            permission: 'active',
          }],
          data: dataValue,
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
}
