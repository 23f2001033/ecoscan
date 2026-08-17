import { LOW_CONFIDENCE } from '../constants';

function ConfidencePanel({ result }) {
  const percent = Math.round(result.confidence * 100);
  const level = result.confidence >= 0.75 ? 'High' : result.confidence >= LOW_CONFIDENCE ? 'Moderate' : 'Low';

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="font-bold text-gray-800">Identification confidence</h3>
        <span className="text-sm font-semibold text-gray-700">{level} · {percent}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full bg-forest transition-all duration-500"
          style={{ width: `${percent}%` }}
          role="img"
          aria-label={`${percent} percent confident in this identification`}
        />
      </div>

      {result.alternates.length > 0 && (
        <p className="text-sm text-gray-600 mt-3">
          Also considered:{' '}
          {result.alternates.map((alt, index) => (
            <span key={alt.scientificName}>
              {index > 0 && ', '}
              <em>{alt.scientificName}</em>
              {alt.commonName && ` (${alt.commonName})`}
            </span>
          ))}
        </p>
      )}

      {result.visibleTraits && (
        <p className="text-sm text-gray-600 mt-3">
          <span className="font-semibold text-gray-700">What the model saw:</span> {result.visibleTraits}
        </p>
      )}
    </div>
  );
}

/** Photo isn't a plant, or the model is too unsure to stand behind a name. */
function InconclusiveCard({ result }) {
  const isPlant = result.isPlant;

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fade-in">
      <h2 className="text-2xl font-bold text-forest mb-2">
        {isPlant ? 'Not confident enough to call it' : "That doesn't look like a plant"}
      </h2>

      <p className="text-gray-700 mb-4">
        {isPlant
          ? 'We could see a plant, but not clearly enough to name the species honestly. We would rather say so than guess — a wrong ID could mean pulling out a native.'
          : 'We could not find a plant in this photo. Point the camera at foliage and try again.'}
      </p>

      {isPlant && result.scientificName && (
        <p className="text-gray-600 mb-4">
          Closest match was <em>{result.scientificName}</em> at only {Math.round(result.confidence * 100)}% confidence.
        </p>
      )}

      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-800 mb-2">For a better result</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Fill the frame with leaves — shape and edges matter most</li>
          <li>Shoot in even daylight, avoiding harsh shadow</li>
          <li>Include a flower, berry, or stem if the plant has one</li>
          <li>Photograph one plant at a time, not a whole hillside</li>
        </ul>
      </div>

      {isPlant && <div className="mt-4"><ConfidencePanel result={result} /></div>}
    </div>
  );
}

/** Species identified, but we have no verified Oregon entry for it. */
function UnlistedCard({ result }) {
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fade-in">
      <div className="mb-4 pb-4 border-b">
        <h2 className="text-3xl font-bold text-forest">{result.commonName || 'Unknown species'}</h2>
        <p className="text-md italic text-gray-500">{result.scientificName}</p>
      </div>

      <div className="bg-amber-50 border-l-4 border-caution p-4 rounded mb-6">
        <h3 className="font-bold text-caution mb-1">Not in our verified Oregon database</h3>
        <p className="text-gray-700 text-sm">
          We identified the species, but it is not one of the {' '}
          <strong>Oregon Department of Agriculture</strong> listed species we hold verified guidance for.
          We will not guess at its invasive status or invent removal instructions — that advice has real
          consequences for your land, so it only comes from a verified source.
        </p>
      </div>

      <ConfidencePanel result={result} />
    </div>
  );
}

/** The full verdict: identified species matched to verified Oregon guidance. */
function VerdictCard({ result, species }) {
  const isInvasive = species.status === 'Invasive';

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fade-in">
      <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b">
        <div>
          <h2 className="text-3xl font-bold text-forest">{species.name}</h2>
          <p className="text-md italic text-gray-500">{species.scientificName}</p>
        </div>

        {/* Status is conveyed by icon + word, not colour alone, so it survives colour
            blindness and greyscale printing. */}
        <span
          className={`shrink-0 px-4 py-2 rounded-full font-bold text-sm text-white flex items-center gap-1.5 ${
            isInvasive ? 'bg-danger' : 'bg-leafText'
          }`}
        >
          <span aria-hidden="true">{isInvasive ? '⚠' : '✓'}</span>
          {species.status}
        </span>
      </div>

      <p className="text-gray-700 mb-6">{species.description}</p>

      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <h3 className="font-bold text-gray-800 mb-2">Eco-impact score: {species.impactScore}/10</h3>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${isInvasive ? 'bg-danger' : 'bg-leafText'}`}
            style={{ width: `${species.impactScore * 10}%` }}
            role="img"
            aria-label={`Ecological impact ${species.impactScore} out of 10`}
          />
        </div>
        <p className={`text-sm font-semibold ${isInvasive ? 'text-dangerText' : 'text-leafText'}`}>
          {isInvasive ? 'Threat to local biodiversity' : 'Beneficial to the local ecosystem'}
        </p>
      </div>

      <ConfidencePanel result={result} />

      <div
        className={`mt-6 p-4 rounded border-l-4 ${
          isInvasive ? 'bg-red-50 border-danger' : 'bg-green-50 border-leafText'
        }`}
      >
        <h3 className={`font-bold mb-1 ${isInvasive ? 'text-dangerText' : 'text-leafText'}`}>
          {isInvasive ? 'How to remove it' : 'Good news — leave it be'}
        </h3>
        <p className="text-gray-700 text-sm">{species.removalInstructions}</p>
        <p className="text-xs text-gray-500 mt-2">Source: {species.source}</p>
      </div>

      <p className="mt-6 text-center text-xs text-gray-500">
        Species identified by {result.model?.split('/').pop() ?? 'vision model'} · guidance from verified
        Oregon sources, not generated
      </p>
    </div>
  );
}

export default function ResultCard({ result, species }) {
  if (!result.isPlant || result.confidence < LOW_CONFIDENCE) {
    return <InconclusiveCard result={result} />;
  }

  if (!species) {
    return <UnlistedCard result={result} />;
  }

  return <VerdictCard result={result} species={species} />;
}
