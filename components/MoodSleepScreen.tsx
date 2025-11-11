import React, { useState } from 'react';
import { useAppContext } from '../App';
import { MoodLog, SleepLog } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Smile, Frown, Meh, SmilePlus, Angry, BedDouble } from 'lucide-react';
import Modal from './Modal';

const MoodIcon = ({ mood }: { mood: MoodLog['mood'] }) => {
    switch (mood) {
        case '😄': return <SmilePlus className="text-green-500" />;
        case '🙂': return <Smile className="text-lime-500" />;
        case '😐': return <Meh className="text-yellow-500" />;
        case '😟': return <Frown className="text-orange-500" />;
        case '😥': return <Angry className="text-red-500" />;
        default: return null;
    }
}

const moodToValue = (mood: MoodLog['mood']) => {
    const mapping = { '😄': 5, '🙂': 4, '😐': 3, '😟': 2, '😥': 1 };
    return mapping[mood];
}

const valueToMood = (value: number) => {
    const mapping = ['😥', '😟', '😐', '🙂', '😄'];
    return mapping[value - 1];
}

// Helper to get the last 7 calendar days
const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const moodValue = payload[0].value;
    if (!moodValue) return null;
    return (
      <div className="bg-white/80 backdrop-blur-sm p-2 border border-gray-200 rounded-lg shadow-sm">
        <p className="label">{`Data: ${label}`}</p>
        <p className="intro">{`Humor: ${valueToMood(moodValue)}`}</p>
      </div>
    );
  }
  return null;
};

const MoodChart: React.FC<{ data: MoodLog[] }> = ({ data }) => {
    const last7Days = getLast7Days();
    const moodDataMap = new Map(data.map(log => [log.date, log]));

    const chartData = last7Days.map(date => {
        const log = moodDataMap.get(date);
        return {
            name: new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            humor: log ? moodToValue(log.mood) : null
        };
    });
    return (
        <div className="h-64 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <h3 className="font-poppins font-bold mb-4 text-gray-700 dark:text-gray-200">Humor (Últimos 7 dias)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]} tickFormatter={(v) => ['😥','😟','😐','🙂','😄'][v-1]} stroke="#6b7280"/>
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="humor" stroke="#A499F8" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} connectNulls />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const SleepChart: React.FC<{ data: SleepLog[] }> = ({ data }) => {
    const last7Days = getLast7Days();
    const logsFromLast7Days = data.filter(log => last7Days.includes(log.date));

    const qualityCounts = logsFromLast7Days.reduce((acc, log) => {
        acc[log.quality] = (acc[log.quality] || 0) + 1;
        return acc;
    }, {} as Record<SleepLog['quality'], number>);
    
    const chartData = Object.entries(qualityCounts).map(([name, value]) => ({ name, value }));
    const COLORS = { 'ótima': '#4DD0AE', 'boa': '#A499F8', 'regular': '#FDE68A', 'ruim': '#FECACA' };

    return (
         <div className="h-64 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <h3 className="font-poppins font-bold mb-4 text-gray-700 dark:text-gray-200">Qualidade do Sono (Últimos 7 dias)</h3>
            <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                         {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as SleepLog['quality']]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

const MoodLogModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addMoodLog } = useAppContext();
    const [mood, setMood] = useState<MoodLog['mood']>('🙂');
    const [text, setText] = useState('');
    const [energy, setEnergy] = useState(3);

    const handleSave = () => {
        addMoodLog({ mood, text, energy });
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <h2 className="font-poppins text-xl font-bold text-center">Como você está se sentindo?</h2>
            <div className="flex justify-around my-6">
                {(['😄', '🙂', '😐', '😟', '😥'] as MoodLog['mood'][]).map(m => (
                    <button key={m} onClick={() => setMood(m)} className={`text-4xl transform transition-transform hover:scale-125 ${mood === m ? 'scale-125' : 'opacity-50'}`}>{m}</button>
                ))}
            </div>
            <textarea placeholder="Escreva mais sobre seu dia..." value={text} onChange={e => setText(e.target.value)} className="w-full h-24 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
            <div className="my-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nível de Energia (1-5)</label>
                <input type="range" min="1" max="5" value={energy} onChange={e => setEnergy(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
            <button onClick={handleSave} className="mt-4 w-full py-2 bg-lilac-light text-white font-bold rounded-lg">Salvar</button>
        </Modal>
    );
};

const SleepLogModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addSleepLog } = useAppContext();
    const [quality, setQuality] = useState<SleepLog['quality']>('boa');
    const [hours, setHours] = useState<number | ''>('');

    const handleSave = () => {
        if (typeof hours === 'number' && hours > 0) {
            addSleepLog({ quality, hours });
            onClose();
        }
    };

    return (
         <Modal isOpen={true} onClose={onClose}>
            <h2 className="font-poppins text-xl font-bold text-center">Como foi sua noite?</h2>
             <div className="flex justify-around my-6">
                {(['ótima', 'boa', 'regular', 'ruim'] as SleepLog['quality'][]).map(q => (
                    <button key={q} onClick={() => setQuality(q)} className={`px-3 py-1 border rounded-full ${quality === q ? 'bg-lilac-light text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{q}</button>
                ))}
            </div>
            <input type="number" placeholder="Horas de sono (ex: 7.5)" value={hours} onChange={e => setHours(parseFloat(e.target.value))} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            <button onClick={handleSave} className="mt-4 w-full py-2 bg-calm-green text-white font-bold rounded-lg">Salvar</button>
         </Modal>
    );
};


const MoodSleepScreen: React.FC = () => {
    const { userData } = useAppContext();
    const [isMoodModalOpen, setMoodModalOpen] = useState(false);
    const [isSleepModalOpen, setSleepModalOpen] = useState(false);
    
    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

    return (
        <div className="p-4 space-y-6">
            <div>
                 <h1 className="font-poppins text-2xl font-bold text-gray-800 dark:text-white">Seu Diário</h1>
                 <p className="text-gray-500 dark:text-gray-400">{formattedDate}</p>
            </div>
            
             <div className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-lilac">Rilane diz:</span> "Hoje é um bom dia para cuidar de você 🌿"
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MoodChart data={userData.moods} />
                <SleepChart data={userData.sleepLogs} />
            </div>

            <div className="flex gap-4">
                <button onClick={() => setMoodModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-lilac-light text-white font-bold rounded-xl shadow-lg hover:opacity-90">
                    <Smile size={20} /> Registrar Emoção
                </button>
                 <button onClick={() => setSleepModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-calm-green text-white font-bold rounded-xl shadow-lg hover:opacity-90">
                    <BedDouble size={20} /> Registrar Sono
                </button>
            </div>

             <div className="space-y-4">
                <h3 className="font-poppins text-xl font-bold text-gray-700 dark:text-gray-200">Últimos Registros</h3>
                 {userData.moods.slice(-2).reverse().map(log => (
                    <div key={log.date} className="flex items-center gap-4 p-3 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-xl">
                        <MoodIcon mood={log.mood} />
                        <div>
                            <p className="font-bold text-sm text-gray-700 dark:text-gray-200">{new Date(log.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic">"{log.text}"</p>
                        </div>
                    </div>
                 ))}
             </div>
             
             {isMoodModalOpen && <MoodLogModal onClose={() => setMoodModalOpen(false)} />}
             {/* FIX: Corrected typo from SleepModal to SleepLogModal */}
             {isSleepModalOpen && <SleepLogModal onClose={() => setSleepModalOpen(false)} />}
        </div>
    );
};

export default MoodSleepScreen;
