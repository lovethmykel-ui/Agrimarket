import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CROSS_STATE_COMPARISONS,
  GEOPOLITICAL_ZONES,
  getAllStateCorridors,
  getStatesByZone,
  MONTHS,
  STATE_CORRIDORS,
  summarizeSeasonalSeries,
} from './seasonalData';
import { NIGERIAN_STATES } from './waitlist';

test('all state corridors provide complete 12-month series within 0-100 bounds', () => {
  const validStates = new Set<string>(NIGERIAN_STATES);
  const corridors = getAllStateCorridors();
  assert.equal(corridors.length, 12, 'expected 12 Nigerian state seasonal corridors');

  for (const corridor of corridors) {
    assert.ok(
      validStates.has(corridor.waitlistStateValue),
      `${corridor.waitlistStateValue} must match NIGERIAN_STATES`
    );
    assert.equal(corridor.monthly.length, 12, `${corridor.stateName} must have 12 months`);
    corridor.monthly.forEach((point, idx) => {
      assert.equal(point.month, MONTHS[idx]);
      for (const crop of corridor.crops) {
        const val = Number(point[crop.key]);
        assert.ok(val >= 0 && val <= 100, `${corridor.stateName} ${crop.key} out of range`);
      }
    });
  }
});

test('getStatesByZone filters accurately across all geopolitical zones', () => {
  assert.equal(getStatesByZone('All').length, Object.keys(STATE_CORRIDORS).length);
  for (const zone of GEOPOLITICAL_ZONES) {
    const matches = getStatesByZone(zone);
    assert.ok(matches.length >= 1, `zone ${zone} should have at least one state`);
    for (const st of matches) {
      assert.equal(st.geoZone, zone);
    }
  }
});

test('cross-state comparisons show staggered year-round tomato continuity', () => {
  const tomatoes = CROSS_STATE_COMPARISONS.tomatoes;
  const summary = summarizeSeasonalSeries(
    tomatoes.monthly,
    tomatoes.states.map((s) => s.key)
  );

  assert.equal(summary.peakMonth, 'Feb');
  assert.equal(summary.peakScore, 95);
  assert.equal(summary.leanMonth, 'Jul');
  assert.equal(summary.leanScore, 28);
  // By combining Kaduna + Plateau + Oyo corridors, high availability (>=60) covers most of the year
  assert.ok(summary.combinedContinuityMonths >= 10);
});
