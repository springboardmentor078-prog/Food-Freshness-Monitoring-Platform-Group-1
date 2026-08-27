import React, { useState, useRef } from 'react';
import { Upload, Thermometer, Droplets, Home, Loader2, Sparkles, AlertCircle, RefreshCw, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import { SAMPLE_PRODUCE } from '../mockData';
import axios from 'axios';

export default function AnalysisCard({ apiUrl, user, onRequireAuth, onAnalysisSuccess, onError, loading, setLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [temperature, setTemperature] = useState(25.0);
  const [humidity, setHumidity] = useState(60.0);
  const [storageType, setStorageType] = useState('Room');
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [demoActive, setDemoActive] = useState(false);

  const fileInputRef = useRef(null);

  // Handle file drop & selection
  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setLocalError('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setLocalError(null);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Quick preset loader
  const handleSelectPreset = async (preset) => {
    try {
      setLocalError(null);
      setTemperature(preset.temp);
      setHumidity(preset.humidity);
      setStorageType(preset.storage);
      setPreviewUrl(preset.image);

      const response = await fetch(preset.image);
      const blob = await response.blob();
      const file = new File([blob], `${preset.id}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
    } catch (err) {
      console.warn("Couldn't convert sample image to File:", err);
      const mockBlob = new Blob(["mock produce data"], { type: 'image/jpeg' });
      const file = new File([mockBlob], `${preset.id}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // AUTH GUARD: Require user authentication before analyzing produce!
    if (!user) {
      onRequireAuth('Please sign in or create an account to run AI food freshness analysis.');
      return;
    }

    if (!selectedFile && !previewUrl) {
      setLocalError('Please select or upload an image of the food item first.');
      return;
    }

    setLocalError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('user_id', 1);
    if (selectedFile) {
      formData.append('file', selectedFile);
    } else {
      const dummyBlob = new Blob(["sample image data"], { type: 'image/jpeg' });
      formData.append('file', new File([dummyBlob], 'sample_food.jpg', { type: 'image/jpeg' }));
    }
    formData.append('temperature', parseFloat(temperature));
    formData.append('humidity', parseFloat(humidity));
    formData.append('storage_type', storageType);

    const isPlaceholderUrl = apiUrl.includes('INSERT_NGROK_URL_HERE');

    try {
      if (demoActive || isPlaceholderUrl) {
        await new Promise((res) => setTimeout(res, 1200));

        const matchedPreset = SAMPLE_PRODUCE.find(
          (p) => previewUrl && previewUrl.includes(p.id)
        ) || SAMPLE_PRODUCE[0];

        const mockResponse = {
          results: {
            highlighted_image_base64: null,
            food_name: matchedPreset.mockResult.results.food_name,
            food_category: matchedPreset.mockResult.results.food_category,
            freshness_status: matchedPreset.mockResult.results.freshness_status,
            confidence_score: matchedPreset.mockResult.results.confidence_score,
            surface_damage_percentage: matchedPreset.mockResult.results.surface_damage_percentage,
            remaining_shelf_life_days: matchedPreset.mockResult.results.remaining_shelf_life_days
          },
          recommendations: matchedPreset.mockResult.recommendations
        };

        onAnalysisSuccess(mockResponse, previewUrl);
      } else {
        const res = await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token || ''}`,
            'ngrok-skip-browser-warning': 'true'
          },
          timeout: 25000
        });

        if (res.data) {
          onAnalysisSuccess(res.data, previewUrl);
        } else {
          throw new Error('Received empty response from API');
        }
      }
    } catch (err) {
      console.error('API Error:', err);
      let errorMsg = err.response?.data?.detail || err.message || 'Failed to connect to AI server.';
      if (typeof errorMsg === 'string' && errorMsg.includes('list index out of range')) {
        errorMsg = 'Backend connected! However, no produce/food bounding box was detected in the uploaded image. Please try uploading a clear photo of produce (e.g., apple, tomato, lettuce).';
      }
      setLocalError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="hero-card" className="w-full max-w-xl mx-auto">
      <div className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 border border-emerald-100/70 backdrop-blur-xl relative overflow-hidden transition-all duration-300">

        {/* Decorative background glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Freshness Scanner
            </span>
            <h3 className="text-xl font-bold text-gray-900">Food Analysis Panel</h3>
          </div>

          {/* User Auth Status Badge */}
          {user ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Authorized
            </span>
          ) : (
            <button
              onClick={() => onRequireAuth('Sign in to unlock AI freshness scanning.')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Sign In Required
            </button>
          )}
        </div>

        {/* Local Error Alert */}
        {localError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Analysis Notice</p>
              <p className="text-xs text-red-600 mt-0.5">{localError}</p>
            </div>
            <button onClick={() => setLocalError(null)} className="text-red-400 hover:text-red-600 text-xs font-bold">
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Image Upload Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              1. Produce Image <span className="text-red-500">*</span>
            </label>

            {!previewUrl ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full min-h-[170px] border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]'
                    : 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/20 hover:bg-emerald-50/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-800">
                  Click to upload or drag & drop image
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports JPG, PNG, WEBP (Max 10MB)
                </p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-md group">
                <img
                  src={previewUrl}
                  alt="Uploaded food sample preview"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-between p-4 opacity-95 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold truncate max-w-[200px]">
                      {selectedFile ? selectedFile.name : 'Sample produce selected'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="px-3 py-1 rounded-full bg-white/20 hover:bg-red-600 text-white text-xs font-medium backdrop-blur-md transition-all"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            )}

            {/* Quick Presets */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Or select a sample produce image:</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_PRODUCE.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="group relative rounded-xl overflow-hidden border border-gray-200 hover:border-emerald-500 transition-all text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <img
                      src={preset.image}
                      alt={preset.name}
                      className="w-full h-12 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1">
                      <span className="text-[10px] font-bold text-white leading-tight text-center drop-shadow">
                        {preset.name.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Environmental Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-emerald-600" /> Temperature (°C)
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {temperature}°C
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                min="-10"
                max="50"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-gray-50/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-emerald-600" /> Humidity (%)
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {humidity}%
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-gray-50/50"
                required
              />
            </div>
          </div>

          {/* 3. Storage Environment */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Home className="w-4 h-4 text-emerald-600" /> Storage Environment
            </label>
            <select
              value={storageType}
              onChange={(e) => setStorageType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 font-semibold bg-gray-50/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
            >
              <option value="Room">Room Temperature (Countertop)</option>
              <option value="Refrigerator">Refrigerator (Cold Storage)</option>
              <option value="Pantry">Pantry (Dark & Dry)</option>
            </select>
          </div>

          {/* 4. Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-base tracking-wide shadow-lg shadow-emerald-600/30 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing Freshness...</span>
              </>
            ) : (
              <>
                <span>{user ? 'Analyze Food' : 'Sign In to Analyze'}</span>
                {user ? (
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
