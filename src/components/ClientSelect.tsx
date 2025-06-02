'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

interface ClientSelectProps {
  selectedClient: string;
  onChange: (value: string) => void;
}

export default function ClientSelect({ selectedClient, onChange }: ClientSelectProps) {
  const [clients, setClients] = useState<string[]>([]);
  const [showNewInput, setShowNewInput] = useState(false);
  const [newClientName, setNewClientName] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get('/clients');
      setClients(res.data.map((c: any) => c.name));
    } catch (err) {
      toast.error('Failed to load clients');
    }
  };

  const handleAddNewClient = async () => {
    const name = newClientName.trim();
    if (!name) {
      toast.error('Client name is required');
      return;
    }

    try {
      const res = await axios.post('/clients', { name });
      setClients((prev) => [...prev, res.data.name]);
      onChange(res.data.name); // встановлюємо вибраного клієнта
      toast.success('Client added!');
      resetAddClient();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error adding client');
    }
  };

  const handleChange = (value: string) => {
    if (value === '__add_new__') {
      setShowNewInput(true);
      setNewClientName('');
      onChange('');
    } else {
      onChange(value);
    }
  };

  const resetAddClient = () => {
    setShowNewInput(false);
    setNewClientName('');
  };

  return (
    <div className="flex flex-col gap-2">
      {/* <label className="font-semibold text-gray-600">Client</label> */}

      {!showNewInput ? (
        <select
          value={selectedClient}
          onChange={(e) => handleChange(e.target.value)}
          className="border p-2 rounded text-gray-600"
        >
          <option value="">Select a client</option>
          {clients.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value="__add_new__" className='text-grey-400 text-center p-6 mb-4 bg-sky-100 font-semibold'> Add new client</option>
        </select>
      ) : (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="New client name"
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
            className="border p-2 rounded flex-grow"
          />
          <button
            onClick={handleAddNewClient}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Add
          </button>
          <button
            onClick={resetAddClient}
            className="text-sm text-gray-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}