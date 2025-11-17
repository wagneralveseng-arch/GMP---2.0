
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MoreVertical, Upload } from 'lucide-react';

// Mock Data - In a real app, this would come from state management (Context/Redux)
const clientes = [
    { id: 1, name: 'João Silva', endereco: 'Rua das Flores, 123' },
    { id: 2, name: 'Maria Oliveira', endereco: 'Av. Brasil, 456' }
];

const initialObras = [
    { id: 1, nome: 'Cozinha Planejada A', cliente: 'João Silva', inicio: '2023-10-01', previsao: '2023-11-15', responsavel: 'Carlos', status: 'Execução' },
    { id: 2, nome: 'Guarda-roupa suíte', cliente: 'Maria Oliveira', inicio: '2023-11-05', previsao: '2023-12-20', responsavel: 'André', status: 'Orçamento' },
];

type Status = 'Orçamento' | 'Execução' | 'Finalizada';
const statuses: Status[] = ['Orçamento', 'Execução', 'Finalizada'];

interface Task {
    id: number;
    title: string;
    status: Status;
}

const initialTasks: Record<number, Task[]> = {
    1: [
        { id: 101, title: 'Medição', status: 'Finalizada' },
        { id: 102, title: 'Corte de chapas', status: 'Execução' },
        { id: 103, title: 'Montagem de gavetas', status: 'Orçamento' },
    ],
    2: [
        { id: 201, title: 'Aprovar orçamento', status: 'Orçamento' }
    ],
};


