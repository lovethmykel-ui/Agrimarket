import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildHarvestCelebrationPlan,
  computeConfettiOrigin,
  DIAMOND_SPARK_SVG_PATH,
  getRoleCelebrationPalette,
  GRAIN_KERNEL_SVG_PATH,
  HARVEST_LEAF_SVG_PATH,
} from './celebrationConfetti';

test('computeConfettiOrigin returns safe fallback when rect or viewport is absent', () => {
  const origin = computeConfettiOrigin(null, null);
  assert.equal(origin.centerX, 0.62);
  assert.equal(origin.centerY, 0.48);
  assert.ok(origin.leftCannonX < origin.centerX);
  assert.ok(origin.rightCannonX > origin.centerX);
});

test('computeConfettiOrigin anchors burst inside viewport and clamps extremes', () => {
  const centered = computeConfettiOrigin(
    { left: 600, top: 200, width: 640, height: 420 },
    { width: 1440, height: 900 }
  );
  assert.ok(centered.centerX > 0.6 && centered.centerX < 0.7);
  assert.ok(centered.centerY > 0.35 && centered.centerY < 0.5);
  assert.ok(centered.leftCannonX >= 0.08 && centered.leftCannonX < centered.centerX);
  assert.ok(centered.rightCannonX <= 0.92 && centered.rightCannonX > centered.centerX);

  const clampedEdge = computeConfettiOrigin(
    { left: -400, top: 1800, width: 300, height: 200 },
    { width: 1200, height: 800 }
  );
  assert.equal(clampedEdge.centerX, 0.18);
  assert.equal(clampedEdge.centerY, 0.78);
  assert.ok(clampedEdge.leftCannonX >= 0.08);
  assert.ok(clampedEdge.cannonY <= 0.84);
});

test('getRoleCelebrationPalette returns distinct role-accented palettes with AgriMarket lime', () => {
  const farmer = getRoleCelebrationPalette('farmer');
  const buyer = getRoleCelebrationPalette('buyer');
  const partner = getRoleCelebrationPalette('partner');

  assert.ok(farmer.includes('#84E12B'));
  assert.ok(buyer.includes('#84E12B'));
  assert.ok(partner.includes('#84E12B'));
  assert.ok(partner.includes('#38BDF8'));
  assert.notDeepEqual(farmer, partner);
});

test('buildHarvestCelebrationPlan produces a 4-beat choreographed sequence', () => {
  const origin = computeConfettiOrigin(
    { left: 620, top: 180, width: 620, height: 480 },
    { width: 1440, height: 900 }
  );
  const plan = buildHarvestCelebrationPlan('farmer', origin);

  assert.equal(plan.length, 4);
  assert.deepEqual(
    plan.map((s) => s.id),
    ['center-ignition', 'left-cannon', 'right-cannon', 'golden-canopy']
  );

  // Ascending beat delays
  assert.equal(plan[0].delayMs, 0);
  assert.ok(plan[1].delayMs > plan[0].delayMs);
  assert.ok(plan[2].delayMs > plan[1].delayMs);
  assert.ok(plan[3].delayMs > plan[2].delayMs);

  // Left cannon fires up-right (< 90 deg), right cannon fires up-left (> 90 deg)
  assert.ok(plan[1].angle < 90);
  assert.ok(plan[2].angle > 90);

  // Golden canopy uses softer gravity to linger above ticket
  assert.ok(plan[3].gravity < plan[0].gravity);
  assert.ok(plan[3].origin.y < origin.centerY);

  for (const step of plan) {
    assert.ok(step.particleCount > 0);
    assert.ok(step.origin.x >= 0 && step.origin.x <= 1);
    assert.ok(step.origin.y >= 0 && step.origin.y <= 1);
    assert.ok(step.colors.length >= 4);
  }

  assert.ok(HARVEST_LEAF_SVG_PATH.length > 10);
  assert.ok(GRAIN_KERNEL_SVG_PATH.length > 10);
  assert.ok(DIAMOND_SPARK_SVG_PATH.length > 10);
});

test('buildHarvestCelebrationPlan scales velocity and spread gently for mobile viewports', () => {
  const mobileOrigin = computeConfettiOrigin(
    { left: 24, top: 260, width: 342, height: 390 },
    { width: 390, height: 844 }
  );
  const mobilePlan = buildHarvestCelebrationPlan('partner', mobileOrigin, 390);
  const desktopPlan = buildHarvestCelebrationPlan('partner', mobileOrigin, 1440);

  assert.ok(mobilePlan[0].startVelocity < desktopPlan[0].startVelocity);
  assert.ok(mobilePlan[0].particleCount < desktopPlan[0].particleCount);
  assert.ok(mobilePlan[1].spread < desktopPlan[1].spread);
});
