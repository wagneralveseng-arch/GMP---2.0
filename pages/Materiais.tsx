
import React from 'react';
import { Truck } from 'lucide-react';

const Materiais: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-white p-10 rounded-xl shadow-md">
            <Truck size={64} className="text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Página de Materiais</h2>
            <p className="text-gray-600 max-w-md">
                Esta seção está em desenvolvimento. Em breve, você poderá gerenciar seu estoque de materiais, controlar entradas e saídas, e vincular itens diretamente às suas obras.
            </p>
        </div>
    );
};

export default Materiais;
