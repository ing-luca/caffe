
export interface Order {
  id: number;
  name: string;
  classroom: string;
  coffeeType: string;
  timestamp: string;
}

export const COFFEE_OPTIONS = [
  'Espresso',
  'Macchiato',
  'Cappuccino',
  'Americano',
  'Caffè d\'Orzo',
  'Decaffeinato'
];
