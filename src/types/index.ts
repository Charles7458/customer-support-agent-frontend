// ─── Theme ────────────────────────────────────────────────────────────────────
export type Theme = 'light' | 'dark';

// ─── Chat / Conversation Types ─────────────────────────────────────────────────
export type MessageRole = 'user' | 'ai';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface TrackingStep {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  timestamp?: string;
}

export interface OrderCard {
  orderId: string;
  status: string;
  statusColor: string;
}

export interface TrackingWidget {
  type: 'tracking';
  orderId: string;
  trackingId: string;
  carrier: string;
  progress: number; // 0-100
  expectedDelivery: string;
  currentLocation: string;
  confidenceScore: string;
  steps: TrackingStep[];
}

export interface AIInsightWidget {
  type: 'insight';
  title: string;
  body: string;
  actions: string[];
}

export type MessageWidget = TrackingWidget | AIInsightWidget;

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string | null;
  status?: MessageStatus | null;
  orderCard?: OrderCard | null;
  widget?: MessageWidget | null;
  codeBlock?: { language: string; lines: string[] } | null;
  bulletList?: string[] | null;
  suggestedActions?: string[] | null;
}

export interface Conversation {
  id: string;
  title: string;
  customerName: string;
  orderId?: string;
  status: 'active' | 'resolved' | 'pending';
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// export interface Conversation {
//   conv_id: string;
//   status: 'active' | 'resolved' | 'pending';
//   created_at: string;
//   updated_at: string;
// }

// ─── Ticket Types ──────────────────────────────────────────────────────────────
export type TicketStatus = 'open' | 'pending' | 'closed' | 'resolved';
export type TicketPriority = 'high' | 'medium' | 'low';

export interface TicketCustomer {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
  plan: string;
  pastTickets: number;
  openTickets: number;
}

export interface TicketMessage {
  id: string;
  from: string;
  content: string;
  timestamp: string;
}

export interface AIInsight {
  summary: string;
  suggestedActions: string[];
  relatedKbArticle?: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  customer: TicketCustomer;
  lastUpdated: string;
  messages: TicketMessage[];
  aiInsight?: AIInsight;
  createdAt: string;
}

// ─── Mobile Ticket Card ────────────────────────────────────────────────────────
export interface MobileTicketCard {
  id: string;
  ticketNumber: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  customer: Pick<TicketCustomer, 'name' | 'email' | 'avatarInitials' | 'avatarColor'>;
  lastUpdated: string;
  agentInitials?: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export type NavTab = 'conversations' | 'tickets';

// ─── API Response Formats ─────────────────────────────────────────────────────

/**
 * GET /api/conversations
 * Response JSON shape for the Conversations list
 */
export interface ConversationsListResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * GET /api/conversations/:id
 * Response JSON shape for a single conversation
 */
export interface ConversationDetailResponse {
  conversation: Conversation;
}

/**
 * POST /api/conversations/:id/messages
 * Request body
 */
export interface SendMessageRequest {
  content: string;
  attachments?: string[];
}

/**
 * POST /api/conversations/:id/messages
 * Response
 */
export interface SendMessageResponse {
  userMessage: ChatMessage;
  aiMessage?: ChatMessage; // AI reply if synchronous
  streamUrl?: string;       // Streaming endpoint if async
}

/**
 * GET /api/tickets
 * Response JSON shape for the Tickets list
 */
export interface TicketsListResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  pageSize: number;
  stats: {
    open: number;
    pending: number;
    closed: number;
    resolved: number;
    dueToday: number;
  };
}

/**
 * GET /api/tickets/:id
 * Response JSON shape for a single ticket
 */
export interface TicketDetailResponse {
  ticket: Ticket;
}

/**
 * POST /api/tickets
 * Create new ticket request
 */
export interface CreateTicketRequest {
  subject: string;
  priority: TicketPriority;
  customerId: string;
  initialMessage: string;
}

/**
 * POST /api/tickets/:id/ai-response
 * Trigger AI response generation
 */
export interface GenerateAIResponseResponse {
  suggestedReply: string;
  confidence: number;
  insight: AIInsight;
}
