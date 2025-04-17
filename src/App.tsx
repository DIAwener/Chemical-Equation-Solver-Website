import React, { useState } from 'react';
import { BeakerIcon, ArrowRightIcon, RefreshCwIcon } from 'lucide-react';

// База данных известных реакций
const knownReactions = new Map([
  ['H2 + O2', '2H2O'],
  ['Fe + O2', '2Fe2O3'],
  ['CH4 + O2', 'CO2 + 2H2O'],
  ['2Na + 2H2O', '2NaOH + H2'],
  ['CaCO3', 'CaO + CO2'],
  ['H2 + Cl2', '2HCl'],
  ['Fe + CuSO4', 'FeSO4 + Cu'],
  ['NaOH + HCl', 'NaCl + H2O'],
  ['Ca + 2H2O', 'Ca(OH)2 + H2'],
  ['Zn + 2HCl', 'ZnCl2 + H2']
]);

// Функция для нормализации уравнения
function normalizeEquation(equation: string): string {
  return equation
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(/[+=]|->/)
    .map(part => part.trim())
    .join(' + ');
}

// Функция для поиска продуктов реакции
function findProducts(reactants: string): string | null {
  const normalizedReactants = normalizeEquation(reactants);
  for (const [key, value] of knownReactions.entries()) {
    if (normalizeEquation(key) === normalizedReactants) {
      return value;
    }
  }
  return null;
}

// Parse a chemical formula into an object with atom counts
function parseFormula(formula: string): Record<string, number> {
  const atoms: Record<string, number> = {};
  const parts = formula.match(/([A-Z][a-z]?\d*)|(\d+)/g) || [];
  let coefficient = 1;
  
  // Check if the formula starts with a number (coefficient)
  if (/^\d+/.test(formula)) {
    coefficient = parseInt(parts[0]);
    parts.shift();
  }
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (/^[A-Z]/.test(part)) {
      const element = part.match(/[A-Z][a-z]?/)?.[0] || '';
      const number = part.match(/\d+$/)?.[0];
      const count = (number ? parseInt(number) : 1) * coefficient;
      atoms[element] = (atoms[element] || 0) + count;
    }
  }
  
  return atoms;
}

// Count atoms in a compound list
function countAtoms(compounds: string): Record<string, number> {
  const atoms: Record<string, number> = {};
  const moleculeList = compounds.split('+').map(m => m.trim());
  
  for (const molecule of moleculeList) {
    const moleculeAtoms = parseFormula(molecule);
    for (const [element, count] of Object.entries(moleculeAtoms)) {
      atoms[element] = (atoms[element] || 0) + count;
    }
  }
  
  return atoms;
}

// Check if atoms are balanced
function areAtomsBalanced(reactants: string, products: string): boolean {
  const reactantAtoms = countAtoms(reactants);
  const productAtoms = countAtoms(products);
  
  const allElements = new Set([
    ...Object.keys(reactantAtoms),
    ...Object.keys(productAtoms)
  ]);
  
  for (const element of allElements) {
    if (reactantAtoms[element] !== productAtoms[element]) {
      return false;
    }
  }
  
  return true;
}

// Balance chemical equations
function balanceEquation(equation: string): string {
  try {
    const [reactants, products] = equation.split(/->|=/).map(side => side.trim());
    const reactantsList = reactants.split('+').map(r => r.trim());
    const productsList = products.split('+').map(p => p.trim());
    
    // Проверяем, сбалансировано ли уравнение изначально
    if (areAtomsBalanced(reactants, products)) {
      return `${reactants} → ${products}`;
    }
    
    // Пытаемся найти коэффициенты для балансировки
    for (let a = 1; a <= 10; a++) {
      for (let b = 1; b <= 10; b++) {
        for (let c = 1; c <= 10; c++) {
          for (let d = 1; d <= 10; d++) {
            const balancedReactants = reactantsList.map((r, i) => 
              `${i === 0 ? a : b}${r}`).join(' + ');
            const balancedProducts = productsList.map((p, i) => 
              `${i === 0 ? c : d}${p}`).join(' + ');
            
            if (areAtomsBalanced(balancedReactants, balancedProducts)) {
              return `${balancedReactants} → ${balancedProducts}`;
            }
          }
        }
      }
    }
    
    return "Не удалось сбалансировать уравнение";
  } catch (error) {
    console.error('Error in balanceEquation:', error);
    return "Ошибка при балансировке уравнения";
  }
}

function App() {
  const [equation, setEquation] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSolve = () => {
    try {
      if (!equation.trim()) {
        setError('Пожалуйста, введите химическое уравнение');
        setResult('');
        return;
      }

      // Проверяем, содержит ли уравнение продукты реакции
      if (!equation.includes('->') && !equation.includes('=')) {
        // Если нет, пытаемся найти продукты реакции
        const products = findProducts(equation);
        if (products) {
          const fullEquation = `${equation} -> ${products}`;
          console.log('Found products, full equation:', fullEquation);
          const balancedEquation = balanceEquation(fullEquation);
          
          if (balancedEquation.includes("Не удалось") || balancedEquation.includes("Ошибка")) {
            setError(balancedEquation);
            setResult('');
          } else {
            setResult(balancedEquation);
            setError('');
          }
        } else {
          setError('Извините, я не знаю продукты этой реакции. Пожалуйста, введите полное уравнение.');
          setResult('');
        }
      } else {
        // Если уравнение полное, просто балансируем его
        const balancedEquation = balanceEquation(equation);
        
        if (balancedEquation.includes("Не удалось") || balancedEquation.includes("Ошибка")) {
          setError(balancedEquation);
          setResult('');
        } else {
          setResult(balancedEquation);
          setError('');
        }
      }
    } catch (err) {
      console.error('Error in handleSolve:', err);
      setError('Ошибка в уравнении. Проверьте правильность написания.');
      setResult('');
    }
  };

  const handleClear = () => {
    setEquation('');
    setResult('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <BeakerIcon className="h-12 w-12 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Решение химических уравнений
            </h1>
            <p className="text-lg text-gray-600">
              Введите реагенты или полное уравнение для решения и балансировки
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="mb-6">
              <label
                htmlFor="equation"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Химическое уравнение или реагенты
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  id="equation"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  placeholder="Например: H2 + O2 или H2 + O2 -> H2O"
                  className="flex-1 block w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={handleSolve}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Решить
                </button>
                <button
                  onClick={handleClear}
                  className="p-3 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  <RefreshCwIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {(result || error) && (
              <div className="mt-6 p-4 rounded-lg bg-gray-50">
                {error ? (
                  <p className="text-red-600">{error}</p>
                ) : (
                  <div className="flex items-center gap-4 justify-center">
                    <div className="text-lg font-medium text-gray-900">{result}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Как использовать
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <ArrowRightIcon className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                <span>
                  Введите только реагенты (например: H2 + O2) или полное уравнение с {'->'} или =
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRightIcon className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                <span>
                  Используйте числа для обозначения количества атомов (например, H2O)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRightIcon className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                <span>
                  Разделяйте соединения знаком +
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;