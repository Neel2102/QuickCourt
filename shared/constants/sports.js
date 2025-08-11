// Sports constants for the application

// Sport Types
export const SPORT_TYPES = {
  BADMINTON: 'Badminton',
  TENNIS: 'Tennis',
  FOOTBALL: 'Football',
  CRICKET: 'Cricket',
  BASKETBALL: 'Basketball',
  VOLLEYBALL: 'Volleyball',
  TABLE_TENNIS: 'Table Tennis',
  SQUASH: 'Squash',
  SWIMMING: 'Swimming',
  GYM: 'Gym',
  YOGA: 'Yoga',
  DANCE: 'Dance',
  MARTIAL_ARTS: 'Martial Arts',
  OTHER: 'Other',
};

// Sport Categories
export const SPORT_CATEGORIES = {
  RACKET_SPORTS: 'Racket Sports',
  TEAM_SPORTS: 'Team Sports',
  INDIVIDUAL_SPORTS: 'Individual Sports',
  FITNESS: 'Fitness & Wellness',
  COMBAT_SPORTS: 'Combat Sports',
  WATER_SPORTS: 'Water Sports',
  OTHER: 'Other',
};

// Sport to Category Mapping
export const SPORT_CATEGORY_MAPPING = {
  [SPORT_TYPES.BADMINTON]: SPORT_CATEGORIES.RACKET_SPORTS,
  [SPORT_TYPES.TENNIS]: SPORT_CATEGORIES.RACKET_SPORTS,
  [SPORT_TYPES.TABLE_TENNIS]: SPORT_CATEGORIES.RACKET_SPORTS,
  [SPORT_TYPES.SQUASH]: SPORT_CATEGORIES.RACKET_SPORTS,
  
  [SPORT_TYPES.FOOTBALL]: SPORT_CATEGORIES.TEAM_SPORTS,
  [SPORT_TYPES.CRICKET]: SPORT_CATEGORIES.TEAM_SPORTS,
  [SPORT_TYPES.BASKETBALL]: SPORT_CATEGORIES.TEAM_SPORTS,
  [SPORT_TYPES.VOLLEYBALL]: SPORT_CATEGORIES.TEAM_SPORTS,
  
  [SPORT_TYPES.SWIMMING]: SPORT_CATEGORIES.INDIVIDUAL_SPORTS,
  
  [SPORT_TYPES.GYM]: SPORT_CATEGORIES.FITNESS,
  [SPORT_TYPES.YOGA]: SPORT_CATEGORIES.FITNESS,
  [SPORT_TYPES.DANCE]: SPORT_CATEGORIES.FITNESS,
  
  [SPORT_TYPES.MARTIAL_ARTS]: SPORT_CATEGORIES.COMBAT_SPORTS,
  
  [SPORT_TYPES.OTHER]: SPORT_CATEGORIES.OTHER,
};

// Sport Icons (for UI display)
export const SPORT_ICONS = {
  [SPORT_TYPES.BADMINTON]: '🏸',
  [SPORT_TYPES.TENNIS]: '🎾',
  [SPORT_TYPES.FOOTBALL]: '⚽',
  [SPORT_TYPES.CRICKET]: '🏏',
  [SPORT_TYPES.BASKETBALL]: '🏀',
  [SPORT_TYPES.VOLLEYBALL]: '🏐',
  [SPORT_TYPES.TABLE_TENNIS]: '🏓',
  [SPORT_TYPES.SQUASH]: '🥎',
  [SPORT_TYPES.SWIMMING]: '🏊',
  [SPORT_TYPES.GYM]: '💪',
  [SPORT_TYPES.YOGA]: '🧘',
  [SPORT_TYPES.DANCE]: '💃',
  [SPORT_TYPES.MARTIAL_ARTS]: '🥋',
  [SPORT_TYPES.OTHER]: '🏃',
};

