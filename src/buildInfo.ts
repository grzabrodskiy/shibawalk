export const APP_BUILD_ID = __APP_BUILD_ID__;

export function applyBuildMarker() {
  document.documentElement.dataset.buildId = APP_BUILD_ID;
  document.documentElement.dataset.buildStamp = `${Date.now()}`;
  window.sessionStorage.setItem('shiba-walk-build-id', APP_BUILD_ID);
}
