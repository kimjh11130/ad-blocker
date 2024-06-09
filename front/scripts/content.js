//광고 가져올때 쓰는 배열
const adAttributeList = [
  '[data-google-av-adk]',
  '[data-adfit-click]',
  '.adsbygoogle',
  '.kakao_ad_area',
  '.GoogleActiveViewInnerContainer',
];

//key 값
const COUNT_ALL_BLOCK_ADS = 'cntAllAds';
const COUNT_TODAY_BLOCK_ADS = 'cntTodayAds';

//오늘 하루의 값만 설정하는 함수
const setWithExpire = (key, value) => {
  chrome.storage.local.get([key]).then((items) => {
    const oldItem = items[key];
    if (oldItem) {
      chrome.storage.local.set({
        [key]: { value: value, expires: oldItem.expires },
      });
    } else {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const item = {
        value: value,
        expires: now.getTime() + 24 * 60 * 60 * 1000,
      };
      chrome.storage.local.set({ [key]: item });
    }
  });
};

//오늘 하루의 값만 가져오는 함수
const getWithExpire = (key, fn) => {
  const storage = chrome.storage.local;
  storage.get([key]).then((items) => {
    const oldItem = items[key];
    if (!oldItem) setWithExpire(key, 0), fn(0);
    else {
      const now = new Date();
      if (now.getTime() > oldItem.expires) {
        storage.removeItem([key]);
        setWithExpire(key, 0);
        fn(0);
      } else fn(oldItem.value);
    }
  });
};

//2차원 배열 to 1차원 배열
const isIterable = (obj) => typeof obj[Symbol.iterator] === 'function';
const flattenEverything = (arr) =>
  arr.flatMap((value) => (isIterable(value) ? [...value] : value));

const setLocalStorageItem = (length) => {
  chrome.storage.local
    .get([COUNT_ALL_BLOCK_ADS])
    .then((items) =>
      chrome.storage.local.set({
        [COUNT_ALL_BLOCK_ADS]: +items[COUNT_ALL_BLOCK_ADS] + length,
      })
    )
    .catch(chrome.storage.local.set({ [COUNT_ALL_BLOCK_ADS]: length }));

  getWithExpire(COUNT_TODAY_BLOCK_ADS, (items) =>
    setWithExpire(COUNT_TODAY_BLOCK_ADS, +items + length)
  );
};

// 광고 삭제 로직
const removeAdsLogic = (ads) => {
  if (ads.clientHeight === ads.parentElement.clientHeight)
    ads.parentElement.remove();
  else ads.remove();
};

// 광고 찾고 삭제하는 통합 로직
function removeAd() {
  let googleAdNodeList = adAttributeList.map((attribute) => {
    return document.querySelectorAll(attribute);
  });
  if (googleAdNodeList.length) {
    const googleAds = flattenEverything(googleAdNodeList);
    if (googleAds.length) setLocalStorageItem(googleAds.length);
    googleAds.forEach((ads) => removeAdsLogic(ads));
    googleAdNodeList = [];
  }
}

document.addEventListener('DOMNodeInserted', removeAd);
