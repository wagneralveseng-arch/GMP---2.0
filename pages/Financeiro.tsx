import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Filter, X } from 'lucide-react';

type Categoria = 'Fornecedor' | 'Cliente' | 'Imposto' | 'Funcionário';
type FormaPagamento = 'Pix' | 'Cartão de Crédito' | 'Dinheiro' | 'Faturado';
type StatusPagamento = 'Pago' | 'Pendente';
type TipoTransacao = 'receber' | 'pagar' | '';

interface Transacao {
    id: number;
    descricao: string;
    nome: string;
    valor: number;
    vencimento: string;
    categoria: Categoria;
    status: StatusPagamento;
}

const initialTransacoes: Transacao[] = [
    { id: 1, descricao: 'Chapas MDF', nome: 'Madeireira Silva', valor: 2500, vencimento: '2023-11-20', categoria: 'Fornecedor', status: 'Pago' },
    { id: 2, descricao: 'Entrada Cozinha', nome: 'João Silva', valor: 5000, vencimento: '2023-11-22', categoria: 'Cliente', status: 'Pago' },
    { id: 3, descricao: 'Ferragens', nome: 'Ferragens & Cia', valor: 850, vencimento: '2023-12-05', categoria: 'Fornecedor', status: 'Pendente' },
    { id: 4, descricao: 'Imposto DAS', nome: 'Receita Federal', valor: 450, vencimento: '2023-12-10', categoria: 'Imposto', status: 'Pendente' },
];

const emptyTransaction: Omit<Transacao, 'id' | 'status'> = {
    descricao: '',
    nome: '',
    valor: 0,
    vencimento: new Date().toISOString().split('T')[0],
    categoria: 'Fornecedor',
};

const mockClientes = [{ id: 1, name: 'João Silva' }, { id: 2, name: 'Maria Oliveira' }];
const mockFornecedores = [{ id: 1, name: 'Madeireira Silva' }, { id: 2, name: 'Ferragens & Cia' }, { id: 3, name: 'Tintas Premium' }];
const mockFuncionarios = [{ id: 1, name: 'Carlos' }, { id: 2, name: 'André' }];

const categorias: Categoria[] = ['Fornecedor', 'Cliente', 'Imposto', 'Funcionário'];

