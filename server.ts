import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createServer as createViteServer } from 'vite';
import {
  computeWaitlistStats,
  normalizeEmail,
  validateQuickEmail,
  validateWaitlistInput,
  type WaitlistEntry,
} from './src/utils/waitlist';

interface WaitlistStoreData {
  entries: WaitlistEntry[];
  newsletterEmails: string[];
}

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'waitlist.json');

const SEED_ENTRIES: WaitlistEntry[] = [
  {
    id: 'seed-1',
    position: 1,
    fullName: 'Amina Bello',
    email: 'amina.bello@pilot.agrimarket.ng',
    role: 'farmer',
    state: 'Kaduna',
    categories: ['vegetables', 'grains'],
    farmOrBusinessName: 'Zaria Tomato Growers Co-op',
    createdAt: '2026-10-18T09:15:00.000Z',
  },
  {
    id: 'seed-2',
    position: 2,
    fullName: 'Folake Adeyemi',
    email: 'folake.adeyemi@pilot.agrimarket.ng',
    role: 'buyer',
    state: 'Lagos',
    categories: ['vegetables', 'fruits', 'poultry'],
    createdAt: '2026-10-21T14:22:00.000Z',
  },
  {
    id: 'seed-3',
    position: 3,
    fullName: 'Chinedu Okafor',
    email: 'chinedu.okafor@pilot.agrimarket.ng',
    role: 'buyer',
    state: 'FCT (Abuja)',
    categories: ['grains', 'livestock', 'fish'],
    farmOrBusinessName: 'Wuse Fresh Kitchens',
    createdAt: '2026-10-25T11:05:00.000Z',
  },
  {
    id: 'seed-4',
    position: 4,
    fullName: 'Tunde Ogunleye',
    email: 'tunde.ogunleye@pilot.agrimarket.ng',
    role: 'partner',
    state: 'Oyo',
    categories: ['vegetables', 'fruits', 'grains'],
    farmOrBusinessName: 'Ibadan Cold-Chain Transit',
    createdAt: '2026-10-29T16:40:00.000Z',
  },
  {
    id: 'seed-5',
    position: 5,
    fullName: 'Adaeze Nwosu',
    email: 'adaeze.nwosu@pilot.agrimarket.ng',
    role: 'buyer',
    state: 'Enugu',
    categories: ['vegetables', 'fish'],
    createdAt: '2026-11-02T08:50:00.000Z',
  },
  {
    id: 'seed-6',
    position: 6,
    fullName: 'Musa Danjuma',
    email: 'musa.danjuma@pilot.agrimarket.ng',
    role: 'farmer',
    state: 'Benue',
    categories: ['fruits', 'grains'],
    farmOrBusinessName: 'Makurdi Citrus & Yam Collective',
    createdAt: '2026-11-06T13:12:00.000Z',
  },
  {
    id: 'seed-7',
    position: 7,
    fullName: 'Seyi Oladipo',
    email: 'seyi.oladipo@pilot.agrimarket.ng',
    role: 'farmer',
    state: 'Ogun',
    categories: ['poultry', 'fish'],
    farmOrBusinessName: 'Abeokuta Integrated Hatchery',
    createdAt: '2026-11-09T10:30:00.000Z',
  },
  {
    id: 'seed-8',
    position: 8,
    fullName: 'Kemi Balogun',
    email: 'kemi.balogun@pilot.agrimarket.ng',
    role: 'buyer',
    state: 'Rivers',
    categories: ['fish', 'vegetables', 'fruits'],
    createdAt: '2026-11-12T17:18:00.000Z',
  },
];

async function readStore(): Promise<WaitlistStoreData> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<WaitlistStoreData>;
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [...SEED_ENTRIES],
      newsletterEmails: Array.isArray(parsed.newsletterEmails) ? parsed.newsletterEmails : [],
    };
  } catch {
    const initial: WaitlistStoreData = {
      entries: [...SEED_ENTRIES],
      newsletterEmails: [],
    };
    await writeStore(initial);
    return initial;
  }
}