const Obras: React.FC = () => {
    const [obras, setObras] = useState(initialObras);
    const [tasks, setTasks] = useState<Record<number, Task[]>>(initialTasks);
    const [selectedObra, setSelectedObra] = useState<number | null>(1);
    const [isObraModalOpen, setObraModalOpen] = useState(false);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [isEditTaskModalOpen, setEditTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editTaskFormData, setEditTaskFormData] = useState({ title: '', status: 'Orçamento' as Status });

    useEffect(() => {
        if (editingTask) {
            setEditTaskFormData({ title: editingTask.title, status: editingTask.status });
        }
    }, [editingTask]);

    const handleAddObra = () => {
        // Logic to add a new obra
        setObraModalOpen(false);
    };

    const handleDeleteObra = (id: number) => {
        setObras(prev => prev.filter(obra => obra.id !== id));
        if (selectedObra === id) {
            setSelectedObra(null);
        }
    };
    
    const handleAddTask = (obraId: number) => {
        setTaskModalOpen(true);
    };
    
    const handleOpenEditTaskModal = (task: Task) => {
        setEditingTask(task);
        setEditTaskModalOpen(true);
    };

    const handleUpdateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTask || !selectedObra) return;

        setTasks(prevTasks => {
            const updatedTasksForObra = prevTasks[selectedObra].map(task =>
                task.id === editingTask.id ? { ...task, ...editTaskFormData } : task
            );
            return {
                ...prevTasks,
                [selectedObra]: updatedTasksForObra
            };
        });
        setEditTaskModalOpen(false);
        setEditingTask(null);
    };
    
    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditTaskFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (id: number) => {
       setObras(prevObras => {
           return prevObras.map(obra => {
               if (obra.id === id) {
                   const currentStatusIndex = statuses.findIndex(s => s === obra.status);
                   const nextStatusIndex = (currentStatusIndex + 1) % statuses.length;
                   const newStatus = statuses[nextStatusIndex];
                   return { ...obra, status: newStatus };
               }
               return obra;
           });
       });
   };

    const renderKanbanColumn = (status: Status, obraId: number) => {
        const columnTasks = tasks[obraId]?.filter(task => task.status === status) || [];
        
        const statusColors: Record<Status, string> = {
            'Orçamento': 'bg-yellow-100 border-yellow-400',
            'Execução': 'bg-orange-100 border-orange-400',
            'Finalizada': 'bg-green-100 border-green-400',
        };

        return (
            <div key={status} className={`flex-1 p-4 rounded-lg ${statusColors[status]}`}>
                <h3 className="font-semibold mb-4 text-gray-700">{status}</h3>
                <div className="space-y-3">
                    {columnTasks.map(task => (
                        <div key={task.id} className="bg-white p-3 rounded-md shadow cursor-pointer">
                            <p>{task.title}</p>
                             <div className="mt-2 flex justify-end">
                                <button onClick={() => handleOpenEditTaskModal(task)} className="text-gray-500 hover:text-[#D88021]">
                                    <Edit size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Lista de Obras</h2>
                    <button onClick={() => setObraModalOpen(true)} className="flex items-center bg-[#D88021] text-white px-4 py-2 rounded-lg hover:bg-[#C2711D] transition">
                        <Plus size={20} className="mr-2" />
                        Nova Obra
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3">Nome</th>
                                <th className="p-3">Cliente</th>
                                <th className="p-3">Previsão Entrega</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {obras.map(obra => (
                                <tr key={obra.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedObra(obra.id)}>
                                    <td className="p-3 font-medium">{obra.nome}</td>
                                    <td className="p-3">{obra.cliente}</td>
                                    <td className="p-3">{new Date(obra.previsao).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-3">
                                        <button
                                           onClick={(e) => {
                                               e.stopPropagation();
                                               handleStatusChange(obra.id);
                                           }}
                                           className={`px-3 py-1 text-xs font-semibold rounded-full w-28 text-center transition-colors duration-200 ${
                                               obra.status === 'Execução' ? 'bg-orange-200 text-orange-800 hover:bg-orange-300' :
                                               obra.status === 'Finalizada' ? 'bg-green-200 text-green-800 hover:bg-green-300' :
                                               'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                                           }`}
                                        >
                                           {obra.status}
                                        </button>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center space-x-2">
                                            <button className="text-gray-500 hover:text-[#D88021]"><Edit size={18} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteObra(obra.id); }} className="text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedObra && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Fluxo da Obra: {obras.find(o => o.id === selectedObra)?.nome}
                        </h2>
                        <button onClick={() => handleAddTask(selectedObra)} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                            <Plus size={20} className="mr-2" />
                            Nova Tarefa
                        </button>
                    </div>
                    <div className="flex space-x-4">
                        {statuses.map(status => renderKanbanColumn(status, selectedObra))}
                    </div>
                </div>
            )}

            {/* Modal Nova Obra */}
            {isObraModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-lg">
                        <h3 className="text-2xl font-bold mb-6">Adicionar Nova Obra</h3>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddObra(); }}>
                            <input type="text" placeholder="Nome da Obra" className="w-full p-3 border rounded-lg" required />
                            <select className="w-full p-3 border rounded-lg" required>
                                <option value="">Selecione o Cliente</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" placeholder="Data de Início" className="w-full p-3 border rounded-lg" required />
                                <input type="date" placeholder="Previsão de Entrega" className="w-full p-3 border rounded-lg" required />
                            </div>
                            <input type="text" placeholder="Responsável" className="w-full p-3 border rounded-lg" />
                            <textarea placeholder="Observações" className="w-full p-3 border rounded-lg h-24"></textarea>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setObraModalOpen(false)} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200">Cancelar</button>
                                <button type="submit" className="px-6 py-2 rounded-lg bg-[#D88021] text-white hover:bg-[#C2711D]">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Modal Nova Tarefa */}
            {isTaskModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-lg">
                        <h3 className="text-2xl font-bold mb-6">Adicionar Nova Tarefa</h3>
                         <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setTaskModalOpen(false); }}>
                            <input type="text" placeholder="Nome da Tarefa" className="w-full p-3 border rounded-lg" required />
                            <select className="w-full p-3 border rounded-lg" required>
                                <option value="">Selecione o Status</option>
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Adicionar Fotos (máx. 5)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#D88021] hover:text-[#C2711D] focus-within:outline-none">
                                                <span>Carregar arquivos</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" />
                                            </label>
                                            <p className="pl-1">ou arraste e solte</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <textarea placeholder="Observações" className="w-full p-3 border rounded-lg h-24"></textarea>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setTaskModalOpen(false)} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200">Cancelar</button>
                                <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Adicionar Tarefa</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar Tarefa */}
            {isEditTaskModalOpen && editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-lg">
                        <h3 className="text-2xl font-bold mb-6">Editar Tarefa</h3>
                        <form className="space-y-4" onSubmit={handleUpdateTask}>
                            <input 
                                name="title" 
                                type="text" 
                                placeholder="Nome da Tarefa" 
                                className="w-full p-3 border rounded-lg" 
                                value={editTaskFormData.title} 
                                onChange={handleEditFormChange} 
                                required 
                            />
                            <select 
                                name="status" 
                                className="w-full p-3 border rounded-lg" 
                                value={editTaskFormData.status} 
                                onChange={handleEditFormChange} 
                                required
                            >
                                <option value="">Selecione o Status</option>
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <textarea placeholder="Observações (opcional)" className="w-full p-3 border rounded-lg h-24"></textarea>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setEditTaskModalOpen(false)} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200">Cancelar</button>
                                <button type="submit" className="px-6 py-2 rounded-lg bg-[#D88021] text-white hover:bg-[#C2711D]">Salvar Alterações</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Obras;
