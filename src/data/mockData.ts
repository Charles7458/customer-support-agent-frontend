import type { Conversation, Ticket } from '../types';

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Active Conversation - Order #12345',
    customerName: 'Alex Morgan',
    orderId: '12345',
    status: 'active',
    createdAt: '2025-05-11T10:40:00Z',
    updatedAt: '2025-05-11T10:43:00Z',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: "Hi, I placed an order last week (Order #12345) and it hasn't arrived yet. The tracking hasn't updated in 3 days. If it's lost, I'd like to request a refund.",
        timestamp: '10:42 AM',
        status: 'read',
      },
      {
        id: 'msg-2',
        role: 'ai',
        content: "Hello! I understand you're concerned about Order #12345. Let me look into that for you immediately.\n\nI've checked with our logistics partner. Here is the current status:",
        timestamp: '10:43 AM',
        bulletList: [
          'The package experienced a slight delay at the regional sorting facility due to severe weather.',
          'It was scanned again this morning and is now out for delivery.',
          'Expected delivery is today by 8:00 PM local time.',
        ],
        codeBlock: {
          language: 'text',
          lines: ['Tracking ID: TRK-998-NX-2023', 'Carrier: GlobalFreight Express'],
        },
        orderCard: {
          orderId: '#12345',
          status: 'Out for Delivery',
          statusColor: '#0058be',
        },
      },
    ],
  },
];

export const mockTickets: Ticket[] = [
  {
    id: 'tkt-1',
    ticketNumber: '#TCK-8921',
    subject: 'API Integration failure on checkout',
    status: 'open',
    priority: 'high',
    createdAt: '2025-05-11T10:30:00Z',
    lastUpdated: '10m ago',
    customer: {
      id: 'cust-1',
      name: 'Elena Wei',
      email: 'elena@example.com',
      avatarInitials: 'EW',
      avatarColor: '#271901',
      plan: 'Enterprise',
      pastTickets: 12,
      openTickets: 2,
    },
    messages: [
      {
        id: 'tmsg-1',
        from: 'Elena Wei',
        content:
          "Hi support team,\n\nWe are getting a 500 Internal Server Error when trying to hit the /v2/checkout endpoint. This started happening after our deployment this morning. Can someone look into this urgently? It's impacting live transactions.",
        timestamp: 'Today, 10:42 AM',
      },
    ],
    aiInsight: {
      summary:
        'System logs indicate a known issue with token caching on cluster US-East following the v2.4 rollout. Proposed resolution involves manually flushing the tenant cache.',
      suggestedActions: ['Flush cache for tenant', 'Escalate to backend'],
    },
  },
  {
    id: 'tkt-2',
    ticketNumber: '#TCK-8920',
    subject: 'Billing cycle update request',
    status: 'pending',
    priority: 'medium',
    createdAt: '2025-05-11T09:00:00Z',
    lastUpdated: '1h ago',
    customer: {
      id: 'cust-2',
      name: 'Marcus Reed',
      email: 'marcus@example.com',
      avatarInitials: 'MR',
      avatarColor: '#1a3c6b',
      plan: 'Pro',
      pastTickets: 4,
      openTickets: 1,
    },
    messages: [
      {
        id: 'tmsg-2',
        from: 'Marcus Reed',
        content: 'Hi, I need to change my billing cycle from monthly to annual. How do I do this?',
        timestamp: 'Today, 9:00 AM',
      },
    ],
  },
  {
    id: 'tkt-3',
    ticketNumber: '#TCK-8915',
    subject: 'How to export audit logs?',
    status: 'closed',
    priority: 'low',
    createdAt: '2025-05-10T14:00:00Z',
    lastUpdated: 'Yesterday',
    customer: {
      id: 'cust-3',
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      avatarInitials: 'SJ',
      avatarColor: '#131b2e',
      plan: 'Business',
      pastTickets: 7,
      openTickets: 0,
    },
    messages: [
      {
        id: 'tmsg-3',
        from: 'Sarah Jenkins',
        content: 'Can you guide me on how to export the audit logs for the last 30 days?',
        timestamp: 'Yesterday, 2:00 PM',
      },
    ],
  },
  {
    id: 'tkt-4',
    ticketNumber: '#TCK-8912',
    subject: 'SSO Login looping continuously',
    status: 'open',
    priority: 'high',
    createdAt: '2025-05-10T11:00:00Z',
    lastUpdated: 'Yesterday',
    customer: {
      id: 'cust-4',
      name: 'TechCorp IT',
      email: 'it@techcorp.com',
      avatarInitials: 'TC',
      avatarColor: '#2170e4',
      plan: 'Enterprise',
      pastTickets: 23,
      openTickets: 3,
    },
    messages: [
      {
        id: 'tmsg-4',
        from: 'TechCorp IT',
        content: 'Our SSO login keeps looping. Users cannot access the platform. This is urgent.',
        timestamp: 'Yesterday, 11:00 AM',
      },
    ],
  },
];

// Mobile version with extra ticket cards matching light mobile design
export const mobileMockTickets = [
  {
    id: 'tkt-m1',
    ticketNumber: '#TKT-8821',
    subject: 'Checkout API returning 500 errors',
    status: 'open' as const,
    priority: 'high' as const,
    customer: { name: 'Elena Wei', email: 'elena@example.com', avatarInitials: 'EW', avatarColor: '#271901' },
    lastUpdated: '10m ago',
    agentInitials: 'EW',
  },
  {
    id: 'tkt-m2',
    ticketNumber: '#TKT-8820',
    subject: 'Billing cycle update request',
    status: 'pending' as const,
    priority: 'medium' as const,
    customer: { name: 'Marcus Reed', email: 'marcus@example.com', avatarInitials: 'MR', avatarColor: '#1a3c6b' },
    lastUpdated: '2h ago',
  },
  {
    id: 'tkt-m3',
    ticketNumber: '#TKT-8819',
    subject: 'How to export audit logs?',
    status: 'closed' as const,
    priority: 'low' as const,
    customer: { name: 'Sarah Jenkins', email: 'sarah@example.com', avatarInitials: 'SJ', avatarColor: '#131b2e' },
    lastUpdated: 'Yesterday',
  },
];
