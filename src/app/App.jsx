/* App shell — language + persona state */

import React, { useEffect, useState } from "react";

import { TR } from "../i18n/i18n.js";
import { MemberScreens } from "../screens/screen-member.jsx";
import { BrandScreens } from "../screens/screen-brand.jsx";
import {
  PartnerScreens,
  ValidatorScreen,
  AdminScreen,
} from "../screens/screen-ops.jsx";

const PERSONAS = [
  { id: "member", key: "persona.member", Comp: MemberScreens },
  { id: "brand", key: "persona.brand", Comp: BrandScreens },
  { id: "partner", key: "persona.partner", Comp: PartnerScreens },
  { id: "validator", key: "persona.validator", Comp: ValidatorScreen },
  { id: "admin", key: "persona.admin", Comp: AdminScreen },
];

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("fs_lang") || "pt");
  const [persona, setPersona] = useState(
    () => localStorage.getItem("fs_persona") || "member"
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("fs_theme") || "light"
  );

  useEffect(() => {
    window.__TR = TR[lang];
    localStorage.setItem("fs_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("fs_persona", persona);
  }, [persona]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fs_theme", theme);
  }, [theme]);

  if (!window.__TR) {
    window.__TR = TR[lang];
  }

  const active = PERSONAS.find((p) => p.id === persona) || PERSONAS[0];
  const ActiveScreen = active.Comp;

  return (
    <div>
      <header className="app-header" data-screen-label="00 Header">
        <div className="brand-mark">
          <span className="logo">
            <i />
            <i className="g" />
            <i className="g" />
            <i />
            <i className="g" />
            <i className="g" />
            <i className="g" />
            <i className="g" />
            <i className="g" />
            <i className="g" />
            <i className="g" />
            <i className="g" />
            <i />
            <i className="g" />
            <i className="g" />
            <i />
          </span>
          <span>florestas.social</span>
        </div>

        <nav className="persona-tabs" aria-label="Persona switcher">
          {PERSONAS.map((p, i) => (
            <button
              key={p.id}
              className={`persona-tab ${persona === p.id ? "active" : ""}`}
              onClick={() => setPersona(p.id)}
              type="button"
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <span>{TR[lang]?.[p.key] || p.id}</span>
            </button>
          ))}
        </nav>

        <div
          className="lang-switch"
          role="tablist"
          aria-label="Theme"
          style={{ marginRight: 6 }}
        >
          <button
            className={theme === "light" ? "active" : ""}
            onClick={() => setTheme("light")}
            title="Light mode"
            type="button"
          >
            ☼
          </button>
          <button
            className={theme === "dark" ? "active" : ""}
            onClick={() => setTheme("dark")}
            title="Dark mode"
            type="button"
          >
            ☾
          </button>
        </div>

        <div className="lang-switch" role="tablist" aria-label="Language">
          {["pt", "es", "en"].map((language) => (
            <button
              key={language}
              className={lang === language ? "active" : ""}
              onClick={() => setLang(language)}
              type="button"
            >
              {language.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main
        className="persona-pane"
        key={`${persona}-${lang}`}
        data-screen-label={`0${
          PERSONAS.findIndex((p) => p.id === persona) + 1
        } ${persona}`}
      >
        <ActiveScreen />
      </main>
    </div>
  );
}

export default App;
