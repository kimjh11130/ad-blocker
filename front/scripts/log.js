const COUNT_ALL_BLOCK_ADS = 'cntAllAds';
const COUNT_TODAY_BLOCK_ADS = 'cntTodayAds';

const cntAllAdsTag = document.getElementById(COUNT_ALL_BLOCK_ADS);
const cntTodayAdsTag = document.getElementById(COUNT_TODAY_BLOCK_ADS);

chrome.storage.onChanged.addListener(
  chrome.storage.local
    .get([COUNT_ALL_BLOCK_ADS])
    .then((itmes) => (cntAllAdsTag.innerText = itmes[COUNT_ALL_BLOCK_ADS])),

  chrome.storage.local
    .get([COUNT_TODAY_BLOCK_ADS])
    .then(
      (itmes) => (cntTodayAdsTag.innerText = itmes[COUNT_TODAY_BLOCK_ADS].value)
    )
);
