import { useRef, useState } from 'react';

/**
 * Drop target + file picker.
 *
 * Implemented as a real <button> rather than a clickable <div> so it is reachable by
 * keyboard and announced correctly by screen readers.
 */
export default function UploadZone({ onSelectFile, onUseSample, disabled }) {
  const fileInputRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onSelectFile(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        disabled={disabled}
        className={`w-full bg-white border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-colors ${
          isDraggingOver ? 'border-forest bg-green-50' : 'border-leaf hover:bg-green-50'
        }`}
      >
        <span className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </span>
        <span className="text-forest font-semibold text-lg mb-1">Drop a plant photo here</span>
        <span className="text-gray-500 text-sm">or click to browse — on a phone this opens your camera</span>
      </button>

      {/* capture="environment" makes mobile browsers offer the rear camera directly,
          which is how this actually gets used: standing in front of the plant. */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelectFile(file);
          event.target.value = '';
        }}
        className="sr-only"
        aria-label="Upload a plant photo"
      />

      <p className="text-center text-sm text-gray-500 mt-4">
        No plant handy?{' '}
        <button
          type="button"
          onClick={onUseSample}
          disabled={disabled}
          className="text-forest font-semibold underline underline-offset-2 hover:text-leafText"
        >
          Try a sample photo
        </button>
      </p>
    </div>
  );
}
