const {test}=require('node:test');const assert=require('node:assert/strict');const {validateProposal}=require('../proposal');
const source='Send Maya the deck on 2026-10-02.';
const base={summary:'Prepare a follow-up',title:'Send deck',person:'Maya',due:'2026-10-02',draft:'Hi Maya, following up on the deck.',evidence:source,questions:[]};
test('keeps grounded fields',()=>assert.deepEqual(validateProposal(base,source),base));
test('rejects invented evidence',()=>assert.throws(()=>validateProposal({...base,evidence:'Invented conversation'},source)));
test('removes invented identity and date',()=>{const p=validateProposal({...base,person:'Alex',due:'2026-12-01'},source);assert.equal(p.person,'');assert.equal(p.due,'');assert.equal(p.questions.length,2);});
test('rejects malformed output',()=>{assert.throws(()=>validateProposal({},source));assert.throws(()=>validateProposal({...base,questions:[{}]},source));});
