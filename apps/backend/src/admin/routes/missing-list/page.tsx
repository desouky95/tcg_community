import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Container } from "@medusajs/ui";
import { Link } from "react-router-dom";
import { ListCheckbox } from "@medusajs/icons";
import { Listicle } from "@medusajs/dashboard/components";
const MissingListProductPage = () => {
  return (
    <div className="flex gap-4 ">
      <Link to="/missing-list/external" className="h-full">
        <Listicle
          labelKey="External"
          descriptionKey="Create a missing list from ready made collections"
        />
      </Link>
      <Link to="/missing-list/import" className="h-full">
        <Listicle
          labelKey="Import"
          descriptionKey="Create a missing list from excel file"
        />
      </Link>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Missing List Product",
  icon: ListCheckbox,
});
export default MissingListProductPage;
