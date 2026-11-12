import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHomepageProductQueries, lowestProductPrice } from '../src/lib/homepage-product-queries.ts';

function fixture({ failProducts = false, failRegions = false } = {}) {
  const calls = [];
  const sdk = { store: {
    region: { list: async (q) => { calls.push(['region', q]); if (failRegions) throw Error(); return { count: 1, regions: [{ id: 'reg_1', countries: [{ iso_2: 'eg' }] }] }; } },
    product: { list: async (q) => { calls.push(['product', q]); if (failProducts) throw Error(); return { products: [{ id: 'b' }, { id: 'a' }] }; } },
  } };
  return { sdk, calls };
}
test('latest filters collection, orders newest first, clamps limit, and resolves country pricing', async () => {
  const { sdk, calls } = fixture();
  const result = await createHomepageProductQueries(sdk, 'EG').latest('pcol_1', 100);
  assert.equal(result.kind, 'ready');
  assert.deepEqual(calls[1][1], { collection_id: ['pcol_1'], order: '-created_at', limit: 48, region_id: 'reg_1', fields: '*variants.calculated_price' });
});
test('region failures omit price context, product failures produce unavailable', async () => {
  const a = fixture({ failRegions: true });
  assert.equal((await createHomepageProductQueries(a.sdk, 'eg').latest('x', 0)).kind, 'ready');
  assert.deepEqual(a.calls[1][1], { collection_id: ['x'], order: '-created_at', limit: 8 });
  const b = fixture({ failProducts: true });
  assert.equal((await createHomepageProductQueries(b.sdk, 'reg_1').latest('x', 1)).kind, 'unavailable');
});
test('manual selection retains editor order and skips missing products', async () => {
  const { sdk } = fixture();
  const result = await createHomepageProductQueries(sdk, undefined).selected(['a', 'missing', 'b']);
  assert.deepEqual(result.products.map((item) => item.id), ['a', 'b']);
});

test('missing prices are omitted and lowest available price is used', () => {
  assert.equal(lowestProductPrice({ variants: [{ calculated_price: null }] }), undefined);
  const price = lowestProductPrice({ variants: [{ calculated_price: { calculated_amount: 25, currency_code: 'egp' } }, { calculated_price: { calculated_amount: 10, currency_code: 'egp' } }] });
  assert.equal(price.calculated_amount, 10);
});


test('collection sections query their selected collection and limit', async () => {
  const { sdk, calls } = fixture();
  const queries = createHomepageProductQueries(sdk, 'reg_1');
  await queries.getProductsByCollections('pcol_one', 3);
  await queries.getProductsByCollections('pcol_two', 6);
  assert.deepEqual(calls.map(([, query]) => [query.collection_id, query.limit]), [[['pcol_one'], 3], [['pcol_two'], 6]]);
});
test('missing collection does not request products and failures are unavailable', async () => {
  const { sdk, calls } = fixture();
  const queries = createHomepageProductQueries(sdk, 'reg_1');
  assert.deepEqual(await queries.getProductsByCollections(null, 4), { kind: 'ready', products: [] });
  assert.deepEqual(await queries.getProductsByCollections('  ', 4), { kind: 'ready', products: [] });
  assert.equal(calls.length, 0);
  const failed = fixture({ failProducts: true });
  assert.equal((await createHomepageProductQueries(failed.sdk, 'reg_1').getProductsByCollections('pcol_1', 4)).kind, 'unavailable');
});
