import { useState } from "react";
import type { SwapDealDto } from "../hooks/useConversations";
import {
  useAcceptSwapDeal,
  useScanDealQr,
  useUpdatePostalDeal,
  useMarkDealReceived,
} from "../hooks/useSwapDeals";
import { useStore } from "../store/useStore";
import {
  Handshake,
  QrCode,
  CheckCircle2,
  Camera,
  PackageCheck,
  MapPin,
  Mail,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Scanner } from "@yudiel/react-qr-scanner";

interface DealBubbleProps {
  deal: SwapDealDto;
}

export default function DealBubble({ deal }: DealBubbleProps) {
  const user = useStore((state) => state.user);
  const isCreator = deal.createdByUserId === user?.id;

  const acceptDeal = useAcceptSwapDeal(deal.conversationId);
  const scanQr = useScanDealQr(deal.conversationId);
  const updatePostal = useUpdatePostalDeal(deal.conversationId);
  const markReceived = useMarkDealReceived(deal.conversationId);

  const [showQr, setShowQr] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [trackingNum, setTrackingNum] = useState("");

  const statusColors = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    accepted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    in_progress: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    shipping: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNum.trim()) return;
    const formData = new FormData();
    formData.append("tracking", trackingNum);
    updatePostal.mutate({ id: deal.id, data: formData });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    updatePostal.mutate({ id: deal.id, data: formData });
  };

  return (
    <div className="flex flex-col w-full bg-card border border-border rounded-3xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div
        className={`p-4 border-b border-border flex items-center justify-between ${statusColors[deal.status]}`}
      >
        <div className="flex items-center gap-2">
          {deal.swapType === "in_person" ? (
            <MapPin className="w-4 h-4" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          <span className="font-black uppercase tracking-widest text-[10px]">
            {deal.swapType === "in_person" ? "On-Ground Swap" : "Postal Swap"}
          </span>
        </div>
        <div className="px-2 py-0.5 rounded-full border border-current text-[9px] font-black uppercase tracking-tighter">
          {deal.status.replace("_", " ")}
        </div>
      </div>

      {/* Lists */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
              Offering
            </span>
            <div className="flex flex-wrap gap-1">
              {deal.offeredCards.split(",").map((card, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-primary-500/10 text-primary-500 rounded-md text-[10px] font-bold border border-primary-500/10"
                >
                  {card.trim()}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
              Needs
            </span>
            <div className="flex flex-wrap gap-1">
              {deal.requestedCards.split(",").map((card, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-secondary-500/10 text-secondary-500 rounded-md text-[10px] font-bold border border-secondary-500/10"
                >
                  {card.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions based on State */}
        <div className="pt-4 border-t border-border/50">
          {deal.status === "pending" && !isCreator && (
            <button
              onClick={() => acceptDeal.mutate(deal.id)}
              disabled={acceptDeal.isPending}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
            >
              <Handshake className="w-4 h-4" />
              {acceptDeal.isPending ? "Processing..." : "Accept Deal"}
            </button>
          )}

          {deal.status === "accepted" && deal.swapType === "in_person" && (
            <div className="space-y-3">
              <p className="text-[10px] text-center text-muted-foreground font-bold italic">
                Meet in person and exchange QR codes to complete.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowQr(true)}
                  className="py-2.5 bg-muted hover:bg-muted/80 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" /> My Code
                </button>
                <button
                  onClick={() => setShowScanner(true)}
                  className="py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Scan Code
                </button>
              </div>
            </div>
          )}

          {deal.status === "accepted" && deal.swapType === "postal" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  Step 1: Proof of Cards
                </p>
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl hover:bg-muted/30 cursor-pointer transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    accept="image/*"
                  />
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Upload Photo</span>
                  </div>
                </label>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  Step 2: Tracking Number
                </p>
                <form onSubmit={handleTrackingSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={trackingNum}
                    onChange={(e) => setTrackingNum(e.target.value)}
                    placeholder="Enter Tracking #"
                    className="flex-1 bg-input/50 border border-border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-4 rounded-xl font-bold text-[10px] uppercase"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}

          {deal.status === "shipping" && deal.swapType === "postal" && (
            <button
              onClick={() => markReceived.mutate(deal.id)}
              disabled={markReceived.isPending}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-4 h-4" />
              {markReceived.isPending ? "Processing..." : "Mark as Received"}
            </button>
          )}

          {deal.status === "completed" && (
            <div className="flex flex-col items-center gap-2 py-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <span className="text-[11px] font-black uppercase text-green-500 tracking-widest line-through decoration-2">
                Swap Successful
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modals for QR */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full">
            <h3 className="font-black text-lg uppercase tracking-wider">
              Your Swap QR
            </h3>
            <div className="p-4 bg-white rounded-2xl">
              <QRCodeSVG value={`tcg-deal:${deal.id}:${user?.id}`} size={200} />
            </div>
            <p className="text-xs text-center text-muted-foreground font-medium">
              Let the other trader scan this code while you are together.
            </p>
            <button
              onClick={() => setShowQr(false)}
              className="w-full py-3 bg-muted rounded-xl font-bold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border p-4 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-md w-full">
            <h3 className="font-black text-lg uppercase tracking-wider">
              Scan Trader QR
            </h3>
            <div className="w-full aspect-square overflow-hidden rounded-2xl bg-black relative">
              <Scanner
                onScan={(result) => {
                  if (
                    result?.[0]?.rawValue?.startsWith(`tcg-deal:${deal.id}:`)
                  ) {
                    scanQr.mutate(deal.id);
                    setShowScanner(false);
                  }
                }}
              />
            </div>
            <button
              onClick={() => setShowScanner(false)}
              className="w-full py-3 bg-muted rounded-xl font-bold text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
