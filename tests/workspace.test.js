const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
function setup(){
 const elements=new Map(),storage=new Map(),downloads=[],clipboard=[];
 class El{constructor(){this.value='';this.checked=false;this.hidden=false;this.children=[];this.events={};this.dataset={};this.textContent='';this.style={};this.classList={add(){}};}addEventListener(k,fn){this.events[k]=fn;}append(...n){this.children.push(...n);}replaceChildren(...n){this.children=n;}setAttribute(){}focus(){}scrollIntoView(){}reset(){for(const f of ['title','person','due','source','draft'])get(f).value='';}click(){if(this.download)downloads.push(this.download);return this.events.click?.({preventDefault(){}});}}
 const get=id=>{if(!elements.has(id))elements.set(id,new El());return elements.get(id);};
 const filters=['all','review','waiting','done'].map(f=>{const e=new El();e.dataset.filter=f;return e;});
 get('review').hidden=true;
 const c={document:{getElementById:get,createElement:()=>new El(),querySelectorAll:()=>filters},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},navigator:{clipboard:{writeText:async s=>clipboard.push(s)}},crypto:{randomUUID:()=>String(Math.random())},Blob,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},setTimeout:fn=>fn(),window:{addEventListener(){}},AbortSignal,fetch:async()=>{throw Error('Model offline');},Date,console};
 vm.createContext(c);vm.runInContext(fs.readFileSync(require.resolve('../workspace.js'),'utf8'),c);
 return {get,storage,downloads,filters,c,fire:async(id,event='click')=>get(id).events[event]({preventDefault(){}}),tasks:()=>JSON.parse(vm.runInContext('JSON.stringify(tasks)',c))};
}
test('manual create, edit/discard, storage and export',async()=>{
 const s=setup();await s.fire('manual');s.get('title').value='Follow up';s.get('draft').value='Hello';await s.fire('task-form','submit');assert.equal(s.tasks().length,1);assert.equal(s.storage.size,0);
 s.get('remember').checked=true;await s.fire('remember','change');assert.equal(s.storage.size,1);
 await s.fire('export');assert.deepEqual(s.downloads,['nexus-next-steps.json']);
 await s.fire('manual');s.get('title').value='Discarded';await s.fire('cancel');assert.equal(s.tasks().length,1);
 s.get('remember').checked=false;await s.fire('remember','change');assert.equal(s.storage.size,0);assert.equal(s.tasks().length,1);
});
test('restore validates input, deduplicates and preserves existing work',async()=>{
 const s=setup(),item={id:'one',title:'Restore',person:'',due:'',source:'',draft:'Hi',status:'review'};
 async function restore(data){s.get('import-file').files=[{size:100,text:async()=>JSON.stringify(data)}];await s.fire('import-file','change');}
 await restore([item]);await restore([item]);assert.equal(s.tasks().length,1);
 await restore({bad:true});assert.match(s.get('notice').textContent,/not a valid/);assert.equal(s.tasks().length,1);
 await restore([{...item,id:'bad',questions:'invalid'}]);assert.match(s.get('notice').textContent,/not a valid/);
});
test('model failure restores controls and leaves manual path available',async()=>{
 const s=setup();await new Promise(r=>setImmediate(r));vm.runInContext('aiAvailable=true',s.c);s.get('prompt').value='Follow up with Maya';await s.fire('prompt-form','submit');assert.equal(s.get('prepare').disabled,false);assert.equal(s.get('manual').disabled,false);assert.equal(s.get('notice').textContent,'Model offline');assert.equal(s.tasks().length,0);
});
