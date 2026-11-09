// Copy and list data, transcribed from the design handoff (source of truth for copy).

export const brands = [
  ["charles-tyrwhitt", "Charles Tyrwhitt", 56],
  ["psg", "Paris Saint-Germain", 72],
  ["b-draddy", "B. Draddy", 72],
  ["zero-restriction", "Zero Restriction", 72],
  ["goodwill", "Goodwill", 72],
  ["science", "Science", 40],
  ["cindie", "Cindie", 40],
  ["fairway-greene", "Fairway & Greene", 76],
  ["pulco", "Pulco", 38],
  ["burnd", "Burnd", 40],
].map(([f, name, h]) => ({ src: `/brands/${f}.png`, name: name as string, h: h as number }));

export const outcomes = [
  { n: "01", t: "A head start on competitors", d: "You see the angles they’re scaling before they become category standard." },
  { n: "02", t: "Outliers, not averages", d: "You build from the ads quietly outperforming everything else, not last year’s norm." },
  { n: "03", t: "Briefs your team can act on", d: "Concepts arrive tied to evidence, so there’s less debate and faster production." },
  { n: "04", t: "Less wasted test budget", d: "Fewer shots in the dark means more spend goes behind ideas with proof." },
  { n: "05", t: "Channels and creative aligned", d: "Your paid media plan and your creative plan finally point the same way." },
  { n: "06", t: "A plan you can defend", d: "Every recommendation links back to what the market is actually doing." },
];

export const stack = [
  { t: "Competitor analysis", d: "What your competitors are running, what’s working for them, and where the outliers are." },
  { t: "Key creative trends", d: "The formats, hooks and angles set to shape next month’s creative and beyond." },
  { t: "5 data-backed mock-ups", d: "Five creative concepts ready to take to your creative team, each tied to the data behind it." },
  { t: "Full paid media strategy", d: "Where to run it, how to structure it and what to test first across your channels." },
];

export const timeline = [
  { n: "1", when: "2 minutes", t: "Apply for a spot", d: "Click the button below to claim your spot. We confirm within one business day." },
  { n: "2", when: "Next", t: "We research your market", d: "Our strategists map your competitors’ creative, isolate the outliers and track the trends shaping your category." },
  { n: "3", when: "Then", t: "We build your strategy", d: "We turn the findings into five data-backed mock-ups and a full paid media strategy for 2027." },
  { n: "4", when: "Day one", t: "Hand it to your creative team", d: "Brief straight from the mock-ups and launch your first tests with a plan behind them." },
];

export const parts = [
  {
    n: "01", t: "Competitor analysis", d: "A clear view of what’s running in your category and what’s actually working.",
    job: "Shows you where the market is going",
    points: ["What competitors are running right now", "What’s driving their best results", "Where the outliers are, and why they work"],
  },
  {
    n: "02", t: "Key creative trends", d: "The shifts in format, hooks and messaging coming in the next months.",
    job: "Keeps your creative ahead, not behind",
    points: ["Emerging formats and hooks", "Messaging angles gaining traction", "What’s fading and why to avoid it"],
  },
  {
    n: "03", t: "5 data-backed mock-ups", d: "Five concepts designed for your brand, ready to take to your creative team.",
    job: "Gives your team a head start",
    points: ["Built around proven outlier patterns", "Each linked to the data behind it", "Ready to brief from straight away"],
  },
  {
    n: "04", t: "Full paid media strategy", d: "How to deploy the creative across your channels for 2027.",
    job: "Puts budget behind the right ideas",
    points: ["Channel mix and structure", "What to test first, and in what order", "How to scale the winners"],
  },
];

export const alternatives = [
  { k: "Option A", t: "Increase budget", d: "More spend behind the same ideas, without knowing which ones will last." },
  { k: "Option B", t: "Produce more creative", d: "Weeks of production without knowing which angles the market is rewarding." },
  { k: "Option C", t: "Copy last year", d: "Builds next year’s plan on what already worked, not what’s coming." },
];

export const compare = [
  { label: "Cost", a: "Team time", b: "Paid retainer", c: "$49" },
  { label: "Competitor outlier analysis", a: "Rarely", b: "Sometimes", c: "✓" },
  { label: "Key creative trends", a: "—", b: "Sometimes", c: "✓" },
  { label: "Data-backed mock-ups", a: "—", b: "—", c: "5 included" },
  { label: "Full paid media strategy", a: "—", b: "✓", c: "✓" },
  { label: "No obligation", a: "✓", b: "—", c: "✓" },
];

export const promises = [
  "One-off $49, no hidden costs",
  "Strict mutual NDA",
  "You keep the strategy and mock-ups",
  "No retainer or software upsell",
];

export const faqs: [string, string][] = [
  ["How much work do I have to do?", "A quick call or a few details about your brand, your market and the channels you run. Our team does the research, builds the strategy and designs the mock-ups."],
  ["Do you need access to our ad accounts?", "No. The competitor and trend analysis is built from market data. If you want sharper paid media recommendations you can share read-only access, but it’s entirely optional."],
  ["What exactly do I get?", "A competitor analysis showing what’s working and where the outliers are, the key creative trends for the coming months, five data-backed mock-ups for your creative team, and a full paid media strategy."],
  ["Are the mock-ups finished ads?", "They’re creative concepts, designed to brief from. Each one is tied to the data behind it, so your team or agency can take it straight into production."],
  ["Who builds the strategy?", "Senior strategists who have planned and run paid media for brands at scale. We don’t hand it to junior coordinators or generic AI tools."],
  ["What happens after?", "You keep everything. There’s no retainer obligation or software commitment. If you’d like help executing it, we can talk, but there’s no pressure to."],
];
