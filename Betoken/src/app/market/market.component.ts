import { Component, OnInit } from '@angular/core';
import { tokens, loading, refresh_actions } from '../../betokenjs/helpers';
import BigNumber from 'bignumber.js';
import { isUndefined } from 'util';

declare var $ :any;

@Component({
    selector: 'app-market',
    templateUrl: './market.component.html'
})

export class MarketComponent implements OnInit {

    tokenData: Array<Object>;

    constructor() { }

    ngOnInit() {
        this.refreshDisplay();
    }

    getTokenPrice(token) {
        let price = tokens.asset_symbol_to_price(token);
        if (isUndefined(price)) {
            price = new BigNumber(0);
        }
        return price.toFormat(10);
    }

    getTokenDailyPriceChange(token) {
        let result = tokens.asset_symbol_to_daily_price_change(token);
        if (isUndefined(result)) {
            result = new BigNumber(0);
        }
        return result.toFormat(4);
    }

    getTokenWeeklyPriceChange(token) {
        let result = tokens.asset_symbol_to_weekly_price_change(token);
        if (isUndefined(result)) {
            result = new BigNumber(0);
        }
        return result.toFormat(4);
    }

    getTokenMonthlyPriceChange(token) {
        let result = tokens.asset_symbol_to_monthly_price_change(token);
        if (isUndefined(result)) {
            result = new BigNumber(0);
        }
        return result.toFormat(4);
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

    refreshDisplay() {
        this.tokenData = tokens.token_data().get().filter((x) => tokens.not_stablecoin(x.symbol));
    }

    refresh() {
        refresh_actions.prices();
    }

    isLoading() {
        return loading.prices();
    }

    filterTable = (event, tableID, searchID) => {
        let searchInput = event.target.value.toLowerCase();
        let entries = $(`#${tableID} tr`);
        for (let i = 0; i < entries.length; i++) {
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
}
