import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { ensureProtocolAccount } from './services/protocolAccountService.js';
import { acquireTrees } from './services/institutionProtocolService.js';

const app = express();

app.use(cors({
  origin: config.corsOrigin === '*' ? true : config.corsOrigin,
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'social-forests-relayer',
    network: config.stellar.network,
  });
});

app.get('/v1/protocol/account', async (req, res) => {
  try {
    const account = await ensureProtocolAccount(req);

    res.json({
      ok: true,
      privyUserId: account.privyUserId,
      email: account.email,
      stellarWalletAddress: account.stellarWalletAddress,
      walletAddress: account.stellarWalletAddress,
      activeRole: account.activeRole || 'institution',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || 'Não foi possível carregar a conta de protocolo.',
    });
  }
});

app.post('/v1/protocol/institution/acquire-trees', async (req, res) => {
  try {
    const account = await ensureProtocolAccount(req);
    const result = await acquireTrees(req.body, account);

    res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || 'Não foi possível comprar árvores no protocolo.',
    });
  }
});

app.post('/v1/protocol/institution/create-activity', async (req, res) => {
  try {
    const account = await ensureProtocolAccount(req);

    res.json({
      ok: true,
      simulated: false,
      message: 'Atividade registrada para reserva de Folhas.',
      institution: {
        walletAddress: account.stellarWalletAddress,
      },
      activity: {
        ...req.body?.payload,
        status: 'reserved',
      },
      receiptId: `activity-${Date.now()}`,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || 'Não foi possível criar atividade.',
    });
  }
});

app.listen(config.port, () => {
  console.log(`Social Forests relayer listening on http://localhost:${config.port}`);
});