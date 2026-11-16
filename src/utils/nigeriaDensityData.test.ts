import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDensityNodes,
  MAP_BOUNDS,
  NIGERIA_STATE_NODES,
} from './nigeriaDensityData';
import { NIGERIA_SVG_STATES } from './nigeriaSvgPaths';

test('all 37 Nigerian state SVG paths and 16 hub markers sit inside SVG bounds', () => {
  assert.equal(NIGERIA_SVG_STATES.length, 37);
  assert.ok(NIGERIA_STATE_NODES.length >= 16);

  for (const node of NIGERIA_STATE_NODES) {
    assert.ok(
      node.x > 20 && node.x < MAP_BOUNDS.width - 20,
      `${node.stateName} x=${node.x} out of bounds`
    );
    assert.ok(
      node.y > 20 && node.y < MAP_BOUNDS.height - 20,
      `${node.stateName} y=${node.y} out of bounds`
    );
    assert.ok(node.baseFarmers > 0 && node.baseBuyers > 0);
  }
});

test('buildDensityNodes merges live waitlist counts and ranks accurately by filter mode', () => {
  const baseResult = buildDensityNodes({}, 'all');
  const kadunaBefore = baseResult.nodes.find((n) => n.stateName === 'Kaduna');
  assert.ok(kadunaBefore);

  const liveResult = buildDensityNodes(
    {
      Kaduna: { farmers: 5, buyers: 2, partners: 1, total: 8 },
      Lagos: { farmers: 0, buyers: 12, partners: 0, total: 12 },
    },
    'buyers'
  );

  const kadunaAfter = liveResult.nodes.find((n) => n.stateName === 'Kaduna');
  assert.ok(kadunaAfter);
  assert.equal(kadunaAfter.farmers, kadunaBefore.farmers + 5);
  assert.equal(kadunaAfter.buyers, kadunaBefore.buyers + 2);
  assert.equal(kadunaAfter.liveWaitlistCount, 8);
  assert.equal(liveResult.ranked[0]?.stateName, 'Lagos');
  assert.equal(liveResult.totalLiveWaitlist, 20);

  const farmerResult = buildDensityNodes({}, 'farmers');
  assert.equal(farmerResult.ranked[0]?.stateName, 'Kaduna');
  assert.ok(
    farmerResult.ranked[0]!.radius >= farmerResult.ranked[farmerResult.ranked.length - 1]!.radius
  );
});
