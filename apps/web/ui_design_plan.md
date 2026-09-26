# UI Design Plan: TCG Nexus

**Goal**: Create a premium, gamified, and modern UI design for the "TCG Nexus" platform, ensuring consistency across all features while supporting both English (LTR) and Arabic (RTL).

---

## 1. Design Language & Brand Identity
*   **Brand Name**: TCG NEXUS
*   **Core Aesthetic**: Modern, sleek, "Elite" feel. Use of glassmorphism, subtle micro-animations (Framer Motion style), and high-contrast typography.
*   **Color Palette**:
    *   **Primary**: `#3b82f6` (Blue-500) to `#2563eb` (Blue-600) for actions and highlights.
    *   **Background**: White (`#ffffff`) for Light Mode; Deep Black/Zinc-950 (`#09090b`) for Dark Mode.
    *   **Surface/Cards**: Soft gray (`#fafafa`) / Zinc-900 (`#18181b`) with 80% opacity and `backdrop-blur`.
    *   **Accents**: Emerald for success/points, Amber for warnings, Red for danger/errors.
*   **Typography**:
    *   **Primary (Sans/Arabic)**: `Almarai` (Weight: 300, 400, 700, 800) – Clean and modern for both scripts.
    *   **Display (English)**: `Oswald` (Weight: 200-700) – For uppercase headers and impact statements.
*   **Iconography**: `lucide-react` (thin strokes, 1.5px - 2px).

---

## 2. Core Pages & Features to Design

### A. The "Hero" Landing Page
*   **Asymmetric Layout**: Large, bold "Display" typography (Oswald) with primary color highlights.
*   **Interactive Elements**:
    *   **Card Fan**: A rotating/hoverable stack of TCG cards.
    *   **Pack Gallery**: A horizontal scrolling section of "Card Packs" with hover effects.
    *   **Feature Ticker**: Masonry-style grid showing reviews, checklists, and trading features.

### B. User Dashboard & Gamification
*   **Stat Cards**: Dynamic cards showing user points, collection progress, and recent activities. Use progress bars with gradients.
*   **Activity Feed**: A vertical timeline of recent additions to the collection or community news.
*   **Global Search**: A prominent command-K style search bar (appearing in Layout) with quick results for cards and sets.

### C. Checklist & Collection Management
*   **Grid/Table Hybrid**: High-density list of cards with status toggles (Owned, Wanted, Offered).
*   **Filtering System**: Advanced sidebar or topbar filters for categories, rarity, condition, and community stats (Need-to-Offer ratios).
*   **Category Detail**: Rich header for TCG sets (e.g., Pokémon, Yu-Gi-Oh) with set stats (total cards, percentage completed).

### D. User Profile & Social
*   **Public Profile**: Showcase of the user's "Best Cards" and points.
*   **Settings**: Clean, compartmentalized forms for account management and localization toggles (EN/AR).

### E. Admin Control Panel
*   **Management Views**: Clean tables for Users, Categories, and Collections.
*   **Dashboard Highlights**: Charts (Bar/Line) showing user growth and collection trends.

---

## 3. Design Requirements for the AI Agent
1.  **Responsiveness**: Every design must have Mobile, Tablet, and Desktop breakpoints.
2.  **RTL Support**: Ensure all layouts work perfectly when flipped for Arabic (e.g., sidebar on right, text alignment right-to-left).
3.  **States**: Define Hover, Active, Disabled, and Loading (Skeletons) states for all interactive components.
4.  **Premium Feel**: Avoid generic UI kits. Use custom shadows (`shadow-primary-500/20`), rounded corners (`rounded-2xl` or `rounded-4xl`), and subtle gradients.
5.  **Gamification**: Use badges, point counters, and level indicators prominently to encourage user engagement.

---

---

## 5. Data & Content Strategy (Mock Setup)
To facilitate realistic UI design, the following data structures are defined in `apps/web/src/lib/mocks.json`.

### A. Landing Page Data
- **Hero**: Catchy titles and subtext for the main CTA.
- **Features List**: Description triplets for core value propositions.

### B. User & Profile Data
- **Reputation (Points)**: Numeric value driving badge levels (e.g., `< 20 = New`, `> 50 = Reliable`).
- **Feedback Feed**: Array of comments with `type: positive | negative`.

### C. Collection & Card Data
- **Density**: Cards are displayed in dense grids or tables. 
- **Metrics**: Key numbers to design for: `Hold` (Owned), `Need` (Wanted), and `Ratio` (Market Intensity).

---

## 6. Interaction Guidelines

*   **Transitions**: Fade-in and slide-up animations for new sections (`duration-500`).
*   **Feedback**: Instant visual response on click (scaling down slightly).
*   **Theming**: Seamless transition between Dark and Light modes using CSS variables.

---

## Appendix: Existing Source Pages
The following pages are currently implemented in the codebase and should be addressed in the new design:

*   **Public/User Pages**:
    *   [Landing.tsx]
    *   [Checklists.tsx]
    *   [CategoryDetail.tsx]
    *   [Dashboard.tsx]
    *   [Collection.tsx]
    *   [CollectionEdit.tsx]
    *   [Profile.tsx]
*   **Authentication Flow**:
    *   [Login.tsx]
    *   [Signup.tsx]
    *   [VerifyOTP.tsx]
*   **Admin Pages**:
    *   [AdminDashboard.tsx]
    *   [AdminCategories.tsx]
    *   [AdminCollections.tsx]
    *   [AdminUsers.tsx]
