import type { ChatMessage, MessageRole } from "../types";

type RawChatContent = {
  text?: string;
  tracking?: {
    trackingID?: string;
    tracking_id?: string;
    carrier?: string;
  } | null;
  order_card?: {
    orderId?: string;
    order_id?: string;
    status?: string;
    statusColor?: string;
    status_color?: string;
  } | null;
  bullet_list?: string[] | null;
  [key: string]: unknown;
};

type RawChatMessage = {
  id?: number | string;
  role?: string;
  content?: RawChatContent | string | null;
  sentAt?: string | Date | null;
  sent_at?: string | Date | null;
  [key: string]: unknown;
};

const normalizeChatContent = (content: RawChatMessage['content']): ChatMessage['content'] => {
  if (typeof content === 'string') {
    return { text: content, order_card: null, tracking: null, bullet_list: null };
  }

  const normalizedContent = content ?? {};
  const tracking = normalizedContent.tracking;
  const orderCard = normalizedContent.order_card;

  return {
    text: normalizedContent.text ?? '',
    tracking: tracking
      ? {
          trackingID: tracking.trackingID ?? tracking.tracking_id ?? '',
          carrier: tracking.carrier ?? '',
        }
      : null,
    order_card: orderCard
      ? {
          orderId: orderCard.orderId ?? orderCard.order_id ?? '',
          status: orderCard.status ?? '',
          statusColor: orderCard.statusColor ?? orderCard.status_color ?? '',
        }
      : null,
    bullet_list: normalizedContent.bullet_list ?? null,
  };
};

// export const normalizeChatMessage = (message: RawChatMessage): ChatMessage => ({
//   ...(typeof message === 'string' ? normalizeChatMessage(JSON.parse(message)) : {
//     id: Number(message.id ?? Date.now()),
//     role: (message.role ?? 'AI').toUpperCase() as MessageRole,
//     content: normalizeChatContent(message.content),
//     sentAt: message.sentAt ?? message.sent_at ?? null,
//   }),
// });

let socket: WebSocket | null = null;

const listeners: Array<(message: ChatMessage) => void> = [];

export const connectSocket = (): WebSocket => {
  socket = new WebSocket("ws://localhost:8000/chat/ws");

  socket.onopen = () => {
    console.log("Connected to WebSocket");
  };

  socket.onmessage = async (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      listeners.forEach((listener) => {
        listener(data);
      });
    } catch (error) {
      console.error(
        "Failed to parse websocket message:",
        error
      );
    }
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
};

export const sendMessage = (
  message: ChatMessage
): void => {
  if (
    socket &&
    socket.readyState === WebSocket.OPEN
  ) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn(
      "Cannot send message. WebSocket is not connected."
    );
  }
};

export const subscribeToMessages = (
  callback: (message: ChatMessage) => void
): (() => void) => {
  listeners.push(callback);

  return () => {
    const index = listeners.indexOf(callback);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
};

export const disconnectSocket = (): void => {
  socket?.close();
  socket = null;
};