import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createItem } from '../api/items';
import CodePreview from '../components/CodePreview';

const initialForm = {
  name: '',
  description: '',
  price: ''
};

function AdminPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const createItemMutation = useMutation({
    mutationFn: createItem,
    onSuccess: (item) => {
      queryClient.setQueryData(['items'], (previousItems = []) => [
        item,
        ...previousItems.filter((existingItem) => existingItem.code !== item.code)
      ]);
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.setQueryData(['item', item.code], item);
      setForm(initialForm);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to create item');
    }
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError('');

    createItemMutation.mutate({
      ...form,
      price: Number(form.price)
    });
  };

  const createdItem = createItemMutation.data;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Admin Create Page</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create an item and generate both QR code and barcode from its unique backend-generated
          code.
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

          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={createItemMutation.isPending}
              type="submit"
              className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {createItemMutation.isPending ? 'Saving...' : 'Create Item'}
            </button>

            <Link
              to="/codes"
              className="inline-flex w-fit items-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Open Code List
            </Link>
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        </form>
      </section>

      {createdItem ? (
        <section className="space-y-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Latest Created Item</h2>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-semibold">Code:</span> {createdItem.code}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Name:</span> {createdItem.name}
            </p>
            <Link
              to={`/scan?code=${encodeURIComponent(createdItem.code)}`}
              state={{ prefillCode: createdItem.code }}
              className="mt-3 inline-flex rounded-md bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-900"
            >
              Open Scanner with Auto-Filled Code
            </Link>
          </div>

          <CodePreview code={createdItem.code} />
        </section>
      ) : null}
    </div>
  );
}

export default AdminPage;
