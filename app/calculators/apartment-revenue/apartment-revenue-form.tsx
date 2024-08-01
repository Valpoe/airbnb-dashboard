'use client';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function ApartmentRevenueForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
    } catch (error) {
      console.log({ error });
      setError('An error occured. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-2 md:space-y-2">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Employee</span>
        </div>
        <input
          className="input input-bordered w-full max-w-xs"
          name="employee"
          type="text"
          placeholder="Employee"
          required
          maxLength={20}
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Date</span>
        </div>
        <input
          className="input input-bordered w-full max-w-xs"
          name="date"
          type="date"
          placeholder="Date"
          required
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Hours worked</span>
        </div>
        <input
          className="input input-bordered w-full max-w-xs"
          name="hours-worked"
          type="number"
          placeholder="Hours worked"
          required
        />
      </label>
      <SubmitButton loading={loading} />
      {error && (
        <div role="alert" className="alert alert-error">
          <ExclamationCircleIcon className="w-6 h-6 mr-2" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button className="btn btn-primary" type="submit" disabled={loading}>
      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <div className="flex items-center">
          <span>SUBMIT</span>
        </div>
      )}
    </button>
  );
}
