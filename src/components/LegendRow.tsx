const LEGEND_ITEMS = [
  {
    className: 'legend-chip__swatch--cat',
    label: 'Cat events can pull her either direction.',
  },
  {
    className: 'legend-chip__swatch--rain',
    label: 'Rain turns her back toward home.',
  },
  {
    className: 'legend-chip__swatch--dog',
    label: 'Passing dogs make her stop and stare.',
  },
  {
    className: 'legend-chip__swatch--stubborn',
    label: 'Stubborn streaks scramble direction entirely.',
  },
];

export function LegendRow() {
  return (
    <div className="legend-row">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.className} className="legend-chip">
          <span className={`legend-chip__swatch ${item.className}`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}
