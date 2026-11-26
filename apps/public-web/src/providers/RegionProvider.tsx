"use client"; // include with Next.js 13+

import { createContext, useContext, useEffect, useState } from "react";
import { HttpTypes, StoreRegion } from "@medusajs/types";
import { sdk } from "../lib/clients/medusa";

type RegionContextType = {
  region?: HttpTypes.StoreRegion;
  setRegion: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreRegion | undefined>
  >;
};

const RegionContext = createContext<RegionContextType | null>(null);

type RegionProviderProps = {
  children: React.ReactNode;
  regions: StoreRegion[];
};

export const RegionProvider = ({ children, regions }: RegionProviderProps) => {
  const [region, setRegion] = useState<HttpTypes.StoreRegion>();

  useEffect(() => {
    if (region) {
      // set its ID in the local storage in
      // case it changed
      localStorage.setItem("region_id", region.id);
      return;
    }

    const regionId = localStorage.getItem("region_id");
    if (!regionId && regions.length > 0) {
      setRegion(regions[0]);
    } else {
      // retrieve selected region
    }
  }, [region]);

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);

  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }

  return context;
};
