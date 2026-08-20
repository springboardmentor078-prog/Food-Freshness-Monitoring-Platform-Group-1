export const FOOD_TYPES = [
  'Apple', 'Banana', 'Orange', 'Grapes', 'Strawberry', 'Mango', 'Tomato',
  'Potato', 'Carrot', 'Lettuce', 'Spinach', 'Cucumber', 'Pepper', 'Onion',
  'Garlic', 'Ginger', 'Bread', 'Milk', 'Cheese', 'Yogurt', 'Meat', 'Chicken',
  'Fish', 'Egg', 'Avocado', 'Watermelon', 'Pineapple', 'Broccoli', 'Cabbage'
];

export const FRESHNESS_STATUS = {
  FRESH: 'fresh',
  MODERATE: 'moderate',
  SPOILED: 'spoiled'
};

export const STORAGE_CONDITIONS = {
  REFRIGERATED: 'Refrigerated',
  ROOM_TEMP: 'Room Temperature',
  FROZEN: 'Frozen',
  PANTRY: 'Pantry'
};

export const PREDICTION_HISTORY = [
  { food: 'Apple', prediction: 'Fresh', confidence: 96, shelfLife: 7, date: '2026-07-28', status: 'fresh' },
  { food: 'Banana', prediction: 'Moderate', confidence: 87, shelfLife: 3, date: '2026-07-27', status: 'moderate' },
  { food: 'Tomato', prediction: 'Spoiled', confidence: 92, shelfLife: 0, date: '2026-07-26', status: 'spoiled' },
  { food: 'Grapes', prediction: 'Fresh', confidence: 94, shelfLife: 10, date: '2026-07-25', status: 'fresh' },
  { food: 'Spinach', prediction: 'Moderate', confidence: 81, shelfLife: 2, date: '2026-07-24', status: 'moderate' },
  { food: 'Milk', prediction: 'Fresh', confidence: 98, shelfLife: 5, date: '2026-07-23', status: 'fresh' },
  { food: 'Bread', prediction: 'Spoiled', confidence: 89, shelfLife: 0, date: '2026-07-22', status: 'spoiled' },
  { food: 'Chicken', prediction: 'Fresh', confidence: 95, shelfLife: 2, date: '2026-07-21', status: 'fresh' },
  { food: 'Avocado', prediction: 'Moderate', confidence: 78, shelfLife: 4, date: '2026-07-20', status: 'moderate' },
  { food: 'Carrot', prediction: 'Fresh', confidence: 93, shelfLife: 14, date: '2026-07-19', status: 'fresh' },
];

export const AI_TIPS = [
  "Store leafy greens in airtight containers with a paper towel to absorb excess moisture.",
  "Keep tomatoes at room temperature away from direct sunlight for best flavor and longevity.",
  "Potatoes should be stored in a cool, dark, well-ventilated area - never in the refrigerator.",
  "Bananas release ethylene gas; keep them separate from other fruits to slow ripening.",
  "Fresh herbs last longer when stored like flowers in a glass of water on the counter.",
  "Eggs stay fresh longest when stored in their original carton on the middle shelf.",
  "Wrap cheese in parchment paper, not plastic, to allow it to breathe properly.",
  "Mushrooms absorb moisture quickly; store in paper bags, not plastic containers.",
];

export const DASHBOARD_STATS = {
  totalPredictions: 1247,
  freshFoods: 682,
  spoiledFoods: 156,
  averageFreshness: 78.5,
  avgShelfLife: 8.2,
  inventoryCount: 342
};

export const WEEKLY_DATA = [
  { name: 'Mon', predictions: 45, fresh: 32, spoiled: 5 },
  { name: 'Tue', predictions: 52, fresh: 38, spoiled: 6 },
  { name: 'Wed', predictions: 61, fresh: 45, spoiled: 8 },
  { name: 'Thu', predictions: 48, fresh: 35, spoiled: 4 },
  { name: 'Fri', predictions: 72, fresh: 52, spoiled: 9 },
  { name: 'Sat', predictions: 85, fresh: 62, spoiled: 11 },
  { name: 'Sun', predictions: 67, fresh: 48, spoiled: 7 },
];

export const FRESHNESS_DISTRIBUTION = [
  { name: 'Fresh', value: 682, color: '#10B981' },
  { name: 'Moderate', value: 409, color: '#F59E0B' },
  { name: 'Spoiled', value: 156, color: '#EF4444' },
];

export const SHELF_LIFE_DATA = [
  { name: '0-2 Days', count: 156 },
  { name: '3-5 Days', count: 289 },
  { name: '6-10 Days', count: 412 },
  { name: '11-20 Days', count: 298 },
  { name: '20+ Days', count: 92 },
];

export const ACCURACY_TREND = [
  { month: 'Jan', accuracy: 89.2 },
  { month: 'Feb', accuracy: 90.5 },
  { month: 'Mar', accuracy: 91.8 },
  { month: 'Apr', accuracy: 92.3 },
  { month: 'May', accuracy: 93.1 },
  { month: 'Jun', accuracy: 94.6 },
  { month: 'Jul', accuracy: 95.8 },
];
