/* Reusable wireframe primitives shared by every screen. */

import React from "react";

const t = (key) => (window.__TR && window.__TR[key]) || key;

function Chip({ kind, children }){
  return <span className={"chip " + (kind || "")}>{children}</span>;
}

function Kicker({ tone, children }){
  return <div className={"kicker " + (tone ? "tone-" + tone : "")}>{children}</div>;
}

function PixelTree({ small }){
  // 7 cols x 8 rows ascii layout
  const cells = [
    " ", " ", "l", "l", "l", " ", " ",
    " ", "l", "l", "d", "l", "l", " ",
    "l", "l", "d", "d", "d", "l", "l",
    " ", "l", "l", "d", "l", "l", " ",
    " ", " ", "l", "d", "l", " ", " ",
    " ", " ", " ", "t", " ", " ", " ",
    " ", " ", " ", "t", " ", " ", " ",
    " ", " ", "t", "t", "t", " ", " ",
  ];
  const sz = small ? 6 : 10;
  return (
    <div className="pixel-tree" style={{
      gridTemplateColumns: `repeat(7, ${sz}px)`,
      gridTemplateRows: `repeat(8, ${sz}px)`
    }}>
      {cells.map((c,i)=> <i key={i} className={c.trim()}/>)}
    </div>
  );
}

function Bar({ value, blocks }){
  if (blocks){
    const total = 10;
    const filled = Math.round((value/100)*total);
    return (
      <div className="bar blocks">
        {Array.from({length: total}).map((_,i)=>
          <i key={i} className={i < filled ? "" : "empty"}/>
        )}
      </div>
    );
  }
  return <div className="bar"><i style={{width: value + "%"}}/></div>;
}

function Phone({ children }){
  return (
    <div className="phone">
      <div className="phone-inner">
        <div className="status-bar">
          <span>9:41</span>
          <span>◉ ◉ ◉</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Desktop({ url, children }){
  return (
    <div className="desktop">
      <div className="desktop-bar">
        <span className="dot"/><span className="dot"/><span className="dot"/>
        <span className="url">{url || "florestas.social/app"}</span>
      </div>
      <div className="desktop-body">{children}</div>
    </div>
  );
}

function Artboard({ v, name, note, children }){
  return (
    <div className="artboard">
      <div className="artboard-label">
        <span className="v">{v}</span>
        <span className="name">{name}</span>
        {note && <span className="note">{note}</span>}
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ children }){
  return (
    <div className="section-title">
      <h2>{children}</h2>
      <div className="rule"/>
    </div>
  );
}

function Placeholder({ children, style }){
  return <div className="placeholder" style={style}>{children}</div>;
}

function FieldLabel({ children }){ return <div className="field-label">{children}</div>; }
function Field({ label, children }){
  return <div className="field"><FieldLabel>{label}</FieldLabel>{children}</div>;
}

function PersonaIntro({ title, sub, role, color }){
  return (
    <div className="persona-intro">
      <div>
        <h1>{title}</h1>
        <div className="sub">{sub}</div>
      </div>
      <div className="meta">
        <div>{role || ""}</div>
        <div><b>i18n →</b> PT · ES · EN</div>
        <div style={{marginTop: 6}}>{t("note.responsive")}</div>
      </div>
    </div>
  );
}

function Legend(){
  return (
    <div className="legend">
      <span className="li available">{t("status.available")}</span>
      <span className="li pending">{t("status.reserved")}</span>
      <span className="li planted">{t("status.planted")}</span>
      <span className="li verified">{t("status.verified")}</span>
      <span className="li review">{t("status.review")}</span>
      <span className="li error">{t("status.error")}</span>
    </div>
  );
}


export {
  t,
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
};
