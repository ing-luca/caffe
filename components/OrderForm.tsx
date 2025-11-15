
import React, { useState } from 'react';
import type { Order } from '../types';
import { COFFEE_OPTIONS } from '../types';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface OrderFormProps {
  addOrder: (order: Omit<Order, 'id' | 'timestamp'>) => Promise<void>;
}

export const OrderForm: React.FC<OrderFormProps> = ({ addOrder }) => {
  const [name, setName] = useState('');
  const [classroom, setClassroom] = useState('');
  const [coffeeType, setCoffeeType] = useState(COFFEE_OPTIONS[0]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !classroom.trim()) {
      setError('Nome e aula sono campi obbligatori.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await addOrder({ name: name.trim(), classroom: classroom.trim(), coffeeType });
      // Svuota il form solo in caso di successo
      setName('');
      setClassroom('');
      setCoffeeType(COFFEE_OPTIONS[0]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Impossibile inviare l\'ordine. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
            required
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
            disabled={isSubmitting}
            required
          />
        </div>
        <div>
          <label htmlFor="coffeeType" className="block text-sm font-medium text-gray-700">Tipo di Caffè</label>
          <select
            id="coffeeType"
            value={coffeeType}
            onChange={(e) => setCoffeeType(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
            disabled={isSubmitting}
          >
            {COFFEE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-600 text-sm font-medium p-2 bg-red-100 rounded-md">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 transition-colors duration-200 disabled:bg-amber-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inviando...
            </>
          ) : (
            <>
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Aggiungi Ordine
            </>
          )}
        </button>
      </form>
    </div>
  );
};
