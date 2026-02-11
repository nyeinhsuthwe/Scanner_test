import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getItemByCode } from '../api/items';

function ScannerPage() {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [scanInput, setScanInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScanSubmit = async (event) => {
    event.preventDefault();
    const code = scanInput.trim();

    if (!code) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const item = await queryClient.fetchQuery({
        queryKey: ['item', code],
        queryFn: () => getItemByCode(code)
      });
      setScanInput('');
      navigate(`/items/${encodeURIComponent(item.code)}`, { state: { item } });
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Item Not Found');
      } else {
        setError(err.response?.data?.message || 'Scan failed. Try again.');
      }
      setScanInput('');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Scanner Page</h1>
      <p className="mt-1 text-sm text-slate-600">
        Keep the field focused and scan with a keyboard-wedge barcode/QR scanner.
      </p>

      <form onSubmit={handleScanSubmit} className="mt-6 space-y-4">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Scan Input
          <input
            ref={inputRef}
            autoFocus
            value={scanInput}
            onChange={(event) => setScanInput(event.target.value)}
            onBlur={() => inputRef.current?.focus()}
            placeholder="Scan code here"
            className="rounded-lg border border-slate-300 px-3 py-3 text-base outline-none focus:border-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Looking up...' : 'Submit Scan'}
        </button>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      </form>
    </section>
  );
}

export default ScannerPage;
