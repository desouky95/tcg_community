import { useState } from "react";
import { useCategories, useCategoryMutations } from "../../hooks/useCategories";
import Layout from "../../components/Layout";
import { Plus, Trash2, LayoutGrid, Tag } from "lucide-react";
import { BackButton } from "../../components/common/BackButton";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function AdminCategories() {
  const { t } = useTranslation();
  const { data: categories = [], isLoading: loading } = useCategories();
  const { addCategory, addSubcategory, deleteCategory } =
    useCategoryMutations();

  const [newCatName, setNewCatName] = useState("");
  const [newSubNames, setNewSubNames] = useState<Record<string, string>>({});

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      await addCategory.mutateAsync(newCatName);
      toast.success(t("admin.categories.new_cat"));
      setNewCatName("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to add category");
    }
  };

  const handleAddSubcategory = async (catId: string) => {
    const subName = newSubNames[catId];
    if (!subName) return;
    try {
      await addSubcategory.mutateAsync({ categoryId: catId, name: subName });
      toast.success(t("admin.categories.add"));
      setNewSubNames({ ...newSubNames, [catId]: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to add subcategory");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !window.confirm("Are you sure? This will remove all subcategories too.")
    )
      return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete category");
    }
  };

  const parentCategories = categories.filter((c) => c.parentId === -1);

  console.log(parentCategories);
  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <BackButton to="/admin" />
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase flex items-center">
              <LayoutGrid className="w-8 h-8 mr-3 rtl:ml-3 rtl:mr-0 text-amber-500" />{" "}
              {t("admin.categories.title")}
            </h1>
            <p className="text-muted-foreground font-medium">
              {t("admin.categories.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Column */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xl sticky top-24">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center">
              <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-amber-500" />{" "}
              {t("admin.categories.new_cat")}
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {t("admin.categories.cat_name")}
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Football"
                  className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={addCategory.isPending}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest mt-4 disabled:opacity-50"
              >
                {addCategory.isPending
                  ? t("common.loading")
                  : t("admin.categories.add")}
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-card border border-border rounded-3xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {parentCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm group hover:shadow-md transition-all"
                >
                  <div className="p-6 flex items-center justify-between bg-input/20">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="p-2 bg-amber-500/10 rounded-xl">
                        <Tag className="w-5 h-5 text-amber-500" />
                      </div>
                      <h3 className="font-black text-xl tracking-tight uppercase">
                        {cat.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id.toString())}
                      className="p-2 text-danger-500 hover:bg-danger-500/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 bg-card/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {cat.children?.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3 bg-input/30 rounded-xl border border-border/50 group/sub"
                        >
                          <span className="font-bold text-sm tracking-tight">
                            {sub.name}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteCategory(sub.id.toString())
                            }
                            className="p-1.5 text-danger-500 opacity-0 group-hover/sub:opacity-100 hover:bg-danger-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {(!cat.children || cat.children.length === 0) && (
                        <p className="text-xs text-muted-foreground font-medium italic">
                          {t("admin.categories.no_subs")}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSubNames[cat.id] || ""}
                        onChange={(e) =>
                          setNewSubNames({
                            ...newSubNames,
                            [cat.id]: e.target.value,
                          })
                        }
                        placeholder={t("admin.categories.new_sub")}
                        className="flex-1 bg-input/50 border border-border rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      />
                      <button
                        onClick={() => handleAddSubcategory(cat.id.toString())}
                        disabled={addSubcategory.isPending}
                        className="bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-80 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {addSubcategory.isPending
                          ? t("common.loading")
                          : t("admin.categories.add")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
