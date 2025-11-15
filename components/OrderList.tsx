
import React from 'react';
import type { Order } from '../types';
import { CoffeeCupIcon } from './icons/CoffeeCupIcon';

interface OrderListProps {
  orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-amber-800 border-b-2 border-amber-200 pb-2">
        Ordini di Oggi ({orders.length})
      </h2>
      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>Nessun ordine per oggi.</p>
          <p className="text-sm mt-1">Sii il primo ad ordinare!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order, index) => (
            <li
              key={order.id}
              className="bg-amber-50 p-4 rounded-lg flex items-start space-x-4 shadow-sm border border-amber-200"
            >
              <div className="flex-shrink-0 bg-amber-700 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">
                {index + 1}
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
      )}
    </div>
  );
};
