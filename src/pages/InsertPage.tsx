import { useState } from "react";

type OrderStatus =
  | "Ordered"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Delivery Failed";

interface Faq {
  question: string;
  answer: string;
  keywords: string;
}

interface Order {
  customer_email: string;
  product_name: string;
  amount: number;
  status: OrderStatus;
}

interface Tracking {
  order_id: string;
  updates: string;
  carrier: string;
  status: OrderStatus;
}

const BACKEND_URL = import.meta.env.VITE_API_URL

export default function InsertPage() {
  const [faq, setFaq] = useState<Faq>({
    question: "",
    answer: "",
    keywords: "",
  });

  const [order, setOrder] = useState<Order>({
    customer_email: "",
    product_name: "",
    amount: 0,
    status: "Ordered",
  });

  const [tracking, setTracking] = useState<Tracking>({
    order_id: "",
    updates: "",
    carrier: "",
    status: "Ordered",
  });

  async function createFaq(data: Faq) {
    const qn = data.question.trim()
    const ans = data.answer.trim()
    const keys = data.keywords.trim()
    if(!qn || !ans || !keys){
        alert("Enter all fields")
        return
    }
    // await api.post("/faqs", data)
    console.log("Creating FAQ", data);

    const res = await fetch(BACKEND_URL+"/faq/insert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if(res.ok){
        alert("Faq added")
    }
    else{
        alert("Insertion Failed")
    }

  }

  async function createOrder(data: Order) {

    // await api.post("/orders", data)
    const email = data.customer_email.trim()
    const prod = data.product_name.trim()
    const amount = data.amount
    if(!email || !prod || amount<=0){
        alert("Enter all fields")
        return
    }

    console.log("Creating Order", data);

    const res = await fetch(BACKEND_URL+"/orders/insert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if(res.ok){
        alert("Order added")
    }
    else{
        alert("Insertion Failed")
    }

  }

  async function createTracking(data: Tracking) {

    const id = data.order_id.trim()
    const updates = data.updates.trim()
    const carrier = data.carrier.trim()
    if(!id || !updates || !carrier){
        alert("Enter all fields")
        return
    }
    console.log("Creating Tracking Update", data);
    // await api.post("/tracking", data)

    const res = await fetch(BACKEND_URL+"/orders/tracking/insert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if(res.ok){
        alert("Faq added")
    }
    else{
        alert("Insertion Failed")
    }

  }

  const statuses: OrderStatus[] = [
    "Ordered",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Delivery Failed",
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-3xl font-bold">
        Admin Management
      </h1>

      {/* FAQS */}

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Add FAQ
        </h2>

        <div className="space-y-3">
          <input
            className="w-full rounded border p-2"
            placeholder="Question"
            value={faq.question}
            onChange={(e) =>
              setFaq({
                ...faq,
                question: e.target.value,
              })
            }
          />

          <textarea
            className="w-full rounded border p-2"
            rows={4}
            placeholder="Answer"
            value={faq.answer}
            onChange={(e) =>
              setFaq({
                ...faq,
                answer: e.target.value,
              })
            }
          />

          <input
            className="w-full rounded border p-2"
            placeholder="Keywords (comma separated)"
            value={faq.keywords}
            onChange={(e) =>
              setFaq({
                ...faq,
                keywords: e.target.value,
              })
            }
          />

          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            onClick={() => createFaq(faq)}
          >
            Save FAQ
          </button>
        </div>
      </div>

      {/* ORDERS */}

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Add Order
        </h2>

        <div className="space-y-3">
          <input
            className="w-full rounded border p-2"
            placeholder="Customer Email"
            value={order.customer_email}
            onChange={(e) =>
              setOrder({
                ...order,
                customer_email: e.target.value,
              })
            }
          />

          <input
            className="w-full rounded border p-2"
            placeholder="Product Name"
            value={order.product_name}
            onChange={(e) =>
              setOrder({
                ...order,
                product_name: e.target.value,
              })
            }
          />

          <input
            type="number"
            className="w-full rounded border p-2"
            placeholder="Amount"
            value={order.amount}
            onChange={(e) =>
              setOrder({
                ...order,
                amount: Number(e.target.value),
              })
            }
          />

          <select
            className="w-full rounded border p-2"
            value={order.status}
            onChange={(e) =>
              setOrder({
                ...order,
                status: e.target.value as OrderStatus,
              })
            }
          >
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>

          <button
            className="rounded bg-green-600 px-4 py-2 text-white"
            onClick={() => createOrder(order)}
          >
            Save Order
          </button>
        </div>
      </div>

      {/* TRACKING */}

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Add Tracking Update
        </h2>

        <div className="space-y-3">
          <input
            className="w-full rounded border p-2"
            placeholder="Order ID"
            value={tracking.order_id}
            onChange={(e) =>
              setTracking({
                ...tracking,
                order_id: e.target.value,
              })
            }
          />

          <input
            className="w-full rounded border p-2"
            placeholder="Carrier"
            value={tracking.carrier}
            onChange={(e) =>
              setTracking({
                ...tracking,
                carrier: e.target.value,
              })
            }
          />

          <textarea
            className="w-full rounded border p-2"
            rows={4}
            placeholder="Tracking Updates"
            value={tracking.updates}
            onChange={(e) =>
              setTracking({
                ...tracking,
                updates: e.target.value,
              })
            }
          />

          <select
            className="w-full rounded border p-2"
            value={tracking.status}
            onChange={(e) =>
              setTracking({
                ...tracking,
                status: e.target.value as OrderStatus,
              })
            }
          >
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>

          <button
            className="rounded bg-purple-600 px-4 py-2 text-white"
            onClick={() => createTracking(tracking)}
          >
            Save Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
