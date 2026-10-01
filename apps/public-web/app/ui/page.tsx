import { Button, PageHeading } from "@tcg/ui-web";

export default function UIPage() {
  return (
    <div className="p-2">
      <PageHeading title={"Button"}>Button</PageHeading>

      <div className="grid grid-cols-8 gap-1">
        <Button>Click Here</Button>
        <Button variant="ghost">Click Here</Button>
        <Button variant="outline">Click Here</Button>
        <Button tone="accent">Click Here</Button>
        <Button tone="danger">Click Here</Button>
        <Button tone="primary">Click Here</Button>
        <Button variant="outline" className="text-yellow-300">Click Here</Button>
      </div>
    </div>
  );
}
