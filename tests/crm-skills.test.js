'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {validate} = require('../skills/validate-plan.js');
const example = require('../skills/example-plan.json');
test('example is a proposal, never an execution', () => assert.deepEqual(validate(example), []));
for (const [name, mutate] of [
  ['ambiguous target', p => {p.actions[0].target.resolved = false;}],
  ['missing evidence', p => {p.actions[0].evidence_ids = ['missing'];}],
  ['stale-check omitted', p => {p.actions[0].operation = 'update_fields';}],
  ['duplicate action', p => {p.actions.push(structuredClone(p.actions[0]));}],
  ['outbound send', p => {p.actions[0].operation = 'send_message';}],
  ['delete', p => {p.actions[0].operation = 'delete';}],
  ['execution mode', p => {p.mode = 'execute';}],
  ['empty fields', p => {p.actions[0].fields = {};}],
]) test(`rejects ${name}`, () => {const p = structuredClone(example); mutate(p); assert.ok(validate(p).length);});
test('malformed root cannot pass', () => {for(const p of [null, [], 'text', {}]) assert.ok(validate(p).length);});
