import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the real TypeScript modules without introducing a test framework.
const modules = new Map();
function load(name) {
  if (modules.has(name)) return modules.get(name);
  const context = { exports: {}, require: path => load(path.replace('./', '')) };
  const source = fs.readFileSync(new URL(`../src/workout/${name}.ts`, import.meta.url), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
  modules.set(name, context.exports);
  return context.exports;
}
const { scoreWorkout, rankProgress } = load('scoring');
const { saveWorkout, loadData } = load('storage');
const { processWorkout } = load('model');
const exercise = (weight = 100, reps = 8, exerciseId = 'bench-press') => ({ exerciseId, sets: [{ weightLbs: weight, reps }] });
function store() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}
const past = (...items) => items.map(ex => ({ exercises: [ex], earned: 12 }));

test('completion, distinct exercises, improvement, PB, flat and down sessions', () => {
  assert.equal(scoreWorkout([exercise()], []), 12);
  assert.equal(scoreWorkout([exercise(), exercise(50,8,'row')], []), 14);
  assert.equal(scoreWorkout([exercise(105)], past(exercise())), 24);
  assert.equal(scoreWorkout([exercise(100,9)], past(exercise())), 24);
  assert.equal(scoreWorkout([exercise()], past(exercise())), 12);
  assert.equal(scoreWorkout([exercise(90)], past(exercise())), 12);
  assert.equal(scoreWorkout([exercise(95)], past(exercise(100), exercise(90))), 14);
  assert.equal(scoreWorkout([exercise(0,9)], past(exercise(0,8))), 24);
  assert.equal(scoreWorkout([exercise(100)], past(exercise(0,8))), 12);
  assert.equal(scoreWorkout([{...exercise(),sets:[...exercise().sets,...exercise().sets]}],past(exercise())),12);
});
test('huge values, invalid sets, duplicate exercises and outlier bonuses', () => {
  for (const [weight,reps] of [[-1,8],[Infinity,8],[NaN,8],[10000,8],[100,-1],[100,0],[100,1.5],[100,101]]) assert.throws(() => scoreWorkout([exercise(weight,reps)], []));
  assert.throws(() => scoreWorkout([], []));
  assert.throws(() => scoreWorkout([exercise(),exercise()], []));
  assert.equal(scoreWorkout([exercise(300)],past(exercise(100))),12);
  assert.equal(processWorkout('bench-press',[{weight:'',reps:'8'}]).ok,false);
  assert.equal(processWorkout('bench-press',Array(21).fill({weight:'100',reps:'8'})).ok,false);
});
test('persistent history, PB across saves, reload, and idempotent submission', () => {
  const storage = store();
  const first = saveWorkout([exercise()], 'one', storage);
  assert.equal(first.before,0); assert.equal(first.after,12);
  const second = saveWorkout([exercise(105)], 'two', storage);
  assert.equal(second.before,12); assert.equal(second.after,36);
  assert.equal(loadData(storage).workouts.length,2);
  assert.equal(loadData(storage).workouts[1].exercises[0].sets[0].weightLbs,105);
  assert.equal(saveWorkout([exercise(105)], 'two', storage).after,36);
  assert.equal(loadData(storage).workouts.length,2);
  assert.equal(saveWorkout([exercise(90)], 'three', storage).after,48);
});
test('failed writes award nothing; corrupted data is not overwritten', () => {
  const storage = store();
  saveWorkout([exercise()], 'one', storage);
  assert.throws(() => saveWorkout([exercise(105)],'two',{getItem:storage.getItem,setItem:()=>{throw new Error('Quota');}}));
  assert.equal(loadData(storage).elo,12);
  let wrote = false;
  assert.throws(() => saveWorkout([exercise()],'one',{getItem:()=>'{broken',setItem:()=>{wrote=true;}}));
  assert.equal(wrote,false);
});
test('rank thresholds, progress and Elite cap', () => {
  for(const [elo,name] of [[0,'Bronze'],[300,'Silver'],[1000,'Gold'],[2500,'Platinum'],[5500,'Diamond'],[11000,'Elite']]) assert.equal(rankProgress(elo).rank,name);
  assert.equal(rankProgress(150).percent,50);
  assert.equal(rankProgress(299).remaining,1);
  assert.equal(rankProgress(300).percent,0);
  assert.equal(rankProgress(12000).percent,100);
  assert.equal(rankProgress(12000).next,undefined);
});
