import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createItem } from '../api/items';
import CodePreview from '../components/CodePreview';
import { useItemStore } from '../store/itemStore';

const initialForm = {
  name: '',
  description: '',
  price: ''
};

function AdminPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const createdItems = useItemStore((state) => state.createdItems);
  const addCreatedItem = useItemStore((state) => state.addCreatedItem);
  const clearCreatedItems = useItemStore((state) => state.clearCreatedItems);

  const createItemMutation = useMutation({
    mutationFn: createItem,
    onSuccess: (item) => {
      addCreatedItem(item);
      setForm(initialForm);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to create item');
    }
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError('');

    createItemMutation.mutate({
      ...form,
      price: Number(form.price)
    });
  };

  const latestItem = createdItems[0] || null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Admin Item Creator</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create a product and generate both QR code and barcode from a UUID code.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Name
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Price
            <input
              name="price"
              value={form.price}
              onChange={onChange}
              type="number"
              min="0"
              step="0.01"
              required
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <div className="flex items-center gap-2">
            <button
              disabled={createItemMutation.isPending}
              type="submit"
              className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {createItemMutation.isPending ? 'Saving...' : 'Create Item'}
            </button>

            <button
              type="button"
              onClick={clearCreatedItems}
              disabled={createdItems.length === 0}
              className="inline-flex w-fit items-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            >
              Clear Saved Items
            </button>
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        </form>
      </section>

      {latestItem ? (
        <section className="space-y-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Latest Created Item</h2>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-semibold">Code:</span> {latestItem.code}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Name:</span> {latestItem.name}
            </p>
          </div>

          <CodePreview code={latestItem.code} />

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Persisted Items</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {createdItems.map((item) => (
                <li key={item.code} className="rounded-md bg-slate-50 px-3 py-2">
                  <span className="font-semibold">{item.name}</span>
                  <span className="ml-2 font-mono text-xs text-slate-500">{item.code}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default AdminPage;
