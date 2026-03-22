import type { LevelDefinition } from '../game';

interface StageStatsProps {
  level: LevelDefinition;
  pullReserve: number;
  treats: number;
  screamTimeLeft: number;
  progressPct: number;
  distanceToGoal: string;
}

function HudCard({
  label,
  value,
  meterClassName,
  meterWidth,
}: {
  label: string;
  value: string | number;
  meterClassName?: string;
  meterWidth?: string;
}) {
  return (
    <article className="hud-card">
      <span className="hud-card__label">{label}</span>
      <strong>{value}</strong>
      {meterClassName && meterWidth ? (
        <div className="meter">
          <div className={`meter__fill ${meterClassName}`} style={{ width: meterWidth }} />
        </div>
      ) : null}
    </article>
  );
}

export function StageStats({
  level,
  pullReserve,
  treats,
  screamTimeLeft,
  progressPct,
  distanceToGoal,
}: StageStatsProps) {
  return (
    <div className="stage-stats">
      <article className="hud-card stage-level">
        <span className="hud-card__label">Level {level.index}</span>
        <strong>{level.title}</strong>
      </article>

      <HudCard
        label="Force"
        value={`${Math.round(pullReserve)}%`}
        meterClassName="meter__fill--force"
        meterWidth={`${pullReserve}%`}
      />
      <HudCard
        label="Treats"
        value={treats}
        meterClassName="meter__fill--treats"
        meterWidth={`${Math.min(100, (treats / 10) * 100)}%`}
      />
      <HudCard
        label={level.destinationLabel}
        value={distanceToGoal}
        meterClassName="meter__fill--distance"
        meterWidth={`${progressPct}%`}
      />
      <HudCard
        label="Scream"
        value={screamTimeLeft > 0 ? 'Live' : 'Ready'}
      />
    </div>
  );
}
