
import React, { useState, useEffect, useCallback } from 'react';
import type { Order } from './types';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';
import { CoffeeIcon } from './components/icons/CoffeeIcon';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Impossibile caricare gli ordini.');
      }
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : 'Si è verificato un errore sconosciuto.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const addOrder = async (order: Omit<Order, 'id' | 'timestamp'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    
    // Non facciamo più un aggiornamento ottimistico,
    // ci affidiamo a fetchOrders per avere dati consistenti.
    
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder),
    });

    if (!response.ok) {
      throw new Error('Impossibile aggiungere l\'ordine.');
    }

    // Dopo aver aggiunto un ordine con successo, ricarichiamo la lista completa
    // per essere sicuri di avere i dati più aggiornati, inclusi ordini di altri.
    await fetchOrders();
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      <header className="bg-amber-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex items-center justify-center space-x-4">
           <CoffeeIcon className="h-10 w-10 text-amber-300" />
          <h1 className="text-4xl font-bold tracking-wider">caffé special</h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <OrderForm addOrder={addOrder} />
          </div>
          <div className="lg:col-span-2">
            <OrderList orders={orders} isLoading={loading} error={error} />
          </div>
        </div>
      </main>

       <footer className="text-center py-4 mt-8 text-amber-800/60 text-sm">
        <p>Gli ordini sono condivisi e vengono resettati automaticamente a mezzanotte.</p>
      </footer>
    </div>
  );
};

export default App;
