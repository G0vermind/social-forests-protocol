// =============================================================================
// POST /api/v1/protocol/account
// Retorna dados da conta do protocolo para o frontend Vite
// Se o relayer não tiver informações, retorna a wallet institucional padrão
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { CONTRACT_IDS, NETWORK_CONFIG } from "@/lib/soroban/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { actor } = body;

    // Retorna informações básicas da conta no protocolo
    // Em produção, aqui consultaria o contrato para verificar se a empresa está registrada
    return NextResponse.json({
      ok: true,
      account: {
        stellarWalletAddress: actor?.walletAddress || null,
        network: NETWORK_CONFIG.network,
        contracts: CONTRACT_IDS,
        protocolVersion: "1.0.0",
        relayerActive: true,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
