import csv from "csvtojson";
import * as fs from "fs";
import * as path from "path";

interface Rsults {
  total_Impressions: number;
  Clicks: number;
  Viewed25: number;
  Viewed50: number;
  Viewed75: number;
  Viewed100: number;
  DataCost: number;
  ClientCost: number;
  MediaCost: number;
}
const getData = (data: Array<any>) => {
  let total_Impressions: number = 0;
  let Clicks: number = 0;
  let $25_Viewed$: number = 0;
  let $50_Viewed$: number = 0;
  let $75_Viewed$: number = 0;
  let $100_Viewed$: number = 0;
  let $DataCost$: number = 0;
  let $MediaCost$: number = 0;
  let $ClientCost$: number = 0;

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

  let results: Rsults = {
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

const processData = (data: Array<any>) => {
  let $cgn_level: any = [];
  let $order_level: any = [];
  let $creative_level: any = [];
  let cgn_level: Array<any> = [];
  let order_level: Array<any> = [];
  let creative_level: Array<any> = [];

  data.forEach((e) => {
    let $cgn: any = $cgn_level.findIndex(
      (x: any) => x.CampaignID == e.CampaignID
    );
    let $order: any = $order_level.findIndex(
      (x: any) => x.OrderID == e.OrderID
    );
    let $creative: any = $creative_level.findIndex(
      (x: any) => x.CreativeID == e.CreativeID
    );

    if ($cgn == -1) {
      $cgn_level.push({
        Date: e.Date,
        CampaignID: e.CampaignID,
        CampaignName: e.CampaignName,
        AdvertiserID:e.AdvertiserID,
        AdvertiserName:e.AdvertiserName
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

  $cgn_level.map((e: any) => {
    let a = data.filter((x) => x.CampaignID == e.CampaignID);
    let results = getData(a);

    let {
      Clicks,
      Viewed25,
      Viewed50,
      Viewed75,
      Viewed100,
      DataCost,
      ClientCost,
      MediaCost,
    } = results;

    cgn_level.push({
      Date:e.Date,
      AdvertiserID:e.AdvertiserID,
      AdvertiserName:e.AdvertiserName,
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

  $order_level.map((e: any) => {
    let a = data.filter((x) => x.OrderID == e.OrderID);
    let results = getData(a);
    let {
      Clicks,
      Viewed25,
      Viewed50,
      Viewed75,
      Viewed100,
      DataCost,
      ClientCost,
      MediaCost,
    } = results;

    order_level.push({
      Date:e.Date,
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
  $creative_level.map((e: any) => {
    let a = data.filter((x) => x.CreativeID == e.CreativeID);
    let results = getData(a);
    let {
      Clicks,
      Viewed25,
      Viewed50,
      Viewed75,
      Viewed100,
      DataCost,
      ClientCost,
      MediaCost,
    } = results;

    creative_level.push({
      Date:e.Date,
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
  };
  return all;
};

const getsheets = async (file: any) => {
  let x = await csv({
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
    .then((data: any) => {
      return data;
    });

  return x;
};

const convertFile = async () => {

  const folder: string = path.resolve(__dirname, "../log_data");
  const folderAdvertirses: string = path.resolve(
    __dirname,
    "../assets/Yashi_Advertisers.csv"
  );
  const dataList = await new Promise<Array<any>>((resolve, reject) =>
    fs.readdir(folder, (err: any, data: Array<any>) => {
      if (err) {
      }
      resolve(data);
    })
  );

  let ad = await csv({
    noheader: false,
    headers: ["AdvertiserID", "AdvertiserName"],
  })
    .fromFile(folderAdvertirses)
    .then((data: any) => {
      return data;
    });
  

  dataList.map(async (daylog: string) => {
    let file = path.resolve(__dirname, `../log_data/${daylog}`);
    let data = await getsheets(file).then((x: any) => {
      return x;
    });


    let filterdata: Array<any> = [];

    await data.map((e: any) => {

      let $nad: any = ad.findIndex(
        (x: any) => x.AdvertiserID == e.AdvertiserID
      ); 
      if ($nad != -1) {
        filterdata.push(e);
      }
    });

    let _date = daylog.split(".");
    let $_date = _date[0].split("_");
   
    let { cgn_level, order_level, creative_level } = await processData(
      filterdata
    );

    let filecgn_level = path.resolve(__dirname, `../results/cgn_level/${$_date[1]}`);
    let filecgn_order = path.resolve(__dirname, `../results/order_level/${$_date[1]}`);
    let filecgn_creative = path.resolve(__dirname, `../results/creative_level/${$_date[1]}`);
   
    await fs.writeFileSync(`${filecgn_level}.csv`,JSON.stringify(cgn_level));
    await fs.writeFileSync(`${filecgn_order}.json`,JSON.stringify(order_level));
    await fs.writeFileSync(`${filecgn_creative}.json`,JSON.stringify(creative_level));

  });

};

convertFile().then((x) => {
  console.log("Success,please check the results folder");
});