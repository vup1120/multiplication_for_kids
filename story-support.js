
// Real recordings only. Set src to a repository-relative audio URL after upload.
const STORY_VOICES = {
 princess: {src:null, text:'公主魔法變身！小豬送妳皇冠和寶石！'},
 jewels: {src:null, text:'珠寶雨來啦！滿滿的寶石，送給妳！'},
 angry: {src:null, text:'哼！你要認真一點啦！看清楚，再試一次！'},
 chase: {src:null, text:'哇！母雞追來啦！快跑！'},
 timeout: {src:null, text:'砰！時間到！小豬生氣啦！'},
 finish: {src:null, text:'耶！任務成功！謝謝你帶我回家！'}
};
const STORY_ZHUYIN = {
 公:'ㄍㄨㄥ',主:'ㄓㄨˇ',魔:'ㄇㄛˊ',法:'ㄈㄚˇ',變:'ㄅㄧㄢˋ',身:'ㄕㄣ',
 小:'ㄒㄧㄠˇ',豬:'ㄓㄨ',送:'ㄙㄨㄥˋ',妳:'ㄋㄧˇ',你:'ㄋㄧˇ',
 皇:'ㄏㄨㄤˊ',冠:'ㄍㄨㄢ',和:'ㄏㄢˋ',寶:'ㄅㄠˇ',石:'ㄕˊ',珠:'ㄓㄨ',
 雨:'ㄩˇ',來:'ㄌㄞˊ',啦:'ㄌㄚ˙',滿:'ㄇㄢˇ',的:'ㄉㄜ˙',給:'ㄍㄟˇ',
 哼:'ㄏㄥ',要:'ㄧㄠˋ',認:'ㄖㄣˋ',真:'ㄓㄣ',一:'ㄧˋ',點:'ㄉㄧㄢˇ',
 看:'ㄎㄢˋ',清:'ㄑㄧㄥ',楚:'ㄔㄨˇ',再:'ㄗㄞˋ',試:'ㄕˋ',次:'ㄘˋ',
 哇:'ㄨㄚ',母:'ㄇㄨˇ',雞:'ㄐㄧ',追:'ㄓㄨㄟ',快:'ㄎㄨㄞˋ',跑:'ㄆㄠˇ',
 砰:'ㄆㄥ',時:'ㄕˊ',間:'ㄐㄧㄢ',到:'ㄉㄠˋ',生:'ㄕㄥ',氣:'ㄑㄧˋ',
 答:'ㄉㄚˊ',對:'ㄉㄨㄟˋ',題:'ㄊㄧˊ',新:'ㄒㄧㄣ',紀:'ㄐㄧˋ',錄:'ㄌㄨˋ',最:'ㄗㄨㄟˋ',高:'ㄍㄠ',挑:'ㄊㄧㄠˇ',戰:'ㄓㄢˋ',
 任:'ㄖㄣˋ',務:'ㄨˋ',成:'ㄔㄥˊ',功:'ㄍㄨㄥ',耶:'ㄧㄝ',全:'ㄑㄩㄢˊ',部:'ㄅㄨˋ',家:'ㄐㄧㄚ',謝:'ㄒㄧㄝˋ',帶:'ㄉㄞˋ',我:'ㄨㄛˇ',回:'ㄏㄨㄟˊ'
};
// Traditional right-side Zhuyin: syllable stacked vertically, tone beside it.
function storyText(text){
 return '<span class="zhuyin-text" aria-label="'+safe(text)+'">'+Array.from(text).map((ch,i)=>{
  let reading=STORY_ZHUYIN[ch];
  if(!reading)return '<span aria-hidden="true">'+safe(ch)+'</span>';
  if(ch==='一'&&text[i+1]==='次')reading='ㄧˊ';
  const tone=(reading.match(/[ˊˇˋ˙]/)||[''])[0];
  const symbols=reading.replace(/[ˊˇˋ˙]/g,'');
  return '<span class="zy-unit" aria-hidden="true"><span class="zy-character">'+safe(ch)+'</span><span class="zy-reading"><span class="zy-symbols">'+Array.from(symbols).map(s=>'<span>'+s+'</span>').join('')+'</span>'+(tone?'<span class="zy-tone'+(tone==='˙'?' zy-neutral':'')+'">'+tone+'</span>':'')+'</span></span>';
 }).join('')+'</span>';
}
let activeNarration=null;
function stopNarration(){if(activeNarration)activeNarration();}
function narrate(key){
 stopNarration();
 const src=STORY_VOICES[key]?.src;
 if(!prefs.sound||!src||(typeof language!=='undefined'&&language!=='zh'))return Promise.resolve();
 return new Promise(resolve=>{
  const clip=new Audio(src);
  let watchdog;
  const done=()=>{clearTimeout(watchdog);clip.pause();clip.onended=null;clip.onerror=null;if(activeNarration===done)activeNarration=null;resolve();};
  activeNarration=done;
  clip.onended=done;clip.onerror=done;
  watchdog=setTimeout(done,45000);
  clip.play().catch(done);
 });
}
function storyThen(key,minMs,next){
 const token=sequence;
 Promise.all([narrate(key),new Promise(resolve=>setTimeout(resolve,minMs))]).then(()=>{if(token===sequence)next();});
}
