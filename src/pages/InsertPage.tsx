import { useState } from "react";
import { useAuth } from "../hooks/useAuth";


interface Faq {
  question: string;
  answer: string;
  keywords: string;
}



const BACKEND_URL = import.meta.env.VITE_API_URL

export default function InsertPage() {

  const { user, logout, isLoading: authLoading } = useAuth();
  
  const [faq, setFaq] = useState<Faq>({
    question: "",
    answer: "",
    keywords: "",
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

  if(user?.role.toUpperCase() == 'CUSTOMER'){
    return(
      <h4>
        Customers cannot access this page
      </h4>
    )
  }

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

    </div>
  );
}