// Sport Colors (for UI display)
export const SPORT_COLORS = {
  [SPORT_TYPES.BADMINTON]: '#FF6B6B', // Red
  [SPORT_TYPES.TENNIS]: '#4ECDC4', // Teal
  [SPORT_TYPES.FOOTBALL]: '#45B7D1', // Blue
  [SPORT_TYPES.CRICKET]: '#96CEB4', // Green
  [SPORT_TYPES.BASKETBALL]: '#FFEAA7', // Yellow
  [SPORT_TYPES.VOLLEYBALL]: '#DDA0DD', // Plum
  [SPORT_TYPES.TABLE_TENNIS]: '#98D8C8', // Mint
  [SPORT_TYPES.SQUASH]: '#F7DC6F', // Gold
  [SPORT_TYPES.SWIMMING]: '#85C1E9', // Sky Blue
  [SPORT_TYPES.GYM]: '#F1948A', // Salmon
  [SPORT_TYPES.YOGA]: '#D7BDE2', // Lavender
  [SPORT_TYPES.DANCE]: '#F8C471', // Orange
  [SPORT_TYPES.MARTIAL_ARTS]: '#82E0AA', // Light Green
  [SPORT_TYPES.OTHER]: '#BB8FCE', // Purple
};

// Sport Equipment (common equipment for each sport)
export const SPORT_EQUIPMENT = {
  [SPORT_TYPES.BADMINTON]: ['Racket', 'Shuttlecock', 'Net', 'Court Markings'],
  [SPORT_TYPES.TENNIS]: ['Racket', 'Tennis Ball', 'Net', 'Court Markings'],
  [SPORT_TYPES.FOOTBALL]: ['Football', 'Goal Posts', 'Field Markings'],
  [SPORT_TYPES.CRICKET]: ['Bat', 'Ball', 'Stumps', 'Pitch', 'Protective Gear'],
  [SPORT_TYPES.BASKETBALL]: ['Basketball', 'Hoop', 'Backboard', 'Court Markings'],
  [SPORT_TYPES.VOLLEYBALL]: ['Volleyball', 'Net', 'Court Markings'],
  [SPORT_TYPES.TABLE_TENNIS]: ['Paddle', 'Ball', 'Table', 'Net'],
  [SPORT_TYPES.SQUASH]: ['Racket', 'Ball', 'Court', 'Eye Protection'],
  [SPORT_TYPES.SWIMMING]: ['Swimming Pool', 'Lanes', 'Timing Equipment'],
  [SPORT_TYPES.GYM]: ['Exercise Equipment', 'Weights', 'Mats', 'Mirrors'],
  [SPORT_TYPES.YOGA]: ['Yoga Mat', 'Blocks', 'Straps', 'Blankets'],
  [SPORT_TYPES.DANCE]: ['Dance Floor', 'Mirrors', 'Sound System', 'Barres'],
  [SPORT_TYPES.MARTIAL_ARTS]: ['Training Area', 'Protective Gear', 'Weapons (if applicable)'],
  [SPORT_TYPES.OTHER]: ['General Sports Equipment'],
};

// Sport Difficulty Levels
export const SPORT_DIFFICULTY = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
};

// Sport Difficulty Mapping
export const SPORT_DIFFICULTY_MAPPING = {
  [SPORT_TYPES.BADMINTON]: SPORT_DIFFICULTY.BEGINNER,
  [SPORT_TYPES.TENNIS]: SPORT_DIFFICULTY.INTERMEDIATE,
  [SPORT_TYPES.FOOTBALL]: SPORT_DIFFICULTY.BEGINNER,
  [SPORT_TYPES.CRICKET]: SPORT_DIFFICULTY.INTERMEDIATE,
  [SPORT_TYPES.BASKETBALL]: SPORT_DIFFICULTY.BEGINNER,
  [SPORT_TYPES.VOLLEYBALL]: SPORT_DIFFICULTY.INTERMEDIATE,
  [SPORT_TYPES.TABLE_TENNIS]: SPORT_DIFFICULTY.BEGINNER,
  [SPORT_TYPES.SQUASH]: SPORT_DIFFICULTY.ADVANCED,
  [SPORT_TYPES.SWIMMING]: SPORT_DIFFICULTY.BEGINNER,
  [SPORT_TYPES.GYM]: SPORT_DIFFICULTY.BEGINNER,
  [SPORT_TYPES.YOGA]: SPORT_DIFFICULTY.BEGINNER,
  [SPORT_TYPES.DANCE]: SPORT_DIFFICULTY.INTERMEDIATE,
  [SPORT_TYPES.MARTIAL_ARTS]: SPORT_DIFFICULTY.ADVANCED,
  [SPORT_TYPES.OTHER]: SPORT_DIFFICULTY.BEGINNER,
};

