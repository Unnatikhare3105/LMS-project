import {
  IUser, ISyllabus, IQuiz, IBookmark,
  IDailyChallenge, ILeaderboardEntry,
} from '@/src/types';

export const mockUser: IUser = {
  publicId: 'usr-001',
  name: 'Unnati Sharma',
  email: 'unnati@example.com',
  role: 'student',
  accountVerified: true,
  streak: { current: 12, longest: 45, lastActivityDate: new Date().toISOString() },
  totalQuizzesTaken: 34,
  totalTopicsSearched: 21,
  activityLog: Array.from({ length: 200 }, (_, i) => ({
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    count: Math.random() > 0.55 ? Math.ceil(Math.random() * 5) : 0,
  })).filter((a) => a.count > 0),
};

export const mockTopics: ISyllabus[] = [
  {
    publicId: 'syl-001',
    topic: 'React Hooks',
    content: `## Overview\nHooks are functions that let you "hook into" React state and lifecycle features from function components.\n\n## Key Concepts\n- **useState** – Local state management\n- **useEffect** – Side effects & lifecycle\n- **useContext** – Consume context values\n- **useReducer** – Complex state logic\n- **useMemo / useCallback** – Performance optimisation\n\n## Detailed Explanation\nuseEffect runs after every render by default. Pass a dependency array to control when it fires. Return a cleanup function to handle subscriptions and timers.\n\n\`\`\`js\nuseEffect(() => {\n  const sub = subscribe(id);\n  return () => sub.unsubscribe();\n}, [id]);\n\`\`\`\n\n## Common Use Cases\n- Data fetching on component mount\n- Subscribing to WebSocket / events\n- Syncing state with localStorage\n\n## Quick Summary\nHooks let you reuse stateful logic across components without changing component hierarchy.`,
    videoLinks: [
      { title: 'React Hooks Crash Course 2024', videoId: 'TNhaISOUy6Q', url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q', thumbnail: 'https://img.youtube.com/vi/TNhaISOUy6Q/mqdefault.jpg' },
      { title: 'useState & useEffect Deep Dive', videoId: 'O6P86uwfdR0', url: 'https://www.youtube.com/watch?v=O6P86uwfdR0', thumbnail: 'https://img.youtube.com/vi/O6P86uwfdR0/mqdefault.jpg' },
    ],
    contentType: 'text',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    publicId: 'syl-002',
    topic: 'Binary Trees',
    content: `## Overview\nA binary tree is a hierarchical data structure where each node has at most two children.\n\n## Key Concepts\n- Root, leaf, and internal nodes\n- Depth and height\n- Balanced vs unbalanced trees\n\n## Traversals\n- **Inorder** (left → root → right) → sorted output for BST\n- **Preorder** (root → left → right) → tree copy\n- **Postorder** (left → right → root) → tree deletion`,
    videoLinks: [],
    contentType: 'text',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    publicId: 'syl-003',
    topic: 'SQL Joins',
    content: `## Overview\nSQL joins combine rows from two or more tables based on a related column.\n\n## Types\n- **INNER JOIN** – matching rows in both tables\n- **LEFT JOIN** – all rows from left + matching from right\n- **RIGHT JOIN** – all rows from right + matching from left\n- **FULL OUTER JOIN** – all rows when there's a match in either`,
    videoLinks: [],
    contentType: 'text',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

export const mockQuizzes: IQuiz[] = [
  {
    publicId: 'quiz-001',
    topic: 'React Hooks',
    difficulty: 'intermediate',
    totalQuestions: 5,
    score: 4,
    timeTakenSeconds: 142,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    questions: [
      {
        question: 'Which hook is used to perform side effects in a React function component?',
        options: ['A. useState', 'B. useEffect', 'C. useContext', 'D. useReducer'],
        answer: 'B',
        explanation: 'useEffect is designed for side effects like data fetching, subscriptions, or manually changing the DOM.',
      },
      {
        question: 'What does the dependency array in useEffect control?',
        options: ['A. The number of renders', 'B. When the effect runs', 'C. Component state', 'D. Props updates'],
        answer: 'B',
        explanation: 'The dependency array tells React when to re-run the effect — only when listed values change.',
      },
      {
        question: 'Which hook replaces componentDidMount, componentDidUpdate, and componentWillUnmount?',
        options: ['A. useState', 'B. useRef', 'C. useEffect', 'D. useMemo'],
        answer: 'C',
        explanation: 'useEffect can replicate all three lifecycle methods depending on its configuration.',
      },
      {
        question: 'What is the correct way to declare state in a function component?',
        options: ['A. this.state = {}', 'B. const state = useReducer()', 'C. const [count, setCount] = useState(0)', 'D. setState({})'],
        answer: 'C',
        explanation: 'useState returns a tuple of the current state value and a setter function.',
      },
      {
        question: 'Which hook is used to memoize a function reference?',
        options: ['A. useMemo', 'B. useCallback', 'C. useRef', 'D. useEffect'],
        answer: 'B',
        explanation: 'useCallback memoizes a callback function so it doesn\'t get recreated on every render.',
      },
    ],
  },
  {
    publicId: 'quiz-002',
    topic: 'Binary Trees',
    difficulty: 'beginner',
    totalQuestions: 5,
    score: 3,
    timeTakenSeconds: 210,
    completedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    questions: [],
  },
  {
    publicId: 'quiz-003',
    topic: 'System Design',
    difficulty: 'advanced',
    totalQuestions: 10,
    score: null,
    timeTakenSeconds: null,
    completedAt: null,
    createdAt: new Date().toISOString(),
    questions: [
      {
        question: 'Which consistency model does DynamoDB primarily follow?',
        options: ['A. Strong consistency', 'B. Eventual consistency', 'C. Linearizability', 'D. Causal consistency'],
        answer: 'B',
        explanation: 'DynamoDB defaults to eventual consistency, though strong consistency reads are available at extra cost.',
      },
      {
        question: 'What does the CAP theorem state?',
        options: [
          'A. A system can be consistent, available, and partition-tolerant simultaneously',
          'B. A distributed system can only guarantee two of: consistency, availability, partition tolerance',
          'C. Consistency always beats availability in distributed systems',
          'D. Partition tolerance is optional in modern systems',
        ],
        answer: 'B',
        explanation: 'CAP theorem (Brewer\'s theorem) states that in a distributed system, you can only guarantee two of the three properties at any time.',
      },
    ],
  },
];

export const mockBookmarks: IBookmark[] = [
  { publicId: 'bm-001', topic: 'React Hooks', note: 'Revise useEffect cleanup pattern', contentType: 'text', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { publicId: 'bm-002', topic: 'Binary Trees', note: 'Practice inorder traversal', contentType: 'video', createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { publicId: 'bm-003', topic: 'SQL Joins', note: 'Remember LEFT JOIN null behavior', contentType: 'text', createdAt: new Date(Date.now() - 6 * 86400000).toISOString() },
  { publicId: 'bm-004', topic: 'System Design Basics', note: 'CAP theorem and its trade-offs', contentType: 'text', createdAt: new Date(Date.now() - 8 * 86400000).toISOString() },
];

export const mockLeaderboard: ILeaderboardEntry[] = [
  { userId: 'u1', name: 'Priya Sharma', totalScore: 2840, quizCount: 18, avgScore: 85, bestScore: 100 },
  { userId: 'u2', name: 'Arjun Mehta', totalScore: 2320, quizCount: 15, avgScore: 78, bestScore: 95 },
  { userId: 'u3', name: 'Sneha Patel', totalScore: 2010, quizCount: 14, avgScore: 76, bestScore: 90 },
  { userId: 'u4', name: 'Rahul Gupta', totalScore: 1700, quizCount: 12, avgScore: 71, bestScore: 85 },
  { userId: 'u5', name: 'Aisha Khan', totalScore: 1540, quizCount: 11, avgScore: 70, bestScore: 80 },
  { userId: 'u6', name: 'Dev Patel', totalScore: 1200, quizCount: 9, avgScore: 67, bestScore: 75 },
  { userId: 'usr-001', name: 'Unnati Sharma', totalScore: 1080, quizCount: 8, avgScore: 68, bestScore: 80, isCurrentUser: true },
  { userId: 'u8', name: 'Ravi Verma', totalScore: 940, quizCount: 7, avgScore: 65, bestScore: 70 },
];

export const mockDailyChallenge: IDailyChallenge = {
  publicId: 'dc-001',
  date: new Date().toISOString().split('T')[0],
  topic: 'The Human Digestive System',
  totalQuestions: 5,
  questions: [
    {
      question: 'Where does most chemical digestion occur in the human body?',
      options: ['A. Stomach', 'B. Small intestine', 'C. Large intestine', 'D. Mouth'],
      answer: 'B',
      explanation: 'The small intestine is the primary site of chemical digestion and nutrient absorption, aided by bile and pancreatic enzymes.',
    },
    {
      question: 'What enzyme breaks down starch in the mouth?',
      options: ['A. Pepsin', 'B. Lipase', 'C. Amylase', 'D. Trypsin'],
      answer: 'C',
      explanation: 'Salivary amylase (ptyalin) begins carbohydrate digestion in the mouth by breaking starch into maltose.',
    },
    {
      question: 'Which organ produces bile?',
      options: ['A. Pancreas', 'B. Gallbladder', 'C. Liver', 'D. Stomach'],
      answer: 'C',
      explanation: 'The liver produces bile, which is stored in the gallbladder and released into the small intestine to emulsify fats.',
    },
    {
      question: 'What is the role of villi in the small intestine?',
      options: ['A. Produce digestive enzymes', 'B. Increase surface area for absorption', 'C. Store nutrients', 'D. Filter bacteria'],
      answer: 'B',
      explanation: 'Villi are tiny finger-like projections that dramatically increase the surface area of the small intestine, maximizing nutrient absorption.',
    },
    {
      question: 'Which part of the digestive system absorbs most water?',
      options: ['A. Small intestine', 'B. Stomach', 'C. Large intestine', 'D. Esophagus'],
      answer: 'C',
      explanation: 'The large intestine (colon) absorbs most of the remaining water from indigestible food matter before it is excreted.',
    },
  ],
};