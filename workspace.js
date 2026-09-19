'use strict';
const KEY='nexus-workspace-v1', $=id=>document.getElementById(id);
const fields=['title','person','due','source','draft'];
let tasks=[],filter='all',editing=null,proposal=null,pending=false,aiAvailable=false;
async function configureRuntime(){
 try{const r=await fetch('/runtime.json',{cache:'no-store'});if(!r.ok)throw Error();const config=await r.json();aiAvailable=config.aiAvailable===true;}catch{aiAvailable=false;}
 $('prepare').disabled=!aiAvailable;
 $('runtime-status').textContent=aiAvailable?'Drafted on this Mac · Review before using':'Online preview · AI drafting is not connected';
 if(!aiAvailable){$('prepare').textContent='AI drafting unavailable';$('manual').textContent='Create a follow-up';$('manual').classList.add('primary');}
 else $('runtime-detail').textContent='AI drafts are prepared by the model on this Mac. Account sign-in is available; workspace notes do not sync. Notes stay in this browser unless exported. Messages and notifications are not sent.';
}
configureRuntime();
function message(s){$('notice').textContent=s;}
function validTask(t){return t&&typeof t.id==='string'&&fields.every(f=>typeof t[f]==='string'&&t[f].length<=12000)&&t.title.trim()&&['review','waiting','done'].includes(t.status)&&(!t.due||/^\d{4}-\d{2}-\d{2}$/.test(t.due))&&(!t.questions||Array.isArray(t.questions)&&t.questions.every(q=>typeof q==='string'))&&(!t.summary||typeof t.summary==='string')&&(!t.evidence||typeof t.evidence==='string');}
try{const raw=localStorage.getItem(KEY);if(raw){const data=JSON.parse(raw);if(!Array.isArray(data)||!data.every(validTask))throw Error();tasks=data;$('remember').checked=true;}}catch{message('Saved data could not be loaded. Restore a backup, or work in this session.');}
function save(){try{if($('remember').checked)localStorage.setItem(KEY,JSON.stringify(tasks));else localStorage.removeItem(KEY);return true;}catch{message('Browser saving failed. Export a backup before closing.');return false;}}
function node(tag,text,cls){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;}
function button(label,fn){const b=node('button',label);b.type='button';b.addEventListener('click',fn);return b;}
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function openReview(t=null){editing=t?.id||null;proposal=t||null;$('review').hidden=false;$('review-label').textContent=t?.id?'Edit follow-up':'Review your next step';for(const f of fields)$(f).value=t?.[f]||'';$('summary').textContent=t?.summary||'Check the recipient, wording, and date before saving.';$('questions').replaceChildren(...(t?.questions||[]).map(q=>node('li',q)));$('evidence').textContent=t?.evidence?`Supporting excerpt: ${t.evidence}`:'';$('review').scrollIntoView({behavior:'smooth',block:'nearest'});$('draft').focus();}
function render(){
 $('count').textContent=`${tasks.filter(t=>t.status!=='done').length} open`;
 $('tasks').replaceChildren();
 const shown=tasks.filter(t=>filter==='all'||t.status===filter).sort((a,b)=>Number(!!b.pinned)-Number(!!a.pinned));
 if(!shown.length)$('tasks').append(node('div',tasks.length?'Nothing in this view.':'Your follow-ups will appear here. Start with a conversation above.','empty'));
 for(const t of shown){
  const card=node('article','','panel task'+(t.pinned?' pinned':''));
  const top=node('div','','panel-top');top.append(node('span',{review:'To send',waiting:'Waiting for reply',done:'Done'}[t.status],'badge'),button(t.pinned?'Unpin':'Pin',()=>{t.pinned=!t.pinned;save();render();}));card.append(top,node('h3',t.title));
  card.append(node('div',[t.person||'Recipient not set',t.due&&`Follow up ${t.due}`].filter(Boolean).join(' · '),t.due&&t.due<today()&&t.status!=='done'?'small overdue':'small'));
  if(t.draft)card.append(node('p',t.draft,'note'));
  if(t.source){const d=document.createElement('details');d.append(node('summary','Conversation context'),node('p',t.source));card.append(d);}
  const actions=node('div','','actions');actions.append(button('Edit',()=>openReview(t)));
  if(t.draft)actions.append(button('Copy message',async()=>{try{await navigator.clipboard.writeText(t.draft);message('Copied. Paste it into your conversation, then mark it sent here.');}catch{message('Copy is unavailable. Select the message text and copy it manually.');}}));
  if(t.status==='review')actions.append(button('I sent it',()=>{t.status='waiting';save();render();message('Marked as sent by you. Nexus did not send a message.');}));
  if(t.status==='waiting')actions.append(button('Reply received',()=>{t.status='done';save();render();message('Follow-up completed.');}));
  if(t.status!=='done')actions.append(button('Mark done',()=>{t.status='done';save();render();}));
  else actions.append(button('Reopen',()=>{t.status='review';save();render();}));
  card.append(actions);$('tasks').append(card);
 }
}
$('prompt-form').addEventListener('submit',async e=>{
 e.preventDefault();if(pending)return;if(!aiAvailable){message('AI drafting is not connected on this deployment. Use Create a follow-up to write and track a message.');return;}
 const prompt=$('prompt').value.trim();if(prompt.length<8){message('Add a little more detail about the conversation.');return;}
 pending=true;$('prepare').disabled=true;$('manual').disabled=true;$('example').disabled=true;$('prepare').textContent='Preparing…';message('Reading your notes and preparing a draft on this Mac. This may take a minute.');
 try{const r=await fetch('/api/prepare',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt}),signal:AbortSignal.timeout(100000)});const data=await r.json();if(!r.ok)throw Error(data.error||'Draft unavailable.');openReview({...data.proposal,source:prompt});message('Draft ready. Confirm missing details and edit anything before saving.');}
 catch(err){message(err.name==='TimeoutError'?'Drafting timed out. Try again or write one yourself.':err.message);}
 finally{pending=false;$('prepare').disabled=false;$('manual').disabled=false;$('example').disabled=false;$('prepare').textContent='Prepare follow-up ↗';}
});
$('example').addEventListener('click',()=>{$('prompt').value='I spoke with Maya about liquidity partners. I promised to send our deck on Friday. Draft a short follow-up asking which types of partners would be most useful.';$('prompt').focus();});
$('manual').addEventListener('click',()=>openReview({source:$('prompt').value.trim()}));
$('task-form').addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(fields.map(f=>[f,$(f).value.trim()]));if(!data.title||!data.draft){message('Add a next step and a message before saving.');return;}
 if(editing){const t=tasks.find(t=>t.id===editing);if(!t){message('That follow-up is no longer available.');return;}Object.assign(t,data);}
 else tasks.unshift({...data,id:crypto.randomUUID(),status:'review',pinned:false,evidence:proposal?.evidence||''});
 editing=null;proposal=null;$('review').hidden=true;$('task-form').reset();if(save())message($('remember').checked?'Follow-up saved on this browser.':'Follow-up saved for this session. Enable browser saving or export a backup to keep it.');render();});
