import React from "react";
import {
  Chip,
  Kicker,
  PixelTree,
  Bar,
  Phone,
  Desktop,
  Artboard,
  SectionTitle,
  Placeholder,
  Field,
  FieldLabel,
  PersonaIntro,
  Legend,
  t,
} from "../components/primitives.jsx";

/* Brand / Vendedor screens — Beatriz. Desktop + checkout flow. 3 variations. */

function BrandV1_Dashboard(){
  return (
    <Desktop url="florestas.social/brand">
      <div className="stack-lg">
        <div className="row between">
          <div>
            <div className="kicker tone-forest">{t("b.welcome")}</div>
            <div className="h-screen">{t("b.relationship")}</div>
          </div>
          <div className="cta-stack">
            <button className="btn forest">{t("b.distribute")}</button>
            <button className="btn">{t("b.new_activity")}</button>
          </div>
        </div>

        <div className="kpi-grid">
          {[
            ["b.kpi.balance","500", "leaf"],
            ["b.kpi.trees","5",""],
            ["b.kpi.carbon","1.25 t",""],
            ["b.kpi.members","312",""],
            ["b.kpi.distributed","2 840",""],
            ["b.kpi.activation","68 %",""],
          ].map(([k,v,tone],i)=>(
            <div key={i} className="kpi">
              <Kicker tone={tone || undefined}>{t(k)}</Kicker>
              <div className={"h-num " + (tone==="leaf"?"tone-leaf":"")}>{v}</div>
            </div>
          ))}
        </div>

        <div className="box">
          <Kicker>{t("b.last_tx")}</Kicker>
          <table className="tbl" style={{marginTop:8}}>
            <thead><tr><th>#</th><th>{t("common.activity")}</th><th>{t("common.status")}</th><th style={{textAlign:"right"}}>{t("common.leafs")}</th></tr></thead>
            <tbody>
              <tr><td>01</td><td>{t("b.tx1")}</td><td><Chip kind="verified">{t("status.verified")}</Chip></td><td style={{textAlign:"right",fontFamily:"JetBrains Mono"}}>+500</td></tr>
              <tr><td>02</td><td>{t("b.tx2")}</td><td><Chip kind="planted">{t("status.planted")}</Chip></td><td style={{textAlign:"right",fontFamily:"JetBrains Mono"}}>−120</td></tr>
              <tr><td>03</td><td>{t("b.tx3")}</td><td><Chip>{t("status.review")}</Chip></td><td style={{textAlign:"right",fontFamily:"JetBrains Mono"}}>−40</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </Desktop>
  );
}

function BrandV2_Checkout(){
  return (
    <Desktop url="florestas.social/brand/nursery">
      <div className="stack-lg">
        <div style={{textAlign:"center"}}>
          <div className="h-screen">{t("b.checkout.title")}</div>
          <div className="body-sm" style={{maxWidth:520, margin:"4px auto 0"}}>{t("b.checkout.sub")}</div>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:14}}>
          <div className="pkg">
            <Kicker tone="forest">{t("b.pkg1.name")}</Kicker>
            <div className="body-sm">{t("b.pkg1.desc")}</div>
            <div className="h-num" style={{marginTop:10}}>R$ 50</div>
            <button className="btn block" style={{marginTop:10}}>{t("b.pkg.cta")}</button>
          </div>
          <div className="pkg best">
            <span className="ribbon">{t("b.pkg2.tag")}</span>
            <Kicker tone="forest">{t("b.pkg2.name")}</Kicker>
            <div className="body-sm">{t("b.pkg2.desc")}</div>
            <div className="h-num" style={{marginTop:10}}>R$ 200</div>
            <button className="btn forest block" style={{marginTop:10}}>{t("b.pkg.cta")}</button>
          </div>
          <div className="pkg">
            <Kicker tone="forest">{t("b.pkg3.name")}</Kicker>
            <div className="body-sm">{t("b.pkg3.desc")}</div>
            <div className="h-num" style={{marginTop:10}}>—</div>
            <button className="btn ghost block" style={{marginTop:10}}>{t("b.pkg.custom")}</button>
          </div>
        </div>

        <div className="notes" style={{textAlign:"center"}}>
          {t("common.web3")}
        </div>
      </div>
    </Desktop>
  );
}