// Sport Duration (typical session duration in minutes)
export const SPORT_DURATION = {
  [SPORT_TYPES.BADMINTON]: { min: 30, max: 120, default: 60 },
  [SPORT_TYPES.TENNIS]: { min: 45, max: 180, default: 90 },
  [SPORT_TYPES.FOOTBALL]: { min: 60, max: 120, default: 90 },
  [SPORT_TYPES.CRICKET]: { min: 120, max: 480, default: 180 },
  [SPORT_TYPES.BASKETBALL]: { min: 45, max: 120, default: 60 },
  [SPORT_TYPES.VOLLEYBALL]: { min: 45, max: 120, default: 60 },
  [SPORT_TYPES.TABLE_TENNIS]: { min: 30, max: 90, default: 45 },
  [SPORT_TYPES.SQUASH]: { min: 30, max: 90, default: 45 },
  [SPORT_TYPES.SWIMMING]: { min: 30, max: 120, default: 60 },
  [SPORT_TYPES.GYM]: { min: 30, max: 180, default: 60 },
  [SPORT_TYPES.YOGA]: { min: 30, max: 120, default: 60 },
  [SPORT_TYPES.DANCE]: { min: 45, max: 120, default: 60 },
  [SPORT_TYPES.MARTIAL_ARTS]: { min: 45, max: 120, default: 60 },
  [SPORT_TYPES.OTHER]: { min: 30, max: 120, default: 60 },
};

// Sport Capacity (typical number of players)
export const SPORT_CAPACITY = {
  [SPORT_TYPES.BADMINTON]: { min: 2, max: 4, default: 2 },
  [SPORT_TYPES.TENNIS]: { min: 2, max: 4, default: 2 },
  [SPORT_TYPES.FOOTBALL]: { min: 6, max: 22, default: 11 },
  [SPORT_TYPES.CRICKET]: { min: 6, max: 22, default: 11 },
  [SPORT_TYPES.BASKETBALL]: { min: 2, max: 10, default: 5 },
  [SPORT_TYPES.VOLLEYBALL]: { min: 4, max: 12, default: 6 },
  [SPORT_TYPES.TABLE_TENNIS]: { min: 2, max: 4, default: 2 },
  [SPORT_TYPES.SQUASH]: { min: 2, max: 4, default: 2 },
  [SPORT_TYPES.SWIMMING]: { min: 1, max: 8, default: 1 },
  [SPORT_TYPES.GYM]: { min: 1, max: 50, default: 1 },
  [SPORT_TYPES.YOGA]: { min: 1, max: 30, default: 1 },
  [SPORT_TYPES.DANCE]: { min: 1, max: 30, default: 1 },
  [SPORT_TYPES.MARTIAL_ARTS]: { min: 1, max: 20, default: 1 },
  [SPORT_TYPES.OTHER]: { min: 1, max: 20, default: 1 },
};

// Sport Seasons (when the sport is typically played)
export const SPORT_SEASONS = {
  ALL_YEAR: 'All Year',
  SUMMER: 'Summer',
  WINTER: 'Winter',
  MONSOON: 'Monsoon',
  SPRING: 'Spring',
  FALL: 'Fall',
};

// Sport Season Mapping
export const SPORT_SEASON_MAPPING = {
  [SPORT_TYPES.BADMINTON]: [SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.TENNIS]: [SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.FOOTBALL]: [SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.CRICKET]: [SPORT_SEASONS.SUMMER, SPORT_SEASONS.MONSOON],
  [SPORT_TYPES.BASKETBALL]: [SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.VOLLEYBALL]: [SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.TABLE_TENNIS]: [SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.SQUASH]: [SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.SWIMMING]: [SPORT_SEASONS.SUMMER, SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.GYM]: [SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.YOGA]: [SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.DANCE]: [SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.MARTIAL_ARTS]: [SPORT_SEASONS.ALL_YEAR],
  [SPORT_TYPES.OTHER]: [SPORT_SEASONS.ALL_YEAR],
};

// Sport Age Groups
export const SPORT_AGE_GROUPS = {
  KIDS: 'Kids (5-12 years)',
  TEENS: 'Teens (13-19 years)',
  ADULTS: 'Adults (20-59 years)',
  SENIORS: 'Seniors (60+ years)',
  ALL_AGES: 'All Ages',
};