$('cancel').addEventListener('click',()=>{editing=null;proposal=null;$('task-form').reset();$('review').hidden=true;message('Changes discarded. Saved follow-ups are unchanged.');});
$('remember').addEventListener('change',()=>{if(save())message($('remember').checked?'Follow-ups will stay on this browser.':'Browser saving is off. Export before closing to keep your work.');});
for(const b of document.querySelectorAll('[data-filter]'))b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});
$('export').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(tasks,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='nexus-next-steps.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Backup exported. Keep it somewhere private.');});
$('import').addEventListener('click',()=>$('import-file').click());
$('import-file').addEventListener('change',async()=>{const f=$('import-file').files[0];if(!f)return;try{if(f.size>2000000)throw Error('Backup is too large (maximum 2 MB).');const data=JSON.parse(await f.text());if(!Array.isArray(data)||data.length>1000||!data.every(validTask))throw Error('This is not a valid Nexus backup.');const ids=new Set(tasks.map(t=>t.id));let added=0;for(const t of data)if(!ids.has(t.id)){tasks.push({...t,pinned:t.pinned===true});ids.add(t.id);added++;}if(save())message(`Restored ${added} follow-ups. Existing items were preserved.`);render();}catch(e){message(e instanceof SyntaxError?'Could not read that JSON backup.':e.message);}finally{$('import-file').value='';}});
window.addEventListener('beforeunload',e=>{if((tasks.length&&!$('remember').checked)||!$('review').hidden||pending){e.preventDefault();e.returnValue='';}});
render();
