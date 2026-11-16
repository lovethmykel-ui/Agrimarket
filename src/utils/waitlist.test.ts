import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeWaitlistStats,
  formatQueueNumber,
  validateQuickEmail,
  validateWaitlistInput,
  type WaitlistEntry,
} from './waitlist';

test('validateWaitlistInput rejects missing name, invalid email, and missing state', () => {
  const result = validateWaitlistInput({
    fullName: 'A',
    email: 'not-an-email',
    phone: 'abc',
    role: 'buyer',
    state: '',
    categories: [],
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.state);
});

test('validateWaitlistInput normalizes valid input and defaults empty categories to vegetables', () => {
  const result = validateWaitlistInput({
    fullName: '  Chinedu Okafor  ',
    email: '  CHINEDU@Example.COM ',
    phone: '+234 803 555 0192',
    role: 'farmer',
    state: 'Kaduna',
    categories: [],
    farmOrBusinessName: '  Zaria Fresh Farms  ',
  });

  assert.equal(result.valid, true);
  assert.equal(result.normalized?.fullName, 'Chinedu Okafor');
  assert.equal(result.normalized?.email, 'chinedu@example.com');
  assert.equal(result.normalized?.role, 'farmer');
  assert.equal(result.normalized?.state, 'Kaduna');
  assert.deepEqual(result.normalized?.categories, ['vegetables']);
  assert.equal(result.normalized?.farmOrBusinessName, 'Zaria Fresh Farms');
});

test('validateQuickEmail validates and normalizes email strings', () => {
  assert.equal(validateQuickEmail('').valid, false);
  assert.equal(validateQuickEmail('bad@domain').valid, false);
  const ok = validateQuickEmail('  Adaeze@Agri.NG ');
  assert.equal(ok.valid, true);
  assert.equal(ok.normalized, 'adaeze@agri.ng');
});

test('formatQueueNumber formats queue numbers with 4-digit zero padding', () => {
  assert.equal(formatQueueNumber(1), '#0001');
  assert.equal(formatQueueNumber(148), '#0148');
  assert.equal(formatQueueNumber(1240), '#1240');
});

test('computeWaitlistStats aggregates role counts, top states, and recent members', () => {
  const entries: WaitlistEntry[] = [
    {
      id: '1',
      position: 1,
      fullName: 'Bola Adeyemi',
      email: 'bola@example.com',
      role: 'buyer',
      state: 'Lagos',
      categories: ['vegetables'],
      createdAt: '2026-11-10T10:00:00.000Z',
    },
    {
      id: '2',
      position: 2,
      fullName: 'Ibrahim Musa',
      email: 'ibrahim@example.com',
      role: 'farmer',
      state: 'Kaduna',
      categories: ['grains', 'vegetables'],
      createdAt: '2026-11-11T10:00:00.000Z',
    },
    {
      id: '3',
      position: 3,
      fullName: 'Tunde Bakare',
      email: 'tunde@example.com',
      role: 'buyer',
      state: 'Lagos',
      categories: ['fruits'],
      createdAt: '2026-11-12T10:00:00.000Z',
    },
  ];

  const stats = computeWaitlistStats(entries, 5);
  assert.equal(stats.totalCount, 8);
  assert.deepEqual(stats.byRole, { buyer: 2, farmer: 1, partner: 0 });
  assert.deepEqual(stats.byState.Lagos, { buyers: 2, farmers: 0, partners: 0, total: 2 });
  assert.deepEqual(stats.byState.Kaduna, { buyers: 0, farmers: 1, partners: 0, total: 1 });
  assert.equal(stats.topStates[0]?.state, 'Lagos');
  assert.equal(stats.topStates[0]?.count, 2);
  assert.equal(stats.recentMembers[0]?.firstName, 'Tunde');
  assert.equal(stats.recentMembers[0]?.position, 3);
});
