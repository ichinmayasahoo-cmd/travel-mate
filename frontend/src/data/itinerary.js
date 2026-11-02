import { destinations } from './destinations.js';

// Rule-based itinerary generator. Needs no external AI key.
const MULT = {
  Budget: { hotel: 0.7, food: 0.75, local: 0.8 },
  Standard: { hotel: 1, food: 1, local: 1 },
  Luxury: { hotel: 2.2, food: 1.8, local: 1.6 },
  Adventure: { hotel: 1, food: 1, local: 1.1 },
  Cultural: { hotel: 1, food: 1, local: 1 },
  Relaxation: { hotel: 1.2, food: 1.1, local: 1 }
};
export const PREFERENCES = Object.keys(MULT);

const TIPS = {
  Budget: 'Choose guesthouses, eat at local eateries and use public transport to stretch your budget.',
  Standard: 'A balanced plan with comfortable stays and a mix of popular sights and local food.',
  Luxury: 'Upgraded stays and private transfers are included in these estimates. Book premium experiences early.',
  Adventure: 'Start early each day and keep a buffer for weather. Book activity slots in advance.',
  Cultural: 'Hire a local guide at heritage sites and try regional dishes to get the full story of the place.',
  Relaxation: 'Keep mornings slow, add spa or beach time and avoid packing more than two sights a day.'
};

const LEISURE = {
  title: 'Leisure & Flexible Exploration',
  activities: [
    { name: 'Revisit your favourite spot', cost: 0 },
    { name: 'Optional local experience or day trip', cost: 500 },
    { name: 'Souvenir shopping and a farewell dinner', cost: 0 }
  ],
  food: 'Pick a well-reviewed local restaurant and try a new regional dish.'
};

const genericDestination = (name) => ({
  id: 'custom', name: name || 'Your Destination', region: '', country: '', image: '',
  transport: 3500, local: 400, hotel: 2200, food: 600,
  plan: [
    { title: 'Arrival & Local Orientation', activities: [{ name: 'Check in and freshen up', cost: 0 }, { name: 'Walk through the main market and old town', cost: 0 }, { name: 'Sunset at a popular viewpoint', cost: 0 }], food: 'Try the most popular local restaurant for regional dishes.' },
    { title: 'Top Sights', activities: [{ name: 'Visit the most famous landmark', cost: 300 }, { name: 'Local museum or heritage site', cost: 200 }, { name: 'Nearby park or nature spot', cost: 0 }], food: 'Sample street food recommended by locals.' },
    { title: 'Culture & Shopping', activities: [{ name: 'Local temple, church or cultural centre', cost: 0 }, { name: 'Handicraft and souvenir shopping', cost: 0 }, { name: 'Evening cultural show or food street', cost: 300 }], food: 'Farewell dinner with a regional specialty.' }
  ]
});

export function findDestination(query) {
  const s = String(query || '').trim().toLowerCase();
  if (!s) return null;
  return destinations.find((d) => d.id === s || d.name.toLowerCase() === s || s.startsWith(d.name.toLowerCase())) || null;
}

const round10 = (n) => Math.round(n / 10) * 10;

export function generateItinerary(input = {}) {
  const { startingLocation = '', destination = '', startDate, endDate, preference = 'Standard' } = input;
  const dest = findDestination(destination) || genericDestination(String(destination).trim());
  const travelers = Math.max(1, Math.min(20, parseInt(input.travelers, 10) || 1));
  const budget = Math.max(0, Number(input.budget) || 0);
  const s = new Date(startDate);
  const e = new Date(endDate);
  let days = 1;
  if (!isNaN(s) && !isNaN(e)) days = Math.round((e - s) / 86400000) + 1;
  days = Math.max(1, Math.min(10, days));
  const nights = days - 1;
  const m = MULT[preference] || MULT.Standard;
  const rooms = Math.ceil(travelers / 2);

  const plan = Array.from({ length: days }, (_, i) => {
    const d = dest.plan[i] || LEISURE;
    let date = null;
    if (!isNaN(s)) { const x = new Date(s); x.setDate(x.getDate() + i); date = x.toISOString().slice(0, 10); }
    return { day: i + 1, date, title: d.title, activities: d.activities, food: d.food };
  });

  const attractions = plan.reduce((sum, d) => sum + d.activities.reduce((a, x) => a + x.cost, 0), 0) * travelers;
  const costs = {
    transportation: round10(dest.transport * travelers + dest.local * m.local * Math.ceil(travelers / 4) * days),
    hotel: round10(dest.hotel * m.hotel * rooms * nights),
    food: round10(dest.food * m.food * travelers * days),
    attractions: round10(attractions)
  };
  const total = costs.transportation + costs.hotel + costs.food + costs.attractions;
  const difference = budget ? budget - total : 0;
  const status = !budget ? 'none' : total <= budget ? 'within' : 'over';
  const savingTips = status === 'over'
    ? ['Switch your preference to Budget to lower hotel and food costs.', 'Travel with a friend: rooms are shared between two travellers.', 'Shorten the trip by a day or travel in the off-season for cheaper tickets.']
    : [];

  return {
    destination: { id: dest.id, name: dest.name, region: dest.region, country: dest.country, image: dest.image },
    startingLocation, startDate, endDate, travelers, days, nights, preference,
    tip: TIPS[preference] || TIPS.Standard,
    plan, costs, total, budget, status, difference, perPerson: round10(total / travelers), savingTips
  };
}
