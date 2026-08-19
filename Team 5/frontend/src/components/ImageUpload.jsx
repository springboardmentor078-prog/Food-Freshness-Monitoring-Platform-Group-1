import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, X, Loader2 } from 'lucide-react';

export default function ImageUpload({ onUpload, loading = false }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: loading,
  });

  const handleUpload = () => {
    if (file && onUpload) {
      onUpload(file);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragActive
            ? 'border-primary-500 bg-primary-500/10'
            : preview
            ? 'border-primary-500/30 bg-dark-800/40'
            : 'border-dark-600/50 bg-dark-800/20 hover:border-dark-500/50 hover:bg-dark-800/40'
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-xl object-contain shadow-lg"
            />
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 p-1.5 bg-dark-900/80 rounded-full text-dark-300 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-dark-400 text-xs mt-3">{file?.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-dark-800/60 rounded-2xl flex items-center justify-center">
              {isDragActive ? (
                <Image className="w-8 h-8 text-primary-400 animate-pulse" />
              ) : (
                <Upload className="w-8 h-8 text-dark-400" />
              )}
            </div>
            <div>
              <p className="text-dark-200 font-medium">
                {isDragActive ? 'Drop your image here' : 'Drag & drop a food image'}
              </p>
              <p className="text-dark-500 text-sm mt-1">
                or click to browse • JPG, PNG, WebP up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload & Analyze
            </>
          )}
        </button>
      )}
    </div>
  );
}
