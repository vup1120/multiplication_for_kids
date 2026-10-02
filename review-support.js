// A read-only revision sheet available from the game's start screen.
(() => {
 const style=document.createElement('style');
 style.textContent=`
 .review-open{display:block;width:100%;margin:14px 0;background:#e5edf6;color:#294767;box-shadow:0 4px 0 #b0c2d5}
 .review-dialog{width:min(960px,calc(100% - 24px));max-height:90svh;padding:0;border:3px solid #c5a767;border-radius:22px;background:#fff9ec;color:#263e39;box-shadow:0 20px 80px #152e4966}
 .review-dialog::backdrop{background:#152e49a6}
 .review-heading{position:sticky;top:0;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;background:#fff4d9;border-bottom:2px solid #e1c994}
 .review-heading h2{margin:0;font-size:clamp(22px,5vw,30px)}
 .review-close{flex-shrink:0;min-width:44px;min-height:44px;padding:8px 14px;font-size:24px}
 .review-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;padding:18px}
 .review-card{padding:14px;border:2px solid #d5dfe3;border-radius:16px;background:#fffefd;text-align:center}
 .review-card:nth-child(3n+2){background:#fff5ed;border-color:#ebd1bd}
 .review-card:nth-child(3n){background:#eff7ef;border-color:#c5dac6}
 .review-card h3{margin:0 0 10px;color:#294767;font-size:22px}
 .review-card ol{list-style:none;padding:0;margin:0;display:grid;gap:5px}
 .review-card li{font-size:clamp(20px,3vw,25px);line-height:1.45;font-variant-numeric:tabular-nums;white-space:nowrap}
 .review-card b{color:#9a512d}
 .review-footer{padding:0 18px 20px;text-align:center}
 @media(max-width:600px){.review-grid{grid-template-columns:repeat(2,minmax(0,1fr));padding:12px;gap:10px}.review-card{padding:10px 5px}.review-card h3{font-size:19px}.review-card li{font-size:20px}.review-heading{padding:12px}}
 @media(max-width:340px){.review-grid{grid-template-columns:1fr}}
 `;
 document.head.append(style);
 const dialog=document.createElement('dialog');
 dialog.className='review-dialog';dialog.setAttribute('aria-labelledby','review-title');
 document.body.append(dialog);
 function showReview(){
  const de=language==='de',limit=maxTable(),symbol=de?'·':'×';
  dialog.innerHTML=`<div class="review-heading"><h2 id="review-title">📖 ${de?'Das kleine Einmaleins':'九九乘法表'}</h2><button type="button" class="review-close" aria-label="${de?'Schließen':'關閉乘法表'}" autofocus>×</button></div><div class="review-grid">${Array.from({length:limit},(_,i)=>{
   const a=i+1;
   return `<section class="review-card"><h3>${de?`${a}er-Reihe`:`${a} 的乘法`}</h3><ol>${Array.from({length:limit},(_,j)=>`<li>${a} ${symbol} ${j+1} = <b>${a*(j+1)}</b></li>`).join('')}</ol></section>`;
  }).join('')}</div><div class="review-footer"><button type="button" class="primary review-return">${de?'Zurück zum Spiel':'複習好了，回到遊戲！'}</button></div>`;
  dialog.querySelector('.review-close').onclick=()=>dialog.close();
  dialog.querySelector('.review-return').onclick=()=>dialog.close();
  dialog.showModal();dialog.scrollTop=0;
 }
 window.openMultiplicationReview=showReview;
})();
