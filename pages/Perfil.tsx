
import React from 'react';
import { Upload, KeyRound, Mail, ExternalLink } from 'lucide-react';

const Perfil: React.FC = () => {
    const avatarSrc = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGNsaXBQYXRoIGlkPSJjaXJjbGVWaWV3Ij48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgLz48L2NsaXBQYXRoPjwvZGVmcz48ZyBjbGlwLXBhdGg9InVybCgjY2lyY2xlVmlldykiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRTBFMEUwIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI2NSIgcj0iMzAiIGZpbGw9IiNGNURFQjMiLz48cGF0aCBkPSJNIDUwLDUgQSA0NSw0NSAwIDAsMSA5NSw1MCBIIDUgWiBBIDQ1LDQ1IDAgMCwxIDUwLDUiIGZpbGw9IiNGRkMxMDciLz48cmVjdCB4PSI1IiB5PSI0OCIgd2lkdGg9IjkwIiBoZWlnaHQ9IjUiIGZpbGw9IiNGRkEwMDAiLz48L2c+PC9zdmc+";

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Perfil do Usuário</h2>
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <img src={avatarSrc} alt="User Avatar" className="w-24 h-24 rounded-full object-cover" />
                        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-[#D88021] p-2 rounded-full cursor-pointer hover:bg-[#C2711D] transition">
                            <Upload size={16} className="text-white" />
                            <input id="avatar-upload" type="file" className="sr-only" />
                        </label>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Nome do Usuário</h3>
                        <p className="text-gray-500">marceneiro.pro@email.com</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações da Conta</h2>
                <form className="space-y-4">
                     <div className="flex items-center border rounded-lg p-3">
                        <Mail className="text-gray-400 mr-3" />
                        <input type="email" defaultValue="marceneiro.pro@email.com" placeholder="Seu e-mail" className="w-full bg-transparent focus:outline-none" />
                    </div>
                     <div className="flex items-center border rounded-lg p-3">
                        <KeyRound className="text-gray-400 mr-3" />
                        <input type="password" placeholder="Nova Senha" className="w-full bg-transparent focus:outline-none" />
                    </div>
                     <div className="flex items-center border rounded-lg p-3">
                        <KeyRound className="text-gray-400 mr-3" />
                        <input type="password" placeholder="Confirmar Nova Senha" className="w-full bg-transparent focus:outline-none" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="px-6 py-3 rounded-lg bg-[#D88021] text-white hover:bg-[#C2711D] transition">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Assinatura</h2>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-600">Seu plano: <span className="font-semibold text-green-600">PRO Anual</span></p>
                        <p className="text-sm text-gray-500">Sua assinatura expira em: 25 de Dezembro de 2024</p>
                    </div>
                    <a href="https://example.com/billing" target="_blank" rel="noopener noreferrer" className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                        Renovar Assinatura
                        <ExternalLink size={18} className="ml-2" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
