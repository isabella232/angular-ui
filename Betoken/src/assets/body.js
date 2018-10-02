// Generated by CoffeeScript 2.3.0
export var BETOKEN_ADDR, DEPLOYED_BLOCK, INPUT_ERR, METAMASK_LOCKED_ERR, NO_WEB3_ERR, SEND_TX_ERR, TOKENS, WRONG_NETWORK_ERR, Web3, allowEmergencyWithdraw, assetAddressToSymbol, assetFeeRate, assetSymbolToAddress, assetSymbolToPrice, assetSymbolToPricee, avgROI, betoken, chart, checkKairoAmountError, clock, commissionRate, copyTextToClipboard, countdownDay, countdownHour, countdownMin, countdownSec, cycleNumber, cyclePhase, cycleTotalCommission, daiAddr, displayedInvestmentBalance, displayedInvestmentUnit, displayedKairoBalance, displayedKairoUnit, drawChart, errorMessage, filterTable, fundValue, hasWeb3, historicalTotalCommission, investmentList, isLoadingInvestments, isLoadingPrices, isLoadingRanking, isLoadingRecords, kairoAddr, kairoBalance, kairoRanking, kairoTotalSupply, kyberAddr, lastCommissionRedemption, loadAllData, loadDecisions, loadDynamicData, loadFundData, loadFundMetadata, loadRanking, loadStats, loadTokenPrices, loadUserData, networkName, networkPrefix, newInvestmentSelectedToken, paused, phaseLengths, prevCommission, prevROI, sharesAddr, sharesBalance, sharesTotalSupply, showCountdown, showError, showSuccess, showTransaction, startTimeOfCyclePhase, successMessage, tokenAddresses, tokenFactoryAddr, tokenPrices, totalFunds, transactionHash, transactionHistory, userAddress, web3, wrongNetwork, loadTxHistory, transaction_history ;
export var receivedROICount;
export var transcationID;
export var managerROI;
export var network_prefix;
export var ROIArray;

import "tablesort";

import {
    Betoken,
    ETH_TOKEN_ADDRESS,
    NET_ID
} from "./objects/betoken.js";

import Chart from "chart.js";

import BigNumber from "bignumber.js";

import ReactiveVar from "meteor-standalone-reactive-var";
import { catchError } from "rxjs/operators";

TOKENS = require("./objects/kn_token_symbols.json");

WRONG_NETWORK_ERR = "Please switch to Rinkeby Testnet in order to use Betoken Omen. You can currently view the fund's data, but cannot make any interactions.";

SEND_TX_ERR = "There was an error during sending your transaction to the Ethereum blockchain. Please check that your inputs are valid and try again later.";

INPUT_ERR = "There was an error in your input. Please fix it and try again.";

NO_WEB3_ERR = "Betoken can only be used in a Web3 enabled browser. Please install <a target=\"_blank\" href=\"https://metamask.io/\">MetaMask</a> or switch to another browser that supports Web3. You can currently view the fund's data, but cannot make any interactions.";

METAMASK_LOCKED_ERR = "Your browser seems to be Web3 enabled, but you need to unlock your account to interact with Betoken.";

// Import web3
Web3 = require("web3");

web3 = window.web3;

hasWeb3 = false;

if (web3 != null) {
    web3 = new Web3(web3.currentProvider);
    hasWeb3 = true;
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/3057a4979e92452bae6afaabed67a724"));
}

// Fund object
BETOKEN_ADDR = "0x5910d5abd4d5fd58b39957664cd9735cbfe42bf0";

DEPLOYED_BLOCK = 2721413;

betoken = new Betoken(BETOKEN_ADDR);

// Session data
userAddress = new ReactiveVar("0x0");

kairoBalance = new ReactiveVar(BigNumber(0));

kairoTotalSupply = new ReactiveVar(BigNumber(0));

sharesBalance = new ReactiveVar(BigNumber(0));

sharesTotalSupply = new ReactiveVar(BigNumber(0));

cyclePhase = new ReactiveVar(0);

startTimeOfCyclePhase = new ReactiveVar(0);

phaseLengths = new ReactiveVar([]);

totalFunds = new ReactiveVar(BigNumber(0));

investmentList = new ReactiveVar([]);

cycleNumber = new ReactiveVar(0);

commissionRate = new ReactiveVar(BigNumber(0));

assetFeeRate = new ReactiveVar(BigNumber(0));

paused = new ReactiveVar(false);

allowEmergencyWithdraw = new ReactiveVar(false);

