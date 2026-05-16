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

/* Partner / Validator / Admin — desktop/operations screens */

function PartnerV1(){
  return (
    <Desktop url="florestas.social/partner">
      <div className="stack-lg">
        <div className="row between">
          <div><div className="kicker">{t("p.welcome")}</div><div className="h-screen">{t("p.lots.title")}</div></div>
          <button className="btn forest">{t("p.tree.register")}</button>
        </div>
        <div className="kpi-grid">
          {[["p.kpi.lots","3"],["p.kpi.pending","18"],["p.kpi.registered","124"],["p.kpi.evidence","96"],["p.kpi.approved","82"],["p.kpi.receivable","R$ 4.120"]].map(([k,v],i)=>(
            <div key={i} className="kpi"><Kicker>{t(k)}</Kicker><div className="h-num">{v}</div></div>
          ))}
        </div>
        <div className="box">
          <table className="tbl">
            <thead><tr><th>#</th><th>{t("p.tree.lot")}</th><th>GPS</th><th>{t("common.status")}</th><th>{t("p.tree.tech")}</th></tr></thead>
            <tbody>
              {[["L-8821","5°02'S 40°57'W","verified","status.verified","C. Souza"],
                ["L-8822","5°03'S 40°58'W","planted","status.planted","C. Souza"],
                ["L-8823","5°04'S 40°56'W","review","status.review","J. Lima"],
                ["L-8824","5°02'S 40°59'W","pending","status.reserved","J. Lima"]].map((r,i)=>(
                <tr key={i}><td>{String(i+1).padStart(2,"0")}</td><td style={{fontFamily:"JetBrains Mono"}}>{r[0]}</td><td style={{fontFamily:"JetBrains Mono"}} className="muted">{r[1]}</td><td><Chip kind={r[2]}>{t(r[3])}</Chip></td><td>{r[4]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <Legend/>
      </div>
    </Desktop>
  );
}

function PartnerV2(){
  return (
    <Desktop url="florestas.social/partner/tree/new">
      <div className="stack-lg">
        <div><div className="kicker">{t("p.tree.register")}</div><div className="h-screen">{t("common.mogno")}</div></div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}}>
          <Field label={t("p.tree.species")}><div className="input">Khaya senegalensis</div></Field>
          <Field label={t("p.tree.lot")}><div className="input">L-8821</div></Field>
          <Field label={t("p.tree.gps")}><div className="input">5°02'14&quot;S 40°57'08&quot;W</div></Field>
          <Field label={t("p.tree.date")}><div className="input">2026-04-12</div></Field>
          <Field label={t("p.tree.tech")}><div className="input">Carla Souza · CREA 12345</div></Field>
          <Field label={t("common.status")}><div><Chip kind="planted">{t("status.planted")}</Chip></div></Field>
        </div>
        <Field label={t("p.tree.photo")}>
          <Placeholder style={{height:140}}>[ photo upload · drag &amp; drop ]</Placeholder>
        </Field>
        <Field label={t("p.tree.evidence")}>
          <Placeholder style={{height:80}}>[ documento técnico · pdf ]</Placeholder>
        </Field>
        <div className="muted">{t("p.fieldhint")}</div>
        <div className="cta-stack" style={{justifyContent:"flex-end"}}>
          <button className="btn">{t("common.cancel")}</button>
          <button className="btn forest">{t("p.tree.submit")}</button>
        </div>
      </div>
    </Desktop>
  );
}

function PartnerScreens(){
  return (<div>
    <PersonaIntro title={t("p.title")} sub={t("p.sub")} role="Desktop · Parceiro Ambiental"/>
    <SectionTitle>{t("persona.partner")}</SectionTitle>
    <div className="artboards cols-1">
      <Artboard v="01" name="Lotes ativos" note="Visão tabular de mognos por lote">
        <PartnerV1/>
      </Artboard>
      <Artboard v="02" name="Registrar mogno" note="Formulário enxuto com evidências">
        <PartnerV2/>
      </Artboard>
    </div>
    <div className="notes" style={{marginTop:24}}>
      <b>Decisões de UX</b>
      <ul>
        <li>Mogno africano é a única espécie do MVP — campo "espécie" pré-preenchido.</li>
        <li>GPS, foto, lote e responsável técnico exigidos antes de pedir validação.</li>
        <li>Status segue tokens do design system (disponível / em reserva / plantado / verificado / em análise / erro).</li>
      </ul>
    </div>
  </div>);
}

function ValidatorScreen(){
  return (<div>
    <PersonaIntro title={t("v.title")} sub={t("v.sub")} role="Desktop · Auditor"/>
    <SectionTitle>{t("v.welcome")}</SectionTitle>
    <div className="artboards cols-1">
      <Artboard v="01" name="Fila + detalhe" note="Split view">
        <Desktop url="florestas.social/validate">
          <div style={{display:"grid", gridTemplateColumns:"240px 1fr 280px", gap:14, minHeight:520}}>
            {/* sidebar queue */}
            <div className="sidebar">
              <Kicker>{t("v.queue")}</Kicker>
              {[["L-8821","review"],["L-8823","review"],["L-8825","pending"],["L-8826","pending"],["L-8819","verified"]].map((r,i)=>(
                <div key={i} className={"sb-item " + (i===0?"active":"")}>
                  <span className="dot" style={{background: r[1]==="review"?"var(--paper-3)":r[1]==="verified"?"var(--mint)":"var(--sun)"}}/>
                  <span style={{fontFamily:"JetBrains Mono"}}>{r[0]}</span>
                </div>
              ))}
            </div>
            {/* detail */}
            <div className="stack-lg">
              <div className="row between">
                <div><div className="kicker">{t("v.detail")}</div><div className="h-screen">Mogno #M-002148</div></div>
                <Chip>L-8821</Chip>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
                <Placeholder style={{height:140}}>[ foto plantio ]</Placeholder>
                <Placeholder style={{height:140}}>[ mapa GPS ]</Placeholder>
              </div>
              <div className="box">
                <Kicker tone="forest">{t("v.checklist")}</Kicker>
                <div className="stack" style={{marginTop:8}}>
                  {["v.chk1","v.chk2","v.chk3","v.chk4"].map((k,i)=>(
                    <div key={i} className="row gap-sm body-sm">
                      <span style={{width:18, height:18, border:"1.5px solid var(--ink)", borderRadius:4, display:"inline-grid", placeItems:"center", background: i<3?"var(--mint)":"var(--paper)"}}>{i<3?"✓":""}</span>
                      {t(k)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="cta-stack">
                <button className="btn forest">{t("v.approve")}</button>
                <button className="btn">{t("v.request")}</button>
                <button className="btn danger">{t("v.reject")}</button>
              </div>
            </div>
            {/* kpi rail */}
            <div className="stack">
              {[["v.kpi.pending","12"],["v.kpi.review","5"],["v.kpi.approved","82"],["v.kpi.rejected","3"]].map(([k,v],i)=>(
                <div key={i} className="kpi"><Kicker>{t(k)}</Kicker><div className="h-num">{v}</div></div>
              ))}
              <div className="notes">{t("v.evidence")}: 4 arquivos</div>
            </div>
          </div>
        </Desktop>
      </Artboard>
    </div>
  </div>);
}

function AdminScreen(){
  return (<div>
    <PersonaIntro title={t("a.title")} sub={t("a.sub")} role="Desktop · Time Florestas"/>
    <SectionTitle>{t("persona.admin")}</SectionTitle>
    <div className="artboards cols-1">
      <Artboard v="01" name="Console do Protocolo" note="Visão executiva + recomendações">
        <Desktop url="florestas.social/admin">
          <div className="stack-lg">
            <div className="row between">
              <div><div className="kicker">{t("a.accounts")}</div><div className="h-screen">{t("a.title")}</div></div>
              <div className="cta-stack">
                <button className="btn">{t("common.export")}</button>
                <button className="btn forest">{t("common.search")}</button>
              </div>
            </div>
            <div className="kpi-grid">
              {[["a.kpi.brands","48"],["a.kpi.members","12 480"],["a.kpi.activities","127"],["a.kpi.leafs_issued","1.2 M","leaf"],["a.kpi.leafs_dist","840 K","leaf"],["a.kpi.leafs_conv","210 K","leaf"],["a.kpi.mogno_acq","2 100"],["a.kpi.validated","1 840"]].map(([k,v,tone],i)=>(
                <div key={i} className="kpi"><Kicker tone={tone||undefined}>{t(k)}</Kicker><div className={"h-num " + (tone==="leaf"?"tone-leaf":"")}>{v}</div></div>
              ))}
            </div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}}>
              <div className="box">
                <Kicker tone="forest">{t("a.recos")}</Kicker>
                <div className="stack" style={{marginTop:8}}>
                  {["a.reco1","a.reco2","a.reco3"].map((k,i)=>(
                    <div key={i} className="row between" style={{paddingBottom:8, borderBottom: i<2?"1px dashed var(--ink)":"none"}}>
                      <span className="body" style={{flex:1}}>{t(k)}</span>
                      <button className="btn sm">→</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="box">
                <Kicker>Marcas</Kicker>
                <table className="tbl" style={{marginTop:8}}>
                  <thead><tr><th>Marca</th><th>{t("common.status")}</th><th style={{textAlign:"right"}}>{t("common.leafs")}</th></tr></thead>
                  <tbody>
                    <tr><td>Maratá</td><td><Chip kind="verified">{t("a.opportunity")}</Chip></td><td style={{textAlign:"right",fontFamily:"JetBrains Mono"}}>+500</td></tr>
                    <tr><td>Café Floresta</td><td><Chip kind="warn">{t("a.risk")}</Chip></td><td style={{textAlign:"right",fontFamily:"JetBrains Mono"}}>parado</td></tr>
                    <tr><td>Bio Ipê</td><td><Chip>{t("status.review")}</Chip></td><td style={{textAlign:"right",fontFamily:"JetBrains Mono"}}>+120</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Desktop>
      </Artboard>
    </div>
  </div>);
}


export { PartnerScreens, ValidatorScreen, AdminScreen };
