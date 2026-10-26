import React, { useRef } from 'react';
import { Camera, Trash2, Sliders, Check, Eye, EyeOff } from 'lucide-react';

interface PhotoUploaderProps {
  photoUrl?: string;
  photoShape?: 'circle' | 'square' | 'hidden';
  onUpdatePhoto: (url?: string, shape?: 'circle' | 'square' | 'hidden') => void;
  isAntiBiasMode?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photoUrl,
  photoShape = 'circle',
  onUpdatePhoto,
  isAntiBiasMode = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onUpdatePhoto(result, photoShape === 'hidden' ? 'circle' : photoShape);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onUpdatePhoto(undefined, 'hidden');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleToggleShape = (shape: 'circle' | 'square') => {
    onUpdatePhoto(photoUrl, shape);
  };

  const handleToggleVisibility = () => {
    if (photoShape === 'hidden') {
      onUpdatePhoto(photoUrl, 'circle');
    } else {
      onUpdatePhoto(photoUrl, 'hidden');
    }
  };

  return (
    <div className="bg-soft border border-line rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-ink flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-ink/90" />
            Professional Headshot Photo
          </h4>
          <p className="text-xs text-muted/80 mt-0.5">
            Standard for European (Europass), Middle East, Asia, & International CVs.
          </p>
        </div>
        {photoUrl && (
          <button
            type="button"
            onClick={handleToggleVisibility}
            className={`text-xs px-2.5 py-1 rounded border font-medium flex items-center gap-1 transition-colors ${
              photoShape === 'hidden'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-paper text-ink/90 border-line hover:bg-slate-100'
            }`}
          >
            {photoShape === 'hidden' ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Hidden from Export
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Visible
              </>
            )}
          </button>
        )}
      </div>

      {isAntiBiasMode && (
        <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
          <strong>US / UK Anti-Bias Notice:</strong> US, UK, and Canadian corporate ATS systems typically filter out resumes with headshots to prevent hiring bias. Switch to International Mode if applying in Europe, Gulf, or Asia.
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {photoUrl ? (
          <div className="relative group shrink-0">
            <img
              src={photoUrl}
              alt="Professional Headshot"
              className={`w-20 h-20 object-cover border-2 border-slate-300 shadow-sm ${
                photoShape === 'circle' ? 'rounded-full' : 'rounded-md'
              } ${photoShape === 'hidden' ? 'opacity-40 grayscale' : ''}`}
            />
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 hover:border-slate-400 bg-paper flex flex-col items-center justify-center cursor-pointer transition-colors shrink-0 group text-center p-2"
          >
            <Camera className="w-5 h-5 text-muted/60 group-hover:text-muted mb-0.5" />
            <span className="text-[10px] text-muted/80 font-medium leading-tight">Upload Photo</span>
          </div>
        )}

        <div className="flex-1 w-full space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs bg-paper hover:bg-slate-100 text-ink font-medium px-3 py-1.5 rounded border border-slate-300 shadow-sm transition-colors"
            >
              {photoUrl ? 'Change Image' : 'Select Image (JPEG / PNG)'}
            </button>

            {photoUrl && (
              <>
                <div className="flex items-center gap-1 bg-paper border border-line rounded p-0.5">
                  <button
                    type="button"
                    onClick={() => handleToggleShape('circle')}
                    className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                      photoShape === 'circle' ? 'bg-slate-900 text-white' : 'text-muted hover:bg-slate-100'
                    }`}
                  >
                    Circle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleShape('square')}
                    className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                      photoShape === 'square' ? 'bg-slate-900 text-white' : 'text-muted hover:bg-slate-100'
                    }`}
                  >
                    Square
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </>
            )}
          </div>
          <p className="text-[11px] text-muted/80">
            Processed 100% locally in your browser. Never uploaded to third-party ad servers.
          </p>
        </div>
      </div>
    </div>
  );
};
