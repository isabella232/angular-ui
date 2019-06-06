import {Component, OnInit} from '@angular/core';
import { AppComponent } from '../app.component';
import { user, timer, manager_actions, loading, tokens, refresh_actions} from '../../betokenjs/helpers';
import BigNumber from 'bignumber.js';
import { isUndefined } from 'util';

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'app-proposal',
    templateUrl: './investments.component.html'
})

export class InvestmentsComponent implements OnInit {
    createInvestmentPopupStep: Number;
    sellInvestmentPopupStep: Number;
    nextPhasePopupStep: Number;

    portfolioValueInDAI: String;
    currentStake: String;
    currentStakeProportion: String;

    userValue: String;
    days: Number;
    hours: Number;
    minutes: Number;
    seconds: Number;
    phase: Number;
    expected_commission: String;
    kairo_balance: BigNumber;
    monthly_pl: BigNumber;
    selectedTokenSymbol: String;
    stakeAmount: BigNumber;
    activeInvestmentList: Array<Object>;
    inactiveInvestmentList: Array<Object>;
    tokenData: Array<Object>;
    transactionId: String;
    sellId: Number;
    sellData: Object;

    constructor(private ms: AppComponent) {
        this.createInvestmentPopupStep = 0;
        this.sellInvestmentPopupStep = 0;
        this.nextPhasePopupStep = 0;

        this.portfolioValueInDAI = '';
        this.currentStake = '';
        this.currentStakeProportion = '';

        this.userValue = '';
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.phase = -1;
        this.expected_commission = '';
        this.kairo_balance = new BigNumber(0);
        this.monthly_pl = new BigNumber(0);
        this.selectedTokenSymbol = 'ETH';
        this.stakeAmount = new BigNumber(0);
        this.activeInvestmentList = new Array<Object>();
        this.inactiveInvestmentList = new Array<Object>();
        this.sellId = 0;
        this.tokenData = new Array<Object>();
        this.transactionId = '';
        this.sellData = {
            stake: new BigNumber(0),
            ROI: new BigNumber(0),
            currValue: new BigNumber(0)
        };
    }

    ngOnInit() {
        setInterval(() => {
            this.refreshDisplay();
        }, 500);
        $('#modalBuy').on('hidden.bs.modal', () => {
            this.resetModals();
        });
        $('#modalSell').on('hidden.bs.modal', () => {
            this.resetModals();
        });
        $('[data-toggle="tooltip"]').tooltip();
    }

    resetModals() {
        this.stakeAmount = new BigNumber(0);
        this.selectedTokenSymbol = this.tokenData[0]['symbol'];
        this.createInvestmentPopupStep = 0;
        this.sellInvestmentPopupStep = 0;
        this.nextPhasePopupStep = 0;
    }

    // Refresh info

    refreshDisplay() {
        this.activeInvestmentList = user.investment_list().filter((data) => data.isSold === false);
        this.inactiveInvestmentList = user.investment_list().filter((data) => data.isSold === true);
        this.expected_commission = user.expected_commission().toFormat(2);
        this.kairo_balance = user.kairo_balance();
        this.monthly_pl = user.monthly_roi();
        this.tokenData = tokens.token_data().get().filter((x) => tokens.not_stablecoin(x.symbol));
        this.userValue = user.portfolio_value().toFormat(4);
        this.portfolioValueInDAI = user.portfolio_value_in_dai().toFormat(2);
        this.currentStake = user.current_stake().toFormat(4);
        this.currentStakeProportion = user.current_stake().div(user.portfolio_value()).times(100).toFixed(4);

        this.days = timer.day();
        this.hours = timer.hour();
        this.minutes = timer.minute();
        this.seconds = timer.second();
        this.phase = timer.phase();
    }

    refresh() {
        refresh_actions.investments();
    }

    // Create investment

    createInvestment() {
        this.stakeAmount = new BigNumber($('#kairo-input').val());
        this.createInvestmentPopupStep = 2;

        let pending = (transactionHash) => {
            if (this.createInvestmentPopupStep !== 0) {
                this.transactionId = transactionHash;
                this.createInvestmentPopupStep = 3;
            }
        }

        let confirm = () => {
            if (this.createInvestmentPopupStep !== 0) {
                this.createInvestmentPopupStep = 4;
                this.refresh();
            }
        }

        let tokenPrice = this.assetSymbolToPrice(this.selectedTokenSymbol);
        let maxPrice = tokenPrice.plus(tokenPrice.times($('#maxAcceptablePrice').val()).div(100));
        manager_actions.new_investment(this.selectedTokenSymbol, this.stakeAmount, new BigNumber(0), maxPrice, pending, confirm);
    }

    // Sell investment

    openSellModal(data) {
        this.sellId = data.id;
        this.sellData = data;
        this.selectedTokenSymbol = data.tokenSymbol;
    }

    sell() {
        this.sellInvestmentPopupStep = 1;

        let pendingSell = (transactionHash) => {
            this.sellInvestmentPopupStep = 2;
            this.transactionId = transactionHash;
        }

        let confirmSell = () => {
            if (this.sellInvestmentPopupStep === 2) {
                this.sellInvestmentPopupStep = 3;
                this.refresh();
            }
        }

        let sellPercentage = new BigNumber($('#sell-percentage-input').val()).div(100);
        let tokenPrice = this.assetSymbolToPrice(this.selectedTokenSymbol);
        let minPrice = tokenPrice.minus(tokenPrice.times($('#minAcceptablePrice').val()).div(100));
        manager_actions.sell_investment(this.sellId, sellPercentage, minPrice, tokenPrice.times(100), pendingSell, confirmSell);
    }

    // UI helpers

    maxStake() {
        $('#kairo-input').val(this.kairo_balance.toString());
    }

    maxSellPercent() {
        $('#sell-percentage-input').val('100.0');
    }

    isLoading() {
        return loading.investments();
    }


    filterList = (event, listID, searchID) => {
        let searchInput = event.target.value.toLowerCase();
        let entries = $(`#${listID} li`);
        if (searchInput.length > 0) {
            entries[0].style.display = "none";
        } else {
            entries[0].style.display = "";
        }
        for (let i = 1; i < entries.length; i++) { // skip first item (titles etc.)
            let entry = entries[i];
            let searchTarget = entry.children[searchID];
            if (searchTarget) {
                if (searchTarget.innerText.toLowerCase().indexOf(searchInput) > -1)
                    entry.style.display = "";
                else
                    entry.style.display = "none";
            }
        }
    }

    assetSymbolToPrice(symbol) {
        return tokens.asset_symbol_to_price(symbol);
    }

    getTokenName(token) {
        let result = tokens.asset_symbol_to_name(token);
        if (isUndefined(result)) {
            return '';
        }
        return result;
    }

    getTokenLogoUrl(token) {
        let result = tokens.asset_symbol_to_logo_url(token);
        if (isUndefined(result)) {
            return '';
        }
        return result;
    }

    getTokenDailyPriceChange(token) {
        let result = tokens.asset_symbol_to_daily_price_change(token);
        if (isUndefined(result)) {
            result = new BigNumber(0);
        }
        return result.toFormat(4);
    }
}
