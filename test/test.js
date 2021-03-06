'use strict';
var {TrustCommand, MessagePayload, TransactionPayload} = require('../dist/index');
var { TrustError } = require('../dist/index');
var TrustWallet = require('../dist/index').default;

var TestCallbackScheme = 'trust-rn-example://';
var ToAddress = '0xE47494379c1d48ee73454C251A6395FDd4F9eb43';

describe('TrustWallet tests', () => {
  var wallet = new TrustWallet('test://');
  test('constructor()', () => {
    expect(wallet.callbackScheme).toBe('test://');
  });

  test('cleanup()', () => {
    var wallet = new TrustWallet('test://');
    // wallet.signMessage(new MessagePayload('hi testers'));
    // expect(wallet.resolvers).not.toEqual({});
    wallet.cleanup();
    expect(wallet.resolvers).toEqual({});
  });

  test('installed()', () => {
    return wallet.installed().then(result => {
      expect(result).toEqual(true);
      expect(TrustError.toString(TrustError.notInstalled).length).toBeGreaterThan(0);
    });
  });

  test('signMessage()', () => {
    var payload = new MessagePayload('hello trust');
    payload.id = 'sign_msg_test';
    setTimeout(() => {
      wallet.handleOpenURL({
          url: 'test://sign-message?id=sign_msg_test&result=XkKQfY3KAYXgQdBhEUaegGhQagNYxIT8XCcr3CJnzNJPNYKlh0LP9vemwXTV+qD3ZFExEzjptmpAajp4q8f9Yxs%3D'
      });
    }, 10);
    return wallet.signMessage(payload).then(result => {
      expect(result).toEqual('5e42907d8dca0185e041d06111469e8068506a0358c484fc5c272bdc2267ccd24f3582a58742cff6f7a6c174d5faa0f76451311338e9b66a406a3a78abc7fd631b');
    });
  })

  test('signPersonalMessage()', () => {
    var payload = new MessagePayload('hello trust');
    payload.id = 'sign_personal_msg_test';
    setTimeout(() => {
      wallet.handleOpenURL({
          url: 'test://sign-personal-message?id=sign_personal_msg_test&result=XkKQfY3KAYXgQdBhEUaegGhQagNYxIT8XCcr3CJnzNJPNYKlh0LP9vemwXTV+qD3ZFExEzjptmpAajp4q8f9Yxs%3D'
      });
    }, 10);
    return wallet.signPersonalMessage(payload).then(result => {
      expect(result).toEqual('5e42907d8dca0185e041d06111469e8068506a0358c484fc5c272bdc2267ccd24f3582a58742cff6f7a6c174d5faa0f76451311338e9b66a406a3a78abc7fd631b');
    });
  });

  test('signTransaction()', () => {
    var payload = new TransactionPayload(ToAddress, '1');
    payload.id = 'sign_tx_test';
    setTimeout(() => {
      wallet.handleOpenURL({
          url: 'test://sign-transaction?id=sign_tx_test&result=+HqAhDuaygCCUgiU5HSUN5wdSO5zRUwlGmOV/dT560MBlo+DQicAAAAAAAAAAAAAAAAAAAAAUiSB6qAEZLRc+TkIfbo5mPqsXEYBY+62m5AK8OuKz0z63hQg8aA4VF1NOW3edsGon0Sucr0G5AHxG3ddGz+PUgnD1ELqgA%3D%3D'
      });
    }, 10);
    return wallet.signTransaction(payload).then(result => {
      expect(result).toEqual('f87a80843b9aca0082520894e47494379c1d48ee73454c251a6395fdd4f9eb4301968f83422700000000000000000000000000000000522481eaa00464b45cf939087dba3998faac5c460163eeb69b900af0eb8acf4cfade1420f1a038545d4d396dde76c1a89f44ae72bd06e401f11b775d1b3f8f5209c3d442ea80');
    });
  })
});

