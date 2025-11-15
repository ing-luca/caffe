
import React from 'react';
import type { Order } from '../types';
import { CoffeeCupIcon } from './icons/CoffeeCupIcon';

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, isLoading, error }) => {
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10 text-gray-500">
          <p>Caricamento ordini in corso...</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-lg">
          <p className="font-semibold">Oops! Qualcosa è andato storto.</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          <p>Nessun ordine per oggi.</p>
          <p className="text-sm mt-1">Sii il primo ad ordinare!</p>
        </div>
      );
    }
    
    // Ordiniamo gli ordini dal più recente al più vecchio
    const sortedOrders = [...orders].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
      <ul className="space-y-4">
        {sortedOrders.map((order, index) => (
          <li
            key={order.id}
            className="bg-amber-50 p-4 rounded-lg flex items-start space-x-4 shadow-sm border border-amber-200"
          >
            <div className="flex-shrink-0 bg-amber-700 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">
              {sortedOrders.length - index}
            </div>
            <div className="flex-grow">
              <p className="font-bold text-lg text-amber-900">{order.name}</p>
              <p className="text-sm text-gray-600">Aula: <span className="font-medium">{order.classroom}</span></p>
            </div>
             <div className="flex items-center text-amber-800 bg-amber-200 px-3 py-1 rounded-full text-sm font-medium">
              <CoffeeCupIcon className="w-4 h-4 mr-2"/>
              <span>{order.coffeeType}</span>
             </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-amber-800 border-b-2 border-amber-200 pb-2">
        Ordini di Oggi {!isLoading && !error ? `(${orders.length})` : ''}
      </h2>
      {renderContent()}
    </div>
  );
};
