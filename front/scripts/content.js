const adAttributeList = [
  '[data-google-av-adk]',
  '[data-adfit-click]',
  '.adsbygoogle',
  '.kakao_ad_area',
];

const isIterable = (obj) => typeof obj[Symbol.iterator] === 'function';
const flattenEverything = (arr) =>
  arr.flatMap((value) => (isIterable(value) ? [...value] : value));

function removeAd(event) {
  const googleAdNodeList = adAttributeList.map((attribute) => {
    return document.querySelectorAll(attribute);
  });
  if (googleAdNodeList.length) {
    const googleAds = flattenEverything(googleAdNodeList);
    googleAds.forEach((ads) => {
      if (ads.clientHeight === ads.parentElement.clientHeight)
        ads.parentElement.remove();
      else ads.remove();

      // if (ads.clientHeight === ads.parentElement.clientHeight)
      //   ads.parentElement.style.border = '10px solid white';
      // else ads.style.border = '10px solid white';
    });
  }
}

document.addEventListener('DOMNodeInserted', removeAd);
