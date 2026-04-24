/**
 * Account Abstraction Layer — Social Forest Protocol
 *
 * Estratégia: Google OAuth → deriva um par de chaves Stellar determinístico
 * a partir do sub (user ID único do Google) via HKDF.
 * O protocolo paga as fees da rede (Relayer pattern).
 *
 * FASE ATUAL: Scaffold com mock — integração real na Sprint 2.
 * LIBS ALVO:  @privy-io/react-auth OU nextra/aa-sdk OU própria implementação HKDF.
 */

export interface AbstractAccount {
  address:      string;   // Endereço Stellar derivado
  displayName:  string;   // Nome do Google
  email:        string;
  avatarUrl:    string;
  isAbstracted: true;     // Flag para distinguir de carteira nativa
}

/**
 * Mock: simula o fluxo OAuth → Stellar Address.
 * Substituir por implementação real com Privy ou similar.
 */
export async function loginWithGoogle(): Promise<AbstractAccount> {
  // TODO Sprint 2: Implementar OAuth real
  // 1. Google OAuth → obter { sub, name, email, picture }
  // 2. HKDF(sub + PROTOCOL_SALT) → 32 bytes → Stellar keypair
  // 3. Verificar se conta existe na rede; se não, criar via Relayer
  // 4. Retornar AbstractAccount

  // Mock temporário para demonstrações
  return {
    address:      'GCONSUMER000000000000000000000000000000000000000000',
    displayName:  'Usuário Demo',
    email:        'demo@florestas.social',
    avatarUrl:    '',
    isAbstracted: true,
  };
}

/**
 * Relayer: paga as fees da rede em nome do usuário abstrato.
 * TODO Sprint 2: Implementar servidor de Relayer com conta financiada.
 */
export async function sponsorTransaction(xdr: string): Promise<string> {
  // TODO: POST /api/relayer/sponsor com o XDR não-assinado
  // O servidor assina com a fee account e retorna o XDR assinado
  throw new Error('Relayer não implementado ainda — Sprint 2. Received XDR: ' + xdr);
}
