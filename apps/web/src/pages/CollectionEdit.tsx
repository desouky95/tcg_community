import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useChecklist } from "../hooks/useChecklists";
import {
  useUserChecklist,
  useUpdateUserChecklist,
  useUserChecklistMutation,
} from "../hooks/useUserChecklists";
import Layout from "../components/Layout";
import { Save, FileSpreadsheet } from "lucide-react";
import { BackButton } from "../components/common/BackButton";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { toast } from "react-hot-toast";

export default function CollectionEdit() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: checklist, isLoading: checklistLoading } = useChecklist(id);
  const { data: userProgress, isLoading: progressLoading } =
    useUserChecklist(id);

  const { mutateAsync: getUserChecklist } = useUserChecklistMutation(id);
  const updateMutation = useUpdateUserChecklist();

  const [missingList, setMissingList] = useState(userProgress?.missingList);
  const [duplicatesList, setDuplicatesList] = useState(
    userProgress?.duplicatesList,
  );
  const [collectedList, setCollectedList] = useState(
    userProgress?.collectedList,
  );
  const [treatEmptyAsMissing, setTreatEmptyAsMissing] = useState(true);

  useEffect(() => {
    const init = async () => {
      const data = await getUserChecklist();
      setMissingList(data?.missingList);
      setDuplicatesList(data?.duplicatesList);
      setCollectedList(data?.collectedList);
    };
    init();
  }, [getUserChecklist]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("treatEmptyAsMissing", String(treatEmptyAsMissing));
      const response = await api.importUserChecklist(id, formData);
      const updatedProgress = response.data;

      setMissingList(updatedProgress.missingList || "");
      setDuplicatesList(updatedProgress.duplicatesList || "");
      setCollectedList(updatedProgress.collectedList || "");

      toast.success(t("collection_edit.import_success"));
    } catch (error) {
      console.error("Excel import error:", error);
      toast.error(t("collection_edit.import_error"));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!id) return;
    await updateMutation.mutateAsync({
      id,
      data: {
        missingList,
        duplicatesList,
        collectedList,
      },
    });
  };

  const loading = checklistLoading || progressLoading;

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-card rounded" />
          <div className="h-40 bg-card rounded" />
          <div className="h-40 bg-card rounded" />
          <div className="h-40 bg-card rounded" />
        </div>
      </Layout>
    );
  }

  if (!checklist) {
    return (
      <Layout>
        <div className="text-center py-20 text-muted-foreground">
          {t("collection.not_found")}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="wax-workspace-view wax-collection-edit-view">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <BackButton />
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">
              {t("collection_edit.title")}
            </h1>
            <p className="text-muted-foreground text-xs font-bold opacity-70">
              {checklist.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex items-center gap-2 mr-4 bg-muted/30 px-3 py-2 rounded-lg border border-border/50">
            <input
              type="checkbox"
              id="treatEmptyAsMissing"
              checked={treatEmptyAsMissing}
              onChange={(e) => setTreatEmptyAsMissing(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label
              htmlFor="treatEmptyAsMissing"
              className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer select-none"
            >
              {t("collection_edit.treat_empty_as_missing")}
            </label>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleExcelImport}
            accept=".xlsx, .xls"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-2.5 bg-card hover:bg-border/40 text-foreground border border-border rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-500" />
            <span>{t("collection_edit.import_excel")}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>
              {updateMutation.isPending
                ? t("common.loading")
                : t("collection_edit.save")}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Missing List */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 ml-1">
            {t("collection_edit.missing_list")}
          </label>
          <textarea
            value={missingList ?? ""}
            onChange={(e) => setMissingList(e.target.value)}
            placeholder="1, 2, 3, 45, 102..."
            className="w-full bg-input/20 border-2 border-border/50 rounded-xl p-4 min-h-[150px] focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-medium font-mono placeholder:text-muted-foreground/30"
          />
        </div>

        {/* Duplicates */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 ml-1">
            {t("collection_edit.duplicates")}
          </label>
          <textarea
            value={duplicatesList ?? ""}
            onChange={(e) => setDuplicatesList(e.target.value)}
            placeholder="10, 15, 22, 22, 104..."
            className="w-full bg-input/20 border-2 border-border/50 rounded-xl p-4 min-h-[150px] focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-medium font-mono placeholder:text-muted-foreground/30"
          />
        </div>

        {/* My Collection */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 ml-1">
            {t("collection_edit.my_collection")}
          </label>
          <textarea
            value={collectedList ?? ""}
            onChange={(e) => setCollectedList(e.target.value)}
            placeholder="1, 2, 3, 5, 6, 7, 8..."
            className="w-full bg-input/20 border-2 border-border/50 rounded-xl p-4 min-h-[150px] focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-medium font-mono placeholder:text-muted-foreground/30"
          />
        </div>
      </div>
      </div>
    </Layout>
  );
}
