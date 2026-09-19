'use strict';
function validateProposal(p,source) {
  if(!p || typeof p!=='object') throw new Error('Invalid proposal');
  for(const k of ['summary','title','person','due','draft','evidence']) if(typeof p[k]!=='string') throw new Error('Missing proposal field');
  if(!p.title.trim()||!p.draft.trim()||!p.evidence.trim()||!source.includes(p.evidence))throw new Error('Ungrounded proposal');
  if(!Array.isArray(p.questions)||p.questions.some(q=>typeof q!=='string'))throw new Error('Invalid questions');
  const out=Object.fromEntries(['summary','title','person','due','draft','evidence'].map(k=>[k,p[k].trim()]));
  out.questions=p.questions.slice(0,6).map(q=>q.slice(0,500));
  if(out.person&&!source.toLowerCase().includes(out.person.toLowerCase())){out.person='';out.questions.push('Who should receive this follow-up?');}
  if(out.due&&(!/^\d{4}-\d{2}-\d{2}$/.test(out.due)||!source.includes(out.due)||new Date(out.due+'T12:00:00Z').toISOString().slice(0,10)!==out.due)){out.due='';out.questions.push('Confirm the due date.');}
  if(out.title.length>180||out.draft.length>12000)throw new Error('Proposal too long');
  return out;
}
module.exports={validateProposal};
