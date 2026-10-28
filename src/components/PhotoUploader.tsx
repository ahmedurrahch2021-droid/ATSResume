import React, { useRef, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { prepareResumePhoto } from '../utils/prepareResumePhoto';
import { ROUTE_PATHS } from '../routes';

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
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(''); setProcessing(true);
    try { onUpdatePhoto(await prepareResumePhoto(file), photoShape === 'hidden' ? 'circle' : photoShape); }
    catch (cause) { setError((cause as Error).message); }
    finally { setProcessing(false); }
  };

  const handleRemove = () => {
    setError('');
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
    <div className="rounded-card border border-line bg-soft p-4 space-y-4">
      <div><h4 className="flex items-center gap-2 text-sm font-semibold"><Camera className="h-4 w-4" aria-hidden="true" />Optional resume photo</h4><p className="mt-2 text-xs leading-relaxed text-muted">Placed at the top right, beside your body-text contact details. Photos can cause parsing problems even when right-aligned. Follow the particular employer’s instructions.</p></div>
      {isAntiBiasMode && <p className="rounded-input border border-warning/30 bg-warning-soft p-3 text-xs text-warning"><strong>US / UK preset:</strong> The photo is omitted from this document’s exports, but remains stored in your draft. This is not a claim that every ATS rejects photos.</p>}
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        {photoUrl && <img src={photoUrl} width={80} height={80} alt="Your selected resume photo" className={`h-20 w-20 shrink-0 border border-line object-cover ${photoShape === 'circle' ? 'rounded-full' : ''} ${isAntiBiasMode || photoShape === 'hidden' ? 'opacity-50 grayscale' : ''}`} />}
        <div className="min-w-0 flex-1 space-y-3">
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" aria-label="Choose an optional resume photo" disabled={processing} onChange={(event) => void handleFileChange(event)} className="hidden" />
          <button type="button" className="btn btn-secondary" disabled={processing} aria-busy={processing} onClick={() => fileInputRef.current?.click()}>{processing ? 'Preparing image…' : photoUrl ? 'Change photo' : 'Select JPEG / PNG'}</button>
          {photoUrl && <><p className="text-xs font-medium text-muted">{isAntiBiasMode ? 'Omitted in US / UK mode' : photoShape === 'hidden' ? 'Hidden from document exports' : 'Enabled in preview and document exports'}</p><div className="flex flex-wrap gap-2"><button type="button" className="btn btn-secondary" disabled={isAntiBiasMode || processing} aria-pressed={photoShape !== 'hidden' && !isAntiBiasMode} onClick={handleToggleVisibility}>{photoShape === 'hidden' ? 'Show photo' : 'Hide photo'}</button>{(['circle', 'square'] as const).map((shape) => <button key={shape} type="button" disabled={processing} aria-pressed={photoShape === shape} className={`btn ${photoShape === shape ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => handleToggleShape(shape)}>{shape === 'circle' ? 'Circle' : 'Square'}</button>)}<button type="button" className="btn btn-ghost text-danger" disabled={processing} onClick={handleRemove}><Trash2 className="h-4 w-4" aria-hidden="true" />Remove photo</button></div></>}
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <p className="text-xs leading-relaxed text-muted">Up to 1 MB. Centre-cropped and resized in your browser; no photo upload to a server. Inspect the DOCX in Word or Google Docs because an anchored image can move when edited.</p>
      <a href={`${ROUTE_PATHS['country-guides']}#photo-guidance`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline underline-offset-4">Photo guidance & sources <span className="sr-only">(opens in a new tab)</span></a>
    </div>
  );
};
