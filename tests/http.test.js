const {test,after}=require('node:test');const assert=require('node:assert/strict');
const base='http://127.0.0.1:8791';
test('preview serves workspace but does not expose server source',async()=>{assert.equal((await fetch(base+'/app.html')).status,200);assert.equal((await fetch(base+'/preview-server.js')).status,404);});
test('generation rejects other sites and invalid methods',async()=>{assert.equal((await fetch(base+'/api/prepare')).status,405);assert.equal((await fetch(base+'/api/prepare',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json'},body:'{}'})).status,403);});
test('empty prompt has useful validation response',async()=>{const r=await fetch(base+'/api/prepare',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({prompt:'x'})});assert.equal(r.status,400);assert.match((await r.json()).error,/more context/);});
