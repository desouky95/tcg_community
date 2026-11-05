import { useScrapperList } from "@tcg/react-query";
import { Button, DataTable, IconButton, PageHeading } from "@tcg/ui-web";
import { ChevronDown, Link, Plus, X } from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrapperModal } from "../../../components/patterns/ScrapperModal";

export const AdminScrapper = () => {
  const { data } = useScrapperList();

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleOnClose = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return (
    <div className="grid gap-8">
      <ScrapperModal open={isDialogOpen} onOpenChange={handleOnClose} />
      <PageHeading
        size="xl"
        title={"Scrapper Jobs"}
        // description={t("admin.categories.subtitle")}
        actions={
          <div className="flex gap-4">
            <Button onClick={() => setIsDialogOpen(true)}>
              View Collections
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus aria-hidden="true" className="size-4" />
              Add Scrapper Job
            </Button>
          </div>
        }
      />

      <DataTable.Root scrollLabel="Scrapper jobs">
        <DataTable.Table className="min-w-190">
          <DataTable.Header>
            <DataTable.Row>
              <DataTable.Head className="w-14">
                <span className="sr-only">Expand job</span>
              </DataTable.Head>
              <DataTable.Head>Job / collection</DataTable.Head>
              <DataTable.Head>Source</DataTable.Head>
              <DataTable.Head>Year</DataTable.Head>
              <DataTable.Head>Scrapped at</DataTable.Head>
            </DataTable.Row>
          </DataTable.Header>
          <DataTable.Body>
            {data?.data.map((scrapper) => {
              const isExpanded = expandedIds.has(scrapper.job.name);
              const children = scrapper.collections ?? [];

              return (
                <Fragment key={scrapper.job.name}>
                  <DataTable.Row tone="muted">
                    <DataTable.Cell className="py-3">
                      <IconButton
                        variant="ghost"
                        aria-label={t(
                          isExpanded
                            ? "admin.categories.collapse"
                            : "admin.categories.expand",
                          { name: scrapper.job.name }
                        )}
                        aria-expanded={isExpanded}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleExpanded(scrapper.job.name);
                        }}
                        disabled={children.length === 0}
                      >
                        <ChevronDown
                          aria-hidden="true"
                          className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </IconButton>
                    </DataTable.Cell>
                    <DataTable.Cell
                      colSpan={4}
                      className="font-bold text-wax-ink"
                    >
                      {scrapper.job.name}
                    </DataTable.Cell>
                  </DataTable.Row>

                  {isExpanded &&
                    children.map((collection) => (
                      <DataTable.Row
                        key={`${scrapper.job.name}-${collection.content.sourceUrl}`}
                      >
                        <DataTable.Cell />
                        <DataTable.Cell>
                          {collection.content.title}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          <Button variant="ghost" asChild>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={collection.content.sourceUrl}
                            >
                              Open Source
                              <Link size={14} />
                            </a>
                          </Button>
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {collection.content.year}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {new Date(collection.content.scrapedAt).toUTCString()}
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                </Fragment>
              );
            })}
          </DataTable.Body>
        </DataTable.Table>
      </DataTable.Root>
    </div>
  );
};
