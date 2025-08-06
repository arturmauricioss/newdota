// src/components/PlayerSelect.tsx
import React from "react";

type PlayerSelectProps = {
  value: string | null;
  onChange: (newValue: string) => void;
  options: string[];
  disabled?: boolean;
};

const PlayerSelect: React.FC<PlayerSelectProps> = ({
  value,
  onChange,
  options,
  disabled = false,
}) => {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="player-select"
    >
      <option value="" disabled>
        Selecione um jogador
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default PlayerSelect;
