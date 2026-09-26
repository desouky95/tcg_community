import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import Layout from "../components/Layout";
import {
  useConversations,
  useConversationMessages,
  useSendMessage,
  type ConversationListDto,
  type MessageDto,
} from "../hooks/useConversations";
import {
  Send,
  ArrowLeft,
  MoreVertical,
  Search,
  CheckCheck,
  PlusCircle,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CreateDealModal from "../components/CreateDealModal";
import PinnedDeal from "../components/PinnedDeal";

dayjs.extend(relativeTime);

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.user);
  const [messageText, setMessageText] = useState("");
  const [isCreateDealModalOpen, setIsCreateDealModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: conversations, isLoading: convsLoading } = useConversations();
  const { data: messagesData, isLoading: msgsLoading } =
    useConversationMessages(id);
  const sendMessage = useSendMessage();

  const messages = messagesData?.data || [];
  const otherUser = messagesData?.meta?.otherUser;
  const activeDeal = messagesData?.meta?.activeDeal;

  // Scroll to bottom when messages load or new message sent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]); // Use length to avoid object reference re-renders

  const activeConversation = conversations?.find((c) => c.id.toString() === id);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !id) return;

    const content = messageText;
    setMessageText(""); // Optimistic clear

    try {
      await sendMessage.mutateAsync({ conversationId: Number(id), content });
    } catch {
      setMessageText(content); // Restore on fail
    }
  };

  return (
    <Layout>
      <div className="wax-workspace-view wax-chat-view bg-card border border-border shadow-md rounded-2xl overflow-hidden h-[calc(100vh-8rem)] min-h-[600px] flex rtl:flex-row-reverse">
        {/* Sidebar - Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col rtl:border-l rtl:border-r-0 ${id ? "hidden md:flex" : "flex"}`}
        >
          <div className="p-4 border-b border-border bg-input/10">
            <h2 className="text-xl font-black uppercase tracking-wider mb-4 rtl:text-right">
              Messages
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-input/50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all rtl:pl-4 rtl:pr-9 rtl:text-right"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {convsLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-pulse">Loading...</div>
              </div>
            ) : conversations?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No conversations yet
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {conversations?.map((conv: ConversationListDto) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      navigate(`/chat/${conv.id}`);
                    }}
                    className={`w-full p-4 flex items-start gap-4 transition-all rtl:text-right
                      ${Number(id || -1) === conv.id ? "bg-primary-500/10" : "hover:bg-input/20"}`}
                  >
                    <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0">
                      {conv.otherUser.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1 rtl:flex-row-reverse">
                        <h4 className="font-bold truncate text-[15px]">
                          {conv.otherUser.fullName}
                        </h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground whitespace-nowrap">
                          {conv.lastMessage
                            ? dayjs(conv.lastMessage.createdAt).fromNow(true)
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
                        <p
                          className={`text-sm truncate pr-2 ${conv.unreadCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}
                        >
                          {conv.lastMessage ? (
                            <>
                              {conv.lastMessage.senderId.toString() ===
                              String(currentUser?.id)
                                ? "You: "
                                : ""}
                              {conv.lastMessage.content}
                            </>
                          ) : (
                            "No messages yet"
                          )}
                        </p>
                        {conv.unreadCount > 0 && (
                          <div className="bg-primary-500 text-white text-[10px] font-black rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 shrink-0 shadow-md">
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div
          className={`flex-1 flex flex-col bg-background/50 relative ${!id ? "hidden md:flex" : "flex"}`}
        >
          {!id ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-24 h-24 bg-input/30 rounded-full flex items-center justify-center mb-6">
                <Send className="w-10 h-10 opacity-50" />
              </div>
              <p className="font-bold text-lg">
                Select a conversation to start messaging
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-[72px] border-b border-border bg-card/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 rtl:flex-row-reverse z-10">
                <div className="flex items-center gap-3 rtl:flex-row-reverse">
                  <button
                    onClick={() => navigate("/chat")}
                    className="md:hidden p-2 rounded-xl hover:bg-input transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                  </button>
                  {otherUser ? (
                    <Link
                      to={`/profile/${otherUser.id}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity rtl:flex-row-reverse"
                    >
                      <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                        {otherUser.fullName.charAt(0)}
                      </div>
                      <div className="rtl:text-right">
                        <h3 className="font-black tracking-tight">
                          {otherUser.fullName}
                        </h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          @{otherUser.username}
                        </p>
                      </div>
                    </Link>
                  ) : activeConversation ? (
                    <div className="flex items-center gap-3 rtl:flex-row-reverse">
                      <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                        {activeConversation.otherUser.fullName.charAt(0)}
                      </div>
                      <div className="rtl:text-right">
                        <h3 className="font-black tracking-tight">
                          {activeConversation.otherUser.fullName}
                        </h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          @{activeConversation.otherUser.username}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-pulse bg-input h-6 w-32 rounded"></div>
                  )}
                </div>
                <button className="p-2 rounded-xl hover:bg-input transition-colors text-muted-foreground">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
                {activeDeal && <PinnedDeal deal={activeDeal} />}
                
                <div className="flex-1 p-4 md:p-6 space-y-6">
                  {msgsLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                      <div className="animate-pulse font-bold text-primary-500">
                        Loading Messages...
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <p className="text-sm font-bold bg-input/20 px-4 py-2 rounded-xl border border-border/50">
                        Say hello!
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-input/20 px-3 py-1 rounded-full border border-border/50">
                          Start of conversation
                        </span>
                      </div>
                      {messages.map((msg: MessageDto) => {
                        const isMe = String(msg.senderId) === String(currentUser?.id);
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? "ml-auto rtl:mr-auto rtl:ml-0" : "mr-auto rtl:ml-auto rtl:mr-0"}`}
                          >
                            <div
                              className={`px-4 mt-2 py-3 shadow-sm text-sm ${
                                isMe
                                  ? "bg-primary-500 text-white rounded-[24px] rounded-br-[8px] rtl:rounded-br-[24px] rtl:rounded-bl-[8px]"
                                  : "bg-card border border-border rounded-[24px] rounded-bl-[8px] rtl:rounded-bl-[24px] rtl:rounded-br-[8px]"
                              }`}
                            >
                              <p
                                style={{
                                  wordBreak: "break-word",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {msg.content}
                              </p>
                            </div>
                            <div
                              className={`flex items-center gap-1 mt-1.5 px-2 ${isMe ? "justify-end rtl:justify-start" : "justify-start rtl:justify-end"}`}
                            >
                              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                {dayjs(msg.createdAt).format("h:mm A")}
                              </span>
                              {isMe && msg.isRead && (
                                <CheckCheck
                                  className="w-3 h-3 text-success-500 ml-1 rtl:mr-1 rtl:ml-0"
                                  strokeWidth={3}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} className="h-1" />
                    </>
                  )}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-card/80 backdrop-blur-md border-t border-border shrink-0 z-10">
                <form onSubmit={handleSend} className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateDealModalOpen(true)}
                    className="p-3 bg-input/50 border border-border rounded-2xl hover:bg-input transition-colors group flex items-center justify-center"
                    title="Create Swap Deal"
                  >
                    <PlusCircle className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
                  </button>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-input/30 border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all rtl:text-right"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim() || sendMessage.isPending}
                    className="bg-primary-600 hover:bg-primary-500 text-white p-3 md:px-6 rounded-2xl font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Send className="w-5 h-5 rtl:rotate-180 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline-block">Send</span>
                  </button>
                </form>
              </div>

              {isCreateDealModalOpen && id && (
                <CreateDealModal
                  conversationId={Number(id)}
                  onClose={() => setIsCreateDealModalOpen(false)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
