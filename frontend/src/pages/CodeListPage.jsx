import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getItems } from '../api/items';

function CodeListPage() {
  const {
    data: items,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['items'],
    queryFn: getItems
  });

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Code List Page</h1>
          <p className="mt-1 text-sm text-slate-600">All saved items are listed here.</p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
        >
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {isLoading ? <p className="mt-6 text-sm text-slate-600">Loading codes...</p> : null}

      {isError ? (
        <p className="mt-6 text-sm font-semibold text-red-600">
          {error.response?.data?.message || 'Failed to load items'}
        </p>
      ) : null}

      {!isLoading && !isError && items?.length === 0 ? (
        <p className="mt-6 text-sm text-slate-600">No items found. Create one from Admin Create page.</p>
      ) : null}

      {!isLoading && !isError && items?.length > 0 ? (
        <ul className="mt-6 grid gap-3">
          {items.map((item) => (
            <li
              key={item.code}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="break-all font-mono text-xs text-slate-500">{item.code}</p>
                </div>
                <Link
                  to={`/items/${encodeURIComponent(item.code)}`}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  View Detail
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default CodeListPage;
