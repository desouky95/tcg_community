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

export const mockCategories = [
  { id: "pokemon", name: "Pokémon TCG", parentId: 0, children: [{ id: "brilliant-stars", name: "Sword & Shield", parentId: 1, children: [] }] },
  { id: "football", name: "Football cards", parentId: 0, children: [{ id: "world-cup", name: "World Cup", parentId: 2, children: [] }] },
  { id: "yugioh", name: "Yu-Gi-Oh!", parentId: 0, children: [{ id: "legend-blue-eyes", name: "Starter era", parentId: 3, children: [] }] },
];

export const mockPageInventory = [
  { area: "Public", pages: ["Landing", "Login", "Sign up", "Verify OTP", "Checklists index", "Category / set detail"] },
  { area: "Collector workspace", pages: ["Dashboard", "Collection detail", "Edit collection", "Marketplace browse", "Listing detail", "Create listing", "Checkout", "Order confirmation", "Swap search", "Swap deal detail", "Chat inbox", "Conversation", "Profile", "Edit profile", "Public profile", "Notifications", "Settings"] },
  { area: "Administration", pages: ["Admin dashboard", "Manage users", "Manage collections", "Manage categories", "Catalogue import", "Listing moderation", "Reports", "Payment events", "Audit log"] },
  { area: "System", pages: ["404 not found", "403 forbidden", "Offline recovery", "Maintenance", "Loading / skeleton states", "Empty state variants"] },
];
