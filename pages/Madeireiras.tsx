
import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';

// Mock data representing a parsed CSV file.
// In a real application, you would fetch and parse a CSV file.
// For this app to work, this data must be provided.
const madeireirasData = [
  { "Rede": "Leo Madeiras", "Bairro": "Centro", "Municipio": "São Paulo", "UF": "SP", "Contato": "(11) 1111-1111", "Especialidade": "MDF, Compensado" },
  { "Rede": "GMAD", "Bairro": "Pinheiros", "Municipio": "São Paulo", "UF": "SP", "Contato": "(11) 2222-2222", "Especialidade": "Ferragens, Ferramentas" },
  { "Rede": "Madeireira Cedro", "Bairro": "Copacabana", "Municipio": "Rio de Janeiro", "UF": "RJ", "Contato": "(21) 3333-3333", "Especialidade": "Madeira Maciça" },
  { "Rede": "Leo Madeiras", "Bairro": "Savassi", "Municipio": "Belo Horizonte", "UF": "MG", "Contato": "(31) 4444-4444", "Especialidade": "MDF, Fórmica" },
  { "Rede": "GMAD", "Bairro": "Centro", "Municipio": "Curitiba", "UF": "PR", "Contato": "(41) 5555-5555", "Especialidade": "Compensado, Ferragens" },
  { "Rede": "Mega Madeiras", "Bairro": "Boa Viagem", "Municipio": "Recife", "UF": "PE", "Contato": "(81) 6666-6666", "Especialidade": "MDF, Madeira de Demolição" },
  { "Rede": "Leo Madeiras", "Bairro": "Aldeota", "Municipio": "Fortaleza", "UF": "CE", "Contato": "(85) 7777-7777", "Especialidade": "Compensado Naval" },
];

type FilterCategory = 'Rede' | 'Bairro' | 'Municipio' | 'UF';

const FilterDropdown: React.FC<{ options: string[]; onSelect: (value: string) => void; placeholder: string }> = ({ options, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredOptions = options.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="relative inline-block text-left">
            <div>
                <button type="button" onClick={() => setIsOpen(!isOpen)} className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                    {placeholder}
                    <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
                </button>
            </div>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="p-2">
                        <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-2 py-1 border rounded-md" />
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                        {filteredOptions.map(option => (
                            <a key={option} href="#" onClick={(e) => { e.preventDefault(); onSelect(option); setIsOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                {option}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const Madeireiras: React.FC = () => {
    const [filters, setFilters] = useState<Record<FilterCategory, string>>({
        Rede: '',
        Bairro: '',
        Municipio: '',
        UF: ''
    });

    const filteredData = useMemo(() => {
        return madeireirasData.filter(item => {
            return (Object.keys(filters) as FilterCategory[]).every(key => {
                return filters[key] === '' || item[key] === filters[key];
            });
        });
    }, [filters]);

    const getUniqueOptions = (category: FilterCategory) => {
        return [...new Set(madeireirasData.map(item => item[category]))];
    };

    const handleFilterChange = (category: FilterCategory, value: string) => {
        setFilters(prev => ({ ...prev, [category]: value }));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Lista de Madeireiras</h2>
            <p className="text-sm text-gray-600 mb-6">
                <strong>Nota:</strong> Esta lista é carregada de dados de exemplo. Para que a lista apareça, os dados devem ser fornecidos ao componente, geralmente a partir de uma chamada de API ou de um arquivo local.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
                 <FilterDropdown options={getUniqueOptions('Rede')} onSelect={(v) => handleFilterChange('Rede', v)} placeholder="Rede" />
                 <FilterDropdown options={getUniqueOptions('Bairro')} onSelect={(v) => handleFilterChange('Bairro', v)} placeholder="Bairro" />
                 <FilterDropdown options={getUniqueOptions('Municipio')} onSelect={(v) => handleFilterChange('Municipio', v)} placeholder="Município" />
                 <FilterDropdown options={getUniqueOptions('UF')} onSelect={(v) => handleFilterChange('UF', v)} placeholder="UF" />
                 <button onClick={() => setFilters({ Rede: '', Bairro: '', Municipio: '', UF: '' })} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Limpar Filtros</button>
            </div>
            
            <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3">Rede</th>
                            <th className="p-3">Bairro</th>
                            <th className="p-3">Município</th>
                            <th className="p-3">UF</th>
                            <th className="p-3">Contato</th>
                            <th className="p-3">Especialidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-3 font-medium">{item.Rede}</td>
                                    <td className="p-3">{item.Bairro}</td>
                                    <td className="p-3">{item.Municipio}</td>
                                    <td className="p-3">{item.UF}</td>
                                    <td className="p-3">{item.Contato}</td>
                                    <td className="p-3">{item.Especialidade}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center p-6 text-gray-500">Nenhuma madeireira encontrada. Verifique seus filtros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Madeireiras;
