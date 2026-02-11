import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getItemByCode } from '../api/items';
import CodePreview from '../components/CodePreview';

function DetailPage() {
  const { code } = useParams();
  const location = useLocation();
  const [item, setItem] = useState(location.state?.item || null);
  const [loading, setLoading] = useState(!location.state?.item);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItem = async () => {
      if (item || !code) {
        return;
      }

      setLoading(true);
      setError('');
      try {
        const fetched = await getItemByCode(decodeURIComponent(code));
        setItem(fetched);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Item Not Found' : 'Unable to load item');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [code, item]);

  if (loading) {
    return <p className="text-sm text-slate-700">Loading item...</p>;
  }

  if (error) {
    return <p className="text-sm font-semibold text-red-600">{error}</p>;
  }

  if (!item) {
    return <p className="text-sm font-semibold text-red-600">Item Not Found</p>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Item Detail</h1>

        <dl className="mt-4 grid gap-3 text-sm">
          <div>
            <dt className="font-semibold text-slate-500">Name</dt>
            <dd className="text-slate-800">{item.name}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Description</dt>
            <dd className="text-slate-800">{item.description}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Price</dt>
            <dd className="text-slate-800">${Number(item.price).toFixed(2)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Code</dt>
            <dd className="break-all font-mono text-slate-800">{item.code}</dd>
          </div>
        </dl>
      </section>

      <CodePreview code={item.code} />
    </div>
  );
}

export default DetailPage;
