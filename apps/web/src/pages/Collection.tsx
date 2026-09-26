import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ArrowUpDown, ChevronRight, Download, Edit3, Filter, Search } from "lucide-react";
import { useChecklist } from "../hooks/useChecklists";
import type { Card } from "../store/useStore";
import { useStore } from "../store/useStore";
import PublicShell from "../components/PublicShell";

type SortDirection = "asc" | "desc";
const metricKeys = ["needCount", "holdCount", "offerCount", "ratio"] as const;

export default function Collection() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: collection, isLoading } = useChecklist(id);
  const currentUser = useStore((state) => state.user);
  const [query, setQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Card>("number");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filters, setFilters] = useState<Record<string, string>>({
    type: "",
    section: "",
    needCount: "",
    holdCount: "",
    offerCount: "",
    ratio: "",
  });

  const cards = useMemo(() => collection?.cards ?? [], [collection?.cards]);
  const uniqueValues = (key: keyof Card) =>
    Array.from(new Set(cards.map((card) => String(card[key] ?? ""))))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const filteredAndSortedCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = cards.filter((card) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [card.number, card.name, card.type, card.section].some((value) =>
          String(value ?? "").toLowerCase().includes(normalizedQuery),
        );
      const matchesFacets = Object.entries(filters).every(
        ([key, value]) => value === "" || String(card[key as keyof Card] ?? "") === value,
      );
      return matchesQuery && matchesFacets;
    });

    return result.sort((a, b) => {
      const left = String(a[sortColumn] ?? "");
      const right = String(b[sortColumn] ?? "");
      return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }) * (sortDirection === "asc" ? 1 : -1);
    });
  }, [cards, filters, query, sortColumn, sortDirection]);

  const stats = useMemo(
    () => ({
      cards: cards.length,
      wanted: cards.reduce((total, card) => total + (card.needCount ?? 0), 0),
      held: cards.reduce((total, card) => total + (card.holdCount ?? 0), 0),
      offered: cards.reduce((total, card) => total + (card.offerCount ?? 0), 0),
    }),
    [cards],
  );

  const handleSort = (column: keyof Card) => {
    if (column === sortColumn) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }
    setSortColumn(column);
    setSortDirection("asc");
  };

  const resetFilters = () => {
    setQuery("");
    setFilters({ type: "", section: "", needCount: "", holdCount: "", offerCount: "", ratio: "" });
  };

  const handleDownloadExcel = async () => {
    if (!collection) return;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(collection.name);
    worksheet.columns = [
      { header: t("collection.columns.number"), key: "number", width: 14 },
      { header: t("collection.columns.name"), key: "name", width: 34 },
      { header: t("collection.columns.type"), key: "type", width: 18 },
      { header: t("collection.columns.section"), key: "section", width: 22 },
      { header: t("profile.missing"), key: "needCount", width: 12 },
      { header: t("profile.collected"), key: "holdCount", width: 12 },
      { header: t("profile.duplicates"), key: "offerCount", width: 12 },
      { header: "Ratio", key: "ratio", width: 12 },
    ];
    filteredAndSortedCards.forEach((card) => worksheet.addRow(card));
    const header = worksheet.getRow(1);
    header.font = { bold: true, color: { argb: "FFF6F0E6" } };
    header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF17385E" } };
    header.height = 24;
    worksheet.views = [{ state: "frozen", ySplit: 1 }];
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `${collection.name.replace(/\s+/g, "_")}_TCG.xlsx`,
    );
  };

  if (isLoading) {
    return (
      <PublicShell>
        <main className="wax-collection-page wax-collection-loading" aria-label="Loading collection">
          <div className="wax-public-skeleton wax-heading-skeleton" />
          <div className="wax-public-skeleton wax-collection-table-skeleton" />
        </main>
      </PublicShell>
    );
  }

  if (!collection) {
    return (
      <PublicShell>
        <main className="wax-public-empty wax-public-empty-page">
          <h1>{t("collection.not_found")}</h1>
          <p>This catalogue may have moved or is not available yet.</p>
          <Link to="/checklists" className="wax-button focus-ring">Browse catalogues</Link>
        </main>
      </PublicShell>
    );
  }

  const columns: Array<{ key: keyof Card; label: string }> = [
    { key: "number", label: t("collection.columns.number") },
    { key: "name", label: t("collection.columns.name") },
    { key: "type", label: t("collection.columns.type") },
    { key: "section", label: t("collection.columns.section") },
    { key: "needCount", label: t("profile.missing") },
    { key: "holdCount", label: t("profile.collected") },
    { key: "offerCount", label: t("profile.duplicates") },
    { key: "ratio", label: "Ratio" },
  ];
  const hasActiveFilters = query.length > 0 || Object.values(filters).some(Boolean);

  return (
    <PublicShell>
      <main className="wax-collection-page">
        <nav className="wax-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/checklists" className="focus-ring">Catalogues</Link>
          <ChevronRight aria-hidden="true" />
          <Link to={`/s/${collection.categoryId}`} className="focus-ring">{collection.category?.name ?? "Collection"}</Link>
          <ChevronRight aria-hidden="true" />
          <span>{collection.name}</span>
        </nav>

        <header className="wax-collection-header">
          <div>
            <p>{collection.category?.name} · {collection.year}</p>
            <h1>{collection.name}</h1>
            <span>{collection.subcategory?.name ?? "Community card index"}</span>
          </div>
          <div className="wax-collection-actions">
            <button type="button" onClick={handleDownloadExcel} className="wax-button wax-button-secondary focus-ring">
              <Download aria-hidden="true" /> Download current view
            </button>
            {currentUser && (
              <Link to={`/collection/${id}/edit`} className="wax-button focus-ring"><Edit3 aria-hidden="true" /> Edit my list</Link>
            )}
          </div>
        </header>

        <section className="wax-collection-stats" aria-label="Collection summary">
          <div><span>Indexed cards</span><strong>{stats.cards}</strong></div>
          <div><span>Collector demand</span><strong>{stats.wanted}</strong></div>
          <div><span>Known holds</span><strong>{stats.held}</strong></div>
          <div><span>Trade offers</span><strong>{stats.offered}</strong></div>
        </section>

        <section className="wax-collection-index" aria-labelledby="collection-index-title">
          <div className="wax-collection-index-heading">
            <div>
              <h2 id="collection-index-title">Card index</h2>
              <p>Search the set, compare community activity, and export the view you need.</p>
            </div>
            <span>{filteredAndSortedCards.length} of {cards.length} shown</span>
          </div>

          <div className="wax-collection-toolbar">
            <label className="wax-collection-search">
              <Search aria-hidden="true" /><span className="sr-only">Search cards</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search number, card, type, or section" />
            </label>
            <label>
              <span>Type</span>
              <select value={filters.type} onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}>
                <option value="">All types</option>
                {uniqueValues("type").map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              <span>Section</span>
              <select value={filters.section} onChange={(event) => setFilters((current) => ({ ...current, section: event.target.value }))}>
                <option value="">All sections</option>
                {uniqueValues("section").map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </div>

          <details className="wax-collection-advanced">
            <summary className="focus-ring"><Filter aria-hidden="true" /> Filter community counts</summary>
            <div>
              {metricKeys.map((key) => (
                <label key={key}>
                  <span>{columns.find((column) => column.key === key)?.label}</span>
                  <select value={filters[key]} onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))}>
                    <option value="">Any value</option>
                    {uniqueValues(key).map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </details>

          <div className="wax-collection-table-wrap" tabIndex={0} aria-label="Scrollable card index">
            <table className="wax-collection-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} scope="col" aria-sort={sortColumn === column.key ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}>
                      <button type="button" onClick={() => handleSort(column.key)} className="focus-ring">{column.label}<ArrowUpDown aria-hidden="true" /></button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedCards.map((card) => (
                  <tr key={card.number}>
                    <td><span className="wax-card-number">{card.number}</span></td>
                    <td><strong>{card.name}</strong></td>
                    <td>{card.type}</td>
                    <td>{card.section}</td>
                    <td><span className="wax-count wax-count-wanted">{card.needCount ?? 0}</span></td>
                    <td><span className="wax-count wax-count-held">{card.holdCount ?? 0}</span></td>
                    <td><span className="wax-count wax-count-offered">{card.offerCount ?? 0}</span></td>
                    <td><span className="wax-ratio">{card.ratio ?? "0.00"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedCards.length === 0 && (
            <div className="wax-public-empty wax-collection-empty">
              <h3>{t("collection.no_match")}</h3>
              <p>Clear the current search and filters to return to the full card index.</p>
              <button type="button" onClick={resetFilters} className="wax-text-link focus-ring">Reset filters</button>
            </div>
          )}

          <footer className="wax-collection-index-footer">
            <span>{filteredAndSortedCards.length} cards displayed</span>
            {hasActiveFilters && <button type="button" onClick={resetFilters} className="wax-text-link focus-ring">Reset all filters</button>}
          </footer>
        </section>
      </main>
    </PublicShell>
  );
}
