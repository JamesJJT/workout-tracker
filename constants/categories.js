export const WORKOUT_CATEGORIES = {
  CHEST: 'Chest',
  BACK: 'Back',
  LEGS: 'Legs',
  SHOULDERS: 'Shoulders',
  ARMS: 'Arms',
  CORE: 'Core',
  CARDIO: 'Cardio',
  OTHER: 'Other',
};

export const CATEGORY_LIST = Object.values(WORKOUT_CATEGORIES);

export const FILTER_OPTIONS = {
  ALL: 'All',
  ...WORKOUT_CATEGORIES,
};
