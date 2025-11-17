
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Line, ComposedChart } from 'recharts';
import { TrendingUp, Hammer, CheckCircle, DollarSign } from 'lucide-react';

const obrasData = [
    { status: 'Orçamento', value: 3 },
    { status: 'Execução', value: 5 },
    { status: 'Finalizada', value: 8 },
];

const fornecedorData = [
    { name: 'Madeireira Silva', value: 4500 },
    { name: 'Ferragens & Cia', value: 2800 },
    { name: 'Tintas Premium', value: 1500 },
    { name: 'Outros', value: 3200 },
];

const cashFlowData = [
    { month: 'Jan', recebido: 12000, despesas: 7000, imposto: 1200 },
    { month: 'Fev', recebido: 15000, despesas: 8500, imposto: 1500 },
    { month: 'Mar', recebido: 13500, despesas: 7800, imposto: 1350 },
    { month: 'Abr', recebido: 18000, despesas: 10000, imposto: 1800 },
    { month: 'Mai', recebido: 16500, despesas: 9500, imposto: 1650 },
    { month: 'Jun', recebido: 21000, despesas: 12000, imposto: 2100 },
].map(d => ({ ...d, lucro: d.recebido - d.despesas - d.imposto }));

const COLORS_OBRAS = ['#FFBB28', '#D88021', '#00C49F'];
const COLORS_FORNECEDOR = ['#FF8042', '#A0522D', '#00C49F', '#FFBB28'];

const InfoCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const lucro = payload.reduce((sum, entry) => sum + (entry.dataKey === 'lucro' ? entry.value : 0), 0);
        return (
          <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
            <p className="font-bold">{label}</p>
            <p style={{ color: '#D88021' }}>Recebido: R$ {payload.find(p => p.dataKey === 'recebido')?.value.toLocaleString('pt-BR')}</p>
            <p style={{ color: '#FF8042' }}>Despesas: R$ {payload.find(p => p.dataKey === 'despesas')?.value.toLocaleString('pt-BR')}</p>
            <p style={{ color: '#00C49F' }}>Imposto: R$ {payload.find(p => p.dataKey === 'imposto')?.value.toLocaleString('pt-BR')}</p>
            <p className="font-semibold mt-1">Lucro: R$ {lucro.toLocaleString('pt-BR')}</p>
          </div>
        );
      }
      return null;
    };

    return (
        <div className="space-y-8">
            {/* Cards de resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard title="Obras Ativas" value="8" icon={<Hammer className="text-white" size={24} />} color="bg-[#D88021]" />
                <InfoCard title="Obras Concluídas" value="8" icon={<CheckCircle className="text-white" size={24} />} color="bg-green-500" />
                <InfoCard title="Lucro do Mês" value="R$ 9.100" icon={<DollarSign className="text-white" size={24} />} color="bg-yellow-500" />
            </div>
             <p className="text-sm text-gray-600 italic mt-2">
                * O <strong>Lucro do Mês</strong> é calculado subtraindo o total de despesas pagas e impostos do total de valores recebidos de clientes dentro do mês corrente.
            </p>

            {/* Gráficos de Rosca */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Status das Obras</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={obrasData} dataKey="value" nameKey="status" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label>
                                {obrasData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_OBRAS[index % COLORS_OBRAS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Despesas por Fornecedor</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={fornecedorData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" paddingAngle={5} label>
                                {fornecedorData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_FORNECEDOR[index % COLORS_FORNECEDOR.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico de Fluxo de Caixa */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fluxo de Caixa Mensal</h3>
                 <ResponsiveContainer width="100%" height={400}>
                     <ComposedChart data={cashFlowData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `R$ ${Number(value) / 1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="recebido" stackId="a" fill="#D88021" name="Valor Recebido" />
                        <Bar dataKey="despesas" stackId="b" fill="#FF8042" name="Despesas Pagas" />
                        <Bar dataKey="imposto" stackId="b" fill="#00C49F" name="Imposto" />
                        <Line type="monotone" dataKey="lucro" stroke="#ff7300" strokeWidth={2} name="Lucro" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
