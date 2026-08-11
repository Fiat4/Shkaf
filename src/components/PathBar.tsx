import React, { FormEvent } from 'react';
import './PathBar.css';

interface PathBarProps {
  value: string;
  scanning: boolean;
  progressLabel?: string;
  canBrowse: boolean;
  onChange: (value: string) => void;
  onBrowse: () => void;
  onScan: () => void;
  onDemo: () => void;
}

export function PathBar({
  value,
  scanning,
  progressLabel,
  canBrowse,
  onChange,
  onBrowse,
  onScan,
  onDemo,
}: PathBarProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!scanning) onScan();
  };

  return (
    <form className="path-bar" onSubmit={handleSubmit}>
      <label className="path-bar__label" htmlFor="folder-path">
        Путь к папке
      </label>
      <div className="path-bar__row">
        <input
          id="folder-path"
          className="path-bar__input"
          type="text"
          value={value}
          placeholder="/Users/you/Projects или C:\\Users\\you"
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />
        {canBrowse && (
          <button
            type="button"
            className="path-bar__btn path-bar__btn--ghost"
            onClick={onBrowse}
            disabled={scanning}
          >
            Обзор
          </button>
        )}
        <button
          type="submit"
          className="path-bar__btn path-bar__btn--primary"
          disabled={scanning || !value.trim()}
        >
          {scanning ? 'Сканирование…' : 'Показать'}
        </button>
        <button
          type="button"
          className="path-bar__btn path-bar__btn--soft"
          onClick={onDemo}
          disabled={scanning}
        >
          Демо
        </button>
      </div>
      {scanning && progressLabel ? (
        <p className="path-bar__progress">{progressLabel}</p>
      ) : null}
    </form>
  );
}