lastCommissionRedemption = new ReactiveVar(0);

cycleTotalCommission = new ReactiveVar(BigNumber(0));

// Displayed variables
kairoAddr = new ReactiveVar("");

sharesAddr = new ReactiveVar("");

kyberAddr = new ReactiveVar("");

daiAddr = new ReactiveVar("");

tokenFactoryAddr = new ReactiveVar("");

displayedInvestmentBalance = new ReactiveVar(BigNumber(0));

displayedInvestmentUnit = new ReactiveVar("DAI");

displayedKairoBalance = new ReactiveVar(BigNumber(0));

displayedKairoUnit = new ReactiveVar("KRO");

countdownDay = new ReactiveVar(0);

countdownHour = new ReactiveVar(0);

countdownMin = new ReactiveVar(0);

countdownSec = new ReactiveVar(0);

showCountdown = new ReactiveVar(true);

transactionHash = new ReactiveVar("");

networkName = new ReactiveVar("");

networkPrefix = new ReactiveVar("");

chart = null;

prevROI = new ReactiveVar(BigNumber(0));

avgROI = new ReactiveVar(BigNumber(0));

prevCommission = new ReactiveVar(BigNumber(0));

historicalTotalCommission = new ReactiveVar(BigNumber(0));

managerROI = new ReactiveVar(BigNumber(0));

transactionHistory = new ReactiveVar([]);

errorMessage = new ReactiveVar("");

successMessage = new ReactiveVar("");

kairoRanking = new ReactiveVar([]);

wrongNetwork = new ReactiveVar(false);

isLoadingRanking = new ReactiveVar(true);

isLoadingInvestments = new ReactiveVar(true);

isLoadingRecords = new ReactiveVar(true);

isLoadingPrices = new ReactiveVar(true);

tokenPrices = new ReactiveVar([]);

tokenAddresses = new ReactiveVar([]);

fundValue = new ReactiveVar(BigNumber(0));

newInvestmentSelectedToken = new ReactiveVar(TOKENS[0]);

ROIArray = new ReactiveVar([]);


showTransaction = function(_txHash) {
    transactionHash.set(_txHash);
    alert(transactionHash.get());
    transcationID = transactionHash.get();
};


showError = function(_msg) {
    errorMessage.set(_msg);
    alert(errorMessage.get());
};

showSuccess = function(_msg) {
    successMessage.set(_msg);
    alert(successMessage.get());
};

copyTextToClipboard = function(text) {
    var err, successful, textArea;
    textArea = document.createElement("textarea");
    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;
    // Clean up any borders.
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = "transparent";
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        successful = document.execCommand("copy");
        if (successful) {
            showSuccess(`Copied ${text} to clipboard`);
        } else {
            showError("Oops, unable to copy");
        }
    } catch (error1) {
        err = error1;
        showError("Oops, unable to copy");
    }
    document.body.removeChild(textArea);
};

clock = function() {
    return setInterval(function() {
        var days, distance, hours, minutes, now, seconds, target;
        now = Math.floor(new Date().getTime() / 1000);
        target = startTimeOfCyclePhase.get() + phaseLengths.get()[cyclePhase.get()];
        distance = target - now;
        if (distance > 0) {
            showCountdown.set(true);
            days = Math.floor(distance / (60 * 60 * 24));
            hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
            minutes = Math.floor((distance % (60 * 60)) / 60);
            seconds = Math.floor(distance % 60);
            countdownDay.set(days);
            countdownHour.set(hours);
            countdownMin.set(minutes);
            return countdownSec.set(seconds);
        } else {
            return showCountdown.set(false);
        }
    }, 1000);
};

drawChart = function() {
    return chart = new Chart($("#ROIChart"), {
        type: "line",
        data: {
            datasets: [
                {
                    label: "ROI Per Cycle",
                    backgroundColor: "#b9eee1",
                    borderColor: "#1fdaa6",
                    data: []
                }
            ]
        },
        options: {
            scales: {
                xAxes: [
                    {
                        type: "linear",
                        position: "bottom",
                        scaleLabel: {
                            display: true,
                            labelString: "Investment Cycle"
                        },
                        ticks: {
                            stepSize: 1
                        },
                        gridLines: {
                            display: false
                        }
                    }
                ],
                yAxes: [
                    {
                        type: "linear",
                        position: "left",
                        scaleLabel: {
                            display: true,
                            labelString: "Percent"
                        },
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: false
                        }
                    }
                ]
            }
        }
    });
};