describe('TrustCommand tests', () => {
  describe('TrustCommand enums', () => {
    test('.signMessage should equal to sign-message', () => {
      expect(TrustCommand.signMessage).toBe('sign-message');
    });

    test('.signPersonalMessage should equal to sign-personal-message', () => {
      expect(TrustCommand.signPersonalMessage).toBe('sign-personal-message');
    });

    test('.signTransaction should equal to sign-transaction', () => {
      expect(TrustCommand.signTransaction).toBe('sign-transaction');
    });
  });

  describe('Test TrustCommand.getURL()', () => {
    test('get url for .signMessage', () => {
      var payload = new MessagePayload('hey trust', '', TestCallbackScheme);
      payload.id = 'msg';
      var url = TrustCommand.getURL(payload);
      expect(url).toBe(
        'trust://sign-message?message=aGV5IHRydXN0&callback=trust-rn-example%3A%2F%2Fsign-message%3Fid%3Dmsg'
      );
    });

    test('get url for .signPersonalMessage', () => {
      var payload = new MessagePayload('hey trust', '', TestCallbackScheme);
      payload.type = TrustCommand.signPersonalMessage;
      payload.id = 'msg';
      var url = TrustCommand.getURL(payload);
      expect(url).toBe(
        'trust://sign-personal-message?message=aGV5IHRydXN0&callback=trust-rn-example%3A%2F%2Fsign-personal-message%3Fid%3Dmsg'
      );
    });

    test('get url for .signTransaction', () => {
      var payload = new TransactionPayload(ToAddress, '1', '8f834227000000000000000000000000000000005224');
      payload.id = 'tx';
      payload.callbackScheme = TestCallbackScheme;
      var url = TrustCommand.getURL(payload);
      expect(url).toBe(
        'trust://sign-transaction?to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1&gasPrice=21&gasLimit=21000&data=8f834227000000000000000000000000000000005224&nonce=0&callback=trust-rn-example%3A%2F%2Fsign-transaction%3Fid%3Dtx'
      );
    });
  });

  describe('Test TrustCommand.parseResult()', () => {
    test('parse result for .signMessage', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-message?id=msg_1527509558565&result=XkKQfY3KAYXgQdBhEUaegGhQagNYxIT8XCcr3CJnzNJPNYKlh0LP9vemwXTV+qD3ZFExEzjptmpAajp4q8f9Yxs%3D');
      expect(result.id).toBe('msg_1527509558565');
      expect(result.result).toBe(
        '5e42907d8dca0185e041d06111469e8068506a0358c484fc5c272bdc2267ccd24f3582a58742cff6f7a6c174d5faa0f76451311338e9b66a406a3a78abc7fd631b'
      );
    });

    test('parse result for .signPersonalMessage', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-personal-message?id=msg_1527509558565&result=XkKQfY3KAYXgQdBhEUaegGhQagNYxIT8XCcr3CJnzNJPNYKlh0LP9vemwXTV+qD3ZFExEzjptmpAajp4q8f9Yxs%3D');
      expect(result.id).toBe('msg_1527509558565');
      expect(result.result).toBe(
        '5e42907d8dca0185e041d06111469e8068506a0358c484fc5c272bdc2267ccd24f3582a58742cff6f7a6c174d5faa0f76451311338e9b66a406a3a78abc7fd631b'
      );
    });

    test('parse result for .signTransaction', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-transaction?id=tx_1527509748703&result=+HqAhDuaygCCUgiU5HSUN5wdSO5zRUwlGmOV/dT560MBlo+DQicAAAAAAAAAAAAAAAAAAAAAUiSB6qAEZLRc+TkIfbo5mPqsXEYBY+62m5AK8OuKz0z63hQg8aA4VF1NOW3edsGon0Sucr0G5AHxG3ddGz+PUgnD1ELqgA%3D%3D');
      expect(result.id).toBe('tx_1527509748703');
      expect(result.result).toBe(
        'f87a80843b9aca0082520894e47494379c1d48ee73454c251a6395fdd4f9eb4301968f83422700000000000000000000000000000000522481eaa00464b45cf939087dba3998faac5c460163eeb69b900af0eb8acf4cfade1420f1a038545d4d396dde76c1a89f44ae72bd06e401f11b775d1b3f8f5209c3d442ea80'
      );
    });

    test('parse cancel error', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-message?id=msg_1528786624065&error=1');
      expect(result.result).toBe('');
      var code = parseInt(result.error);
      expect(code).toBe(TrustError.cancelled);
      expect(TrustError.toString(code).length).toBeGreaterThan(0);
    });

    test('parse watch only error', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-message?id=msg_1528786624065&error=3');
      expect(result.result).toBe('');
      var code = parseInt(result.error);
      expect(code).toBe(TrustError.watchOnly);
      expect(TrustError.toString(code).length).toBeGreaterThan(0);
    });

    test('parse invalid request error', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-message?id=msg_1528786624065&error=2');
      expect(result.result).toBe('');
      var code = parseInt(result.error);
      expect(code).toBe(TrustError.invalidRequest);
      expect(TrustError.toString(code).length).toBeGreaterThan(0);
    });

    test('parse no error', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-message?id=msg_1528786624065&error=0');
      expect(result.result).toBe('');
      var code = parseInt(result.error);
      expect(code).toBe(TrustError.none);
      expect(TrustError.toString(code).length).toBeGreaterThan(0);
    });

    test('parse no error 2', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-message?id=msg_1528786624065');
      expect(result.result).toBe('');
      var code = parseInt(result.error);
      expect(code).toBe(TrustError.none);
      expect(TrustError.toString(code).length).toBeGreaterThan(0);
    });

    test('parse unknown error', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-message?id=msg_1528786624065&error=-1');
      expect(result.result).toBe('');
      var code = parseInt(result.error);
      expect(code).toBe(TrustError.unknown);
      expect(TrustError.toString(code).length).toBeGreaterThan(0);
    });

    test('parse unknown error 2', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-message?id=msg_1528786624065&error=1234');
      var code = parseInt(result.error);
      expect(TrustError.toString(code).length).toBe(0);
    });
  });
});

