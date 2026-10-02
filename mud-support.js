// Special scene after three consecutive unsuccessful attempts.
(() => {
 const style=document.createElement('style');
 style.textContent=`
 .cinematic.mud-scene{background:linear-gradient(#8ed2e4 0 53%,#83b55d 53% 69%,#9a6a3e 69%);overflow:hidden}
 .cinematic.mud-scene:before{content:'';position:absolute;left:-8%;right:-8%;bottom:-13%;height:44%;border-radius:50% 48% 0 0;background:radial-gradient(ellipse at 20% 25%,#c89a62 0 4%,transparent 4.5%),radial-gradient(ellipse at 65% 32%,#674124 0 6%,transparent 6.5%),radial-gradient(ellipse at 46% 70%,#80512d 0 7%,transparent 7.5%),#a87543;box-shadow:inset 0 18px 25px #5c3a2055}
 .mud-actors{position:absolute;inset:0;z-index:2}.mud-girl{position:absolute;left:30%;bottom:10%;width:clamp(105px,18vw,235px);height:auto;filter:drop-shadow(0 8px 5px #2c261d44)}
 .mud-girl .girl{position:static;width:100%;height:auto}.mud-pig{position:absolute;right:27%;bottom:10%;width:clamp(115px,20vw,250px);animation:mud-stomp .32s ease-in-out 7 alternate;transform-origin:50% 92%}.mud-pig .pig{width:100%;height:auto}.mud-pig .calm-eye{display:none}.mud-pig .cry-eye{display:block}
 .mud-puddle{position:absolute;right:22%;bottom:7%;width:30%;height:12%;border-radius:50%;background:#654025;box-shadow:inset 0 9px 12px #3e2818aa;animation:puddle-grow .8s .3s both}
 .mud-splash{position:absolute;inset:0;z-index:4;pointer-events:none}.mud-splash i{position:absolute;left:62%;top:70%;width:var(--s);height:calc(var(--s)*.72);border-radius:50%;background:#694326;border:2px solid #9b6b3e;animation:mud-fly 1.05s var(--d) cubic-bezier(.18,.7,.35,1) both;transform:translate(-50%,-50%)}
 .mud-stain{position:absolute;z-index:5;border-radius:47% 53% 56% 44%;background:#674126dd;border:2px solid #3e2818aa;opacity:0;animation:stain-appear .2s var(--d) forwards}.mud-stain.s1{left:35%;bottom:28%;width:6%;height:8%;--d:.8s}.mud-stain.s2{left:40%;bottom:19%;width:4%;height:7%;--d:1.15s}.mud-stain.s3{left:32%;bottom:41%;width:3.5%;height:5%;--d:1.45s}.mud-stain.s4{left:45%;bottom:32%;width:2.8%;height:4%;--d:1.7s}
 .mud-scene .cinematic-copy{top:3%;z-index:8}.mud-note{position:absolute;left:50%;bottom:3%;z-index:8;transform:translateX(-50%);width:min(740px,90%);padding:8px 14px;border-radius:18px;background:#fff4d9e8;color:#56391f;text-align:center;font-size:clamp(15px,2.2vw,25px);font-weight:900}
 @keyframes mud-stomp{0%{transform:translateY(0) rotate(-3deg)}55%{transform:translateY(-12%) rotate(4deg)}100%{transform:translateY(5%) scaleY(.9) rotate(-4deg)}}
 @keyframes puddle-grow{from{transform:scale(.4);opacity:.2}to{transform:scale(1);opacity:1}}
 @keyframes mud-fly{0%{transform:translate(-50%,-50%) scale(.4);opacity:0}12%{opacity:1}60%{transform:translate(calc(var(--x)*1px),calc(var(--y)*-1px)) rotate(220deg) scale(1)}100%{transform:translate(calc(var(--x)*1.35px),calc(var(--y)*-.35px)) rotate(380deg) scale(.75);opacity:.15}}
 @keyframes stain-appear{to{opacity:1;transform:rotate(18deg)}}
 @media(max-width:600px){.mud-girl{left:22%;bottom:9%}.mud-pig{right:18%;bottom:9%}.mud-puddle{right:12%;width:40%}.mud-note{font-size:14px;padding:6px 8px}.mud-scene .cinematic-copy{font-size:clamp(18px,5vw,26px)}}
 @media(prefers-reduced-motion:reduce){.mud-pig,.mud-splash i,.mud-puddle{animation:none}.mud-stain{opacity:1;animation:none}}
 `;
 document.head.append(style);

 function mudSound(){
  if(!prefs.sound)return;
  try{
   audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume();
   const now=audioCtx.currentTime;
   [0,.3,.6].forEach((delay,i)=>{
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';
    o.frequency.setValueAtTime(105-i*9,now+delay);o.frequency.exponentialRampToValueAtTime(48,now+delay+.22);
    g.gain.setValueAtTime(.0001,now+delay);g.gain.exponentialRampToValueAtTime(.075,now+delay+.02);g.gain.exponentialRampToValueAtTime(.0001,now+delay+.28);
    o.connect(g);g.connect(audioCtx.destination);o.start(now+delay);o.stop(now+delay+.3);
   });
  }catch(e){}
 }
 function muddyMeltdown(next){
  clearWork();state='mud';stage.className='mud-event';
  const drops=Array.from({length:34},(_,i)=>`<i style="--s:${9+i%5*7}px;--d:${(i%7)*.08}s;--x:${-260+(i*83)%520};--y:${85+(i*47)%250}"></i>`).join('');
  cinematic.className='cinematic show mud-scene';
  cinematic.innerHTML=`<div class="cinematic-copy">${sceneText(tx('小豬真的生氣了！','Das Schweinchen ist richtig sauer!'))}<span class="cinematic-sub">${sceneText(tx('牠用力跺腳，泥巴飛得到處都是！','Es stampft kräftig – der Schlamm spritzt überall hin!'))}</span></div><div class="mud-puddle"></div><div class="mud-actors"><div class="mud-girl">${girl}</div><div class="mud-pig">${pig}</div></div><div class="mud-splash">${drops}</div><i class="mud-stain s1"></i><i class="mud-stain s2"></i><i class="mud-stain s3"></i><i class="mud-stain s4"></i><div class="mud-note">${tx('糟糕！小女孩漂亮的洋裝也沾滿泥巴了。','Oh nein! Jetzt ist auch das schöne Kleid des Mädchens voller Schlamm.')}</div>`;
  mudSound();later(()=>{game.failChain=0;hideCinema();next();},4200);
 }
 const originalChoose=choose;
 choose=function(value,door,button){
  if(state==='playing'&&game&&game.mode!=='timed'){
   const q=game.qs[game.index];if(value===q.a*q.b)game.failChain=0;
  }
  return originalChoose(value,door,button);
 };
 const originalFail=fail;
 fail=function(kind){
  if(!['playing','approach'].includes(state)||!game||game.mode==='timed')return originalFail(kind);
  game.failChain=(game.failChain||0)+1;
  if(game.failChain<3)return originalFail(kind);
  lock();game.misses++;game.streak=0;if(kind==='timeout')game.timeouts++;
  muddyMeltdown(round);
 };
})();
