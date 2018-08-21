// Generated by CoffeeScript 2.3.0

/**
 * Sets the first account as defaultAccount
 * @return {Promise} .then(()->)
 */
var ERC20, Web3, getDefaultAccount, web3;

import BigNumber from "bignumber.js";

// Import web3
Web3 = require('web3');

web3 = window.web3;

if (typeof web3 !== "undefined") {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/m7Pdc77PjIwgmp7t0iKI"));
}

export var ETH_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export var NET_ID = 4; // Rinkeby

getDefaultAccount = async function() {
  return web3.eth.defaultAccount = ((await web3.eth.getAccounts()))[0];
};

ERC20 = function(_tokenAddr) {
  var erc20ABI;
  erc20ABI = require("./abi/ERC20.json");
  return new web3.eth.Contract(erc20ABI, _tokenAddr);
};

/**
 * Constructs an abstraction of Betoken contracts
 * @param {String} _address the GroupFund contract's address
 */
export var Betoken = function(_address) {
  var self;
  self = this;
  self.contracts = {
    betokenFund: null,
    controlToken: null,
    shareToken: null,
    tokenFactory: null,
    kyberNetwork: null
  };
  self.addrs = {
    betokenFund: null,
    controlToken: null,
    shareToken: null,
    tokenFactory: null,
    kyberNetwork: null
  };
  /*
  Getters
  */
  /**
   * Gets a primitive variable in GroupFund
   * @param  {String} _varName the name of the primitive variable
   * @return {Promise}          .then((_value)->)
   */
  self.getPrimitiveVar = function(_varName) {
    return self.contracts.betokenFund.methods[_varName]().call();
  };
  /**
   * Calls a mapping or an array in GroupFund
   * @param  {String} _name name of the mapping/array
   * @param  {Any} _input       the input
   * @return {Promise}              .then((_value)->)
   */
  self.getMappingOrArrayItem = function(_name, _input) {
    return self.contracts.betokenFund.methods[_name](_input).call();
  };
  /**
   * Calls a double mapping in GroupFund
   * @param  {String} _mappingName name of the mapping
   * @param  {Any} _input1      the first input
   * @param  {Any} _input2      the second input
   * @return {Promise}              .then((_value)->)
   */
  self.getDoubleMapping = function(_mappingName, _input1, _input2) {
    return self.contracts.betokenFund.methods[_mappingName](_input1, _input2).call();
  };
  self.getTokenSymbol = function(_tokenAddr) {
    _tokenAddr = web3.utils.toHex(_tokenAddr);
    if (_tokenAddr === ETH_TOKEN_ADDRESS) {
      return Promise.resolve().then(function() {
        return "ETH";
      });
    }
    return ERC20(_tokenAddr).methods.symbol().call();
  };
  self.getTokenDecimals = function(_tokenAddr) {
    _tokenAddr = web3.utils.toHex(_tokenAddr);
    if (_tokenAddr === ETH_TOKEN_ADDRESS) {
      return Promise.resolve().then(function() {
        return 18;
      });
    }
    return ERC20(_tokenAddr).methods.decimals().call();
  };
  // Uses TestTokenFactory to obtain a token's address from its symbol
  self.tokenSymbolToAddress = function(_symbol) {
    var symbolHash;
    symbolHash = web3.utils.soliditySha3(_symbol);
    return self.contracts.tokenFactory.methods.createdTokens(symbolHash).call();
  };
  self.getTokenPrice = async function(_symbol) {
    var addr;
    addr = (await self.tokenSymbolToAddress(_symbol));
    return self.contracts.kyberNetwork.methods.priceInDAI(addr).call();
  };
  /**
   * Gets the Kairo balance of an address
   * @param  {String} _address the address whose balance we're getting
   * @return {Promise}          .then((_value)->)
   */
  self.getKairoBalance = function(_address) {
    return self.contracts.controlToken.methods.balanceOf(_address).call();
  };
  self.getKairoTotalSupply = function() {
    return self.contracts.controlToken.methods.totalSupply().call();
  };
  /**
   * Gets the Share balance of an address
   * @param  {String} _address the address whose balance we're getting
   * @return {Promise}          .then((_value)->)
   */
  self.getShareBalance = function(_address) {
    return self.contracts.shareToken.methods.balanceOf(_address).call();
  };
  self.getShareTotalSupply = function() {
    return self.contracts.shareToken.methods.totalSupply().call();
  };
  /*
    Phase handlers
  */
  /**
   * Ends the current phase
   * @return {Promise} .then(()->)
   */
  self.nextPhase = async function(_onTxHash, _onReceipt) {
    await getDefaultAccount();
    return self.contracts.betokenFund.methods.nextPhase().send({
      from: web3.eth.defaultAccount
    }).on("transactionHash", _onTxHash).on("receipt", _onReceipt);
  };
  /*
  ChangeMakingTime functions
  */
  /**
   * Allows user to deposit into the fund
   * @param  {String} _tokenAddr the token address
   * @param  {BigNumber} _tokenAmount the deposit token amount
   * @return {Promise}               .then(()->)
   */
  self.depositToken = async function(_tokenAddr, _tokenAmount, _onTxHash, _onReceipt) {
    var amount, token;
    await getDefaultAccount();
    token = ERC20(_tokenAddr);
    amount = BigNumber(_tokenAmount).mul(BigNumber(10).toPower((await self.getTokenDecimals(_tokenAddr))));
    await token.methods.approve(self.addrs.betokenFund, amount).send({
      from: web3.eth.defaultAccount
    }).on("transactionHash", _onTxHash).on("receipt", _onReceipt);
    return self.contracts.betokenFund.methods.depositToken(_tokenAddr, amount).send({
      from: web3.eth.defaultAccount
    }).on("transactionHash", _onTxHash).on("receipt", _onReceipt);
  };
  /**
   * Allows user to withdraw from fund balance
   * @param  {String} _tokenAddr the token address
   * @param  {BigNumber} _amountInDAI the withdrawal amount in DAI
   * @return {Promise}               .then(()->)
   */
  self.withdrawToken = async function(_tokenAddr, _amountInDAI, _onTxHash, _onReceipt) {
    var amount;
    await getDefaultAccount();
    amount = BigNumber(_amountInDAI).mul(1e18);
    return self.contracts.betokenFund.methods.withdrawToken(_tokenAddr, amount).send({
      from: web3.eth.defaultAccount
    }).on("transactionHash", _onTxHash).on("receipt", _onReceipt);
  };
  /**
   * Withdraws all of user's balance in cases of emergency
   * @return {Promise}           .then(()->)
   */
  self.emergencyWithdraw = async function(_onTxHash, _onReceipt) {
    await getDefaultAccount();
    return self.contracts.betokenFund.methods.emergencyWithdraw().send({
      from: web3.eth.defaultAccount
    }).on("transactionHash", _onTxHash).on("receipt", _onReceipt);
  };
  /**
   * Sends Kairo to another address
   * @param  {String} _to           the recipient address
   * @param  {BigNumber} _amountInWeis the amount
   * @return {Promise}               .then(()->)
   */
  self.sendKairo = async function(_to, _amountInWeis, _onTxHash, _onReceipt) {
    await getDefaultAccount();
    return self.contracts.controlToken.methods.transfer(_to, _amountInWeis).send({
      from: web3.eth.defaultAccount
    }).on("transactionHash", _onTxHash).on("receipt", _onReceipt);
  };
  /**
   * Sends Shares to another address
   * @param  {String} _to           the recipient address
   * @param  {BigNumber} _amountInWeis the amount
   * @return {Promise}               .then(()->)
   */
  self.sendShares = async function(_to, _amountInWeis, _onTxHash, _onReceipt) {
    await getDefaultAccount();
    return self.contracts.shareToken.methods.transfer(_to, _amountInWeis).send({
      from: web3.eth.defaultAccount
    }).on("transactionHash", _onTxHash).on("receipt", _onReceipt);
  };
  /*
  ProposalMakingTime functions
  */
  /**
   * Gets the array of investments
   * @return {Promise} .then((investments) ->)
   */
  self.getInvestments = function(_userAddress) {
    var array;
    array = [];
    return self.contracts.betokenFund.methods.investmentsCount(_userAddress).call().then(function(_count) {
      var count, getAllItems, getItem, id;
      count = +_count;
      if (count === 0) {
        return [];
      }
      array = new Array(count);
      getItem = function(id) {
        return self.contracts.betokenFund.methods.userInvestments(_userAddress, id).call().then(function(_item) {
          return new Promise(function(fullfill, reject) {
            if (typeof _item !== null) {
              array[id] = _item;
              fullfill();
            } else {
              reject();
            }
          });
        });
      };
      getAllItems = (function() {
        var i, ref, results;
        results = [];
        for (id = i = 0, ref = count - 1; (0 <= ref ? i <= ref : i >= ref); id = 0 <= ref ? ++i : --i) {
          results.push(getItem(id));
        }
        return results;
      })();
      return Promise.all(getAllItems);
    }).then(function() {
      return array;
    });
  };
  /**
   * Creates proposal
   * @param  {String} _tokenAddress the token address
   * @param  {BigNumber} _stakeInWeis the investment amount
   * @return {Promise}               .then(()->)
   */
  self.createInvestment = async function(_tokenAddress, _stakeInWeis, _onTxHash, _onReceipt) {
    await getDefaultAccount();
    return self.contracts.betokenFund.methods.createInvestment(_tokenAddress, _stakeInWeis).send({
      from: web3.eth.defaultAccount
    }).on("transactionHash", _onTxHash).on("receipt", _onReceipt);
  };
  self.sellAsset = async function(_proposalId, _onTxHash, _onReceipt) {
    await getDefaultAccount();
    return self.contracts.betokenFund.methods.sellInvestmentAsset(_proposalId).send({
      from: web3.eth.defaultAccount
    }).on("transactionHash", _onTxHash).on("receipt", _onReceipt);
  };
  /*
  Finalized Phase functions
  */
  self.redeemCommission = async function(_onTxHash, _onReceipt) {
    await getDefaultAccount();
    return self.contracts.betokenFund.methods.redeemCommission().send({
      from: web3.eth.defaultAccount
    }).on("transactionHash", _onTxHash).on("receipt", _onReceipt);
  };
  self.redeemCommissionInShares = async function(_onTxHash, _onReceipt) {
    await getDefaultAccount();
    return self.contracts.betokenFund.methods.redeemCommissionInShares().send({
      from: web3.eth.defaultAccount
    }).on("transactionHash", _onTxHash).on("receipt", _onReceipt);
  };
  /*
  Object Initialization
  */
  self.init = async function() {
    var betokenFundABI, minimeABI, netID;
    netID = (await web3.eth.net.getId());
    if (netID !== NET_ID) {
      web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/3057a4979e92452bae6afaabed67a724"));
    }
    // Initialize BetokenFund contract
    self.addrs.betokenFund = _address;
    betokenFundABI = require("./abi/BetokenFund.json");
    self.contracts.betokenFund = new web3.eth.Contract(betokenFundABI, self.addrs.betokenFund);
    // Get token addresses
    minimeABI = require("./abi/MiniMeToken.json");
    return Promise.all([
      self.contracts.betokenFund.methods.controlTokenAddr().call().then(function(_addr) {
        // Initialize ControlToken contract
        self.addrs.controlToken = _addr;
        return self.contracts.controlToken = new web3.eth.Contract(minimeABI,
      _addr);
      }),
      self.contracts.betokenFund.methods.shareTokenAddr().call().then(function(_addr) {
        // Initialize ShareToken contract
        self.addrs.shareToken = _addr;
        return self.contracts.shareToken = new web3.eth.Contract(minimeABI,
      _addr);
      }),
      self.contracts.betokenFund.methods.tokenFactoryAddr().call().then(function(_addr) {
        var factoryABI;
        // Initialize TestTokenFactory contract
        self.addrs.tokenFactory = _addr;
        factoryABI = require("./abi/TestTokenFactory.json");
        return self.contracts.tokenFactory = new web3.eth.Contract(factoryABI,
      _addr);
      }),
      self.contracts.betokenFund.methods.kyberAddr().call().then(function(_addr) {
        var knABI;
        // Initialize TestKyberNetwork contract
        self.addrs.kyberNetwork = _addr;
        knABI = require("./abi/TestKyberNetwork.json");
        return self.contracts.kyberNetwork = new web3.eth.Contract(knABI,
      _addr);
      })
    ]);
  };
  return self;
};
