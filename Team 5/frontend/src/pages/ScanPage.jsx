import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { foodItemsAPI, imagesAPI, predictionsAPI } from '../api/axios';
import ImageUpload from '../components/ImageUpload';
import PredictionResult from '../components/PredictionResult';
import { ArrowLeft, Loader2 } from 'lucide-react';

const PIPELINE_STEPS = [
  { id: 'upload', label: 'Uploading', icon: '📤', desc: 'Transferring image to server' },
  { id: 'segment', label: 'Segmenting', icon: '🔬', desc: 'Isolating fruit regions with YOLOv8' },
  { id: 'classify', label: 'Classifying', icon: '🏷️', desc: 'Checking freshness of each fruit' },
  { id: 'defects', label: 'Defect Spotting', icon: '🔍', desc: 'Detecting rot, mold, and bruising spots' },
  { id: 'score', label: 'Scoring', icon: '📊', desc: 'Computing weighted freshness score' },
  { id: 'predict', label: 'Predicting', icon: '⏳', desc: 'Estimating remaining shelf life' },
];

export default function ScanPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedId = searchParams.get('itemId');

  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(preselectedId || '');
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: select+upload, 2: analyzing, 3: result
  const [pipelineStep, setPipelineStep] = useState(0);

  useEffect(() => { loadItems(); }, []);

  useEffect(() => {
    if (selectedItemId) {
      const item = items.find(i => i.id === parseInt(selectedItemId));
      setSelectedItem(item || null);
    }
  }, [selectedItemId, items]);

  // Animate pipeline steps during analysis
  useEffect(() => {
    if (step !== 2) return;
    const intervals = [0, 1000, 2400, 3800, 5200, 6500]; // timing for each step
    const timers = intervals.map((delay, i) =>
      setTimeout(() => setPipelineStep(i), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [step]);

  const loadItems = async () => {
    try {
      const res = await foodItemsAPI.list();
      setItems(res.data);
      if (preselectedId) setSelectedItemId(preselectedId);
    } catch (err) {
      console.error('Failed to load items:', err);
    }
  };

  const handleUpload = async (file) => {
    if (!selectedItemId) {
      setError('Please select a food item first.');
      return;
    }

    setError('');
    setUploading(true);
    setStep(2);
    setPipelineStep(0);

    try {
      // Step 1: Upload image
      const uploadRes = await imagesAPI.upload(selectedItemId, file);
      const imageId = uploadRes.data.id;
      const imageUrl = `/uploads/${uploadRes.data.image_url}`;
      setUploadedImageUrl(imageUrl);

      // Step 2-6: Run AI prediction (backend runs the full pipeline)
      setAnalyzing(true);
      setPipelineStep(1);
      const predRes = await predictionsAPI.run(imageId);
      setPrediction(predRes.data);
      setStep(3);

      // Refresh items to get updated status
      loadItems();
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
      setStep(1);
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const resetScan = () => {
    setPrediction(null);
    setUploadedImageUrl(null);
    setError('');
    setStep(1);
    setPipelineStep(0);
  };

  return (
    <div className="content-area max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-dark-800/50 text-dark-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Scan Food</h1>
          <p className="text-dark-400 text-sm">
            Upload a food image for AI freshness analysis
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Select Item + Upload */}
      {step === 1 && (
        <>
          {/* Food Item Selector */}
          <div className="glass-card p-5">
            <label className="block text-dark-300 text-sm font-medium mb-2">
              Select Food Item
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="glass-input"
            >
              <option value="" className="bg-dark-900">— Choose a food item —</option>
              {items.map(item => (
                <option key={item.id} value={item.id} className="bg-dark-900">
                  {item.name} ({item.category}) — {item.status}
                </option>
              ))}
            </select>

            {selectedItem && (
              <div className="mt-3 p-3 rounded-xl bg-dark-800/40 border border-dark-700/30 text-sm">
                <div className="grid grid-cols-2 gap-2 text-dark-300">
                  <span>Storage: <span className="text-dark-200 capitalize">{selectedItem.storage_type}</span></span>
                  <span>Temp: <span className="text-dark-200">{selectedItem.temperature}°C</span></span>
                  <span>Humidity: <span className="text-dark-200">{selectedItem.humidity}%</span></span>
                  <span>Status: <span className="text-dark-200">{selectedItem.status}</span></span>
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="glass-card p-5">
            <h2 className="text-white font-semibold mb-4">Upload Food Image</h2>
            <ImageUpload onUpload={handleUpload} loading={uploading} />
          </div>

          {/* No items prompt */}
          {items.length === 0 && (
            <div className="glass-card p-8 text-center">
              <p className="text-dark-400 mb-4">
                You need to add a food item first before scanning.
              </p>
              <button onClick={() => navigate('/inventory')} className="btn-primary">
                Go to Inventory
              </button>
            </div>
          )}
        </>
      )}

      {/* Step 2: Pipeline Progress */}
      {step === 2 && (
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-20 h-20 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">{PIPELINE_STEPS[pipelineStep]?.icon || '🔬'}</span>
              </div>
            </div>
            <p className="text-white font-semibold text-lg mt-4">
              {PIPELINE_STEPS[pipelineStep]?.label || 'Processing'}...
            </p>
            <p className="text-dark-400 text-sm mt-1">
              {PIPELINE_STEPS[pipelineStep]?.desc || 'Running AI analysis'}
            </p>
          </div>

          {/* Pipeline Steps Visualization */}
          <div className="space-y-2">
            {PIPELINE_STEPS.map((ps, i) => {
              const isComplete = i < pipelineStep;
              const isActive = i === pipelineStep;
              return (
                <div key={ps.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                  isActive ? 'bg-primary-500/10 border border-primary-500/30' :
                  isComplete ? 'bg-dark-800/30 opacity-70' : 'opacity-30'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    isComplete ? 'bg-emerald-500/20 text-emerald-400' :
                    isActive ? 'bg-primary-500/20 text-primary-400' : 'bg-dark-700/50 text-dark-500'
                  }`}>
                    {isComplete ? '✓' : isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : (i + 1)}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-dark-300'}`}>
                      {ps.label}
                    </p>
                    <p className="text-dark-500 text-xs">{ps.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && prediction && (
        <>
          {/* Uploaded Image Preview */}
          {uploadedImageUrl && (
            <div className="glass-card p-4">
              <h3 className="text-white font-semibold text-sm mb-2">📸 Original Image</h3>
              <img
                src={uploadedImageUrl}
                alt="Analyzed food"
                className="w-full max-h-72 object-contain rounded-xl"
              />
            </div>
          )}

          <PredictionResult prediction={prediction} />

          {/* Action buttons */}
          <div className="flex gap-3">
            <button onClick={resetScan} className="btn-secondary flex-1">
              Scan Another Image
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1">
              Back to Dashboard
            </button>
          </div>
        </>
      )}
    </div>
  );
}