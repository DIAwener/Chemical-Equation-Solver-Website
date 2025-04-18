interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  oxidationStates: number[];
  solubility: {
    water: 'soluble' | 'insoluble' | 'slightly' | 'reacts';
    acids: 'soluble' | 'insoluble' | 'slightly' | 'reacts';
  };
  electronegativity: number;
}

export const periodicTable: Record<string, Element> = {
  'H': {
    symbol: 'H',
    name: 'Водород',
    atomicNumber: 1,
    oxidationStates: [-1, 1],
    solubility: {
      water: 'slightly',
      acids: 'slightly'
    },
    electronegativity: 2.2
  },
  'He': {
    symbol: 'He',
    name: 'Гелий',
    atomicNumber: 2,
    oxidationStates: [0],
    solubility: {
      water: 'slightly',
      acids: 'slightly'
    },
    electronegativity: 0
  },
  'Li': {
    symbol: 'Li',
    name: 'Литий',
    atomicNumber: 3,
    oxidationStates: [1],
    solubility: {
      water: 'reacts',
      acids: 'soluble'
    },
    electronegativity: 0.98
  },
  'Be': {
    symbol: 'Be',
    name: 'Бериллий',
    atomicNumber: 4,
    oxidationStates: [2],
    solubility: {
      water: 'insoluble',
      acids: 'soluble'
    },
    electronegativity: 1.57
  },
  'B': {
    symbol: 'B',
    name: 'Бор',
    atomicNumber: 5,
    oxidationStates: [3],
    solubility: {
      water: 'slightly',
      acids: 'slightly'
    },
    electronegativity: 2.04
  },
  'C': {
    symbol: 'C',
    name: 'Углерод',
    atomicNumber: 6,
    oxidationStates: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
    solubility: {
      water: 'insoluble',
      acids: 'insoluble'
    },
    electronegativity: 2.55
  },
  'N': {
    symbol: 'N',
    name: 'Азот',
    atomicNumber: 7,
    oxidationStates: [-3, -2, -1, 1, 2, 3, 4, 5],
    solubility: {
      water: 'slightly',
      acids: 'slightly'
    },
    electronegativity: 3.04
  },
  'O': {
    symbol: 'O',
    name: 'Кислород',
    atomicNumber: 8,
    oxidationStates: [-2, -1, 1, 2],
    solubility: {
      water: 'slightly',
      acids: 'slightly'
    },
    electronegativity: 3.44
  },
  'F': {
    symbol: 'F',
    name: 'Фтор',
    atomicNumber: 9,
    oxidationStates: [-1],
    solubility: {
      water: 'slightly',
      acids: 'slightly'
    },
    electronegativity: 3.98
  },
  'Ne': {
    symbol: 'Ne',
    name: 'Неон',
    atomicNumber: 10,
    oxidationStates: [0],
    solubility: {
      water: 'slightly',
      acids: 'slightly'
    },
    electronegativity: 0
  },
  'Na': {
    symbol: 'Na',
    name: 'Натрий',
    atomicNumber: 11,
    oxidationStates: [1],
    solubility: {
      water: 'reacts',
      acids: 'soluble'
    },
    electronegativity: 0.93
  },
  'Mg': {
    symbol: 'Mg',
    name: 'Магний',
    atomicNumber: 12,
    oxidationStates: [2],
    solubility: {
      water: 'reacts',
      acids: 'soluble'
    },
    electronegativity: 1.31
  },
  'Al': {
    symbol: 'Al',
    name: 'Алюминий',
    atomicNumber: 13,
    oxidationStates: [3],
    solubility: {
      water: 'insoluble',
      acids: 'soluble'
    },
    electronegativity: 1.61
  },
  'Si': {
    symbol: 'Si',
    name: 'Кремний',
    atomicNumber: 14,
    oxidationStates: [-4, 4],
    solubility: {
      water: 'insoluble',
      acids: 'slightly'
    },
    electronegativity: 1.9
  },
  'P': {
    symbol: 'P',
    name: 'Фосфор',
    atomicNumber: 15,
    oxidationStates: [-3, 3, 4, 5],
    solubility: {
      water: 'insoluble',
      acids: 'slightly'
    },
    electronegativity: 2.19
  },
  'S': {
    symbol: 'S',
    name: 'Сера',
    atomicNumber: 16,
    oxidationStates: [-2, 2, 4, 6],
    solubility: {
      water: 'insoluble',
      acids: 'slightly'
    },
    electronegativity: 2.58
  },
  'Cl': {
    symbol: 'Cl',
    name: 'Хлор',
    atomicNumber: 17,
    oxidationStates: [-1, 1, 3, 5, 7],
    solubility: {
      water: 'slightly',
      acids: 'slightly'
    },
    electronegativity: 3.16
  },
  'Ar': {
    symbol: 'Ar',
    name: 'Аргон',
    atomicNumber: 18,
    oxidationStates: [0],
    solubility: {
      water: 'slightly',
      acids: 'slightly'
    },
    electronegativity: 0
  },
  'K': {
    symbol: 'K',
    name: 'Калий',
    atomicNumber: 19,
    oxidationStates: [1],
    solubility: {
      water: 'reacts',
      acids: 'soluble'
    },
    electronegativity: 0.82
  },
  'Ca': {
    symbol: 'Ca',
    name: 'Кальций',
    atomicNumber: 20,
    oxidationStates: [2],
    solubility: {
      water: 'reacts',
      acids: 'soluble'
    },
    electronegativity: 1.0
  },
  'Fe': {
    symbol: 'Fe',
    name: 'Железо',
    atomicNumber: 26,
    oxidationStates: [2, 3],
    solubility: {
      water: 'insoluble',
      acids: 'soluble'
    },
    electronegativity: 1.83
  },
  'Cu': {
    symbol: 'Cu',
    name: 'Медь',
    atomicNumber: 29,
    oxidationStates: [1, 2],
    solubility: {
      water: 'insoluble',
      acids: 'soluble'
    },
    electronegativity: 1.9
  },
  'Zn': {
    symbol: 'Zn',
    name: 'Цинк',
    atomicNumber: 30,
    oxidationStates: [2],
    solubility: {
      water: 'insoluble',
      acids: 'soluble'
    },
    electronegativity: 1.65
  },
  'Ag': {
    symbol: 'Ag',
    name: 'Серебро',
    atomicNumber: 47,
    oxidationStates: [1],
    solubility: {
      water: 'insoluble',
      acids: 'soluble'
    },
    electronegativity: 1.93
  },
  'Ba': {
    symbol: 'Ba',
    name: 'Барий',
    atomicNumber: 56,
    oxidationStates: [2],
    solubility: {
      water: 'reacts',
      acids: 'soluble'
    },
    electronegativity: 0.89
  },
  'Pb': {
    symbol: 'Pb',
    name: 'Свинец',
    atomicNumber: 82,
    oxidationStates: [2, 4],
    solubility: {
      water: 'insoluble',
      acids: 'slightly'
    },
    electronegativity: 2.33
  }
};

// Функция для получения степеней окисления элемента
export function getOxidationStates(element: string): number[] {
  return periodicTable[element]?.oxidationStates || [];
}

// Функция для проверки растворимости элемента или соединения
export function getSolubility(element: string): string {
  const elementData = periodicTable[element];
  if (!elementData) return 'unknown';
  return `В воде: ${elementData.solubility.water}, В кислотах: ${elementData.solubility.acids}`;
}

// Функция для получения электроотрицательности элемента
export function getElectronegativity(element: string): number {
  return periodicTable[element]?.electronegativity || 0;
}

// Функция для определения типа химической связи
export function getBondType(element1: string, element2: string): string {
  const diff = Math.abs(
    getElectronegativity(element1) - getElectronegativity(element2)
  );
  
  if (diff < 0.4) return 'Ковалентная неполярная';
  if (diff < 1.7) return 'Ковалентная полярная';
  return 'Ионная';
}