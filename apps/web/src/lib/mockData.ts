import type { Card, Checklist } from "@tcg/api-contracts";

export const mockMarketplaceListings = [
  { id: "listing-01", title: "Charizard VSTAR", set: "Brilliant Stars · 174/172", seller: "Mina Cards", price: 1850, condition: "Near mint", accent: "#F26B3A", image: "/images/landing/yamal.jpg" },
  { id: "listing-02", title: "Ronaldinho Icon", set: "FIFA World Cup 2006 · 12/50", seller: "Cairo Binder Club", price: 920, condition: "Excellent", accent: "#4E7BFF", image: "/images/landing/ronaldinho.jpg" },
  { id: "listing-03", title: "Blue-Eyes White Dragon", set: "Legend of Blue Eyes · SDK-001", seller: "Jace B.", price: 2400, condition: "Lightly played", accent: "#63C6A2", image: "/images/landing/messi.jpg" },
];

export const mockDashboardSummary = {
  collector: "Ash Ketchum",
  level: "Elite collector",
  completion: 72,
  collected: 438,
  wanted: 126,
  tradeable: 84,
  streak: 9,
  activity: [
    { label: "Brilliant Stars", value: "128 / 172", progress: 74, tone: "ember" },
    { label: "FIFA World Cup 2006", value: "86 / 100", progress: 86, tone: "cobalt" },
    { label: "Legend of Blue Eyes", value: "54 / 126", progress: 43, tone: "mint" },
  ],
};

export const mockChecklists = [
  { id: "cl1", type: "card" as const, name: "Brilliant Stars", year: 2022, totalCards: 172, categoryId: 1, subcategoryId: 11, category: { id: "pokemon", name: "Pokémon TCG", parentId: 0, children: [] }, subcategory: { id: "brilliant-stars", name: "Sword & Shield", parentId: 1, children: [] } },
  { id: "cl2", type: "card" as const, name: "FIFA World Cup 2006", year: 2006, totalCards: 100, categoryId: 2, subcategoryId: 21, category: { id: "football", name: "Football cards", parentId: 0, children: [] }, subcategory: { id: "world-cup", name: "World Cup", parentId: 2, children: [] } },
  { id: "cl3", type: "card" as const, name: "Legend of Blue Eyes", year: 2002, totalCards: 126, categoryId: 3, subcategoryId: 31, category: { id: "yugioh", name: "Yu-Gi-Oh!", parentId: 0, children: [] }, subcategory: { id: "legend-blue-eyes", name: "Starter era", parentId: 3, children: [] } },
];

const mockCardsByChecklist: Record<string, Card[]> = {
  cl1: [
    { number: "018/172", name: "Charizard V", type: "Fire", section: "Ultra Rare", needCount: 15, holdCount: 8, offerCount: 3, ratio: "1.88" },
    { number: "025/172", name: "Moltres", type: "Fire", section: "Rare", needCount: 4, holdCount: 18, offerCount: 5, ratio: "0.22" },
    { number: "056/172", name: "Mimikyu V", type: "Psychic", section: "Ultra Rare", needCount: 9, holdCount: 11, offerCount: 2, ratio: "0.82" },
    { number: "100/172", name: "Flygon V", type: "Dragon", section: "Ultra Rare", needCount: 7, holdCount: 10, offerCount: 4, ratio: "0.70" },
    { number: "122/172", name: "Arceus V", type: "Colorless", section: "Ultra Rare", needCount: 13, holdCount: 7, offerCount: 2, ratio: "1.86" },
    { number: "123/172", name: "Arceus VSTAR", type: "Colorless", section: "VSTAR", needCount: 18, holdCount: 6, offerCount: 1, ratio: "3.00" },
    { number: "154/172", name: "Charizard VSTAR", type: "Fire", section: "Rainbow Rare", needCount: 24, holdCount: 4, offerCount: 1, ratio: "6.00" },
    { number: "166/172", name: "Marnie's Pride", type: "Trainer", section: "Full Art", needCount: 11, holdCount: 9, offerCount: 3, ratio: "1.22" },
  ],
  cl2: [
    { number: "001", name: "Tournament Emblem", type: "Insert", section: "Opening", needCount: 3, holdCount: 17, offerCount: 5, ratio: "0.18" },
    { number: "012", name: "Ronaldinho", type: "Player", section: "Brazil", needCount: 16, holdCount: 8, offerCount: 2, ratio: "2.00" },
    { number: "021", name: "Zinedine Zidane", type: "Player", section: "France", needCount: 14, holdCount: 9, offerCount: 3, ratio: "1.56" },
    { number: "034", name: "Ronaldo", type: "Player", section: "Brazil", needCount: 12, holdCount: 12, offerCount: 4, ratio: "1.00" },
    { number: "047", name: "Luís Figo", type: "Player", section: "Portugal", needCount: 7, holdCount: 15, offerCount: 5, ratio: "0.47" },
    { number: "063", name: "Thierry Henry", type: "Player", section: "France", needCount: 10, holdCount: 11, offerCount: 3, ratio: "0.91" },
  ],
  cl3: [
    { number: "LOB-001", name: "Blue-Eyes White Dragon", type: "Dragon", section: "Ultra Rare", needCount: 22, holdCount: 5, offerCount: 1, ratio: "4.40" },
    { number: "LOB-005", name: "Dark Magician", type: "Spellcaster", section: "Ultra Rare", needCount: 18, holdCount: 7, offerCount: 2, ratio: "2.57" },
    { number: "LOB-053", name: "Raigeki", type: "Spell", section: "Super Rare", needCount: 9, holdCount: 12, offerCount: 4, ratio: "0.75" },
    { number: "LOB-070", name: "Red-Eyes B. Dragon", type: "Dragon", section: "Ultra Rare", needCount: 15, holdCount: 8, offerCount: 2, ratio: "1.88" },
    { number: "LOB-118", name: "Exodia the Forbidden One", type: "Spellcaster", section: "Ultra Rare", needCount: 20, holdCount: 6, offerCount: 1, ratio: "3.33" },
  ],
};

export const mockChecklistDetails = mockChecklists.map((checklist) => ({
  ...checklist,
  cards: mockCardsByChecklist[checklist.id] ?? [],
})) satisfies Checklist[];

export const mockCategories = [
  { id: "pokemon", name: "Pokémon TCG", parentId: 0, children: [{ id: "brilliant-stars", name: "Sword & Shield", parentId: 1, children: [] }] },
  { id: "football", name: "Football cards", parentId: 0, children: [{ id: "world-cup", name: "World Cup", parentId: 2, children: [] }] },
  { id: "yugioh", name: "Yu-Gi-Oh!", parentId: 0, children: [{ id: "legend-blue-eyes", name: "Starter era", parentId: 3, children: [] }] },
];

export const mockPageInventory = [
  { area: "Public", pages: ["Landing", "Login", "Sign up", "Verify OTP", "Checklists index", "Category / set detail", "Public card index"] },
  { area: "Collector workspace", pages: ["Dashboard", "Edit collection", "Marketplace browse", "Listing detail", "Create listing", "Checkout", "Order confirmation", "Swap search", "Swap deal detail", "Chat inbox", "Conversation", "Profile", "Edit profile", "Public profile", "Notifications", "Settings"] },
  { area: "Administration", pages: ["Admin dashboard", "Manage users", "Manage collections", "Manage categories", "Catalogue import", "Listing moderation", "Reports", "Payment events", "Audit log"] },
  { area: "System", pages: ["404 not found", "403 forbidden", "Offline recovery", "Maintenance", "Loading / skeleton states", "Empty state variants"] },
];
