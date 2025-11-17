
import React, { useState, useCallback } from 'react';
import { Plus, User, Building, Briefcase, Edit, Trash2 } from 'lucide-react';

interface CadastroItem {
    id: number;
    nome: string;
    doc: string;
    email: string;
    telefone: string;
}

const mockClientes: CadastroItem[] = [
    { id: 1, nome: 'João da Silva', doc: '111.222.333-44', email: 'joao.silva@email.com', telefone: '(11) 98765-4321' },
    { id: 2, nome: 'Maria Oliveira', doc: '444.555.666-77', email: 'maria.o@email.com', telefone: '(21) 91234-5678' },
];

const mockFornecedores: CadastroItem[] = [
    { id: 1, nome: 'Madeireira Central', doc: '12.345.678/0001-99', email: 'contato@madeireira.com', telefone: '(31) 3333-4444' },
    { id: 2, nome: 'Ferragens & Cia', doc: '98.765.432/0001-11', email: 'vendas@ferragens.co', telefone: '(41) 3210-9876' },
];

const mockFuncionarios: CadastroItem[] = [
    { id: 1, nome: 'Carlos Souza', doc: '999.888.777-66', email: 'carlos.souza@empresa.com', telefone: '(51) 99887-7665' },
];

const ListSection: React.FC<{ title: string; data: CadastroItem[]; docHeader: string; }> = ({ title, data, docHeader }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3">Nome</th>
                        <th className="p-3">{docHeader}</th>
                        <th className="p-3">E-mail</th>
                        <th className="p-3">Telefone</th>
                        <th className="p-3">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map(item => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{item.nome}</td>
                            <td className="p-3">{item.doc}</td>
                            <td className="p-3">{item.email}</td>
                            <td className="p-3">{item.telefone}</td>
                            <td className="p-3">
                                <div className="flex items-center space-x-2">
                                    <button className="text-gray-500 hover:text-[#D88021]"><Edit size={18} /></button>
                                    <button className="text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                           <td colSpan={5} className="text-center p-6 text-gray-500">Nenhum item cadastrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);


const Cadastro: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'clientes' | 'fornecedores' | 'funcionarios'>('clientes');
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState({
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: ''
    });

    const [clientes, setClientes] = useState(mockClientes);
    const [fornecedores, setFornecedores] = useState(mockFornecedores);
    const [funcionarios, setFuncionarios] = useState(mockFuncionarios);

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCep = e.target.value.replace(/\D/g, '');
        setCep(newCep);

        if (newCep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${newCep}/json/`);
                if (!response.ok) throw new Error('CEP não encontrado');
                const data = await response.json();
                if (data.erro) throw new Error('CEP inválido');
                setAddress({
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    uf: data.uf
                });
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
                setAddress({ logradouro: '', bairro: '', cidade: '', uf: '' });
            }
        }
    };

    const FormSection: React.FC<{ title: string }> = ({ title }) => (
        <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Nome Completo / Razão Social" className="w-full p-3 border rounded-lg" required />
                    <input type="text" placeholder="CPF / CNPJ" className="w-full p-3 border rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="email" placeholder="E-mail" className="w-full p-3 border rounded-lg" />
                    <input type="tel" placeholder="Telefone / Celular" className="w-full p-3 border rounded-lg" required />
                </div>
                <h3 className="text-lg font-semibold pt-4">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="CEP" value={cep} onChange={handleCepChange} maxLength={9} className="w-full p-3 border rounded-lg md:col-span-1" />
                    <input type="text" placeholder="Logradouro" value={address.logradouro} onChange={e => setAddress({...address, logradouro: e.target.value})} className="w-full p-3 border rounded-lg md:col-span-2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Número" className="w-full p-3 border rounded-lg" />
                    <input type="text" placeholder="Bairro" value={address.bairro} onChange={e => setAddress({...address, bairro: e.target.value})} className="w-full p-3 border rounded-lg" />
                    <input type="text" placeholder="Complemento" className="w-full p-3 border rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Cidade" value={address.cidade} onChange={e => setAddress({...address, cidade: e.target.value})} className="w-full p-3 border rounded-lg" />
                    <input type="text" placeholder="UF" value={address.uf} onChange={e => setAddress({...address, uf: e.target.value})} className="w-full p-3 border rounded-lg" />
                </div>
                <div className="flex justify-end pt-4">
                    <button type="submit" className="flex items-center bg-[#D88021] text-white px-6 py-3 rounded-lg hover:bg-[#C2711D] transition">
                        <Plus size={20} className="mr-2" />
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'clientes':
                return <><ListSection title="Clientes Cadastrados" data={clientes} docHeader="CPF" /><FormSection title="Cadastrar Novo Cliente" /></>;
            case 'fornecedores':
                return <><ListSection title="Fornecedores Cadastrados" data={fornecedores} docHeader="CNPJ" /><FormSection title="Cadastrar Novo Fornecedor" /></>;
            case 'funcionarios':
                return <><ListSection title="Funcionários Cadastrados" data={funcionarios} docHeader="CPF" /><FormSection title="Cadastrar Novo Funcionário" /></>;
            default:
                return null;
        }
    }
    
    return (
        <div className="space-y-6">
            <div className="flex border-b border-gray-200 bg-white rounded-t-xl shadow-md p-2">
                <button
                    onClick={() => setActiveTab('clientes')}
                    className={`flex items-center px-6 py-3 text-lg font-medium transition-colors rounded-lg ${activeTab === 'clientes' ? 'bg-orange-100 text-[#D88021]' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    <User className="mr-2" />
                    Clientes
                </button>
                <button
                    onClick={() => setActiveTab('fornecedores')}
                    className={`flex items-center px-6 py-3 text-lg font-medium transition-colors rounded-lg ${activeTab === 'fornecedores' ? 'bg-orange-100 text-[#D88021]' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    <Building className="mr-2" />
                    Fornecedores
                </button>
                <button
                    onClick={() => setActiveTab('funcionarios')}
                    className={`flex items-center px-6 py-3 text-lg font-medium transition-colors rounded-lg ${activeTab === 'funcionarios' ? 'bg-orange-100 text-[#D88021]' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    <Briefcase className="mr-2" />
                    Funcionários
                </button>
            </div>
            
            <div className="space-y-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default Cadastro;
