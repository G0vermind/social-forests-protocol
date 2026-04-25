'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  Globe2, 
  Sun, 
  Moon, 
  Languages, 
  Building2,
  Users,
  TreePine,
  LineChart,
  Target,
  Zap,
  CheckCircle2,
  Mail,
  MessageSquare,
  Search
} from 'lucide-react';

// Componentes Gráficos e de UI
import { BrandLogo } from '@/components/ui/BrandLogo';
import { AssetImage } from '@/components/ui/AssetImage';
import { StickerCard } from '@/components/gamification/StickerCard';
import { MedalBadge } from '@/components/gamification/MedalBadge';
import { mockNfts, mockMedals } from '@/lib/mocks/gamification';

// ==========================================
// DICIONÁRIO DE TRADUÇÃO (EN / PT) - Foco Comercial B2B
// ==========================================
const dict = {
  pt: {
    // Nav
    btnB2C: "Entrar no Protocolo",
    btnB2B: "Agendar Diagnóstico",
    // Hero
    heroTag: "Inovação em Sustentabilidade e ESG",
    heroTitlePart1: "Transforme vendas em",
    heroTitleHighlight: "Impacto Real",
    heroSubtitle: "Aumente o engajamento dos seus clientes com Cashback Verde. Entregue relatórios ESG auditáveis que blindam sua marca contra o greenwashing e geram valor real.",
    inputPlaceholder: "Digite o código do seu cupom...",
    inputButton: "Resgatar Folhas",
    // A Tese (Benefícios)
    thesisTitle: "Enquanto seus clientes acompanham o crescimento de árvores reais, sua empresa ganha reconhecimento e compliance ESG.",
    benefit1: "+ Retenção de Clientes",
    benefit2: "Custo Transparente",
    benefit3: "Cashback Verde",
    benefit4: "Marketing com Propósito",
    // Quem Somos
    aboutTitle: "A tecnologia por trás do impacto transparente",
    aboutDesc: "Somos a plataforma B2B2C que conecta o consumo diário ao reflorestamento rastreável. Usamos tecnologia criptográfica de ponta para garantir que cada centavo investido em sustentabilidade seja provado, gerando engajamento para sua marca e resultados reais para o planeta.",
    ab1: "Impacto Auditável: Cada árvore possui geolocalização, fotos e registros imutáveis.",
    ab2: "Proteção de Marca: Dados cristalinos para relatórios de sustentabilidade.",
    ab3: "Fácil Integração: Campanhas prontas para o varejo, e-commerce e eventos.",
    // 4 Passos
    howItWorks: "Como funciona na prática",
    step1Title: "1. Sua marca ativa a campanha",
    step1Desc: "Você define a regra (ex: R$ 100 em compras = 10 folhas) e deposita o Cashback Verde.",
    step2Title: "2. O cliente engaja e acumula",
    step2Desc: "Sua base de clientes interage com a marca para ganhar as frações ecológicas.",
    step3Title: "3. As frações viram árvores reais",
    step3Desc: "A meta é atingida e o plantio é executado, com acompanhamento digital contínuo.",
    step4Title: "4. Relatório ESG e Certificação",
    step4Desc: "Sua empresa recebe relatórios validados que comprovam o abatimento de carbono.",
    // Transparência
    trustTitle: "Sustentabilidade ancorada em Dados",
    trustSubtitle: "Saia do discurso e mostre impacto palpável. Conectamos cada compra à floresta em tempo real.",
    // Timeline
    roadmapTitle: "Nossa trajetória de crescimento",
    rm1Date: "Janeiro/25", rm1Text: "Lançamento do sistema e primeiros plantios georreferenciados.",
    rm2Date: "Junho/25", rm2Text: "Abertura para o varejo transformar consumo em impacto comprovado.",
    rm3Date: "Setembro/25", rm3Text: "Nova rota de distribuição de mudas para agricultores parceiros.",
    rm4Date: "Dezembro/25", rm4Text: "Consolidação dos pools de plantio acelerado em comunidades locais.",
    rm5Date: "2026", rm5Text: "Expansão global das operações B2B2C.",
    // CTA Footer
    ctaTitle: "Pronto para inovar no seu ESG?",
    ctaSub: "Agende uma conversa estratégica e descubra como o Cashback Verde pode alavancar suas vendas."
  },
  en: {
    // Nav
    btnB2C: "Access Platform",
    btnB2B: "Book a Demo",
    // Hero
    heroTag: "Innovation in Sustainability & ESG",
    heroTitlePart1: "Transform sales into",
    heroTitleHighlight: "Real Impact",
    heroSubtitle: "Boost customer engagement with Green Cashback. Deliver auditable ESG reports that shield your brand from greenwashing and drive true value.",
    inputPlaceholder: "Enter your coupon code...",
    inputButton: "Claim Leaves",
    // A Tese (Benefícios)
    thesisTitle: "While your customers track the growth of real trees, your company gains ESG compliance and recognition.",
    benefit1: "+ Customer Retention",
    benefit2: "Transparent Costs",
    benefit3: "Green Cashback",
    benefit4: "Purpose-Driven Marketing",
    // Quem Somos
    aboutTitle: "The technology behind transparent impact",
    aboutDesc: "We are the B2B2C platform connecting daily consumption to traceable reforestation. We use cutting-edge cryptographic technology to ensure every cent invested in sustainability is proven, generating brand loyalty and real results for the planet.",
    ab1: "Auditable Impact: Every tree features geolocation, photos, and immutable records.",
    ab2: "Brand Protection: Crystal-clear data for corporate sustainability reporting.",
    ab3: "Easy Integration: Plug-and-play campaigns for retail, e-commerce, and events.",
    // 4 Passos
    howItWorks: "How it works in practice",
    step1Title: "1. Your brand activates the campaign",
    step1Desc: "You set the rule (e.g., $100 spent = 10 leaves) and fund the Green Cashback.",
    step2Title: "2. The customer engages & accumulates",
    step2Desc: "Your client base interacts with your brand to earn ecological fractions.",
    step3Title: "3. Fractions become real trees",
    step3Desc: "The goal is met and planting is executed, with continuous digital monitoring.",
    step4Title: "4. ESG Reporting & Certification",
    step4Desc: "Your company receives validated reports proving your carbon compensation.",
    // Transparência
    trustTitle: "Sustainability anchored in Data",
    trustSubtitle: "Move beyond words and show tangible impact. We connect every purchase to the forest in real-time.",
    // Timeline
    roadmapTitle: "Our growth journey",
    rm1Date: "January/25", rm1Text: "System launch and first georeferenced plantings.",
    rm2Date: "June/25", rm2Text: "Opening for retail to transform consumption into proven impact.",
    rm3Date: "September/25", rm3Text: "New seedling distribution route for partner farmers.",
    rm4Date: "December/25", rm4Text: "Consolidation of accelerated planting pools in local communities.",
    rm5Date: "2026", rm5Text: "Global expansion of B2B2C operations.",
    // CTA Footer
    ctaTitle: "Ready to innovate your ESG strategy?",
    ctaSub: "Schedule a strategic call to discover how Green Cashback can boost your business."
  }
};