async function writeStore(data: WaitlistStoreData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Ensure initial store exists
  await readStore();

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/waitlist/stats', async (_req, res) => {
    try {
      const store = await readStore();
      const stats = computeWaitlistStats(store.entries, store.newsletterEmails.length);
      res.json(stats);
    } catch (error) {
      console.error('Failed to read waitlist stats:', error);
      res.status(500).json({ error: 'Unable to load waitlist statistics right now.' });
    }
  });

  app.get('/api/waitlist/status', async (req, res) => {
    try {
      const rawEmail = typeof req.query.email === 'string' ? req.query.email : '';
      const check = validateQuickEmail(rawEmail);
      if (!check.valid || !check.normalized) {
        res.status(400).json({ error: check.error || 'Valid email is required.' });
        return;
      }

      const store = await readStore();
      const existing = store.entries.find(
        (entry) => normalizeEmail(entry.email) === check.normalized
      );

      if (!existing) {
        const isNewsletter = store.newsletterEmails.includes(check.normalized);
        res.json({
          found: false,
          newsletterSubscribed: isNewsletter,
        });
        return;
      }

      res.json({
        found: true,
        entry: {
          position: existing.position,
          fullName: existing.fullName,
          role: existing.role,
          state: existing.state,
          categories: existing.categories,
          createdAt: existing.createdAt,
        },
      });
    } catch (error) {
      console.error('Status lookup failed:', error);
      res.status(500).json({ error: 'Unable to check waitlist status right now.' });
    }
  });

  app.post('/api/waitlist', async (req, res) => {
    try {
      const validation = validateWaitlistInput(req.body ?? {});
      if (!validation.valid || !validation.normalized) {
        res.status(400).json({
          error: 'Please check the highlighted fields.',
          fieldErrors: validation.errors,
        });
        return;
      }

      const normalized = validation.normalized;
      const store = await readStore();

      const existing = store.entries.find(
        (entry) => normalizeEmail(entry.email) === normalized.email
      );
      if (existing) {
        res.status(409).json({
          error: 'This email address is already registered on the waitlist.',
          existingEntry: {
            position: existing.position,
            fullName: existing.fullName,
            role: existing.role,
            state: existing.state,
            categories: existing.categories,
            createdAt: existing.createdAt,
          },
        });
        return;
      }

      const nextPosition =
        store.entries.reduce((max, item) => Math.max(max, item.position), 0) + 1;

      const newEntry: WaitlistEntry = {
        id: crypto.randomUUID(),
        position: nextPosition,
        fullName: normalized.fullName,
        email: normalized.email,
        phone: normalized.phone,
        role: normalized.role,
        state: normalized.state,
        categories: normalized.categories,
        farmOrBusinessName: normalized.farmOrBusinessName,
        createdAt: new Date().toISOString(),
      };

      store.entries.push(newEntry);
      // Remove from newsletter-only list if upgrading to full waitlist entry
      store.newsletterEmails = store.newsletterEmails.filter(
        (em) => em !== normalized.email
      );
      await writeStore(store);

      const stats = computeWaitlistStats(store.entries, store.newsletterEmails.length);
      res.status(201).json({
        entry: {
          position: newEntry.position,
          fullName: newEntry.fullName,
          role: newEntry.role,
          state: newEntry.state,
          categories: newEntry.categories,
          createdAt: newEntry.createdAt,
        },
        stats,
      });
    } catch (error) {
      console.error('Waitlist signup failed:', error);
      res.status(500).json({ error: 'Unable to save your waitlist registration. Please try again.' });
    }
  });

  app.post('/api/newsletter', async (req, res) => {
    try {
      const check = validateQuickEmail(req.body?.email ?? '');
      if (!check.valid || !check.normalized) {
        res.status(400).json({ error: check.error || 'Valid email is required.' });
        return;
      }

      const store = await readStore();
      const alreadyOnWaitlist = store.entries.some(
        (entry) => normalizeEmail(entry.email) === check.normalized
      );
      const alreadyOnNewsletter = store.newsletterEmails.includes(check.normalized);

      if (alreadyOnWaitlist || alreadyOnNewsletter) {
        const stats = computeWaitlistStats(store.entries, store.newsletterEmails.length);
        res.json({
          alreadySubscribed: true,
          message: 'You are already subscribed for AgriMarket launch updates.',
          stats,
        });
        return;
      }

      store.newsletterEmails.push(check.normalized);
      await writeStore(store);
      const stats = computeWaitlistStats(store.entries, store.newsletterEmails.length);

      res.status(201).json({
        alreadySubscribed: false,
        message: 'Subscribed! We will notify you as soon as AgriMarket launches in your state.',
        stats,
      });
    } catch (error) {
      console.error('Newsletter subscribe failed:', error);
      res.status(500).json({ error: 'Unable to subscribe right now. Please try again.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriMarket server running at http://localhost:${PORT}`);
  });
}

startServer();
