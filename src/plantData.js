// Curated Oregon species reference.
//
// Design note: the vision model identifies the SPECIES. It does not decide invasive
// status and it never writes removal instructions. Those come from here, sourced from
// the Oregon Department of Agriculture noxious weed list and OSU Extension. Letting an
// LLM improvise herbicide or land-management advice is a real-world harm, so we don't.
//
// impactScore: 1 (beneficial native) .. 10 (severe ecological threat)

export const plantDatabase = {
  // ---- Invasive ----
  'hedera helix': {
    name: 'English Ivy',
    scientificName: 'Hedera helix',
    status: 'Invasive',
    impactScore: 8,
    description:
      'Strangles trees and smothers native forest floors. An established ivy mat suppresses seedling regeneration, and the added weight makes mature trees far more likely to blow down in winter storms.',
    removalInstructions:
      'Cut vines at shoulder height and again at the base, then leave the upper growth to die in place — pulling it down damages bark. Hand-pull ground runners when soil is damp. Bag and landfill; do not compost.',
    source: 'Oregon Dept. of Agriculture — Noxious Weed Policy & Classification System',
  },
  'rubus armeniacus': {
    name: 'Himalayan Blackberry',
    scientificName: 'Rubus armeniacus',
    status: 'Invasive',
    impactScore: 7,
    description:
      'Forms dense impenetrable thickets that shade out native understory and block wildlife movement and stream access. Oregon’s most widespread invasive shrub.',
    removalInstructions:
      'Wear thick gloves and eye protection. Cut canes to ground level, then dig out the root crown — anything left will resprout. Expect to repeat for 2–3 seasons, and replant natives to hold the ground.',
    source: 'OSU Extension — Controlling Himalayan Blackberry',
  },
  'cytisus scoparius': {
    name: 'Scotch Broom',
    scientificName: 'Cytisus scoparius',
    status: 'Invasive',
    impactScore: 8,
    description:
      'Fixes nitrogen into soil, permanently altering chemistry so natives struggle to return. Seeds stay viable in the seed bank for decades and it dramatically increases wildfire fuel loads.',
    removalInstructions:
      'Pull young plants when soil is wet. Cut mature stems at ground level during summer drought stress — cutting in wet months encourages resprouting. Monitor the site for years; the seed bank is long-lived.',
    source: 'Oregon Dept. of Agriculture — Class B noxious weed',
  },
  'reynoutria japonica': {
    name: 'Japanese Knotweed',
    scientificName: 'Reynoutria japonica',
    status: 'Invasive',
    impactScore: 10,
    description:
      'Among the most damaging invasives in the state. Rhizomes travel metres underground, destabilise stream banks, and can push through asphalt and building foundations.',
    removalInstructions:
      'Do not dig, cut, or mow — fragments as small as a fingernail start new colonies, and disturbance spreads it. Report the site to your county weed authority and follow professional treatment guidance.',
    source: 'Oregon Dept. of Agriculture — Class B noxious weed',
  },
  'iris pseudacorus': {
    name: 'Yellow Flag Iris',
    scientificName: 'Iris pseudacorus',
    status: 'Invasive',
    impactScore: 7,
    description:
      'Forms dense mats in wetlands and along stream margins, displacing native sedges and rushes and narrowing waterways used by juvenile salmon.',
    removalInstructions:
      'Wear gloves — the sap irritates skin. Dig out entire rhizome masses from saturated soil and bag them. Work carefully near water and avoid leaving fragments behind.',
    source: 'Oregon Dept. of Agriculture — Class B noxious weed',
  },
  'lythrum salicaria': {
    name: 'Purple Loosestrife',
    scientificName: 'Lythrum salicaria',
    status: 'Invasive',
    impactScore: 8,
    description:
      'A single mature plant can release over a million seeds per year. Converts diverse wetland into a monoculture with little food value for native waterfowl.',
    removalInstructions:
      'Hand-pull young plants before flowering, removing the full root. Cut and bag seed heads before they mature. Report large infestations — biological control agents are in use in Oregon.',
    source: 'Oregon Dept. of Agriculture — Class B noxious weed',
  },
  'jacobaea vulgaris': {
    name: 'Tansy Ragwort',
    scientificName: 'Jacobaea vulgaris',
    status: 'Invasive',
    impactScore: 7,
    description:
      'Contains alkaloids that cause fatal liver damage in cattle and horses, making it a livestock hazard as well as an ecological one. Spreads aggressively in pasture and disturbed ground.',
    removalInstructions:
      'Wear gloves; the alkaloids absorb through skin. Pull the entire root before flowering and bag the plants — do not leave them to dry in a field where livestock graze, as they stay toxic.',
    source: 'Oregon Dept. of Agriculture — Class B noxious weed',
  },
  'ilex aquifolium': {
    name: 'English Holly',
    scientificName: 'Ilex aquifolium',
    status: 'Invasive',
    impactScore: 6,
    description:
      'Shade-tolerant evergreen that establishes deep inside intact forest, where birds spread its berries. Slowly converts native understory to holly thicket.',
    removalInstructions:
      'Pull seedlings by hand. For established trees, cut at the base and dig the stump — holly resprouts vigorously from cut stems left in the ground.',
    source: 'OSU Extension — Invasive English Holly',
  },

  // ---- Native ----
  'polystichum munitum': {
    name: 'Sword Fern',
    scientificName: 'Polystichum munitum',
    status: 'Native',
    impactScore: 1,
    description:
      'A keystone Pacific Northwest understory fern. Provides year-round cover for small forest creatures, holds soil on slopes, and indicates a healthy, undisturbed forest floor.',
    removalInstructions:
      'No removal needed — this one is doing good work. If it is thriving here, the site still has healthy forest structure worth protecting.',
    source: 'OSU Extension — PNW Native Plants',
  },
  'rubus spectabilis': {
    name: 'Salmonberry',
    scientificName: 'Rubus spectabilis',
    status: 'Native',
    impactScore: 1,
    description:
      'Early-season flowers feed hummingbirds returning north, and the berries feed birds and bears. Its root network stabilises stream banks and shades salmon-bearing water.',
    removalInstructions:
      'No removal needed. Often confused with invasive Himalayan blackberry — salmonberry has three leaflets, softer stems, and golden-to-red fruit.',
    source: 'OSU Extension — PNW Native Plants',
  },
  'mahonia aquifolium': {
    name: 'Oregon Grape',
    scientificName: 'Mahonia aquifolium',
    status: 'Native',
    impactScore: 1,
    description:
      'Oregon’s state flower. Evergreen, drought-tolerant, and one of the earliest nectar sources for native pollinators emerging in spring.',
    removalInstructions:
      'No removal needed. Frequently mistaken for English holly — Oregon grape leaves are compound with several leaflets along a stem, while holly leaves are single.',
    source: 'OSU Extension — PNW Native Plants',
  },
  'ribes sanguineum': {
    name: 'Red-flowering Currant',
    scientificName: 'Ribes sanguineum',
    status: 'Native',
    impactScore: 1,
    description:
      'Blooms early enough to be a critical first food source for rufous hummingbirds arriving in the Pacific Northwest each spring.',
    removalInstructions:
      'No removal needed. An excellent choice for replanting a site after invasive removal.',
    source: 'OSU Extension — PNW Native Plants',
  },
  'thuja plicata': {
    name: 'Western Red Cedar',
    scientificName: 'Thuja plicata',
    status: 'Native',
    impactScore: 1,
    description:
      'A cornerstone species of Pacific Northwest forests and culturally vital to Coast Salish and other Indigenous peoples. Supports enormous biodiversity across a lifespan measured in centuries.',
    removalInstructions:
      'No removal needed. Mature cedars are increasingly stressed by drought — keep the root zone undisturbed and unpaved.',
    source: 'OSU Extension — PNW Native Plants',
  },
  'rubus ursinus': {
    name: 'Trailing Blackberry',
    scientificName: 'Rubus ursinus',
    status: 'Native',
    impactScore: 1,
    description:
      'Oregon’s only native blackberry. Low, trailing vines feed birds and small mammals without forming the smothering thickets its invasive relatives do.',
    removalInstructions:
      'No removal needed — but check carefully before pulling any blackberry. Native trailing blackberry has three narrow, pointed leaflets and slender round stems. Invasive Himalayan blackberry has five broad, rounded leaflets, thick ridged canes, and white-felted leaf undersides.',
    source: 'OSU Extension — PNW Native Plants',
  },
  'gaultheria shallon': {
    name: 'Salal',
    scientificName: 'Gaultheria shallon',
    status: 'Native',
    impactScore: 1,
    description:
      'Dense evergreen groundcover that provides berries for birds and bears and shelter for ground-nesting species. Thrives in shade where little else will.',
    removalInstructions:
      'No removal needed. Effective, low-maintenance native groundcover for replanting cleared ground.',
    source: 'OSU Extension — PNW Native Plants',
  },
};

// The model returns names like "Hedera helix 'Baltica'" or "Rubus armeniacus Focke".
// Reduce to a bare lowercase binomial so those still match a dataset entry.
function normalizeName(scientificName) {
  return String(scientificName ?? '')
    .toLowerCase()
    .replace(/['"‘’“”]/g, '')
    .replace(/\([^)]*\)/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(' ');
}

/** Look up a species in the verified dataset. Returns null when we have no entry. */
export function lookupSpecies(scientificName) {
  const key = normalizeName(scientificName);
  if (!key) return null;

  if (plantDatabase[key]) return plantDatabase[key];

  // Reynoutria japonica was long classified as Polygonum/Fallopia japonica, and models
  // still return the older synonyms.
  const synonyms = {
    'polygonum cuspidatum': 'reynoutria japonica',
    'fallopia japonica': 'reynoutria japonica',
    'senecio jacobaea': 'jacobaea vulgaris',
    'berberis aquifolium': 'mahonia aquifolium',
    'rubus discolor': 'rubus armeniacus',
    'rubus bifrons': 'rubus armeniacus',
  };

  return synonyms[key] ? plantDatabase[synonyms[key]] : null;
}

export const speciesCount = Object.keys(plantDatabase).length;
