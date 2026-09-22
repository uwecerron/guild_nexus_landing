'use strict';
const fs = require('node:fs');
function validate(plan) {
  const errors = [], text = value => typeof value === 'string' && value.trim().length > 0;
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) return ['Plan must be an object.'];
  if (plan.version !== 1 || plan.mode !== 'proposal') errors.push('Expected version 1 and mode proposal.');
  if (!text(plan.workspace) || !text(plan.request)) errors.push('Workspace and user request are required.');
  if (!Array.isArray(plan.evidence) || !plan.evidence.length) errors.push('Evidence is required.');
  const evidence = new Set();
  for (const e of Array.isArray(plan.evidence) ? plan.evidence : []) {
    if (!e || !text(e.id) || !text(e.source) || !text(e.excerpt) || evidence.has(e.id)) errors.push('Evidence needs a unique ID, source and excerpt.');
    else evidence.add(e.id);
  }
  if (!Array.isArray(plan.actions) || !plan.actions.length || plan.actions.length > 100) errors.push('Provide 1–100 actions.');
  const keys = new Set();
  for (const [i, a] of (Array.isArray(plan.actions) ? plan.actions : []).entries()) {
    const prefix = `Action ${i + 1}: `;
    if (!a || typeof a !== 'object') { errors.push(prefix + 'invalid action.'); continue; }
    if (!text(a.key) || keys.has(a.key)) errors.push(prefix + 'unique operation key required.');
    keys.add(a.key);
    if (!['create_task', 'append_note', 'update_fields'].includes(a.operation)) errors.push(prefix + 'unsupported operation.');
    if (!a.target || !text(a.target.object) || !text(a.target.id) || a.target.resolved !== true) errors.push(prefix + 'resolved CRM object and record ID required.');
    if (!Array.isArray(a.evidence_ids) || !a.evidence_ids.length || a.evidence_ids.some(id => !evidence.has(id))) errors.push(prefix + 'valid evidence references required.');
    if (!a.fields || typeof a.fields !== 'object' || Array.isArray(a.fields) || !Object.keys(a.fields).length) errors.push(prefix + 'field values required.');
    if (a.operation === 'update_fields' && (!text(a.expected_updated_at) || !Number.isFinite(Date.parse(a.expected_updated_at)))) errors.push(prefix + 'expected modification timestamp required.');
    if (!text(a.dedupe_query)) errors.push(prefix + 'describe how to check for an existing action.');
  }
  return errors;
}
if (require.main === module) {
  try {
    if (process.argv.length !== 3) throw Error('Usage: node validate-plan.js proposal.json');
    const file = process.argv[2];
    if (fs.statSync(file).size > 1024 * 1024) throw Error('Plan exceeds 1 MB.');
    const errors = validate(JSON.parse(fs.readFileSync(file, 'utf8')));
    console.log(JSON.stringify({ valid: !errors.length, executed: false, errors, next: 'Validate actual CRM fields, records and user authorization before execution.' }, null, 2));
    process.exitCode = errors.length ? 1 : 0;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { validate };