assetSymbolToPrice = function(_symbol) {
    return tokenPrices.get()[TOKENS.indexOf(_symbol)];
};

// export var assetSymbolToPricee = {

//   ".tokensymbolvalue": async function(event, handledata) {
//   var token = event;
//   try{
//   return tokenPrices.get(token);

//   } catch (error) {
//    handledata(error.toString() || INPUT_ERR);
//   }
//   }

// }  

assetAddressToSymbol = function(_addr) {
    return TOKENS[tokenAddresses.get().indexOf(_addr)];
};

assetSymbolToAddress = function(_symbol) {
    return tokenAddresses.get()[TOKENS.indexOf(_symbol)];
};

loadFundMetadata = async function() {
    return (await Promise.all([
        // get params
        phaseLengths.set(((await betoken.getPrimitiveVar("getPhaseLengths"))).map(function(x) {
            return +x;
        })),
        commissionRate.set(BigNumber((await betoken.getPrimitiveVar("commissionRate"))).div(1e18)),
        assetFeeRate.set(BigNumber((await betoken.getPrimitiveVar("assetFeeRate")))),
        
        // Get contract addresses
        kairoAddr.set(betoken.addrs.controlToken),
        sharesAddr.set(betoken.addrs.shareToken),
        kyberAddr.set((await betoken.getPrimitiveVar("kyberAddr"))),
        daiAddr.set((await betoken.getPrimitiveVar("daiAddr"))),
        tokenFactoryAddr.set((await betoken.addrs.tokenFactory)),
        tokenAddresses.set((await Promise.all(TOKENS.map(async function(_token) {
            return (await betoken.tokenSymbolToAddress(_token));
        }))))
    ]));
};

loadFundData = async function() {
    // receivedROICount = 0;
    /*
    * Get fund data
    */
    await Promise.all([cycleNumber.set(+((await betoken.getPrimitiveVar("cycleNumber")))), cyclePhase.set(+((await betoken.getPrimitiveVar("cyclePhase")))), startTimeOfCyclePhase.set(+((await betoken.getPrimitiveVar("startTimeOfCyclePhase")))), paused.set((await betoken.getPrimitiveVar("paused"))), allowEmergencyWithdraw.set((await betoken.getPrimitiveVar("allowEmergencyWithdraw"))), sharesTotalSupply.set(BigNumber((await betoken.getShareTotalSupply()))), totalFunds.set(BigNumber((await betoken.getPrimitiveVar("totalFundsInDAI")))), kairoTotalSupply.set(BigNumber((await betoken.getKairoTotalSupply())))]);
};

loadUserData = async function() {
    var userAddr;
    if (hasWeb3) {
        // Get user address
        userAddr = ((await web3.eth.getAccounts()))[0];
        web3.eth.defaultAccount = userAddr;
        if (userAddr != null) {
            userAddress.set(userAddr);
            // Get shares balance
            sharesBalance.set(BigNumber((await betoken.getShareBalance(userAddr))));
            if (!sharesTotalSupply.get().isZero()) {
                displayedInvestmentBalance.set(sharesBalance.get().div(sharesTotalSupply.get()).mul(totalFunds.get()).div(1e18));
            }
            // Get user's Kairo balance
            kairoBalance.set(BigNumber((await betoken.getKairoBalance(userAddr))));
            displayedKairoBalance.set(kairoBalance.get().div(1e18));
            // Get last commission redemption cycle number
            lastCommissionRedemption.set(+((await betoken.getMappingOrArrayItem("lastCommissionRedemption", userAddr))));
            return (await loadDecisions());
        }
    }
};

