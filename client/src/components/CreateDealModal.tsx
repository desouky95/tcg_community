import { useState } from 'react';
import { useProposeSwapDeal } from '../hooks/useSwapDeals';
import { X, MapPin, Mail, Sparkles } from 'lucide-react';

interface CreateDealModalProps {
  conversationId: number;
  onClose: () => void;
}

export default function CreateDealModal({ conversationId, onClose }: CreateDealModalProps) {
  const proposeDeal = useProposeSwapDeal();
  
  const [swapType, setSwapType] = useState<'in_person' | 'postal'>('in_person');
  const [offeredCards, setOfferedCards] = useState('');
  const [requestedCards, setRequestedCards] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeredCards.trim() || !requestedCards.trim()) return;

    proposeDeal.mutate({
      conversation_id: conversationId,
      swap_type: swapType,
      offered_cards: offeredCards,
      requested_cards: requestedCards
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              Propose Swap Deal
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">Create a formal agreement with this trader</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Swap Type Toggle */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Swap Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSwapType('in_person')}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  swapType === 'in_person' 
                    ? 'border-primary-500 bg-primary-500/5 ring-4 ring-primary-500/10' 
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <MapPin className={`w-5 h-5 ${swapType === 'in_person' ? 'text-primary-500' : 'text-muted-foreground'}`} />
                <div className="text-left">
                  <div className={`text-sm font-bold ${swapType === 'in_person' ? 'text-foreground' : 'text-muted-foreground'}`}>On-Ground</div>
                  <div className="text-[10px] opacity-70 font-medium">Meet in person</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSwapType('postal')}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  swapType === 'postal' 
                    ? 'border-secondary-500 bg-secondary-500/5 ring-4 ring-secondary-500/10' 
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <Mail className={`w-5 h-5 ${swapType === 'postal' ? 'text-secondary-500' : 'text-muted-foreground'}`} />
                <div className="text-left">
                  <div className={`text-sm font-bold ${swapType === 'postal' ? 'text-foreground' : 'text-muted-foreground'}`}>Postal</div>
                  <div className="text-[10px] opacity-70 font-medium">Mail via postage</div>
                </div>
              </button>
            </div>
          </div>

          {/* Card Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary-500 ml-1">What you offer</label>
              <textarea
                value={offeredCards}
                onChange={e => setOfferedCards(e.target.value)}
                placeholder="Charizard EX, Pikachu VMAX..."
                className="w-full h-32 bg-muted/50 border-2 border-border focus:border-primary-500 rounded-3xl p-4 text-sm outline-none transition-all resize-none font-medium"
              />
              <p className="text-[9px] text-muted-foreground font-bold px-1 italic">Comma separated list of cards</p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary-500 ml-1">What you need</label>
              <textarea
                value={requestedCards}
                onChange={e => setRequestedCards(e.target.value)}
                placeholder="Blastoise EX, Mewtwo GX..."
                className="w-full h-32 bg-muted/50 border-2 border-border focus:border-secondary-500 rounded-3xl p-4 text-sm outline-none transition-all resize-none font-medium"
              />
              <p className="text-[9px] text-muted-foreground font-bold px-1 italic">Comma separated list of cards</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={proposeDeal.isPending}
              className="w-full py-5 bg-foreground text-background hover:opacity-90 disabled:opacity-50 rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-foreground/10 flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              {proposeDeal.isPending ? 'Proposing...' : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
