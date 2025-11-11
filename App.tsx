import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserData, Assinatura, Habito, MoodLog, SleepLog } from './types';
import RilaneChat from './components/RilaneChat';
import GuidesScreen from './components/GuidesScreen';
import MoodSleepScreen from './components/MoodSleepScreen';
import TasksScreen from './components/TasksScreen';
import CommunityScreen from './components/CommunityScreen';
import BottomNav from './components/BottomNav';
import { GAMIFICATION_POINTS, HABITOS_DATA, GUIDES_DATA } from './constants';
import SplashScreen from './components/SplashScreen';
import FloatingParticles from './components/FloatingParticles';
import Header from './components/Header';
import { Lock, Mail } from 'lucide-react';
import FloatingChatButton from './components/FloatingChatButton';
import Toast from './components/Toast';
import PremiumChatScreen from './components/PremiumChatScreen';
import { auth } from './services/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';

// --- INITIAL MOCK USER ---
const initialUserData: UserData = {
  profile: {
    name: "Maria",
    email: "teste@example.com",
    createdAt: new Date(),
  },
  guidesUnlocked: ['ob1'],
  completedGuides: [],
  entitlements: {
    detox21: true,
    codigoMental: false,
  },
  moods: [
    { date: '2024-07-21', mood: '🙂', text: 'Dia produtivo', energy: 4 },
    { date: '2024-07-22', mood: '😐', text: 'Um pouco cansada', energy: 3 },
    { date: '2024-07-23', mood: '😟', text: 'Reunião estressante', energy: 2 },
    { date: '2024-07-24', mood: '🙂', text: 'Consegui relaxar', energy: 4 },
    { date: '2024-07-25', mood: '😄', text: 'Ótima notícia!', energy: 5 },
  ],
  sleepLogs: [
    { date: '2024-07-24', quality: 'boa', hours: 8 },
    { date: '2024-07-25', quality: 'ótima', hours: 7.5 },
  ],
  assinatura: Assinatura.PREMIUM,
  habitos: HABITOS_DATA,
  gameficadoUser: true,
  nextUnlockDate: new Date(new Date().setDate(new Date().getDate() - 1)),
  favoriteAudios: [],
  gamification: {
    points: 120,
    level: 2,
    badges: ['conversa_amiga'],
  },
  progresso: 1,
};

type GamificationAction = keyof typeof GAMIFICATION_POINTS;
const formatDate = (date: Date) => date.toISOString().split('T')[0];

interface AppContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  addPoints: (action: GamificationAction) => void;
  updateHabitoStatus: (id: string, newStatus: Habito['status']) => void;
  addHabito: (habito: Omit<Habito, 'id' | 'status' | 'createdAt' | 'dueDate'>) => void;
  updateHabitoDetails: (habito: Habito) => void;
  deleteHabito: (id: string) => void;
  addMoodLog: (moodLog: Omit<MoodLog, 'date'>) => void;
  addSleepLog: (sleepLog: Omit<SleepLog, 'date'>) => void;
  notification: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

// --- PROVIDER ---
const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  // Unlock new guide daily
  useEffect(() => {
    const checkAndUnlockGuide = () => {
      const now = new Date();
      if (userData.nextUnlockDate && now >= new Date(userData.nextUnlockDate)) {
        const totalGuides = GUIDES_DATA.filter(g => g.dayUnlock).length;
        const nextProgresso = userData.progresso + 1;
        if (nextProgresso <= totalGuides) {
          const nextUnlockDate = new Date();
          nextUnlockDate.setDate(now.getDate() + 1);
          setUserData(prev => ({
            ...prev,
            progresso: nextProgresso,
            nextUnlockDate: nextUnlockDate,
          }));
          showNotification("Um novo guia foi desbloqueado para você 🌿");
        }
      }
    };
    checkAndUnlockGuide();
  }, []);

  // Check for pending tasks
  useEffect(() => {
    const todayStr = formatDate(new Date());
    const updatedHabitos = userData.habitos.map(habito => {
      if (habito.status !== 'completed' && habito.dueDate < todayStr) {
        return { ...habito, status: 'pending' as Habito['status'] };
      }
      return habito;
    });
    if (JSON.stringify(updatedHabitos) !== JSON.stringify(userData.habitos)) {
      setUserData(prev => ({ ...prev, habitos: updatedHabitos }));
    }
  }, []);

  const addPoints = (action: GamificationAction) => {
    if (!userData.gameficadoUser) return;
    const pointsToAdd = GAMIFICATION_POINTS[action];
    if (!pointsToAdd) return;
    setUserData(prev => ({
      ...prev,
      gamification: {
        ...prev.gamification,
        points: prev.gamification.points + pointsToAdd,
      },
    }));
  };

  const updateHabitoStatus = (id: string, newStatus: Habito['status']) => {
    setUserData(prev => ({
      ...prev,
      habitos: prev.habitos.map(h => h.id === id ? { ...h, status: newStatus } : h),
    }));
  };

  const addHabito = (habito: Omit<Habito, 'id' | 'status' | 'createdAt' | 'dueDate'>) => {
    const todayStr = formatDate(new Date());
    const newHabito: Habito = {
      ...habito,
      id: `h${Date.now()}`,
      status: 'todo',
      createdAt: todayStr,
      dueDate: todayStr,
    };
    setUserData(prev => ({
      ...prev,
      habitos: [...prev.habitos, newHabito],
    }));
  };

  const updateHabitoDetails = (habitoToUpdate: Habito) => {
    setUserData(prev => ({
      ...prev,
      habitos: prev.habitos.map(h => h.id === habitoToUpdate.id ? habitoToUpdate : h),
    }));
  };

  const deleteHabito = (id: string) => {
    setUserData(prev => ({
      ...prev,
      habitos: prev.habitos.filter(h => h.id !== id),
    }));
  };

  const addMoodLog = (moodLog: Omit<MoodLog, 'date'>) => {
    const newLog: MoodLog = { ...moodLog, date: new Date().toISOString().split('T')[0] };
    setUserData(prev => ({
      ...prev,
      moods: [...prev.moods, newLog],
    }));
    addPoints('MOOD_LOG');
  };

  const addSleepLog = (sleepLog: Omit<SleepLog, 'date'>) => {
    const newLog: SleepLog = { ...sleepLog, date: new Date().toISOString().split('T')[0] };
    setUserData(prev => ({
      ...prev,
      sleepLogs: [...prev.sleepLogs, newLog],
    }));
    addPoints('SLEEP_LOG');
  };

  const value = { userData, setUserData, addPoints, updateHabitoStatus, addHabito, updateHabitoDetails, deleteHabito, addMoodLog, addSleepLog, notification };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- MAIN APP CONTENT ---
