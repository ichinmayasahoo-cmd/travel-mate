// Built-in destination data. Used as the default data source and to seed MongoDB.
// Costs are estimates in Indian Rupees (₹).
//   budget    = typical total per person for a short trip
//   transport = round-trip travel per person | local = local transport per day for a small group
//   hotel     = per room per night (2 people) | food = per person per day
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
const A = (name, cost = 0) => ({ name, cost });

export const destinations = [
  {
    id: 'puri', name: 'Puri', region: 'Odisha', country: 'India', category: 'Religious', tags: ['Beach'],
    image: img('photo-1590050752117-238cb0fb12b1'),
    description: 'Sacred seaside city with the Jagannath Temple, golden beaches and the famous Rath Yatra.',
    budget: 5000, rating: 4.6, popularity: 88, duration: '3 days', bestTime: 'October to March',
    highlights: ['Jagannath Temple', 'Golden Beach sunrise', 'Konark Sun Temple', 'Chilika Lake'],
    weather: { temp: 30, condition: 'Sunny', humidity: 75 },
    transport: 1000, local: 250, hotel: 700, food: 300,
    plan: [
      { title: 'Temples & Golden Beach', activities: [A('Jagannath Temple darshan'), A('Golden Beach sunset walk')], food: 'Try Mahaprasad, Dalma, Khaja and fresh seafood near Swargadwar.' },
      { title: 'Konark & Chandrabhaga', activities: [A('Konark Sun Temple (UNESCO site)', 40), A('Chandrabhaga Beach'), A('Ramachandi Temple viewpoint')], food: 'Enjoy Chhena Poda and Pakhala Bhata at a local eatery.' },
      { title: 'Chilika Lake & Shopping', activities: [A('Chilika Lake boat ride and dolphin spotting', 600), A('Shopping for Pattachitra and stone carvings'), A('Local sightseeing around Puri Bazaar')], food: 'Fresh crab and prawn curry at Satapada.' }
    ]
  },
  {
    id: 'goa', name: 'Goa', region: 'Goa', country: 'India', category: 'Beach', tags: ['Nature'],
    image: img('photo-1512343879784-a960bf40e7f2'),
    description: 'India’s beach capital: golden sands, Portuguese heritage, lively markets and sunset cruises.',
    budget: 18000, rating: 4.7, popularity: 95, duration: '4 days', bestTime: 'November to February',
    highlights: ['Baga & Calangute beaches', 'Old Goa churches', 'Fort Aguada', 'Palolem Beach'],
    weather: { temp: 31, condition: 'Sunny', humidity: 70 },
    transport: 4500, local: 800, hotel: 3000, food: 900,
    plan: [
      { title: 'North Goa Beaches', activities: [A('Calangute & Baga Beach'), A('Fort Aguada'), A('Anjuna flea market and Chapora Fort sunset')], food: 'Goan fish thali and prawn balchão at a beach shack.' },
      { title: 'Old Goa & Panjim', activities: [A('Basilica of Bom Jesus'), A('Fontainhas Latin Quarter walk'), A('Mandovi River sunset cruise', 400)], food: 'Bebinca, sausage pulao and cafés in Fontainhas.' },
      { title: 'Calm South Goa', activities: [A('Palolem Beach'), A('Butterfly Beach boat trip', 500), A('Cabo de Rama Fort')], food: 'Fresh seafood and cold coconut water at Palolem.' }
    ]
  },
  {
    id: 'manali', name: 'Manali', region: 'Himachal Pradesh', country: 'India', category: 'Adventure', tags: ['Mountain', 'Nature'],
    image: img('photo-1506905925346-21bda4d32df4'),
    description: 'Snow-capped Himalayan valley with cedar forests, hot springs and adventure sports.',
    budget: 16000, rating: 4.6, popularity: 92, duration: '4 days', bestTime: 'March to June, December to February',
    highlights: ['Solang Valley', 'Hadimba Temple', 'Atal Tunnel', 'Old Manali cafés'],
    weather: { temp: 12, condition: 'Clear Sky', humidity: 55 },
    transport: 5000, local: 1500, hotel: 2500, food: 700,
    plan: [
      { title: 'Old Manali & Temples', activities: [A('Hadimba Devi Temple'), A('Mall Road stroll'), A('Vashisht hot springs')], food: 'Siddu with ghee and trout fish in Old Manali cafés.' },
      { title: 'Solang Valley Adventure', activities: [A('Paragliding or zorbing at Solang Valley', 1800), A('Atal Tunnel drive'), A('Sissu Waterfall')], food: 'Thukpa and momos at a roadside dhaba.' },
      { title: 'Snow & Waterfalls', activities: [A('Rohtang Pass (permit, seasonal)', 550), A('Jogini Waterfall trek'), A('Naggar Castle visit', 50)], food: 'Himachali dham and apple cider.' }
    ]
  },
  {
    id: 'kashmir', name: 'Kashmir', region: 'Jammu & Kashmir', country: 'India', category: 'Mountain', tags: ['Nature'],
    image: img('photo-1595815771614-ade9d652a65d'),
    description: 'Paradise on Earth: Dal Lake shikaras, Mughal gardens, alpine meadows and snowy peaks.',
    budget: 32000, rating: 4.8, popularity: 90, duration: '5 days', bestTime: 'April to October',
    highlights: ['Dal Lake shikara ride', 'Gulmarg Gondola', 'Pahalgam valleys', 'Mughal Gardens'],
    weather: { temp: 8, condition: 'Cloudy', humidity: 60 },
    transport: 9000, local: 2000, hotel: 3500, food: 900,
    plan: [
      { title: 'Srinagar & Dal Lake', activities: [A('Dal Lake shikara ride', 800), A('Shalimar & Nishat Mughal Gardens', 30), A('Houseboat sunset and Lal Chowk market')], food: 'Wazwan, Kashmiri kahwa and noon chai.' },
      { title: 'Gulmarg Snow Day', activities: [A('Gulmarg Gondola (Phase 1 & 2)', 1800), A('Meadow walk and pony ride', 700), A('Strawberry Valley viewpoint')], food: 'Rogan josh and hot chocolate at Gulmarg.' },
      { title: 'Pahalgam Valleys', activities: [A('Betaab Valley', 150), A('Aru Valley'), A('Lidder River walk')], food: 'Trout fish and fresh walnut bread.' }
    ]
  },
  {
    id: 'bali', name: 'Bali', region: 'Indonesia', country: 'Indonesia', category: 'Nature', tags: ['Beach', 'Religious'],
    image: img('photo-1537996194471-e657df975ab4'),
    description: 'Island of the Gods with rice terraces, ancient temples, surf beaches and wellness retreats.',
    budget: 65000, rating: 4.8, popularity: 93, duration: '5 days', bestTime: 'April to October',
    highlights: ['Ubud rice terraces', 'Uluwatu Temple', 'Nusa Penida', 'Sacred Monkey Forest'],
    weather: { temp: 29, condition: 'Partly Cloudy', humidity: 78 },
    transport: 30000, local: 2500, hotel: 4500, food: 1500,
    plan: [
      { title: 'Ubud Culture', activities: [A('Sacred Monkey Forest', 800), A('Tegallalang Rice Terraces', 300), A('Tirta Empul Temple', 400)], food: 'Babi guling or nasi campur at a warung.' },
      { title: 'Uluwatu Coast', activities: [A('Uluwatu Temple and Kecak fire dance', 1000), A('Padang Padang Beach'), A('Jimbaran Bay sunset')], food: 'Grilled seafood dinner on Jimbaran Beach.' },
      { title: 'Nusa Penida Island', activities: [A('Kelingking Beach viewpoint (boat)', 3000), A('Angel’s Billabong'), A('Crystal Bay snorkelling', 1500)], food: 'Fresh fruit bowls and seaside cafés.' }
    ]
  },
  {
    id: 'paris', name: 'Paris', region: 'Île-de-France', country: 'France', category: 'Historical', tags: [],
    image: img('photo-1502602898657-3e91760cbb34'),
    description: 'The City of Light: iconic landmarks, world-class museums, cafés and romantic river walks.',
    budget: 150000, rating: 4.9, popularity: 97, duration: '5 days', bestTime: 'April to June, September to October',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Palace of Versailles'],
    weather: { temp: 14, condition: 'Light Clouds', humidity: 68 },
    transport: 60000, local: 1500, hotel: 12000, food: 4000,
    plan: [
      { title: 'Iconic Paris', activities: [A('Eiffel Tower summit', 2800), A('Seine River cruise', 1200), A('Trocadéro sunset view')], food: 'Croissants for breakfast and a classic bistro dinner.' },
      { title: 'Art & Montmartre', activities: [A('Louvre Museum', 1800), A('Notre-Dame and Île de la Cité walk'), A('Montmartre and Sacré-Cœur')], food: 'Crêpes in Montmartre and French onion soup.' },
      { title: 'Versailles & Champs-Élysées', activities: [A('Palace of Versailles', 2200), A('Arc de Triomphe', 1400), A('Champs-Élysées stroll')], food: 'Macarons from a patisserie and a picnic in the gardens.' }
    ]
  },
  {
    id: 'dubai', name: 'Dubai', region: 'Dubai', country: 'UAE', category: 'Adventure', tags: ['Beach'],
    image: img('photo-1512453979798-5ea266f8880c'),
    description: 'A futuristic skyline, desert safaris, luxury shopping and golden beaches.',
    budget: 90000, rating: 4.7, popularity: 91, duration: '4 days', bestTime: 'November to March',
    highlights: ['Burj Khalifa', 'Desert safari', 'Palm Jumeirah', 'Gold & Spice Souks'],
    weather: { temp: 36, condition: 'Sunny', humidity: 40 },
    transport: 25000, local: 2500, hotel: 8000, food: 2500,
    plan: [
      { title: 'Downtown Dubai', activities: [A('Burj Khalifa – At the Top', 3500), A('Dubai Mall and Fountain Show'), A('Dubai Frame', 1100)], food: 'Shawarma, hummus and Arabic coffee.' },
      { title: 'Desert Adventure', activities: [A('Dune bashing safari with BBQ dinner', 4000), A('Camel ride and sandboarding'), A('Stargazing at the desert camp')], food: 'BBQ dinner at the desert camp.' },
      { title: 'Old Dubai & Palm', activities: [A('Gold and Spice Souks'), A('Abra ride across Dubai Creek', 100), A('Palm Jumeirah and Dubai Marina walk')], food: 'Karak chai and Emirati machboos.' }
    ]
  },
  {
    id: 'jaipur', name: 'Jaipur', region: 'Rajasthan', country: 'India', category: 'Historical', tags: ['Religious'],
    image: img('photo-1477587458883-47145ed94245'),
    description: 'The Pink City of royal palaces, hilltop forts, colourful bazaars and Rajasthani culture.',
    budget: 14000, rating: 4.7, popularity: 89, duration: '3 days', bestTime: 'October to March',
    highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Bapu Bazaar'],
    weather: { temp: 29, condition: 'Clear Sky', humidity: 35 },
    transport: 3500, local: 700, hotel: 2200, food: 600,
    plan: [
      { title: 'Forts & Palaces', activities: [A('Amber Fort', 500), A('Jal Mahal photo stop'), A('Panna Meena ka Kund stepwell')], food: 'Dal baati churma and lassi.' },
      { title: 'The Pink City', activities: [A('City Palace', 700), A('Jantar Mantar', 200), A('Hawa Mahal', 200)], food: 'Pyaaz kachori and masala chai at Johari Bazaar.' },
      { title: 'Sunset & Bazaars', activities: [A('Nahargarh Fort sunset', 200), A('Bapu Bazaar shopping'), A('Rajasthani dinner and folk show at Chokhi Dhani', 900)], food: 'Laal maas or gatte ki sabzi.' }
    ]
  }
];

export const categories = ['Beach', 'Mountain', 'Adventure', 'Historical', 'Religious', 'Nature'];
