import { useState } from 'react';
import { createItem } from '../api/items';
import CodePreview from '../components/CodePreview';

const initialForm = {
  name: '',
  description: '',
  price: ''
};

function AdminPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdItem, setCreatedItem] = useState(null);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price)
      };

      const item = await createItem(payload);
      setCreatedItem(item);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

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

          <button
            disabled={loading}
            type="submit"
            className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Create Item'}
          </button>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        </form>
      </section>

      {createdItem ? (
        <section className="space-y-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Created Item</h2>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-semibold">Code:</span> {createdItem.code}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Name:</span> {createdItem.name}
            </p>
          </div>

          <CodePreview code={createdItem.code} />
        </section>
      ) : null}
    </div>
  );
}

export default AdminPage;
