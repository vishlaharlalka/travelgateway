import type { Destination, DestinationImage } from './types';

const mediaUrl = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1600`;

const curatedMediaRules: Array<{ keywords: string[]; url: string; caption: string }> = [
  { keywords: ["dwarkadhish", "dwarka"], url: mediaUrl("Dwarkadhish Temple, Dwarka, Gujarat.JPG"), caption: "Dwarkadhish Temple, Dwarka" },
  { keywords: ["somnath"], url: mediaUrl("Somnath temple gujrat.jpg"), caption: "Somnath Temple, Gujarat coast" },
  { keywords: ["nageshwar", "nageshvara"], url: mediaUrl("Nageshwar Temple.jpg"), caption: "Nageshwar Jyotirlinga, Dwarka" },
  { keywords: ["statue of unity"], url: mediaUrl("Statue of Unity, Gujarat.jpg"), caption: "Statue of Unity, Gujarat" },
  { keywords: ["gir lion", "gir safari", "gir"], url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1600", caption: "Gir-style wildlife safari" },
  { keywords: ["white rann", "rann of kutch", "kutch", "dhordo"], url: mediaUrl("Rann of Kutch.jpg"), caption: "White Rann of Kutch" },
  { keywords: ["mandvi"], url: mediaUrl("Mandvi Beach.jpg"), caption: "Mandvi coast" },
  { keywords: ["jaipur", "amber", "amer"], url: mediaUrl("Amer Fort Jaipur.jpg"), caption: "Jaipur palace and fort circuit" },
  { keywords: ["jaisalmer"], url: mediaUrl("Jaisalmer Fort Rajasthan.jpg"), caption: "Jaisalmer desert fortress" },
  { keywords: ["jodhpur", "mehrangarh"], url: mediaUrl("Mehrangarh Fort Jodhpur.jpg"), caption: "Mehrangarh Fort, Jodhpur" },
  { keywords: ["pushkar"], url: mediaUrl("Pushkar Lake.jpg"), caption: "Pushkar lake walk" },
  { keywords: ["alleppey", "backwater", "kumarakom"], url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1600", caption: "Kerala backwater houseboat" },
  { keywords: ["munnar", "tea"], url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1600", caption: "Munnar tea hills" },
  { keywords: ["kochi", "cochin"], url: mediaUrl("Chinese fishing nets Cochin.jpg"), caption: "Kochi heritage waterfront" },
  { keywords: ["taj mahal", "agra"], url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1600", caption: "Taj Mahal, Agra" },
  { keywords: ["varanasi", "kashi", "ganga aarti"], url: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&q=80&w=1600", caption: "Varanasi ghats and Ganga aarti" },
  { keywords: ["ayodhya"], url: mediaUrl("Ram Mandir Inauguration Day Picture.jpg"), caption: "Ayodhya temple circuit" },
  { keywords: ["prayagraj", "sangam"], url: mediaUrl("Triveni Sangam, Prayagraj.jpg"), caption: "Prayagraj Sangam" },
  { keywords: ["goa", "beach"], url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1600", caption: "Goa coast" },
  { keywords: ["hampi"], url: mediaUrl("Stone Chariot, Hampi.jpg"), caption: "Hampi ruins" },
  { keywords: ["mysuru", "mysore"], url: mediaUrl("Mysore Palace, Karnataka.jpg"), caption: "Mysuru Palace" },
  { keywords: ["coorg"], url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1600", caption: "Coorg plantation country" },
  { keywords: ["kaziranga"], url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1600", caption: "Kaziranga wildlife" },
  { keywords: ["tawang"], url: mediaUrl("Tawang Monastery Arunachal Pradesh.jpg"), caption: "Tawang Monastery" },
  { keywords: ["darjeeling"], url: mediaUrl("Darjeeling Himalayan Railway.jpg"), caption: "Darjeeling toy train" },
  { keywords: ["bodh gaya", "mahabodhi"], url: "https://images.unsplash.com/photo-1652288156243-a7505dcaa0ec?auto=format&fit=crop&q=80&w=1600", caption: "Bodh Gaya pilgrimage" },
];

export function curatedImageForText(text: string): DestinationImage | undefined {
  const normalized = text.toLowerCase();
  const match = curatedMediaRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));

  if (!match) return undefined;

  return {
    url: match.url,
    alt: match.caption,
    caption: match.caption,
  };
}

export function shouldFitWholeImage(image: Pick<DestinationImage, "url" | "alt" | "caption"> | string) {
  const value = typeof image === "string" ? image : `${image.url} ${image.alt} ${image.caption}`;
  const normalized = decodeURIComponent(value).toLowerCase().replace(/[_-]+/g, " ");

  return (
    normalized.includes("statue of unity") ||
    normalized.includes("dwarkadhish temple") ||
    normalized.includes("dwarka gujarat")
  );
}

function curatedGalleryForPackage(row: { name: string; state: string; city: string; highlights: string[]; image: string }) {
  const candidates = [
    ...row.highlights.map((highlight) => curatedImageForText(highlight) || curatedImageForText(`${highlight} ${row.city}`)),
    curatedImageForText(`${row.name} ${row.state} ${row.city}`),
    { url: row.image, alt: `${row.name} hero image`, caption: row.highlights[0] },
  ].filter(Boolean) as DestinationImage[];

  const unique = candidates.filter((image, index, images) => images.findIndex((candidate) => candidate.url === image.url) === index);

  return row.highlights.slice(0, 3).map((highlight, index) => {
    const image = unique[index % unique.length];
    return {
      url: image.url,
      alt: image.alt || `${row.name} ${highlight}`,
      caption: index === 0 && image.caption ? image.caption : highlight,
    };
  });
}

const baseDestinations: Destination[] = [
  {
    id: 1,
    name: "Vietnam Wonders",
    country: "Vietnam",
    type: "International",
    region: "Southeast Asia",
    regionId: "southeast-asia",
    image: "https://images.unsplash.com/photo-1555661530-68c8e98db4e6?auto=format&fit=crop&q=80&w=1200",
    category: "Cultural",
    price: "₹74,999",
    rating: 4.9,
    description: "Experience the magic of Ha Long Bay and the vibrant culture of Hanoi. Perfect for Indian travelers.",
    longDescription: "Embark on an unforgettable 8-day journey through the heart of Vietnam. From the chaotic charm of Hanoi's Old Quarter to the serene, emerald waters of Ha Long Bay, this curated tour offers a perfect blend of history, culture, and natural beauty. You'll explore ancient temples, crawl through historical tunnels, and savor some of the world's finest street food, all while staying in hand-picked luxury accommodations.",
    link: "/destinations/vietnam",
    services: ["Luxury Accommodation", "Daily Breakfast & Dinner", "Internal Transfers", "Expert Local Guides", "Private Boat Tours", "Cultural Performances"],
    itinerary: [
      { day: "Day 1-2", title: "Hanoi Arrival & City Tour", description: "Explore the Old Quarter, Ho Chi Minh Mausoleum, and Temple of Literature. Enjoy a traditional water puppet show." },
      { day: "Day 3-4", title: "Ha Long Bay Cruise", description: "Overnight luxury cruise through limestone karsts with kayaking, cave visits, and sunset cocktails on the deck." },
      { day: "Day 5-6", title: "Hoi An Ancient Town", description: "Lantern-lit streets, tailor shops, and traditional cooking classes. Visit the iconic Japanese Covered Bridge." },
      { day: "Day 7-8", title: "Ho Chi Minh City & Cu Chi Tunnels", description: "War Remnants Museum and the incredible underground tunnel network. Farewell dinner on a river cruise." }
    ],
    faqs: [
      { question: "Do Indian citizens need a visa for Vietnam?", answer: "Yes, Indian passport holders normally need a Vietnam visa before entering mainland Vietnam. The e-visa is usually the most practical tourism route, with passport details, photo, travel dates, entry and exit ports, and stay address checked carefully before applying." },
      { question: "What is the best time to visit Vietnam?", answer: "The best time is generally from November to April when the weather is moderate and pleasant across most regions." },
      { question: "Is Indian food easily available in Vietnam?", answer: "Yes, major cities like Hanoi and Ho Chi Minh City have several excellent Indian restaurants catering to both veg and non-veg preferences." },
      { question: "What currency is used in Vietnam?", answer: "The official currency is the Vietnamese Dong (VND). US Dollars are also accepted in some tourist areas, but it's best to carry local currency." }
    ]
  },
  {
    id: 13,
    name: "Central Vietnam Charm",
    country: "Vietnam",
    type: "International",
    region: "Southeast Asia",
    regionId: "southeast-asia",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800",
    category: "Coastal",
    price: "₹68,500",
    rating: 4.8,
    description: "Explore the ancient town of Hoi An, the imperial city of Hue, and the modern bridge of Da Nang.",
    longDescription: "Deep dive into the cultural soul of Central Vietnam. This 6-day package takes you through the UNESCO World Heritage site of Hoi An, the stunning Ba Na Hills with its famous Golden Bridge, and the historic tombs of Hue. Perfect for those who love a mix of history, photography, and coastal relaxation.",
    services: ["Boutique Heritage Hotels", "Ba Na Hills Cable Car Tickets", "Hue Imperial City Guided Tour", "Hoi An Lantern Workshop", "Airport Private Transfers"],
    itinerary: [
      { day: "Day 1", title: "Da Nang Arrival & Marble Mountains", description: "Arrive in Da Nang and explore the limestone caves and pagodas of Marble Mountains before heading to Hoi An." },
      { day: "Day 2", title: "Hoi An Ancient Town & My Son Sanctuary", description: "Morning visit to My Son Sanctuary, an ancient Champa civilization site. Afternoon walking tour of Hoi An Ancient Town." },
      { day: "Day 3", title: "Ba Na Hills & Golden Bridge", description: "Full day at Ba Na Hills. Experience the world's longest cable car and walk on the iconic Golden Bridge held by giant hands." },
      { day: "Day 4", title: "Hue Imperial City Journey", description: "Travel to Hue via the scenic Hai Van Pass. Visit the Imperial Citadel and Thien Mu Pagoda." },
      { day: "Day 5-6", title: "Hue Tombs & Departure", description: "Explore the majestic tombs of Emperors Minh Mang and Khai Dinh. Afternoon flight back from Da Nang." }
    ],
    faqs: [
      { question: "Do Indian travelers need a Vietnam e-visa for this route?", answer: "Yes. Since this route uses mainland Vietnam cities such as Da Nang, Hoi An, and Hue, Indian passport holders should plan for a Vietnam e-visa unless official rules for their passport and travel date say otherwise." },
      { question: "How far is Da Nang from Hoi An?", answer: "Da Nang is approximately 30km from Hoi An, roughly a 45-minute drive." },
      { question: "Is the Golden Bridge located in Da Nang?", answer: "The Golden Bridge is part of the Ba Na Hills mountain resort, which is about 35km from Da Nang city center." },
      { question: "What should I wear when visiting temples in Hue?", answer: "Respectful attire is required; shoulders and knees should be covered when entering pagodas and the Imperial City." }
    ]
  },
  {
    id: 14,
    name: "Southern Vietnam & Phu Quoc Escape",
    country: "Vietnam",
    type: "International",
    region: "Southeast Asia",
    regionId: "southeast-asia",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800",
    category: "Tropical",
    price: "₹92,000",
    rating: 4.9,
    description: "From the bustling streets of Saigon to the pristine white sand beaches of Phu Quoc island.",
    longDescription: "The ultimate Southern Vietnam experience. Start in the high-energy metropolis of Ho Chi Minh City, discover the life along the Mekong Delta, and then fly to the paradise island of Phu Quoc for three days of pure tropical bliss. This tour is designed for travelers seeking both city excitement and island serenity.",
    services: ["Luxury Beach Resort in Phu Quoc", "Mekong Delta Cruise", "Inner-island Flight Tickets", "Cu Chi Tunnels Guided Tour", "Sunset Cocktails at Skybar"],
    itinerary: [
      { day: "Day 1-2", title: "Ho Chi Minh City Energy", description: "Explore the bustling Ben Thanh Market, Notre Dame Cathedral, and the moving War Remnants Museum." },
      { day: "Day 3", title: "Mekong Delta River Life", description: "Boat trip through My Tho, visit coconut candy workshops, and enjoy honey tea while cruising the canals." },
      { day: "Day 4", title: "Flight to Phu Quoc Island", description: "Short flight to Vietnam's largest island. Check into your luxury beach resort and relax by the pool." },
      { day: "Day 5-6", title: "Phu Quoc Sun & Sea", description: "Island hopping tour, snorkeling at Starfish Beach, and visiting the vibrant Phu Quoc night market." },
      { day: "Day 7", title: "Last Dip & Departure", description: "Enjoy a final morning on the beach before your flight back to Ho Chi Minh City for connection." }
    ],
    faqs: [
      { question: "Is Phu Quoc visa-free for Indians?", answer: "Phu Quoc can be visa-free for up to 30 days when it is your only Vietnam destination and you enter, stay, and exit under that island-only route. This itinerary also includes Ho Chi Minh City and the Mekong Delta, so Indian passport holders should plan for a Vietnam e-visa." },
      { question: "What is the best month for Phu Quoc?", answer: "The dry season from November to April is the best time for clear skies and calm seas in Phu Quoc." },
      { question: "Are there good veg food options in Phu Quoc?", answer: "While seafood is dominant, luxury resorts and the night market offer plenty of delicious options including morning glory, tofu dishes, and tropical fruits." }
    ]
  },
  {
    id: 7,
    name: "Royal Rajasthan",
    country: "India",
    state: "Rajasthan",
    city: "Jaipur, Jodhpur, Jaisalmer, Udaipur",
    type: "Domestic",
    region: "South Asia",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1578155173088-710a9aef3849?auto=format&fit=crop&q=80&w=1600",
    category: "Cultural",
    price: "₹45,500",
    rating: 4.9,
    description: "Journey through the land of Kings, majestic forts, and golden deserts.",
    longDescription: "Rajasthan is a land of vibrant colors, heroic history, and royal hospitality. Our 'Royal Rajasthan' tour takes you deep into the Thar Desert, inside the walls of massive sandstone forts, and through the corridors of opulent palaces. Experience the majesty of the Pink City, the Blue City, and the Golden City in one seamless, luxury-filled week that captures the soul of India's most regal state.",
    services: ["Palatial Heritage Stays", "Camel Safaris", "Folk Music & Dance", "Private Guided Fort Tours", "Authentic Rajasthani Thali"],
    itinerary: [
      { day: "Day 1-2", title: "Pink City Jaipur", description: "Visit Amer Fort, Hawa Mahal, and City Palace with traditional Rajasthani dinner at Chokhi Dhani." },
      { day: "Day 3", title: "Blue City Jodhpur", description: "Explore Mehrangarh Fort and the bustling Sardar Market. Evening at leisure near Jaswant Thada." },
      { day: "Day 4-5", title: "Jaisalmer Desert Safari", description: "Camel safari in Sam Sand Dunes and stay in luxury desert camps with folk performances." },
      { day: "Day 6-7", title: "Lake City Udaipur", description: "Boat ride on Lake Pichola and visit the stunning City Palace and Saheliyon-ki-Bari." }
    ],
    faqs: [
      { question: "What is the best time to visit Rajasthan?", answer: "The ideal time is from October to March when the weather is pleasant for sightseeing and desert safaris." },
      { question: "Are vegetarian food options available?", answer: "Rajasthan is a paradise for vegetarians. Traditional Rajasthani cuisine is predominantly vegetarian and highly flavorful." },
      { question: "What should I pack for a Rajasthan trip?", answer: "Carry light cotton clothes for the day and a light jacket for the evenings, as desert temperatures can drop at night." }
    ]
  },
  {
    id: 8,
    name: "Kerala Backwaters",
    country: "India",
    state: "Kerala",
    city: "Kochi, Munnar, Thekkady, Alleppey",
    type: "Domestic",
    region: "South Asia",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800",
    category: "Tropical",
    price: "₹38,200",
    rating: 4.8,
    description: "God's Own Country - a paradise of palm-fringed backwaters and spice plantations.",
    longDescription: "Discover why Kerala is called 'God's Own Country' on this peaceful exploration of the southern coast. From the misty tea gardens of Munnar to the tropical canal networks of Alleppey, this journey is designed for relaxation and rejuvenation. Stay on a traditional kettuvallam (houseboat), breathe in the scent of fresh spices, and witness the ancient art form of Kathakali in its birthplace.",
    services: ["Premium Houseboat Stay", "Ayurvedic Spa Session", "Spice Plantation Walks", "Backwater Cruising", "Tea Museum Entry Fee"],
    itinerary: [
      { day: "Day 1", title: "Kochi Arrival", description: "Fort Kochi sightseeing, Chinese Fishing Nets, and Kathakali performance in the evening." },
      { day: "Day 2-3", title: "Munnar Hills", description: "Tea plantation tours, Eravikulam National Park, and Mattupetty Dam. Evening at Mattupetty Lake." },
      { day: "Day 4", title: "Thekkady Wildlife", description: "Periyar Wildlife Sanctuary boat safari, spice garden visit, and elephant interaction programs." },
      { day: "Day 5", title: "Alleppey Houseboat", description: "Traditional overnight cruise through the serene backwaters with local Keralite cuisine." }
    ],
    faqs: [
      { question: "Is a houseboat stay safe for families?", answer: "Yes, our houseboats are family-friendly, well-maintained, and equipped with safety gear and experienced crew members." },
      { question: "When is the monsoon season in Kerala?", answer: "The main monsoon hits from June to August, while the 'retreating' monsoon occurs in October and November." },
      { question: "What language is spoken in Kerala?", answer: "Malayalam is the local language, but English and Hindi are widely understood in tourist areas." }
    ]
  },
  {
    id: 9,
    name: "Leh Ladakh Adventure",
    country: "India",
    state: "Ladakh",
    city: "Leh, Nubra Valley, Pangong Lake",
    type: "Domestic",
    region: "South Asia",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=800",
    category: "Adventure",
    price: "₹52,000",
    rating: 5.0,
    description: "The land of high passes, crystal clear lakes, and ancient Buddhist monasteries.",
    longDescription: "Ladakh is like no other place on Earth. Our adventure tour takes you across the world's highest motorable passes to reach pristine high-altitude lakes and hidden valleys. You'll stay in boutique camps under the clearest night skies, visit millenia-old monasteries perched on jagged cliffs, and experience the unique Indo-Tibetan culture of the 'Little Tibet'.",
    services: ["Oxygen Backup & First Aid", "Luxury Tented Camps", "Inner Line Permits", "Motorcycle/SUV Options", "Monastery Entry Fees"],
    itinerary: [
      { day: "Day 1-2", title: "Leh Acclimatization", description: "Mandatory rest for acclimatization. Local sightseeing of Shanti Stupa, Leh Palace, and Magnetic Hill." },
      { day: "Day 3", title: "Nubra Valley via Khardung La", description: "Drive through the world's highest motorable pass to Hunder sand dunes and see double-humped camels." },
      { day: "Day 4", title: "Pangong Lake", description: "Experience the high-altitude lake that changes colors. Stay in luxury fixed tents near the lake." },
      { day: "Day 5-6", title: "Monastery Tour & Departure", description: "Visit Hemis, Thiksey, and Shey monasteries. Shopping at Leh market before departure." }
    ],
    faqs: [
      { question: "Is altitude sickness common in Ladakh?", answer: "It can happen due to high elevation. We mandate a 48-hour acclimatization period in Leh to ensure your safety and comfort." },
      { question: "What permits are needed for Ladakh?", answer: "Inner Line Permits (ILP) are required for domestic and international travelers visiting protected areas like Nubra and Pangong." },
      { question: "Can I find vegetarian food in Ladakh?", answer: "Yes, local Ladakhi food like Thukpa and Momos have delicious veg versions, and Indian/Continental food is easily available." }
    ]
  },
  {
    id: 11,
    name: "Golden Goa Getaway",
    country: "India",
    state: "Goa",
    city: "North Goa, South Goa, Old Goa",
    type: "Domestic",
    region: "South Asia",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800",
    category: "Coastal",
    price: "₹24,999",
    rating: 4.7,
    description: "Sunkissed beaches, vibrant nightlife, and Portuguese inheritance.",
    longDescription: "Experience the ultimate beach holiday in Goa. From the serene beaches of South Goa to the lively parties of the North, this trip captures the essence of India's favorite vacation spot. Explore historic churches, indulge in spicy Konkani cuisine, and relax by the Arabian Sea.",
    services: ["Luxury Beach Resort", "North & South Goa Tours", "Airport Transfers", "Scuba Diving Experience"],
    itinerary: [
      { day: "Day 1", title: "Arrival & Beach Relaxation", description: "Check-in and evening at the nearby beach." },
      { day: "Day 2", title: "North Goa Sightseeing", description: "Fort Aguada, Calangute, and Baga beaches." },
      { day: "Day 3", title: "South Goa & Old Goa", description: "Basilica of Bom Jesus and Miramar beach." },
      { day: "Day 4", title: "Self Exploration & Departure", description: "Free time for shopping before departure." }
    ],
    faqs: [
      { question: "Which part of Goa is better for families?", answer: "South Goa is generally quieter and preferred by families seeking relaxation, while North Goa is best for nightlife and shopping." },
      { question: "Is Scuba Diving safe in Goa?", answer: "We partner with certified PADI instructors to ensure a safe and memorable diving experience at Grand Island." },
      { question: "What is the best way to travel locally in Goa?", answer: "Renting a scooter or a self-drive car is popular, but we can also provide a private car with a driver for your convenience." }
    ]
  },
  {
    id: 12,
    name: "Snowy Shimla & Manali",
    country: "India",
    state: "Himachal Pradesh",
    city: "Shimla, Manali, Solang Valley",
    type: "Domestic",
    region: "South Asia",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800",
    category: "Adventure",
    price: "₹32,500",
    rating: 4.6,
    description: "Escape to the Himalayas for breathtaking views and cool mountain air.",
    longDescription: "A classic Himalayan circuit. Discover the colonial charm of Shimla and the adventurous spirit of Manali. Traverse through the Atal Tunnel, visit Solang Valley, and enjoy the pristine beauty of the Beas River.",
    services: ["Cozy Mountain Cottages", "Rohtang Pass Tour", "Local Sightseeing", "Honeymoon Specials"],
    itinerary: [
      { day: "Day 1-2", title: "Shimla Exploration", description: "The Ridge, Mall Road, and Jakhu Temple." },
      { day: "Day 3", title: "Transfer to Manali", description: "Scenic drive through Kullu Valley." },
      { day: "Day 4-5", title: "Manali Adventure", description: "Solang Valley, Hadimba Temple, and Vashisht Hot Springs." },
      { day: "Day 6", title: "Departure", description: "Transfer to Chandigarh/Delhi." }
    ],
    faqs: [
      { question: "When can we see snow in Manali?", answer: "Snow is most common from December to February. Rohtang Pass usually has snow for a longer period." },
      { question: "Are the roads safe during winter?", answer: "Our experienced mountain drivers ensure safe travel, but we monitor weather conditions closely to avoid risky commutes during heavy snowfall." },
      { question: "What adventure activities are available in Manali?", answer: "You can enjoy paragliding, river rafting (seasonal), zorbing, and skiing in the Solang Valley." }
    ]
  },
  {
    id: 10,
    name: "Dubai Skyline & Desert",
    country: "UAE",
    type: "International",
    region: "Middle East",
    regionId: "middle-east",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
    category: "Metropolitan",
    price: "₹85,000",
    rating: 4.8,
    description: "Experience the glitz of Dubai from the Burj Khalifa to camel treks in the desert.",
    longDescription: "Dubai is a city of superlatives. Experience the world's tallest building, the most luxurious hotels, and heart-pounding adventures in the Sam Desert. Our Dubai package combines futuristic architecture with traditional Arabian hospitality, offering everything from high-end shopping to authentic bedouin experiences.",
    services: ["Burj Khalifa Top Entry", "Desert Safari with Dinner", "Luxury City Transfers", "Guided Shopping Tour", "Dhow Cruise Dinner"],
    itinerary: [
      { day: "Day 1", title: "Arrival & Dhow Cruise", description: "Arrive in Dubai and enjoy a relaxing dinner cruise on the Creek or Marina." },
      { day: "Day 2", title: "Modern Dubai & Burj Khalifa", description: "Visit Dubai Mall, Burj Khalifa (124th floor), and watch the fountain show." },
      { day: "Day 3", title: "Desert Safari", description: "Dune bashing, camel riding, henna painting, and BBQ dinner with belly dance." },
      { day: "Day 4", title: "Old Dubai & Gold Souk", description: "Explore Al Fahidi district, ride an abra across the Creek, and shop at the Gold Souk." }
    ],
    faqs: [
      { question: "Do Indians need a visa for Dubai?", answer: "Yes, Indians need a pre-arranged visa. We can assist with the application process for 30-day or 60-day tourist visas." },
      { question: "What should I wear in Dubai?", answer: "Dubai is cosmopolitan, but modest attire is recommended in public places like malls and traditional districts out of respect for local culture." },
      { question: "Is alcohol available in Dubai?", answer: "Alcohol is served in licensed restaurants, bars, and hotels. It's important to respect local consumption laws." }
    ]
  },
  {
    id: 2,
    name: "Santorini Escape",
    country: "Greece",
    type: "International",
    region: "Europe",
    regionId: "europe",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800",
    category: "Coastal",
    price: "₹1,45,000",
    rating: 4.9,
    description: "Famous for its stunning sunsets, white-washed buildings, and crystal-clear Aegean waters.",
    longDescription: "Indulge in the ultimate romantic getaway on the most iconic of the Greek Islands. Santorini's dramatic caldera views and volcanic beaches set the stage for an unforgettable escape. Our package focuses on the finer details—sunset cruises, private wine tastings, and premium suites with private plunge pools, ensuring your Mediterranean holiday is nothing short of legendary.",
    services: ["Boutique Caldera View Suites", "Private Wine Tasting", "Sunset Catamaran Cruise", "Inter-island Ferry Tickets", "Gourmet Breakfast Daily"],
    itinerary: [
      { day: "Day 1", title: "Fira Arrival", description: "Cliffside walk from Fira to Imerovigli and sunset dinner with caldera views." },
      { day: "Day 2", title: "Oia Exploration", description: "The iconic blue domes, Ammoudi Bay, and world-famous sunset photography." },
      { day: "Day 3", title: "Volcano & Hot Springs", description: "Boat tour to Neave Kameni volcano and Palea Kameni hot springs for a mud bath." },
      { day: "Day 4", title: "Beach Hopping & Winery", description: "Visit Red Beach, Black Sand Beach, and enjoy a tasting at Santo Wines." }
    ],
    faqs: [
      { question: "How to reach Santorini from Athens?", answer: "You can take a high-speed ferry (about 5 hours) or a short 45-minute domestic flight. We usually recommend flying to save time." },
      { question: "Is it a good destination for vegetarian Indians?", answer: "Greek cuisine uses lots of fresh vegetables, cheese, and olives. You'll find delicious options like Greek salad, Spanakopita, and stuffed vine leaves." },
      { question: "What is the best month for a Santorini holiday?", answer: "May, June, and September are ideal with pleasant weather and fewer crowds than the peak July-August season." }
    ]
  },
  {
    id: 3,
    name: "Kyoto Heritage",
    country: "Japan",
    type: "International",
    region: "East Asia",
    regionId: "east-asia",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    category: "Cultural",
    price: "₹1,85,900",
    rating: 4.8,
    description: "The heart of traditional Japan, filled with temples, gardens, and imperial palaces.",
    longDescription: "Step back in time to the era of Shoguns and Samurai in Kyoto. This cultural journey explores the spiritual heart of Japan, featuring private audiences with tea masters, visits to centuries-old Zen gardens, and stays in luxury Ryokans. Beyond the temples, we'll dive into Kyoto's refined culinary scene and its vibrant, living traditions in the Gion district.",
    services: ["Luxury Ryokan Experience", "Private Tea Ceremony", "English Speaking Expert Guide", "Luggage Forwarding Service", "UNESCO Site Entry Permits"],
    itinerary: [
      { day: "Day 1", title: "Gion District", description: "Traditional tea ceremony, Geisha spotting in the sunset, and Kaiseki dinner." },
      { day: "Day 2", title: "Arashiyama Bamboo Grove", description: "Walk through the bamboo forest, visit Tenryu-ji Temple, and Togetsukyo Bridge." },
      { day: "Day 3", title: "Fushimi Inari-taisha & Nara", description: "Hike through thousands of vermilion torii gates followed by a trip to Nara Deer Park." },
      { day: "Day 4", title: "Kinkaku-ji (Golden Pavilion)", description: "Marvel at the Zen temple covered in gold leaf and Ryoan-ji rock garden." }
    ],
    faqs: [
      { question: "Is Japan expensive for Indian travelers?", answer: "While it has a reputation for being pricey, careful planning and local dining options make it manageable. Our package covers most major expenses." },
      { question: "Do we need to tip in Japan?", answer: "Tipping is not customary in Japan and can sometimes be seen as impolite. Service is already included in most bills." },
      { question: "What is the best way to get around Japan?", answer: "The Shinkansen (bullet train) is the best way to travel between cities. Within Kyoto, buses and subways are very efficient." }
    ]
  },
  {
    id: 4,
    name: "Swiss Alpine Magic",
    country: "Switzerland",
    type: "International",
    region: "Europe",
    regionId: "europe",
    image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800",
    category: "Adventure",
    price: "₹2,25,000",
    rating: 5.0,
    description: "A paradise for hikers and skiers, offering some of the most dramatic mountain scenery in Europe.",
    longDescription: "Experience the ultimate Alpine luxury in the heart of Switzerland. This journey combines the thrill of high-altitude adventure with the comfort of world-class Swiss engineering and hospitality. You'll travel on panoramic express trains, stand atop glaciers 3,000 meters above sea level, and relax in crystal-clear lakefront towns that feel like they've stepped out of a fairytale.",
    services: ["Swiss Travel Pass (First Class)", "Top of Europe Excursion", "Lakefront Luxury Hotels", "Glacier Express Booking", "Mountain Peak Entry Fees"],
    itinerary: [
      { day: "Day 1-2", title: "Lucerne & Mount Pilatus", description: "Boat trip on Lake Lucerne and world's steepest cogwheel railway to the summit." },
      { day: "Day 3-4", title: "Interlaken & Jungfraujoch", description: "Paragliding, Jungfraujoch (Top of Europe) train journey through the Eiger glacier." },
      { day: "Day 5", title: "Zermatt & Matterhorn", description: "Experience the car-free village and the iconic pyramid peak via Gornergrat railway." }
    ],
    faqs: [
      { question: "Is the Swiss Travel Pass worth it?", answer: "Absolutely. It offers unlimited travel on trains, buses, and boats, plus free entry to over 500 museums across Switzerland." },
      { question: "Can we find Indian vegetarian food in Switzerland?", answer: "Yes, cities like Lucerne and Interlaken have several popular Indian restaurants, and most Swiss hotels offer veg-friendly breakfast." },
      { question: "What should we pack for high-altitude mountain peaks?", answer: "Dress in layers. Even in summer, it can be very cold at the top of Jungfraujoch or Mt. Titlis." }
    ]
  },
  {
    id: 5,
    name: "Bali Bliss",
    country: "Indonesia",
    type: "International",
    region: "Southeast Asia",
    regionId: "southeast-asia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    category: "Tropical",
    price: "₹65,000",
    rating: 4.7,
    description: "Known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.",
    longDescription: "Bali is more than just a place; it's a mood, an aspiration, and a tropical state of mind. Our 'Bali Bliss' tour is designed to showcase the diverse soul of the Island of the Gods. Balance the spiritual serenity of Ubud's jungles with the vibrant energy of Seminyak's beaches, while exploring ancient water temples and soaring above iconic rice terraces on a jungle swing.",
    services: ["Private Villa with Pool", "Daily Private Driver", "Jungle Swing Passes", "Guided Volcano Trek", "Balinese Cooking Class"],
    itinerary: [
       { day: "Day 1-2", title: "Ubud Culture & Nature", description: "Monkey Forest, Tegalalang Rice Terraces, and Tegenungan Waterfall." },
       { day: "Day 3", title: "Mount Batur Sunrise", description: "Early morning trek to the volcano for an unforgettable sunrise followed by hot springs." },
       { day: "Day 4-5", title: "Seminyak Beach & Temple", description: "Uluwatu Temple sunset, water sports at Tanjung Benoa, and Seminyak beach clubs." }
    ],
    faqs: [
      { question: "What is the best way to get around Bali?", answer: "We provide a private car with a dedicated local driver for your entire stay, which is the most comfortable and flexible way to explore." },
      { question: "Are the monkeys in Ubud dangerous?", answer: "They are generally safe if you don't feed them or carry loose items. We provide guidance on how to interact with them safely." },
      { question: "Is Bali suitable for vegetarians?", answer: "Yes, Balinese cuisine features many plant-based dishes like Gado-Gado and Tempeh, and most restaurants cater to vegetarian tourists." }
    ]
  },
  {
    id: 15,
    name: "Amazing Thailand",
    country: "Thailand",
    type: "International",
    region: "Southeast Asia",
    regionId: "southeast-asia",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800",
    category: "Coastal",
    price: "₹45,000",
    rating: 4.8,
    description: "Experience the vibrant city life of Bangkok and the beautiful beaches of Pattaya.",
    longDescription: "Thailand is a land of smiles, offering a mix of modern cities and tropical paradises. This 6-day tour takes you through the bustling markets of Bangkok and the fun-filled beaches of Pattaya. Enjoy a coral island tour, visit the majestic Grand Palace, and witness the unique floating markets.",
    services: ["4-Star Hotel Stays", "Coral Island Tour with Lunch", "Bangkok City Tour", "Airport Transfers", "Indian Dinners Included"],
    itinerary: [
      { day: "Day 1", title: "Bangkok Arrival & Pattaya Transfer", description: "Arrive in Bangkok and drive to Pattaya. Evening at the Alcazar Show." },
      { day: "Day 2", title: "Coral Island Tour", description: "Speedboat ride to Coral Island for water sports and a delicious lunch." },
      { day: "Day 3", title: "Pattaya to Bangkok", description: "Transfer back to Bangkok. Visit the Golden Buddha and Marble Temple." },
      { day: "Day 4", title: "Safari World & Marine Park", description: "Full day of wildlife encounters and spectacular animal shows." },
      { day: "Day 5-6", title: "Free Day & Departure", description: "Shopping at MBK Center or Siam Paragon before your flight home." }
    ],
    faqs: [
      { question: "Is visa on arrival available for Indians in Thailand?", answer: "Yes, currently Thailand offers visa on arrival for Indian passport holders. Please check the latest guidelines for fee waivers." },
      { question: "What is the currency of Thailand?", answer: "The currency is the Thai Baht (THB)." },
      { question: "Can we get Indian food in Pattaya?", answer: "Yes, Pattaya has a wide range of Indian restaurants along Beach Road and Walking Street." }
    ]
  },
  {
    id: 16,
    name: "Maldives Magic",
    country: "Maldives",
    type: "International",
    region: "South Asia",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800",
    category: "Tropical",
    price: "₹85,000",
    rating: 4.9,
    description: "Indulge in an overwater villa experience in the turquoise waters of the Maldives.",
    longDescription: "Escape to a world of luxury and tranquility. Spend 4 nights in an overwater villa or a beach bungalow on a private island resort. Enjoy world-class snorkeling, sunset cruises, and spa treatments. This is the ultimate destination for honeymooners and those seeking complete relaxation.",
    services: ["Luxury Island Resort Stay", "Speedboat/Seaplane Transfers", "All-Inclusive Meal Plan", "Snorkeling Gear Provided", "Romantic Sunset Cruise"],
    itinerary: [
      { day: "Day 1", title: "Arrival & Island Transfer", description: "Welcome at Male airport and transfer to your resort via speedboat. Sunset dinner by the beach." },
      { day: "Day 2", title: "Water Sports & Relaxation", description: "Day at leisure. Enjoy snorkeling, kayaking, or simply relax by your private pool." },
      { day: "Day 3", title: "Island Hopping & Dolphin Watch", description: "Morning boat trip to explore nearby islands and a sunset dolphin watching cruise." },
      { day: "Day 4", title: "Spa & Sandbank Picnic", description: "Indulge in a relaxing Balinese massage and enjoy a private picnic on a secluded sandbank." },
      { day: "Day 5", title: "Last Dip & Departure", description: "Enjoy a final swim before your transfer back to Male for your flight home." }
    ],
    faqs: [
      { question: "Do Indians need a visa for Maldives?", answer: "Indians get a free 30-day visa on arrival in the Maldives." },
      { question: "Is the Maldives suitable for vegetarians?", answer: "Most luxury resorts offer extensive international buffets with plenty of vegetarian and even vegan options." },
      { question: "What is the best way to travel between islands?", answer: "Speedboats are most common for nearby islands, while seaplanes are used for more distant atolls." }
    ]
  },
  {
    id: 17,
    name: "Singapore & Malaysia Highlights",
    country: "Singapore/Malaysia",
    type: "International",
    region: "Southeast Asia",
    regionId: "southeast-asia",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=800",
    category: "Metropolitan",
    price: "₹95,000",
    rating: 4.7,
    description: "Discover the futuristic city of Singapore and the cultural mix of Malaysia.",
    longDescription: "This dual-nation tour combines the sparkling efficiency of Singapore with the scenic beauty and cultural diversity of Malaysia. Explore Sentosa Island, Universal Studios, and the Gardens by the Bay in Singapore, then head to the Genting Highlands and the iconic Petronas Towers in Kuala Lumpur.",
    services: ["Centrally Located Hotels", "Universal Studios Tickets", "Batu Caves Visit", "Genting Cable Car Ride", "Night Safari Adventure"],
    itinerary: [
      { day: "Day 1-2", title: "Singapore Icons", description: "Arrival, Night Safari, and a city tour including Merlion Park and Gardens by the Bay." },
      { day: "Day 3", title: "Sentosa Island & Universal Studios", description: "Full day of fun at Universal Studios and evening Wing of Time show at Sentosa." },
      { day: "Day 4", title: "Singapore to Kuala Lumpur", description: "Coach or flight transfer to KL. Visit the King's Palace and Independence Square." },
      { day: "Day 5", title: "Genting Highlands & Batu Caves", description: "Day trip to Genting via the Skyway cable car, with a stop at the famous Batu Caves." },
      { day: "Day 6-7", title: "KL City Tour & Departure", description: "Visit the Petronas Twin Towers and shop at Bukit Bintang before departure." }
    ],
    faqs: [
      { question: "Can we travel from Singapore to Malaysia by road?", answer: "Yes, many travelers take comfortable air-conditioned coaches across the border. It takes about 5-6 hours." },
      { question: "Is the Singapore visa separate from the Malaysian visa?", answer: "Yes, Indian citizens usually need separate E-visas for both countries." },
      { question: "What is the best time for Sentosa Island?", answer: "Sentosa is great year-round, but it's best to reach early in the morning to avoid long queues at Universal Studios." }
    ]
  },
  {
    id: 18,
    name: "Classic Europe Panorama",
    country: "France/Switzerland",
    type: "International",
    region: "Europe",
    regionId: "europe",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    category: "Cultural",
    price: "₹2,65,000",
    rating: 4.9,
    description: "The dream trip through romantic Paris and the breathtaking Swiss Alps.",
    longDescription: "Experience the best of Europe with this classic duo. Start in Paris, the city of lights, exploring the Eiffel Tower and the Louvre. Then, travel to Switzerland to witness the majestic mountains of Lucerne and Interlaken. This tour offers a perfect balance of heritage, romance, and natural wonder.",
    services: ["Premium Europe Rail Passes", "Eiffel Tower 2nd Level Entry", "Seine River Cruise", "Mt. Titlis Cable Car", "Indian Meals at Top Restaurants"],
    itinerary: [
      { day: "Day 1-2", title: "Romantic Paris", description: "Arrival, evening Seine river cruise, and city tour including the Eiffel Tower and Arc de Triomphe." },
      { day: "Day 3", title: "Paris to Lucerne", description: "High-speed TGV train to Switzerland. Enjoy a relaxing evening by Lake Lucerne." },
      { day: "Day 4", title: "Mount Titlis Adventure", description: "Ride the world's first revolving cable car to the snow-covered peak of Mt. Titlis." },
      { day: "Day 5", title: "Scenic Interlaken", description: "Visit the famous resort town nestled between Lake Thun and Lake Brienz." },
      { day: "Day 6-7", title: "Zurich Exploration & Departure", description: "City walk in Zurich and shopping at Bahnhofstrasse before flying home." }
    ],
    faqs: [
      { question: "What is the Schengen Visa?", answer: "A Schengen visa allows you to travel freely between most European countries, including France and Switzerland, with one single permit." },
      { question: "Which currency is used in Paris and Switzerland?", answer: "France uses the Euro (€), while Switzerland uses the Swiss Franc (CHF). Both are widely accepted in tourist areas." },
      { question: "Is the water safe to drink in Europe?", answer: "Yes, tap water in France and Switzerland is among the cleanest and safest in the world." }
    ]
  },
  {
    id: 19,
    name: "Australian East Coast Highlights",
    country: "Australia",
    type: "International",
    region: "Oceania",
    regionId: "oceania",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=800",
    category: "Coastal",
    price: "₹3,15,000",
    rating: 4.8,
    description: "Discover the iconic Opera House in Sydney and the penguins of Melbourne.",
    longDescription: "Explore the best of Australia's vibrant east coast cities. From the architectural marvel of the Sydney Opera House to the world-famous Great Ocean Road in Melbourne, this 10-day tour showcases the unique wildlife, stunning coastlines, and cosmopolitan lifestyle of the 'Land Down Under'.",
    services: ["Luxury City Center Hotels", "Sydney Opera House Tour", "Blue Mountains Excursion", "Great Ocean Road Drive", "Phillip Island Penguin Parade"],
    itinerary: [
      { day: "Day 1-3", title: "Spectacular Sydney", description: "Opera House, Bondi Beach, and a day trip to the stunning Blue Mountains." },
      { day: "Day 4-5", title: "Sydney to Gold Coast", description: "Fly to the Gold Coast. Enjoy Warner Bros. Movie World and Sea World." },
      { day: "Day 6-8", title: "Melbourne & Great Ocean Road", description: "Fly to Melbourne. Drive along one of the world's most scenic coastal roads to the 12 Apostles." },
      { day: "Day 9-10", title: "Phillip Island & Departure", description: "See the adorable Little Penguins at sunset before heading to the airport for your flight home." }
    ],
    faqs: [
      { question: "When is the best time to visit Australia?", answer: "Since Australia is in the Southern Hemisphere, its seasons are opposite to India. September to November and March to May are ideal." },
      { question: "Does Australia have an E-visa for Indians?", answer: "Yes, Indians can apply for a Visitor Visa (subclass 600) online." },
      { question: "Is Australian food spicy?", answer: "Australian cuisine is very diverse, but it's generally not as spicy as Indian food. However, you'll find plenty of Indian and Asian restaurants in major cities." }
    ]
  },
  {
    id: 20,
    name: "Gujarat Heritage & Wildlife",
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad, Statue of Unity, Gir, Dwarka, Somnath, Kutch",
    type: "Domestic",
    region: "West India",
    regionId: "west-india",
    image: "https://images.unsplash.com/photo-1659532800577-6531dc91563b?auto=format&fit=crop&q=80&w=1600",
    category: "Cultural",
    price: "₹35,000",
    rating: 4.8,
    description: "Explore the land of the Asiatic Lion, the Rann of Kutch, and ancient temples.",
    longDescription: "Gujarat is a treasure trove of heritage and natural wonders. From the white salt deserts of Kutch during Rann Utsav to the last refuge of the Asiatic Lion in Gir, this tour offers a complete Gujarati experience. Visit the Sabarmati Ashram, the Statue of Unity, and the magnificent Somnath and Dwarka temples.",
    services: ["Luxury Resorts", "Wildlife Safaris", "Heritage Walks", "Statue of Unity Entry", "Private AC Vehicles"],
    itinerary: [
      { day: "Day 1-2", title: "Ahmedabad & Statue of Unity", description: "Sabarmati Ashram, Adalaj Stepwell, and a day trip to the world's tallest statue." },
      { day: "Day 3-4", title: "Gir National Park", description: "Lion safari and exploration of the diverse wildlife in the Gir forest." },
      { day: "Day 5-6", title: "Dwarka & Somnath", description: "Spiritual journey to the holy temples along the Arabian Sea coast." },
      { day: "Day 7", title: "Rann of Kutch (Seasonal)", description: "Experience the White Desert and local handicrafts." }
    ],
    faqs: [
      { question: "When is the Rann Utsav?", answer: "The Rann Utsav usually takes place from November to February." },
      { question: "Is Gir open all year?", answer: "No, Gir National Park is typically closed for visitors from mid-June to mid-October during the monsoon." }
    ]
  },
  {
    id: 21,
    name: "Maharashtra - Caves & Coast",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai, Lonavala, Aurangabad, Ajanta, Ellora, Mahabaleshwar",
    type: "Domestic",
    region: "West India",
    regionId: "west-india",
    image: "https://images.unsplash.com/photo-1631774933370-d596a344e851?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹28,900",
    rating: 4.7,
    description: "Discover the Ajanta & Ellora caves and the scenic hills of Lonavala.",
    longDescription: "A journey through the heart of Maharashtra. Witness the architectural brilliance of the UNESCO World Heritage Ajanta and Ellora caves, explore the bustling city of Mumbai, and unwind in the lush green hills of Mahabaleshwar and Lonavala. This tour blends ancient history with breathtaking landscapes.",
    services: ["Cave Exploration Tours", "Hill Station Retreats", "Mumbai City Guide", "Private Luxury Car"],
    itinerary: [
      { day: "Day 1-2", title: "Mumbai & Lonavala", description: "Gateway of India, Marine Drive, and the scenic hill stations of Lonavala and Khandala." },
      { day: "Day 3-4", title: "Aurangabad - Ellora & Ajanta", description: "Deep dive into the 2000-year-old rock-cut caves and historical monuments." },
      { day: "Day 5", title: "Mahabaleshwar", description: "Strawberry farms and panoramic viewpoints in the Sahyadri mountains." }
    ],
    faqs: [
      { question: "How to reach Ajanta from Aurangabad?", answer: "Ajanta Caves are about 100km from Aurangabad, roughly a 2-3 hour drive." },
      { question: "What is the best time for Lonavala?", answer: "Monsoon (June-September) is beautiful, but October to March is best for overall sightseeing." }
    ]
  },
  {
    id: 22,
    name: "Golden Chariot - Pride of Karnataka",
    country: "India",
    state: "Karnataka",
    city: "Bengaluru, Bandipur, Mysuru, Chikkamagaluru, Hampi, Goa",
    type: "Luxury Train",
    region: "South India",
    regionId: "south-india",
    image: "https://www.goldenchariot.org/luxury-tourist-train-south-india/img/5.jpg",
    category: "Cultural",
    price: "₹1,85,000",
    rating: 4.9,
    description: "A luxury rail journey through Karnataka and Goa on IRCTC's Golden Chariot.",
    longDescription: "The Golden Chariot's Pride of Karnataka itinerary is a 5 nights / 6 days luxury rail journey operated by IRCTC that links wildlife, royal Mysuru heritage, Hoysala architecture, Hampi's UNESCO ruins, and Goa's colonial coast. It is designed as a South Indian luxury train experience centered on Karnataka, with curated off-train excursions and onboard hospitality throughout the route.",
    link: "/destinations/golden-chariot",
    services: ["Royal Suite Cabin", "All Meals Inclusive", "Guided Off-train Excursions", "Butler Service", "Cultural Performances Onboard"],
    itinerary: [
      { day: "Day 1", title: "Bengaluru Departure", description: "Board in Bengaluru for the Pride of Karnataka journey and settle into your cabin as the train rolls south." },
      { day: "Day 2", title: "Bandipur & Mysuru", description: "Morning game drive in Bandipur Tiger Reserve followed by Mysuru's royal heritage circuit, including the palace experience." },
      { day: "Day 3", title: "Halebidu & Chikkamagaluru", description: "Explore the Hoysala-era temple heritage of Halebidu and continue into the coffee country landscapes of Chikkamagaluru." },
      { day: "Day 4", title: "Hampi", description: "Spend the day among the UNESCO-listed Vijayanagara ruins of Hampi, including its iconic stone chariot and temple complexes." },
      { day: "Day 5", title: "Pattadakal, Aihole & Goa", description: "Discover the Chalukyan temple sites around Pattadakal and Aihole before the journey extends toward Goa." },
      { day: "Day 6", title: "Goa to Bengaluru", description: "Enjoy Goa's heritage ambience and the final onboard stretch before returning to Bengaluru." }
    ],
    faqs: [
      { question: "Is alcohol served on the train?", answer: "Yes. The Golden Chariot features an onboard bar and lounge as part of its luxury train experience." },
      { question: "Which route is this package based on?", answer: "This page is aligned to the current Pride of Karnataka itinerary: Bengaluru - Bandipur - Mysuru - Halebidu - Chikkamagaluru - Hampi - Pattadakal & Aihole - Goa - Bengaluru." }
    ]
  },
  {
    id: 23,
    name: "Palace on Wheels",
    country: "India",
    state: "Rajasthan",
    city: "Delhi, Jaipur, Sawai Madhopur, Chittorgarh, Udaipur, Jaisalmer, Jodhpur, Bharatpur, Agra",
    type: "Luxury Train",
    region: "North India",
    regionId: "north-india",
    image: "https://www.palaceonwheels.rajasthan.gov.in/public/admin/images/banners/82590695175755113167.jpg",
    category: "Cultural",
    price: "₹2,10,000",
    rating: 5.0,
    description: "India's original luxury heritage train across Rajasthan, Bharatpur, and Agra.",
    longDescription: "The Palace on Wheels is India's original luxury heritage train and follows a 7 nights / 8 days circuit beginning and ending in New Delhi. The official route covers Jaipur, Sawai Madhopur, Chittorgarh, Udaipur, Jaisalmer, Jodhpur, Bharatpur, and Agra, combining royal cities, wildlife, desert landscapes, birding, and the Taj Mahal in one classic luxury rail journey.",
    link: "/destinations/palace-on-wheels",
    services: ["Personal Khidmatgar (Attendant)", "International & Indian Cuisines", "Sightseeing in Luxury Coaches", "Regal Cabin Decor", "Gala Dinners"],
    itinerary: [
      { day: "Day 1", title: "New Delhi Departure", description: "Board at Safdarjung Railway Station in New Delhi after the traditional Palace on Wheels welcome ceremony." },
      { day: "Day 2", title: "Jaipur", description: "Explore Jaipur's royal landmarks, with highlights centered on Hawa Mahal, forts, and the Pink City's courtly heritage." },
      { day: "Day 3", title: "Sawai Madhopur & Chittorgarh", description: "Begin with Ranthambore's wildlife atmosphere at Sawai Madhopur, then continue to the dramatic fort setting of Chittorgarh." },
      { day: "Day 4", title: "Udaipur", description: "Experience Udaipur's lake-city elegance, including the signature Lake Pichola setting and palace culture." },
      { day: "Day 5", title: "Jaisalmer", description: "Head deep into the Thar for Jaisalmer's golden fort, havelis, and desert cultural experiences." },
      { day: "Day 6", title: "Jodhpur", description: "Discover Jodhpur's imposing fort architecture and blue-city heritage before rejoining the train." },
      { day: "Day 7", title: "Bharatpur & Agra", description: "Continue through Bharatpur and then Agra for the Mughal finale, including the Taj Mahal leg of the journey." },
      { day: "Day 8", title: "Return to New Delhi", description: "Conclude the Palace on Wheels journey back in New Delhi after breakfast and disembarkation." }
    ],
    faqs: [
      { question: "When does the train operate?", answer: "The Palace on Wheels runs seasonally, and departures should be checked against the official schedule before booking." },
      { question: "Which cities are covered on the official route?", answer: "The published route is New Delhi - Jaipur - Sawai Madhopur - Chittorgarh - Udaipur - Jaisalmer - Jodhpur - Bharatpur - Agra - New Delhi." }
    ]
  },
  {
    id: 24,
    name: "Nepal Peaks & Pagodas",
    country: "Nepal",
    type: "International",
    region: "South Asia",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1636947112949-8fa88a394e65?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹42,500",
    rating: 4.8,
    description: "Trek through the Himalayas and explore the medieval squares of Kathmandu.",
    longDescription: "Nepal is the ultimate playground for adventure seekers. This 7-day journey takes you from the bustling, spiritual streets of Kathmandu to the tranquil lakeside of Pokhara. Experience breathtaking views of the Annapurna range, witness the sunrise over the Himalayas, and explore the ancient stupas of Pashupatinath and Boudhanath.",
    services: ["Luxury Boutique Stays", "Himalayan Sunrise Tour", "Pokhara Boat Ride", "Private Kathmandu Guided Tour", "Nagarkot Sightseeing"],
    itinerary: [
      { day: "Day 1-2", title: "Kathmandu Valley", description: "Visit UNESCO World Heritage sites including Durbar Square, Syambhunath, and Pashupatinath Temple." },
      { day: "Day 3-4", title: "Pokhara - Lake City", description: "Scenic drive to Pokhara. Enjoy Phewa Lake boating and the Peace Pagoda hike with Annapurna views." },
      { day: "Day 5", title: "Sarangkot Sunrise", description: "Early morning hike for a 360-degree view of the Himalayas, followed by David Falls and Gupteshwor Cave." },
      { day: "Day 6-7", title: "Nagarkot & Departure", description: "Overnight in Nagarkot for a final mountain sunset/sunrise before flying out." }
    ],
    faqs: [
      { question: "Do Indians need a visa for Nepal?", answer: "No, Indian citizens do not require a visa to enter Nepal. A valid Voter ID or Passport is sufficient." },
      { question: "What is the best time for trekking?", answer: "October to December and March to May offer the clearest skies and best mountain views." },
      { question: "Is altitude sickness a concern?", answer: "For the cities of Kathmandu and Pokhara, it is rare. However, if you opt for high-altitude treks, we ensure proper acclimatization schedules." }
    ]
  },
  {
    id: 25,
    name: "Bhutan - The Last Shangri-La",
    country: "Bhutan",
    type: "International",
    region: "South Asia",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1742539327388-3e15db12390a?auto=format&fit=crop&q=80&w=1600",
    category: "Cultural",
    price: "₹58,900",
    rating: 4.9,
    description: "A spiritual journey to the Kingdom of Happiness, majestic dzongs, and the Tiger's Nest.",
    longDescription: "Bhutan is a carbon-negative kingdom that values happiness over GDP. Journey through its pristine valleys, visit the imposing Punakha Dzong, and hike to the legendary Tiger's Nest (Paro Taktsang) monastery perched on a vertical cliff. Experience a way of life that has remained untouched for centuries.",
    services: ["Bhutanese Traditional Stays", "Sustainable Tourism Fee Included", "Private Guide & Driver", "Tiger's Nest Hiking Permit", "Archery Demonstration"],
    itinerary: [
      { day: "Day 1-2", title: "Thimphu - The Modern Capital", description: "Visit the Buddha Dordenma, Memorial Chorten, and the Motithang Takin Preserve." },
      { day: "Day 3-4", title: "Punakha Valley", description: "Drive via Dochula Pass (108 stupas) to the stunning Punakha Dzong at the confluence of two rivers." },
      { day: "Day 5-6", title: "Paro & Tiger's Nest", description: "The highlight of the trip: a spiritual hike to Taktsang Monastery. Visit Kyichu Lhakhang temple." },
      { day: "Day 7", title: "Farewell Bhutan", description: "Transfer to Paro international airport for your flight back home." }
    ],
    faqs: [
      { question: "What is the SDF (Sustainable Development Fee)?", answer: "The SDF is a mandatory fee that supports Bhutan's education, healthcare, and conservation. It is included in our package." },
      { question: "How hard is the Tiger's Nest hike?", answer: "It is a 4-6 hour round trip. It is moderately challenging but can be done by anyone with basic fitness. Mules are available for the first half." },
      { question: "Is Indian currency used in Bhutan?", answer: "Yes, Indian Rupee is exchangeable 1:1 with the Bhutanese Ngultrum, but ?500 and ?2000 notes are often restricted." }
    ]
  },
  {
    id: 26,
    name: "Konkan Coastal Escape",
    country: "India",
    state: "Maharashtra",
    city: "Malvan, Sindhudurg, Tarkarli, Ganpatipule, Ratnagiri",
    type: "Domestic",
    region: "West India",
    regionId: "west-india",
    image: "https://images.unsplash.com/photo-1717354482498-2a9d0bddd6af?auto=format&fit=crop&q=80&w=1600",
    category: "Coastal",
    price: "₹22,500",
    rating: 4.6,
    description: "Explore the pristine white sand beaches and historic sea forts of Maharashtra's Konkan coast.",
    longDescription: "Escape the city for the untouched beauty of the Konkan. From the white sands of Tarkarli to the historic Sindhudurg sea fort, this tour is a blend of maritime history and tropical relaxation. Indulge in authentic Malvani seafood, enjoy water sports, and witness the unique culture of coastal Maharashtra.",
    services: ["Beachfront Homestays", "Malvani Culinary Tour", "Scuba Diving in Tarkarli", "Sea Fort Entry Fees", "Private AC Transport"],
    itinerary: [
      { day: "Day 1-2", title: "Malvan & Sindhudurg", description: "Visit the historic Sindhudurg Fort and relax on the pristine beaches of Malvan. Evening sunset at Rock Garden." },
      { day: "Day 3", title: "Tarkarli Water Sports", description: "Scuba diving and snorkeling in the clear waters of Tarkarli, followed by a backwater boat ride." },
      { day: "Day 4", title: "Ganpatipule Spiritual Retreat", description: "Visit the famous beachside Ganpati temple and explore the local cashew and mango plantations." },
      { day: "Day 5", title: "Ratnagiri Exploration & Return", description: "Visit Ratnagiri Fort and Thibaw Palace before heading back." }
    ],
    faqs: [
      { question: "When is the best time for Scuba in Konkan?", answer: "The best window for clear water is from November to early May." },
      { question: "Is the food very spicy?", answer: "Malvani cuisine is famous for its heat and use of coconut/kokum. We can request milder versions at our partner homestays." },
      { question: "How do we reach Tarkarli?", answer: "The nearest major airport is Manohar International Airport (MOPA) in North Goa, about 2-3 hours away." }
    ]
  },
  {
    id: 27,
    name: "Maldives - Island Paradise",
    country: "Maldives",
    type: "International",
    region: "Indian Ocean",
    regionId: "indian-ocean",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800",
    category: "Tropical",
    price: "₹85,000",
    rating: 5.0,
    description: "Experience ultimate luxury in overwater villas and pristine turquoise lagoons.",
    longDescription: "The Maldives is the epitome of tropical luxury. Crystal clear waters, vibrant coral reefs, and world-class resorts await you. Whether you're looking for a romantic honeymoon or a serene family getaway, our curated selection of island resorts offers the perfect sanctuary. Indulge in sunset cruises, private beach dinners, and world-renowned diving experiences.",
    services: ["Luxury Overwater Villa", "All-Inclusive Dining", "Seaplane Transfers", "Snorkeling Equipment", "Sunset Cruise"],
    itinerary: [
      { day: "Day 1", title: "Arrival & Seaplane Transfer", description: "Arrive at Malé International Airport and take a scenic seaplane or speedboat to your resort island." },
      { day: "Day 2-3", title: "Island Leisure & Snorkeling", description: "Explore the house reef, relax on the white sand beaches, and enjoy resort activities." },
      { day: "Day 4", title: "Sunset Dolphin Cruise", description: "A magical evening out on the water to spot dolphins and witness spectacular Indian Ocean sunsets." },
      { day: "Day 5", title: "Spa & Relaxation", description: "Indulge in a signature spa treatment or try local 'Boduberu' music performances in the evening." },
      { day: "Day 6", title: "Farewell Maldives", description: "One final breakfast overlooking the lagoon before departing for Malé." }
    ],
    faqs: [
      { question: "Is a visa required for Indians?", answer: "Maldives offers a free 30-day visa on arrival for Indian passport holders." },
      { question: "What is the best time to visit?", answer: "The dry season from November to April is the peak time, offering the best weather and visibility for snorkeling." },
      { question: "Is food widely available for vegetarians?", answer: "Yes, most luxury resorts in the Maldives are very well-equipped to handle vegetarian, vegan, and even Jain food requests." }
    ]
  },
  {
    id: 28,
    name: "Jaipur, Udaipur & Jodhpur Royal Cities",
    country: "India",
    state: "Rajasthan",
    city: "Jaipur, Udaipur, Jodhpur",
    type: "Domestic",
    region: "Rajasthan",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1000",
    category: "Cultural",
    price: "₹39,900",
    rating: 4.9,
    description: "A royal Rajasthan circuit covering Jaipur forts, Udaipur lakes, and Jodhpur blue-city heritage.",
    longDescription: "This Rajasthan city circuit is designed for travelers who want royal architecture without rushing across the entire desert state. Begin with Jaipur's palace-and-fort trail, continue to Jodhpur for Mehrangarh and blue-city lanes, and end in Udaipur with lakeside evenings, palace museums, and curated local dining. It works beautifully for families, couples, and first-time domestic luxury travelers.",
    services: ["Heritage Hotel Stays", "Private Fort Guides", "Lake Pichola Boat Ride", "Rajasthani Dinner Experience", "AC Private Transfers"],
    itinerary: [
      { day: "Day 1", title: "Jaipur Arrival & Old City", description: "Arrive in Jaipur, visit Hawa Mahal from outside, explore City Palace and Jantar Mantar, then enjoy an evening walk through Johari Bazaar." },
      { day: "Day 2", title: "Amer Fort & Jaipur Heritage", description: "Guided Amer Fort visit, photo stop at Jal Mahal, block-printing workshop, and optional dinner at a heritage haveli." },
      { day: "Day 3", title: "Jaipur to Jodhpur", description: "Drive to Jodhpur with comfort stops. Evening at Clock Tower market and Sardar Market for spices, textiles, and local snacks." },
      { day: "Day 4", title: "Mehrangarh Fort & Blue City", description: "Explore Mehrangarh Fort, Jaswant Thada, and curated blue-city lanes with a local guide." },
      { day: "Day 5", title: "Udaipur Lakeside Arrival", description: "Transfer to Udaipur. Sunset boat ride on Lake Pichola with views of City Palace and Jag Mandir." },
      { day: "Day 6", title: "Udaipur City Palace & Departure", description: "Visit City Palace, Saheliyon ki Bari, and local miniature art studios before departure." }
    ],
    faqs: [
      { question: "Which cities are included in this Rajasthan package?", answer: "The core circuit includes Jaipur, Jodhpur, and Udaipur. Jaisalmer or Pushkar can be added if you have two to three extra nights." },
      { question: "Is this suitable for senior citizens?", answer: "Yes. We pace fort visits carefully, use private vehicles, and can reduce walking-heavy old-city sections if required." },
      { question: "What is the best season for Rajasthan?", answer: "October to March is the most comfortable period for sightseeing. Summers are possible with premium hotels and slower afternoon schedules." }
    ]
  },
  {
    id: 29,
    name: "Varanasi, Ayodhya & Prayagraj Sacred Circuit",
    country: "India",
    state: "Uttar Pradesh",
    city: "Varanasi, Ayodhya, Prayagraj",
    type: "Domestic",
    region: "Uttar Pradesh",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1000",
    category: "Cultural",
    price: "₹29,500",
    rating: 4.8,
    description: "A spiritual Uttar Pradesh itinerary through Kashi ghats, Ayodhya temples, and Prayagraj Sangam.",
    longDescription: "This Uttar Pradesh sacred-city journey is built around comfort, timing, and respectful access. Experience Varanasi's sunrise ghats and evening Ganga Aarti, visit Sarnath for Buddhist heritage, continue to Ayodhya for temple visits along the Sarayu, and complete the journey at Prayagraj's Triveni Sangam. The itinerary is ideal for families, senior travelers, and groups seeking a guided spiritual circuit.",
    services: ["Ghat-side Hotel Options", "Boat Ride in Varanasi", "Temple Visit Coordination", "Private AC Vehicle", "Local Priest Assistance on Request"],
    itinerary: [
      { day: "Day 1", title: "Varanasi Arrival & Ganga Aarti", description: "Arrive in Varanasi, settle near the ghats, and attend the evening Ganga Aarti with assisted seating where available." },
      { day: "Day 2", title: "Sunrise Boat Ride & Sarnath", description: "Early boat ride on the Ganga, Kashi Vishwanath corridor visit, old-lane walk, and afternoon excursion to Sarnath." },
      { day: "Day 3", title: "Varanasi to Ayodhya", description: "Drive or train to Ayodhya. Visit Ram Mandir area, Hanuman Garhi, Kanak Bhawan, and Sarayu ghat in the evening." },
      { day: "Day 4", title: "Ayodhya to Prayagraj", description: "Continue to Prayagraj for Triveni Sangam, Anand Bhavan, and important city heritage points." },
      { day: "Day 5", title: "Prayagraj Departure", description: "Morning rituals or leisure visit based on preference before departure." }
    ],
    faqs: [
      { question: "Can temple timings change?", answer: "Yes. Temple access, festival crowds, and security rules can change, so the final schedule is reconfirmed close to travel." },
      { question: "Is this trip comfortable for elderly travelers?", answer: "Yes. We recommend private transport, central hotels, and early starts to avoid crowd pressure and heat." },
      { question: "Can we add Gaya or Chitrakoot?", answer: "Yes. Gaya, Chitrakoot, Lucknow, or Mathura-Vrindavan can be added as extensions depending on available days." }
    ]
  },
  {
    id: 30,
    name: "Hampi, Mysuru & Coorg Karnataka Circuit",
    country: "India",
    state: "Karnataka",
    city: "Hampi, Mysuru, Coorg",
    type: "Domestic",
    region: "Karnataka",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=1000",
    category: "Cultural",
    price: "₹42,800",
    rating: 4.8,
    description: "A Karnataka itinerary combining Hampi's ruins, Mysuru palace grandeur, and Coorg coffee estates.",
    longDescription: "Karnataka is one of India's strongest heritage-and-nature combinations. This journey starts in Bengaluru or Hubballi, spends meaningful time among the boulder-strewn ruins of Hampi, moves to Mysuru for palace, silk, and sandalwood heritage, and ends in Coorg with coffee estates, waterfalls, and relaxed resort time.",
    services: ["Boutique Heritage Stays", "Hampi Monument Guide", "Mysuru Palace Entry", "Coffee Estate Visit", "Private Intercity Transfers"],
    itinerary: [
      { day: "Day 1", title: "Bengaluru Arrival & Transfer", description: "Arrive in Bengaluru and transfer onward based on flight timing, with an optional city dining stop." },
      { day: "Day 2", title: "Hampi Sacred Centre", description: "Explore Virupaksha Temple, Hampi Bazaar, Hemakuta Hill, and sunset around the boulder landscape." },
      { day: "Day 3", title: "Hampi Royal Enclosure", description: "Visit Vittala Temple, Stone Chariot, Lotus Mahal, Elephant Stables, and riverside ruins with a local expert." },
      { day: "Day 4", title: "Mysuru Palace & Markets", description: "Travel to Mysuru and visit Mysore Palace, Devaraja Market, and Chamundi Hill." },
      { day: "Day 5", title: "Coorg Coffee Country", description: "Drive to Coorg for coffee estate walks, Abbey Falls, and leisure at a plantation resort." },
      { day: "Day 6", title: "Coorg Leisure & Departure", description: "Visit Dubare or Namdroling Monastery depending on route, then depart via Bengaluru or Mangaluru." }
    ],
    faqs: [
      { question: "How many days are ideal for Hampi?", answer: "Two nights are recommended so you can cover both the sacred centre and royal enclosure without rushing." },
      { question: "Is Coorg good for families?", answer: "Yes. Coorg works well for families because of comfortable resorts, soft nature activities, and easy food options." },
      { question: "Which airport is best?", answer: "Bengaluru is the most flexible airport. Hubballi or Vidyanagar may work for Hampi depending on current flight schedules." }
    ]
  },
  {
    id: 31,
    name: "Tamil Nadu Temple & Coast Trail",
    country: "India",
    state: "Tamil Nadu",
    city: "Chennai, Mahabalipuram, Madurai, Rameswaram",
    type: "Domestic",
    region: "Tamil Nadu",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=1000",
    category: "Cultural",
    price: "₹36,500",
    rating: 4.7,
    description: "A Tamil Nadu state itinerary through coastal temples, Madurai heritage, and Rameswaram spirituality.",
    longDescription: "This Tamil Nadu trail is ideal for travelers who love architecture, devotion, and coastal scenery. Begin around Chennai and Mahabalipuram, continue to the living temple city of Madurai, and finish at Rameswaram with its sacred corridors, seashore rituals, and the dramatic Pamban setting.",
    services: ["Temple Guide Assistance", "Premium City Hotels", "Private AC Vehicle", "Mahabalipuram Heritage Walk", "Rameswaram Ritual Support on Request"],
    itinerary: [
      { day: "Day 1", title: "Chennai Arrival & Marina Coast", description: "Arrive in Chennai, visit Kapaleeshwarar Temple, San Thome area, and Marina promenade based on timing." },
      { day: "Day 2", title: "Mahabalipuram Heritage", description: "Explore Shore Temple, Pancha Rathas, and stone-carving lanes before returning or staying along the coast." },
      { day: "Day 3", title: "Madurai Meenakshi Temple", description: "Fly or train to Madurai. Guided visit to Meenakshi Amman Temple and evening market walk." },
      { day: "Day 4", title: "Madurai to Rameswaram", description: "Drive to Rameswaram via Pamban bridge. Visit Ramanathaswamy Temple corridors and local coastal points." },
      { day: "Day 5", title: "Dhanushkodi & Departure", description: "Early excursion to Dhanushkodi and seashore viewpoints before departure via Madurai." }
    ],
    faqs: [
      { question: "Is temple dress code strict?", answer: "Yes. Modest clothing is recommended, and some temple areas may restrict phones, cameras, or non-Hindu access to inner spaces." },
      { question: "Can this be done as a pilgrimage-only tour?", answer: "Yes. We can reduce leisure stops and add temple-specific assistance, rituals, and extra time for darshan." },
      { question: "What is the best season?", answer: "November to February is most comfortable. Summers can be hot, so sightseeing should start early." }
    ]
  },
  {
    id: 32,
    name: "Odisha Golden Triangle",
    country: "India",
    state: "Odisha",
    city: "Bhubaneswar, Puri, Konark",
    type: "Domestic",
    region: "Odisha",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1576235282476-debff2a4d0b9?auto=format&fit=crop&q=80&w=1600",
    category: "Cultural",
    price: "₹31,900",
    rating: 4.7,
    description: "Odisha's classic Bhubaneswar, Puri, and Konark route with temples, crafts, beaches, and Chilika.",
    longDescription: "Odisha's Golden Triangle is one of India's most rewarding short cultural circuits. Explore Bhubaneswar's temple architecture, visit the UNESCO-listed Sun Temple at Konark, experience Puri's sacred and beachside atmosphere, and add Chilika Lake or Raghurajpur crafts for a richer local experience.",
    services: ["Temple City Guided Tour", "Konark Sun Temple Visit", "Puri Beach Stay", "Raghurajpur Craft Village", "Chilika Lake Excursion Option"],
    itinerary: [
      { day: "Day 1", title: "Bhubaneswar Temple City", description: "Arrive in Bhubaneswar and visit Lingaraj area from permitted zones, Mukteshwar Temple, Rajarani Temple, and local museums." },
      { day: "Day 2", title: "Dhauli, Pipili & Konark", description: "Visit Dhauli peace pagoda, Pipili applique craft village, and Konark Sun Temple before reaching Puri." },
      { day: "Day 3", title: "Puri Heritage & Beach", description: "Experience Puri's temple-town atmosphere, beach time, and optional visit to Raghurajpur artisan village." },
      { day: "Day 4", title: "Chilika Lake or Leisure", description: "Choose a Chilika Lake excursion or slower Puri leisure day depending on season and interest." },
      { day: "Day 5", title: "Return to Bhubaneswar", description: "Morning at leisure, local shopping, and departure from Bhubaneswar airport or railway station." }
    ],
    faqs: [
      { question: "Can everyone enter Jagannath Temple?", answer: "Entry rules are specific and can be restrictive. We plan respectful alternatives and viewpoints where direct entry is not permitted." },
      { question: "Is Chilika included?", answer: "Chilika can be included as an optional day excursion. The best routing depends on season, boat availability, and your departure timing." },
      { question: "How many days are enough for Odisha Golden Triangle?", answer: "Four to five days works well for Bhubaneswar, Puri, Konark, and one craft or lake excursion." }
    ]
  },
  {
    id: 33,
    name: "Madhya Pradesh Heritage Arc",
    country: "India",
    state: "Madhya Pradesh",
    city: "Bhopal, Sanchi, Orchha, Khajuraho",
    type: "Domestic",
    region: "Madhya Pradesh",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1699988194923-50f944f92d9a?auto=format&fit=crop&q=80&w=1600",
    category: "Cultural",
    price: "₹44,500",
    rating: 4.8,
    description: "A heart-of-India circuit covering Sanchi, Bhimbetka, Orchha palaces, and Khajuraho temples.",
    longDescription: "Madhya Pradesh rewards slower cultural travelers with UNESCO sites, palace towns, river scenery, and deeply layered history. This itinerary links Bhopal with Sanchi and Bhimbetka, continues to Orchha for Bundela architecture, and finishes at Khajuraho's sculpted temple groups.",
    services: ["Heritage Hotel Options", "UNESCO Site Guides", "Private Intercity Vehicle", "Orchha Riverside Walk", "Khajuraho Light & Sound Option"],
    itinerary: [
      { day: "Day 1", title: "Bhopal Arrival & Lakes", description: "Arrive in Bhopal, enjoy lake views, local cuisine, and a relaxed orientation of the city." },
      { day: "Day 2", title: "Sanchi & Bhimbetka", description: "Visit Sanchi Stupa and Bhimbetka rock shelters with guided interpretation before returning to Bhopal." },
      { day: "Day 3", title: "Bhopal to Orchha", description: "Drive or train toward Orchha. Evening walk near the Betwa River and cenotaph viewpoints." },
      { day: "Day 4", title: "Orchha Forts & Palaces", description: "Explore Orchha Fort complex, Jahangir Mahal, Ram Raja Temple area, and riverside chhatris." },
      { day: "Day 5", title: "Khajuraho Temple Groups", description: "Transfer to Khajuraho and visit western temple group with an expert guide." },
      { day: "Day 6", title: "Khajuraho Departure", description: "Optional eastern and Jain temple group visit before flight or train departure." }
    ],
    faqs: [
      { question: "Is this itinerary history-heavy?", answer: "Yes, but we balance guided monument visits with relaxed hotel time, local food stops, and scenic riverside moments." },
      { question: "Can we add wildlife?", answer: "Yes. Panna, Bandhavgarh, or Kanha can be added depending on season and safari availability." },
      { question: "Are guides recommended?", answer: "Definitely. Sanchi, Bhimbetka, Orchha, and Khajuraho are much more meaningful with expert local interpretation." }
    ]
  },
  {
    id: 34,
    name: "Meghalaya Waterfalls & Living Roots",
    country: "India",
    state: "Meghalaya",
    city: "Shillong, Cherrapunji, Dawki, Mawlynnong",
    type: "Domestic",
    region: "Meghalaya",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1000",
    category: "Adventure",
    price: "₹48,900",
    rating: 4.9,
    description: "A northeast India journey through Shillong, Cherrapunji waterfalls, Dawki river, and living root bridges.",
    longDescription: "Meghalaya is built for travelers who love mist, waterfalls, clean villages, caves, and scenic drives. This route covers Shillong's easy hill-station energy, Cherrapunji's waterfalls and living root bridge walks, Dawki's clear river landscapes, and Mawlynnong's village experience with a responsible-travel pace.",
    services: ["Boutique Hill Stays", "Private SUV with Local Driver", "Living Root Bridge Walk", "Dawki River Boating", "Waterfall & Cave Visits"],
    itinerary: [
      { day: "Day 1", title: "Guwahati to Shillong", description: "Arrive at Guwahati, drive to Shillong via Umiam Lake, and enjoy a relaxed evening in Police Bazaar or a cafe district." },
      { day: "Day 2", title: "Shillong Local & Laitlum", description: "Visit Shillong Peak or Elephant Falls, then continue to Laitlum canyons if weather permits." },
      { day: "Day 3", title: "Cherrapunji Waterfalls", description: "Drive to Sohra/Cherrapunji for Nohkalikai, Seven Sisters viewpoints, caves, and waterfall stops." },
      { day: "Day 4", title: "Living Root Bridge Experience", description: "Guided walk to a living root bridge with pacing matched to fitness level, followed by a slow local lunch." },
      { day: "Day 5", title: "Dawki & Mawlynnong", description: "Visit Dawki/Umngot river, India-Bangladesh border area viewpoints, and Mawlynnong village before returning." },
      { day: "Day 6", title: "Departure via Guwahati", description: "Drive back to Guwahati airport with a buffer for hill-road conditions." }
    ],
    faqs: [
      { question: "Is Meghalaya safe for family travel?", answer: "Yes. It is popular with families, but hill roads, weather, and walking levels should be planned realistically." },
      { question: "When is the best time for waterfalls?", answer: "Post-monsoon months offer strong waterfalls and greener landscapes, while winter usually has clearer skies and easier drives." },
      { question: "Is Dawki always crystal clear?", answer: "Water clarity changes with rainfall and river conditions, so it is best treated as a seasonal highlight rather than a guarantee." }
    ]
  },
  {
    id: 35,
    name: "Sikkim Himalayan Panorama",
    country: "India",
    state: "Sikkim",
    city: "Gangtok, Pelling, Lachung",
    type: "Domestic",
    region: "Sikkim",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1648113821624-244c6c1baf54?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹52,500",
    rating: 4.8,
    description: "A Sikkim mountain route through Gangtok monasteries, Pelling views, and North Sikkim valleys.",
    longDescription: "This Sikkim itinerary is made for Himalayan views, monasteries, and slow mountain mornings. Start in Gangtok with Tsomgo Lake and local markets, continue to Pelling for Kanchenjunga viewpoints and sacred sites, and add Lachung/Yumthang when permits, weather, and road conditions are favorable.",
    services: ["Mountain Hotels", "Permit Coordination", "Private Hill Vehicle", "Monastery Visits", "North Sikkim Extension Planning"],
    itinerary: [
      { day: "Day 1", title: "Bagdogra to Gangtok", description: "Arrive at Bagdogra or New Jalpaiguri and drive to Gangtok with comfort stops along the Teesta valley." },
      { day: "Day 2", title: "Gangtok Monasteries & Viewpoints", description: "Visit Rumtek or Enchey Monastery, local viewpoints, flower exhibition, and MG Marg in the evening." },
      { day: "Day 3", title: "Tsomgo Lake Excursion", description: "Permit-based excursion to Tsomgo Lake and Baba Mandir, subject to weather and road access." },
      { day: "Day 4", title: "Pelling Scenic Transfer", description: "Drive to Pelling with stops at Namchi or Ravangla depending on route preference." },
      { day: "Day 5", title: "Pelling Skywalk & Monasteries", description: "Visit Pemayangtse Monastery, Rabdentse ruins, Skywalk area, and Kanchenjunga viewpoints." },
      { day: "Day 6", title: "Departure or Lachung Extension", description: "Return toward Bagdogra/NJP or add a North Sikkim Lachung and Yumthang extension." }
    ],
    faqs: [
      { question: "Do we need permits in Sikkim?", answer: "Yes, some areas require permits. We collect documents in advance and plan backup options for weather closures." },
      { question: "Can senior citizens visit Tsomgo Lake?", answer: "Many can, but altitude and weather should be considered. We recommend medical caution for heart or breathing concerns." },
      { question: "When are mountain views best?", answer: "October to December and March to May usually offer better visibility, though weather can still change quickly." }
    ]
  },
  {
    id: 36,
    name: "Assam Kaziranga & Majuli",
    country: "India",
    state: "Assam",
    city: "Guwahati, Kaziranga, Majuli",
    type: "Domestic",
    region: "Assam",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1675296098308-f9f526c6b724?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹46,900",
    rating: 4.8,
    description: "A wildlife and culture route through Guwahati, Kaziranga safaris, and Majuli island monasteries.",
    longDescription: "Assam combines river culture, wildlife, tea landscapes, and Vaishnavite heritage. This journey begins in Guwahati, moves to Kaziranga for safari experiences, and continues to Majuli to understand satras, mask-making, and Brahmaputra island life at a gentle pace.",
    services: ["Kaziranga Safari Assistance", "Tea Estate Visit", "Majuli Ferry Coordination", "Private Vehicle", "Local Cultural Guide"],
    itinerary: [
      { day: "Day 1", title: "Guwahati Arrival", description: "Arrive in Guwahati, visit Kamakhya Temple if timing permits, and relax by the Brahmaputra." },
      { day: "Day 2", title: "Guwahati to Kaziranga", description: "Drive to Kaziranga with an optional tea garden or local lunch stop en route." },
      { day: "Day 3", title: "Kaziranga Safari Day", description: "Morning and afternoon safari options across designated ranges based on permits and current park rules." },
      { day: "Day 4", title: "Kaziranga to Majuli", description: "Continue toward Majuli via Jorhat and ferry crossing, with a relaxed evening on the island." },
      { day: "Day 5", title: "Majuli Satra & Village Life", description: "Visit satras, mask-making workshops, and river-island villages with a local guide." },
      { day: "Day 6", title: "Departure", description: "Return to Jorhat or Guwahati depending on flight connectivity." }
    ],
    faqs: [
      { question: "When is Kaziranga open?", answer: "Kaziranga usually closes during monsoon months. Safari dates must be reconfirmed before final booking." },
      { question: "Is Majuli ferry travel reliable?", answer: "Ferry schedules depend on river and weather conditions, so we keep buffers and advise flexible departure plans." },
      { question: "Can vegetarians manage in Assam?", answer: "Yes. Assamese vegetarian meals, tea estate menus, and hotel dining can be arranged with advance notice." }
    ]
  },
  {
    id: 37,
    name: "Andaman Havelock & Neil Island Escape",
    country: "India",
    state: "Andaman and Nicobar Islands",
    city: "Port Blair, Havelock, Neil Island",
    type: "Domestic",
    region: "Andaman and Nicobar Islands",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000",
    category: "Coastal",
    price: "₹64,900",
    rating: 4.9,
    description: "A compact Andaman island escape through Port Blair, Havelock, and Neil Island, with a timely June value window.",
    longDescription: "Make the most of Andaman's off-season value with a well-paced 3-night escape covering Port Blair, Havelock, and a Neil Island day trip. June departures are available on request, with current hotel and ferry options checked before you commit. Expect Cellular Jail history, Radhanagar Beach, quieter island moments, and smooth inter-island planning in one compact holiday.",
    services: ["3 Nights Hotel Stay", "Daily Breakfast", "Inter-island Ferry Planning", "Airport and Jetty Transfers", "Port Blair, Havelock and Neil Sightseeing"],
    itinerary: [
      { day: "Day 1", title: "Port Blair Arrival & Cellular Jail", description: "Arrive in Port Blair, settle in, then visit Cellular Jail and attend the evening light and sound show if operational." },
      { day: "Day 2", title: "Havelock Beaches", description: "Take a morning ferry to Havelock, unwind at Kalapathar Beach, and finish the day at Radhanagar Beach." },
      { day: "Day 3", title: "Neil Island Day Trip", description: "Travel via Neil Island for Bharatpur Beach, the Natural Bridge area, and Laxmanpur Beach before returning to Port Blair in the evening." },
      { day: "Day 4", title: "Port Blair Departure", description: "Enjoy breakfast, check out, and transfer to Port Blair airport with your island highlights packed into one easy escape." }
    ],
    faqs: [
      { question: "Are ferries included?", answer: "Yes, standard inter-island ferry planning is included, subject to seat availability and weather operations." },
      { question: "Why consider Andaman in June?", answer: "June falls within the current off-season value window, so it can be a smart time to request a better-value island plan. Hotels, ferries, sightseeing, and weather-dependent activities are reconfirmed for your exact dates before booking." },
      { question: "Is Andaman good for honeymoon travelers?", answer: "Yes. Havelock and Neil Island are excellent for couples seeking beaches, water activities, and quiet resort time." },
      { question: "Do Indian citizens need permits?", answer: "Indian citizens generally do not need special permits for the main tourist islands, but some areas remain restricted." }
    ]
  },
  {
    id: 38,
    name: "Kolkata Heritage & Sundarbans",
    country: "India",
    state: "West Bengal",
    city: "Kolkata, Sundarbans",
    type: "Domestic",
    region: "West Bengal",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&q=80&w=1000",
    category: "Cultural",
    price: "₹37,500",
    rating: 4.7,
    description: "A Bengal journey pairing Kolkata colonial heritage, food trails, art, and Sundarbans mangrove wilderness.",
    longDescription: "This West Bengal itinerary combines Kolkata's intellectual, colonial, and culinary layers with the tidal wilderness of the Sundarbans. It is ideal for travelers who enjoy city walks, literature and art, river life, and a nature extension that feels completely different from a normal hill or beach holiday.",
    services: ["Kolkata Heritage Walk", "Bengali Food Trail", "Sundarbans Lodge Stay", "Mangrove Boat Safari", "Private City Transfers"],
    itinerary: [
      { day: "Day 1", title: "Kolkata Arrival & Riverfront", description: "Arrive in Kolkata, visit Victoria Memorial area, St. Paul's Cathedral, and enjoy a Hooghly riverfront evening." },
      { day: "Day 2", title: "Kolkata Heritage & Food", description: "Guided walk through north Kolkata, Kumartuli, College Street, and curated Bengali meal experiences." },
      { day: "Day 3", title: "Transfer to Sundarbans", description: "Drive and boat transfer to Sundarbans lodge with an evening village or creek experience." },
      { day: "Day 4", title: "Sundarbans Boat Safari", description: "Full-day mangrove cruise through watchtower zones and river channels with naturalist guidance." },
      { day: "Day 5", title: "Return to Kolkata", description: "Return to Kolkata with time for handicrafts, sweets, or departure." }
    ],
    faqs: [
      { question: "Is tiger sighting guaranteed in Sundarbans?", answer: "No wildlife sighting can be guaranteed. The experience focuses on mangroves, river ecology, birdlife, and the possibility of wildlife." },
      { question: "How long is the transfer to Sundarbans?", answer: "Expect a combination of road and boat transfer, usually taking most of the travel day depending on lodge location." },
      { question: "Can we make the trip more food-focused?", answer: "Yes. Kolkata is excellent for curated food walks, sweets, traditional Bengali meals, and cafe heritage." }
    ]
  },
  {
    id: 39,
    name: "Uttarakhand Rishikesh, Mussoorie & Corbett",
    country: "India",
    state: "Uttarakhand",
    city: "Rishikesh, Mussoorie, Jim Corbett",
    type: "Domestic",
    region: "Uttarakhand",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1695795848165-712896675296?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹34,500",
    rating: 4.7,
    description: "A Himalayan foothills itinerary with Rishikesh, Mussoorie, and Jim Corbett safari planning.",
    longDescription: "This Uttarakhand route is a balanced introduction to the Himalayan foothills. Start with Rishikesh for riverfront stays, yoga, and gentle adventure, continue to Mussoorie for classic hill-station views, and add Jim Corbett for forest lodges and safari experiences when zones are open.",
    services: ["Riverfront or Hill Hotels", "Ganga Aarti Visit", "Mussoorie Sightseeing", "Corbett Safari Assistance", "Private Hill Transfers"],
    itinerary: [
      { day: "Day 1", title: "Delhi to Rishikesh", description: "Drive to Rishikesh, check into a riverfront or nearby resort, and attend evening Ganga Aarti." },
      { day: "Day 2", title: "Rishikesh Wellness & Adventure", description: "Choose yoga, cafe walks, Beatles Ashram, soft rafting when operational, or a relaxed riverside day." },
      { day: "Day 3", title: "Rishikesh to Mussoorie", description: "Drive to Mussoorie and visit Mall Road, Camel's Back Road, or nearby viewpoints." },
      { day: "Day 4", title: "Mussoorie Leisure", description: "Visit Landour, local bakeries, waterfalls, and hill viewpoints with a slower mountain pace." },
      { day: "Day 5", title: "Jim Corbett Transfer", description: "Transfer to Corbett region and settle into a forest lodge." },
      { day: "Day 6", title: "Corbett Safari & Departure", description: "Morning safari subject to permit availability, followed by departure toward Delhi or onward station." }
    ],
    faqs: [
      { question: "Is rafting always available in Rishikesh?", answer: "No. Rafting depends on season, river conditions, and government permissions." },
      { question: "Can Corbett safari be guaranteed?", answer: "Safari permits are limited and zone-based, so early booking is strongly recommended." },
      { question: "Is this a good family itinerary?", answer: "Yes. It combines light adventure, hill-station time, and wildlife, and can be softened for children or senior travelers." }
    ]
  },
  {
    id: 40,
    name: "Gujarat Heritage, Kutch & Textile Trails",
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad, Patan, Modhera, Bhuj, Kutch, Mandvi",
    type: "Domestic",
    region: "Gujarat",
    regionId: "west-india",
    image: "https://images.unsplash.com/photo-1754410200892-34387fa9b3ee?auto=format&fit=crop&q=80&w=1600",
    category: "Cultural",
    price: "₹1,18,000",
    rating: 4.9,
    description: "A Gujarat itinerary built around Ahmedabad heritage, stepwells, textiles, Kutch craft villages, and the White Rann.",
    longDescription: "This Gujarat itinerary is designed for travelers who want India beyond the usual Golden Triangle. It combines UNESCO city heritage, stepwell architecture, textile traditions, craft villages, salt-desert landscapes, and coastal Mandvi with English-speaking guides, airport assistance, carefully selected hotels, and comfortable pacing.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1762541924983-7bd39192f3e7?auto=format&fit=crop&q=80&w=1600", alt: "Adalaj Stepwell carved stone galleries in Gujarat", caption: "Ahmedabad and Adalaj stepwell heritage" },
      { url: "https://images.unsplash.com/photo-1700422046184-1ef0459dfc00?auto=format&fit=crop&q=80&w=1600", alt: "Modhera Sun Temple stone pillars in Gujarat", caption: "Patan and Modhera sacred architecture" },
      { url: "https://images.unsplash.com/photo-1582130298374-b89e8d6eab13?auto=format&fit=crop&q=80&w=1600", alt: "Kutch artisan jewelry and craft detail", caption: "Kutch craft and textile village detail" }
    ],
    services: ["Airport Meet & Assist", "English-speaking Cultural Guide", "Boutique Heritage Hotels", "Craft Village Access", "Foreigner Ticket Coordination", "Private AC Vehicle"],
    itinerary: [
      { day: "Day 1", title: "International Arrival in Ahmedabad", description: "Arrive in Ahmedabad with meet-and-assist support, relaxed hotel check-in, currency/SIM guidance, and a gentle old-city orientation walk if flight timing permits." },
      { day: "Day 2", title: "Ahmedabad UNESCO Heritage", description: "Explore the old city's pol houses, Jama Masjid, Sidi Saiyyed Mosque, Sabarmati Ashram, and curated Gujarati thali dining with an English-speaking guide." },
      { day: "Day 3", title: "Adalaj, Patan & Modhera", description: "Visit Adalaj Stepwell, Patan's Patola weaving tradition, Rani ki Vav, and Modhera Sun Temple before an overnight heritage stay." },
      { day: "Day 4", title: "Little Rann & Wild Ass Sanctuary", description: "Travel toward the Little Rann for salt-pan landscapes, village encounters, and a wildlife drive focused on desert ecology and migratory birds." },
      { day: "Day 5", title: "Bhuj Craft Immersion", description: "Continue to Bhuj and visit Kutch craft clusters for embroidery, block printing, lacquer work, and local artisan interaction arranged respectfully." },
      { day: "Day 6", title: "White Rann & Banni Villages", description: "Experience the White Rann near sunset, Banni villages, and seasonal cultural programming with a focus on photography and local context." },
      { day: "Day 7", title: "Mandvi Coast & Palace", description: "Drive to Mandvi for Vijay Vilas Palace, shipbuilding traditions, and a relaxed Arabian Sea beach evening." },
      { day: "Day 8", title: "Bhuj or Ahmedabad Departure", description: "Fly onward from Bhuj or return toward Ahmedabad based on international connection planning." }
    ],
    faqs: [
      { question: "Is Gujarat suitable for first-time travelers?", answer: "Yes. It is culturally rich, safe, and rewarding when planned with private transport, English-speaking guides, and careful meal and hotel selection." },
      { question: "Can this itinerary be vegetarian or Jain-friendly?", answer: "Absolutely. Gujarat is one of India's easiest states for vegetarian, Jain, and no-onion/no-garlic dining requests." },
      { question: "When is the White Rann best?", answer: "The salt-desert experience is strongest in the cooler dry months, especially around the Rann Utsav season. Exact dates should be verified before booking." }
    ]
  },
  {
    id: 41,
    name: "Gujarat Lions, Temples & Coastal Trail",
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad, Statue of Unity, Gir, Somnath, Dwarka, Diu",
    type: "Domestic",
    region: "Gujarat",
    regionId: "west-india",
    image: "https://images.unsplash.com/photo-1659532800577-6531dc91563b?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹1,32,000",
    rating: 4.8,
    description: "A premium Gujarat route for international travelers combining Statue of Unity, Gir lion safaris, Somnath, Dwarka, and Diu coast.",
    longDescription: "This itinerary gives travelers a broad Gujarat story: modern landmarks, sacred coastal temples, Asiatic lion country, and a gentle beach finish. It is planned with safari buffers, temple etiquette guidance, foreigner-friendly hotels, clean rest stops, and private transfers across longer road sectors.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1647792680981-4e51b1f8857a?auto=format&fit=crop&q=80&w=1600", alt: "Statue of Unity in Gujarat", caption: "Statue of Unity excursion" },
      { url: "https://images.unsplash.com/photo-1735192683815-d8918aad53dc?auto=format&fit=crop&q=80&w=1600", alt: "Somnath Temple on the Gujarat coast", caption: "Somnath coastal temple stop" },
      { url: "https://images.unsplash.com/photo-1641714249077-985a393380dc?auto=format&fit=crop&q=80&w=1600", alt: "Diu Island beach on the Arabian Sea", caption: "Diu beach and coastal leisure" }
    ],
    services: ["Safari Permit Assistance", "English-speaking Escort Guide", "Temple Etiquette Briefing", "Premium Road Transfers", "Bottled Water & Comfort Stops", "International Arrival Support"],
    itinerary: [
      { day: "Day 1", title: "Ahmedabad Arrival", description: "International arrival support, hotel check-in, and a soft introduction to Ahmedabad with Sabarmati riverfront or local dining depending on flight timing." },
      { day: "Day 2", title: "Statue of Unity Excursion", description: "Full-day excursion to Statue of Unity with viewing gallery, museum zones, and comfortable return or nearby overnight stay." },
      { day: "Day 3", title: "Ahmedabad to Gir", description: "Drive toward Gir with curated lunch stops and countryside interpretation, checking into a forest lodge by evening." },
      { day: "Day 4", title: "Gir Lion Safari", description: "Morning safari subject to permit availability, followed by lodge leisure and an optional second interpretation drive or local village visit." },
      { day: "Day 5", title: "Somnath Coastal Heritage", description: "Drive to Somnath, visit the temple area with etiquette guidance, and enjoy the Arabian Sea promenade." },
      { day: "Day 6", title: "Dwarka Pilgrimage Coast", description: "Continue to Dwarka, visit Dwarkadhish Temple area, Gomti ghat, and coastal viewpoints with local guide support." },
      { day: "Day 7", title: "Diu Leisure", description: "Travel to Diu for Portuguese-era forts, beaches, seafood or vegetarian coastal dining, and a slower resort evening." },
      { day: "Day 8", title: "Departure", description: "Depart from Diu/Rajkot/Ahmedabad depending on flight planning and onward international route." }
    ],
    faqs: [
      { question: "Are Gir safaris guaranteed?", answer: "Safari seats and zones are controlled by permit availability. We recommend early booking and keeping a backup nature activity." },
      { question: "Can non-Hindu international guests visit temple areas?", answer: "Access rules vary by temple and can change. We brief guests respectfully and arrange appropriate viewpoints or alternative experiences if needed." },
      { question: "Are the road drives long?", answer: "Some sectors are long, so this package uses private vehicles, planned comfort stops, and hotel pacing designed for international travelers." }
    ]
  },
  {
    id: 42,
    name: "Rajasthan Grand Palace Journey",
    country: "India",
    state: "Rajasthan",
    city: "Jaipur, Pushkar, Jodhpur, Jaisalmer, Udaipur",
    type: "Domestic",
    region: "Rajasthan",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1578155173088-710a9aef3849?auto=format&fit=crop&q=80&w=1600",
    category: "Cultural",
    price: "₹1,48,000",
    rating: 5.0,
    description: "A classic Rajasthan route with palace hotels, forts, desert sunset, lake views, and guided cultural interpretation.",
    longDescription: "Designed for travelers visiting Rajasthan, this grand route balances the state's biggest icons with slower luxury moments. Expect private guiding, heritage hotels, palace museums, desert hospitality, lake sunsets, craft ateliers, and carefully paced transfers between Jaipur, Pushkar, Jodhpur, Jaisalmer, and Udaipur.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1655137029428-2a533d233044?auto=format&fit=crop&q=80&w=1600", alt: "Mehrangarh Fort sandstone arches in Jodhpur", caption: "Jodhpur fort and blue-city heritage" },
      { url: "https://images.unsplash.com/photo-1775724721579-ef8a83de37ce?auto=format&fit=crop&q=80&w=1600", alt: "Jaisalmer Fort carved sandstone interior", caption: "Jaisalmer golden fort and haveli detail" },
      { url: "https://images.unsplash.com/photo-1589775870585-cad646a1a640?auto=format&fit=crop&q=80&w=1600", alt: "Udaipur City Palace beside Lake Pichola", caption: "Udaipur Lake Pichola palace finish" }
    ],
    services: ["Luxury Heritage Hotels", "English-speaking Tour Director", "Private Fort & Palace Guides", "Desert Camp Upgrade", "Airport Lounge Assistance", "Curated Dining Reservations"],
    itinerary: [
      { day: "Day 1", title: "Jaipur Arrival", description: "Arrive in Jaipur with private assistance, settle into a heritage hotel, and enjoy a relaxed welcome dinner with a route briefing." },
      { day: "Day 2", title: "Amer Fort & Jaipur City Palace", description: "Visit Amer Fort, City Palace, Jantar Mantar, Hawa Mahal viewpoint, and textile or block-printing ateliers." },
      { day: "Day 3", title: "Jaipur to Pushkar", description: "Drive to Pushkar via Ajmer, explore ghats respectfully, and enjoy a calm lakeside evening." },
      { day: "Day 4", title: "Pushkar to Jodhpur", description: "Travel to Jodhpur, visit Clock Tower market, and dine with Mehrangarh views if available." },
      { day: "Day 5", title: "Jodhpur Fort & Blue City", description: "Guided Mehrangarh Fort, Jaswant Thada, blue-city lanes, and optional cooking or textile experience." },
      { day: "Day 6", title: "Jodhpur to Jaisalmer", description: "Drive across the Thar landscape to Jaisalmer, with an evening orientation around the golden sandstone city." },
      { day: "Day 7", title: "Jaisalmer Fort & Desert Camp", description: "Explore Jaisalmer Fort, Patwon ki Haveli, and sunset dunes with a premium desert camp dinner." },
      { day: "Day 8", title: "Jaisalmer to Udaipur", description: "Fly or drive with routing support to Udaipur, arriving for lakeside leisure." },
      { day: "Day 9", title: "Udaipur Lake & Palace Day", description: "Visit City Palace, Jagdish Temple, miniature painting studio, and Lake Pichola boat ride." },
      { day: "Day 10", title: "Departure", description: "Depart from Udaipur or extend to Mumbai, Delhi, or Gujarat based on international flight routing." }
    ],
    faqs: [
      { question: "Is this good for first-time visitors to India?", answer: "Yes. Rajasthan is visually rich and comfortable when planned with private guiding, heritage hotels, and careful pacing." },
      { question: "Can international guests get western food?", answer: "Yes. We balance local cuisine with premium hotel dining and international food options where needed." },
      { question: "How should guests dress for forts and temples?", answer: "Light, modest clothing is recommended. Scarves, hats, sunscreen, and comfortable shoes are important for sightseeing days." }
    ]
  },
  {
    id: 43,
    name: "Rajasthan Desert, Leopard & Luxury Escape",
    country: "India",
    state: "Rajasthan",
    city: "Jaipur, Jawai, Jodhpur, Jaisalmer, Udaipur",
    type: "Domestic",
    region: "Rajasthan",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1612177926426-d7f60c9c183f?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹1,72,000",
    rating: 4.9,
    description: "A high-end Rajasthan itinerary for travelers combining Jaipur, Jawai leopard country, Jodhpur, Jaisalmer desert, and Udaipur.",
    longDescription: "This route is for international travelers who want Rajasthan with more atmosphere and less checklist travel. It combines Jaipur's design heritage, Jawai's dramatic granite landscape and leopard-tracking, Jodhpur's fort culture, Jaisalmer's desert glow, and Udaipur's soft lakeside finish.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1578155173088-710a9aef3849?auto=format&fit=crop&q=80&w=1600", alt: "Hawa Mahal facade in Jaipur", caption: "Jaipur design and fort heritage" },
      { url: "https://images.unsplash.com/photo-1775724721579-ef8a83de37ce?auto=format&fit=crop&q=80&w=1600", alt: "Jaisalmer Fort carved sandstone interior", caption: "Jaisalmer desert fort atmosphere" },
      { url: "https://images.unsplash.com/photo-1589775870585-cad646a1a640?auto=format&fit=crop&q=80&w=1600", alt: "Udaipur City Palace beside Lake Pichola", caption: "Udaipur slow luxury finale" }
    ],
    services: ["Luxury Wilderness Lodge", "Leopard Safari Planning", "Heritage Hotels", "Private Naturalist", "Sunset Desert Dinner", "Flexible Travel Pacing"],
    itinerary: [
      { day: "Day 1", title: "Jaipur Arrival", description: "Arrival assistance, hotel check-in, and a slow evening with curated dinner and shopping guidance." },
      { day: "Day 2", title: "Jaipur Design & Forts", description: "Amer Fort, City Palace, Panna Meena stepwell, and textile or gem atelier visits tailored for international guests." },
      { day: "Day 3", title: "Jaipur to Jawai", description: "Transfer to Jawai leopard country, settling into a wilderness lodge among granite hills." },
      { day: "Day 4", title: "Jawai Safari & Village Life", description: "Early safari with naturalist, pastoral Rabari culture interpretation, and lodge leisure." },
      { day: "Day 5", title: "Jawai to Jodhpur", description: "Drive to Jodhpur and explore old-city markets, blue lanes, and rooftop dining." },
      { day: "Day 6", title: "Jodhpur to Jaisalmer", description: "Guided Mehrangarh Fort visit before continuing into the desert landscape toward Jaisalmer." },
      { day: "Day 7", title: "Jaisalmer Desert", description: "Golden Fort, havelis, dune sunset, and private desert dinner with folk music." },
      { day: "Day 8", title: "Udaipur Transfer", description: "Fly or drive to Udaipur with routing planned around comfort and flight availability." },
      { day: "Day 9", title: "Udaipur Slow Luxury", description: "Lake Pichola, City Palace, art studios, and a relaxed final lakeside evening." }
    ],
    faqs: [
      { question: "Is leopard sighting guaranteed in Jawai?", answer: "No wildlife sighting is guaranteed, but Jawai is known for strong leopard-tracking experiences with expert naturalists." },
      { question: "Is this itinerary more premium than the classic Rajasthan route?", answer: "Yes. It adds wilderness lodging, slower pacing, and higher-touch experiences suited to luxury international travelers." },
      { question: "Can the route start in Delhi?", answer: "Yes. We can add Delhi arrival, Agra, or international flight connections before Jaipur." }
    ]
  },
  {
    id: 44,
    name: "Uttar Pradesh Icons: Agra, Lucknow & Varanasi",
    country: "India",
    state: "Uttar Pradesh",
    city: "Agra, Lucknow, Ayodhya, Varanasi, Sarnath",
    type: "Domestic",
    region: "Uttar Pradesh",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1600",
    category: "Cultural",
    price: "₹1,05,000",
    rating: 4.8,
    description: "A Uttar Pradesh itinerary linking Taj Mahal sunrise, Lucknow culture, Ayodhya, Varanasi ghats, and Sarnath.",
    longDescription: "This Uttar Pradesh itinerary is crafted for travelers who want a strong North India cultural arc beyond a single Taj Mahal stop. It connects Agra's Mughal monuments, Lucknow's Nawabi food and architecture, Ayodhya's new pilgrimage energy, Varanasi's river rituals, and Sarnath's Buddhist heritage with private guiding and careful crowd timing.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1600", alt: "Taj Mahal in Agra", caption: "Agra sunrise monument experience" },
      { url: "https://images.unsplash.com/photo-1686483719385-e80703862c10?auto=format&fit=crop&q=80&w=1600", alt: "Bara Imambara heritage complex in Lucknow", caption: "Lucknow Nawabi heritage and architecture" },
      { url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1600", alt: "Varanasi Ganga ghats", caption: "Varanasi Ganga ghats and aarti" }
    ],
    services: ["Foreign Guest Monument Timing", "English-speaking Guides", "Sunrise Taj Mahal Visit", "Ganga Aarti Seating Support", "Premium Rail or Road Planning", "Dietary & Hygiene Guidance"],
    itinerary: [
      { day: "Day 1", title: "Agra Arrival", description: "Arrive from Delhi or an international connection, check into Agra, and visit Mehtab Bagh or Agra Fort based on timing." },
      { day: "Day 2", title: "Taj Mahal Sunrise & Lucknow", description: "Sunrise Taj Mahal visit with guide support, then continue to Lucknow by expressway or train." },
      { day: "Day 3", title: "Lucknow Nawabi Heritage", description: "Explore Bara Imambara, Rumi Darwaza, Residency, chikankari craft, and a curated food experience with vegetarian alternatives." },
      { day: "Day 4", title: "Lucknow to Ayodhya", description: "Drive to Ayodhya for temple-town orientation, Sarayu ghat, Hanuman Garhi, and respectful access planning around crowd conditions." },
      { day: "Day 5", title: "Ayodhya to Varanasi", description: "Continue to Varanasi, check into a ghat-side or premium city hotel, and attend evening Ganga Aarti." },
      { day: "Day 6", title: "Varanasi Sunrise & Sarnath", description: "Sunrise boat ride, Kashi Vishwanath corridor exterior/entry planning as permitted, old-city walk, and afternoon Sarnath visit." },
      { day: "Day 7", title: "Varanasi Departure", description: "Leisure morning, silk or craft shopping, and departure with airport assistance." }
    ],
    faqs: [
      { question: "Is this route suitable for international first-timers?", answer: "Yes, if paced carefully. We use private guiding, early starts, premium hotels, and comfort breaks to reduce culture-shock fatigue." },
      { question: "Can we include Delhi?", answer: "Yes. Delhi arrival, Old Delhi, New Delhi, or a Golden Triangle extension can be added before Agra." },
      { question: "How do you handle crowds in Varanasi and Ayodhya?", answer: "We use early timing, local guide coordination, realistic walking routes, and flexible backup plans during festivals or security restrictions." }
    ]
  },
  {
    id: 45,
    name: "Uttar Pradesh Buddhist & Ganga Heritage Trail",
    country: "India",
    state: "Uttar Pradesh",
    city: "Varanasi, Sarnath, Kushinagar, Shravasti, Prayagraj, Lucknow",
    type: "Domestic",
    region: "Uttar Pradesh",
    regionId: "south-asia",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1600",
    category: "Cultural",
    price: "₹1,12,000",
    rating: 4.8,
    description: "A meaningful spiritual route through Varanasi, Sarnath, Kushinagar, Shravasti, Prayagraj, and Lucknow.",
    longDescription: "This itinerary is built for international travelers interested in India's spiritual geography, especially Buddhist heritage and the Ganga plains. It combines Varanasi's living rituals, Sarnath's Buddhist story, Kushinagar and Shravasti pilgrimage sites, Prayagraj's confluence, and Lucknow's culture with sensitive guiding and comfortable road planning.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1652288156243-a7505dcaa0ec?auto=format&fit=crop&q=80&w=1600", alt: "Sarnath Buddhist temple and stupa heritage", caption: "Sarnath Buddhist heritage stop" },
      { url: "https://images.unsplash.com/photo-1691940175842-84a788886e7f?auto=format&fit=crop&q=80&w=1600", alt: "Kushinagar Buddhist temple and pilgrimage grounds", caption: "Kushinagar pilgrimage architecture" },
      { url: "https://images.unsplash.com/photo-1674358596018-5b768ca9cfd1?auto=format&fit=crop&q=80&w=1600", alt: "Prayagraj Sangam boats and riverfront", caption: "Prayagraj Sangam river heritage" }
    ],
    services: ["Buddhist Site Guide", "English-speaking Escort", "Temple & Monastery Etiquette Briefing", "Private AC Vehicle", "Senior-friendly Pacing", "Airport/Rail Assistance"],
    itinerary: [
      { day: "Day 1", title: "Varanasi Arrival", description: "Arrive in Varanasi with assisted transfer, settle into the hotel, and attend evening Ganga Aarti from a planned viewpoint." },
      { day: "Day 2", title: "Varanasi & Sarnath", description: "Sunrise boat ride, old-city walk, and Sarnath visit covering Dhamek Stupa, museum context, and Buddhist teaching history." },
      { day: "Day 3", title: "Varanasi to Kushinagar", description: "Drive to Kushinagar with rest stops and visit major Buddhist pilgrimage points connected with the Mahaparinirvana tradition." },
      { day: "Day 4", title: "Kushinagar to Shravasti", description: "Continue to Shravasti for Jetavana and associated Buddhist sites, with a gentle walking pace and interpretive guiding." },
      { day: "Day 5", title: "Shravasti to Lucknow", description: "Drive to Lucknow for hotel comfort, optional chikankari craft stop, and relaxed evening dining." },
      { day: "Day 6", title: "Lucknow to Prayagraj", description: "Travel to Prayagraj for Triveni Sangam, Anand Bhavan, and local heritage interpretation." },
      { day: "Day 7", title: "Prayagraj to Varanasi or Lucknow", description: "Return based on departure airport choice, with optional extension to Bodhgaya or Delhi." }
    ],
    faqs: [
      { question: "Can this connect to Bodhgaya or Nepal?", answer: "Yes. Bodhgaya, Lumbini, or a wider Buddhist circuit can be added with extra days and cross-border planning where relevant." },
      { question: "Is this route road-heavy?", answer: "Yes, some sectors are long. We recommend premium vehicles, buffer time, and two-night stays where guests prefer slower travel." },
      { question: "Is it suitable for Buddhist groups?", answer: "Yes. We can adapt this for small groups with monastery visits, vegetarian meals, and additional reflection time at key sites." }
    ]
  },
  {
    id: 46,
    name: "Real East Africa & Zanzibar",
    country: "Kenya, Tanzania & Zanzibar",
    state: "Nairobi, Maasai Mara, Serengeti, Ngorongoro, Zanzibar",
    city: "Nairobi, Loita Hills, Maasai Mara, Lake Victoria, Serengeti, Karatu, Stone Town, Zanzibar",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹3,45,000",
    rating: 4.9,
    description: "A grand East Africa route combining Maasai culture, Mara and Serengeti game drives, Ngorongoro wildlife, and a Zanzibar beach finish.",
    longDescription: "Inspired by Safari Seekers' East Africa and Zanzibar routing, this 13-day journey is for travelers who want East Africa's classic wildlife arc with a softer Indian Ocean ending. It links Nairobi, a Maasai cultural stop in Loita Hills, the Maasai Mara, Lake Victoria, Serengeti, Ngorongoro, and then flies into Stone Town and Zanzibar's northern beaches for a finale that balances safari intensity with coastal relaxation.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1600", alt: "Maasai Mara plains with safari vehicle", caption: "Classic East Africa savannah game-viewing" },
      { url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1600", alt: "Serengeti wildlife at golden hour", caption: "Serengeti and Ngorongoro wildlife circuit" },
      { url: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=1600", alt: "Zanzibar beach and turquoise water", caption: "Zanzibar beach extension" }
    ],
    services: ["4x4 Game Drives", "Cross-border Safari Handling", "Stone Town Flight Segment", "Beach Resort Stay", "English-speaking Driver Guide", "TravelGateway Safari Support"],
    itinerary: [
      { day: "Day 1", title: "Arrive Nairobi", description: "Arrive in Nairobi, settle in, and prepare for the safari briefing with time to recover from your international flight." },
      { day: "Day 2", title: "Loita Hills Maasai Experience", description: "Drive via the Rift Valley into Loita Hills for a meaningful Maasai village interaction and bush-camp atmosphere." },
      { day: "Day 3-4", title: "Maasai Mara Game Drives", description: "Spend two rewarding days in the Mara with full-day 4x4 game drives, classic big-cat country, and optional sunrise balloon planning." },
      { day: "Day 5", title: "Lake Victoria", description: "Travel toward the Kenya-Tanzania border and overnight near Lake Victoria for a slower lakeside break between safari sectors." },
      { day: "Day 6-7", title: "Serengeti National Park", description: "Enter the Serengeti for deep wildlife viewing with game drives across the plains and strong chances of predator sightings." },
      { day: "Day 8", title: "Ngorongoro Crater & Karatu", description: "Descend into Ngorongoro Crater for one of Africa's richest wildlife theaters before overnighting toward Karatu." },
      { day: "Day 9", title: "Mto wa Mbu", description: "Ease the pace with a local market and village day around Mto wa Mbu, adding cultural texture between the major parks." },
      { day: "Day 10", title: "Stone Town, Zanzibar", description: "Fly to Zanzibar and explore Stone Town's layered Swahili, Arab, and maritime heritage." },
      { day: "Day 11-13", title: "Zanzibar Northern Beaches", description: "Finish on Zanzibar's white-sand coast with time for spice tours, snorkeling, dhow outings, or pure beach relaxation." }
    ],
    faqs: [
      { question: "Who is this safari best for?", answer: "It is ideal for travelers who want both headline East African wildlife and a soft beach finish without having to choose between bush and sea." },
      { question: "Can this be made more premium?", answer: "Yes. We can upgrade camps, shift to fly-in sectors, and use more lodge-based safari pacing instead of longer overland sections." },
      { question: "When is the Great Migration best?", answer: "Migration timing moves through the year. We tailor the Kenya versus Tanzania emphasis based on your travel month." }
    ]
  },
  {
    id: 47,
    name: "Ultimate East Africa with Gorilla Encounter",
    country: "Kenya, Tanzania & Uganda/Rwanda Region",
    state: "Nairobi, Samburu, Nakuru, Naivasha, Amboseli, Serengeti, Ngorongoro",
    city: "Nairobi, Samburu, Nakuru, Naivasha, Amboseli, Lake Manyara, Serengeti, Ngorongoro, Arusha",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹4,25,000",
    rating: 5.0,
    description: "A deeper East African expedition built around Kenya safaris, Kilimanjaro views, Serengeti, Ngorongoro, and a gorilla-trekking extension.",
    longDescription: "Built in the spirit of Safari Seekers' long-form East African expedition with gorilla encounters, this route suits travelers who want an expansive safari rather than a short taster. It combines northern Kenya style, Rift Valley lakes, Amboseli's Kilimanjaro backdrop, cross-border Tanzania wildlife, and a primate-trekking finish that turns the trip into a once-in-a-lifetime African circuit.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80&w=1600", alt: "Elephants with Mount Kilimanjaro backdrop", caption: "Amboseli and Kilimanjaro panorama" },
      { url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1600", alt: "Gorilla trekking forest environment", caption: "Primate trekking finale" },
      { url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600", alt: "African safari jeep at sunset", caption: "Extended multi-country safari pacing" }
    ],
    services: ["Gorilla Permit Planning", "Cross-border Logistics", "Open Vehicle Game Drives", "Premium Lodge Upgrades", "Private Airport Transfers", "Indian Meal Coordination on Request"],
    itinerary: [
      { day: "Day 1-2", title: "Nairobi & Northern Kenya Start", description: "Arrive in Nairobi and begin the expedition with Kenya safari briefing and onward movement into classic wildlife country." },
      { day: "Day 3-5", title: "Samburu, Nakuru & Naivasha", description: "Track northern-species wildlife in Samburu, add flamingo and rhino country around Nakuru, and slow down with the lake landscapes of Naivasha." },
      { day: "Day 6-10", title: "Amboseli & Cross into Tanzania", description: "Continue to Amboseli for elephant herds beneath Kilimanjaro, then cross into Tanzania via Arusha and Lake Manyara." },
      { day: "Day 11-14", title: "Serengeti & Ngorongoro", description: "Spend meaningful safari time in the Serengeti before a dramatic crater-floor game drive in Ngorongoro." },
      { day: "Day 15", title: "Departure or Gorilla Extension", description: "Complete the safari in Arusha or continue with a separately timed gorilla-trekking add-on depending on permit availability and your final route design." }
    ],
    faqs: [
      { question: "Does this include gorilla permits in the starting fare?", answer: "Usually gorilla permits are priced separately because they are limited, highly regulated, and can change quickly." },
      { question: "Is this route too intense for first-time safari guests?", answer: "It is ambitious, so we recommend it for guests who want a big safari story and are comfortable with multi-sector travel." },
      { question: "Can the route be shortened?", answer: "Yes. We can split it into Kenya-only, Tanzania-only, or safari plus gorilla variants depending on time and budget." }
    ]
  },
  {
    id: 48,
    name: "South Africa Cape, Kruger & Garden Route",
    country: "South Africa",
    state: "Johannesburg, Sun City, Kruger, Garden Route, Cape Town",
    city: "Johannesburg, Sun City, Kruger National Park, Garden Route, Cape Town",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹2,95,000",
    rating: 4.9,
    description: "A polished South Africa holiday linking Sun City, Kruger game drives, scenic coastal stretches, and Cape Town icons.",
    longDescription: "Drawing from Safari Seekers' Kruger Calling and Western Cape routes, this South Africa itinerary balances safari, soft adventure, and urban style. It begins around Johannesburg and Sun City, moves into Kruger for Big Five game drives, then broadens into Garden Route scenery and finishes in Cape Town for a stronger all-rounder holiday that appeals to couples, families, and first-time Africa travelers.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&q=80&w=1600", alt: "Cape Town coastline and mountains", caption: "Cape Town city and coast finale" },
      { url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1600", alt: "South African safari landscape", caption: "Kruger Big Five safari atmosphere" },
      { url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=1600", alt: "Scenic road by the coast", caption: "Garden Route scenic drive" }
    ],
    services: ["Private Road Transfers", "Kruger Game Drives", "Cape Town Excursion Planning", "Garden Route Hotels", "English-speaking Assistance", "Family-friendly Safari Pacing"],
    itinerary: [
      { day: "Day 1-2", title: "Johannesburg & Sun City", description: "Arrive in South Africa, transfer to Sun City, and enjoy resort time with optional Pilanesberg excursions." },
      { day: "Day 3-4", title: "Kruger National Park", description: "Continue to Kruger for classic open-vehicle safari experiences with morning and evening game drives." },
      { day: "Day 5-7", title: "Garden Route", description: "Shift from bush to coast with scenic drives, light adventure, and stops that can include Oudtshoorn, wildlife ranches, and beach towns." },
      { day: "Day 8-10", title: "Cape Town Highlights", description: "Finish with Cape Town's mountains, coastline, wine-country options, and city dining scene." }
    ],
    faqs: [
      { question: "Is South Africa good for a first Africa trip?", answer: "Yes. It is one of the easiest entry points because it combines strong tourism infrastructure with safari and city experiences." },
      { question: "Can this include more safari nights?", answer: "Absolutely. We can increase Kruger time or add private-reserve lodge nights for a more premium wildlife focus." },
      { question: "What kind of travelers love this route most?", answer: "It works especially well for couples, honeymooners, and families who want safari without making the whole holiday only about game drives." }
    ]
  },
  {
    id: 49,
    name: "Kenya Classic Safari: Amboseli, Lakes & Maasai Mara",
    country: "Kenya",
    state: "Nairobi, Amboseli, Lake Naivasha, Lake Nakuru, Maasai Mara",
    city: "Nairobi, Amboseli National Park, Lake Naivasha, Lake Nakuru, Maasai Mara",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹2,35,000",
    rating: 4.9,
    description: "A polished Kenya safari linking Kilimanjaro-view elephant country, Rift Valley lakes, rhino habitat, and the legendary Maasai Mara.",
    longDescription: "This Kenya itinerary is designed for international travelers who want a complete first safari without overcomplicating the route. Inspired by Safari Seekers' Kenya safari circuits, it starts in Nairobi, continues to Amboseli for elephant herds beneath Mount Kilimanjaro, slows down at Lake Naivasha and Lake Nakuru, then finishes with big-cat game drives in the Maasai Mara. The pacing works well for couples, families, honeymooners, and India-origin international travelers planning their first East Africa holiday.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80&w=1600", alt: "Elephants walking with Mount Kilimanjaro in the distance", caption: "Amboseli elephant country with Kilimanjaro views" },
      { url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600", alt: "Safari vehicle crossing open savannah", caption: "Maasai Mara open-plains game drive" },
      { url: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?auto=format&fit=crop&q=80&w=1600", alt: "African lake landscape with birds", caption: "Rift Valley lake landscapes and birdlife" }
    ],
    services: ["Private 4x4 Safari Vehicle", "English-speaking Driver Guide", "Amboseli Game Drives", "Lake Naivasha Boat Option", "Maasai Mara Reserve Entry Planning", "Indian Meal Coordination on Request"],
    itinerary: [
      { day: "Day 1", title: "Nairobi Arrival", description: "Arrive in Nairobi with assisted transfer, safari briefing, and optional dinner reservation after your international flight." },
      { day: "Day 2", title: "Nairobi to Amboseli", description: "Drive through Maasai country to Amboseli National Park, arriving for lunch and an afternoon game drive with Kilimanjaro views when skies are clear." },
      { day: "Day 3", title: "Amboseli Elephant Country", description: "Spend the day tracking elephant herds, plains wildlife, wetlands, and birdlife with morning and afternoon game drives." },
      { day: "Day 4", title: "Lake Naivasha", description: "Continue to Lake Naivasha for a calmer Rift Valley stop with optional boat ride, hippo viewing, and Crescent Island-style walking safari planning." },
      { day: "Day 5", title: "Lake Nakuru to Maasai Mara", description: "Visit Lake Nakuru for rhino and lake scenery, then continue toward the Maasai Mara for your first evening in big-cat territory." },
      { day: "Day 6", title: "Full-Day Maasai Mara Safari", description: "Enjoy a full-day game drive across the Mara with picnic lunch, predator tracking, and optional Maasai village or balloon safari planning." },
      { day: "Day 7", title: "Mara Sunrise & Nairobi Departure", description: "Take a final sunrise game drive before returning to Nairobi for onward flights or an extra night." }
    ],
    faqs: [
      { question: "Is Kenya good for a first safari?", answer: "Yes. Kenya has strong safari infrastructure, iconic wildlife areas, and routes that can be planned comfortably for first-time Africa travelers." },
      { question: "When should we visit Maasai Mara?", answer: "July to October is popular for migration season, while January to March and shoulder months can offer excellent wildlife with fewer crowds." },
      { question: "Can vegetarian or Jain meals be arranged?", answer: "Yes. Nairobi hotels and selected safari lodges can support Indian dietary preferences when requested in advance." },
      { question: "Can this become a luxury flying safari?", answer: "Yes. Road sectors can be replaced with light aircraft flights and upgraded conservancy camps for a more premium experience." }
    ]
  },
  {
    id: 50,
    name: "Tanzania Northern Circuit: Tarangire, Serengeti & Ngorongoro",
    country: "Tanzania",
    state: "Arusha, Tarangire, Serengeti, Ngorongoro, Lake Manyara",
    city: "Arusha, Tarangire National Park, Serengeti National Park, Ngorongoro Crater, Lake Manyara",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹2,85,000",
    rating: 5.0,
    description: "A classic Tanzania safari through baobab landscapes, Serengeti plains, Ngorongoro Crater, and optional Lake Manyara.",
    longDescription: "Built around Safari Seekers' Tanzania northern circuit routing, this itinerary gives travelers the headline wildlife triangle of Tarangire, Serengeti, and Ngorongoro with enough time to feel the landscape change. It is ideal for guests who want a serious safari focus: elephants and baobabs in Tarangire, big-cat country in Serengeti, and the dramatic crater-floor wildlife density of Ngorongoro. Zanzibar can be added for a beach extension after the safari.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1600", alt: "Serengeti wildlife on golden savannah", caption: "Serengeti plains and predator country" },
      { url: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?auto=format&fit=crop&q=80&w=1600", alt: "Elephants moving across African grassland", caption: "Tarangire elephant and baobab landscapes" },
      { url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1600", alt: "Wildlife safari in lush African terrain", caption: "Ngorongoro highlands and crater game viewing" }
    ],
    services: ["Private 4x4 Pop-up Roof Vehicle", "Professional Safari Guide", "Park Fee Planning", "Serengeti Camp Stay", "Ngorongoro Crater Descent", "Zanzibar Extension Support"],
    itinerary: [
      { day: "Day 1", title: "Arrive Arusha", description: "Land at Kilimanjaro or Arusha, transfer to your lodge, and review the route, luggage, and park timing with your safari team." },
      { day: "Day 2", title: "Tarangire National Park", description: "Drive to Tarangire for baobab scenery, elephant herds, riverine wildlife, and a first proper game-drive experience." },
      { day: "Day 3", title: "Tarangire to Serengeti", description: "Travel through the highlands toward Serengeti, with picnic lunch and game viewing as the landscape opens into wide plains." },
      { day: "Day 4-5", title: "Serengeti Safari Days", description: "Spend two safari days in the Serengeti, tracking lions, leopards, cheetahs, grazers, and migration movement depending on season." },
      { day: "Day 6", title: "Ngorongoro Highlands", description: "Drive toward Ngorongoro with optional Olduvai Gorge or Maasai village visit, then overnight near the crater rim or Karatu." },
      { day: "Day 7", title: "Ngorongoro Crater", description: "Descend into the crater for one of Africa's most concentrated game-viewing days before returning toward Arusha." },
      { day: "Day 8", title: "Departure or Zanzibar Extension", description: "Depart from Arusha/Kilimanjaro or fly onward to Zanzibar for beaches, Stone Town, and spice-island downtime." }
    ],
    faqs: [
      { question: "Is Tanzania better than Kenya for migration?", answer: "Both can be excellent. Tanzania is strongest when the migration is in the Serengeti sectors, while Kenya is strongest when herds are in the Mara." },
      { question: "How many nights do we need in Serengeti?", answer: "Two nights is a practical minimum, while three or more nights are better for migration-focused and photography-led trips." },
      { question: "Can Zanzibar be added?", answer: "Yes. A three- to four-night Zanzibar extension works beautifully after the safari and can include Stone Town, spice farms, and beach resorts." },
      { question: "Is this route suitable for children?", answer: "Yes, with family-friendly lodges and sensible drive timing. Very young children may need shorter sectors or a fly-in version." }
    ]
  },
  {
    id: 51,
    name: "Rwanda Primate Luxury: Kigali, Volcanoes & Nyungwe",
    country: "Rwanda",
    state: "Kigali, Volcanoes National Park, Lake Kivu, Nyungwe Forest",
    city: "Kigali, Musanze, Volcanoes National Park, Lake Kivu, Nyungwe Forest National Park",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹4,75,000",
    rating: 5.0,
    description: "A premium Rwanda journey for mountain gorillas, golden monkeys, Kigali culture, Lake Kivu, and Nyungwe chimpanzee tracking.",
    longDescription: "This Rwanda itinerary is crafted for travelers who want Africa to feel intimate, green, and deeply meaningful. Rwanda's primate circuit is built around Volcanoes National Park for mountain gorilla trekking and Nyungwe for chimpanzee experiences, and this route turns those pillars into a refined journey with Kigali context, Lake Kivu downtime, forest lodges, and careful permit planning. It is best for luxury wildlife guests, honeymooners, conservation-minded travelers, and small private groups.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1600", alt: "Mountain gorilla in forest habitat", caption: "Volcanoes National Park gorilla trekking focus" },
      { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1600", alt: "Green mountainous rainforest landscape", caption: "Rwanda's thousand hills and forest scenery" },
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600", alt: "African lake and green hills", caption: "Lake Kivu relaxation between primate sectors" }
    ],
    services: ["Gorilla Permit Coordination", "Golden Monkey Trek Planning", "Nyungwe Chimpanzee Permit Support", "Luxury Lodge Selection", "Private 4x4 Transfers", "Kigali Cultural Guiding"],
    itinerary: [
      { day: "Day 1", title: "Kigali Arrival", description: "Arrive in Kigali, transfer privately to your hotel, and settle in with a refined city orientation based on flight timing." },
      { day: "Day 2", title: "Kigali Culture & Volcanoes Transfer", description: "Visit Kigali's key cultural and historical sites with sensitivity, then drive through the hills to Musanze near Volcanoes National Park." },
      { day: "Day 3", title: "Mountain Gorilla Trekking", description: "Attend the ranger briefing, trek with expert trackers, and spend the permitted hour observing a mountain gorilla family in the forest." },
      { day: "Day 4", title: "Golden Monkeys or Dian Fossey Trail", description: "Choose golden monkey trekking, the Dian Fossey conservation trail, or a slower lodge day with local community and craft experiences." },
      { day: "Day 5", title: "Lake Kivu", description: "Drive to Lake Kivu for a softer lakeside pause, sunset views, and time to decompress after the forest trek." },
      { day: "Day 6", title: "Nyungwe Forest", description: "Continue south toward Nyungwe, one of Africa's most important montane forests, with tea landscapes and scenic stops en route." },
      { day: "Day 7", title: "Chimpanzee Tracking & Canopy Walk", description: "Start early for chimpanzee tracking, then add the canopy walk or forest activity depending on fitness and weather." },
      { day: "Day 8", title: "Return to Kigali", description: "Drive back to Kigali for departure, or add Akagera National Park for a savannah Big Five contrast." }
    ],
    faqs: [
      { question: "Are gorilla permits included?", answer: "The itinerary includes permit coordination, but final permit cost is confirmed at booking because availability and rates are strictly regulated." },
      { question: "How fit do travelers need to be?", answer: "Moderate fitness is recommended. Trek duration can vary widely, so we plan porters, proper gear, and realistic expectations." },
      { question: "Is Rwanda suitable for luxury travelers?", answer: "Yes. Rwanda has some of Africa's most refined primate lodges and a polished private-travel experience when booked early." },
      { question: "Can Akagera National Park be added?", answer: "Yes. Akagera adds savannah wildlife and works well as a two-night extension after Nyungwe or before departure." }
    ]
  },
  {
    id: 52,
    name: "Kenya Mara Express Safari",
    country: "Kenya",
    state: "Nairobi, Maasai Mara",
    city: "Nairobi, Maasai Mara",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹1,58,000",
    rating: 4.8,
    description: "A compact Kenya safari for travelers who want the Maasai Mara without a long holiday commitment.",
    longDescription: "This short Kenya itinerary is built for guests with limited leave who still want the magic of open savannah, big cats, sunrise game drives, and a polished Nairobi arrival experience. It works well as a first Africa taster, honeymoon add-on, or premium short break from India and the Middle East.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600", alt: "Safari vehicle in Maasai Mara grasslands", caption: "Maasai Mara game drive country" },
      { url: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&q=80&w=1600", alt: "Lion resting in African savannah", caption: "Big-cat tracking in the Mara" }
    ],
    services: ["Nairobi Airport Assistance", "Mara Lodge Stay", "Shared or Private Game Drives", "Reserve Fee Planning", "Indian Meal Requests"],
    itinerary: [
      { day: "Day 1", title: "Nairobi Arrival", description: "Land in Nairobi, transfer to your hotel, and review safari timing with your local host." },
      { day: "Day 2", title: "Fly or Drive to Maasai Mara", description: "Continue to the Mara and enjoy an afternoon game drive across big-cat territory." },
      { day: "Day 3", title: "Full-Day Mara Safari", description: "Spend the day on game drives with picnic lunch, river viewpoints, and optional balloon safari planning." },
      { day: "Day 4", title: "Sunrise Safari", description: "Take an early game drive when wildlife is most active, followed by a relaxed lodge afternoon." },
      { day: "Day 5", title: "Return to Nairobi", description: "Return to Nairobi for shopping, dinner, or onward international flights." }
    ],
    faqs: [
      { question: "Is five days enough for Kenya?", answer: "It is enough for a focused Maasai Mara safari, especially if flights are used between Nairobi and the Mara." },
      { question: "Can this be upgraded?", answer: "Yes. Conservancy camps, fly-in sectors, and private vehicles can make it much more exclusive." },
      { question: "Who should choose this package?", answer: "Choose this when time is short but you want a proper safari highlight rather than a city-only trip." }
    ]
  },
  {
    id: 53,
    name: "Kenya Luxury Conservancy Safari",
    country: "Kenya",
    state: "Nairobi, Laikipia, Maasai Mara Conservancies",
    city: "Nairobi, Laikipia, Nanyuki, Maasai Mara",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹3,85,000",
    rating: 5.0,
    description: "A private, high-comfort Kenya safari through conservancy camps, wilderness lodges, and the Maasai Mara.",
    longDescription: "Designed for luxury safari guests, this Kenya journey prioritizes privacy, fewer vehicles, strong guiding, and distinctive lodge settings. It pairs Laikipia's rhino and wilderness atmosphere with conservancy-based Mara game viewing, making it ideal for honeymooners, photography travelers, and repeat Africa guests.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?auto=format&fit=crop&q=80&w=1600", alt: "Elephants on African grassland", caption: "Private conservancy game viewing" },
      { url: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80&w=1600", alt: "Elephants with Kilimanjaro-style savannah backdrop", caption: "Luxury safari landscapes" }
    ],
    services: ["Fly-in Safari Planning", "Luxury Tented Camps", "Private Conservancy Fees", "Expert Naturalist Guides", "Sundowner Experiences"],
    itinerary: [
      { day: "Day 1", title: "Nairobi Soft Landing", description: "Arrive in Nairobi with VIP-style assistance and an overnight at a premium city hotel." },
      { day: "Day 2-4", title: "Laikipia Wilderness", description: "Fly north for rhino tracking, walking safari options, night drives, and private lodge experiences." },
      { day: "Day 5-7", title: "Mara Conservancy", description: "Shift to a conservancy near the Maasai Mara for low-density game drives and sunset safari rituals." },
      { day: "Day 8", title: "Mara at Leisure", description: "Add photography time, cultural interaction, or a balloon safari depending on season and interest." },
      { day: "Day 9", title: "Fly Back to Nairobi", description: "Return by light aircraft and connect to your international departure." }
    ],
    faqs: [
      { question: "Why choose conservancies?", answer: "Conservancies usually mean fewer vehicles, flexible activities, and a more private safari atmosphere." },
      { question: "Is this suitable for honeymooners?", answer: "Yes. It is one of the best Kenya styles for romance, privacy, and premium camp design." },
      { question: "Can children join?", answer: "Yes, with age-appropriate camps and activity planning." }
    ]
  },
  {
    id: 54,
    name: "Kenya Safari & Diani Beach Retreat",
    country: "Kenya",
    state: "Nairobi, Amboseli, Maasai Mara, Diani Beach",
    city: "Nairobi, Amboseli, Maasai Mara, Diani",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1600",
    category: "Coastal",
    price: "₹2,95,000",
    rating: 4.9,
    description: "Kenya's classic safari highlights with a soft Indian Ocean beach finish at Diani.",
    longDescription: "This itinerary is for travelers who want Africa to feel complete: wildlife first, ocean after. It combines Amboseli's elephant country, Maasai Mara game drives, and a relaxed Diani Beach stay, creating a balanced holiday for families, couples, and honeymooners.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80&w=1600", alt: "African elephants in open country", caption: "Amboseli safari start" },
      { url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1600", alt: "Tropical beach and blue sea", caption: "Diani beach finale" }
    ],
    services: ["Safari and Beach Hotels", "Domestic Flight Planning", "Game Drives", "Beach Resort Stay", "Airport Transfers"],
    itinerary: [
      { day: "Day 1", title: "Nairobi Arrival", description: "Arrive in Nairobi and rest after your international flight." },
      { day: "Day 2-3", title: "Amboseli National Park", description: "Enjoy Kilimanjaro-view safaris, elephant herds, and wetlands." },
      { day: "Day 4-6", title: "Maasai Mara", description: "Continue to the Mara for predator tracking, big plains, and optional balloon safari." },
      { day: "Day 7-9", title: "Diani Beach", description: "Fly to the coast for white sand, reef waters, spa time, and optional water activities." },
      { day: "Day 10", title: "Depart Kenya", description: "Return to Nairobi or connect onward from the coast depending on flight routing." }
    ],
    faqs: [
      { question: "Is Diani better than Mombasa?", answer: "Diani generally feels more resort-led and polished for a beach extension." },
      { question: "Can we reduce safari drives?", answer: "Yes. Domestic flights can replace longer road sectors." },
      { question: "Is this good for families?", answer: "Yes. The mix of safari and beach keeps the pacing comfortable for children." }
    ]
  },
  {
    id: 55,
    name: "Tanzania Safari Taster",
    country: "Tanzania",
    state: "Arusha, Tarangire, Ngorongoro",
    city: "Arusha, Tarangire National Park, Ngorongoro Crater",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹1,95,000",
    rating: 4.8,
    description: "A shorter Tanzania safari focused on Tarangire elephants and the dramatic Ngorongoro Crater.",
    longDescription: "This six-day Tanzania package is ideal when travelers want a meaningful safari without committing to a longer Serengeti circuit. It keeps the route compact around Arusha, Tarangire, and Ngorongoro while still delivering strong wildlife, landscapes, and refined lodge stays.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?auto=format&fit=crop&q=80&w=1600", alt: "Elephants walking on safari plains", caption: "Tarangire elephant country" },
      { url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1600", alt: "African wildlife in green terrain", caption: "Ngorongoro wildlife viewing" }
    ],
    services: ["Private Safari Vehicle", "Lodge Stays", "Crater Descent Planning", "Park Fee Coordination", "Airport Transfers"],
    itinerary: [
      { day: "Day 1", title: "Arrive Arusha", description: "Settle into a lodge near Arusha and prepare for the safari route." },
      { day: "Day 2-3", title: "Tarangire Safari", description: "Explore baobab landscapes, elephants, and riverine wildlife." },
      { day: "Day 4", title: "Karatu Highlands", description: "Drive toward Karatu with optional cultural or coffee-estate stops." },
      { day: "Day 5", title: "Ngorongoro Crater", description: "Descend into the crater for a concentrated wildlife day." },
      { day: "Day 6", title: "Return to Arusha", description: "Drive back for shopping, lunch, and onward departure." }
    ],
    faqs: [
      { question: "Does this include Serengeti?", answer: "No. This route is intentionally shorter. Choose the Northern Circuit package if Serengeti is essential." },
      { question: "Is it good for first-time safari guests?", answer: "Yes. It is compact, scenic, and wildlife-rich." },
      { question: "Can Lake Manyara be added?", answer: "Yes. Lake Manyara can be included as an extra day or swapped into the route." }
    ]
  },
  {
    id: 56,
    name: "Tanzania Migration & Zanzibar",
    country: "Tanzania",
    state: "Serengeti, Ngorongoro, Zanzibar",
    city: "Arusha, Serengeti, Ngorongoro, Stone Town, Nungwi",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1600",
    category: "Tropical",
    price: "₹3,65,000",
    rating: 5.0,
    description: "A migration-focused Serengeti safari paired with Zanzibar beaches and Stone Town culture.",
    longDescription: "This Tanzania route is built for travelers who want both a serious wildlife story and a beautiful island finish. Safari sectors are adjusted seasonally around the Serengeti migration, then the pace softens in Zanzibar with spice-island culture, beaches, and resort time.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1600", alt: "Serengeti safari plains", caption: "Serengeti migration country" },
      { url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&q=80&w=1600", alt: "Tropical island beach", caption: "Zanzibar beach finale" }
    ],
    services: ["Seasonal Migration Routing", "Serengeti Camp Stay", "Zanzibar Resort", "Stone Town Guide", "Domestic Flights"],
    itinerary: [
      { day: "Day 1", title: "Arusha Arrival", description: "Arrive and overnight near Arusha before entering safari country." },
      { day: "Day 2-5", title: "Serengeti Migration Sector", description: "Fly or drive into the best Serengeti sector for your travel month and spend several days on game drives." },
      { day: "Day 6", title: "Ngorongoro Crater", description: "Descend into Ngorongoro for dense wildlife viewing and dramatic landscapes." },
      { day: "Day 7-10", title: "Zanzibar", description: "Fly to Zanzibar for Stone Town, spice farms, beach resort time, and optional snorkeling." },
      { day: "Day 11", title: "Depart Zanzibar", description: "Enjoy a final island breakfast before departure." }
    ],
    faqs: [
      { question: "When is migration season?", answer: "The migration moves through the Serengeti through the year, so the camp location should be matched to the month." },
      { question: "Is Zanzibar worth adding?", answer: "Yes. It gives the trip a relaxing finish after early safari mornings." },
      { question: "Can this be made honeymoon-style?", answer: "Yes. We can use romantic camps, private dinners, and premium beach resorts." }
    ]
  },
  {
    id: 57,
    name: "Rwanda Gorilla Weekend",
    country: "Rwanda",
    state: "Kigali, Volcanoes National Park",
    city: "Kigali, Musanze, Volcanoes National Park",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹2,85,000",
    rating: 4.9,
    description: "A short luxury Rwanda escape built around Kigali and one unforgettable gorilla trek.",
    longDescription: "This compact Rwanda itinerary is for guests who want the gorilla experience without a long Africa journey. It focuses on Kigali, Volcanoes National Park, careful permit timing, and high-comfort lodge stays, making it a refined add-on to East Africa or a standalone premium break.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1600", alt: "Gorilla in green forest", caption: "Volcanoes National Park gorilla trek" },
      { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1600", alt: "Green hills and forest", caption: "Rwanda hill-country landscapes" }
    ],
    services: ["Gorilla Permit Coordination", "Private Kigali Transfers", "Luxury Lodge Stay", "Porter Planning", "Trek Briefing"],
    itinerary: [
      { day: "Day 1", title: "Kigali Arrival", description: "Arrive in Kigali and settle into a premium hotel with a gentle city orientation if time allows." },
      { day: "Day 2", title: "Volcanoes National Park", description: "Drive to Musanze through Rwanda's green hills and check into your lodge near the park." },
      { day: "Day 3", title: "Gorilla Trekking", description: "Join the park briefing, trek to a gorilla family, and return for a relaxed lodge afternoon." },
      { day: "Day 4", title: "Return to Kigali", description: "Drive back to Kigali for departure or add a golden monkey trek." }
    ],
    faqs: [
      { question: "Is four days enough for Rwanda?", answer: "It is enough for a focused gorilla-trek journey when flights align well." },
      { question: "Are permits guaranteed?", answer: "Permits are subject to availability and should be secured early." },
      { question: "Can we add Akagera?", answer: "Yes. Add two nights for savannah wildlife and a different Rwanda landscape." }
    ]
  },
  {
    id: 58,
    name: "Rwanda Gorillas & Akagera Safari",
    country: "Rwanda",
    state: "Kigali, Volcanoes National Park, Akagera",
    city: "Kigali, Musanze, Akagera National Park",
    type: "International",
    region: "Africa",
    regionId: "africa",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹4,35,000",
    rating: 5.0,
    description: "A Rwanda circuit combining gorilla trekking with Akagera's savannah wildlife and lake scenery.",
    longDescription: "This Rwanda itinerary creates a fuller country story by pairing Volcanoes National Park with Akagera National Park. Travelers get rainforest primates, Kigali context, savannah game drives, lake views, and polished private transfers in one compact luxury circuit.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1600", alt: "Gorilla forest habitat", caption: "Gorilla trekking focus" },
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600", alt: "African lake and green hills", caption: "Akagera lake landscapes" }
    ],
    services: ["Gorilla Permit Planning", "Akagera Game Drives", "Private 4x4 Transfers", "Luxury Lodge Selection", "Kigali Guiding"],
    itinerary: [
      { day: "Day 1", title: "Kigali Arrival", description: "Arrive in Kigali and begin with a calm premium city stay." },
      { day: "Day 2-4", title: "Volcanoes National Park", description: "Transfer to Volcanoes for gorilla trekking and optional golden monkey or conservation trail activities." },
      { day: "Day 5", title: "Kigali to Akagera", description: "Return through Kigali and continue east to Akagera National Park." },
      { day: "Day 6-7", title: "Akagera Safari", description: "Enjoy savannah game drives, lake scenery, and a softer safari contrast to the rainforest." },
      { day: "Day 8", title: "Depart Kigali", description: "Drive back to Kigali for departure." }
    ],
    faqs: [
      { question: "Why add Akagera?", answer: "Akagera adds savannah wildlife and makes Rwanda feel more varied than a gorilla-only trip." },
      { question: "Is the route comfortable?", answer: "Yes. Rwanda's distances are manageable compared with many African safari circuits." },
      { question: "Can Nyungwe be added?", answer: "Yes. Add three to four nights for chimpanzee tracking and canopy walks." }
    ]
  },
  {
    id: 59,
    name: "Japan Golden Route: Tokyo, Kyoto & Osaka",
    country: "Japan",
    state: "Tokyo, Kyoto, Osaka",
    city: "Tokyo, Hakone, Kyoto, Osaka",
    type: "International",
    region: "East Asia",
    regionId: "east-asia",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1600",
    category: "Cultural",
    price: "₹2,45,000",
    rating: 4.9,
    description: "A refined first Japan journey with neon Tokyo, Mount Fuji views, temple Kyoto, and Osaka food streets.",
    longDescription: "This is the best first-timer Japan route for travelers who want balance: Tokyo energy, Hakone or Fuji scenery, Kyoto heritage, and Osaka dining. It keeps the pace polished, uses efficient rail planning, and works beautifully for couples, families, and culture-led travelers.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1600", alt: "Kyoto pagoda and traditional streets", caption: "Kyoto heritage atmosphere" },
      { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1600", alt: "Tokyo city lights", caption: "Tokyo city energy" }
    ],
    services: ["Rail Pass Planning", "Guided City Walks", "Kyoto Cultural Experiences", "Fuji Excursion", "Luggage Forwarding"],
    itinerary: [
      { day: "Day 1-2", title: "Tokyo Arrival", description: "Explore Shibuya, Asakusa, teamLab-style digital art options, and premium shopping districts." },
      { day: "Day 3", title: "Hakone or Fuji", description: "Take a day trip or overnight around Fuji views, lake scenery, and hot-spring atmosphere." },
      { day: "Day 4-6", title: "Kyoto", description: "Visit Fushimi Inari, Arashiyama, Kiyomizu-dera, Gion, and a tea ceremony or kimono experience." },
      { day: "Day 7", title: "Osaka", description: "Finish with Dotonbori, Osaka Castle, and street-food culture before departure." }
    ],
    faqs: [
      { question: "Is this good for first-time Japan?", answer: "Yes. It covers the most iconic Japan experiences without becoming too complicated." },
      { question: "Can vegetarian food be managed?", answer: "Yes, with advance planning and hotel/restaurant selection." },
      { question: "Should we use trains?", answer: "Yes. Trains are efficient, comfortable, and part of the Japan experience." }
    ]
  },
  {
    id: 60,
    name: "Japan Alps, Kanazawa & Kyoto Slow Trail",
    country: "Japan",
    state: "Tokyo, Nagano, Takayama, Kanazawa, Kyoto",
    city: "Tokyo, Nagano, Takayama, Shirakawa-go, Kanazawa, Kyoto",
    type: "International",
    region: "East Asia",
    regionId: "east-asia",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80&w=1600",
    category: "Cultural",
    price: "₹3,15,000",
    rating: 4.9,
    description: "A slower Japan route through alpine towns, samurai districts, gardens, and Kyoto culture.",
    longDescription: "Built for travelers who want something beyond the standard Golden Route, this Japan itinerary adds the Alps, Takayama, Shirakawa-go, Kanazawa, and Kyoto. It is a beautiful fit for repeat Japan guests, photographers, and culture lovers who enjoy atmospheric towns and graceful pacing.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80&w=1600", alt: "Japanese temple in mountain setting", caption: "Japan Alps heritage route" },
      { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1600", alt: "Kyoto traditional street", caption: "Kyoto finale" }
    ],
    services: ["Rail and Bus Routing", "Boutique Ryokan Stay", "Garden Entry Planning", "Village Excursion", "Luggage Forwarding"],
    itinerary: [
      { day: "Day 1-2", title: "Tokyo", description: "Arrive in Tokyo and enjoy curated city time before moving inland." },
      { day: "Day 3-4", title: "Nagano and Takayama", description: "Travel into mountain Japan with temples, old-town streets, and ryokan-style hospitality." },
      { day: "Day 5", title: "Shirakawa-go", description: "Visit the thatched-roof village landscapes and continue toward Kanazawa." },
      { day: "Day 6-7", title: "Kanazawa", description: "Explore Kenrokuen Garden, samurai districts, markets, and craft culture." },
      { day: "Day 8-10", title: "Kyoto", description: "End with Kyoto temples, tea culture, and lantern-lit lanes." }
    ],
    faqs: [
      { question: "Is this better than the Golden Route?", answer: "It is better for travelers who want slower, more atmospheric Japan beyond the headline cities." },
      { question: "Does it require many hotel changes?", answer: "There are several sectors, but luggage forwarding makes the route smoother." },
      { question: "Can it be private guided?", answer: "Yes. Private guides can be added in Tokyo, Kanazawa, and Kyoto." }
    ]
  },
  {
    id: 61,
    name: "Dubai & Abu Dhabi Premium Escape",
    country: "UAE",
    state: "Dubai, Abu Dhabi",
    city: "Dubai, Abu Dhabi",
    type: "International",
    region: "Middle East",
    regionId: "middle-east",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1600",
    category: "Metropolitan",
    price: "₹1,25,000",
    rating: 4.8,
    description: "A polished UAE city break with Dubai icons, desert luxury, Abu Dhabi culture, and premium shopping time.",
    longDescription: "This UAE route upgrades the standard Dubai holiday into a fuller city-and-culture escape. It combines Burj Khalifa, desert experiences, beach or marina hotels, Abu Dhabi's Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, and curated dining or shopping time.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1600", alt: "Dubai skyline", caption: "Dubai skyline and premium city energy" },
      { url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=1600", alt: "Middle Eastern mosque architecture", caption: "Abu Dhabi cultural extension" }
    ],
    services: ["Premium Hotel Stay", "Burj Khalifa Tickets", "Desert Safari", "Abu Dhabi Day Tour", "Private Transfers"],
    itinerary: [
      { day: "Day 1", title: "Dubai Arrival", description: "Arrive in Dubai and begin with marina or downtown dining." },
      { day: "Day 2", title: "Modern Dubai", description: "Visit Dubai Mall, Burj Khalifa, fountain show, and premium shopping areas." },
      { day: "Day 3", title: "Desert Luxury", description: "Enjoy a desert safari, sunset dunes, and dinner under the stars." },
      { day: "Day 4", title: "Abu Dhabi", description: "Visit Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, and Yas Island viewpoints." },
      { day: "Day 5-6", title: "Beach, Brunch or Theme Parks", description: "Choose a beach day, premium brunch, Miracle Garden, Global Village seasonally, or theme parks." }
    ],
    faqs: [
      { question: "How is this different from a short Dubai package?", answer: "It adds Abu Dhabi and a more premium pace, so the trip feels less rushed." },
      { question: "Can theme parks be added?", answer: "Yes. Ferrari World, Warner Bros., and other parks can be added." },
      { question: "Is this family-friendly?", answer: "Very. UAE works well for families, honeymooners, and short luxury breaks." }
    ]
  },
  {
    id: 62,
    name: "Thailand Islands & Bangkok Signature",
    country: "Thailand",
    state: "Bangkok, Phuket, Krabi",
    city: "Bangkok, Phuket, Phi Phi, Krabi",
    type: "International",
    region: "Southeast Asia",
    regionId: "southeast-asia",
    image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?auto=format&fit=crop&q=80&w=1600",
    category: "Tropical",
    price: "₹1,18,000",
    rating: 4.8,
    description: "A brighter Thailand holiday pairing Bangkok's energy with Phuket, Phi Phi, and Krabi island scenery.",
    longDescription: "This Thailand route is designed for travelers who want more than a basic Bangkok-Pattaya plan. It blends Bangkok markets and temples with Phuket nightlife, Phi Phi island waters, Krabi limestone cliffs, and enough resort time to feel like a proper tropical escape.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?auto=format&fit=crop&q=80&w=1600", alt: "Thai island coastline", caption: "Phuket and island-hopping waters" },
      { url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=1600", alt: "Bangkok city at night", caption: "Bangkok city energy" }
    ],
    services: ["Island Hopping Tours", "Bangkok City Tour", "Beach Resort Stay", "Domestic Flight Planning", "Airport Transfers"],
    itinerary: [
      { day: "Day 1-2", title: "Bangkok", description: "Explore temples, markets, riverfront dining, and modern shopping districts." },
      { day: "Day 3-4", title: "Phuket", description: "Fly to Phuket for beaches, viewpoints, and an optional evening entertainment show." },
      { day: "Day 5", title: "Phi Phi Islands", description: "Take a speedboat island tour with snorkeling and clear-water scenery." },
      { day: "Day 6-7", title: "Krabi", description: "Continue to Krabi for limestone cliffs, Railay-style beaches, and a gentler resort pace." },
      { day: "Day 8", title: "Departure", description: "Fly back from Phuket or Krabi depending on connections." }
    ],
    faqs: [
      { question: "Is this better than Pattaya?", answer: "For island scenery and a more premium beach feel, Phuket and Krabi are usually stronger." },
      { question: "Can this be honeymoon-style?", answer: "Yes. Pool villas and private island tours can be added." },
      { question: "Is it suitable during monsoon?", answer: "It can be planned, but island operations depend on sea conditions." }
    ]
  },
  {
    id: 63,
    name: "Maldives Honeymoon Lagoon Escape",
    country: "Maldives",
    state: "North Male or South Male Atoll",
    city: "Male, Private Island Resort",
    type: "International",
    region: "Indian Ocean",
    regionId: "indian-ocean",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1600",
    category: "Tropical",
    price: "₹1,45,000",
    rating: 5.0,
    description: "A romantic Maldives island stay with villa upgrades, sunset experiences, and soft luxury pacing.",
    longDescription: "This Maldives package is crafted for honeymooners and couples who want the classic lagoon dream: beach villas, overwater upgrades, turquoise water, floating breakfast options, sunset cruises, spa time, and a resort chosen to match budget and style.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1600", alt: "Maldives turquoise lagoon", caption: "Lagoon and villa atmosphere" },
      { url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=1600", alt: "Overwater villas in tropical water", caption: "Overwater villa upgrade option" }
    ],
    services: ["Private Island Resort", "Speedboat or Seaplane Transfer", "Meal Plan Selection", "Romantic Add-ons", "Water Activity Planning"],
    itinerary: [
      { day: "Day 1", title: "Arrive in Maldives", description: "Land in Male and transfer by speedboat or seaplane to your island resort." },
      { day: "Day 2", title: "Lagoon Leisure", description: "Relax on the beach, snorkel the house reef, and enjoy resort dining." },
      { day: "Day 3", title: "Romantic Experiences", description: "Add a couple spa ritual, private dinner, sunset cruise, or floating breakfast." },
      { day: "Day 4", title: "Water Villas and Watersports", description: "Enjoy kayaking, snorkeling, or a villa upgrade day with uninterrupted ocean views." },
      { day: "Day 5", title: "Departure", description: "Transfer back to Male for your flight." }
    ],
    faqs: [
      { question: "Which meal plan is best?", answer: "All-inclusive is useful if you prefer predictable costs; half-board can work for lighter travelers." },
      { question: "Do Indians need a visa?", answer: "Maldives usually offers visa on arrival for Indian passport holders, subject to valid documents." },
      { question: "Can children join?", answer: "Yes, but this package is designed mainly for couples." }
    ]
  },
  {
    id: 64,
    name: "Swiss Scenic Rail & Lakes",
    country: "Switzerland",
    state: "Zurich, Lucerne, Interlaken, Zermatt",
    city: "Zurich, Lucerne, Interlaken, Zermatt",
    type: "International",
    region: "Europe",
    regionId: "europe",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1600",
    category: "Adventure",
    price: "₹3,25,000",
    rating: 5.0,
    description: "A premium Switzerland rail holiday through lakes, alpine villages, Jungfrau scenery, and Zermatt.",
    longDescription: "This Switzerland itinerary is for travelers who want the country to feel cinematic. It uses scenic trains, lake towns, mountain railways, Jungfraujoch or Glacier-region experiences, and refined hotels to create a polished Swiss holiday with minimal road stress.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1600", alt: "Swiss alpine lake and mountains", caption: "Swiss lake and mountain views" },
      { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1600", alt: "Mountain landscape", caption: "Alpine rail journey atmosphere" }
    ],
    services: ["Swiss Rail Planning", "Mountain Excursion Tickets", "Lake Town Hotels", "Scenic Train Routing", "Visa Documentation Support"],
    itinerary: [
      { day: "Day 1-2", title: "Zurich and Lucerne", description: "Arrive in Zurich and continue to Lucerne for lake walks, chapel bridge, and mountain options." },
      { day: "Day 3-4", title: "Interlaken and Jungfrau", description: "Explore Interlaken, Grindelwald, Lauterbrunnen, and a Jungfraujoch or similar peak excursion." },
      { day: "Day 5-6", title: "Zermatt", description: "Travel by rail toward Zermatt for Matterhorn views and alpine village atmosphere." },
      { day: "Day 7", title: "Scenic Rail Return", description: "Use a scenic rail sector back toward Zurich or extend into Italy or France." }
    ],
    faqs: [
      { question: "Is Switzerland best by train?", answer: "Yes. Rail is efficient, scenic, and often more comfortable than driving." },
      { question: "Can Indian meals be included?", answer: "Indian dining can be planned in major towns, though alpine villages may need advance coordination." },
      { question: "Can this be combined with Paris?", answer: "Yes. Paris pairs well before or after Switzerland." }
    ]
  }
];

const premiumIndiaPackageRows = [
  {
    state: "Rajasthan",
    name: "Rajasthan Short Royal Escape",
    city: "Jaipur, Pushkar, Ajmer",
    category: "Cultural",
    days: 4,
    price: "₹32,000",
    description: "A compact Rajasthan break for palaces, bazaars, temple towns, and heritage dining.",
    highlights: ["Jaipur palace circuit", "Pushkar lake walk", "Ajmer heritage stop"],
    image: "https://images.unsplash.com/photo-1578155173088-710a9aef3849?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Rajasthan",
    name: "Rajasthan Desert & Forts Journey",
    city: "Jodhpur, Jaisalmer, Osian",
    category: "Cultural",
    days: 6,
    price: "₹58,000",
    description: "A desert-led route through blue-city forts, golden sandstone, dunes, and folk evenings.",
    highlights: ["Mehrangarh Fort", "Jaisalmer havelis", "Luxury desert camp"],
    image: "https://images.unsplash.com/photo-1577083753695-e010191bacb5?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Kerala",
    name: "Kerala Backwater Weekend",
    city: "Kochi, Alleppey, Kumarakom",
    category: "Tropical",
    days: 4,
    price: "₹36,500",
    description: "A soft Kerala escape with Kochi heritage, backwaters, houseboat time, and resort relaxation.",
    highlights: ["Kochi heritage quarter", "Alleppey houseboat", "Kumarakom lake resort"],
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Kerala",
    name: "Kerala Ayurveda & Wellness Retreat",
    city: "Kochi, Munnar, Thekkady, Kumarakom",
    category: "Tropical",
    days: 8,
    price: "₹82,000",
    description: "A slower Kerala wellness holiday combining tea hills, spice country, Ayurveda, and backwaters.",
    highlights: ["Munnar tea trails", "Thekkady spice gardens", "Ayurveda consultation"],
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Gujarat",
    name: "Gujarat White Rann Festival Escape",
    city: "Ahmedabad, Bhuj, Hodka, Dhordo, Mandvi",
    category: "Seasonal",
    days: 5,
    price: "₹49,000",
    description: "A seasonal Gujarat journey through Kutch craft villages, white desert evenings, and coastal Mandvi.",
    highlights: ["White Rann sunset", "Kutch craft villages", "Mandvi coast"],
    image: "https://images.unsplash.com/photo-1578155173088-710a9aef3849?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Gujarat",
    name: "Gujarat Jyotirlinga & Dwarka Darshan",
    city: "Ahmedabad, Dwarka, Somnath, Nageshwar, Porbandar",
    category: "Pilgrimage",
    days: 6,
    price: "₹45,500",
    description: "A coastal pilgrimage route linking Dwarka, Somnath, Nageshwar, and sacred Gujarat heritage.",
    highlights: ["Dwarkadhish Temple", "Somnath aarti", "Nageshwar Jyotirlinga"],
    image: mediaUrl("Dwarkadhish Temple, Dwarka, Gujarat.JPG")
  },
  {
    state: "Uttar Pradesh",
    name: "Uttar Pradesh Golden Triangle Plus Varanasi",
    city: "Agra, Lucknow, Prayagraj, Varanasi",
    category: "Cultural",
    days: 7,
    price: "₹62,000",
    description: "A refined Uttar Pradesh circuit for Taj Mahal, Nawabi culture, Sangam, and Varanasi rituals.",
    highlights: ["Taj Mahal sunrise", "Lucknow food walk", "Varanasi Ganga aarti"],
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Uttar Pradesh",
    name: "Ayodhya, Kashi & Prayagraj Sacred Trail",
    city: "Ayodhya, Prayagraj, Varanasi, Sarnath",
    category: "Pilgrimage",
    days: 5,
    price: "₹42,000",
    description: "A sacred Uttar Pradesh route for Ram Mandir, Kashi Vishwanath, Sangam, and Sarnath.",
    highlights: ["Ayodhya Ram Mandir", "Kashi Vishwanath corridor", "Prayagraj Sangam"],
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Maharashtra",
    name: "Maharashtra Mumbai, Caves & Vineyards",
    city: "Mumbai, Nashik, Ajanta, Ellora, Aurangabad",
    category: "Cultural",
    days: 6,
    price: "₹59,000",
    description: "A stylish Maharashtra itinerary through Mumbai icons, Nashik vineyards, and UNESCO cave heritage.",
    highlights: ["Mumbai heritage drive", "Nashik wine tasting", "Ajanta and Ellora caves"],
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Maharashtra",
    name: "Maharashtra Konkan Coastal Drive",
    city: "Mumbai, Alibaug, Ratnagiri, Ganpatipule, Tarkarli",
    category: "Coastal",
    days: 7,
    price: "₹64,500",
    description: "A coastal Maharashtra holiday with sea forts, beaches, Konkani food, and relaxed drives.",
    highlights: ["Alibaug coast", "Ratnagiri heritage", "Tarkarli beach time"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Karnataka",
    name: "Karnataka Hampi, Coorg & Mysuru",
    city: "Bengaluru, Hampi, Mysuru, Coorg",
    category: "Cultural",
    days: 7,
    price: "₹67,000",
    description: "A Karnataka story across UNESCO ruins, palace heritage, coffee estates, and gentle hill scenery.",
    highlights: ["Hampi ruins", "Mysuru Palace", "Coorg coffee estate"],
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Karnataka",
    name: "Karnataka Coastal Temples & Gokarna",
    city: "Mangaluru, Udupi, Murudeshwar, Gokarna",
    category: "Coastal",
    days: 5,
    price: "₹46,000",
    description: "A coastal Karnataka route through temple towns, seafood culture, beaches, and slower seaside stays.",
    highlights: ["Udupi temple town", "Murudeshwar coast", "Gokarna beaches"],
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Tamil Nadu",
    name: "Tamil Nadu Temple Architecture Trail",
    city: "Chennai, Mahabalipuram, Thanjavur, Madurai, Rameswaram",
    category: "Pilgrimage",
    days: 7,
    price: "₹61,000",
    description: "A temple-led Tamil Nadu journey through Chola monuments, coastal shrines, and living rituals.",
    highlights: ["Mahabalipuram monuments", "Brihadeeswarar Temple", "Madurai Meenakshi"],
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Himachal Pradesh",
    name: "Himachal Family Mountain Escape",
    city: "Shimla, Manali, Solang Valley, Kullu",
    category: "Adventure",
    days: 6,
    price: "₹48,500",
    description: "A family-friendly Himachal route with hill stations, valley drives, light adventure, and scenic stays.",
    highlights: ["Shimla mall road", "Manali valleys", "Solang adventure"],
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "Goa",
    name: "Goa Heritage, Beaches & Private Villa",
    city: "Panjim, Fontainhas, Old Goa, North Goa, South Goa",
    category: "Coastal",
    days: 5,
    price: "₹52,000",
    description: "A more polished Goa itinerary with Portuguese quarters, beach clubs, private villa stays, and slow dining.",
    highlights: ["Fontainhas walk", "Old Goa churches", "South Goa beach day"],
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1600"
  },
  {
    state: "West Bengal",
    name: "Bengal Culture, Tea & Himalayan Toy Train",
    city: "Kolkata, Shantiniketan, Darjeeling, Kalimpong",
    category: "Cultural",
    days: 7,
    price: "₹58,500",
    description: "A Bengal journey from Kolkata culture and art towns to Darjeeling tea gardens and Himalayan rail charm.",
    highlights: ["Kolkata heritage", "Shantiniketan art", "Darjeeling toy train"],
    image: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=1600"
  }
];

const premiumIndiaPackages: Destination[] = premiumIndiaPackageRows.map((row, index) => ({
  id: 200 + index,
  name: row.name,
  country: "India",
  state: row.state,
  city: row.city,
  type: "Domestic",
  region: "Curated India",
  regionId: "india-curated",
  image: row.image,
  category: row.category,
  price: row.price,
  rating: index % 3 === 0 ? 5.0 : 4.9,
  description: row.description,
  longDescription: `${row.name} is designed as a polished India itinerary with a clear ${row.days}-day pace, premium routing, and practical support for families, couples, senior travelers, and inbound guests who want ${row.state} to feel easy, memorable, and well curated.`,
  galleryImages: curatedGalleryForPackage(row),
  services: ["Private Transfers", "Hand-picked Hotels", "Local Expert Guides", "Daily Breakfast", "Flexible Sightseeing", "Brochure Download"],
  itinerary: [
    { day: "Day 1", title: `${row.state} Arrival`, description: `Arrive into ${row.city.split(",")[0].trim()} with assisted transfer, hotel check-in, and a relaxed start based on your flight or train timing.` },
    { day: `Day 2-${Math.max(2, Math.ceil(row.days / 2))}`, title: row.highlights[0], description: `Begin the main journey with ${row.highlights[0].toLowerCase()}, local guiding, curated meals, and time for photography or shopping.` },
    { day: `Day ${Math.max(3, Math.ceil(row.days / 2) + 1)}-${Math.max(4, row.days - 1)}`, title: row.highlights[1], description: `Continue into ${row.highlights[1].toLowerCase()} with comfortable pacing, private transfers, and optional experiences based on traveler style.` },
    { day: `Day ${row.days}`, title: `${row.highlights[2]} & Departure`, description: `Close with ${row.highlights[2].toLowerCase()}, final local experiences, and onward departure planning.` }
  ],
  faqs: [
    { question: `Who should choose ${row.name}?`, answer: `It is best for travelers who want a ${row.days}-day ${row.state} package with polished logistics, attractive stays, and clear sightseeing priorities.` },
    { question: "Can this itinerary be customized?", answer: "Yes. Hotels, pace, vehicle type, meals, guides, and add-on nights can be adjusted for budget, family needs, honeymoon style, or senior-friendly travel." },
    { question: "Does the price include flights?", answer: "The listed price is a starting land-package estimate. Flights, peak-season supplements, and special permits are quoted based on travel dates." }
  ]
}));

const statewiseIndiaRouteRows = [
  "Andhra Pradesh|Visakhapatnam, Araku Valley, Vijayawada, Amaravati|Coastal|₹42,000|Bay of Bengal coast, Eastern Ghats, Buddhist sites, and temple heritage|Vizag coastline|Araku coffee valley|Amaravati and Vijayawada temples|https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600",
  "Arunachal Pradesh|Itanagar, Ziro, Bomdila, Tawang|Adventure|₹68,000|high Himalayan monasteries, valleys, tribal culture, and remote mountain drives|Ziro valley stay|Sela Pass crossing|Tawang monastery|https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1600",
  "Assam|Guwahati, Kaziranga, Majuli, Sivasagar|Adventure|₹55,000|rhino safaris, river islands, tea gardens, and Ahom heritage|Kaziranga safari|Majuli culture|Sivasagar monuments|https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1600",
  "Bihar|Patna, Bodh Gaya, Rajgir, Nalanda, Vaishali|Cultural|₹39,500|Buddhist circuit sites, ancient universities, Jain heritage, and Ganga plains history|Mahabodhi temple|Nalanda and Rajgir|Patna riverfront|https://images.unsplash.com/photo-1652288156243-a7505dcaa0ec?auto=format&fit=crop&q=80&w=1600",
  "Chhattisgarh|Raipur, Sirpur, Barnawapara, Chitrakote, Bastar|Adventure|₹48,000|waterfalls, forests, tribal craft, and lesser-seen central India heritage|Chitrakote waterfall|Bastar craft villages|Sirpur archaeology|https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1600",
  "Goa|Panjim, Old Goa, North Goa, South Goa|Coastal|₹34,000|beach resorts, Portuguese heritage, food trails, and soft adventure|Old Goa churches|South Goa beaches|Mandovi and Fontainhas|https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1600",
  "Gujarat|Ahmedabad, Statue of Unity, Gir, Somnath, Dwarka, Kutch|Cultural|₹64,000|UNESCO city heritage, wildlife, temples, white desert, and crafts|Ahmedabad heritage walk|Gir lion safari|Rann of Kutch sunset|https://images.unsplash.com/photo-1578155173088-710a9aef3849?auto=format&fit=crop&q=80&w=1600",
  "Haryana|Gurugram, Kurukshetra, Sultanpur, Pinjore|Cultural|₹26,500|Delhi gateway escapes, Mahabharata heritage, birding, and palace gardens|Kurukshetra circuit|Sultanpur bird sanctuary|Pinjore gardens|https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1600",
  "Himachal Pradesh|Shimla, Manali, Dharamshala, Dalhousie|Adventure|₹47,500|Himalayan hill stations, monasteries, valleys, and family-friendly mountain stays|Shimla colonial walk|Manali and Solang Valley|Dharamshala monasteries|https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1600",
  "Jharkhand|Ranchi, Netarhat, Betla, Deoghar|Adventure|₹38,500|waterfalls, forests, plateau viewpoints, and pilgrimage|Ranchi waterfall trail|Netarhat sunrise|Betla and Deoghar|https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1600",
  "Karnataka|Bengaluru, Mysuru, Coorg, Hampi, Gokarna|Cultural|₹58,000|palaces, coffee estates, UNESCO ruins, beaches, and city culture|Mysuru Palace|Coorg plantations|Hampi ruins|https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1600",
  "Kerala|Kochi, Munnar, Thekkady, Alleppey, Kovalam|Tropical|₹52,500|backwaters, tea hills, spice gardens, Ayurveda, and beach relaxation|Munnar tea country|Alleppey houseboat|Kochi heritage|https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1600",
  "Madhya Pradesh|Bhopal, Sanchi, Khajuraho, Bandhavgarh, Orchha|Cultural|₹62,000|tiger reserves, temples, stupas, forts, and central India heritage|Sanchi stupa|Khajuraho temples|Bandhavgarh safari|https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&q=80&w=1600",
  "Maharashtra|Mumbai, Ajanta, Ellora, Nashik, Pune, Konkan|Cultural|₹56,000|Mumbai icons, cave heritage, vineyards, forts, and Konkan coastline|Mumbai heritage drive|Ajanta and Ellora|Nashik vineyards|https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1600",
  "Manipur|Imphal, Loktak Lake, Moirang, Ukhrul|Adventure|₹52,000|floating lake landscapes, martial culture, handloom, and gentle hill country|Loktak Lake|Imphal markets|Ukhrul hills|https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1600",
  "Meghalaya|Shillong, Cherrapunji, Dawki, Mawlynnong|Adventure|₹49,500|living root bridges, waterfalls, caves, clear rivers, and Khasi culture|Cherrapunji waterfalls|Dawki river|Mawlynnong walk|https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1600",
  "Mizoram|Aizawl, Reiek, Hmuifang, Champhai|Adventure|₹50,000|quiet hill towns, viewpoints, Mizo culture, and slow scenic drives|Aizawl viewpoints|Reiek village|Champhai valley|https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1600",
  "Nagaland|Dimapur, Kohima, Khonoma, Dzukou Valley|Adventure|₹54,500|tribal culture, village stays, WWII history, and Dzukou Valley trekking|Kohima war cemetery|Khonoma village|Dzukou Valley trek|https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1600",
  "Odisha|Bhubaneswar, Puri, Konark, Chilika, Raghurajpur|Cultural|₹44,500|temples, beaches, crafts, lake ecology, and classical culture|Konark Sun Temple|Puri and Raghurajpur|Chilika lagoon|https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=1600",
  "Punjab|Amritsar, Chandigarh, Anandpur Sahib, Patiala|Cultural|₹36,500|Golden Temple, Sikh heritage, food trails, and border ceremony energy|Golden Temple|Wagah ceremony|Patiala heritage|https://commons.wikimedia.org/wiki/Special:FilePath/Golden%20Temple%20Amritsar.jpg?width=1600",
  "Rajasthan|Jaipur, Jodhpur, Jaisalmer, Udaipur|Cultural|₹68,000|forts, palaces, desert camps, lakes, and royal hospitality|Jaipur forts|Jaisalmer desert|Udaipur lakes|https://images.unsplash.com/photo-1578155173088-710a9aef3849?auto=format&fit=crop&q=80&w=1600",
  "Sikkim|Gangtok, Tsomgo Lake, Pelling, Ravangla|Adventure|₹57,500|Himalayan monasteries, mountain viewpoints, lakes, and slow nature stays|Gangtok monasteries|Tsomgo Lake|Pelling views|https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=1600",
  "Tamil Nadu|Chennai, Mahabalipuram, Madurai, Rameswaram|Cultural|₹50,000|Dravidian temples, coastal heritage, classical culture, and cuisine|Mahabalipuram shore temples|Madurai Meenakshi|Rameswaram coast|https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1600",
  "Telangana|Hyderabad, Warangal, Ramoji Film City, Nagarjuna Sagar|Metropolitan|₹37,500|Hyderabad heritage, food, film experiences, and Deccan fort architecture|Charminar old city|Golconda Fort|Warangal temples|https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=1600",
  "Tripura|Agartala, Ujjayanta Palace, Neermahal, Unakoti|Cultural|₹43,500|palaces, lake monuments, rock carvings, and northeastern culture|Ujjayanta Palace|Neermahal lake palace|Unakoti rock reliefs|https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1600",
  "Uttar Pradesh|Agra, Lucknow, Ayodhya, Varanasi, Sarnath|Cultural|₹59,500|Taj Mahal, Nawabi culture, Ganga rituals, Buddhist heritage, and sacred cities|Taj Mahal sunrise|Lucknow culture|Varanasi aarti|https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1600",
  "Uttarakhand|Rishikesh, Mussoorie, Jim Corbett, Nainital|Adventure|₹46,000|Himalayan foothills, yoga, wildlife, lakes, and soft adventure|Rishikesh Ganga|Jim Corbett safari|Nainital lake stay|https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1600",
  "West Bengal|Kolkata, Sundarbans, Darjeeling, Kalimpong|Cultural|₹55,500|colonial Kolkata, mangrove safaris, tea hills, literature, and food|Kolkata heritage|Sundarbans boat safari|Darjeeling tea hills|https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600"
];

const statewiseIndiaPackages: Destination[] = statewiseIndiaRouteRows.map((row, index) => {
  const [state, city, category, price, theme, highlightOne, highlightTwo, highlightThree, image] = row.split("|");

  return {
    id: 100 + index,
    name: `${state} Signature Journey`,
    country: "India",
    state,
    city,
    type: "Domestic",
    region: state,
    regionId: "india-statewise",
    image,
    category,
    price,
    rating: 4.8,
    description: `${state} package covering ${theme}.`,
    longDescription: `A polished India itinerary for ${state}, created for travelers who want a clear route, good hotels, guided sightseeing, and enough flexibility for premium upgrades. The journey focuses on ${theme}.`,
    galleryImages: [
      { url: image, alt: `${state} travel landscape`, caption: `${state} signature journey` }
    ],
    services: ["Private AC Vehicle", "Curated Hotels", "Local Guide Support", "Airport/Rail Assistance", "Flexible Upgrade Options", "Meal Preference Planning"],
    itinerary: [
      { day: "Day 1", title: `${state} Arrival`, description: `Arrive and begin with a relaxed orientation around ${city.split(",")[0].trim()}, with hotel check-in and local dining suggestions.` },
      { day: "Day 2", title: highlightOne, description: `Explore ${highlightOne.toLowerCase()} with private transfers, local context, and photography-friendly timing.` },
      { day: "Day 3", title: highlightTwo, description: `Continue into ${highlightTwo.toLowerCase()}, balancing sightseeing, regional food, and comfort breaks.` },
      { day: "Day 4", title: highlightThree, description: `Complete the journey with ${highlightThree.toLowerCase()} before departure or an optional extension.` }
    ],
    faqs: [
      { question: `Who is this ${state} package best for?`, answer: "It works for couples, families, small groups, and travelers who want a comfortable state-focused introduction instead of a rushed multi-state tour." },
      { question: "Can this be made luxury?", answer: "Yes. Hotels, vehicles, guides, dining, and special experiences can be upgraded based on budget and travel style." },
      { question: "Can more days be added?", answer: "Yes. The route is designed as a flexible base and can be expanded with nearby cities, wildlife, wellness, pilgrimage, or beach extensions." }
    ]
  };
});

const indiaCruisePackages: Destination[] = [
  {
    id: 128,
    name: "Mumbai to Lakshadweep Cordelia Cruise Escape",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai, High Seas, Lakshadweep, Mumbai",
    type: "Cruise",
    region: "Maharashtra",
    regionId: "india-cruises",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1600",
    category: "Cruise",
    price: "₹25,988",
    rating: 4.8,
    description: "A Mumbai round-trip cruise package inspired by Cordelia's 4-night Mumbai-Lakshadweep sailings aboard The Empress.",
    longDescription: "A short premium sea holiday from Mumbai for guests who want an easy cruise experience without international travel. The route is based on published 2026 Cordelia Cruise patterns for Mumbai-Lakshadweep round trips, with onboard entertainment, ocean-view relaxation, and shore-excursion planning subject to sailing conditions and cruise-line confirmation.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1600", alt: "Cruise ship at sea", caption: "Premium cruise holiday from Mumbai" },
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600", alt: "Tropical island beach", caption: "Lakshadweep-style beach extension" }
    ],
    services: ["Cruise Cabin Planning", "Mumbai Port Assistance", "Meal Preference Support", "Onboard Activity Guidance", "Shore Excursion Advice", "Pre/Post Mumbai Hotel Add-on"],
    itinerary: [
      { day: "Day 1", title: "Mumbai Embarkation", description: "Board the cruise at Mumbai, complete check-in, settle into the cabin, and enjoy the first evening at sea." },
      { day: "Day 2", title: "High Seas", description: "A full day for onboard dining, entertainment, pool deck time, spa options, and ocean-view relaxation." },
      { day: "Day 3", title: "Lakshadweep Shore Day", description: "Arrive around Lakshadweep for beach and marine-life excursions, subject to cruise-line permissions and weather." },
      { day: "Day 4", title: "High Seas Return", description: "Return toward Mumbai with leisure time, shows, and farewell dinner onboard." },
      { day: "Day 5", title: "Mumbai Disembarkation", description: "Disembark in Mumbai and connect to onward travel or add a Mumbai city stay." }
    ],
    faqs: [
      { question: "Is the sailing schedule fixed?", answer: "Cruise routes, ports, and timings can change due to weather, port permissions, and cruise-line operations. Final itinerary must be reconfirmed at booking." },
      { question: "Is this good for families?", answer: "Yes. It is suitable for families, couples, friend groups, celebrations, and first-time cruise guests." },
      { question: "Can Jain or vegetarian meals be requested?", answer: "Meal requests should be placed at booking. Availability depends on cruise-line policy and sailing inventory." }
    ]
  },
  {
    id: 129,
    name: "Mumbai, Goa & Lakshadweep Cordelia Cruise",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai, Goa, Lakshadweep, High Seas, Mumbai",
    type: "Cruise",
    region: "Maharashtra",
    regionId: "india-cruises",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1600",
    category: "Cruise",
    price: "₹32,485",
    rating: 4.9,
    description: "A 5-night India cruise concept from Mumbai covering Goa, Lakshadweep, high seas, and a Mumbai return.",
    longDescription: "A fuller coastal cruise itinerary for travelers who want Goa and Lakshadweep in one sea holiday. The structure follows published Cordelia Cruise 2026 patterns for 5-night Mumbai-Goa-Lakshadweep round trips, with cabin category, shore excursions, and sailing dates finalized at booking.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1600", alt: "Cruise deck at sea", caption: "India coastal cruise from Mumbai" },
      { url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1600", alt: "Goa beach", caption: "Goa coastal stop" }
    ],
    services: ["Cruise Booking Support", "Cabin Category Guidance", "Mumbai Port Transfers", "Goa Shore Planning", "Lakshadweep Excursion Advice", "Celebration Add-ons"],
    itinerary: [
      { day: "Day 1", title: "Mumbai Embarkation", description: "Board at Mumbai and begin the cruise with dinner, entertainment, and overnight sailing." },
      { day: "Day 2", title: "At Sea", description: "Enjoy onboard shows, restaurants, lounges, and deck activities while sailing toward Goa." },
      { day: "Day 3", title: "Goa Stop", description: "Arrive in Goa for optional shore excursions, beaches, churches, or leisure depending on cruise timing." },
      { day: "Day 4", title: "Lakshadweep", description: "Experience Lakshadweep's beaches and lagoon scenery through approved cruise excursions, subject to local permissions." },
      { day: "Day 5", title: "High Seas", description: "Relax onboard with entertainment, dining, and sea views on the return sector." },
      { day: "Day 6", title: "Mumbai Return", description: "Disembark in Mumbai and connect to flights, rail, or a city extension." }
    ],
    faqs: [
      { question: "Does this include Cordelia tickets?", answer: "The package is designed for Cordelia-style sailings; final cabin fare, taxes, inclusions, and inventory are confirmed at booking." },
      { question: "Can this be added to a Maharashtra tour?", answer: "Yes. It pairs well with Mumbai sightseeing, Lonavala, Nashik vineyards, or Ajanta-Ellora extensions." },
      { question: "Are shore excursions guaranteed?", answer: "Shore access depends on cruise-line operations, sea conditions, port permissions, and local rules." }
    ]
  }
];

const seasonalIndiaPackages: Destination[] = [
  {
    id: 130,
    name: "Winter India: Rajasthan Desert, Rann & Royal Cities",
    country: "India",
    state: "Rajasthan",
    city: "Jaipur, Jodhpur, Jaisalmer, Udaipur, Kutch",
    type: "Domestic",
    region: "Seasonal India",
    regionId: "india-seasonal",
    image: "https://images.unsplash.com/photo-1578155173088-710a9aef3849?auto=format&fit=crop&q=80&w=1600",
    category: "Seasonal",
    price: "₹72,000",
    rating: 4.9,
    description: "A November to February winter circuit through Rajasthan's palaces, desert camps, and optional Rann of Kutch extension.",
    longDescription: "This winter India package is designed around clear skies, cooler sightseeing days, desert evenings, heritage hotels, and festival-style cultural experiences. It works especially well for international travelers who want India's royal architecture, soft desert adventure, and photogenic winter light.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1578155173088-710a9aef3849?auto=format&fit=crop&q=80&w=1600", alt: "Rajasthan fort and desert architecture", caption: "Winter royal Rajasthan circuit" }
    ],
    services: ["Heritage Hotels", "Private Vehicle", "Desert Camp Stay", "Local Guides", "Festival Date Planning", "Airport Assistance"],
    itinerary: [
      { day: "Day 1-2", title: "Jaipur Winter Heritage", description: "Visit Amer Fort, City Palace, Hawa Mahal, and local bazaars with comfortable sightseeing hours." },
      { day: "Day 3-4", title: "Jodhpur & Jaisalmer", description: "Explore Mehrangarh Fort, blue lanes, and continue to Jaisalmer for dunes, folk music, and a premium desert camp." },
      { day: "Day 5-6", title: "Udaipur Lakes", description: "Move into lake country for City Palace, boat ride, and relaxed heritage dining." },
      { day: "Day 7", title: "Optional Kutch Extension", description: "Add white desert, crafts, and tented stays when Rann season dates align." }
    ],
    faqs: [
      { question: "Best season for this package?", answer: "November to February is ideal for cool weather, desert evenings, and comfortable fort sightseeing." },
      { question: "Can Kutch be included?", answer: "Yes. Kutch can be added when guests have extra days and dates align with seasonal tented stays." }
    ]
  },
  {
    id: 131,
    name: "Spring India: Kashmir Tulips & Himachal Valleys",
    country: "India",
    state: "Himachal Pradesh",
    city: "Shimla, Manali, Dharamshala, Srinagar",
    type: "Domestic",
    region: "Seasonal India",
    regionId: "india-seasonal",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1600",
    category: "Seasonal",
    price: "₹62,500",
    rating: 4.8,
    description: "A March to April mountain package for spring blooms, soft snow views, valleys, monasteries, and hill-station stays.",
    longDescription: "This spring itinerary is for travelers who want fresh mountain air after winter without peak summer crowds. It combines Himachal's valleys with an optional Kashmir tulip season add-on, planned around current opening dates and weather conditions.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1600", alt: "Himalayan mountain valley", caption: "Spring Himalayan escape" }
    ],
    services: ["Mountain Hotels", "Private Hill Driver", "Weather-based Routing", "Monastery Visits", "Valley Excursions", "Flexible Add-ons"],
    itinerary: [
      { day: "Day 1-2", title: "Shimla & Kufri", description: "Begin with Shimla's colonial core, viewpoints, and gentle acclimatization." },
      { day: "Day 3-4", title: "Manali Valley", description: "Visit Solang, Hadimba, cafes, and river views with spring pacing." },
      { day: "Day 5", title: "Dharamshala", description: "Add monasteries, tea gardens, and Kangra valley views." },
      { day: "Day 6-7", title: "Kashmir Tulip Add-on", description: "Optional Srinagar and tulip garden extension when spring bloom dates are active." }
    ],
    faqs: [
      { question: "When should this be booked?", answer: "Spring mountain hotels and bloom-season rooms should be booked early, especially around school holidays." },
      { question: "Is Kashmir always included?", answer: "It is optional and confirmed based on guest interest, flight routing, and seasonal bloom timing." }
    ]
  },
  {
    id: 132,
    name: "Summer India: Ladakh, Spiti & High Himalaya",
    country: "India",
    state: "Himachal Pradesh",
    city: "Manali, Spiti, Leh, Nubra, Pangong",
    type: "Domestic",
    region: "Seasonal India",
    regionId: "india-seasonal",
    image: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=1600",
    category: "Seasonal",
    price: "₹82,000",
    rating: 4.9,
    description: "A May to September high-altitude itinerary for Ladakh, Spiti, monasteries, lakes, passes, and stark Himalayan landscapes.",
    longDescription: "This summer package focuses on India's high Himalaya when roads, passes, and lake routes are most workable. It includes acclimatization planning, careful drive pacing, and oxygen-aware routing for travelers who want dramatic mountain scenery.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=1600", alt: "High Himalayan lake and mountains", caption: "Ladakh and Spiti summer route" }
    ],
    services: ["Acclimatization Planning", "SUV Transfers", "Permits Guidance", "Oxygen Backup Advice", "Monastery Visits", "Lake Camps"],
    itinerary: [
      { day: "Day 1-2", title: "Leh Acclimatization", description: "Settle in, rest, and visit Shanti Stupa, Leh Palace, and nearby monasteries." },
      { day: "Day 3-4", title: "Nubra Valley", description: "Cross high passes into Nubra for dunes, villages, and boutique camps." },
      { day: "Day 5", title: "Pangong Lake", description: "Drive to Pangong for changing lake colors and high-altitude scenery." },
      { day: "Day 6-8", title: "Spiti Extension", description: "Add Kaza, Key Monastery, and Chandratal when roads and guest fitness allow." }
    ],
    faqs: [
      { question: "Is this suitable for senior travelers?", answer: "It can be adapted, but altitude needs careful planning and slower pacing." },
      { question: "Best months?", answer: "June to September is usually strongest for road-based high Himalayan routes." }
    ]
  },
  {
    id: 133,
    name: "Monsoon India: Kerala Ayurveda & Western Ghats",
    country: "India",
    state: "Kerala",
    city: "Kochi, Munnar, Thekkady, Alleppey, Kovalam",
    type: "Domestic",
    region: "Seasonal India",
    regionId: "india-seasonal",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1600",
    category: "Seasonal",
    price: "₹58,500",
    rating: 4.8,
    description: "A June to September wellness-focused monsoon package with Ayurveda, tea hills, spice country, and backwater stays.",
    longDescription: "Kerala's monsoon is ideal for travelers who want slower wellness, lush landscapes, fewer crowds, and restorative stays. This package balances Ayurveda, backwaters, tea estates, and cultural experiences with weather-aware scheduling.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1600", alt: "Kerala backwaters and palm trees", caption: "Monsoon Kerala wellness journey" }
    ],
    services: ["Ayurveda Consultation", "Premium Houseboat", "Tea Estate Stay", "Spice Plantation Visit", "Rain-safe Pacing", "Private Transfers"],
    itinerary: [
      { day: "Day 1", title: "Kochi Arrival", description: "Fort Kochi heritage, cafes, and Kathakali evening based on arrival timing." },
      { day: "Day 2-3", title: "Munnar Tea Hills", description: "Tea gardens, soft viewpoints, and monsoon landscapes." },
      { day: "Day 4", title: "Thekkady Spice Country", description: "Spice plantation visit and optional Periyar activity if weather permits." },
      { day: "Day 5-6", title: "Backwaters & Ayurveda", description: "Houseboat or resort stay with wellness treatments and local cuisine." }
    ],
    faqs: [
      { question: "Is monsoon travel safe?", answer: "Yes with flexible routing, good vehicles, and weather monitoring. Some outdoor activities may change." },
      { question: "Why Ayurveda in monsoon?", answer: "Kerala Tourism describes monsoon as the best season for rejuvenation therapies, with the southwest monsoon arriving in June and the northeast monsoon returning around mid-October. That makes this package a stronger fit for slower wellness stays than for rushed sightseeing." }
    ]
  },
  {
    id: 134,
    name: "Festive India: Navratri, Durga Puja & Diwali Trail",
    country: "India",
    state: "West Bengal",
    city: "Kolkata, Ahmedabad, Varanasi, Jaipur",
    type: "Domestic",
    region: "Seasonal India",
    regionId: "india-seasonal",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600",
    category: "Seasonal",
    price: "₹79,000",
    rating: 4.9,
    description: "A September to November festival package covering Durga Puja, Garba nights, Diwali lights, and sacred river rituals.",
    longDescription: "This festive-season package is designed for travelers who want India's cultural calendar at its brightest. It can be tailored around Durga Puja in Kolkata, Navratri in Gujarat, Diwali in Jaipur or Varanasi, and carefully managed crowd movement.",
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600", alt: "Festive India city lights", caption: "Festival season India" }
    ],
    services: ["Festival Date Planning", "VIP-style Local Guidance", "Crowd Timing Support", "Cultural Hosts", "Premium City Hotels", "Photography Assistance"],
    itinerary: [
      { day: "Day 1-2", title: "Kolkata Durga Puja", description: "Pandal walks, heritage food, and cultural interpretation with careful timing." },
      { day: "Day 3-4", title: "Ahmedabad Navratri", description: "Garba night planning, textile stops, and heritage city walk." },
      { day: "Day 5-6", title: "Varanasi or Jaipur Diwali", description: "Choose riverfront rituals or royal-city lights based on festival dates." },
      { day: "Day 7", title: "Departure", description: "Flexible departure or extension to Agra, Udaipur, or Delhi." }
    ],
    faqs: [
      { question: "Do festival dates change?", answer: "Yes. We align the final route to the relevant lunar-calendar dates for the travel year." },
      { question: "Is it crowded?", answer: "Yes, so private guides, smart timing, and realistic expectations are essential." }
    ]
  }
];

const pilgrimageIndiaPackages: Destination[] = [
  {
    id: 135,
    name: "Char Dham Yatra: Yamunotri, Gangotri, Kedarnath & Badrinath",
    country: "India",
    state: "Uttarakhand",
    city: "Haridwar, Barkot, Uttarkashi, Kedarnath, Badrinath, Rishikesh",
    type: "Domestic",
    region: "Pilgrimage India",
    regionId: "india-pilgrimage",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1600",
    category: "Pilgrimage",
    price: "₹78,000",
    rating: 4.9,
    description: "A carefully paced Uttarakhand Char Dham pilgrimage with route support, senior-friendly planning, and optional helicopter sectors.",
    longDescription: "This pilgrimage package supports one of India's most important Himalayan yatras with practical pacing, road-condition awareness, accommodation planning, and optional helicopter services where available. The route is best planned during the official Char Dham season.",
    services: ["Yatra Route Planning", "Private Vehicle", "Hotel & Dharamshala Options", "Helicopter Add-on Advice", "Senior-friendly Pacing", "Darshan Timing Support"],
    itinerary: [
      { day: "Day 1-2", title: "Haridwar to Yamunotri", description: "Begin with Haridwar/Rishikesh rituals and continue toward Yamunotri with planned halts." },
      { day: "Day 3-4", title: "Gangotri", description: "Travel to Uttarkashi and Gangotri for darshan and Himalayan river-source context." },
      { day: "Day 5-7", title: "Kedarnath", description: "Proceed toward Kedarnath with trek, pony, palki, or helicopter planning based on guest needs." },
      { day: "Day 8-10", title: "Badrinath & Return", description: "Complete Badrinath darshan, Mana village if possible, and return via Rishikesh." }
    ],
    faqs: [
      { question: "When is Char Dham possible?", answer: "Travel follows the official opening season and depends on weather, road, and temple schedules. On the Uttarakhand Tourism registration portal, the 2026 opening dates shown are April 19 for Yamunotri and Gangotri, April 22 for Kedarnath, and April 23 for Badrinath, but registrations and route conditions should still be reconfirmed before final booking." },
      { question: "Can senior citizens travel?", answer: "Yes, but medical fitness, slower pacing, and helicopter/porter planning should be discussed." }
    ]
  },
  {
    id: 136,
    name: "Ramayana Circuit: Ayodhya, Chitrakoot, Prayagraj & Varanasi",
    country: "India",
    state: "Uttar Pradesh",
    city: "Ayodhya, Chitrakoot, Prayagraj, Varanasi, Sarnath",
    type: "Domestic",
    region: "Pilgrimage India",
    regionId: "india-pilgrimage",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1600",
    category: "Pilgrimage",
    price: "₹48,500",
    rating: 4.8,
    description: "A North India pilgrimage covering Ayodhya, Chitrakoot, Prayagraj Sangam, Varanasi ghats, and optional Sarnath.",
    longDescription: "This Ramayana-inspired circuit is designed for families, senior travelers, and spiritual groups who want a meaningful but comfortable route through Uttar Pradesh's sacred geography. It combines temple visits with river rituals and guided heritage interpretation.",
    services: ["Temple Visit Planning", "Private AC Vehicle", "Local Guides", "Ganga Aarti Support", "Senior-friendly Hotels", "Vegetarian Meal Coordination"],
    itinerary: [
      { day: "Day 1", title: "Ayodhya Arrival", description: "Arrive in Ayodhya for temple-town orientation, Sarayu ghat, and evening rituals." },
      { day: "Day 2", title: "Ayodhya Darshan", description: "Plan major darshan points with crowd-aware timing and local transport support." },
      { day: "Day 3", title: "Chitrakoot", description: "Continue to Chitrakoot for Ramghat and associated pilgrimage sites." },
      { day: "Day 4-5", title: "Prayagraj & Varanasi", description: "Visit Triveni Sangam, then proceed to Varanasi for Ganga Aarti and sunrise boat ride." }
    ],
    faqs: [
      { question: "Can this include Lucknow?", answer: "Yes. Lucknow can be added for flight access, comfort hotels, and Nawabi heritage." },
      { question: "Is this suitable for groups?", answer: "Yes. It can be adapted for family groups, bhajan groups, and senior pilgrim groups." }
    ]
  },
  {
    id: 137,
    name: "Jyotirlinga West India: Somnath, Nageshwar, Trimbakeshwar & Grishneshwar",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai, Nashik, Aurangabad, Somnath, Dwarka",
    type: "Domestic",
    region: "Pilgrimage India",
    regionId: "india-pilgrimage",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1600",
    category: "Pilgrimage",
    price: "₹64,500",
    rating: 4.8,
    description: "A western India Jyotirlinga route linking Maharashtra and Gujarat with temple visits, heritage caves, and coastal pilgrimage.",
    longDescription: "This Jyotirlinga package is planned for devotees who want multiple sacred sites in one organized journey. It can begin in Mumbai or Ahmedabad and combines Trimbakeshwar, Grishneshwar, Somnath, and Nageshwar with optional Dwarka and Ellora.",
    services: ["Temple Routing", "Private Vehicle", "Hotel Planning", "Darshan Timing Advice", "Vegetarian Meals", "Airport Transfers"],
    itinerary: [
      { day: "Day 1", title: "Mumbai to Nashik", description: "Arrive in Mumbai and continue to Nashik for Trimbakeshwar darshan." },
      { day: "Day 2", title: "Grishneshwar & Ellora", description: "Visit Grishneshwar Jyotirlinga and add Ellora caves when timing permits." },
      { day: "Day 3-4", title: "Somnath", description: "Fly or drive into Gujarat for Somnath darshan and coastal evening aarti." },
      { day: "Day 5", title: "Dwarka & Nageshwar", description: "Visit Dwarkadhish and Nageshwar before departure or extension." }
    ],
    faqs: [
      { question: "Can all 12 Jyotirlingas be planned?", answer: "Yes, but that requires a longer multi-state itinerary and careful flight/rail planning." },
      { question: "Can this start from Ahmedabad?", answer: "Yes. The route can be reversed or adapted to flight availability." }
    ]
  },
  {
    id: 138,
    name: "South India Temple Trail: Madurai, Rameswaram, Thanjavur & Tirupati",
    country: "India",
    state: "Tamil Nadu",
    city: "Chennai, Tirupati, Madurai, Rameswaram, Thanjavur, Trichy",
    type: "Domestic",
    region: "Pilgrimage India",
    regionId: "india-pilgrimage",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1600",
    category: "Pilgrimage",
    price: "₹57,500",
    rating: 4.9,
    description: "A South India pilgrimage through major temple towns, Dravidian architecture, coastal shrines, and sacred rituals.",
    longDescription: "This temple trail is for travelers who want South India's sacred architecture and living rituals in a comfortable, guided format. It includes major Tamil Nadu temples with optional Tirupati planning based on darshan availability.",
    services: ["Temple Guide Support", "Darshan Slot Advice", "Private Transfers", "Vegetarian Meal Planning", "Senior-friendly Hotels", "Cultural Interpretation"],
    itinerary: [
      { day: "Day 1", title: "Chennai or Tirupati", description: "Arrive and plan Tirupati darshan or Chennai temple orientation based on slots." },
      { day: "Day 2-3", title: "Madurai & Rameswaram", description: "Visit Meenakshi Amman Temple, then continue to Rameswaram for coastal pilgrimage." },
      { day: "Day 4", title: "Thanjavur", description: "Explore Brihadeeswarar Temple and Chola art heritage." },
      { day: "Day 5", title: "Trichy Departure", description: "Visit Srirangam or Rockfort before departure." }
    ],
    faqs: [
      { question: "Can Tirupati darshan be guaranteed?", answer: "Darshan depends on quota and availability. We plan early and offer realistic alternatives." },
      { question: "Is this vegetarian-friendly?", answer: "Yes. South Indian vegetarian meals can be arranged throughout the route." }
    ]
  },
  {
    id: 139,
    name: "Buddhist India Circuit: Bodh Gaya, Sarnath, Kushinagar & Nalanda",
    country: "India",
    state: "Bihar",
    city: "Bodh Gaya, Nalanda, Rajgir, Varanasi, Sarnath, Kushinagar",
    type: "Domestic",
    region: "Pilgrimage India",
    regionId: "india-pilgrimage",
    image: "https://images.unsplash.com/photo-1652288156243-a7505dcaa0ec?auto=format&fit=crop&q=80&w=1600",
    category: "Pilgrimage",
    price: "₹69,000",
    rating: 4.9,
    description: "A Buddhist pilgrimage route through Bodh Gaya, Nalanda, Rajgir, Sarnath, Varanasi, and Kushinagar.",
    longDescription: "This Buddhist circuit is suited to international pilgrims, cultural travelers, and small groups. It links the key sites of enlightenment, first sermon, monastic scholarship, and Mahaparinirvana with sensitive guiding and comfortable road planning.",
    services: ["Buddhist Site Guides", "Monastery Visit Planning", "Private Vehicle", "Vegetarian Meals", "Group Handling", "Airport/Rail Assistance"],
    itinerary: [
      { day: "Day 1-2", title: "Bodh Gaya", description: "Visit Mahabodhi Temple, monasteries, and meditation spaces at a gentle pace." },
      { day: "Day 3", title: "Nalanda & Rajgir", description: "Explore Nalanda ruins, Vulture Peak context, and Rajgir heritage." },
      { day: "Day 4", title: "Varanasi & Sarnath", description: "Continue to Varanasi and Sarnath for Dhamek Stupa and Buddhist museum context." },
      { day: "Day 5-6", title: "Kushinagar", description: "Drive to Kushinagar for major pilgrimage points and return based on departure airport." }
    ],
    faqs: [
      { question: "Can this connect to Nepal?", answer: "Yes. Lumbini can be added with cross-border planning and extra days." },
      { question: "Is this suitable for international groups?", answer: "Yes. We can adapt hotels, meals, language support, and pace for international pilgrim groups." }
    ]
  }
];

export const destinations = [
  ...baseDestinations,
  ...premiumIndiaPackages,
  ...statewiseIndiaPackages,
  ...indiaCruisePackages,
  ...seasonalIndiaPackages,
  ...pilgrimageIndiaPackages,
];

export function destinationSlug(destination: Pick<Destination, "id" | "name" | "link">) {
  if (destination.link) {
    return destination.link.replace(/^\/destinations\//, "").replace(/^\/+|\/+$/g, "");
  }

  const slug = destination.name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug}-${destination.id}`;
}

export function destinationPath(destination: Pick<Destination, "id" | "name" | "link">) {
  return destination.link || `/destinations/${destinationSlug(destination)}`;
}

export function findDestinationByRouteParam(param?: string) {
  if (!param) return undefined;

  return destinations.find((destination) => {
    return String(destination.id) === param || destinationSlug(destination) === param;
  });
}

