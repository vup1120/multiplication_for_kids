// Anonymous usage counting with our own backend (backend/ in this repo, a Cloudflare Worker).
// No cookies and nothing stored on the device; the server keeps only daily totals.
// Set this to the deployed worker URL, e.g. 'https://pig-home-stats.<account>.workers.dev'.
// While it is empty nothing is sent.
const STATS_ENDPOINT = '';

function track(name){
 if(!STATS_ENDPOINT || /^(localhost|127\.|\[::1\])/.test(location.hostname)) return;
 const lang = typeof language === 'string' ? language : 'zh';
 const body = JSON.stringify({n: name, l: lang});
 try{
  // text/plain keeps this a simple CORS request (no preflight) and sendBeacon survives page closes.
  if(!(navigator.sendBeacon && navigator.sendBeacon(STATS_ENDPOINT + '/e', new Blob([body], {type: 'text/plain'}))))
   fetch(STATS_ENDPOINT + '/e', {method: 'POST', body, keepalive: true, headers: {'Content-Type': 'text/plain'}}).catch(() => {});
 }catch(e){}
}
