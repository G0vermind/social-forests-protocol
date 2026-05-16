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

/* Member screens — Lucas, "O Cuidador". Mobile-first. 3 variations. */

function MemberV1_Home(){
  return (
    <Phone>
      <div className="stack">
        <div className="row between">
          <div>
            <div className="kicker">{t("m.greeting")}</div>
            <div className="h-screen">{t("common.viveiro")}</div>
          </div>
          <Chip>L2</Chip>
        </div>

        <div className="box subtle">
          <div className="row between">
            <Kicker tone="leaf">{t("m.hero.balance")}</Kicker>
            <Chip kind="leaf">{t("common.leafs.unit")}</Chip>
          </div>
          <div className="h-num tone-leaf">840<span className="u">{t("common.leafs")}</span></div>
          <div className="body-sm">{t("m.hero.next")}</div>
          <div style={{marginTop:8}}><Bar value={84} blocks/></div>
        </div>

        <div className="box">
          <div className="row between">
            <Kicker>{t("m.activities.title")}</Kicker>
            <span className="muted">3</span>
          </div>
          <div className="stack" style={{marginTop:8}}>
            {[
              ["m.act1.title","m.act1.reward"],
              ["m.act2.title","m.act2.reward"],
              ["m.act3.title","m.act3.reward"],
            ].map(([a,b],i)=>(
              <div key={i} className="row between" style={{paddingBottom:8, borderBottom: i<2 ? "1px dashed var(--ink)" : "none"}}>
                <div className="col" style={{minWidth:0, flex:1}}>
                  <span className="body" style={{fontWeight:700}}>{t(a)}</span>
                  <span className="muted">{t(b)}</span>
                </div>
                <button className="btn sm">{t("m.activities.cta")}</button>
              </div>
            ))}
          </div>
        </div>

        <button className="btn forest block">{t("common.convert")}</button>
      </div>

      <div className="bottom-nav" style={{position:"absolute", left:0, right:0, bottom:0, borderRadius:"0 0 22px 22px"}}>
        <div className="bn-item active"><div className="icn">▣</div>{t("m.tab.viveiro")}</div>
        <div className="bn-item"><div className="icn">♢</div>{t("m.tab.leafs")}</div>
        <div className="bn-item"><div className="icn">◇</div>{t("m.tab.seals")}</div>
        <div className="bn-item"><div className="icn">○</div>{t("m.tab.benefits")}</div>
      </div>
    </Phone>
  );
}

function MemberV2_Visual(){
  return (
    <Phone>
      <div className="stack">
        <div className="row between">
          <div className="h-screen">{t("m.tree.title")}</div>
          <Chip kind="planted">{t("status.planted")}</Chip>
        </div>
        <div className="body-sm">{t("m.tree.note")}</div>

        <div className="box warm" style={{display:"grid", placeItems:"center", padding: 18}}>
          <PixelTree/>
          <div style={{marginTop:10}} className="row gap-sm">
            <Chip kind="verified">{t("status.verified")}</Chip>
            <Chip>GPS 5°02'S</Chip>
          </div>
        </div>

        <div className="row gap-sm">
          <div className="box" style={{flex:1}}>
            <Kicker tone="leaf">{t("common.leafs")}</Kicker>
            <div className="h-num tone-leaf">840</div>
          </div>
          <div className="box" style={{flex:1}}>
            <Kicker tone="forest">{t("common.mogno.short")}</Kicker>
            <div className="h-num tone-forest">1</div>
          </div>
        </div>

        <div className="box dashed">
          <Kicker>{t("m.seals.title")}</Kicker>
          <div className="row gap-sm" style={{marginTop:8, flexWrap:"wrap"}}>
            <Chip kind="verified">{t("m.seal1")}</Chip>
            <Chip kind="verified">{t("m.seal2")}</Chip>
            <Chip kind="verified">{t("m.seal3")}</Chip>
          </div>
        </div>

        <div className="cta-stack">
          <button className="btn forest" style={{flex:1}}>{t("m.share")}</button>
          <button className="btn ghost" style={{flex:1}}>{t("m.scan")}</button>
        </div>
      </div>
    </Phone>
  );
}