loadTxHistory = async function() {
    var getDepositWithdrawHistory, getTransferHistory, userAddr;
    // Get deposit and withdraw history
    isLoadingRecords.set(true);
    transactionHistory.set([]);
    userAddr = userAddress.get();
    getDepositWithdrawHistory = async function(_type) {
        var data, entry, event, events, j, len, results, tmp;
        events = (await betoken.contracts.betokenFund.getPastEvents(_type, {
            fromBlock: DEPLOYED_BLOCK,
            filter: {
                _sender: userAddr
            }
        }));
        for (j = 0, len = events.length; j < len; j++) {
            event = events[j];
            data = event.returnValues;
            entry = {
                type: _type,
                timestamp: new Date(+data._timestamp * 1e3).toString(),
                token: (await betoken.getTokenSymbol(data._tokenAddress)),
                amount: BigNumber(data._tokenAmount).div(10 ** (+((await betoken.getTokenDecimals(data._tokenAddress))))).toFormat(4),
                txHash: event.transactionHash
            };
            tmp = transactionHistory.get();
            tmp.push(entry);
            transactionHistory.set(tmp);
        }
    };
    // Get token transfer history
    getTransferHistory = async function(token, isIn) {
        var _event, data, entry, events, j, len, results, tmp, tokenContract;
        tokenContract = (function() {
            switch (token) {
                case "KRO":
                return betoken.contracts.controlToken;
                case "BTKS":
                return betoken.contracts.shareToken;
                default:
                return null;
            }
        })();
        events = (await tokenContract.getPastEvents("Transfer", {
            fromBlock: DEPLOYED_BLOCK,
            filter: isIn ? {
                to: userAddr
            } : {
                from: userAddr
            }
        }));
        for (j = 0, len = events.length; j < len; j++) {
            _event = events[j];
            if (_event == null) {
                continue;
            }
            data = _event.returnValues;
            if ((isIn && data._to !== userAddr) || (!isIn && data._from !== userAddr)) {
                continue;
            }
            entry = {
                type: "Transfer " + (isIn ? "In" : "Out"),
                token: token,
                amount: BigNumber(data._amount).div(1e18).toFormat(4),
                timestamp: new Date(((await web3.eth.getBlock(_event.blockNumber))).timestamp * 1e3).toString(),
                txHash: _event.transactionHash
            };
            tmp = transactionHistory.get();
            tmp.push(entry);
            transactionHistory.set(tmp);
        }
    };
    await Promise.all([getDepositWithdrawHistory("Deposit"), getDepositWithdrawHistory("Withdraw"), getTransferHistory("BTKS", true), getTransferHistory("BTKS", false)]);
    var tmp = transactionHistory.get();
    tmp.sort((x, y) => {
        return (new Date(x.timestamp)) < (new Date(y.timestamp));
    })
    transactionHistory.set(tmp);
    return isLoadingRecords.set(false);
};

loadTokenPrices = async function() {
    isLoadingPrices.set(true);
    tokenPrices.set((await Promise.all(TOKENS.map(async function(_token) {
        return BigNumber((await betoken.getTokenPrice(_token))).div(1e18);
    }))));
    return isLoadingPrices.set(false);
};

loadDecisions = async function() {
    var handleAllProposals, handleProposal, i, investments, totalKROChange, totalStake;
    // Get list of user's investments
    isLoadingInvestments.set(true);
    investments = (await betoken.getInvestments(userAddress.get()));
    if (investments.length !== 0) {
        handleProposal = function(id) {
            return betoken.getTokenSymbol(investments[id].tokenAddress).then(function(_symbol) {
                investments[id].id = id;
                investments[id].tokenSymbol = _symbol;
                investments[id].investment = BigNumber(investments[id].stake).div(kairoTotalSupply.get()).mul(totalFunds.get()).div(1e18).toFormat(4);
                investments[id].stake = BigNumber(investments[id].stake).div(1e18).toFormat(4);
                investments[id].sellPrice = investments[id].isSold ? BigNumber(investments[id].sellPrice) : assetSymbolToPrice(_symbol).mul(1e18);
                investments[id].ROI = BigNumber(investments[id].sellPrice).sub(investments[id].buyPrice).div(investments[id].buyPrice).mul(100).toFormat(4);
                investments[id].kroChange = BigNumber(investments[id].ROI).mul(investments[id].stake).div(100).toFormat(4);
                investments[id].currValue = BigNumber(investments[id].kroChange).add(investments[id].stake).toFormat(4)
            });
        };
        handleAllProposals = (function() {
            var j, ref, results;
            results = [];
            for (i = j = 0, ref = investments.length - 1; (0 <= ref ? j <= ref : j >= ref); i = 0 <= ref ? ++j : --j) {
                results.push(handleProposal(i));
            }
            return results;
        })();
        await Promise.all(handleAllProposals);
        investmentList.set(investments);
        totalKROChange = investments.map(function(x) {
            return BigNumber(x.kroChange);
        }).reduce(function(x, y) {
            return x.add(y);
        });
        totalStake = investments.map(function(x) {
            return BigNumber(x.stake);
        }).reduce(function(x, y) {
            return x.add(y);
        });
        managerROI.set(totalKROChange.div(totalStake).mul(100));
    }
    return isLoadingInvestments.set(false);
};

