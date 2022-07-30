import axios from "axios";
import jwtDecode from "jwt-decode";
import { clearRTCCookies, VCurrencies } from "./misc";
import * as SecureStore from "expo-secure-store";

axios.interceptors.request.use(
  function (config) {
    console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export let sAccessToken: string = "";
export let sEntitlementsToken: string = "";
export let sUserId: string = "";
export let sRegion: string = "eu";
export let sUsername: string = "";
export let sFUsername: string = "";
export let sVersion: string = "";
export let sAvatar: string = "";
export let sTitle: string = "";

export let offers: any = {};

export let sActivatedContract: contract,{} = {};
export let sContract: contract[] = [];
export let sShop: shopItem[] = [];
export let sBundle: Bundle;
export let sNightMarket: nightMarketItem[] = [];
export let sBalance: Balance;
export let sProgress: Progress;

const sPlatform = "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9"


export async function setup(accessToken: string, region: string) {
  sAccessToken = accessToken;

  sRegion = region;
  await SecureStore.setItemAsync("region", region);

  loadUserId();
  await getVersion();
  await loadEntitlementsToken();
  await getInv();
  await getRank()
  await loadContracts();
  await loadOffers();
  await loadShops();
  await loadBalance();
  await loadProgress();
  await loadUsername();
}

async function loadEntitlementsToken() {
  const res = await axios({
    url: getUrl("entitlements"),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sAccessToken}`,
    },
    data: {},
  });

  sEntitlementsToken = res.data.entitlements_token;
}

function loadUserId() {
  const data = jwtDecode(sAccessToken) as any;

  sUserId = data.sub;
}

async function getVersion() {
  const res = await axios({
    url: "https://valorant-api.com/v1/version",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    data: {},
  });

  sVersion = res.data.data.riotClientVersion;
  // console.log(sVersion)
  
}

async function getInv() {
  const res = await axios({
    url: getUrl("loadout"),
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  const resCards = await axios({
    url: `https://valorant-api.com/v1/playercards/${res.data.Identity.PlayerCardID}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });


  const resTitle = await axios({
    url: `https://valorant-api.com/v1/playertitles/${res.data.Identity.PlayerTitleID}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  sTitle = resTitle.data.data.titleText
  sAvatar = resCards.data.data.displayIcon
}


async function getRank() {
  const res = await axios({
    url: getUrl("rank"),
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
      "X-Riot-ClientVersion": sVersion,
      "X-Riot-ClientPlatform": sPlatform,
    },
  });
  console.log(res.data)
}

async function loadUsername() {
  const res = await axios({
    url: getUrl("name"),
    method: "PUT",
    headers: {
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
      "Content-Type": "application/json",
    },
    data: [sUserId],
  });
  // console.log(res.data)
  sFUsername = res.data[0].GameName != "" ? res.data[0].GameName + "#" + res.data[0].TagLine : "?";
  sUsername = res.data[0].GameName != "" ? res.data[0].GameName : "?";
}



async function loadContracts() {
  
  const resValApi = await axios({
    url: "https://valorant-api.com/v1/contracts",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    data: {},
  });

  const agents = await axios({
    url: "https://valorant-api.com/v1/agents?isPlayableCharacter=True",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    data: {},
  });
  let agentJson: any = {};
  for (var i = 0; i < agents.data.data.length; i++) {
    agentJson[agents.data.data[i].uuid] = {
      "displayName": agents.data.data[i].displayName,
      "displayIcon": agents.data.data[i].displayIcon
    }
  }

  let contracts: contract[] = [];
  for (var i = 0; i < resValApi.data.data.length; i++) {
    if (resValApi.data.data[i].content.relationType === "Agent") {
      // let contract: contract[] = []
      // contract = resValApi.data.data[i].uuid;
      let agent_uuid = resValApi.data.data[i].content.relationUuid;
      contracts[i] = {"uuid": resValApi.data.data[i].uuid,
                            "displayName": resValApi.data.data[i].displayName,
                            "displayIcon": agentJson[agent_uuid].displayIcon,
                            "agentName": agentJson[agent_uuid].displayName,
                            "level": 0,
                            "xpInLevel": 0,
                            "xpNeededForNext": 0,
                            "totalXp": 0,
                            "progression": 0,
                            "totalXpNeededInLevel": 0,
                            "totalProgression": 0};
            
    }

  }

  // console.log(contracts)

  const res = await axios({
    url: getUrl("contracts"),
    method: "GET",
    headers: {
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
      "X-Riot-ClientVersion": sVersion
    },
  });
  
  

  // let contracts: contract[] = [];
  for (var i = 0; i < contracts.length; i++) {
    if (contracts[i].uuid === res.data.ActiveSpecialContract) {
      sActivatedContract = contracts[i];
    }
    for (var j = 0; j < res.data.Contracts.length; j++) {
      if (contracts[i].uuid == res.data.Contracts[j].ContractDefinitionID) {
        contracts[i].level = res.data.Contracts[j].ProgressionLevelReached
        contracts[i].xpInLevel = res.data.Contracts[j].ProgressionTowardsNextLevel
        contracts[i].totalXp = res.data.Contracts[j].ContractProgression.TotalProgressionEarned
        contracts[i].xpNeededForNext = getXpForLevel(res.data.Contracts[j].ProgressionLevelReached) - res.data.Contracts[j].ProgressionTowardsNextLevel
        contracts[i].totalXpNeededInLevel = getXpForLevel(res.data.Contracts[j].ProgressionLevelReached)
        if (res.data.Contracts[j].ProgressionTowardsNextLevel != 0 || getXpForLevel(res.data.Contracts[j].ProgressionLevelReached) != 0) {
          contracts[i].progression = res.data.Contracts[j].ProgressionTowardsNextLevel / getXpForLevel(res.data.Contracts[j].ProgressionLevelReached)
        }
        else {

          contracts[i].progression = 1
        }
        if (res.data.Contracts[j].ContractProgression.TotalProgressionEarned != 0) {
          contracts[i].totalProgression = res.data.Contracts[j].ContractProgression.TotalProgressionEarned / 975000
        }
        else {
          contracts[i].totalProgression = 0
        }
      }
    }
  }


  sContract = contracts;
  return contracts;
}

export async function loadOffers() {
  const res = await axios({
    url: getUrl("offers"),
    method: "GET",
    headers: {
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  for (var i = 0; i < res.data.Offers.length; i++) {
    let offer = res.data.Offers[i];
    offers[offer.OfferID] = offer.Cost["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"];
  }
}

async function loadShops() {
  const res = await axios({
    url: getUrl("storefront"),
    method: "GET",
    headers: {
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  /* NORMAL SHOP */
  let singleItemOffers = res.data.SkinsPanelLayout.SingleItemOffers;
  let shop: shopItem[] = [];
  for (var i = 0; i < singleItemOffers.length; i++) {
    shop[i] = (
      await axios(
        `https://valorant-api.com/v1/weapons/skinlevels/${singleItemOffers[i]}`,
        {
          method: "GET",
        }
      )
    ).data.data;
    shop[i].price = offers[shop[i].uuid];
  }
  sShop = shop;


  
  /* BUNDLE */
  let bundle: Bundle = (
    await axios({
      url: `https://valorant-api.com/v1/bundles/${res.data.FeaturedBundle.Bundle.DataAssetID}`,
      method: "GET",
    })
  ).data.data;

  bundle.price = res.data.FeaturedBundle.Bundle.Items.map(
    (item: any) => item.DiscountedPrice
  ).reduce((a: any, b: any) => a + b);

  sBundle = bundle;

  /* NIGHT MARKET */
  if (res.data.BonusStore) {
    var bonusStore = res.data.BonusStore.BonusStoreOffers;
    var nightMarket: nightMarketItem[] = [];
    for (var i = 0; i < bonusStore.length; i++) {
      let itemid = bonusStore[i].Offer.Rewards[0].ItemID;
      nightMarket[i] = (
        await axios({
          url: `https://valorant-api.com/v1/weapons/skinlevels/${itemid}`,
          method: "GET",
        })
      ).data.data;
      nightMarket[i].price = bonusStore[i].Offer.Cost[VCurrencies.VP];
      nightMarket[i].discountPrice =
        bonusStore[i].DiscountCosts[VCurrencies.VP];
      nightMarket[i].discountPercent = bonusStore[i].DiscountPercent;
    }
    sNightMarket = nightMarket;
  }
}

export async function loadBalance() {
  const res = await axios({
    url: getUrl("wallet"),
    method: "GET",
    headers: {
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  sBalance = {
    vp: res.data.Balances[VCurrencies.VP],
    rad: res.data.Balances[VCurrencies.RAD],
    fag: res.data.Balances[VCurrencies.FAG],
  };
}

export async function loadProgress() {
  const res = await axios({
    url: getUrl("playerxp"),
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  sProgress = {
    level: res.data.Progress.Level,
    xp: res.data.Progress.XP,
  };
}

export function reset() {
  sUserId = "";
  sRegion = "";
  sAccessToken = "";
  sEntitlementsToken = "";
  clearRTCCookies();
}

function getUrl(name: string) {
  const URLS: any = {
    auth: "https://auth.riotgames.com/api/v1/authorization/",
    entitlements: "https://entitlements.auth.riotgames.com/api/token/v1/",
    userinfo: "https://auth.riotgames.com/userinfo/",
    storefront: `https://pd.${sRegion}.a.pvp.net/store/v2/storefront/${sUserId}/`,
    wallet: `https://pd.${sRegion}.a.pvp.net/store/v1/wallet/${sUserId}/`,
    playerxp: `https://pd.${sRegion}.a.pvp.net/account-xp/v1/players/${sUserId}/`,
    weapons: "https://valorant-api.com/v1/weapons/",
    offers: `https://pd.${sRegion}.a.pvp.net/store/v1/offers/`,
    name: `https://pd.${sRegion}.a.pvp.net/name-service/v2/players`,
    contracts: `https://pd.${sRegion}.a.pvp.net/contracts/v1/contracts/${sUserId}/`,
    loadout: `https://pd.${sRegion}.a.pvp.net/personalization/v2/players/${sUserId}/playerloadout/`,
    rank: `https://pd.${sRegion}.a.pvp.net/mmr/v1/players/${sUserId}/`,
  };

  return URLS[name];
}


function getXpForLevel(level: number) {
  const xp: any = {
    0: 20000,
    1: 30000,
    2: 40000,
    3: 50000,
    4: 60000,
    5: 75000,
    6: 100000,
    7: 150000,
    8: 200000,
    9: 250000,
    10: 0,
  }

  return xp[level];
}

export function numberFormat(n: number) {
  let nstr = n.toString();
  if (nstr.length > 3) {
    return nstr.slice(0, -3) + "k";
  }
  else {
    return nstr;
  }
}



export function isTokenExpired(token: string) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload)).exp < Date.now() / 1000;
}
