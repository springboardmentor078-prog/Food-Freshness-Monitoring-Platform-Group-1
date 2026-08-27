import React, { useState } from 'react';
import { Settings, X, Check, Globe, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { DEFAULT_API_URL } from '../mockData';

export default function ApiSettingsModal({ isOpen, onClose, apiUrl, setApiUrl }) {
  const [tempUrl, setTempUrl] = useState(apiUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setApiUrl(tempUrl.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetDefault = () => {
    setTempUrl(DEFAULT_API_URL);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Backend API Configuration</h3>
            <p className="text-xs text-gray-500">Configure Ngrok or Local FastAPI endpoint</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600" /> Ngrok API Endpoint URL
            </label>
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="e.g. https://xyz.ngrok-free.app/api/v1/food/analyze"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-xs text-gray-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-gray-50/50"
              required
            />
            <p className="text-[11px] text-gray-500 mt-2 leading-normal">
              Target endpoint for multipart/form-data POST requests with <code className="bg-gray-100 px-1 py-0.5 rounded text-emerald-700 font-bold">user_id</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-emerald-700 font-bold">file</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-emerald-700 font-bold">temperature</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-emerald-700 font-bold">humidity</code>, and <code className="bg-gray-100 px-1 py-0.5 rounded text-emerald-700 font-bold">storage_type</code>.
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleResetDefault}
              className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Placeholder URL
            </button>
            
            <button
              type="button"
              onClick={() => setTempUrl("http://localhost:8000/api/v1/food/analyze")}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Use Localhost:8000
            </button>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>API URL Saved!</span>
                </>
              ) : (
                <span>Save Endpoint Settings</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