export default function LandingPage() {
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);
  const [resgateCode, setResgateCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  const handleResgate = (e: React.FormEvent) => {
    e.preventDefault();
    if(resgateCode.trim()) {
      router.push(`/login?code=${encodeURIComponent(resgateCode)}`);
    }
  };

  const t = dict[lang];
  const isDark = theme === 'dark';
  
  const bgMain = isDark ? 'bg-brand-dark' : 'bg-brand-bg-light';
  const textMain = isDark ? 'text-brand-bg-light' : 'text-brand-dark';
  const textSub = isDark ? 'text-brand-sepia/80' : 'text-brand-brown-light';
  
  const glassPanel = isDark 
    ? 'bg-brand-sepia/[0.03] border border-brand-sepia/20 backdrop-blur-2xl shadow-2xl' 
    : 'bg-white/80 border border-brand-sepia/20 backdrop-blur-xl shadow-xl shadow-brand-sepia/10';
    
  const glassHover = isDark 
    ? 'hover:bg-brand-sepia/[0.08] hover:border-brand-sepia/40 transition-all duration-300' 
    : 'hover:bg-white hover:border-brand-sepia/40 transition-all duration-300';

  const showcaseNft = mockNfts.find(n => n.rarity === 'Lenda') || mockNfts[0];
  const showcaseMedal = mockMedals[0];

  if (!mounted) return null; 

  return (
    <main className={`min-h-screen ${bgMain} transition-colors duration-500 relative overflow-hidden flex flex-col font-sans`}>
      
      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-50">
        <Link href="/" className="flex items-center">
          <BrandLogo className="h-10 md:h-12" />
        </Link>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'} backdrop-blur-md`}>
            <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} className={`p-1.5 rounded-full transition-colors text-xs font-bold ${textMain}`}>
              <Languages className="w-4 h-4 inline-block mr-1" /> {lang.toUpperCase()}
            </button>
            <div className={`w-px h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`p-1.5 rounded-full transition-colors ${textMain}`}>
              {isDark ? <Sun className="w-4 h-4 hover:text-amber-400" /> : <Moon className="w-4 h-4 hover:text-indigo-500" />}
            </button>
          </div>
          <Link href="/login" className={`hidden sm:block px-6 py-2.5 rounded-full font-bold transition-all border ${isDark ? 'bg-brand-sepia/10 hover:bg-brand-sepia/20 text-brand-bg-light border-brand-sepia/20' : 'bg-brand-dark hover:bg-brand-dark/90 text-brand-bg-light border-transparent shadow-md'}`}>
            Login
          </Link>
        </div>
      </header>

      {/* 1. HERO SECTION & RESGATE */}
      <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-green-light/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="flex flex-col items-start text-left relative z-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-8 ${isDark ? 'bg-brand-green-light/10 border-brand-green-light/20 text-brand-green-light' : 'bg-brand-green-light/20 border-brand-green-light/30 text-brand-dark'}`}>
            <ShieldCheck className="w-4 h-4" />
            <span>{t.heroTag}</span>
          </div>
          
          <h1 className={`text-5xl md:text-6xl font-black tracking-tight max-w-2xl leading-[1.1] mb-6 ${textMain}`}>
            {t.heroTitlePart1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-light to-brand-yellow">{t.heroTitleHighlight}</span>
          </h1>
          <p className={`text-lg max-w-xl mb-10 font-medium ${textSub}`}>{t.heroSubtitle}</p>
          
          {/* AÇÕES B2B */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
            <a href="https://calendar.app.google/GcnAotw1pnYJ9G1r5" target="_blank" rel="noreferrer" className="group bg-gradient-to-r from-brand-green-light to-brand-yellow hover:from-brand-green-light/90 hover:to-brand-yellow/90 text-brand-dark font-extrabold px-8 py-4 rounded-full shadow-xl shadow-brand-green-light/20 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
              <Building2 className="w-5 h-5" /> {t.btnB2B} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* INPUT DE RESGATE B2C */}
          <div className={`w-full max-w-md p-2 rounded-2xl border ${isDark ? 'bg-brand-dark/80 border-brand-sepia/20' : 'bg-white border-brand-sepia/30 shadow-lg'}`}>
            <form onSubmit={handleResgate} className="flex relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green-light">
                <Leaf className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                value={resgateCode}
                onChange={(e) => setResgateCode(e.target.value)}
                placeholder={t.inputPlaceholder}
                className={`w-full pl-12 pr-4 py-4 rounded-xl outline-none font-medium ${isDark ? 'bg-transparent text-brand-bg-light placeholder:text-brand-sepia/50' : 'bg-transparent text-brand-dark placeholder:text-brand-brown-light'}`}
              />
              <button type="submit" className={`shrink-0 px-6 py-2 m-1 rounded-xl font-bold transition-colors ${isDark ? 'bg-brand-green-light/20 text-brand-green-light hover:bg-brand-green-light/30' : 'bg-brand-green-light text-brand-dark hover:bg-brand-green-light/80'}`}>
                {t.inputButton}
              </button>
            </form>
          </div>

        </div>

        <div className="hidden lg:flex flex-col items-center justify-center relative z-10">
          <div className="relative w-full max-w-[320px] transform hover:-translate-y-2 transition-transform duration-500">
            {/* O visual RWA é mantido para mostrar o 'produto final' sem usar jargões excessivos no texto */}
            <StickerCard sticker={showcaseNft} />
          </div>
          <div className="absolute -bottom-10 -right-5 transform scale-125">
             <div className={`${glassPanel} p-4 rounded-full border border-brand-sepia/20`}>
               <MedalBadge medal={showcaseMedal} />
             </div>
          </div>
        </div>
      </div>

      {/* 2. A TESE (BENEFÍCIOS B2B) */}
      <div className={`w-full py-16 ${isDark ? 'bg-brand-green-light/10' : 'bg-brand-green-light/5'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className={`text-2xl md:text-3xl font-extrabold max-w-3xl mx-auto mb-10 ${textMain}`}>
            {t.thesisTitle}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[t.benefit1, t.benefit2, t.benefit3, t.benefit4].map((benefit, i) => (
              <span key={i} className={`px-5 py-2.5 rounded-full font-bold text-sm border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white border-emerald-200 text-emerald-700 shadow-sm'}`}>
                <CheckCircle2 className="inline-block w-4 h-4 mr-2" />
                {benefit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. QUEM SOMOS E O QUE ENTREGAMOS */}
      <div className="w-full max-w-7xl mx-auto px-6 py-24 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className={`text-3xl md:text-4xl font-black mb-6 ${textMain}`}>{t.aboutTitle}</h2>
          <p className={`text-lg leading-relaxed mb-8 ${textSub}`}>{t.aboutDesc}</p>
          <ul className="space-y-4">
            {[t.ab1, t.ab2, t.ab3].map((item, i) => (
              <li key={i} className={`flex items-start gap-3 ${textMain} font-medium`}>
                <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className={`p-8 rounded-3xl ${glassPanel} flex flex-col justify-center items-center text-center`}>
           <AssetImage 
             src="/assets/forest_pixel_1.jpg" 
             alt="Mogno Africano Pixel Art" 
             className="w-full aspect-video mb-6" 
           />
           <p className={`text-sm italic ${textSub}`}>Operações rastreadas e certificadas para garantir a integridade do seu investimento ESG.</p>
        </div>
      </div>

      {/* 4. COMO FUNCIONA (CORE LOOP) */}
      <div className={`w-full py-24 ${isDark ? 'bg-brand-dark/30 border-y border-white/5' : 'bg-white border-y border-brand-sepia/20'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl md:text-4xl font-black text-center mb-16 ${textMain}`}>{t.howItWorks}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: t.step1Title, desc: t.step1Desc, icon: Zap },
              { step: '02', title: t.step2Title, desc: t.step2Desc, icon: Leaf },
              { step: '03', title: t.step3Title, desc: t.step3Desc, icon: TreePine },
              { step: '04', title: t.step4Title, desc: t.step4Desc, icon: LineChart }
            ].map((item, i) => (
              <div key={i} className={`relative p-8 rounded-3xl ${glassPanel} ${glassHover} group overflow-hidden`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 relative z-10 ${isDark ? 'bg-brand-green-light/20 text-brand-green-light' : 'bg-brand-green-light/30 text-brand-dark'}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-3 ${textMain}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed ${textSub}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. ROADMAP (Nossa Trajetória) */}
      <div className="w-full max-w-4xl mx-auto px-6 py-24">
        <h2 className={`text-3xl md:text-4xl font-black text-center mb-16 ${textMain}`}>{t.roadmapTitle}</h2>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-500 before:to-transparent">
          {[
            { date: t.rm1Date, text: t.rm1Text },
            { date: t.rm2Date, text: t.rm2Text },
            { date: t.rm3Date, text: t.rm3Text },
            { date: t.rm4Date, text: t.rm4Text },
            { date: t.rm5Date, text: t.rm5Text }
          ].map((item, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 ${isDark ? 'bg-brand-dark border-brand-green-light' : 'bg-white border-brand-green-light'} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-brand-green-light/50 shadow-lg z-10`} />
              
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl ${glassPanel}`}>
                <time className={`font-mono text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'} mb-1 block`}>{item.date}</time>
                <div className={`text-sm font-medium ${textMain}`}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`w-full py-24 ${isDark ? 'bg-brand-dark/50' : 'bg-brand-bg-light/50'}`}>
        <div className="w-full max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className={`text-2xl md:text-3xl font-black mb-12 ${textMain}`}>Onde o seu impacto se materializa</h2>
        <div className="flex flex-wrap justify-center items-center gap-6">
          <AssetImage src="/assets/forest_pixel_2.jpg" alt="Reserva Amazônica" className="w-64 h-40" />
          <AssetImage src="/assets/forest_pixel_3.jpg" alt="Mata Atlântica" className="w-64 h-40" />
          <AssetImage src="/assets/forest_pixel_4.jpg" alt="Cerrado Reflorestado" className="w-64 h-40" />
        </div>
      </div>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className={`text-3xl md:text-4xl font-black mb-4 ${textMain}`}>{t.trustTitle}</h2>
          <p className={`text-lg max-w-2xl mx-auto mb-16 ${textSub}`}>{t.trustSubtitle}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { title: "Garantia de Plantio", desc: "Registros imutáveis com geolocalização e evidências fotográficas.", icon: Globe2, color: 'blue' },
              { title: "Compliance Automático", desc: "Exportação direta de dados auditáveis para seus relatórios.", icon: ShieldCheck, color: 'emerald' },
              { title: "Retenção de Clientes", desc: "Transforme consumidores finais em embaixadores da sua marca.", icon: Users, color: 'purple' }
            ].map((feature, i) => {
              const bgIconDark = feature.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : feature.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400';
              const bgIconLight = feature.color === 'blue' ? 'bg-blue-100 text-blue-600' : feature.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600';
              return (
                <div key={i} className={`p-8 rounded-3xl ${glassPanel} ${glassHover}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isDark ? bgIconDark : bgIconLight}`}><feature.icon className="w-6 h-6" /></div>
                  <h3 className={`text-xl font-bold mb-3 ${textMain}`}>{feature.title}</h3>
                  <p className={`text-sm ${textSub}`}>{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 8. FOOTER / CTA FINAL */}
      <footer className={`w-full border-t relative overflow-hidden ${isDark ? 'bg-brand-dark border-white/5' : 'bg-white border-brand-sepia/20'}`}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-green-light/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
          <h2 className={`text-3xl md:text-5xl font-black mb-6 ${textMain}`}>{t.ctaTitle}</h2>
          <p className={`text-lg mb-10 ${textSub}`}>{t.ctaSub}</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a href="https://wa.me/5588996437794" target="_blank" rel="noreferrer" className="bg-brand-green-light hover:bg-brand-green-light/90 text-brand-dark font-extrabold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2">
               <MessageSquare className="w-5 h-5" /> Fale no WhatsApp
             </a>
             <a href="mailto:contato@florestas.social" className={`font-extrabold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 border ${isDark ? 'bg-brand-sepia/10 hover:bg-brand-sepia/20 text-brand-bg-light border-brand-sepia/20' : 'bg-brand-bg-light hover:bg-white text-brand-dark border-brand-sepia/30'}`}>
               <Mail className="w-5 h-5" /> contato@florestas.social
             </a>
          </div>
        </div>
        
        <div className={`w-full py-6 text-center text-sm border-t ${isDark ? 'border-white/5 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
          © 2026 Florestas.social - Unindo Tecnologia e Sustentabilidade. Todos os direitos reservados.
        </div>
      </footer>

    </main>
  );
}