function BrandV3_Activity(){
  return (
    <Desktop url="florestas.social/brand/activity/new">
      <div className="stack-lg">
        <div>
          <div className="kicker">{t("b.relationship")}</div>
          <div className="h-screen">{t("b.activity.title")}</div>
          <div className="body-sm">{t("b.activity.sub")}</div>
        </div>

        <div className="steps">
          <div className="stp done">1 · {t("b.steps.objective")}</div>
          <div className="stp active">2 · {t("b.steps.type")}</div>
          <div className="stp">3 · {t("b.steps.dist")}</div>
          <div className="stp">4 · {t("b.steps.benefit")}</div>
          <div className="stp">5 · {t("b.steps.publish")}</div>
        </div>

        <div className="modal">
          <Kicker>{t("b.modal.title")}</Kicker>
          <div className="body-sm">{t("b.modal.sub")}</div>
          <div className="stack" style={{marginTop:10}}>
            <div className="box">
              <div className="h-card">{t("b.type.digital")}</div>
              <div className="body-sm">{t("b.type.digital.desc")}</div>
            </div>
            <div className="box subtle" style={{borderColor:"var(--forest)", borderWidth:2}}>
              <div className="row between">
                <div className="h-card" style={{color:"var(--forest)"}}>{t("b.type.physical")}</div>
                <Chip kind="verified">QR</Chip>
              </div>
              <div className="body-sm">{t("b.type.physical.desc")}</div>
            </div>
          </div>
        </div>

        <div className="box">
          <Kicker tone="forest">{t("b.cfg.title")}</Kicker>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:8}}>
            <Field label={t("b.cfg.product")}><div className="input">MARATA-SUCO-001</div></Field>
            <Field label={t("b.cfg.leafs_per")}><div className="input">10</div></Field>
            <Field label={t("b.cfg.total")}><div className="input">100</div></Field>
            <Field label={t("b.cfg.period")}><div className="input">30 d</div></Field>
          </div>
          <div className="cta-stack" style={{marginTop:12, justifyContent:"flex-end"}}>
            <button className="btn">{t("common.back")}</button>
            <button className="btn forest">{t("b.cfg.publish")}</button>
          </div>
        </div>
      </div>
    </Desktop>
  );
}

function BrandScreens(){
  return (
    <div>
      <PersonaIntro title={t("b.title")} sub={t("b.sub")} role="Desktop · Marca / Vendedor / CS"/>
      <SectionTitle>{t("b.relationship")} · {t("persona.brand")}</SectionTitle>
      <div className="artboards cols-1">
        <Artboard v="01" name="Painel de Impacto" note="KPIs + últimas transações">
          <BrandV1_Dashboard/>
        </Artboard>
        <Artboard v="02" name="Viveiro Corporativo" note="Aquisição de mognos e folhas">
          <BrandV2_Checkout/>
        </Artboard>
        <Artboard v="03" name="Criador de Atividades" note="Distribuir folhas via QR ou digital">
          <BrandV3_Activity/>
        </Artboard>
      </div>

      <div className="notes" style={{marginTop:24}}>
        <b>Decisões de UX</b>
        <ul>
          <li>Saldo de folhas é o KPI principal — todos os fluxos começam ou voltam para ele.</li>
          <li>Pacotes Semente / Viveiro / Safra com nomes consistentes em PT-ES-EN; preço numérico universal.</li>
          <li>Wizard de atividade tem 5 etapas curtas em vez de um formulário longo.</li>
          <li>Modal "Como deseja distribuir?" separa atividade digital de produto físico (QR).</li>
        </ul>
      </div>
    </div>
  );
}


export { BrandScreens };