const AppContent = () => {
  const location = useLocation();
  const { notification } = useAppContext();
  const isChatScreen = location.pathname === '/';

  return (
    <div className="relative min-h-screen">
      <FloatingParticles />
      {notification && <Toast message={notification} />}
      {!isChatScreen && <Header />}
      <main className={`min-h-screen ${!isChatScreen ? 'pt-20' : ''} pb-24`}>
        <Routes>
          <Route path="/" element={<RilaneChat />} />
          <Route path="/guias" element={<GuidesScreen />} />
          <Route path="/diario" element={<MoodSleepScreen />} />
          <Route path="/tarefas" element={<TasksScreen />} />
          <Route path="/comunidade" element={<CommunityScreen />} />
          <Route path="/premium-chat" element={<PremiumChatScreen />} />
        </Routes>
      </main>
      {!isChatScreen && <FloatingChatButton />}
      <BottomNav />
    </div>
  );
};

// --- LOGIN SCREEN ---
const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuthAction = async () => {
    if (!email || !password) {
        setError('Por favor, preencha todos os campos.');
        return;
    }
    setLoading(true);
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ Usuário criado com sucesso');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Login realizado com sucesso');
      }
    } catch (err: any) {
      console.error(`Erro na ${isRegistering ? 'criação de conta' : 'autenticação'}:`, err.code);
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Email ou senha incorretos.');
          break;
        case 'auth/email-already-in-use':
          setError('Este email já está em uso. Tente fazer login.');
          break;
        case 'auth/weak-password':
          setError('A senha deve ter pelo menos 6 caracteres.');
          break;
        case 'auth/invalid-email':
          setError('O formato do email é inválido.');
          break;
        default:
          setError('Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in-login">
      <FloatingParticles />
      <div className="w-full max-w-sm text-center">
        <img
          src="https://drive.google.com/thumbnail?id=1ZMEjX-3UUtiX9C2ZiFt2V20oaPQQUZ6m"
          alt="Mente & Calma"
          className="mx-auto w-[120px] rounded-xl mb-5 shadow-lg"
        />
        <h1 className="font-poppins text-2xl font-bold text-calm-purple mb-2">
            {isRegistering ? 'Crie Sua Conta' : 'Bem-vinda de Volta!'}
        </h1>
        <p className="text-gray-500 font-medium mb-8">
          Seu espaço de calma começa aqui 🌿
        </p>

        <form onSubmit={(e) => { e.preventDefault(); handleAuthAction(); }} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-lilac focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-lilac focus:outline-none"
              required
            />
          </div>
        
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-8 py-3 font-bold rounded-lg shadow-lg transition-colors ${
              loading ? 'bg-purple-300 cursor-not-allowed' : 'bg-lilac text-white hover:bg-brand-lilac'
            }`}
          >
            {loading ? (isRegistering ? 'Criando...' : 'Entrando...') : (isRegistering ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
          <button
            onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
            }}
            className="font-bold text-lilac ml-1 hover:underline focus:outline-none"
          >
            {isRegistering ? 'Faça login' : 'Cadastre-se'}
          </button>
        </p>
      </div>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Listen for authentication state changes using v9+ modular syntax
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user); // Set true if user exists, false otherwise
      setLoading(false); // Stop loading once we know the auth state
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  if (loading) return <SplashScreen />;

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;