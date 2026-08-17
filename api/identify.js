// Serverless vision endpoint. Runs on Vercel in production and is mounted into the Vite
// dev server by vite.config.js so `npm run dev` hits the identical code path.
//
// The GROQ_API_KEY lives here and only here — it is never shipped to the browser.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Maverick has the strongest vision quality on Groq; Scout is the fallback if the
// primary is rate-limited or retired.
const MODELS = [
  'meta-llama/llama-4-maverick-17b-128e-instruct',
  'meta-llama/llama-4-scout-17b-16e-instruct',
];

// Vercel caps serverless request bodies at ~4.5MB. Base64 inflates bytes by ~33%,
// so we reject early with a useful message rather than letting the platform 413.
const MAX_IMAGE_BYTES = 3_500_000;

const SYSTEM_PROMPT = `You are a botanist assisting with plant identification in the Pacific Northwest (Oregon, USA).

You identify species from photographs. You do NOT give removal, herbicide, or land-management advice — that is handled by a separate verified database. Do not include it.

Respond with JSON only, matching this shape exactly:
{
  "isPlant": boolean,
  "commonName": string,
  "scientificName": string,
  "confidence": number,
  "alternates": [{ "commonName": string, "scientificName": string }],
  "visibleTraits": string
}

Rules:
- "isPlant": false if the photo does not clearly show a plant (a person, an animal, an object, a screenshot, a blurry mess). When false, set commonName and scientificName to "" and confidence to 0.
- "scientificName": binomial only, e.g. "Hedera helix". No cultivar, no authority, no quotes.
- "confidence": your honest probability from 0 to 1 that the scientific name is correct. If the photo is unclear, or the plant could plausibly be several species, report a LOW number. Never inflate confidence. A wrong confident answer is far worse than an honest uncertain one.
- "alternates": up to 2 other species it could plausibly be. Empty array if isPlant is false.
- "visibleTraits": one short sentence naming the specific features you actually used (leaf shape, margin, venation, arrangement, stem, flower, growth habit). This is shown to the user as an explanation, so be concrete and factual about what is in the image.`;

async function callGroq(model, apiKey, dataUrl) {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 700,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Identify the plant in this photo.' },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    const error = new Error(`Groq responded ${response.status}`);
    error.status = response.status;
    error.detail = detail.slice(0, 400);
    throw error;
  }

  return response.json();
}

// The model is instructed to return bare JSON, but occasionally wraps it in a code
// fence. Strip that before parsing rather than failing the whole request.
function parseModelJson(raw) {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  return JSON.parse(cleaned);
}

// Never trust the model's shape. Coerce everything into the contract the UI expects.
function normalize(parsed) {
  const confidence = Number(parsed.confidence);

  return {
    isPlant: parsed.isPlant === true,
    commonName: typeof parsed.commonName === 'string' ? parsed.commonName.trim() : '',
    scientificName: typeof parsed.scientificName === 'string' ? parsed.scientificName.trim() : '',
    confidence: Number.isFinite(confidence) ? Math.min(Math.max(confidence, 0), 1) : 0,
    alternates: Array.isArray(parsed.alternates)
      ? parsed.alternates
          .filter((alt) => alt && typeof alt.scientificName === 'string')
          .slice(0, 2)
          .map((alt) => ({
            commonName: String(alt.commonName ?? '').trim(),
            scientificName: alt.scientificName.trim(),
          }))
      : [],
    visibleTraits: typeof parsed.visibleTraits === 'string' ? parsed.visibleTraits.trim() : '',
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'Server is missing GROQ_API_KEY. Set it in .env locally or in your Vercel project settings.',
    });
    return;
  }

  const { imageBase64 } = req.body ?? {};
  if (typeof imageBase64 !== 'string' || !imageBase64.startsWith('data:image/')) {
    res.status(400).json({ error: 'Expected an image data URL in the "imageBase64" field.' });
    return;
  }

  if (imageBase64.length > MAX_IMAGE_BYTES) {
    res.status(413).json({ error: 'That image is too large. Please use a photo under ~2.5MB.' });
    return;
  }

  let lastError;

  for (const model of MODELS) {
    try {
      const completion = await callGroq(model, apiKey, imageBase64);
      const raw = completion.choices?.[0]?.message?.content;

      if (!raw) {
        throw new Error('Groq returned an empty completion.');
      }

      const result = normalize(parseModelJson(raw));
      res.status(200).json({ ...result, model });
      return;
    } catch (error) {
      lastError = error;
      // A 4xx that isn't rate limiting means the request itself is bad — retrying on
      // another model will fail identically, so stop here.
      if (error.status && error.status !== 429 && error.status < 500) {
        break;
      }
    }
  }

  // Log the upstream detail server-side; never return it to the client, since it can
  // echo back request contents.
  console.error('[identify] all models failed:', lastError?.message, lastError?.detail ?? '');

  const rateLimited = lastError?.status === 429;
  res.status(rateLimited ? 429 : 502).json({
    error: rateLimited
      ? 'The identification service is rate limited right now. Wait a moment and try again.'
      : 'Could not reach the identification service. Check your connection and try again.',
  });
}