loadRanking = async function() {
    var addresses, events, ranking;
    // activate loader
    isLoadingRanking.set(true);
    // load NewUser events to get list of users
    events = (await betoken.contracts.betokenFund.getPastEvents("NewUser", {
        fromBlock: DEPLOYED_BLOCK
    }));
    // fetch addresses
    addresses = events.map(function(_event) {
        return _event.returnValues._user;
    });
    addresses = Array.from(new Set(addresses)); // remove duplicates
    
    // fetch KRO balances
    ranking = (await Promise.all(addresses.map(function(_addr) {
        var stake;
        stake = BigNumber(0);
        return betoken.getInvestments(_addr).then(function(investments) {
            var addStake, i;
            addStake = function(i) {
                var currentStakeValue;
                if (!i.isSold && +i.cycleNumber === cycleNumber.get()) {
                    currentStakeValue = assetSymbolToPrice(assetAddressToSymbol(i.tokenAddress)).mul(1e18).sub(i.buyPrice).div(i.buyPrice).mul(i.stake).add(i.stake);
                    return stake = stake.add(currentStakeValue);
                }
            };
            return Promise.all((function() {
                var j, len, results;
                results = [];
                for (j = 0, len = investments.length; j < len; j++) {
                    i = investments[j];
                    results.push(addStake(i));
                }
                return results;
            })());
        }).then(async function() {
            return {
                // format rank object
                rank: 0,
                address: _addr,
                kairoBalance: BigNumber((await betoken.getKairoBalance(_addr))).add(stake).div(1e18).toFixed(18)
            };
        });
    })));
    // sort entries
    ranking.sort(function(a, b) {
        return BigNumber(b.kairoBalance).sub(a.kairoBalance).toNumber();
    });
    // give ranks
    ranking = ranking.map(function(_entry, _id) {
        _entry.rank = _id + 1;
        return _entry;
    });
    // display ranking
    kairoRanking.set(ranking);
    // deactivate loader
    return isLoadingRanking.set(false);
};

loadStats = async function() {
    var _fundValue, fundDAIBalance, getTokenValue, t, totalInputFunds, totalOutputFunds;
    _fundValue = BigNumber(0);
    getTokenValue = async function(_token) {
        var balance, value;
        balance = BigNumber((await betoken.getTokenBalance(assetSymbolToAddress(_token), betoken.addrs.betokenFund))).div(BigNumber(10).toPower((await betoken.getTokenDecimals(assetSymbolToAddress(_token)))));
        value = balance.mul(assetSymbolToPrice(_token));
        return _fundValue = _fundValue.add(value.mul(1e18));
    };
    await Promise.all((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = TOKENS.length; j < len; j++) {
            t = TOKENS[j];
            results.push(getTokenValue(t));
        }
        return results;
    })());
    _fundValue = _fundValue.add(totalFunds.get());
    fundValue.set(_fundValue);
    // Get statistics
    prevROI.set(BigNumber(0));
    avgROI.set(BigNumber(0));
    historicalTotalCommission.set(BigNumber(0));
    await Promise.all([cycleTotalCommission.set(BigNumber((await betoken.getMappingOrArrayItem("totalCommissionOfCycle", cycleNumber.get())))), prevCommission.set(BigNumber((await betoken.getMappingOrArrayItem("totalCommissionOfCycle", cycleNumber.get() - 1))))]);
    // Get commission and draw ROI chart
    
    ROIArray = [];
    
    totalInputFunds = BigNumber(0);
    totalOutputFunds = BigNumber(0);
    return (await Promise.all([
        betoken.contracts.betokenFund.getPastEvents("TotalCommissionPaid",
        {
            fromBlock: DEPLOYED_BLOCK
        }).then(function(events) {
            var _event,
            commission,
            j,
            len,
            results;
            results = [];
            for (j = 0, len = events.length; j < len; j++) {
                _event = events[j];
                commission = BigNumber(_event.returnValues._totalCommissionInDAI);
                // Update total commission
                results.push(historicalTotalCommission.set(historicalTotalCommission.get().add(commission)));
            }
            return results;
        }),
        betoken.contracts.betokenFund.getPastEvents("ROI",
        {
            fromBlock: DEPLOYED_BLOCK
        }).then(function(events) {
            var ROI,
            _event,
            data,
            j,
            len,
            results;
            results = [];
            for (j = 0, len = events.length; j < len; j++) {
                _event = events[j];
                data = _event.returnValues;
                ROI = BigNumber(data._afterTotalFunds).minus(data._beforeTotalFunds).div(data._beforeTotalFunds).mul(100);
                // Update chart data
                ROIArray.push([Number(data._cycleNumber), ROI.toNumber()]);
                
                if (+data._cycleNumber === cycleNumber.get() - 1) {
                    prevROI.set(ROI);
                }
                // Update average ROI
                totalInputFunds = totalInputFunds.add(data._beforeTotalFunds);
                results.push(totalOutputFunds = totalOutputFunds.add(data._afterTotalFunds));
            }
            return results;
        }).then(function() {
            // Take current cycle's ROI into consideration
            if (cyclePhase.get() !== 2) {
                totalInputFunds = totalInputFunds.add(totalFunds.get());
                totalOutputFunds = totalOutputFunds.add(fundValue.get());
            }
            return avgROI.set(totalOutputFunds.sub(totalInputFunds).div(totalInputFunds).mul(100));
        })
    ]));
};

