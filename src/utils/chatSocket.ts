export interface ChatMessage {
  type: string;
  role: string;
  content: string;
  conversationId?: string;
}

let socket: WebSocket | null = null;

const listeners: Array<(message: ChatMessage) => void> = [];

export const connectSocket = (): WebSocket => {
  socket = new WebSocket("ws://localhost:8000/chat/ws");

  socket.onopen = () => {
    console.log("Connected to WebSocket");
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const data: ChatMessage = JSON.parse(event.data);

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