function MemberV3_Tabs(){
  return (
    <Phone>
      <div className="stack">
        <div className="row between">
          <div className="h-screen">{t("common.leafs")}</div>
          <Chip kind="leaf">{t("common.leafs.unit")}</Chip>
        </div>

        <div className="pill-tabs">
          <span className="pt">{t("m.tab.viveiro")}</span>
          <span className="pt active">{t("m.tab.leafs")}</span>
          <span className="pt">{t("m.tab.activities")}</span>
          <span className="pt">{t("m.tab.seals")}</span>
          <span className="pt">{t("m.tab.benefits")}</span>
        </div>

        <div className="box subtle">
          <Kicker tone="leaf">{t("m.hero.balance")}</Kicker>
          <div className="h-num tone-leaf">840<span className="u">{t("common.leafs")}</span></div>
          <div className="body-sm">{t("m.convert.helper")}</div>
          <div className="cta-stack" style={{marginTop:10}}>
            <button className="btn forest">{t("m.convert.cta")}</button>
            <button className="btn">{t("common.history")}</button>
          </div>
        </div>

        <div className="box">
          <Kicker>{t("common.history")}</Kicker>
          <div className="stack" style={{marginTop:8}}>
            {[
              ["+50","Maratá • survey","2d"],
              ["+120","scan lot 8821","5d"],
              ["+30","referral","1w"],
              ["−1000","→ Mahogany #M-002148","2w"],
            ].map((row,i)=>(
              <div key={i} className="row between body-sm" style={{paddingBottom:6, borderBottom: i<3 ? "1px dashed var(--ink)" : "none"}}>
                <span style={{fontFamily:"JetBrains Mono", fontWeight:700, color: row[0].startsWith("−")? "var(--error)":"var(--sun)"}}>{row[0]}</span>
                <span style={{flex:1, padding:"0 8px"}}>{row[1]}</span>
                <span className="muted">{row[2]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="box dashed">
          <Kicker>{t("m.benefits.title")}</Kicker>
          <div className="stack" style={{marginTop:8}}>
            <div className="row between"><span className="body">{t("m.benefit1")}</span><button className="btn sm">{t("m.activities.cta")}</button></div>
            <div className="row between"><span className="body">{t("m.benefit2")}</span><button className="btn sm">{t("m.activities.cta")}</button></div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function MemberScreens(){
  return (
    <div>
      <PersonaIntro
        title={t("m.title")}
        sub={t("m.sub")}
        role="Mobile · Membro / Consumidor"
      />
      <SectionTitle>{t("common.viveiro")} · {t("persona.member")}</SectionTitle>
      <div className="artboards">
        <Artboard v="01" name="Home Viveiro" note="Saldo + atividades abertas">
          <MemberV1_Home/>
        </Artboard>
        <Artboard v="02" name="Mogno em destaque" note="Foco emocional na árvore real">
          <MemberV2_Visual/>
        </Artboard>
        <Artboard v="03" name="Folhas e histórico" note="Conversão + extrato">
          <MemberV3_Tabs/>
        </Artboard>
      </div>

      <div className="notes" style={{marginTop:24}}>
        <b>Decisões de UX</b>
        <ul>
          <li>Web3 invisível: termos como <i>wallet</i>, <i>mint</i>, <i>gas</i> nunca aparecem.</li>
          <li>Folhas (#FFA800) e progresso (#44C495) com cores distintas para evitar ambiguidade.</li>
          <li>Saldo grande + barra de progresso comunica "próxima conversão" sem prometer árvore direta.</li>
          <li>CTA "{t("common.convert")}" cresce automaticamente — PT/ES/EN cabem sem quebrar layout.</li>
        </ul>
      </div>
    </div>
  );
}


export { MemberScreens };
