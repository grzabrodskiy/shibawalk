import type { PointerEvent, ReactNode } from 'react';
import type { Direction, MoodSummary } from '../game';
import { InstructionBar } from './InstructionBar';

interface StatusPanelProps {
  moodSummary: MoodSummary;
  screamTimeLeft: number;
  pullDirection: Direction;
  isBracing: boolean;
  onPullStart: (direction: Direction) => void;
  onPullEnd: () => void;
  onTreat: () => void;
  onScream: () => void;
  onReset: () => void;
}

function ControlIcon({
  label,
  path,
  viewBox = '0 0 24 24',
}: {
  label: string;
  path: ReactNode;
  viewBox?: string;
}) {
  return (
    <span className="action-button__icon" aria-hidden="true">
      <svg viewBox={viewBox} aria-label={label}>
        {path}
      </svg>
    </span>
  );
}

export function StatusPanel({
  moodSummary,
  screamTimeLeft,
  pullDirection,
  isBracing,
  onPullStart,
  onPullEnd,
  onTreat,
  onScream,
  onReset,
}: StatusPanelProps) {
  const handlePullPointer = (
    event: PointerEvent<HTMLButtonElement>,
    direction: Direction | null,
  ) => {
    event.preventDefault();

    if (direction) {
      onPullStart(direction);
      return;
    }

    onPullEnd();
  };

  return (
    <div className="status-panel">
      <div className="status-panel__summary">
        <strong className="status-panel__title">{moodSummary.title}</strong>
        <p className="status-panel__body">{moodSummary.body}</p>
      </div>

      <div className="status-panel__actions">
        <button
          type="button"
          className={`action-button action-button--icon action-button--pull-home${pullDirection === -1 ? ' is-active' : ''}`}
          aria-label="Pull left toward home"
          title="Pull left toward home"
          onPointerDown={(event) => handlePullPointer(event, -1)}
          onPointerUp={(event) => handlePullPointer(event, null)}
          onPointerCancel={(event) => handlePullPointer(event, null)}
          onPointerLeave={(event) => handlePullPointer(event, null)}
        >
          <ControlIcon
            label="Pull left"
            path={
              <>
                <path d="M20 12H6" />
                <path d="M11 7L6 12L11 17" />
              </>
            }
          />
        </button>
        <button
          type="button"
          className={`action-button action-button--icon action-button--pull-park${pullDirection === 1 ? ' is-active' : ''}`}
          aria-label="Pull right toward park"
          title="Pull right toward park"
          onPointerDown={(event) => handlePullPointer(event, 1)}
          onPointerUp={(event) => handlePullPointer(event, null)}
          onPointerCancel={(event) => handlePullPointer(event, null)}
          onPointerLeave={(event) => handlePullPointer(event, null)}
        >
          <ControlIcon
            label="Pull right"
            path={
              <>
                <path d="M4 12H18" />
                <path d="M13 7L18 12L13 17" />
              </>
            }
          />
        </button>
        <button
          type="button"
          className="action-button action-button--icon action-button--treat"
          aria-label="Give treat"
          title="Give treat"
          onClick={onTreat}
        >
          <ControlIcon
            label="Treat"
            path={
              <path d="M7.6 6.2C6.4 4.6 4 4.8 3.2 6.5C2.7 7.6 2.9 8.9 3.7 9.8C2.9 10.7 2.7 12 3.2 13.1C4 14.8 6.4 15 7.6 13.4H16.4C17.6 15 20 14.8 20.8 13.1C21.3 12 21.1 10.7 20.3 9.8C21.1 8.9 21.3 7.6 20.8 6.5C20 4.8 17.6 4.6 16.4 6.2H7.6Z" />
            }
          />
        </button>
        <button
          type="button"
          className={`action-button action-button--icon action-button--scream${screamTimeLeft > 0 ? ' is-active' : ''}`}
          aria-label="Shiba scream"
          title="Shiba scream"
          onClick={onScream}
        >
          <ControlIcon
            label="Shiba scream"
            path={
              <>
                <path d="M6 9.6C6 7.6 7.6 6 9.6 6H13.8L18 3.8V20.2L13.8 18H9.6C7.6 18 6 16.4 6 14.4V9.6Z" />
                <path d="M20.2 8.2C21.1 9.2 21.6 10.5 21.6 12C21.6 13.5 21.1 14.8 20.2 15.8" />
              </>
            }
          />
        </button>
        <button
          type="button"
          className="action-button action-button--icon action-button--ghost"
          aria-label="Reset walk"
          title="Reset walk"
          onClick={onReset}
        >
          <ControlIcon
            label="Reset"
            path={
              <>
                <path d="M7 8H3.8V4.8" />
                <path d="M4.2 8.2C5.7 5.9 8.3 4.4 11.2 4.4C15.7 4.4 19.4 8.1 19.4 12.6C19.4 17.1 15.7 20.8 11.2 20.8C7.6 20.8 4.5 18.4 3.4 15.1" />
              </>
            }
          />
        </button>
        {isBracing ? <span className="status-panel__state">Bracing</span> : null}
      </div>

      <InstructionBar isBracing={isBracing} />
    </div>
  );
}
