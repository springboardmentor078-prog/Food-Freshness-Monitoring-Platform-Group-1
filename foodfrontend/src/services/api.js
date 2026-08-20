import axios from 'axios';
import { predictionsData, recommendations } from '../data/mockData';
import {
  DASHBOARD_STATS, WEEKLY_DATA, FRESHNESS_DISTRIBUTION,
  SHELF_LIFE_DATA, ACCURACY_TREND, AI_TIPS, PREDICTION_HISTORY
} from '../constants';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(credentials) {
    await delay(800);
    if (credentials.email && credentials.password?.length >= 6) {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            name: 'Alex Johnson',
            email: credentials.email,
            avatar: 'AJ',
            role: 'Premium User',
            joined: 'March 2024',
          }
        }
      };
    }
    throw new Error('Invalid credentials');
  },

  async register(userData) {
    await delay(1000);
    if (userData.email && userData.password?.length >= 6) {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            avatar: userData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
            role: 'Free User',
            joined: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
          }
        }
      };
    }
    throw new Error('Registration failed');
  },

  async logout() {
    await delay(300);
    return { success: true };
  }
};

export const dashboardService = {
  async getStats() {
    await delay(400);
    return { success: true, data: DASHBOARD_STATS };
  },

  async getWeeklyData() {
    await delay(300);
    return { success: true, data: WEEKLY_DATA };
  },

  async getFreshnessDistribution() {
    await delay(200);
    return { success: true, data: FRESHNESS_DISTRIBUTION };
  },

  async getShelfLifeData() {
    await delay(200);
    return { success: true, data: SHELF_LIFE_DATA };
  },

  async getAccuracyTrend() {
    await delay(200);
    return { success: true, data: ACCURACY_TREND };
  },

  async getDailyTip() {
    await delay(100);
    return {
      success: true,
      data: AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)]
    };
  },

  async getRecentPredictions() {
    await delay(400);
    return { success: true, data: predictionsData.slice(0, 5) };
  },

  async getRecentActivity() {
    await delay(300);
    return {
      success: true,
      data: [
        { id: 1, type: 'prediction', food: 'Apple', status: 'fresh', time: '2 minutes ago' },
        { id: 2, type: 'prediction', food: 'Banana', status: 'moderate', time: '1 hour ago' },
        { id: 3, type: 'upload', food: 'Batch of 12 items', status: 'completed', time: '3 hours ago' },
        { id: 4, type: 'prediction', food: 'Tomato', status: 'spoiled', time: 'Yesterday' },
        { id: 5, type: 'system', food: 'Weekly report generated', status: 'info', time: 'Yesterday' },
      ]
    };
  }
};

export const predictionService = {
  async predict(imageData, metadata) {
    await delay(2500);
    const randomPrediction = predictionsData[Math.floor(Math.random() * predictionsData.length)];
    return {
      success: true,
      data: {
        id: Date.now(),
        image: imageData?.preview || randomPrediction.image,
        food: metadata?.foodType || randomPrediction.food,
        prediction: randomPrediction.prediction,
        confidence: 80 + Math.floor(Math.random() * 20),
        freshness: 30 + Math.floor(Math.random() * 70),
        shelfLife: Math.floor(Math.random() * 15),
        spoilage: 10 + Math.floor(Math.random() * 70),
        status: randomPrediction.status,
        date: new Date().toISOString().split('T')[0],
        storageConditions: {
          temp: metadata?.storageTemp || 4,
          humidity: metadata?.humidity || 80,
          type: ['Refrigerated', 'Room Temperature', 'Pantry'][Math.floor(Math.random() * 3)]
        },
        recommendation: randomPrediction.recommendation,
        healthRisk: randomPrediction.healthRisk,
        nutrition: randomPrediction.nutrition,
        predictionTime: new Date().toLocaleString(),
        modelVersion: 'FreshNet v3.2.1',
      }
    };
  },

  async getHistory(params = {}) {
    await delay(400);
    let data = [...predictionsData, ...PREDICTION_HISTORY.map((h, i) => ({
      id: 100 + i,
      ...h,
      image: predictionsData[i % predictionsData.length]?.image,
      confidence: h.confidence,
      shelfLife: h.shelfLife,
      freshness: h.status === 'fresh' ? 80 + Math.floor(Math.random() * 20) :
                 h.status === 'moderate' ? 40 + Math.floor(Math.random() * 30) : 20,
      spoilage: 100 - (h.status === 'fresh' ? 80 + Math.floor(Math.random() * 20) :
                 h.status === 'moderate' ? 40 + Math.floor(Math.random() * 30) : 20),
    }))];

    if (params.search) {
      data = data.filter(d => d.food.toLowerCase().includes(params.search.toLowerCase()));
    }
    if (params.filter && params.filter !== 'all') {
      data = data.filter(d => d.status === params.filter);
    }
    if (params.sortBy) {
      data.sort((a, b) => {
        if (params.sortOrder === 'desc') return b[params.sortBy] - a[params.sortBy];
        return a[params.sortBy] - b[params.sortBy];
      });
    }

    return {
      success: true,
      data: {
        predictions: data,
        pagination: {
          total: data.length,
          page: params.page || 1,
          perPage: params.perPage || 10,
          totalPages: Math.ceil(data.length / (params.perPage || 10)),
        }
      }
    };
  },

  async getById(id) {
    await delay(300);
    const item = predictionsData.find(p => p.id === parseInt(id)) || predictionsData[0];
    return { success: true, data: item };
  },

  async delete(id) {
    await delay(300);
    return { success: true };
  }
};

export const recommendationService = {
  async getAll() {
    await delay(500);
    return { success: true, data: recommendations };
  },

  async getByFood(food) {
    await delay(200);
    return { success: true, data: recommendations.find(r => r.food.toLowerCase() === food.toLowerCase()) };
  }
};

export const userService = {
  async getProfile() {
    await delay(300);
    return {
      success: true,
      data: {
        id: 1,
        name: 'Alex Johnson',
        email: 'alex@example.com',
        avatar: 'AJ',
        role: 'Premium User',
        joined: 'March 2024',
        phone: '+1 555 0123 4567',
        location: 'San Francisco, CA',
        bio: 'Passionate about reducing food waste and eating healthy. Home chef and food enthusiast!',
        notifications: {
          email: true,
          push: true,
          weeklyReport: true,
          alerts: true,
          marketing: false,
        },
        preferences: {
          theme: 'light',
          language: 'English',
          units: 'metric',
          defaultView: 'dashboard',
        },
        usage: {
          predictionsThisMonth: 147,
          savings: 342,
          wasteReduced: 68,
          streak: 23,
        }
      }
    };
  },

  async updateProfile(data) {
    await delay(500);
    return { success: true, data: { ...data } };
  },

  async changePassword(passwords) {
    await delay(500);
    if (passwords.newPassword !== passwords.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    return { success: true, message: 'Password updated successfully' };
  },

  async updatePreferences(prefs) {
    await delay(200);
    return { success: true, data: prefs };
  }
};

export default api;
