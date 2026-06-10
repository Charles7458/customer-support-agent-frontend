import type { ChatMessage, MessageRole } from "../types";
import type { Dispatch, SetStateAction } from "react";

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
  role?: MessageRole;
  content?: RawChatContent | string | null;
  sent_at?: string | Date | null;
  [key: string]: unknown;
};

type RawJson = {
  type: string;
  value: string | RawChatMessage
}

// const normalizeChatContent = (content: RawChatMessage['content']): ChatMessage['content'] => {
//   if (typeof content === 'string') {
//     return { text: content, order_card: null, tracking: null, bullet_list: null };
//   }

//   const normalizedContent = content ?? {};
//   const tracking = normalizedContent.tracking;
//   const orderCard = normalizedContent.order_card;

//   return {
//     text: normalizedContent.text ?? '',
//     tracking: tracking
//       ? {
//           trackingID: tracking.trackingID ?? tracking.tracking_id ?? '',
//           carrier: tracking.carrier ?? '',
//         }
//       : null,
//     order_card: orderCard
//       ? {
//           orderId: orderCard.orderId ?? orderCard.order_id ?? '',
//           status: orderCard.status ?? '',
//           statusColor: orderCard.statusColor ?? orderCard.status_color ?? '',
//         }
//       : null,
//     bullet_list: normalizedContent.bullet_list ?? null,
//   };
// };

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

export const connectSocket = (chatUrl:string, setIsOnline: Dispatch<SetStateAction<boolean>>, setIsTyping:Dispatch<SetStateAction<boolean>>): WebSocket => {
  socket = new WebSocket(chatUrl);

  socket.onopen = () => {
    console.log("Connected to WebSocket");
  };

  socket.onmessage = async (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      if(data.type == "status"){
        if(data.value == "online" || data.value =="offline"){
          setIsOnline(data.value == "online")
        }
        else if(data.value == "typing" || data.value == "stopped"){
          setIsTyping(data.value == "typing")
        }
      }
      
      else if(data.type == "message"){
        listeners.forEach((listener) => {
          listener(data.value);
        });
      }

    } catch (error) {
      console.error(
        "Failed to parse websocket message:",
        error
      );
    }
  };

  socket.onclose = () => {
    sendMessage("offline")
    console.log("WebSocket disconnected");
    setIsOnline(false)
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
};

export const sendMessage = (
  message: ChatMessage | string
): boolean => {
  if (
    socket &&
    socket.readyState === WebSocket.OPEN
  ) {
    const socketMessage = {
      "type": "message",
      "value": message
    }
    socket.send(JSON.stringify(socketMessage));
    return true;
  } else {
    console.warn(
      "Cannot send message. WebSocket is not connected."
    );
    return false;
  }
};

export const sendStatus = (
  status:string): boolean => {
    if (
      socket &&
      socket.readyState === WebSocket.OPEN
    ) {
      const statusObject = {
        "type": "status",
        "value": status
      }
      socket.send(JSON.stringify(statusObject));
      return true;
    } else {
      console.warn(
        "Cannot send conversation id. WebSocket is not connected."
      );
      return false;
    }
  }

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
  sendMessage("offline")
  socket?.close();
  socket = null;
};