"use client";

import { Button, Input } from "@tcg/ui-web";
import { Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

export function PaymentLink({ url }: { url: string }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "manual">("idle");
  // Keep dense codes scannable at the displayed size. Longer links remain copyable.
  const showQr = new TextEncoder().encode(url).length <= 512;

  async function copyPaymentLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("manual");
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {showQr ? (
        <>
          <p className="text-sm font-semibold">Scan with your phone to pay</p>
          <QRCodeSVG
            value={url}
            size={260}
            marginSize={4}
            level="M"
            title="InstaPay payment link QR code"
            role="img"
            className="h-auto max-w-full rounded-sm"
          />
        </>
      ) : (
        <p className="text-sm">QR unavailable. Copy the payment link to your phone.</p>
      )}
      <Button variant="outline" onClick={copyPaymentLink}>
        <Copy aria-hidden="true" />
        Copy payment link
      </Button>
      {copyStatus === "manual" && (
        <Input
          aria-label="Payment link"
          value={url}
          readOnly
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
      <p role="status" className="empty:hidden text-sm text-muted-foreground">
        {copyStatus === "copied" && "Payment link copied."}
        {copyStatus === "manual" && "Select and copy the payment link above."}
      </p>
    </div>
  );
}
