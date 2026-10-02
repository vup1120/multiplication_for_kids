// Anonymous usage counting with GoatCounter (no cookies, no personal data, no consent banner needed).
// Fill in the site code from https://www.goatcounter.com (e.g. 'pig-home' for pig-home.goatcounter.com).
// While it is empty nothing is sent.
const GOATCOUNTER_CODE = '';

let statsQueue = [];
function track(name){
 if(!GOATCOUNTER_CODE)return;
 const lang = typeof language === 'string' ? language : 'zh';
 const send = () => window.goatcounter.count({path: name + '-' + lang, title: name + ' (' + lang + ')', event: true});
 try{ window.goatcounter && window.goatcounter.count ? send() : statsQueue.push(send); }catch(e){}
}
if(GOATCOUNTER_CODE && !/^(localhost|127\.|\[::1\])/.test(location.hostname)){
 const script = document.createElement('script');
 script.async = true;
 script.src = 'https://gc.zgo.at/count.js';
 script.dataset.goatcounter = 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/count';
 script.onload = () => { statsQueue.forEach(send => { try{ send(); }catch(e){} }); statsQueue = []; };
 document.head.appendChild(script);
}
