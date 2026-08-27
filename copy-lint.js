#!/usr/bin/env node
"use strict";
/* copy-lint — a small adversarial pass on marketing copy before it ships.
   Catches the two things that make AI-written copy read as AI-written:
     1. Em-dash overuse (the single biggest tell — humans reach for periods,
        commas, or "and"; AI text leans on em dashes for every aside).
     2. A list of stock "AI-isms" — phrases that show up constantly in
        generated copy and almost never in copy a person actually wrote.
   Also scores readability (Flesch Reading Ease) so "easy to digest" is a
   number, not a vibe.

   Usage: node copy-lint.js path/to/file.html   (or .txt)
   No dependencies. Reusable on any future page/script/post. */
const fs = require("fs");

const file = process.argv[2];
if (!file) { console.error("usage: node copy-lint.js <file.html|.txt>"); process.exit(1); }
const raw = fs.readFileSync(file, "utf8");

// Strip tags, scripts, styles -> visible text only.
const text = raw
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&mdash;|&#8212;/g, "—")
  .replace(/&[a-z]+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();

// ---- 1. em-dash density ----
const emDashes = (text.match(/—/g) || []).length;
const words = text.split(/\s+/).filter(Boolean);
const wordCount = words.length;
const emDashRate = wordCount ? emDashes / wordCount * 100 : 0; // per 100 words

// ---- 2. AI-ism phrase scan ----
const AI_ISMS = [
  "furthermore", "moreover", "in today's fast-paced", "it's important to note",
  "it is important to note", "delve into", "delving into", "leverage", "leveraging",
  "seamless", "seamlessly", "unlock", "unlocking", "empower", "empowering",
  "navigate the complexities", "in conclusion", "robust", "cutting-edge",
  "game-changer", "game changing", "at the end of the day", "in this day and age",
  "boasts", "underscore", "underscores", "tapestry", "testament to",
  "in the realm of", "when it comes to", "not only", "but also",
  "elevate your", "unparalleled", "revolutionize", "revolutionizing",
  "dive deep", "deep dive into", "holistic", "synergy", "synergies",
  "paradigm shift", "landscape of", "ever-evolving", "in a world where",
  "look no further", "whether you're", "the world of", "a testament",
];
const lowered = text.toLowerCase();
const hits = [];
for (const phrase of AI_ISMS) {
  const idx = lowered.indexOf(phrase);
  if (idx !== -1) {
    const start = Math.max(0, idx - 30);
    hits.push({ phrase, context: "…" + text.slice(start, idx + phrase.length + 30) + "…" });
  }
}

// ---- 3. readability (Flesch Reading Ease, syllable heuristic) ----
function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  const groups = word.match(/[aeiouy]+/g) || [];
  let n = groups.length;
  if (word.endsWith("e") && n > 1) n -= 1;
  return Math.max(1, n);
}
const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
const sentenceCount = sentences.length || 1;
const syllableCount = words.reduce((a, w) => a + countSyllables(w), 0);
const avgSentenceLen = wordCount / sentenceCount;
const avgSyllablesPerWord = wordCount ? syllableCount / wordCount : 0;
const flesch = 206.835 - 1.015 * avgSentenceLen - 84.6 * avgSyllablesPerWord;

const longSentences = sentences.filter(s => s.split(/\s+/).filter(Boolean).length > 22);

// ---- report ----
console.log(`\ncopy-lint — ${file}`);
console.log("=".repeat(50));
console.log(`Words: ${wordCount}   Sentences: ${sentenceCount}   Avg sentence length: ${avgSentenceLen.toFixed(1)} words`);
console.log(`Flesch Reading Ease: ${flesch.toFixed(0)}  (aim 60-80: plain, conversational; below 40 reads dense/corporate)`);
console.log(`Long sentences (>22 words): ${longSentences.length}`);
if (longSentences.length) longSentences.forEach(s => console.log("   ⚠ " + s));

console.log(`\nEm dashes: ${emDashes}  (${emDashRate.toFixed(2)} per 100 words — over ~0.8/100 usually reads as AI-written)`);
console.log(emDashRate > 0.8 ? "   ⚠ over the line — cut most of these to periods or commas." : "   ok.");

console.log(`\nAI-ism phrases found: ${hits.length}`);
if (hits.length) hits.forEach(h => console.log(`   ⚠ "${h.phrase}" — ${h.context}`));
else console.log("   none found.");

console.log("\n" + "=".repeat(50));
const verdict = emDashRate <= 0.8 && hits.length === 0 && flesch >= 55 && longSentences.length === 0;
console.log(verdict ? "PASS — reads clean and human." : "NEEDS A PASS — see flags above.");
