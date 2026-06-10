// ─── Theme ────────────────────────────────────────────────────────────────────
export type Theme = 'light' | 'dark';

// ─── Chat / Conversation Types ─────────────────────────────────────────────────
export type MessageRole = 'CUSTOMER' | 'AI' | 'SUPPORT_AGENT';
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
  id: number | null;
  role: MessageRole;
  content: {
    text : string;
    order_card?: OrderCard | null;
    tracking?: { trackingID: string; carrier: string } | null;
    bullet_list?: string[] | null;
  }
  sent_at: Date | string ;
}

export interface Conversation {
  id: string;
  title: string;
  customer_name: string;
  agent_name: string | null;
  created_at: string;
  updated_at: string;
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


export interface TicketMessage {
  content: ChatMessage["content"];
  sent_at: Date | string;
}

export interface AIInsight {
  summary: string;
  suggestedActions: string[];
  relatedKbArticle?: string;
}

export interface Ticket {
  id: number;
  ticket_ref: string;
  conversation_id: string;
  issue: string;
  status: TicketStatus;
  priority: TicketPriority;
  customer_name: string;
  agent_name: string;
  updated_at: string;
  created_at: string;
  last_message: TicketMessage | null
}

// ─── Mobile Ticket Card ────────────────────────────────────────────────────────
// export interface MobileTicketCard {
//   id: string;
//   ticketNumber: string;
//   subject: string;
//   status: TicketStatus;
//   priority: TicketPriority;
//   customer_name: string;
//   agent_name: string;
//   updated_at: string;
// }

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
