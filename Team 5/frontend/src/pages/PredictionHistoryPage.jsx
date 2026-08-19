import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { predictionsAPI, foodItemsAPI } from '../api/axios';
import PredictionResult from '../components/PredictionResult';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function PredictionHistoryPage() {
  const { itemId } = useParams(); // Gets ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [foodItem, setFoodItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // 1. Get the latest prediction for this item
        const predRes = await predictionsAPI.getLatest(itemId);
        setPrediction(predRes.data);

        // 2. Get the food item details
        const itemRes = await foodItemsAPI.get(itemId);
        setFoodItem(itemRes.data);
      } catch (err) {
        setError('Could not load prediction history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [itemId]);

  if (loading) {
    return (
      <div className="content-area flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-dark-400">Loading detailed results...</p>
        </div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="content-area text-center py-20">
        <p className="text-red-400">{error || 'No prediction found for this item.'}</p>
        <button onClick={() => navigate(-1)} className="btn-primary mt-4">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="content-area max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-dark-800/50 text-dark-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Prediction History: {foodItem?.name || 'Item'}
          </h1>
          <p className="text-dark-400 text-sm">
            Viewing detailed AI analysis from {new Date(prediction.predicted_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Render the exact same result card */}
      <PredictionResult prediction={prediction} />

      {/* Delete button (optional) */}
      <div className="flex justify-end">
        <button 
          onClick={() => navigate('/inventory')} 
          className="btn-secondary"
        >
          Back to Inventory
        </button>
      </div>
    </div>
  );
}