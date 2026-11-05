import { Alert, Button, Container, Heading, Input } from "@medusajs/ui";
import { Link } from "react-router-dom";

const CSV_TEMPLATE_DATA = [
  ["Number", "Name", "Variant", "Price"],
  ["1", "Max Downman", "", "90"],
  ["LE-EH", "Erling Halaand Limited Edition", "", "150"],
];

const CSV_CONTENT = CSV_TEMPLATE_DATA.join("\n");

const ImportMissingListPage = () => {
  const handleDownload = () => {
    const blob = new Blob([CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up memory
  };
  return (
    <Container>
      <div className="flex justify-end">
        <Link to="/missing-list">
          <Button>Go Back</Button>
        </Link>
      </div>
      <section className="grid gap-3">
        <Heading>1. Import a excel file</Heading>
        <div className="flex items-center justify-between">
          <Alert variant="info">You can download file template</Alert>
          <Button onClick={handleDownload}>Download Excel Template</Button>
        </div>
        <Input type="file" />
      </section>
    </Container>
  );
};

export default ImportMissingListPage;
