
import React, { useState } from 'react';
import type { Order } from '../types';
import { COFFEE_OPTIONS } from '../types';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface OrderFormProps {
  addOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ addOrder }) => {
  const [name, setName] = useState('');
  const [classroom, setClassroom] = useState('');
  const [coffeeType, setCoffeeType] = useState(COFFEE_OPTIONS[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !classroom.trim()) {
      setError('Nome e aula sono campi obbligatori.');
      return;
    }
    setError('');
    addOrder({ name, classroom, coffeeType });
    setName('');
    setClassroom('');
    setCoffeeType(COFFEE_OPTIONS[0]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md sticky top-8">
      <h2 className="text-2xl font-bold mb-6 text-amber-800 border-b-2 border-amber-200 pb-2">Ordina il tuo caffè</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Docente</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            placeholder="Es. Mario Rossi"
          />
        </div>
        <div>
          <label htmlFor="classroom" className="block text-sm font-medium text-gray-700">Aula</label>
          <input
            type="text"
            id="classroom"
            value={classroom}
            onChange={(e) => setClassroom(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            placeholder="Es. 3B"
          />
        </div>
        <div>
          <label htmlFor="coffeeType" className="block text-sm font-medium text-gray-700">Tipo di Caffè</label>
          <select
            id="coffeeType"
            value={coffeeType}
            onChange={(e) => setCoffeeType(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
          >
            {COFFEE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 transition-colors duration-200"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Aggiungi Ordine
        </button>
      </form>
    </div>
  );
};
