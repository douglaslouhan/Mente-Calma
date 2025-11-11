import React, { useState, useMemo } from 'react';
import { useAppContext } from '../App';
import { Habito } from '../types';
import { Plus, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from './Modal';

const importanciaColors: Record<Habito['importancia'], { bg: string, text: string, border: string }> = {
    'Importante': { bg: 'bg-importance-high/20', text: 'text-importance-high', border: 'border-importance-high' },
    'Moderada': { bg: 'bg-importance-medium/20', text: 'text-importance-medium', border: 'border-importance-medium' },
    'Leve': { bg: 'bg-importance-low/20', text: 'text-importance-low', border: 'border-importance-low' }
};

const TaskItem: React.FC<{ habito: Habito; onUpdate: (id: string, newStatus: Habito['status']) => void; onEdit: () => void; onDelete: () => void; }> = ({ habito, onUpdate, onEdit, onDelete }) => {
    const color = importanciaColors[habito.importancia];
    const isCompleted = habito.status === 'completed';

    const handleCheck = () => {
        const newStatus = isCompleted ? 'todo' : 'completed';
        onUpdate(habito.id, newStatus);
    }

    return (
        <div className={`${color.bg} p-3 rounded-lg flex items-start gap-3`}>
            <input 
                id={habito.id}
                type="checkbox"
                checked={isCompleted}
                onChange={handleCheck}
                className={`mt-1 h-5 w-5 rounded-md border-gray-300 focus:ring-2 appearance-none checked:bg-lilac border-2 ${color.border}`}
            />
            <div className="flex-1">
                 <label 
                    htmlFor={habito.id}
                    className={`font-medium ${color.text} ${isCompleted ? 'line-through opacity-60' : ''}`}
                >
                    {habito.title}
                </label>
                {habito.description && <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isCompleted ? 'line-through' : ''}`}>{habito.description}</p>}
            </div>

            <div className="flex items-center gap-2">
                <button onClick={onEdit} className="text-gray-500 hover:text-blue-500"><Edit size={16} /></button>
                <button onClick={onDelete} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
        </div>
    )
};

const TaskModal: React.FC<{ onClose: () => void; taskToEdit?: Habito | null }> = ({ onClose, taskToEdit }) => {
    const { addHabito, updateHabitoDetails } = useAppContext();
    const [title, setTitle] = useState(taskToEdit?.title || '');
    const [description, setDescription] = useState(taskToEdit?.description || '');
    const [importancia, setImportancia] = useState<Habito['importancia']>(taskToEdit?.importancia || 'Moderada');

    const handleSave = () => {
        if (!title.trim()) return;

        const taskData = {
            title,
            description,
            importancia,
        };

        if (taskToEdit) {
            updateHabitoDetails({ ...taskToEdit, ...taskData });
        } else {
            addHabito(taskData);
        }
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <h2 className="font-poppins text-xl font-bold text-center">{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
            <div className="my-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            </div>
             <div className="my-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição (Opcional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" rows={3}></textarea>
            </div>
            <div className="my-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Importância</label>
                <div className="flex justify-around mt-2">
                    {(['Importante', 'Moderada', 'Leve'] as Habito['importancia'][]).map(level => (
                        <button key={level} onClick={() => setImportancia(level)} className={`px-3 py-1 border rounded-full ${importancia === level ? 'bg-lilac-light text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{level}</button>
                    ))}
                </div>
            </div>
            <button onClick={handleSave} className="mt-6 w-full py-2 bg-lilac text-white font-bold rounded-lg">{taskToEdit ? 'Salvar Alterações' : 'Adicionar Tarefa'}</button>
        </Modal>
    );
};

const TaskSection: React.FC<{ title: string; tasks: Habito[]; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, tasks, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    if (tasks.length === 0) return null;

    return (
        <section>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-2">
                <h2 className="font-poppins font-bold text-lg text-gray-700 dark:text-gray-300">{title} ({tasks.length})</h2>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            {isOpen && <div className="space-y-2 mt-2">{children}</div>}
        </section>
    );
};

const TasksScreen: React.FC = () => {
    const { userData, updateHabitoStatus, deleteHabito } = useAppContext();
    const [isModalOpen, setModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Habito | null>(null);

    const handleEdit = (habito: Habito) => {
        setTaskToEdit(habito);
        setModalOpen(true);
    };

    const handleAddNew = () => {
        setTaskToEdit(null);
        setModalOpen(true);
    };
    
    const { tarefasDoDia, tarefasPendentes, tarefasConcluidas } = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const doDia = userData.habitos.filter(h => h.status === 'todo' && h.dueDate === todayStr);
        const pendentes = userData.habitos.filter(h => h.status === 'pending');
        const concluidas = userData.habitos.filter(h => h.status === 'completed');
        return { tarefasDoDia: doDia, tarefasPendentes: pendentes, tarefasConcluidas: concluidas };
    }, [userData.habitos]);

    const completedCount = tarefasConcluidas.length;
    let rilaneMessage = "Cada pequena tarefa completa é uma grande vitória para sua calma. Continue assim!";
    if (completedCount === 0 && tarefasDoDia.length > 0) {
        rilaneMessage = "Qual pequena tarefa você pode completar agora para se sentir bem? Comece com uma!";
    } else if (completedCount > 0 && (tarefasDoDia.length + tarefasPendentes.length) === 0) {
        rilaneMessage = "Incrível! Você completou todas as suas tarefas hoje. Celebre essa conquista!";
    }
    
    return (
        <div className="p-4 space-y-6">
            <div>
                 <h1 className="font-poppins text-2xl font-bold text-center text-gray-800 dark:text-white">Seus Hábitos Diários</h1>
                 <p className="text-center text-gray-500 dark:text-gray-400 mt-1">Pequenos passos, grandes mudanças.</p>
            </div>
            
            <div className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-lilac">Rilane diz:</span> "{rilaneMessage}"
                </p>
            </div>
            
            <div className="space-y-4">
                <TaskSection title="Tarefas Pendentes" tasks={tarefasPendentes}>
                    {tarefasPendentes.map(h => <TaskItem key={h.id} habito={h} onUpdate={updateHabitoStatus} onEdit={() => handleEdit(h)} onDelete={() => deleteHabito(h.id)} />)}
                </TaskSection>
                <TaskSection title="Tarefas do Dia" tasks={tarefasDoDia}>
                    {tarefasDoDia.map(h => <TaskItem key={h.id} habito={h} onUpdate={updateHabitoStatus} onEdit={() => handleEdit(h)} onDelete={() => deleteHabito(h.id)} />)}
                </TaskSection>
                <TaskSection title="Concluídas" tasks={tarefasConcluidas} defaultOpen={false}>
                    {tarefasConcluidas.map(h => <TaskItem key={h.id} habito={h} onUpdate={updateHabitoStatus} onEdit={() => handleEdit(h)} onDelete={() => deleteHabito(h.id)} />)}
                </TaskSection>
            </div>

            <button onClick={handleAddNew} className="w-full flex items-center justify-center gap-2 py-3 bg-lilac text-white font-bold rounded-xl shadow-lg hover:opacity-90">
                <Plus size={20} />
                Adicionar Nova Tarefa
            </button>
            {isModalOpen && <TaskModal onClose={() => setModalOpen(false)} taskToEdit={taskToEdit} />}
        </div>
    );
};

export default TasksScreen;