import React from 'react';

const PRESETS = [
  ['Florestas', '#2f6b3f', '#d9f2c7'],
  ['Terra', '#6b4b2f', '#ead8bd'],
  ['Azul', '#245f73', '#d8eef2'],
  ['Urbano', '#263238', '#dfe8e2'],
  ['Solar', '#9a6a1d', '#f4e1a8'],
];

export function ColorControls({ primaryColor, supportColor, onChange }) {
  return (
    <div className="color-controls">
      <div className="color-presets" aria-label="Paletas sugeridas">
        {PRESETS.map(([label, primary, support]) => (
          <button
            key={label}
            type="button"
            className="color-preset"
            onClick={() => onChange({ primaryColor: primary, supportColor: support })}
            title={label}
          >
            <span style={{ background: primary }} />
            <span style={{ background: support }} />
            <strong>{label}</strong>
          </button>
        ))}
      </div>
      <div className="form-row">
        <label>
          Cor principal
          <input type="color" value={primaryColor} onChange={(event) => onChange({ primaryColor: event.target.value })} />
        </label>
        <label>
          Cor de apoio
          <input type="color" value={supportColor} onChange={(event) => onChange({ supportColor: event.target.value })} />
        </label>
      </div>
    </div>
  );
}
