import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swapReducer, initialSwapState } from './swap-demo-state.ts';

const toggle = (side, id) => ({ type: 'toggle', side, id });
const chooseOffer = () => swapReducer(initialSwapState, toggle('offered', 'messi'));

test('empty or out-of-order actions cannot start a swap', () => {
  for (const type of ['continue', 'swap', 'finish', 'back']) {
    assert.equal(swapReducer(initialSwapState, { type }), initialSwapState);
  }
  assert.equal(swapReducer(initialSwapState, toggle('requested', 'shadow')), initialSwapState);
  assert.equal(swapReducer(initialSwapState, toggle('offered', 'unknown')), initialSwapState);
});
test('multiple cards can be selected and deselected without duplicates', () => {
  const first = chooseOffer();
  const second = swapReducer(first, toggle('offered', 'ronaldinho'));
  assert.deepEqual(second.offered, ['messi', 'ronaldinho']);
  assert.deepEqual(swapReducer(second, toggle('offered', 'messi')).offered, ['ronaldinho']);
  assert.deepEqual(first.offered, ['messi']);
});
test('both decks need a selection, while unequal quantities are allowed', () => {
  let state = swapReducer(chooseOffer(), { type: 'continue' });
  assert.equal(swapReducer(state, { type: 'swap' }), state);
  state = swapReducer(state, toggle('requested', 'shadow'));
  state = swapReducer(state, toggle('requested', 'metal-sonic'));
  state = swapReducer(state, { type: 'swap' });
  assert.equal(state.phase, 'swapping');
  assert.equal(state.requested.length, 2);
  assert.equal(state.offered.length, 1);
});
test('editing an offer preserves requested cards but emptying it requires a new offer', () => {
  let state = swapReducer(chooseOffer(), { type: 'continue' });
  state = swapReducer(state, toggle('requested', 'shadow'));
  state = swapReducer(state, { type: 'back' });
  state = swapReducer(state, toggle('offered', 'messi'));
  assert.deepEqual(state.requested, ['shadow']);
  assert.equal(swapReducer(state, { type: 'continue' }), state);
});
test('animation locks selections, finishes once, and reset discards all picks', () => {
  let state = swapReducer(chooseOffer(), { type: 'continue' });
  state = swapReducer(state, toggle('requested', 'shadow'));
  state = swapReducer(state, { type: 'swap' });
  assert.equal(swapReducer(state, toggle('requested', 'shadow')), state);
  assert.equal(swapReducer(state, { type: 'back' }), state);
  const complete = swapReducer(state, { type: 'finish' });
  assert.equal(complete.phase, 'complete');
  assert.equal(swapReducer(complete, { type: 'finish' }), complete);
  assert.equal(swapReducer(complete, { type: 'reset' }), initialSwapState);
});
