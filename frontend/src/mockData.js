// Mock data and presets for FoodFreshness frontend testing and offline fallback

export const DEFAULT_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/food/analyze";

export const SAMPLE_PRODUCE = [
  {
    id: 'apple',
    name: 'Fresh Gala Apple',
    category: 'Fruits & Berries',
    temp: 22.0,
    humidity: 55.0,
    storage: 'Room',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    mockResult: {
      results: {
        highlighted_image_base64: null,
        food_name: 'Gala Apple (Grade A)',
        food_category: 'Fresh Fruits',
        freshness_status: 'Fresh',
        confidence_score: 98.6,
        surface_damage_percentage: 1.8,
        remaining_shelf_life_days: 8
      },
      recommendations: {
        recommended_action: 'Optimal freshness detected. Store in crisper drawer to maximize shelf life.',
        ideal_storage_location: 'Refrigerator Crisper (2°C - 4°C)',
        handling_tips: [
          'Keep separate from strong odor foods as apples absorb surrounding scents.',
          'Avoid washing until right before consumption to maintain natural protective bloom layer.',
          'If cut, spray lightly with lemon juice to prevent enzymatic browning.'
        ]
      }
    }
  },
  {
    id: 'tomato',
    name: 'Ripening Vine Tomato',
    category: 'Vegetables & Produce',
    temp: 24.5,
    humidity: 62.0,
    storage: 'Room',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    mockResult: {
      results: {
        highlighted_image_base64: null,
        food_name: 'Vine-Ripened Tomato',
        food_category: 'Solanaceous Vegetables',
        freshness_status: 'Fresh',
        confidence_score: 95.2,
        surface_damage_percentage: 4.5,
        remaining_shelf_life_days: 5
      },
      recommendations: {
        recommended_action: 'Store stem-side down at room temperature until fully ripe, then refrigerate if needed.',
        ideal_storage_location: 'Pantry / Countertop (18°C - 21°C)',
        handling_tips: [
          'Store stem-side down to prevent moisture loss and air ingress.',
          'Never refrigerate unripened tomatoes to preserve flavor volatile compounds.',
          'Use in salads or cooking within the next 4-5 days.'
        ]
      }
    }
  },
  {
    id: 'lettuce',
    name: 'Crisp Romaine Lettuce',
    category: 'Leafy Greens',
    temp: 4.0,
    humidity: 85.0,
    storage: 'Refrigerator',
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80',
    mockResult: {
      results: {
        highlighted_image_base64: null,
        food_name: 'Romaine Lettuce Head',
        food_category: 'Leafy Greens',
        freshness_status: 'Fresh',
        confidence_score: 97.4,
        surface_damage_percentage: 3.1,
        remaining_shelf_life_days: 6
      },
      recommendations: {
        recommended_action: 'Wrap in damp paper towel inside a breathable container.',
        ideal_storage_location: 'Refrigerator High-Humidity Crisper (1°C - 3°C)',
        handling_tips: [
          'Wash gently in cold water and dry thoroughly in a salad spinner before storing.',
          'Avoid storing near ethylene producers like bananas or avocados.',
          'Trim bottom stem by 1/4 inch and stand upright in 1 inch of fresh water.'
        ]
      }
    }
  },
  {
    id: 'spoiled_berry',
    name: 'Aged Strawberries',
    category: 'Berries',
    temp: 26.0,
    humidity: 75.0,
    storage: 'Room',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    mockResult: {
      results: {
        highlighted_image_base64: null,
        food_name: 'Strawberries (Advanced Moisture Damage)',
        food_category: 'Berries & Soft Fruits',
        freshness_status: 'Spoiled',
        confidence_score: 99.1,
        surface_damage_percentage: 64.8,
        remaining_shelf_life_days: 0
      },
      recommendations: {
        recommended_action: 'Discard or compost immediately. Surface fungal spore contamination detected.',
        ideal_storage_location: 'Compost Bin / Waste Disposal',
        handling_tips: [
          'Immediately segregate spoiled berries to prevent rot spread to adjacent fruit.',
          'Sanitize storage container with mild vinegar solution before reusing.',
          'Always keep fresh berries dry and unwashed until immediately before eating.'
        ]
      }
    }
  }
];
