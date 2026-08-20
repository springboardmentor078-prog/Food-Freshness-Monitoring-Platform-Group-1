import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import I from '../components/icons';
const HiOutlineCloudArrowUp = I.CloudUpload;
const HiOutlineCamera = I.Camera;
const HiOutlineX = I.X;
const HiOutlineSparkles = I.Sparkles;
const HiOutlineQuestionMarkCircle = I.Question;
const HiOutlineCheck = I.Check;
const HiOutlineClock = I.Clock;
const HiOutlineThermometer = I.Thermo;
const HiOutlineCloud = I.Cloud;
const HiOutlineCalendar = I.Calendar;
const HiOutlineArrowRight = I.ArrowRight;
const HiOutlinePhotograph = I.Photo;
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/Progress';
import Badge from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { predictionService } from '../services/api';
import { cn } from '../utils/helpers';
import { FOOD_TYPES, STORAGE_CONDITIONS } from '../constants';
import { predictionsData } from '../data/mockData';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [metadata, setMetadata] = useState({
    foodType: '',
    storageTemp: 4,
    humidity: 80,
    storageDays: 0,
    storageType: 'Refrigerated',
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const validateFile = (f) => {
    const e = {};
    if (!ALLOWED_TYPES.includes(f.type)) e.file = 'Please upload a valid image (JPG, PNG, WEBP, GIF)';
    if (f.size > MAX_FILE_SIZE) e.file = 'File size must be less than 10MB';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const processFile = (f) => {
    if (!validateFile(f)) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);

    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast.success('Image uploaded successfully!');
          return 100;
        }
        return p + Math.random() * 20 + 5;
      });
    }, 120);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) processFile(dropped);
  };

  const handleFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
    e.target.value = '';
  };

  const handleCamera = (e) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
    e.target.value = '';
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const validateForm = () => {
    const e = {};
    if (!file) e.file = 'Please upload or capture an image first';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAnalyze = async () => {
    if (!validateForm()) return;
    setAnalyzing(true);
    try {
      const result = await predictionService.predict(
        { preview },
        { ...metadata }
      );
      toast.success('Analysis complete! 🎉');
      setTimeout(() => navigate('/prediction', { state: { prediction: result, fresh: true } }), 600);
    } catch (err) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const sampleImages = predictionsData.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-secondary-600 via-primary-600 to-accent-500 p-8 md:p-10 shadow-xl shadow-primary-500/25"
      >
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 mb-4">
              <HiOutlineSparkles className="w-4 h-4 text-yellow-200" />
              <span className="text-xs font-bold text-white/90">AI Freshness Analysis v3.2</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              Upload & Analyze
            </h1>
            <p className="text-white/80 leading-relaxed">
              Snap a photo or upload an image of your food. Our AI will detect the type and analyze freshness in seconds.
            </p>
          </div>
          <div className="flex items-center gap-6 text-white/90">
            <div className="text-center">
              <p className="text-3xl font-black">2.1s</p>
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Avg Analysis</p>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl font-black">96.8%</p>
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Accuracy</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">1. Upload Image</h2>
              {file && (
                <Badge variant="success">
                  <HiOutlineCheck className="w-3 h-3" /> Ready
                </Badge>
              )}
            </div>

            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      'upload-zone rounded-3xl py-16 px-6 md:py-24 cursor-pointer transition-all relative overflow-hidden',
                      dragActive && 'dragging',
                      errors.file && '!border-danger-500/60 bg-danger-500/5'
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5" />
                    <div className="relative flex flex-col items-center text-center max-w-md mx-auto">
                      <motion.div
                        animate={{ y: dragActive ? -8 : [0, -6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative mb-6"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/40 to-secondary-500/40 blur-2xl rounded-full scale-125" />
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                          <HiOutlineCloudArrowUp className="w-10 h-10 md:w-12 md:h-12 text-primary-500" />
                        </div>
                      </motion.div>

                      <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 mb-2">
                        {dragActive ? 'Drop image here!' : 'Drop your image here'}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-6">
                        or click to browse from your device. <br className="hidden sm:block" />
                        Supports JPG, PNG, WEBP up to 10MB.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                        <Button
                          variant="primary"
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          fullWidth
                          icon={<HiOutlinePhotograph className="w-5 h-5" />}
                        >
                          Browse Files
                        </Button>
                        <Button
                          variant="outline"
                          onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                          fullWidth
                          icon={<HiOutlineCamera className="w-5 h-5" />}
                        >
                          Use Camera
                        </Button>
                      </div>

                      {errors.file && <p className="mt-4 text-sm text-danger-500 font-medium">{errors.file}</p>}
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleCamera}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  <div className="relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-700 aspect-[4/3] shadow-inner">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    <button
                      onClick={clearFile}
                      className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                    >
                      <HiOutlineX className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <Badge variant="success">
                        <HiOutlineCheck className="w-3 h-3" />
                        Image Ready
                      </Badge>
                      <div className="px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2">
                        {(file?.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>

                  {uploading && (
                    <div className="mt-5 p-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <Spinner size="sm" color="primary" />
                          Uploading image...
                        </div>
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{Math.round(uploadProgress)}%</span>
                      </div>
                      <ProgressBar value={uploadProgress} color="primary" size="lg" />
                    </div>
                  )}

                  <div className="mt-5 flex gap-3">
                    <Button variant="ghost" onClick={clearFile} icon={<HiOutlineX className="w-4 h-4" />}>
                      Remove
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      icon={<HiOutlinePhotograph className="w-4 h-4" />}
                    >
                      Change Image
                    </Button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sample Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineSparkles className="w-5 h-5 text-accent-500" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Try a sample image</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {sampleImages.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setPreview(s.image);
                    setFile({ size: 2 * 1024 * 1024, name: `${s.food}.jpg`, type: 'image/jpeg' });
                    setUploadProgress(100);
                    setMetadata(prev => ({ ...prev, foodType: s.food }));
                    toast.success(`${s.food} sample loaded`);
                  }}
                  className="group aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary-400 transition-all relative"
                >
                  <img src={s.image} alt={s.food} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-bold">{s.food}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Metadata & Analyze */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-secondary-100 dark:bg-secondary-500/20 text-secondary-600 dark:text-secondary-400 flex items-center justify-center text-sm font-black">2</span>
              Add Details (Optional)
            </h2>

            <div className="space-y-5">
              <Select
                label="Food Type"
                value={metadata.foodType}
                onChange={(e) => setMetadata(prev => ({ ...prev, foodType: e.target.value }))}
                options={FOOD_TYPES.map(f => ({ label: f, value: f }))}
                placeholder="Select or leave blank for auto-detect"
              />

              <Select
                label="Storage Condition"
                value={metadata.storageType}
                onChange={(e) => setMetadata(prev => ({ ...prev, storageType: e.target.value }))}
                options={Object.values(STORAGE_CONDITIONS).map(s => ({ label: s, value: s }))}
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="input-label mb-0 flex items-center gap-2">
                    <HiOutlineThermometer className="w-4 h-4 text-secondary-500" />
                    Storage Temperature
                  </label>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{metadata.storageTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="40"
                  value={metadata.storageTemp}
                  onChange={(e) => setMetadata(prev => ({ ...prev, storageTemp: Number(e.target.value) }))}
                  className="w-full h-2.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 cursor-pointer accent-primary-500"
                />
                <div className="flex justify-between mt-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                  <span>-20°C</span><span>10°C</span><span>40°C</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="input-label mb-0 flex items-center gap-2">
                    <HiOutlineCloud className="w-4 h-4 text-primary-500" />
                    Humidity
                  </label>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{metadata.humidity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metadata.humidity}
                  onChange={(e) => setMetadata(prev => ({ ...prev, humidity: Number(e.target.value) }))}
                  className="w-full h-2.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 cursor-pointer accent-primary-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="input-label mb-0 flex items-center gap-2">
                    <HiOutlineCalendar className="w-4 h-4 text-accent-500" />
                    Days in Storage
                  </label>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{metadata.storageDays} days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={metadata.storageDays}
                  onChange={(e) => setMetadata(prev => ({ ...prev, storageDays: Number(e.target.value) }))}
                  className="w-full h-2.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 cursor-pointer accent-primary-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Analyze Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="relative overflow-hidden card p-6 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 border-primary-100 dark:border-primary-500/20"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary-400/20 to-secondary-500/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <HiOutlineSparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Start AI Analysis</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Neural network inference</p>
                </div>
              </div>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                loading={analyzing || uploading}
                disabled={analyzing || uploading}
                onClick={handleAnalyze}
                icon={analyzing ? null : <HiOutlineArrowRight className="w-5 h-5" />}
                className="!py-4 !text-base group relative overflow-hidden"
              >
                {analyzing ? (
                  <span className="flex items-center gap-3">
                    <span className="relative">
                      <Spinner size="sm" color="white" />
                    </span>
                    Analyzing with FreshNet v3.2...
                  </span>
                ) : uploading ? 'Uploading Image...' : 'Analyze Freshness Now'}
              </Button>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  { i: HiOutlineClock, l: '~2 sec', t: 'Time' },
                  { i: HiOutlineSparkles, l: 'v3.2', t: 'Model' },
                  { i: HiOutlineCheck, l: '127+', t: 'Foods' },
                ].map((it, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                    <it.i className="w-4 h-4 text-primary-500 mx-auto mb-1" />
                    <p className="font-black text-sm text-slate-800 dark:text-slate-200 leading-none">{it.l}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{it.t}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                <HiOutlineQuestionMarkCircle className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <p>
                  This is a demo using our pre-trained model. Results are simulated. Connect your FastAPI backend for real inference.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
