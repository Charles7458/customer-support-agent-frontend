import { useState, useEffect } from "react";

export default function Pagination(
    {
        total,
        per_page,
        onPageChange,
    }:{
        total:number,
        per_page:number,
        onPageChange:(page:number)=>void
    }

) {
  const totalPages = Math.max(1, Math.ceil(total / per_page));

  const [page, setPage] = useState(1);

  const changePage = (newPage:number) => {
    const validPage = Math.min(Math.max(1, newPage), totalPages);

    setPage(validPage);
    onPageChange?.(validPage);
  };

  useEffect(() => {
    if (page > totalPages) {
      changePage(totalPages);
    }
  }, [totalPages]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changePage(1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-md border bg-white text-sm font-medium shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ⏮
      </button>

      <button
        onClick={() => changePage(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-md border bg-white text-sm font-medium shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ◀
      </button>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={page}
          onChange={(e) =>
            changePage(Number(e.target.value) || 1)
          }
          className="h-9 w-16 rounded-md border text-center text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <span className="text-sm text-gray-600">
          / {totalPages}
        </span>
      </div>

      <button
        onClick={() => changePage(page + 1)}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-md border bg-white text-sm font-medium shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ▶
      </button>

      <button
        onClick={() => changePage(totalPages)}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-md border bg-white text-sm font-medium shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ⏭
      </button>
    </div>
  );
}