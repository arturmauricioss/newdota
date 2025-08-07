// src/components/PlayerSelect.tsx
import React from "react";

type PlayerSelectProps = {
  value: number | null;
  onChange: (newValue: number) => void;
  options: { id: number; name: string }[];
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
  onChange={(e) => onChange(Number(e.target.value))}
  disabled={disabled}
  className="player-select"
>
  <option value="" disabled>
    Selecione um jogador
  </option>
  {options.map((option) => (
    <option key={option.id} value={option.id}>
      {option.name}
    </option>
  ))}
</select>

  );
};

export default PlayerSelect;
