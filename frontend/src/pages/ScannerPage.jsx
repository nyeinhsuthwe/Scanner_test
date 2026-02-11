import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getItemByCode } from '../api/items';

function ScannerPage() {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [scanInput, setScanInput] = useState('');
  const [error, setError] = useState('');

  const lookupMutation = useMutation({
    mutationFn: (code) =>
      queryClient.fetchQuery({
        queryKey: ['item', code],
        queryFn: () => getItemByCode(code)
      }),
    onSuccess: (item) => {
      setScanInput('');
      navigate(`/items/${encodeURIComponent(item.code)}`, { state: { item } });
    },
    onError: (err) => {
      if (err.response?.status === 404) {
        setError('Item not found for scanned code');
      } else {
        setError(err.response?.data?.message || 'Scan failed. Please try again.');
      }
      inputRef.current?.focus();
    }
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submitScan = (code) => {
    if (!code || lookupMutation.isPending) {
      return;
    }

    setError('');
    lookupMutation.mutate(code);
  };

  const handleScanSubmit = (event) => {
    event.preventDefault();
    const code = scanInput.trim();
    submitScan(code);
  };

  const handleInputChange = (event) => {
    const normalizedValue = event.target.value.replace(/[\r\n]/g, '');
    setScanInput(normalizedValue);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitScan(scanInput.trim());
    }
  };

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Scanner Page</h1>
      <p className="mt-1 text-sm text-slate-600">
        Scan a QR or barcode with a keyboard-wedge scanner. The code fills this field and submits on
        Enter.
      </p>

      <form onSubmit={handleScanSubmit} className="mt-6 space-y-4">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Scan Input
          <input
            ref={inputRef}
            autoFocus
            value={scanInput}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={() => inputRef.current?.focus()}
            placeholder="Scan code here"
            className="rounded-lg border border-slate-300 px-3 py-3 text-base outline-none focus:border-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={lookupMutation.isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {lookupMutation.isPending ? 'Looking up...' : 'Submit Scan'}
        </button>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      </form>
    </section>
  );
}

export default ScannerPage;
