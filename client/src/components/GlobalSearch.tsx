import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { useDebounce } from "use-debounce";
import { Search, User as UserIcon, Table as TableIcon, X } from "lucide-react";
import { api } from "../lib/api";
import type { Checklist, User } from "../store/useStore";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<{
    users: User[];
    collections: Checklist[];
  }>({ users: [], collections: [] });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [allData, setAllData] = useState<{
    users: User[];
    collections: Checklist[];
  }>({ users: [], collections: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, collectionsRes] = await Promise.all([
          api.getUsers(),
          api.getChecklists(),
        ]);
        setAllData({
          users: usersRes.data.data,
          collections: collectionsRes.data,
        });
      } catch (error) {
        console.error("Failed to fetch search data", error);
      }
    };

    if (isOpen && allData.users.length === 0) {
      fetchData();
    }
  }, [isOpen, allData.users.length, allData.collections.length]);

  const fuseUsers = useMemo(
    () =>
      new Fuse(allData.users, {
        keys: ["fullName", "username", "mobile", "id"],
        threshold: 0.3,
      }),
    [allData.users],
  );

  const fuseCollections = useMemo(
    () =>
      new Fuse(allData.collections, {
        keys: ["name", "game", "category", "subcategory"],
        threshold: 0.3,
      }),
    [allData.collections],
  );

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults({ users: [], collections: [] });
      return;
    }

    setLoading(true);
    const userResults = fuseUsers.search(debouncedQuery).map((r) => r.item);
    const collectionResults = fuseCollections
      .search(debouncedQuery)
      .map((r) => r.item);

    setResults({
      users: userResults,
      collections: collectionResults,
    });
    setLoading(false);
  }, [debouncedQuery, fuseUsers, fuseCollections]);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search collections or users..."
          className="w-full bg-input/50 border border-border rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-input rounded-full"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {isOpen && (debouncedQuery.length >= 2 || loading) && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
              Searching...
            </div>
          ) : (
            <div className="p-2 space-y-4">
              {results?.collections?.length > 0 && (
                <div>
                  <h3 className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Collections
                  </h3>
                  {results?.collections.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(`/collection/${c.id}`)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-input rounded-xl transition-colors text-left"
                    >
                      <div className="p-2 bg-primary-500/10 rounded-lg">
                        <TableIcon className="w-4 h-4 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.name} • {c.subcategory?.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.users.length > 0 && (
                <div>
                  <h3 className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Users
                  </h3>
                  {results.users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSelect(`/profile/${u.id}`)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-input rounded-xl transition-colors text-left"
                    >
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <UserIcon className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-tight">
                          {u.fullName}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          @{u.username} • {u.points} Rep Points
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.collections.length === 0 &&
                results.users.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No results found for "{debouncedQuery}"
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
