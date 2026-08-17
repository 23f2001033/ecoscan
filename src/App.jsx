import { useCallback, useEffect, useState } from 'react';
import { lookupSpecies, speciesCount } from './plantData';
import { HISTORY_KEY, LOW_CONFIDENCE, MAX_FILE_BYTES } from './constants';
import UploadZone from './components/UploadZone';
import ResultCard from './components/ResultCard';

const SAMPLE_IMAGE = '/samples/sample-1.jpg';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}

function loadHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    // Corrupt or unavailable storage shouldn't break the app.
    return [];
  }
}

function App() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
    } catch {
      // Private browsing can reject writes; history is a nicety, not core function.
    }
  }, [history]);

  const reset = () => {
    setResult(null);
    setError(null);
  };

  const selectFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image. Please choose a photo.');
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError('That photo is larger than 2.5MB. Please choose a smaller one.');
      return;
    }

    try {
      setImagePreview(await readFileAsDataUrl(file));
      reset();
    } catch {
      setError('Could not read that file. Please try another photo.');
    }
  };

  const useSample = async () => {
    try {
      const response = await fetch(SAMPLE_IMAGE);
      if (!response.ok) throw new Error('missing sample');
      await selectFile(new File([await response.blob()], 'sample.jpg', { type: 'image/jpeg' }));
    } catch {
      setError('Could not load the sample photo.');
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    reset();
  };

  const analyze = useCallback(async () => {
    if (!imagePreview) return;

    setIsAnalyzing(true);
    reset();

    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imagePreview }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? 'Identification failed. Please try again.');
        return;
      }

      setResult(payload);

      // Only log confident, real identifications — an inconclusive scan isn't a finding.
      if (payload.isPlant && payload.confidence >= LOW_CONFIDENCE) {
        const species = lookupSpecies(payload.scientificName);
        setHistory((previous) => [
          {
            name: species?.name ?? payload.commonName,
            status: species?.status ?? 'Unlisted',
            at: Date.now(),
          },
          ...previous,
        ]);
      }
    } catch {
      setError('Could not reach the identification service. Check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [imagePreview]);

  const invasivesFound = history.filter((entry) => entry.status === 'Invasive').length;
  const species = result ? lookupSpecies(result.scientificName) : null;

  return (
    <div className="min-h-screen bg-earth py-10 px-4">
      <header className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-5xl font-extrabold text-forest mb-3 tracking-tight">EcoScan</h1>
        <p className="text-lg text-gray-700">
          Photograph a plant to identify the species and get verified guidance on its impact in Oregon.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Vision model for identification · {speciesCount} species of verified Oregon Dept. of Agriculture
          and OSU Extension guidance
        </p>
      </header>

      {history.length > 0 && (
        <p className="max-w-xl mx-auto text-center text-sm text-gray-600 mb-6">
          <strong>{history.length}</strong> {history.length === 1 ? 'scan' : 'scans'} on this device ·{' '}
          <strong>{invasivesFound}</strong> invasive {invasivesFound === 1 ? 'plant' : 'plants'} found
        </p>
      )}

      <main className="space-y-6">
        {!imagePreview && (
          <UploadZone onSelectFile={selectFile} onUseSample={useSample} disabled={isAnalyzing} />
        )}

        {imagePreview && (
          <div className="w-full max-w-xl mx-auto relative">
            <img
              src={imagePreview}
              alt="The plant photo you uploaded, awaiting identification"
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
            <button
              type="button"
              onClick={clearImage}
              disabled={isAnalyzing}
              aria-label="Remove this photo and start over"
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 hover:text-dangerText rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {imagePreview && !result && !isAnalyzing && (
          <button
            type="button"
            onClick={analyze}
            className="block w-full max-w-xl mx-auto bg-forest text-white font-bold py-4 rounded-2xl shadow-md hover:bg-leafText transition text-lg"
          >
            Identify this plant
          </button>
        )}

        {/* Results and status are announced to screen readers as they arrive. */}
        <div aria-live="polite" aria-busy={isAnalyzing} className="space-y-6">
          {isAnalyzing && (
            <div className="w-full max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
              <div className="motion-safe-spinner w-12 h-12 border-4 border-leaf border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-forest font-semibold">Analyzing leaf shape, margins, and growth habit…</p>
            </div>
          )}

          {error && (
            <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 border-l-4 border-danger">
              <h2 className="font-bold text-dangerText mb-1">Something went wrong</h2>
              <p className="text-gray-700 text-sm mb-4">{error}</p>
              {imagePreview && (
                <button
                  type="button"
                  onClick={analyze}
                  className="bg-forest text-white font-semibold px-5 py-2 rounded-lg hover:bg-leafText transition"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {result && !isAnalyzing && <ResultCard result={result} species={species} />}
        </div>

        {result && !isAnalyzing && (
          <button
            type="button"
            onClick={clearImage}
            className="block w-full max-w-xl mx-auto bg-white border-2 border-forest text-forest font-bold py-3 rounded-2xl hover:bg-green-50 transition"
          >
            Scan another plant
          </button>
        )}
      </main>

      <footer className="mt-16 text-center text-sm text-gray-500 pb-6">
        <p>Built for OregonHacks 2026 — Nature + Tech</p>
        <p className="mt-1">
          Identification is a machine-learning best guess, not a substitute for a professional survey.
        </p>
        <p className="mt-1">Developed with AI assistance (Claude Code), disclosed per hackathon rules.</p>
      </footer>
    </div>
  );
}

export default App;
