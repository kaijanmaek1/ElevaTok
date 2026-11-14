import {test} from 'node:test';
import assert from 'node:assert/strict';
import {adapt,classify,createProfile} from './engine';
test('stressed demo skips arguments and allows nature and uncertain content',()=>{const p=createProfile('Stressed','tiring day');assert.equal(classify('news argument',p).verdict,'skip');assert.equal(classify('forest nature',p).verdict,'allow');assert.equal(classify('',p).verdict,'allow');assert.equal(createProfile('Stressed','funny animals').weights.animals,4);});
test('feedback changes verdicts and remains bounded without mutating profile',()=>{const p=createProfile('Happy','cars');let updated=p;for(let i=0;i<20;i++)updated=adapt(updated,['cars'],false);assert.equal(updated.weights.cars,-5);assert.equal(p.weights.cars,4);assert.equal(classify('cars',updated).verdict,'skip');});
