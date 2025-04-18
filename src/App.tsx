import React, { useState } from 'react';
import { BeakerIcon, ArrowRightIcon, RefreshCwIcon, InfoIcon } from 'lucide-react';
import { getOxidationStates, getSolubility } from './periodicTable';
import { getReactionType, analyzeCompound } from './chemistryUtils';

// База данных известных реакций
const knownReactions = new Map([
  // Реакции с водородом
  ['H2 + O2', '2H2O'],
  ['H2 + Cl2', '2HCl'],
  ['H2 + Br2', '2HBr'],
  ['H2 + I2', '2HI'],
  ['H2 + N2', '2NH3'],
  ['H2 + S', 'H2S'],

  // Реакции с кислородом
  ['Fe + O2', '2Fe2O3'],
  ['2Cu + O2', '2CuO'],
  ['4Al + 3O2', '2Al2O3'],
  ['CH4 + 2O2', 'CO2 + 2H2O'],
  ['C2H5OH + 3O2', '2CO2 + 3H2O'],
  ['4P + 5O2', '2P2O5'],
  ['S + O2', 'SO2'],
  ['2SO2 + O2', '2SO3'],
  ['4NH3 + 5O2', '4NO + 6H2O'],

  // Реакции с водой
  ['2Na + 2H2O', '2NaOH + H2'],
  ['Ca + 2H2O', 'Ca(OH)2 + H2'],
  ['K + H2O', 'KOH + H2'],
  ['CaO + H2O', 'Ca(OH)2'],
  ['SO3 + H2O', 'H2SO4'],
  ['CO2 + H2O', 'H2CO3'],
  ['P2O5 + 3H2O', '2H3PO4'],

  // Реакции с кислотами
  ['Fe + 2HCl', 'FeCl2 + H2'],
  ['Zn + 2HCl', 'ZnCl2 + H2'],
  ['Mg + H2SO4', 'MgSO4 + H2'],
  ['2Al + 6HCl', '2AlCl3 + 3H2'],
  ['Fe + CuSO4', 'FeSO4 + Cu'],
  ['Zn + CuSO4', 'ZnSO4 + Cu'],

  // Реакции нейтрализации
  ['NaOH + HCl', 'NaCl + H2O'],
  ['KOH + HNO3', 'KNO3 + H2O'],
  ['Ca(OH)2 + 2HCl', 'CaCl2 + 2H2O'],
  ['2NaOH + H2SO4', 'Na2SO4 + 2H2O'],

  // Реакции разложения
  ['CaCO3', 'CaO + CO2'],
  ['2KClO3', '2KCl + 3O2'],
  ['2H2O2', '2H2O + O2'],
  ['2NaNO3', '2NaNO2 + O2'],
  ['2KMnO4', 'K2MnO4 + MnO2 + O2'],

  // Реакции обмена
  ['AgNO3 + NaCl', 'AgCl + NaNO3'],
  ['BaCl2 + Na2SO4', 'BaSO4 + 2NaCl'],
  ['Pb(NO3)2 + 2KI', 'PbI2 + 2KNO3'],
  ['CaCl2 + Na2CO3', 'CaCO3 + 2NaCl']
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

// Разбор химической формулы на атомы и их количество
function parseFormula(formula: string): Record<string, number> {
  const atoms: Record<string, number> = {};
  let currentElement = '';
  let currentNumber = '';
  let coefficient = '';
  
  // Получаем коэффициент в начале формулы
  let i = 0;
  while (i < formula.length && /\d/.test(formula[i])) {
    coefficient += formula[i];
    i++;
  }
  const coef = coefficient ? parseInt(coefficient) : 1;
  
  // Разбор остальной части формулы
  while (i < formula.length) {
    if (formula[i] === '(' || formula[i] === ')') {
      i++;
      continue;
    }
    
    if (/[A-Z]/.test(formula[i])) {
      if (currentElement) {
        const num = currentNumber || '1';
        atoms[currentElement] = (atoms[currentElement] || 0) + parseInt(num) * coef;
        currentNumber = '';
      }
      currentElement = formula[i];
      if (i + 1 < formula.length && /[a-z]/.test(formula[i + 1])) {
        currentElement += formula[i + 1];
        i++;
      }
    } else if (/\d/.test(formula[i])) {
      currentNumber += formula[i];
    }
    i++;
  }
  
  if (currentElement) {
    const num = currentNumber || '1';
    atoms[currentElement] = (atoms[currentElement] || 0) + parseInt(num) * coef;
  }
  
  return atoms;
}

// Подсчет атомов в списке соединений
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

// Проверка баланса атомов
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

// Балансировка химического уравнения
function balanceEquation(equation: string): string {
  try {
    const [reactants, products] = equation.split(/->|=/).map(side => side.trim());
    const reactantsList = reactants.split('+').map(r => r.trim());
    const productsList = products.split('+').map(p => p.trim());
    
    // Проверяем исходное уравнение
    if (areAtomsBalanced(reactants, products)) {
      return `${reactants} → ${products}`;
    }
    
    // Перебираем коэффициенты
    for (let a = 1; a <= 10; a++) {
      for (let b = 1; b <= 10; b++) {
        for (let c = 1; c <= 10; c++) {
          for (let d = 1; d <= 10; d++) {
            let balancedReactants = '';
            let balancedProducts = '';
            
            // Формируем уравнение с коэффициентами
            reactantsList.forEach((r, i) => {
              if (i > 0) balancedReactants += ' + ';
              balancedReactants += `${i === 0 ? (a === 1 ? '' : a) : (b === 1 ? '' : b)}${r}`;
            });
            
            productsList.forEach((p, i) => {
              if (i > 0) balancedProducts += ' + ';
              balancedProducts += `${i === 0 ? (c === 1 ? '' : c) : (d === 1 ? '' : d)}${p}`;
            });
            
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

// Анализ реакции
function analyzeReaction(equation: string): string {
  try {
    const [reactants, products] = equation.split(/->|=/).map(side => side.trim());
    const reactantsList = reactants.split('+').map(r => r.trim());
    const productsList = products.split('+').map(p => p.trim());

    const reactionType = getReactionType(reactantsList, productsList);
    
    let analysis = `Тип реакции: ${reactionType}\n\n`;
    analysis += 'Анализ реагентов:\n';
    
    reactantsList.forEach(reactant => {
      const elements = reactant.match(/[A-Z][a-z]?/g) || [];
      elements.forEach(element => {
        const oxidationStates = getOxidationStates(element);
        const solubility = getSolubility(element);
        analysis += `${element}: Степени окисления [${oxidationStates.join(', ')}], ${solubility}\n`;
      });
      
      if (elements.length > 1) {
        analysis += `Тип связи в ${reactant}: ${analyzeCompound(reactant)}\n`;
      }
    });

    return analysis;
  } catch (error) {
    console.error('Error in analyzeReaction:', error);
    return "Ошибка при анализе реакции";
  }
}

function App() {
  const [equation, setEquation] = useState('');
  const [catalyst, setCatalyst] = useState('');
  const [result, setResult] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleSolve = () => {
    try {
      if (!equation.trim()) {
        setError('Пожалуйста, введите химическое уравнение');
        setResult('');
        setAnalysis('');
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
            setAnalysis('');
          } else {
            const finalEquation = catalyst 
              ? balancedEquation.replace('→', `(${catalyst})→`) 
              : balancedEquation;
            setResult(finalEquation);
            setAnalysis(analyzeReaction(balancedEquation));
            setError('');
          }
        } else {
          setError('Извините, я не знаю продукты этой реакции. Пожалуйста, введите полное уравнение.');
          setResult('');
          setAnalysis('');
        }
      } else {
        // Если уравнение полное, просто балансируем его
        const balancedEquation = balanceEquation(equation);
        
        if (balancedEquation.includes("Не удалось") || balancedEquation.includes("Ошибка")) {
          setError(balancedEquation);
          setResult('');
          setAnalysis('');
        } else {
          const finalEquation = catalyst 
            ? balancedEquation.replace('→', `(${catalyst})→`) 
            : balancedEquation;
          setResult(finalEquation);
          setAnalysis(analyzeReaction(balancedEquation));
          setError('');
        }
      }
    } catch (err) {
      console.error('Error in handleSolve:', err);
      setError('Ошибка в уравнении. Проверьте правильность написания.');
      setResult('');
      setAnalysis('');
    }
  };

  const handleClear = () => {
    setEquation('');
    setCatalyst('');
    setResult('');
    setAnalysis('');
    setError('');
    setShowAnalysis(false);
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
              <div className="flex gap-4 mb-4">
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
              <div className="mt-4">
                <label
                  htmlFor="catalyst"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Катализатор (необязательно)
                </label>
                <input
                  type="text"
                  id="catalyst"
                  value={catalyst}
                  onChange={(e) => setCatalyst(e.target.value)}
                  placeholder="Например: Pt или t°"
                  className="block w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {(result || error) && (
              <div className="mt-6 p-4 rounded-lg bg-gray-50">
                {error ? (
                  <p className="text-red-600">{error}</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 justify-center">
                      <div className="text-lg font-medium text-gray-900">{result}</div>
                    </div>
                    {analysis && (
                      <div className="mt-4">
                        <button
                          onClick={() => setShowAnalysis(!showAnalysis)}
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                        >
                          <InfoIcon className="h-5 w-5" />
                          {showAnalysis ? 'Скрыть анализ' : 'Показать анализ'}
                        </button>
                        {showAnalysis && (
                          <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-sm whitespace-pre-wrap">
                            {analysis}
                          </pre>
                        
                        )}
                      </div>
                    )}
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
              <li className="flex items-start gap-2">
                <ArrowRightIcon className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                <span>
                  При необходимости укажите катализатор (например: Pt или t°)
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