import { useState } from "react";
import {
  useChecklists,
  useAddChecklist,
  useUpdateChecklist,
  useDeleteChecklist,
} from "../../hooks/useChecklists";
import { useCategories } from "../../hooks/useCategories";
import Layout from "../../components/Layout";
import {
  PlusCircle,
  Table2,
  Layers,
  Trash2,
  LayoutGrid,
  CheckCircle,
  Pencil,
  XCircle,
} from "lucide-react";
import { BackButton } from "../../components/common/BackButton";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function AdminCollections() {
  const { t } = useTranslation();
  const { data: checklists = [], isLoading: loading } = useChecklists();
  const { data: categories = [] } = useCategories();
  const addMutation = useAddChecklist();
  const updateMutation = useUpdateChecklist();
  const deleteMutation = useDeleteChecklist();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    year: new Date().getFullYear(),
    type: "sticker",
    totalCards: 0,
    categoryId: "",
    subcategoryId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("year", formData.year.toString());
    data.append("type", formData.type);
    data.append("totalCards", formData.totalCards.toString());
    data.append("categoryId", formData.categoryId);
    if (formData.subcategoryId)
      data.append("subcategoryId", formData.subcategoryId);
    if (file) data.append("file", file);

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: data,
        });
        toast.success("Checklist updated!");
      } else {
        await addMutation.mutateAsync(data);
        toast.success("Checklist published!");
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save checklist");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    setFormData({
      name: "",
      year: new Date().getFullYear(),
      type: "sticker",
      totalCards: 0,
      categoryId: "",
      subcategoryId: "",
    });
    // Reset file input manually if needed
    const fileInput = document.getElementById(
      "xlsx-upload",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleEdit = (c: any) => {
    setEditingId(c.id.toString());
    setFile(null);
    setFormData({
      name: c.name,
      year: c.year,
      type: c.type,
      totalCards: c.totalCards,
      categoryId: c.categoryId?.toString() || "",
      subcategoryId: c.subcategoryId?.toString() || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this checklist? This will also delete all associated cards!",
      )
    ) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Checklist deleted");
      } catch (err: any) {
        toast.error("Failed to delete checklist");
      }
    }
  };

  const selectedCategory = categories.find(
    (c) => c.id.toString() === formData.categoryId,
  );

  return (
    <Layout>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <BackButton to="/admin" />
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase flex items-center text-foreground">
              <Table2 className="w-8 h-8 mr-3 rtl:ml-3 rtl:mr-0 text-primary-500" />{" "}
              {t("admin.collections.title")}
            </h1>
            <p className="text-muted-foreground font-medium">
              {t("admin.collections.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Form Column */}
        <div className="xl:col-span-1">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl sticky top-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase flex items-center text-foreground">
                {editingId ? (
                  <>
                    <Pencil className="w-6 h-6 mr-3 rtl:ml-3 rtl:mr-0 text-amber-500" />{" "}
                    {t("common.edit")}
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-6 h-6 mr-3 rtl:ml-3 rtl:mr-0 text-primary-500" />{" "}
                    {t("admin.collections.new")}
                  </>
                )}
              </h2>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Toggle as First Element */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                  {t("admin.collections.type")}
                </label>
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-input/50 border border-border rounded-2xl">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: "sticker" })
                    }
                    className={`flex items-center justify-center py-3 rounded-xl font-bold transition-all ${
                      formData.type === "sticker"
                        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                        : "text-muted-foreground hover:bg-input/80 hover:text-foreground"
                    }`}
                  >
                    <Layers className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t("admin.collections.sticker")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "card" })}
                    className={`flex items-center justify-center py-3 rounded-xl font-bold transition-all ${
                      formData.type === "card"
                        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                        : "text-muted-foreground hover:bg-input/80 hover:text-foreground"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t("admin.collections.card")}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t("admin.collections.name")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-input/50 border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all text-base"
                    placeholder="e.g. World Cup 2022"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      {t("admin.collections.year")}
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value),
                        })
                      }
                      className="w-full bg-input/50 border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      {t("admin.collections.total")}
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.totalCards}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          totalCards: parseInt(e.target.value),
                        })
                      }
                      className="w-full bg-input/50 border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      {t("admin.collections.category")}
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categoryId: e.target.value,
                          subcategoryId: "",
                        })
                      }
                      className="w-full bg-input/50 border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all appearance-none"
                    >
                      <option value="">Category</option>
                      {categories
                        .filter((c) => !c.parentId || c.parentId === -1)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      {t("admin.collections.sub")}
                    </label>
                    <select
                      value={formData.subcategoryId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subcategoryId: e.target.value,
                        })
                      }
                      className="w-full bg-input/50 border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all appearance-none disabled:opacity-50"
                      disabled={!formData.categoryId}
                    >
                      <option value="">Sub-Category</option>
                      {selectedCategory?.children?.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {t("admin.collections.xlsx") || "Checklist File (XLSX)"}
                  </label>
                  <div className="relative group">
                    <input
                      id="xlsx-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full opacity-0 absolute inset-0 cursor-pointer z-10"
                    />
                    <div
                      className={`w-full bg-input/50 border-2 border-dashed border-border rounded-3xl px-5 py-8 flex flex-col items-center justify-center transition-all group-hover:border-primary-500/50 ${file ? "bg-primary-500/5 border-primary-500" : ""}`}
                    >
                      <Layers
                        className={`w-10 h-10 mb-3 ${file ? "text-primary-500" : "text-muted-foreground/30"}`}
                      />
                      <p className="text-sm font-bold text-foreground">
                        {file
                          ? file.name
                          : t("admin.collections.upload_help") ||
                            "Drop XLSX file here or click to browse"}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">
                        {file
                          ? `${(file.size / 1024).toFixed(1)} KB`
                          : "Max 10MB"}
                      </p>
                    </div>
                  </div>
                  {editingId && !file && (
                    <p className="text-[10px] font-bold text-amber-500 ml-1">
                      * Leave empty to keep existing cards, upload to REPLACE
                      all cards.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={addMutation.isPending || updateMutation.isPending}
                className={`w-full text-white font-black uppercase tracking-widest py-5 rounded-3xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2 rtl:space-x-reverse ${
                  editingId
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30"
                    : "bg-primary-500 hover:bg-primary-600 shadow-primary-500/30"
                }`}
              >
                {addMutation.isPending || updateMutation.isPending ? (
                  t("common.loading")
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>
                      {editingId
                        ? t("common.update") || "Update"
                        : t("admin.collections.publish")}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="xl:col-span-2 space-y-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-card border border-border rounded-3xl animate-pulse"
                />
              ))
            : checklists.map((c) => (
                <div
                  key={c.id}
                  className={`group bg-card border border-border rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary-500/50 hover:shadow-xl transition-all ${editingId === c.id.toString() ? "border-amber-500 shadow-lg" : ""}`}
                >
                  <div className="flex items-center space-x-5 rtl:space-x-reverse">
                    <div
                      className={`w-16 h-16 rounded-[1.25rem] bg-input/50 border border-border flex items-center justify-center shadow-inner group-hover:text-white transition-colors ${editingId === c.id.toString() ? "bg-amber-500 text-white" : "text-primary-500 group-hover:bg-primary-500"}`}
                    >
                      <Layers className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight text-foreground">
                        {c.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="flex items-center bg-input/50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-border/10">
                          <Table2 className="w-3 h-3 mr-1.5 rtl:ml-1.5 rtl:mr-0 opacity-50" />{" "}
                          {c.totalCards} items
                        </span>
                        <span className="flex items-center bg-input/50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-border/10">
                          <LayoutGrid className="w-3 h-3 mr-1.5 rtl:ml-1.5 rtl:mr-0 opacity-50" />{" "}
                          {c.category?.name || "Uncategorized"} /{" "}
                          {c.subcategory?.name || "None"}
                        </span>
                        <span className="bg-primary-500/10 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {c.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 rtl:space-x-reverse self-end md:self-center">
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-3 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500 rounded-2xl transition-all"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id.toString())}
                      className="p-3 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </Layout>
  );
}