// Sport Age Group Mapping
export const SPORT_AGE_GROUP_MAPPING = {
  [SPORT_TYPES.BADMINTON]: [SPORT_AGE_GROUPS.TEENS, SPORT_AGE_GROUPS.ADULTS, SPORT_AGE_GROUPS.SENIORS],
  [SPORT_TYPES.TENNIS]: [SPORT_AGE_GROUPS.TEENS, SPORT_AGE_GROUPS.ADULTS, SPORT_AGE_GROUPS.SENIORS],
  [SPORT_TYPES.FOOTBALL]: [SPORT_AGE_GROUPS.KIDS, SPORT_AGE_GROUPS.TEENS, SPORT_AGE_GROUPS.ADULTS],
  [SPORT_TYPES.CRICKET]: [SPORT_AGE_GROUPS.KIDS, SPORT_AGE_GROUPS.TEENS, SPORT_AGE_GROUPS.ADULTS],
  [SPORT_TYPES.BASKETBALL]: [SPORT_AGE_GROUPS.KIDS, SPORT_TYPES.TEENS, SPORT_AGE_GROUPS.ADULTS],
  [SPORT_TYPES.VOLLEYBALL]: [SPORT_AGE_GROUPS.TEENS, SPORT_AGE_GROUPS.ADULTS],
  [SPORT_TYPES.TABLE_TENNIS]: [SPORT_AGE_GROUPS.KIDS, SPORT_AGE_GROUPS.TEENS, SPORT_AGE_GROUPS.ADULTS, SPORT_AGE_GROUPS.SENIORS],
  [SPORT_TYPES.SQUASH]: [SPORT_AGE_GROUPS.TEENS, SPORT_AGE_GROUPS.ADULTS],
  [SPORT_TYPES.SWIMMING]: [SPORT_AGE_GROUPS.ALL_AGES],
  [SPORT_TYPES.GYM]: [SPORT_AGE_GROUPS.TEENS, SPORT_AGE_GROUPS.ADULTS, SPORT_AGE_GROUPS.SENIORS],
  [SPORT_TYPES.YOGA]: [SPORT_AGE_GROUPS.ALL_AGES],
  [SPORT_TYPES.DANCE]: [SPORT_AGE_GROUPS.ALL_AGES],
  [SPORT_TYPES.MARTIAL_ARTS]: [SPORT_AGE_GROUPS.KIDS, SPORT_AGE_GROUPS.TEENS, SPORT_AGE_GROUPS.ADULTS],
  [SPORT_TYPES.OTHER]: [SPORT_AGE_GROUPS.ALL_AGES],
};

// Get sport information
export const getSportInfo = (sportType) => {
  if (!sportType || !SPORT_TYPES[sportType]) {
    return null;
  }
  
  return {
    name: sportType,
    category: SPORT_CATEGORY_MAPPING[sportType],
    icon: SPORT_ICONS[sportType],
    color: SPORT_COLORS[sportType],
    equipment: SPORT_EQUIPMENT[sportType],
    difficulty: SPORT_DIFFICULTY_MAPPING[sportType],
    duration: SPORT_DURATION[sportType],
    capacity: SPORT_CAPACITY[sportType],
    seasons: SPORT_SEASON_MAPPING[sportType],
    ageGroups: SPORT_AGE_GROUP_MAPPING[sportType],
  };
};

// Get sports by category
export const getSportsByCategory = (category) => {
  return Object.entries(SPORT_CATEGORY_MAPPING)
    .filter(([sport, sportCategory]) => sportCategory === category)
    .map(([sport]) => sport);
};

// Get all sport categories
export const getAllSportCategories = () => {
  return Object.values(SPORT_CATEGORIES);
};

// Get all sport types
export const getAllSportTypes = () => {
  return Object.values(SPORT_TYPES);
};

export default {
  SPORT_TYPES,
  SPORT_CATEGORIES,
  SPORT_CATEGORY_MAPPING,
  SPORT_ICONS,
  SPORT_COLORS,
  SPORT_EQUIPMENT,
  SPORT_DIFFICULTY,
  SPORT_DIFFICULTY_MAPPING,
  SPORT_DURATION,
  SPORT_CAPACITY,
  SPORT_SEASONS,
  SPORT_SEASON_MAPPING,
  SPORT_AGE_GROUPS,
  SPORT_AGE_GROUP_MAPPING,
  getSportInfo,
  getSportsByCategory,
  getAllSportCategories,
  getAllSportTypes,
}; 
