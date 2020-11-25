"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csvtojson_1 = __importDefault(require("csvtojson"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const getData = (data) => {
    let total_Impressions = 0;
    let Clicks = 0;
    let $25_Viewed$ = 0;
    let $50_Viewed$ = 0;
    let $75_Viewed$ = 0;
    let $100_Viewed$ = 0;
    let $DataCost$ = 0;
    let $MediaCost$ = 0;
    let $ClientCost$ = 0;
    data.map((e) => {
        total_Impressions += parseInt(e.Impressions);
        Clicks += parseInt(e.Clicks);
        $25_Viewed$ += parseInt(e.Viewed25);
        $50_Viewed$ += parseInt(e.Viewed50);
        $75_Viewed$ += parseInt(e.Viewed75);
        $100_Viewed$ += parseInt(e.Viewed100);
        $DataCost$ += parseFloat(e.DataCost);
        $MediaCost$ += parseFloat(e.MediaCost);
        $ClientCost$ += parseFloat(e.ClientCost);
    });
    let results = {
        total_Impressions: total_Impressions,
        Clicks: Clicks,
        Viewed25: $25_Viewed$,
        Viewed50: $50_Viewed$,
        Viewed75: $75_Viewed$,
        Viewed100: $100_Viewed$,
        DataCost: $DataCost$,
        ClientCost: $ClientCost$,
        MediaCost: $MediaCost$,
    };
    return results;
};
const processData = (data) => {
    let $cgn_level = [];
    let $order_level = [];
    let $creative_level = [];
    let cgn_level = [];
    let order_level = [];
    let creative_level = [];
    let date = "";
    data.forEach((e) => {
        date = e.Date;
        let $cgn = $cgn_level.findIndex((x) => x.CampaignID == e.CampaignID);
        let $order = $order_level.findIndex((x) => x.OrderID == e.OrderID);
        let $creative = $creative_level.findIndex((x) => x.CreativeID == e.CreativeID);
        if ($cgn == -1) {
            $cgn_level.push({
                Date: e.Date,
                CampaignID: e.CampaignID,
                CampaignName: e.CampaignName,
                AdvertiserID: e.AdvertiserID,
                AdvertiserName: e.AdvertiserName
            });
        }
        if ($order == -1) {
            $order_level.push({
                Date: e.Date,
                CampaignID: e.CampaignID,
                OrderID: e.OrderID,
                OrderName: e.OrderName,
            });
        }
        if ($creative == -1) {
            $creative_level.push({
                Date: e.Date,
                CreativeID: e.CreativeID,
                CreativeName: e.CreativeName,
                OrderID: e.OrderID,
            });
        }
    });
    $cgn_level.map((e) => {
        let a = data.filter((x) => x.CampaignID == e.CampaignID);
        let results = getData(a);
        let { Clicks, Viewed25, Viewed50, Viewed75, Viewed100, DataCost, ClientCost, MediaCost, } = results;
        cgn_level.push({
            Date: e.Date,
            AdvertiserID: e.AdvertiserID,
            AdvertiserName: e.AdvertiserName,
            CampaignID: e.CampaignID,
            CampaignName: e.CampaignName,
            Clicks,
            Viewed25,
            Viewed50,
            Viewed75,
            Viewed100,
            DataCost,
            ClientCost,
            MediaCost,
        });
    });
    cgn_level.pop();
    $order_level.map((e) => {
        let a = data.filter((x) => x.OrderID == e.OrderID);
        let results = getData(a);
        let { Clicks, Viewed25, Viewed50, Viewed75, Viewed100, DataCost, ClientCost, MediaCost, } = results;
        order_level.push({
            Date: e.Date,
            OrderID: e.OrderID,
            OrderName: e.OrderName,
            Results: results,
            Clicks,
            Viewed25,
            Viewed50,
            Viewed75,
            Viewed100,
            DataCost,
            ClientCost,
            MediaCost,
        });
    });
    order_level.pop();
    $creative_level.map((e) => {
        let a = data.filter((x) => x.CreativeID == e.CreativeID);
        let results = getData(a);
        let { Clicks, Viewed25, Viewed50, Viewed75, Viewed100, DataCost, ClientCost, MediaCost, } = results;
        creative_level.push({
            Date: e.Date,
            CreativeID: e.CreativeID,
            CreativeName: e.CreativeName,
            OrderID: e.OrderID,
            Clicks,
            Viewed25,
            Viewed50,
            Viewed75,
            Viewed100,
            DataCost,
            ClientCost,
            MediaCost,
        });
    });
    creative_level.pop();
    let all = {
        cgn_level: cgn_level,
        order_level: order_level,
        creative_level: creative_level,
        date: date
    };
    return all;
};
const getsheets = async (file) => {
    let x = await csvtojson_1.default({
        noheader: false,
        headers: [
            "Date",
            "AdvertiserID",
            "AdvertiserName",
            "CampaignID",
            "CampaignName",
            "OrderID",
            "OrderName",
            "CreativeID",
            "CreativeName",
            "CreativePreviewURL",
            "Impressions",
            "Clicks",
            "Viewed25",
            "Viewed50",
            "Viewed75",
            "Viewed100",
            "MediaCost",
            "DataCost",
            "ClientCost",
        ],
    })
        .fromFile(file)
        .then((data) => {
        return data;
    });
    return x;
};
const convertFile = async () => {
    const folder = path.resolve(__dirname, "../log_data");
    const folderAdvertirses = path.resolve(__dirname, "../assets/Yashi_Advertisers.csv");
    const dataList = await new Promise((resolve, reject) => fs.readdir(folder, (err, data) => {
        if (err) {
        }
        resolve(data);
    }));
    let ad = await csvtojson_1.default({
        noheader: false,
        headers: ["AdvertiserID", "AdvertiserName"],
    })
        .fromFile(folderAdvertirses)
        .then((data) => {
        return data;
    });
    dataList.map(async (daylog) => {
        let file = path.resolve(__dirname, `../log_data/${daylog}`);
        let data = await getsheets(file).then((x) => {
            return x;
        });
        let filterdata = [];
        await data.map((e) => {
            let $nad = ad.findIndex((x) => x.AdvertiserID == e.AdvertiserID);
            if ($nad != -1) {
                filterdata.push(e);
            }
        });
        let { cgn_level, order_level, creative_level, date } = await processData(filterdata);
        let filecgn_level = path.resolve(__dirname, `../results/cgn_level/${date}`);
        let filecgn_order = path.resolve(__dirname, `../results/order_level/${date}`);
        let filecgn_creative = path.resolve(__dirname, `../results/creative_level/${date}`);
        await fs.writeFileSync(`${filecgn_level}.json`, JSON.stringify(cgn_level));
        await fs.writeFileSync(`${filecgn_order}.json`, JSON.stringify(order_level));
        await fs.writeFileSync(`${filecgn_creative}.json`, JSON.stringify(creative_level));
    });
};
convertFile().then((x) => {
    console.log("Success,please check the results folder");
});
