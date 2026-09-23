import { useCallback, useMemo, useState } from "react";
import { useProfile, useUserInfo } from "../hooks/useUsers";
import { useReviews, useAddReview } from "../hooks/useReviews";
import { useStore, type UserChecklist } from "../store/useStore";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useFindOrCreateConversation } from "../hooks/useConversations";
import {
  ThumbsUp,
  ThumbsDown,
  Send,
  Award,
  MessageCircle,
  Trophy,
  ArrowRight,
  Package,
  Book,
  MapPin,
  Settings as SettingsIcon,
  Repeat,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import type { TFunction } from "i18next";
import { useSwapMatch } from "../hooks/useSwapMatch";
import type { SwapResultMatch } from "../hooks/useSwapSearch";

interface CollectionItemListProps {
  title: string;
  items: string[];
  colorClass: string;
  bgColorClass: string;
  t: TFunction<"translation", undefined>;
}

const CollectionItemList = ({
  title,
  items,
  colorClass,
  bgColorClass,
  t,
}: CollectionItemListProps) => {
  const [showAll, setShowAll] = useState(false);
  const limit = 30;
  const displayedItems = showAll ? items : items.slice(0, limit);
  const hasMore = items.length > limit;
  if (items.length === 0) return null;

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-2 rtl:flex-row-reverse">
        <h5
          className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${colorClass}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${colorClass.replace("text-", "bg-")}`}
          ></span>
          {title}
          <span className="bg-input/30 px-1.5 py-0.5 rounded text-[10px] opacity-70">
            {items.length}
          </span>
        </h5>
      </div>
      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-input/10 border border-border/30">
        {displayedItems.map((item, idx) => (
          <span
            key={idx}
            className={`px-2 py-0.5 ${bgColorClass} ${colorClass} rounded-md text-[10px] font-bold border border-current/10 shadow-xs`}
          >
            {item}
          </span>
        ))}
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[10px] px-2 py-0.5 font-bold text-primary-500 hover:bg-primary-500/10 rounded-md transition-all underline underline-offset-2"
          >
            {showAll
              ? t("profile.show_less")
              : `+${items.length - limit} ${t("profile.show_more")}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default function Profile() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const currentUser = useStore((state) => state.user);
  const updatePoints = useStore((state) => state.updatePoints);

  // If no ID is provided, assume we want the logged-in user's profile
  const isOwnProfile = !id || id == currentUser?.id;

  const useProfileHook = isOwnProfile ? useProfile : useUserInfo;
  const { data, isLoading: userLoading } = useProfileHook(id);

  const { data: match } = useSwapMatch(id!, !isOwnProfile);

  const profileUser = data?.data;

  const userCategories = useMemo(() => {
    return profileUser?.categories || [];
  }, [profileUser?.categories]);

  const targetId = id || currentUser?.id;
  const { data: reviews = [], isLoading: reviewsLoading } =
    useReviews(targetId);
  const addReview = useAddReview();

  const navigate = useNavigate();
  const createConversation = useFindOrCreateConversation();

  const handleMessageClick = async () => {
    if (!profileUser?.id) return;
    try {
      const conv = await createConversation.mutateAsync(profileUser.id);
      navigate(`/chat/${conv.id}`);
    } catch {
      toast.error(t("Failed to start conversation"));
    }
  };

  // Review form state
  const [reviewType, setReviewType] = useState<"positive" | "negative">(
    "positive",
  );
  const [comment, setComment] = useState("");

  const loading = userLoading || reviewsLoading;

  // Gamification logic variables
  const getLevel = (pts: number) => {
    if (pts < 0)
      return { name: t("profile.level.untrusted"), color: "text-danger-500" };
    if (pts < 20)
      return {
        name: t("profile.level.new"),
        color: "text-gray-500 font-medium",
      };
    if (pts < 50)
      return {
        name: t("profile.level.reliable"),
        color: "text-success-500 font-bold",
      };
    return {
      name: t("profile.level.master"),
      color: "text-amber-500 font-extrabold",
    };
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser || !targetId) return;

    try {
      const res = await addReview.mutateAsync({
        targetUserId: targetId,
        type: reviewType,
        comment,
      });

      setComment("");
      toast.success("Review posted successfully!");

      // If we are reviewing ourselves, sync store point state
      if (currentUser.id === targetId) {
        updatePoints(res.data.newPoints);
      }
    } catch {
      toast.error("Failed to post review");
    }
  };
  const getCheckListProgress = useCallback((checklist: UserChecklist) => {
    if (!checklist.checklist?.totalCards) return 0;
    const progress =
      (((checklist.checklist?.totalCards || 0) -
        (checklist.missingListArray?.length || 0)) /
        checklist.checklist?.totalCards) *
      100;
    return Math.floor(progress);
  }, []);

  if (loading)
    return (
      <Layout>
        <div className="animate-pulse flex items-center justify-center py-20">
          {t("profile.loading")}
        </div>
      </Layout>
    );
  if (!profileUser)
    return (
      <Layout>
        <div className="text-center py-12">{t("profile.not_found")}</div>
      </Layout>
    );

  const levelInfo = getLevel(profileUser.points);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (Left/Top) */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Profile Information (Minimalist Redesign) */}
          <div className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-sm relative group">
            {/* Level Badge - Top Left */}
            <div className="absolute -top-2 -inset-s-2 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/50 shadow-xs bg-muted/30 backdrop-blur-sm z-20 transition-all hover:bg-muted/50">
              <Award className={`w-4 h-4 ${levelInfo.color}`} />
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${levelInfo.color}`}
              >
                {levelInfo.name}
              </span>
            </div>

            {/* Conditional Flair Background */}
            {profileUser.points >= 50 && (
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
            )}

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              {/* Avatar Section */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 bg-linear-to-br from-primary-500 via-primary-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary-500/20 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  {profileUser.fullName?.charAt(0)}
                </div>
              </div>

              {/* Main Information */}
              <div className="text-center md:text-left flex-1 space-y-2">
                <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4 pt-8 md:pt-0">
                  <h2 className="text-2xl font-black tracking-tight text-foreground uppercase italic leading-none">
                    {profileUser.fullName}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
                  <p className="text-primary-500 font-black text-sm font-mono tracking-tight">
                    @{profileUser.username}
                  </p>

                  {profileUser.governorate && (
                    <div className="flex items-center gap-1.5 text-muted-foreground/60">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold tracking-tight">
                        {t(`common.governorates.${profileUser.governorate}`)}
                      </span>
                    </div>
                  )}

                  {profileUser.blocked && (
                    <div className="flex items-center gap-1 text-danger-500 bg-danger-500/10 px-2 py-0.5 rounded-md">
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        {t("profile.blocked_badge")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Compact Stats Row */}
              <div className="grid gap-2">
                <div className="w-full md:w-auto grid grid-cols-2 bg-input/10 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden divide-x divide-border/50 transition-all hover:border-primary-500/30">
                  <div className="px-6 py-4 text-center md:text-left hover:bg-primary-500/5 transition-colors">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 mb-1.5">
                      {t("profile.reputation")}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2.5">
                      <span
                        className={`text-2xl font-black leading-none ${profileUser.points < 0 ? "text-danger-500" : "text-primary-500"}`}
                      >
                        {profileUser.points}
                      </span>
                      <div className="flex flex-col text-[8px] font-black items-start gap-0.5 opacity-70">
                        <span className="text-success-500">
                          +{profileUser.positiveReviewsCount}
                        </span>
                        <span className="text-danger-500">
                          -{profileUser.negativeReviewsCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 text-center md:text-left hover:bg-primary-500/5 transition-colors">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 mb-1.5">
                      {t("profile.positive_ratio")}
                    </p>
                    <div className="flex items-baseline justify-center md:justify-start gap-0.5">
                      <span className="text-2xl font-black text-foreground leading-none">
                        {profileUser.positiveReviewsCount +
                          profileUser.negativeReviewsCount >
                        0
                          ? Math.round(
                              (profileUser.positiveReviewsCount /
                                (profileUser.positiveReviewsCount +
                                  profileUser.negativeReviewsCount)) *
                                100,
                            )
                          : 0}
                      </span>
                      <span className="text-[10px] font-black text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                </div>
                {isOwnProfile ? (
                  <Link
                    to="/profile/edit"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-green-500/20"
                    title="Edit Profile"
                  >
                    <SettingsIcon className="w-4 h-4 group-hover/edit:rotate-90 transition-transform duration-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
                      {t("profile.edit")}
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={handleMessageClick}
                    disabled={createConversation.isPending}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-primary-500/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {createConversation.isPending ? "..." : "Message"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Swap Matches Highlight */}
          {!isOwnProfile && match && match.matches?.length > 0 && (
            <>
              <div className="bg-linear-to-r from-primary-500/10 to-indigo-500/10 border border-primary-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col group mt-8">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none rtl:left-0 rtl:right-auto rtl:-scale-x-100">
                  <Repeat className="w-32 h-32 text-primary-500 transform -rotate-12 scale-150" />
                </div>

                <div className="flex items-center justify-between mb-6 relative z-10 rtl:flex-row-reverse">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary-500/20 rounded-2xl text-primary-500 backdrop-blur-sm border border-primary-500/20">
                      <Repeat className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-widest text-primary-500 leading-none">
                        Perfect Match!
                      </h3>
                      <p className="text-xs font-bold text-muted-foreground mt-1">
                        You can make{" "}
                        <span className="text-foreground text-sm">
                          {match.totalMutalTrades}
                        </span>{" "}
                        mutual trades.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 relative z-10 w-full">
                  {match.matches.map((m: SwapResultMatch) => (
                    <div
                      key={m.checklistId}
                      className="bg-card/60 backdrop-blur-md border border-primary-500/10 rounded-2xl p-5 hover:border-primary-500/30 transition-colors shadow-sm"
                    >
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 pb-3 border-b border-border border-dashed rtl:text-right">
                        {m.checklist?.name}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        {/* Divider for desktop */}
                        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-border border-dashed -translate-x-1/2" />

                        <div className="rtl:text-right">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-success-500 mb-3 flex items-center gap-2 rtl:flex-row-reverse">
                            <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
                            They Offer You
                          </div>
                          {m.theyOffer?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {m.theyOffer.map((num: string) => (
                                <span
                                  key={num}
                                  className="px-2.5 py-1 bg-success-500/10 text-success-500 border border-success-500/20 text-xs font-black rounded-lg"
                                >
                                  {num}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic font-medium">
                              Nothing they can offer
                            </span>
                          )}
                        </div>

                        <div className="rtl:text-right">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-3 flex items-center gap-2 rtl:flex-row-reverse">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                            They Need From You
                          </div>
                          {m.theyNeed?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {m.theyNeed.map((num: string) => (
                                <span
                                  key={num}
                                  className="px-2.5 py-1 bg-primary-500/10 text-primary-500 border border-primary-500/20 text-xs font-black rounded-lg"
                                >
                                  {num}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic font-medium">
                              Nothing they need
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-border/50 my-8" />
            </>
          )}

          {/* Collections Section */}
          <div className="rtl:text-right">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 rtl:flex-row-reverse">
              <Trophy className="w-6 h-6 text-amber-500" />
              {t("profile.collections")}
            </h3>

            <div className="my-8">
              {userCategories.map((category) => (
                <>
                  <a href={`#${category.name}`}>{category.name}</a>
                  <>
                    {category.children.map((child) => (
                      <div className="flex items-center gap-2">
                        <a href={`#${child.name}`} className="ps-10">
                          {child.name}
                        </a>
                        ({child.userChecklists.length})
                      </div>
                    ))}
                  </>
                </>
              ))}
            </div>
            {!profileUser.checklists || profileUser.checklists.length === 0 ? (
              <div className="text-center py-12 bg-input/10 rounded-2xl border border-dashed border-border border-opacity-50">
                <p className="text-muted-foreground">
                  {t("profile.no_collections")}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {profileUser.categories.map((category) => (
                  <>
                    <a
                      className="block invisible -top-12 relative"
                      id={category.name}
                    ></a>
                    <h2 className="bg-card w-full text-center p-2">
                      {category.name}
                    </h2>
                    <div className="space-y-6">
                      {category.children.map((sub) => (
                        <div className="space-y-6">
                          <a
                            className="block invisible -top-12 relative"
                            id={sub.name}
                          ></a>
                          <div
                            id={sub.name}
                            className="flex items-center gap-2"
                          >
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <h4>{sub.name}</h4>
                          </div>

                          {sub.userChecklists.map((checklist) => (
                            <div
                              key={checklist.checklistId}
                              id={checklist.checklist?.name}
                              className="space-y-4"
                            >
                              <div className="flex items-center gap-2 mb-2 opacity-80 rtl:flex-row-reverse">
                                <Book className="w-4 h-4 text-muted-foreground" />
                                <div>{checklist.checklist?.name}</div>
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                <div
                                  key={checklist.checklistId}
                                  className="bg-card rounded-2xl border border-border p-5 hover:border-primary-500/50 transition-all hover:shadow-md group"
                                >
                                  <div className="flex justify-between items-start mb-4 rtl:flex-row-reverse">
                                    <div>
                                      <h4 className="font-bold text-lg leading-tight group-hover:text-primary-500 transition-colors">
                                        {checklist.name}
                                      </h4>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {t("profile.total")}:{" "}
                                        {checklist.checklist?.totalCards}
                                      </p>
                                    </div>
                                    <div className="bg-primary-500/10 text-primary-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-primary-500/20">
                                      {getCheckListProgress(checklist)}%
                                    </div>
                                  </div>

                                  {/* Progress Bar */}
                                  <div className="w-full bg-input/40 rounded-full h-2 mb-4 overflow-hidden">
                                    <div
                                      style={{
                                        width: `${getCheckListProgress(checklist)}%`,
                                      }}
                                      className="bg-linear-to-r from-primary-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                                    />
                                  </div>

                                  <div className="mt-6 space-y-4">
                                    <CollectionItemList
                                      title={t("profile.collected")}
                                      items={checklist.collectedListArray || []}
                                      colorClass="text-primary-500"
                                      bgColorClass="bg-primary-500/10"
                                      t={t}
                                    />
                                    <CollectionItemList
                                      title={t("profile.missing")}
                                      items={checklist.missingListArray || []}
                                      colorClass="text-danger-500"
                                      bgColorClass="bg-danger-500/10"
                                      t={t}
                                    />
                                    <CollectionItemList
                                      title={t("profile.duplicates")}
                                      items={
                                        checklist.duplicatesListArray || []
                                      }
                                      colorClass="text-amber-500"
                                      bgColorClass="bg-amber-500/10"
                                      t={t}
                                    />
                                  </div>

                                  <a
                                    href={`/collection/${checklist.checklistId}`}
                                    className="flex items-center justify-center gap-2 w-full py-2 mt-6 bg-input/50 hover:bg-primary-500 hover:text-white rounded-xl text-sm font-bold transition-all rtl:flex-row-reverse"
                                  >
                                    {t("profile.view_collection")}
                                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Space (Right) - Reviews Section */}
        <div className="lg:col-span-1 space-y-8">
          {/* Add Review Form */}
          {!isOwnProfile && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm rtl:text-right sticky top-20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 rtl:flex-row-reverse">
                <MessageCircle className="w-5 h-5 text-primary-500" />{" "}
                {t("profile.lead_review")}
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewType("positive")}
                    className={`w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all font-bold 
                      ${reviewType === "positive" ? "bg-success-500/10 text-success-600 border-2 border-success-500/50" : "bg-input/30 hover:bg-input/50 border-2 border-transparent text-muted-foreground"}`}
                  >
                    <ThumbsUp className="w-5 h-5" />{" "}
                    <span>
                      {t("profile.positive")} (+10 {t("profile.pt")})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewType("negative")}
                    className={`w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all font-bold 
                      ${reviewType === "negative" ? "bg-danger-500/10 text-danger-600 border-2 border-danger-500/50" : "bg-input/30 hover:bg-input/50 border-2 border-transparent text-muted-foreground"}`}
                  >
                    <ThumbsDown className="w-5 h-5" />{" "}
                    <span>
                      {t("profile.negative")} (-5 {t("profile.pt")})
                    </span>
                  </button>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("profile.comment_placeholder", {
                    name: profileUser.fullName,
                  })}
                  className="w-full bg-input/30 border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder:text-muted-foreground resize-none min-h-[100px] rtl:text-right"
                  maxLength={300}
                />

                <div className="flex justify-end rtl:justify-start">
                  <button
                    type="submit"
                    disabled={addReview.isPending || !comment.trim()}
                    className="flex items-center space-x-2 rtl:space-x-reverse bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-lg font-bold disabled:opacity-50 transition-colors w-full justify-center"
                  >
                    <span>
                      {addReview.isPending
                        ? t("profile.submitting")
                        : t("profile.submit_review")}
                    </span>
                    <Send className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </form>
            </div>
          )}

          <hr className="border-border/50" />

          {/* Feedback Feed */}
          <div className="rtl:text-right">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary-500" />
              {t("profile.recent_feedback")}
            </h3>
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-input/10 rounded-2xl border border-dashed border-border border-opacity-50">
                <p className="text-muted-foreground">
                  {t("profile.no_reviews")}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-card rounded-2xl border border-border p-5 hover:border-primary-500/30 transition-colors"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div
                          className={`p-2 rounded-full ${rev.type === "positive" ? "bg-success-500/10 text-success-500" : "bg-danger-500/10 text-danger-500"}`}
                        >
                          {rev.type === "positive" ? (
                            <ThumbsUp className="w-4 h-4" />
                          ) : (
                            <ThumbsDown className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-muted-foreground font-mono">
                            ID: {rev.reviewerId}
                          </p>
                          <p
                            className={`text-[10px] font-bold ${rev.type === "positive" ? "text-success-500" : "text-danger-500"}`}
                          >
                            {rev.type === "positive"
                              ? `+10 ${t("profile.pt")}`
                              : `-5 ${t("profile.pt")}`}
                          </p>
                        </div>
                      </div>
                      <p className="text-foreground/90 text-sm leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
