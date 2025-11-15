
import React, { useState, useEffect, useCallback } from 'react';
import type { Order } from './types';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';
import { CoffeeIcon } from './components/icons/CoffeeIcon';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const getTodayStorageKey = useCallback(() => {
    const today = new Date();
    return `orders_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }, []);

  useEffect(() => {
    // Clean up old storage keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('orders_') && key !== getTodayStorageKey()) {
        localStorage.removeItem(key);
      }
    });

    // Load today's orders
    try {
        const storedOrders = localStorage.getItem(getTodayStorageKey());
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        }
    } catch (error) {
        console.error("Failed to parse orders from localStorage", error);
        setOrders([]);
    }
  }, [getTodayStorageKey]);

  useEffect(() => {
    try {
        localStorage.setItem(getTodayStorageKey(), JSON.stringify(orders));
    } catch (error) {
        console.error("Failed to save orders to localStorage", error);
    }
  }, [orders, getTodayStorageKey]);

  const addOrder = (order: Omit<Order, 'id' | 'timestamp'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
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
            <OrderList orders={orders} />
          </div>
        </div>
      </main>

       <footer className="text-center py-4 mt-8 text-amber-800/60 text-sm">
        <p>Tutti gli ordini vengono resettati automaticamente a mezzanotte.</p>
      </footer>
    </div>
  );
};

export default App;
