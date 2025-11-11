import { Guide, Habito, Badge } from './types';

export const GUIDES_DATA: Guide[] = [
  {
    id: 1,
    titulo: "Resiliência Emocional",
    descricao: "Fortaleça sua mente para enfrentar desafios e manter o equilíbrio em tempos de crise.",
    pdfUrl: "https://drive.google.com/file/d/1iqbfGr-y2mp0ltCiQwl_JTGsH5uHaU7a/preview",
    mockupUrl: "https://drive.google.com/thumbnail?id=13wpSMKYmIrpaQc0j5pivAFc2pZ72yWYY",
    dayUnlock: 1
  },
  {
    id: 2,
    titulo: "Planner Mente & Calma – 7 Dias para Dominar a Ansiedade",
    descricao: "Um plano prático de 7 dias para organizar sua mente, criar rotinas saudáveis e conquistar serenidade.",
    pdfUrl: "https://drive.google.com/file/d/1McF7-quED96at4fKnhWlOq5DuZbz_bjO/preview",
    mockupUrl: "https://drive.google.com/thumbnail?id=1KmE-KRDiQ7Ac5sgNjmvkto-Mhyf8dw-c",
    dayUnlock: 2
  },
  {
    id: 3,
    titulo: "Respiração Consciente: Domine a Ansiedade",
    descricao: "Descubra o poder da respiração como ferramenta para equilibrar corpo e mente.",
    pdfUrl: "https://drive.google.com/file/d/1tZEpKrE4hqrlrxfmokBf6MEIDGQzzbe3/preview",
    mockupUrl: "https://drive.google.com/thumbnail?id=1uPZtJMwG3x2OmoH4WpDVHmSaNLnD9fuZ",
    dayUnlock: 3
  },
  {
    id: 4,
    titulo: "Desafio 7 Dias: Reduza a Ansiedade e Transforme Sua Vida",
    descricao: "Um passo a passo leve e transformador para cultivar calma e foco em apenas uma semana.",
    pdfUrl: "https://drive.google.com/file/d/18h5zx42WVgpv7UPNmQQ6_DgX9oQl__a7/preview",
    mockupUrl: "https://drive.google.com/thumbnail?id=1ajwu0UAK4ifxBz6MY8uFAKL-jDuNcy1Z",
    dayUnlock: 4
  },
  {
    id: 5,
    titulo: "Desafio 7 Dias: Hábitos Anti-Ansiedade",
    descricao: "Desenvolva hábitos simples e eficazes para manter sua mente em estado de paz.",
    pdfUrl: "https://drive.google.com/file/d/1hD4b4m_-gc8VnjIAUkDRnw32b5XH-IIN/preview",
    mockupUrl: "https://drive.google.com/thumbnail?id=1TAh8Vt7ylECKrPLMyLeoprEf-y0lVKtl",
    dayUnlock: 5
  },
  {
    id: 6,
    titulo: "Diário da Calma: Autoconhecimento e Controle Emocional",
    descricao: "Registre emoções, compreenda padrões e fortaleça seu autocontrole emocional.",
    pdfUrl: "https://drive.google.com/file/d/1WsHS6wnHFFhhcNeiRGOyychYnUN80xDQ/preview",
    mockupUrl: "https://drive.google.com/thumbnail?id=1kfu6eWCoQthZnVDDS1wqBqKymljDuhE0",
    dayUnlock: 6
  },
  {
    id: 7,
    titulo: "Método 3XR: Reconheça. Reprograme. Respire.",
    descricao: "Um método prático baseado em psicologia e neurociência para transformar sua relação com a ansiedade.",
    pdfUrl: "https://drive.google.com/file/d/1Q_-u-BtDhSgWtA-KyOTdb2Qp7mAcP5go/preview",
    mockupUrl: "https://drive.google.com/thumbnail?id=1FRaNWce78GiaNMA77wDgzYkwelaRz6eX",
    isUnlocked: true,
    isPremium: true
  }
];


// FIX: Replaced outdated HABITOS_DATA with a version that matches the Habito type definition.
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const dayBeforeYesterday = new Date(today);
dayBeforeYesterday.setDate(today.getDate() - 2);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const HABITOS_DATA: Habito[] = [
    { id: 'h1', title: '5 minutos de meditação', description: 'Usar o app de meditação guiada.', status: 'todo', importancia: 'Importante', createdAt: formatDate(today), dueDate: formatDate(today) },
    { id: 'h2', title: 'Escrever 3 gratidões', description: 'Anotar no diário físico.', status: 'completed', importancia: 'Moderada', createdAt: formatDate(today), dueDate: formatDate(today) },
    { id: 'h3', title: 'Caminhada leve de 15 minutos', description: 'Sair para uma volta no parque.', status: 'todo', importancia: 'Moderada', createdAt: formatDate(today), dueDate: formatDate(today) },
    { id: 'h4', title: 'Beber 2L de água', description: 'Manter a garrafa por perto.', status: 'pending', importancia: 'Leve', createdAt: formatDate(yesterday), dueDate: formatDate(yesterday) },
    { id: 'h5', title: 'Evitar telas 1h antes de dormir', description: 'Ler um livro ao invés disso.', status: 'pending', importancia: 'Importante', createdAt: formatDate(dayBeforeYesterday), dueDate: formatDate(dayBeforeYesterday) },
    { id: 'h6', title: 'Organizar a agenda de amanhã', description: '', status: 'completed', importancia: 'Moderada', createdAt: formatDate(yesterday), dueDate: formatDate(yesterday) },
];


export const BADGES_DATA: Badge[] = [
    {
        id: 'primeiros_passos',
        name: 'Primeiros Passos',
        description: 'Você completou sua primeira atividade. O caminho para a calma começou!',
        icon: '👣',
    },
    {
        id: 'conversa_amiga',
        name: 'Conversa Amiga',
        description: 'Você iniciou sua primeira conversa com a Rilane. Acolhimento é poder.',
        icon: '💬',
    },
    {
        id: 'diario_emocional',
        name: 'Diário Emocional',
        description: 'Você fez seu primeiro registro de humor. Conhecer-se é o primeiro passo.',
        icon: '📝',
    }
];


export const GAMIFICATION_POINTS = {
    MOOD_LOG: 10,
    SLEEP_LOG: 10,
    GUIDE_COMPLETE: 50,
    CHAT_MESSAGE: 5,
};