const Financeiro: React.FC = () => {
    const [transacoes, setTransacoes] = useState(initialTransacoes);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingTransacao, setEditingTransacao] = useState<Transacao | null>(null);
    const [formData, setFormData] = useState<Omit<Transacao, 'id' | 'status'>>(emptyTransaction);

    const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('Pix');
    const [faturadoTermos, setFaturadoTermos] = useState('');

    const [filters, setFilters] = useState({
        mes: '',
        ano: '',
        tipo: '' as TipoTransacao,
        categoria: '' as Categoria | '',
    });

    const filteredTransacoes = useMemo(() => {
        return transacoes.filter(t => {
            const vencimentoDate = new Date(t.vencimento + 'T00:00:00');
            const mesMatch = !filters.mes || (vencimentoDate.getMonth() + 1) === parseInt(filters.mes);
            const anoMatch = !filters.ano || vencimentoDate.getFullYear() === parseInt(filters.ano);
            const categoriaMatch = !filters.categoria || t.categoria === filters.categoria;
            
            const tipoMatch = !filters.tipo || (filters.tipo === 'receber' ? t.categoria === 'Cliente' : t.categoria !== 'Cliente');

            return mesMatch && anoMatch && categoriaMatch && tipoMatch;
        });
    }, [transacoes, filters]);

    const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ mes: '', ano: '', tipo: '', categoria: '' });
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'valor' ? parseFloat(value) || 0 : value,
        }));
    }, []);

    const handleCategoriaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCat = e.target.value as Categoria;
        setFormData(prev => ({ ...prev, categoria: newCat, nome: '' }));
    }, []);

    const handleFormSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingTransacao) {
            setTransacoes(prev => prev.map(t =>
                t.id === editingTransacao.id ? { ...editingTransacao, ...formData } : t
            ));
        } else {
            const newId = transacoes.length > 0 ? Math.max(...transacoes.map(t => t.id)) + 1 : 1;
            const newTransacao: Transacao = { id: newId, ...formData, status: 'Pendente' };
            setTransacoes(prev => [newTransacao, ...prev]);
        }
        setModalOpen(false);
    }, [formData, editingTransacao, transacoes]);

    const handleDeleteTransacao = useCallback((id: number) => {
        if (window.confirm('Tem certeza que deseja apagar esta transação?')) {
            setTransacoes(prev => prev.filter(t => t.id !== id));
        }
    }, []);

    const openEditModal = useCallback((transacao: Transacao) => {
        setEditingTransacao(transacao);
        setFormData({
            descricao: transacao.descricao,
            nome: transacao.nome,
            valor: transacao.valor,
            vencimento: transacao.vencimento,
            categoria: transacao.categoria,
        });
        setModalOpen(true);
    }, []);

    const openNewModal = useCallback(() => {
        setEditingTransacao(null);
        setFormData(emptyTransaction);
        setFormaPagamento('Pix');
        setFaturadoTermos('');
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditingTransacao(null);
    }, []);

    const toggleStatus = useCallback((id: number) => {
        setTransacoes(prev => prev.map(t =>
            t.id === id ? { ...t, status: t.status === 'Pendente' ? 'Pago' : 'Pendente' } : t
        ));
    }, []);

    const renderNomeInput = () => {
        switch (formData.categoria) {
            case 'Cliente':
                return <select name="nome" value={formData.nome} onChange={handleInputChange} className="w-full p-3 border rounded-lg mt-1" required><option value="">Selecione o Cliente</option>{mockClientes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select>;
            case 'Fornecedor':
                return <select name="nome" value={formData.nome} onChange={handleInputChange} className="w-full p-3 border rounded-lg mt-1" required><option value="">Selecione o Fornecedor</option>{mockFornecedores.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}</select>;
            case 'Funcionário':
                return <select name="nome" value={formData.nome} onChange={handleInputChange} className="w-full p-3 border rounded-lg mt-1" required><option value="">Selecione o Funcionário</option>{mockFuncionarios.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}</select>;
            default:
                return <input name="nome" type="text" placeholder="Nome do Imposto" value={formData.nome} onChange={handleInputChange} className="w-full p-3 border rounded-lg mt-1" required />;
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-gray-800">Controle Financeiro</h2>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <select name="mes" value={filters.mes} onChange={handleFilterChange} className="p-2 border rounded-lg bg-gray-50"><option value="">Mês</option>{[...Array(12)].map((_, i) => <option key={i} value={i+1}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</option>)}</select>
                        <select name="ano" value={filters.ano} onChange={handleFilterChange} className="p-2 border rounded-lg bg-gray-50"><option value="">Ano</option><option value="2024">2024</option><option value="2023">2023</option></select>
                        <select name="tipo" value={filters.tipo} onChange={handleFilterChange} className="p-2 border rounded-lg bg-gray-50"><option value="">Tipo</option><option value="receber">A Receber</option><option value="pagar">A Pagar</option></select>
                        <select name="categoria" value={filters.categoria} onChange={handleFilterChange} className="p-2 border rounded-lg bg-gray-50"><option value="">Categoria</option>{categorias.map(c => <option key={c} value={c}>{c}</option>)}</select>
                        <button onClick={clearFilters} className="flex items-center text-gray-600 p-2 rounded-lg hover:bg-gray-100" aria-label="Limpar filtros"><X size={18} /></button>
                    </div>
                    <button onClick={openNewModal} className="flex items-center bg-[#D88021] text-white px-4 py-2 rounded-lg hover:bg-[#C2711D] transition"><Plus size={20} className="mr-2" />Nova Transação</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100"><th className="p-3">Descrição</th><th className="p-3">Nome</th><th className="p-3">Valor</th><th className="p-3">Vencimento</th><th className="p-3">Categoria</th><th className="p-3">Status</th><th className="p-3 text-center">Ações</th></tr>
                        </thead>
                        <tbody>
                            {filteredTransacoes.map(t => (
                                <tr key={t.id} className="border-b">
                                    <td className="p-3 font-medium">{t.descricao}</td>
                                    <td className="p-3">{t.nome}</td>
                                    <td className={`p-3 font-semibold ${t.categoria === 'Cliente' ? 'text-green-600' : 'text-red-600'}`}>R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    <td className="p-3">{new Date(t.vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                                    <td className="p-3">{t.categoria}</td>
                                    <td className="p-3">
                                        <button onClick={() => toggleStatus(t.id)} className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 w-24 text-center ${t.status === 'Pago' ? 'bg-green-200 text-green-800 hover:bg-green-300' : 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'}`} aria-label={`Mudar status para ${t.status === 'Pendente' ? 'Pago' : 'Pendente'}`}>{t.status}</button>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button onClick={() => openEditModal(t)} className="text-gray-500 hover:text-[#D88021]" aria-label={`Editar ${t.descricao}`}><Edit size={18} /></button>
                                            <button onClick={() => handleDeleteTransacao(t.id)} className="text-gray-500 hover:text-red-600" aria-label={`Excluir ${t.descricao}`}><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                             {filteredTransacoes.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center p-6 text-gray-500">Nenhuma transação encontrada.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-6">{editingTransacao ? 'Editar Transação' : 'Nova Transação'}</h3>
                        <form className="space-y-4" onSubmit={handleFormSubmit}>
                             <div><label className="block text-sm font-medium text-gray-700">Descrição</label><input name="descricao" type="text" placeholder="Ex: Chapas de MDF" value={formData.descricao} onChange={handleInputChange} className="w-full p-3 border rounded-lg mt-1" required /></div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700">Categoria</label><select name="categoria" value={formData.categoria} onChange={handleCategoriaChange} className="w-full p-3 border rounded-lg mt-1">{categorias.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                <div><label className="block text-sm font-medium text-gray-700">Nome</label>{renderNomeInput()}</div>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700">Valor</label><input name="valor" type="number" step="0.01" placeholder="R$ 0,00" value={formData.valor} onChange={handleInputChange} className="w-full p-3 border rounded-lg mt-1" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Vencimento</label><input name="vencimento" type="date" value={formData.vencimento} onChange={handleInputChange} className="w-full p-3 border rounded-lg mt-1" required /></div>
                             </div>
                            <div><label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label><select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)} className="w-full p-3 border rounded-lg mt-1"><option>Pix</option><option>Cartão de Crédito</option><option>Dinheiro</option><option>Faturado</option></select></div>
                            {formaPagamento === 'Cartão de Crédito' && (<div><label className="block text-sm font-medium text-gray-700">Parcelas</label><select className="w-full p-3 border rounded-lg mt-1">{[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}x</option>)}</select></div>)}
                            {formaPagamento === 'Faturado' && formData.categoria === 'Fornecedor' && (<div><label className="block text-sm font-medium text-gray-700">Termos</label><select value={faturadoTermos} onChange={e => setFaturadoTermos(e.target.value)} className="w-full p-3 border rounded-lg mt-1"><option value="">Selecione</option><option value="30">30 dias</option><option value="30_60">30/60 dias</option><option value="30_60_90">30/60/90 dias</option></select></div>)}
                            <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={closeModal} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200">Cancelar</button><button type="submit" className="px-6 py-2 rounded-lg bg-[#D88021] text-white hover:bg-[#C2711D]">Salvar</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Financeiro;
