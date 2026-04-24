import { NextRequest, NextResponse } from 'next/server';

/**
 * Este é um scaffold do Webhook da Stripe para o protocolo Social Forests.
 * Objetivo (Pitch B2B): Demonstrar que empresas podem usar cartão de crédito/boleto
 * para comprar "Folhas" (Leaf Tokens) sem precisar lidar com criptomoedas diretamente.
 * 
 * O gateway recebe o webhook (checkout.session.completed), confirma a assinatura,
 * e usa a chave Sponsor (Admin) para invocar a função `distribute_leaves` no Soroban,
 * creditando o saldo da empresa no contrato.
 */

// export const runtime = 'edge'; // Opcional: rodar na edge

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'Falta Stripe Signature' }, { status: 400 });
    }

    // 1. Verificação da Assinatura (Simulada)
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    // Parse manual para simulação
    const event = JSON.parse(body);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // 2. Extração de Metadados
      // A empresa define qual é o endereço (publicKey) no momento do checkout
      const companyAddress = session.metadata?.company_address;
      const packageType = session.metadata?.package_type; // ex: "10k_leaves"
      
      // Mapeamento de Fiat pago para a quantidade de folhas a distribuir
      let amountToDistribute = 0;
      if (packageType === '10k_leaves') amountToDistribute = 10000;
      else if (packageType === '50k_leaves') amountToDistribute = 50000;

      if (!companyAddress || amountToDistribute === 0) {
        throw new Error("Metadados inválidos na sessão do Stripe");
      }

      // 3. Ponte com Soroban (Simulada)
      /*
        try {
          const server = new rpc.Server("https://soroban-testnet.stellar.org");
          const contract = new Contract(process.env.CONTRACT_ID);
          
          // O Admin do protocolo patrocina a transação (Fee Bumping)
          const adminKeypair = Keypair.fromSecret(process.env.ADMIN_SECRET_KEY);
          
          const tx = await contract.call("distribute_leaves", ...);
          await server.sendTransaction(tx);
        } catch(e) {
           console.error("Falha na chamada Soroban:", e);
           // Sistema de retry...
        }
      */

      console.log(`[Stripe Gateway] Sucesso! ${amountToDistribute} folhas distribuídas para a empresa ${companyAddress}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }
}
