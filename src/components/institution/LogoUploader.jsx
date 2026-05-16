import React, { useRef, useState } from 'react';

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

export function LogoUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  function handleFile(file) {
    setError('');
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Use uma imagem PNG, JPG, WEBP ou SVG.');
      return;
    }
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      setError('A logo deve ter até 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.onerror = () => setError('Não foi possível carregar a imagem.');
    reader.readAsDataURL(file);
  }

  return (
    <div className="logo-uploader">
      <div className="logo-uploader-preview">
        {value ? <img src={value} alt="Logo da instituição" /> : <span>Logo</span>}
      </div>
      <div className="logo-uploader-actions">
        <div className="inline-actions wrap">
          <button className="button secondary sm" type="button" onClick={() => inputRef.current?.click()}>
            Enviar logo
          </button>
          {value ? (
            <button className="button ghost sm" type="button" onClick={() => onChange('')}>
              Remover
            </button>
          ) : null}
        </div>
        <p className="field-hint">PNG, JPG, WEBP ou SVG. Até 2MB.</p>
        {error ? <p className="field-error">{error}</p> : null}
      </div>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden onChange={(event) => handleFile(event.target.files?.[0])} />
    </div>
  );
}
