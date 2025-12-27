export const formatDuration = (minutes) => {
  if (minutes === undefined || minutes === null || isNaN(minutes)) return 'Duration not recorded';
  const mins = parseInt(minutes);
  if (mins < 1) return '1 min';
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainder = mins % 60;
  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
};
