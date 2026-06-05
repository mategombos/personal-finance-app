interface BadgeProps {
  color: string;
  label: string;
}

export function Badge({ color, label }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
