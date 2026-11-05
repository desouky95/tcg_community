import {
  Button,
  Container,
  createDataTableColumnHelper,
  CurrencyInput,
  DataTable,
  Heading,
  Select,
  useDataTable,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../utils/request.ts";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
type Collection = {
  id: string;
  image_url: string | null;
  name: string;
  year: number;
};
type Card = {
  id: string;
  number: string;
  name: string;
  section?: string | null;
  variant?: string | null;
};

type CardOverride = Card & { price: number | null };

type CardsForm = {
  variants: Record<string, Record<string, number>>;
};
const columnHelper = createDataTableColumnHelper<CardOverride>();

const columns = [
  columnHelper.accessor("number", {}),
  columnHelper.accessor("name", {}),
  columnHelper.accessor("variant", {}),
  columnHelper.accessor("price", {}),
];
const ExternalMissingListPage = () => {
  const [selected, setSelected] = useState<string>("");
  const [loadedId, setLoadedId] = useState<string>("");
  const [defaultPrice, setDefaultPrice] = useState<number>();
  const [cards, setCards] = useState<CardOverride[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["collections"],
    queryFn: () => {
      return request<{
        collections: Collection[];
      }>(`/admin/card-collections/catalog`);
    },
  });

  const {
    data: batch,
    refetch,
    isSuccess,
  } = useQuery({
    enabled: false,
    queryKey: ["collection", "catalog", selected],
    queryFn: async () => {
      const result = await request<{
        cards?: Card[];
        total: number;
      }>(`/admin/card-collections/catalog/${selected}?`);
      setLoadedId(selected);
      setCards(
        (result.cards ?? []).map((_) => ({
          ..._,
          price: !defaultPrice ? null : Number(defaultPrice),
        })),
      );
      return result;
    },
  });

  const loadedCollection = useMemo(
    () => data?.collections.find((_) => _.id == loadedId),
    [loadedId, data?.collections],
  );
  const [open, setOpen] = useState(false);

  const table = useDataTable({
    columns,
    data: cards,
  });
  return (
    <Container className="grid gap-4">
      <div className="flex justify-end">
        <Link to="/missing-list">
          <Button>Go Back</Button>
        </Link>
      </div>
      <section className="grid gap-3">
        <Heading level="h1" className="mb-4">
          External Missing List
        </Heading>
        <Heading>
          1. Choose a ready made collection from the list below to create a
          missing list.
        </Heading>
        <Select onValueChange={(c) => setSelected(c)}>
          <Select.Trigger>
            <Select.Value placeholder="Collection" />
          </Select.Trigger>
          <Select.Content position="item-aligned">
            {data?.collections.map((item) => (
              <Select.Item key={item.id} value={item.id}>
                {item.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <Button disabled={!selected} onClick={() => refetch()}>
          Load Cards
        </Button>
      </section>
      <section className="grid gap-3">
        <Heading className="mb-4">2. Choose a default price in EGP</Heading>
        <CurrencyInput
          code="EGP"
          symbol="EGP"
          value={defaultPrice}
          onValueChange={(v) => setDefaultPrice(Number(v))}
        />
      </section>

      {loadedCollection && (
        <section className="relative">
          <Heading>3. Loaded Collection</Heading>
          <Heading level="h3">{loadedCollection?.name}</Heading>
          <DataTable instance={table}>
            <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
              <Heading>Products</Heading>
            </DataTable.Toolbar>
            <div className={`${open ? "" : "max-h-[300px]"} overflow-hidden`}>
              <DataTable.Table />
            </div>
          </DataTable>
          <div className="sticky bottom-0 -left-1/2 translate-x-1/2">
            <Button onClick={() => setOpen((prev) => !prev)}>
              Show All List
            </Button>
          </div>
        </section>
      )}
    </Container>
  );
};

export default ExternalMissingListPage;
