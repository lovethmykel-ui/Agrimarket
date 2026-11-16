import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CROSS_STATE_COMPARISONS,
  MONTHS,
  STATE_CORRIDORS,
  summarizeSeasonalSeries,
} from './seasonalData';

test('all state corridors provide complete 12-month series within 0-100 bounds', () => {
  for (const corridor of Object.values(STATE_CORRIDORS)) {
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
