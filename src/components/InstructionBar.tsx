interface InstructionBarProps {
  isBracing: boolean;
}

export function InstructionBar({ isBracing }: InstructionBarProps) {
  return (
    <div className="instruction-bar" aria-label="Controls">
      <span>
        <strong>A</strong> or <strong>Left</strong> pull left toward home
      </span>
      <span>
        <strong>D</strong>, <strong>Right</strong>, or <strong>Space</strong> pull right toward park
      </span>
      <span>
        <strong>S</strong> or <strong>Down</strong> brace
      </span>
      <span>
        <strong>W</strong>, <strong>E</strong>, or <strong>Up</strong> treat
      </span>
      <span>
        <strong>Q</strong> Shiba Scream
      </span>
      <span>
        <strong>R</strong> reset
      </span>
      {isBracing ? <span className="instruction-bar__state">Bracing</span> : null}
    </div>
  );
}
