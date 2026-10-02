// Unlock Web Audio during a real gesture, before countdown and scene timers.
(() => {
 let unlocked=false, musicEnabled=true, musicTimer=null, cursor=0, nextNote=0;
 const voices=new Set();
 try { musicEnabled=localStorage.getItem('pig-home-music')!=='off'; } catch(e) {}
 const musicButton=document.createElement('button');
 musicButton.id='music'; musicButton.style.cssText='min-height:44px;padding:9px 12px;margin-left:6px';
 document.querySelector('header > div').append(musicButton);
 function labels(){
  const de=language==='de';
  musicButton.textContent=de?(musicEnabled?'♫ Musik an':'♫ Musik aus'):(musicEnabled?'♫ 音樂開':'♫ 音樂關');
  musicButton.setAttribute('aria-label',de?'Hintergrundmusik ein- oder ausschalten':'切換背景音樂');
  musicButton.setAttribute('aria-pressed',String(musicEnabled));
  const b=document.querySelector('#sound');
  b.textContent=de?(prefs.sound?'🔊 Ton an':'🔇 Ton aus'):(prefs.sound?'🔊 音效開':'🔇 音效關');
  b.setAttribute('aria-pressed',String(prefs.sound));
 }
 function context(){
  const Constructor=window.AudioContext||window.webkitAudioContext;
  if(!Constructor)return null;
  if(!audioCtx||audioCtx.state==='closed')audioCtx=new Constructor();
  return audioCtx;
 }
 function stopMusic(){
  clearInterval(musicTimer);musicTimer=null;
  for(const v of voices){try{v.stop();}catch(e){}}
  voices.clear();
 }
 const melody=[72,76,79,76,74,77,81,77,71,74,79,74,72,76,79,67,
               69,72,76,72,65,69,72,69,67,71,74,71,72,76,79,76];
 const bass=[48,53,55,48,45,53,55,48];
 function note(midi,at,duration,volume){
  const ctx=audioCtx,o=ctx.createOscillator(),g=ctx.createGain();
  o.type='sine';o.frequency.value=440*Math.pow(2,(midi-69)/12);
  g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(volume,at+.035);
  g.gain.exponentialRampToValueAtTime(.0001,at+duration);
  o.connect(g);g.connect(ctx.destination);voices.add(o);
  o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect();};
  o.start(at);o.stop(at+duration+.03);
 }
 function schedule(){
  if(document.hidden||state==='paused'){stopMusic();return;}
  if(!audioCtx||audioCtx.state!=='running')return;
  while(nextNote<audioCtx.currentTime+.25){
   // Quiet harp-like arpeggios leave room for answer and firework effects.
   const volume=activeNarration?.003:.011;
   note(melody[cursor%melody.length],nextNote,.95,volume);
   if(cursor%4===0)note(bass[Math.floor(cursor/4)%bass.length],nextNote,2,volume*.65);
   cursor++;nextNote+=.58;
  }
 }
 function syncMusic(){
  if(!musicEnabled||!unlocked||document.hidden||state==='paused'){stopMusic();return;}
  if(musicTimer||!audioCtx||audioCtx.state!=='running')return;
  nextNote=audioCtx.currentTime+.06;schedule();musicTimer=setInterval(schedule,100);
 }
 function unlock(){
  try{
   const ctx=context();if(!ctx)return;
   // iOS needs resume and the first source start inside the gesture itself.
   const source=ctx.createBufferSource();source.buffer=ctx.createBuffer(1,1,ctx.sampleRate);
   source.connect(ctx.destination);source.start();
   unlocked=true;ctx.resume().then(syncMusic).catch(()=>{});
  }catch(e){}
 }
 document.addEventListener('pointerdown',unlock,{capture:true});
 document.addEventListener('click',unlock,{capture:true});
 document.addEventListener('keydown',unlock,{capture:true});
 musicButton.onclick=()=>{musicEnabled=!musicEnabled;try{localStorage.setItem('pig-home-music',musicEnabled?'on':'off');}catch(e){}labels();syncMusic();};
 document.querySelector('#sound').onclick=()=>{
  prefs.sound=!prefs.sound;if(!prefs.sound)stopNarration();
  try{localStorage.setItem('pig-home-v2',JSON.stringify(prefs));}catch(e){}
  labels();if(prefs.sound)sound('win');
 };
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMusic();else if(unlocked)unlock();});
 const originalChrome=updateLanguageChrome;
 updateLanguageChrome=function(){originalChrome();labels();};
 const originalPause=pause;
 pause=function(){originalPause();syncMusic();};
 // Resume clicks run their existing handler before music checks the updated state.
 document.addEventListener('click',()=>queueMicrotask(syncMusic));
 labels();
})();
