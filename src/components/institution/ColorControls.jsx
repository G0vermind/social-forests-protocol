import React from 'react';

const PRESETS = [
  ['Florestas', '#2f6b3f', '#d9f2c7', '#172319'],
  ['Terra', '#6b4b2f', '#ead8bd', '#24180f'],
  ['Azul', '#245f73', '#d8eef2', '#102b34'],
  ['Urbano', '#263238', '#dfe8e2', '#121a1d'],
  ['Solar', '#9a6a1d', '#f4e1a8', '#2e210a'],
  ['Noturno', '#14382f', '#203c36', '#fffaf0'],
];

export function ColorControls({ primaryColor, supportColor, textColor, onChange }) {
  return (
    <div className="color-controls">
      <div className="color-presets" aria-label="Paletas sugeridas">
        {PRESETS.map(([label, primary, support, text]) => (
          <button
            key={label}
            type="button"
            className="color-preset"
            onClick={() => onChange({ primaryColor: primary, supportColor: support, textColor: text })}
            title={label}
          >
            <span style={{ background: primary }} />
            <span style={{ background: support }} />
            <span style={{ background: text }} />
            <strong>{label}</strong>
          </button>
        ))}
      </div>
      <div className="form-row three">
        <label>
          Cor principal
          <input type="color" value={primaryColor} onChange={(event) => onChange({ primaryColor: event.target.value })} />
        </label>
        <label>
          Cor de apoio
          <input type="color" value={supportColor} onChange={(event) => onChange({ supportColor: event.target.value })} />
        </label>
        <label>
          Cor do texto
          <input type="color" value={textColor} onChange={(event) => onChange({ textColor: event.target.value })} />
        </label>
      </div>
    </div>
  );
}