describe('Payload tests', () => {

  var timestamp = 1527496572770;
  describe('Test MessagePayload.toQuery()', () => {
    var message_id = 'msg_' + timestamp;
    test('message is empty ', () => {
      var msgPayload = new MessagePayload('', undefined, undefined);
      expect(msgPayload.toQuery()).toBe('message=');
    });
    test('message is hello trust ', () => {
      var msgPayload = new MessagePayload('hello trust', undefined, undefined);
      expect(msgPayload.toQuery()).toBe('message=aGVsbG8gdHJ1c3Q%3D');
    });
    test('message + address', () => {
      var msgPayload = new MessagePayload('hello trust', ToAddress, undefined);
      msgPayload.id = message_id;
      expect(msgPayload.toQuery()).toBe(
        'message=aGVsbG8gdHJ1c3Q%3D&address=0xE47494379c1d48ee73454C251A6395FDd4F9eb43'
      );
    });
    test('message + callback scheme', () => {
      var msgPayload = new MessagePayload('hello trust', undefined, TestCallbackScheme);
      msgPayload.id = message_id;
      expect(msgPayload.toQuery()).toBe(
        'message=aGVsbG8gdHJ1c3Q%3D&callback=trust-rn-example%3A%2F%2Fsign-message%3Fid%3Dmsg_1527496572770'
      );
    });
    test('message + address + callback scheme', () => {
      var msgPayload = new MessagePayload('hello trust', ToAddress, TestCallbackScheme);
      msgPayload.id = 'msg_' + timestamp;
      expect(msgPayload.toQuery()).toBe(
        'message=aGVsbG8gdHJ1c3Q%3D&address=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&callback=trust-rn-example%3A%2F%2Fsign-message%3Fid%3Dmsg_1527496572770'
      );
    });
  });

  describe('Test TransactionPayload.toQuery()', () => {
    var tx_id = 'tx_' + timestamp;
    var amount = '1000000000000000000';
    var data = '0x8f834227000000000000000000000000000000005224';
    test('address + amount (default gas price / limit)', () => {
      var txPayload = new TransactionPayload(ToAddress, amount, undefined, undefined, undefined, undefined, undefined);
      expect(txPayload.toQuery()).toBe(
        'to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1000000000000000000&gasPrice=21&gasLimit=21000&nonce=0'
      );
    });

    test('address + amount + data + nonce (default gas price / limit)', () => {
      var txPayload = new TransactionPayload(ToAddress, amount, data, undefined, undefined, 1, undefined);
      expect(txPayload.toQuery()).toBe(
        'to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1000000000000000000&gasPrice=21&gasLimit=21000&data=0x8f834227000000000000000000000000000000005224&nonce=1'
      );
    });

    test('address + amount + callback scheme (default gas price / limit)', () => {
      var txPayload = new TransactionPayload(ToAddress, amount, undefined, undefined, undefined, undefined, TestCallbackScheme);
      txPayload.id = tx_id;
      expect(txPayload.toQuery()).toBe(
        'to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1000000000000000000&gasPrice=21&gasLimit=21000&nonce=0&callback=trust-rn-example%3A%2F%2Fsign-transaction%3Fid%3Dtx_1527496572770'
      );
    });

    test('address + amount + gasPrice + gasLimit', () => {
      var txPayload = new TransactionPayload(ToAddress, amount, undefined, '60', '45000', undefined, undefined);
      expect(txPayload.toQuery()).toBe(
        'to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1000000000000000000&gasPrice=60&gasLimit=45000&nonce=0'
      );
    });

    test(
      'address + amount + data + gasPrice + gasLimit + callback scheme )',
      () => {
        var txPayload = new TransactionPayload(ToAddress, '1', data, '45', '50000', undefined, TestCallbackScheme);
        txPayload.id = tx_id;
        expect(txPayload.toQuery()).toBe(
          'to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1&gasPrice=45&gasLimit=50000&data=0x8f834227000000000000000000000000000000005224&nonce=0&callback=trust-rn-example%3A%2F%2Fsign-transaction%3Fid%3Dtx_1527496572770'
        );
      }
    );
  });
});