loadAllData = async function() {
    await loadFundMetadata();
    return (await loadDynamicData());
};

loadDynamicData = async function() {
    await loadFundData();
    return (await Promise.all([
        loadUserData().then(loadTxHistory),
        loadTokenPrices().then(function() {
            return Promise.all([loadRanking(),
                loadStats()]);
            })
        ]));
    };
    
    export var document_ready = async function(handledata) {
        var net, netID, pre;
        if (web3 != null) {
            clock();
            netID = (await web3.eth.net.getId());
            if (netID !== NET_ID) {
                wrongNetwork.set(true);
                handledata(WRONG_NETWORK_ERR);
                web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/3057a4979e92452bae6afaabed67a724"));
            } else {
                if (!hasWeb3) {
                    handledata(NO_WEB3_ERR);
                } else if (((await web3.eth.getAccounts())).length === 0) {
                    handledata(METAMASK_LOCKED_ERR);
                }
            }
            
            // Get Network ID
            netID = (await web3.eth.net.getId());
            switch (netID) {
                case 1:
                net = "Main Ethereum Network";
                pre = "";
                break;
                case 3:
                net = "Ropsten Testnet";
                pre = "ropsten.";
                break;
                case 4:
                net = "Rinkeby Testnet";
                pre = "rinkeby.";
                break;
                case 42:
                net = "Kovan Testnet";
                pre = "kovan.";
                break;
                default:
                net = "Unknown Network";
                pre = "";
            }
            networkName.set(net);
            networkPrefix.set(pre);
            // Initialize Betoken object and then load data
            betoken.init().then(loadAllData).then(function() {
                // refresh every 2 minutes
                return setInterval(loadDynamicData, 2 * 60 * 1000);
            });
        }
    }
    
    export var body_helpers = {
        transaction_hash: function() {
            return transactionHash.get();
        },
        network_prefix: async function() {
            return networkPrefix.get();
        },
        error_msg: function() {
            return errorMessage.get();
        },
        success_msg: function() {
            return successMessage.get();
        }
    }
    
    export var top_bar_helpers = {
        show_countdown: function() {
            return showCountdown.get();
        },
        paused: function() {
            return paused.get();
        },
        allow_emergency_withdraw: function() {
            if (allowEmergencyWithdraw.get()) {
                return "";
            } else {
                return "disabled";
            }
        },
        betoken_addr: function() {
            return BETOKEN_ADDR;
        },
        kairo_addr: function() {
            return kairoAddr.get();
        },
        shares_addr: function() {
            return sharesAddr.get();
        },
        kyber_addr: function() {
            return kyberAddr.get();
        },
        dai_addr: function() {
            return daiAddr.get();
        },
        token_factory_addr: function() {
            return tokenFactoryAddr.get();
        },
        network_prefix: function() {
            return networkPrefix.get();
        },
        network_name: function() {
            return networkName.get();
        },
        need_web3: function() {
            if (userAddress.get() !== "0x0" && hasWeb3 && !wrongNetwork.get()) {
                return "";
            } else {
                return "disabled";
            }
        }
    }
    
    export var countdown_timer_helpers = {
        day: function() {
            return countdownDay.get();
        },
        hour: function() {
            return countdownHour.get();
        },
        minute: function() {
            return countdownMin.get();
        },
        second: function() {
            return countdownSec.get();
        },
        phase: function() {
            return cyclePhase.get();
        }
    }
    
    export var sidebar_heplers = {
        user_address: function() {
            return userAddress.get();
        },
        user_balance: function() {
            return displayedInvestmentBalance.get().toFormat(18);
        },
        balance_unit: function() {
            return displayedInvestmentUnit.get();
        },
        user_kairo_balance: function() {
            return displayedKairoBalance.get().toFormat(18);
        },
        kairo_unit: function() {
            return displayedKairoUnit.get();
        },
        can_redeem_commission: function() {
            return cyclePhase.get() === 2 && lastCommissionRedemption.get() < cycleNumber.get();
        },
        expected_commission: function() {
            var roi;
            if (kairoTotalSupply.get().greaterThan(0)) {
                if (cyclePhase.get() === 2) {
                    // Actual commission that will be redeemed
                    return kairoBalance.get().div(kairoTotalSupply.get()).mul(cycleTotalCommission.get()).div(1e18).toFormat(18);
                }
                // Expected commission based on previous average ROI
                roi = avgROI.get().gt(0) ? avgROI.get() : BigNumber(0);
                return kairoBalance.get().div(kairoTotalSupply.get()).mul(totalFunds.get().div(1e18)).mul(roi.div(100).mul(commissionRate.get()).add(assetFeeRate.get().div(1e18))).toFormat(18);
            }
            return BigNumber(0).toFormat(18);
        }
    }
    
    export var sidebar = {
        "redeem_commission": async function(event) {
            return betoken.redeemCommission(showTransaction, loadUserData);
        },
        
        "redeem_commission_in_shares" :async function(event) {
            return betoken.redeemCommissionInShares(showTransaction, loadDynamicData);
        }
    }
    
    export var transact_box_helpers = {
        is_disabled: function() {
            if (cyclePhase.get() !== 0) {
                return "disabled";
            }
        },
        has_error: function(input_id) {
            var hasError;
            hasError = false;
            switch (input_id) {
                case 0:
                hasError = Template.instance().depositInputHasError.get();
                break;
                case 1:
                hasError = Template.instance().withdrawInputHasError.get();
                break;
                case 2:
                hasError = Template.instance().sendTokenAmountInputHasError.get();
                break;
                case 3:
                hasError = Template.instance().sendTokenRecipientInputHasError.get();
            }
            if (hasError) {
                return "error";
            }
        },
        transaction_history: function() {
            return transactionHistory.get();
        },
        tokens: function() {
            return TOKENS;
        },
        need_web3: function() {
            if (userAddress.get() !== "0x0" && hasWeb3 && !wrongNetwork.get()) {
                return "";
            } else {
                return "disabled";
            }
        },
        is_loading: function() {
            return isLoadingRecords.get();
        },
        network_prefix: function() {
            return networkPrefix.get();
        }
    }
    
    export var transact_box_events = {
        "deposit_button": async function(amt, tokenSymbol, handledataSucess, handledataError) {
            var amount, tokenAddr, tokenSymbol;
            try {
                amount = BigNumber(amt);
                if (!amount.gt(0)) {
                    handledataError('Amount must be greater than zero.');
                    return;
                }
                tokenAddr = (await betoken.tokenSymbolToAddress(tokenSymbol));
                handledataSucess(betoken.depositToken(tokenAddr, amount, showTransaction, loadDynamicData));
                return;
            } catch (error1) {
                handledataError(error1);
                return;
            }
        },
        "withdraw_button": async function(amt, tokenSymbol, handledataSucess, handledataError) {
            var amount, error, tokenAddr, tokenSymbol;
            try {
                amount = BigNumber(amt);
                if (!amount.greaterThan(0)) {
                    handledataError('Amount must be greater than zero.');
                    return;
                }
                tokenAddr = (await betoken.tokenSymbolToAddress(tokenSymbol));
                handledataSucess(betoken.withdrawToken(tokenAddr, amount, showTransaction, loadDynamicData));
                return;
            } catch (error1) {
                handledataError(error1);
                return;
            }
        },
        "click .token_send_button": function(event) {
            var amount, toAddress, tokenType;
            try {
                Template.instance().sendTokenAmountInputHasError.set(false);
                Template.instance().sendTokenRecipientInputHasError.set(false);
                amount = BigNumber(web3.utils.toWei($("#send_token_amount_input")[0].value));
                toAddress = $("#send_token_recipient_input")[0].value;
                tokenType = $("#send_token_type")[0].value;
                if (!amount.greaterThan(0)) {
                    Template.instance().sendTokenAmountInputHasError.set(true);
                    return;
                }
                if (!web3.utils.isAddress(toAddress)) {
                    Template.instance().sendTokenRecipientInputHasError.set(true);
                    return;
                }
                if (tokenType === "KRO") {
                    if (amount.greaterThan(kairoBalance.get())) {
                        Template.instance().sendTokenAmountInputHasError.set(true);
                        return;
                    }
                    return betoken.sendKairo(toAddress, amount, showTransaction, loadUserData);
                } else if (tokenType === "BTKS") {
                    if (amount.greaterThan(sharesBalance.get())) {
                        Template.instance().sendTokenAmountInputHasError.set(true);
                        return;
                    }
                    return betoken.sendShares(toAddress, amount, showTransaction, loadUserData);
                }
            } catch (error1) {
                return Template.instance().sendTokenAmountInputHasError.set(true);
            }
        }
    }
    
    export var stats_tab_helpers = {
        cycle_length: function() {
            if (phaseLengths.get().length > 0) {
                return BigNumber(phaseLengths.get().reduce(function(t, n) {
                    return t + n;
                })).div(24 * 60 * 60).toDigits(3);
            }
        },
        total_funds: function() {
            return totalFunds.get().div(1e18).toFormat(2);
        },
        prev_roi: function() {
            return prevROI.get().toFormat(2);
        },
        avg_roi: function() {
            return avgROI.get().toFormat(2);
        },
        prev_commission: function() {
            return prevCommission.get().div(1e18).toFormat(2);
        },
        historical_commission: function() {
            return historicalTotalCommission.get().div(1e18).toFormat(2);
        },
        fund_value: function() {
            return fundValue.get().div(1e18).toFormat(2);
        },
        cycle_roi: function() {
            return fundValue.get().sub(totalFunds.get()).div(totalFunds.get()).mul(100).toFormat(4);
        }
    }
    
    export var decisions_tab_helpers = {
        investment_list: function() {
            return investmentList.get();
        },
        wei_to_eth: function(_weis) {
            return BigNumber(_weis).div(1e18).toFormat(4);
        },
        new_investment_is_disabled: function() {
            if (cyclePhase.get() === 1) {
                return "";
            } else {
                return "disabled";
            }
        },
        tokens: function() {
            return TOKENS;
        },
        need_web3: function() {
            if (userAddress.get() !== "0x0" && hasWeb3 && !wrongNetwork.get()) {
                return "";
            } else {
                return "disabled";
            }
        },
        is_loading: function() {
            return isLoadingInvestments.get();
        },
        selected_token: function() {
            return newInvestmentSelectedToken.get();
        },
        selected_token_price: async function(newInvestToken) {
            return assetSymbolToPrice(newInvestToken);
        }
    }
    
    export var  decisions_tab_events = {
        "sell_investment": async function(idd) {
            var id;
            id = idd;
            if (cyclePhase.get() === 1) {
                return betoken.sellAsset(id, showTransaction, loadDynamicData);
            }
        },
        "new_investment": async function(tokenSymbol, amt, handledataSucess, handledataError) {
            
            var address, error, kairoAmountInWeis, tokenSymbol;
            try {
                address = (await betoken.tokenSymbolToAddress(tokenSymbol));
                kairoAmountInWeis = BigNumber(amt).times("1e18");
                checkKairoAmountError(kairoAmountInWeis);
                handledataSucess(betoken.createInvestment(address, kairoAmountInWeis, showTransaction, loadUserData));
                return;
            } catch (error1) {
                handledataError(error1.toString() || INPUT_ERR);
            }
        },
        "keyup .prompt": function(event) {
            return filterTable(event, "decision_table", 1);
        },
        "click .refresh": async function(event) {
            await loadTokenPrices();
            return (await loadDecisions());
        }
    }
    
    checkKairoAmountError = function(kairoAmountInWeis) {
        if (!kairoAmountInWeis.greaterThan(0)) {
            throw new Error("Stake amount should be positive.");
        }
        if (kairoAmountInWeis.greaterThan(kairoBalance.get())) {
            throw new Error("You can't stake more Kairos than you have!");
        }
    };
    
    export var ranking_tab = {
        kairo_ranking: async function() {
            return kairoRanking.get();
        },
        is_loading: function() {
            return isLoadingRanking.get();
        },
        user_rank: async function() {
            var entry, j, len, ref;
            ref = kairoRanking.get();
            for (j = 0, len = ref.length; j < len; j++) {
                entry = ref[j];
                if (entry.address === userAddress.get()) {
                    return entry.rank;
                }
            }
            return "N/A";
        },
        user_value: function() {
            var entry, j, len, ref;
            ref = kairoRanking.get();
            for (j = 0, len = ref.length; j < len; j++) {
                entry = ref[j];
                if (entry.address === userAddress.get()) {
                    return BigNumber(entry.kairoBalance).toFixed(18);
                }
            }
            return "N/A";
        }
    }