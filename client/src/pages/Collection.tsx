import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useChecklist } from "../hooks/useChecklists";
import type { Card } from "../store/useStore";
import { useStore } from "../store/useStore";
import Layout from "../components/Layout";
import { ArrowUpDown, FileDown, Edit } from "lucide-react";
import { BackButton } from "../components/common/BackButton";
import { useTranslation } from "react-i18next";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import clsx from "clsx";

export default function Collection() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: collection, isLoading } = useChecklist(id);
  const currentUser = useStore((state) => state.user);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof Card | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const userCheckList = collection?.userChecklist;
  // Filtering state
  const [filters, setFilters] = useState<Record<string, string>>({
    number: "",
    name: "",
    type: "",
    section: "",
    needCount: "",
    holdCount: "",
    offerCount: "",
    ratio: "",
  });

  const handleDownloadExcel = async () => {
    if (!collection?.cards) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(t("collection_edit.my_collection"));

    // Define columns
    worksheet.columns = [
      { header: t("collection.columns.number"), key: "number", width: 12 },
      { header: t("collection.columns.name"), key: "name", width: 35 },
      { header: t("collection.columns.type"), key: "type", width: 15 },
      { header: t("collection.columns.section"), key: "section", width: 25 },
      { header: t("collection.columns.hold"), key: "hold", width: 12 },
      {
        header: t("collection.columns.duplicates"),
        key: "duplicates",
        width: 12,
      },
      { header: "", key: "duplicate_str" },
    ];

    // Add data
    collection.cards.forEach((card, index) => {
      console.log(card);
      worksheet.addRow({
        number: card.number,
        name: card.name,
        type: card.type,
        section: card.section,
        hold: null,
        duplicates: null,
        needCount: card.needCount,
        holdCount: card.holdCount,
        offerCount: card.offerCount,
        ratio: card.ratio,
      });
      const cell = worksheet.getCell("G" + (index + 2));
      cell.value = {
        formula: `=_xlfn.IF(_xlfn.ISBLANK(F${index + 2}), "", _xlfn.IF(F${index + 2}=1, A${index + 2}, _xlfn.CONCAT(A${index + 2}, "(", F${index + 2}, ")")))`,
      };
    });

    // Style the header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF22C55E" }, // green-500
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 25;

    // Add styling to rows
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE5E7EB" } },
          left: { style: "thin", color: { argb: "FFE5E7EB" } },
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
          right: { style: "thin", color: { argb: "FFE5E7EB" } },
        };

        if (rowNumber > 1) {
          cell.alignment = { vertical: "middle", horizontal: "left" };
          if (rowNumber % 2 === 0) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF9FAFB" },
            };
          }
        }
      });
    });

    // Generate buffer and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${collection.name.replace(/\s+/g, "_")}_TCG.xlsx`);
  };

  const handleSort = (col: keyof Card) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (col: string, val: string) => {
    setFilters((prev) => ({ ...prev, [col]: val }));
  };

  const getUniqueValues = (key: keyof Card) => {
    if (!collection?.cards) return [];
    const values = collection.cards.map((card) => String(card[key] ?? ""));
    return Array.from(new Set(values)).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );
  };

  const filteredAndSortedCards = useMemo(() => {
    if (!collection?.cards) return [];

    // Filter
    const result = [...collection.cards].filter((card) => {
      return (
        (card.number || "")
          .toLowerCase()
          .includes(filters.number.toLowerCase()) &&
        (card.name || "").toLowerCase().includes(filters.name.toLowerCase()) &&
        (card.type || "").toLowerCase().includes(filters.type.toLowerCase()) &&
        (card.section || "")
          .toLowerCase()
          .includes(filters.section.toLowerCase()) &&
        (filters.needCount === "" ||
          String(card.needCount) === filters.needCount) &&
        (filters.holdCount === "" ||
          String(card.holdCount) === filters.holdCount) &&
        (filters.offerCount === "" ||
          String(card.offerCount) === filters.offerCount) &&
        (filters.ratio === "" || String(card.ratio) === filters.ratio)
      );
    });

    // Sort
    if (sortColumn) {
      result.sort((a, b) => {
        const valA = String(a[sortColumn] || "").toLowerCase();
        const valB = String(b[sortColumn] || "").toLowerCase();

        // Natural sort for number column
        if (sortColumn === "number") {
          return (
            valA.localeCompare(valB, undefined, {
              numeric: true,
              sensitivity: "base",
            }) * (sortDirection === "asc" ? 1 : -1)
          );
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [collection, filters, sortColumn, sortDirection]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex space-x-2 animate-pulse mb-8">
          <div className="h-8 w-24 bg-card rounded" />
          <div className="h-8 w-64 bg-card rounded" />
        </div>
        <div className="h-96 bg-card border border-border rounded-xl animate-pulse" />
      </Layout>
    );
  }

  if (!collection) {
    return (
      <Layout>
        <div className="text-center py-20 text-muted-foreground">
          {t("collection.not_found")}
        </div>
      </Layout>
    );
  }

  const columns: Array<{
    key: keyof Card;
    label: string;
    withDropdown?: boolean;
    withSearch?: boolean;
    className?: string;
  }> = [
    { key: "number", label: t("collection.columns.number"), withSearch: true },
    {
      key: "name",
      label: t("collection.columns.name"),
      withSearch: true,
      className: "min-w-60",
    },
    {
      key: "type",
      label: t("collection.columns.type"),
      withDropdown: true,
      withSearch: true,
    },
    {
      key: "section",
      label: t("collection.columns.section"),
      withDropdown: true,
      withSearch: true,
    },
    { key: "needCount", label: t("profile.missing") },
    { key: "holdCount", label: t("profile.collected") },
    { key: "offerCount", label: t("profile.duplicates") },
    { key: "ratio", label: "Ratio" },
  ];

  return (
    <Layout>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <BackButton />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {collection.name}
            </h1>
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mt-1 opacity-70">
              {collection.category ? `${collection.category.name}` : ""}{" "}
              {collection.subcategory ? `• ${collection.subcategory.name}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-green-500/20"
          >
            <FileDown className="w-4 h-4" />
            <span>{t("collection.download_excel")}</span>
          </button>

          {currentUser && (
            <Link
              to={`/collection/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg"
            >
              <Edit className="w-4 h-4" />
              <span>{t("collection.edit_my_list")}</span>
            </Link>
          )}
        </div>
      </div>

      <div
        // className="bg-card border border-border rounded-xl overflow-hidden shadow-lg flex flex-col max-h-screen lg:-mx-22"
        className="flex flex-col h-screen bg-card border border-border rounded-xl shadow-lg lg:-mx-22 max-h-[75vh]"
      >
        <div className="grow overflow-auto w-full relative">
          <table className="relative w-full text-left rtl:text-right text-sm whitespace-nowrap">
            <thead
              className={
                "text-xs uppercase bg-input/50 sticky top-0 z-10 shadow-sm backdrop-blur-md"
              }
            >
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={clsx(
                      "px-6 py-4 align-baseline font-bold border-b border-border sticky top-0",
                      col.className,
                    )}
                  >
                    <div className="flex flex-col justify-end space-y-3">
                      <button
                        className="flex items-center space-x-2 rtl:space-x-reverse text-foreground hover:text-primary-500 transition-colors w-full text-left rtl:text-right font-bold"
                        onClick={() => handleSort(col.key)}
                      >
                        <span>{col.label}</span>
                        <ArrowUpDown
                          className={`w-3 h-3 ${sortColumn === col.key ? "text-primary-500" : "text-muted-foreground opacity-50"}`}
                        />
                      </button>
                      <div className="relative flex flex-col">
                        {col.withSearch && (
                          <input
                            type="text"
                            placeholder={t("collection.filter_placeholder", {
                              label: col.label,
                            })}
                            className="lg:max-w-[130px] w-full bg-background border border-border/50 rounded-md py-1.5 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 font-normal normal-case"
                            value={filters[col.key] || ""}
                            onChange={(e) =>
                              handleFilterChange(col.key, e.target.value)
                            }
                          />
                        )}
                        {col.withDropdown && (
                          <select
                            className="lg:max-w-[130px] w-full mt-1.5 bg-background border border-border/50 rounded-md py-1 px-2 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary-500 font-normal appearance-none cursor-pointer"
                            value={filters[col.key] || ""}
                            onChange={(e) =>
                              handleFilterChange(col.key, e.target.value)
                            }
                          >
                            <option value="">All {col.label}</option>
                            {getUniqueValues(col.key).map((val) => (
                              <option key={val} value={val}>
                                {val}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredAndSortedCards.length > 0 ? (
                filteredAndSortedCards.map((card, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-input/20 transition-colors group"
                  >
                    <td
                      className={
                        "px-6 py-3 font-medium text-muted-foreground font-mono"
                      }
                    >
                      {card.number}
                    </td>
                    <td className="min-w-60 px-6 py-3 font-semibold text-foreground">
                      {card.name}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-input/50 border border-border/50">
                        {card.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {card.section}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="font-bold text-danger-500">
                        {card.needCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={clsx("font-bold text-primary-500", {
                          "bg-primary-500/20":
                            userCheckList?.collectedListArray?.find(
                              (item) => item == card.number,
                            ),
                        })}
                      >
                        {card.holdCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={clsx("font-bold text-amber-500", {
                          "bg-amber-500/20":
                            userCheckList?.duplicatesListArray?.find(
                              (item) => item == card.number,
                            ),
                        })}
                      >
                        {card.offerCount || 0}
                      </span>
                    </td>
                    <td
                      className={clsx(
                        "px-6 py-3 text-center text-xs font-mono",
                        {
                          "dark:text-white text-black":
                            Number(card.ratio || 0) == 0,
                          "text-red-500": Number(card?.ratio || 0) > 2,
                          "text-amber-500": Number(card?.ratio || 0) > 1,
                          "text-green-500": Number(card?.ratio || 0) < 1,
                        },
                      )}
                    >
                      {card?.ratio || "0.00"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-muted-foreground border-b border-border/50"
                  >
                    {t("collection.no_match")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="py-3 px-6 bg-input/20 border-t border-border/50 text-xs font-semibold text-muted-foreground flex justify-between rounded-b-xl z-20">
          <span>
            {t("collection.total_displayed", {
              count: filteredAndSortedCards.length,
            })}
          </span>
          <span>
            {t("collection.total_in_collection", {
              count: collection.cards?.length || 0,
            })}
          </span>
        </div>
      </div>
    </Layout>
  );
}
