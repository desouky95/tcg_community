import { Button } from "@tcg/ui-web";
import { motion } from "motion/react";
import { useState } from "react";

export default function Test() {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen w-full flex bg-red-400 h-px">
      <motion.aside
        className="h-full bg-amber-100"
        animate={{
          width: open ? '' : "0px",
        }}
      >
        <div className="h-full min-w-72 "></div>
      </motion.aside>
      <main className="flex-1 h-full bg-green-200">
        <Button onClick={() => setOpen(!open)}>
          {open ? "Close" : "Open"}
        </Button>
      </main>
    </div>
  );
}
