// Shared configuration for the 3D hero.
// Everything factual here comes from src/lib/products.js (Travence Atlantis)
// or is directly visible in the product photographs (atlantis-1..4.png).

// Listed product dimensions are 66 x 42 x 28 cm (height x width x depth).
// Scene units are metres.
export const DIMS = {
  H: 0.66,
  W: 0.42,
  D: 0.28,
  R: 0.045, // shell corner radius (visual estimate from photos)
};

// Lowest point of the wheels in model space (used to place the floor shadow).
export const GROUND_Y = -DIMS.H / 2 - 0.079;

export const PRODUCT_SLUG = "travence-atlantis";

// The four colourways listed for Atlantis in products.js: Grey, Cyan, Blue, Khakhi.
// `shell` was sampled from the matching product photograph.
// `photo` is the repo image that is pixel-identical to the photograph you supplied.
export const COLORWAYS = [
  {
    id: "khakhi",
    label: "Khakhi",
    shell: "#a38a70",
    trim: "#8a7058",
    swatch: "#9f846a",
    photo: "/images/atlantis-3.png",
  },
  {
    id: "cyan",
    label: "Cyan",
    shell: "#85c8d7",
    trim: "#aeb7bd",
    swatch: "#85c8d7",
    photo: "/images/atlantis-1.png",
  },
  {
    id: "blue",
    label: "Blue",
    shell: "#0f3f86",
    trim: "#243a66",
    swatch: "#0d3a7b",
    photo: "/images/atlantis-2.png",
  },
  {
    id: "grey",
    label: "Grey",
    shell: "#66707a",
    trim: "#4a525a",
    swatch: "#5e6770",
    photo: "/images/atlantis-4.png",
  },
];

export const COLORWAY_BY_ID = Object.fromEntries(
  COLORWAYS.map((c) => [c.id, c])
);

// Hotspots.
//  anchor : marker position in model space
//  normal : outward direction used to fade the marker when it faces away (null = always visible)
//  view   : camera framing when selected (suitcase yaw, focus point in model space, distance)
// Copy only uses facts from products.js (features list) or what is visible in the photos.
export const HOTSPOTS = [
  {
    id: "wheels",
    label: "Wheels",
    title: "360° spinner wheels",
    body: "Four wheel units sit under the corners, each on its own swivel, so the case follows you in any direction. Select Wheels to see the swivel move.",
    facts: ["360° Spinner Wheels", "Silent Wheels"],
    anchor: [0.15, -0.395, 0.085],
    normal: [0.45, -0.1, 0.89],
    view: { yaw: -0.5, focus: [0.1, -0.33, 0.06], dist: 1.25 },
  },
  {
    id: "handle",
    label: "Handle",
    title: "Telescopic trolley handle",
    body: "A silver-finish handle slides out of the back of the case for pulling, and retracts when you are done. Use the button below to extend and retract it.",
    facts: [],
    anchor: [0, 0.545, -0.07],
    normal: null,
    view: { yaw: 0.35, focus: [0, 0.44, -0.06], dist: 1.5 },
  },
  {
    id: "shell",
    label: "Shell",
    title: "Lightweight, scratch-resistant shell",
    body: "A swirl-ribbed hard shell with the Travence compass embossed low on the front, and the Travence plate on the centre band.",
    facts: ["Lightweight Shell", "Scratch Resistant"],
    anchor: [-0.07, 0.14, 0.14],
    normal: [0, 0, 1],
    view: { yaw: 0.42, focus: [0.02, -0.02, 0.14], dist: 1.55 },
  },
  {
    id: "lock",
    label: "Lock",
    title: "TSA lock",
    body: "A TSA lock sits on the side of the case at the zip seam, so inspectors can open it with a master key instead of cutting it off.",
    facts: ["TSA Lock"],
    anchor: [0.222, 0.178, 0],
    normal: [1, 0, 0],
    view: { yaw: -1.3, focus: [0.2, 0.15, 0], dist: 1.05 },
  },
];

export const HOTSPOT_BY_ID = Object.fromEntries(
  HOTSPOTS.map((h) => [h.id, h])
);
