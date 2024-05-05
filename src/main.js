/*
 * @LastEditors: Please set LastEditors
 */
import Vue from "vue";
import App from "./App";
import { url, fileUrl, getRequest, getFileUpload, requestPayment, goHtml, getUserProfile } from "./util";

import Router from './router';
import uView from "uview-ui";
import Mixin from './polyfill/mixins'

Vue.mixin(Mixin)


Vue.prototype.$url = url;
Vue.prototype.$fileUrl = fileUrl;
Vue.prototype.$goHtml = goHtml;
Vue.prototype.$getUserProfile = getUserProfile;
Vue.prototype.$getRequest = getRequest;
Vue.prototype.$getFileUpload = getFileUpload;
Vue.prototype.$requestPayment = requestPayment;

Vue.prototype.$router = new Router();
Vue.filter("$transformTimeStr", (time) => {
    return `${time}`.length === 1
        ? `0${time}`
        : `${time}`;
});
Vue.filter("$numToSeparator", (num, unit="元/月", symbol) => {
    if (num != undefined) {
        let numStr = num.toFixed();
        numStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + unit;
        return symbol ? (symbol + numStr) : numStr;
    }
});
Vue.filter("$transformNum", (num) => {
    if (num != undefined) {
        // const numStr = (num / 10000).toFixed(2);
        let tnumStr = (num / 10000).toFixed(3);
        const numStr = tnumStr.substring(0, tnumStr.length - 1)
        return `${numStr}万`;
    }
});
Vue.filter("$getTypeDataName", (val, field, map) => {
    const list = map[field] || []
    return (list.find(item => item.id === val) || { name: "" }).name
});
Vue.filter("$numFormat", (num) => {
    if (num != undefined) {
        const numStr = num.toFixed();
        return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});

Vue.use(uView);
App.mpType = "app";

Vue.config.productionTip = false;
const app = new Vue({
    ...App,
});
app.$mount();
