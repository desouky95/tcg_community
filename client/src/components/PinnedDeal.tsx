import { useRef, useState } from "react";
import type { SwapDealDto } from "../hooks/useConversations";
import { Handshake, ChevronDown, ChevronUp, MapPin, Mail } from "lucide-react";
import DealBubble from "./DealBubble";
import { useClickAway } from "@reactuses/core";

interface PinnedDealProps {
  deal: SwapDealDto;
}

export default function PinnedDeal({ deal }: PinnedDealProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => {
    setIsExpanded(false);
  });

  const handleExpand = () => {
    // if (!isExpanded) document.body.style.overflow = "hidden";
    // else document.body.style.overflow = "";
    setIsExpanded(!isExpanded);
  };
  const statusColors = {
    pending: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    accepted: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    in_progress: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    shipping: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    completed: "text-green-500 bg-green-500/10 border-green-500/20",
    cancelled: "text-red-500 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="sticky top-0 z-20 w-full px-4 pt-4 pb-2 bg-linear-to-b from-background via-background to-transparent">
      <div
        className={`border border-border rounded-2xl shadow-lg transition-all duration-300 overflow-auto bg-card/80 ${isExpanded ? "h-fit" : "max-h-[64px]"}`}
      >
        {/* Banner Header */}
        <div
          onClick={handleExpand}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-input/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${statusColors[deal.status]}`}>
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black uppercase tracking-widest text-[10px]">
                  Active Swap Deal
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full border border-current text-[8px] font-black uppercase tracking-tighter ${statusColors[deal.status]}`}
                >
                  {deal.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs font-bold text-muted-foreground line-clamp-1">
                {deal.offeredCards} ⇄ {deal.requestedCards}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              {deal.swapType === "in_person" ? (
                <MapPin className="w-3 h-3" />
              ) : (
                <Mail className="w-3 h-3" />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest">
                {deal.swapType.replace("_", " ")}
              </span>
            </div>
            <button className="p-1 rounded-lg hover:bg-input transition-colors">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div
            data-name="expanded-content"
            // className="fixed w-screen z-20 h-screen p-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-300"
            className="w-full z-20 h-fit p-4 pt-0"
          >
            <div className="w-full">
              <DealBubble deal={deal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
