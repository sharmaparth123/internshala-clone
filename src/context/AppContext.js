import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

// TODO: Replace localStorage with actual API calls once backend is deployed
function getStore(key, def) {
  try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; }
}
function setStore(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
];

export const TRANSLATIONS = {
  en: { home: 'Home', internships: 'Internships', jobs: 'Jobs', courses: 'Courses', login: 'Login', register: 'Register', dashboard: 'Dashboard', profile: 'Profile', search: 'Search', apply: 'Apply Now', welcome: 'Find your dream internship', subtitle: 'Explore thousands of internships from top companies', publicSpace: 'Public Space', subscription: 'Subscription', resumeBuilder: 'Resume Builder' },
  es: { home: 'Inicio', internships: 'Pasantías', jobs: 'Empleos', courses: 'Cursos', login: 'Iniciar sesión', register: 'Registrarse', dashboard: 'Panel', profile: 'Perfil', search: 'Buscar', apply: 'Aplicar ahora', welcome: 'Encuentra tu pasantía soñada', subtitle: 'Explora miles de pasantías de las mejores empresas', publicSpace: 'Espacio Público', subscription: 'Suscripción', resumeBuilder: 'Crear CV' },
  hi: { home: 'होम', internships: 'इंटर्नशिप', jobs: 'नौकरियां', courses: 'कोर्स', login: 'लॉगिन', register: 'रजिस्टर', dashboard: 'डैशबोर्ड', profile: 'प्रोफाइल', search: 'खोजें', apply: 'अभी आवेदन करें', welcome: 'अपनी सपनों की इंटर्नशिप खोजें', subtitle: 'शीर्ष कंपनियों से हजारों इंटर्नशिप एक्सप्लोर करें', publicSpace: 'पब्लिक स्पेस', subscription: 'सब्सक्रिप्शन', resumeBuilder: 'रिज्यूमे बनाएं' },
  pt: { home: 'Início', internships: 'Estágios', jobs: 'Empregos', courses: 'Cursos', login: 'Entrar', register: 'Cadastrar', dashboard: 'Painel', profile: 'Perfil', search: 'Buscar', apply: 'Candidatar-se', welcome: 'Encontre seu estágio dos sonhos', subtitle: 'Explore milhares de estágios das melhores empresas', publicSpace: 'Espaço Público', subscription: 'Assinatura', resumeBuilder: 'Criar Currículo' },
  zh: { home: '首页', internships: '实习', jobs: '工作', courses: '课程', login: '登录', register: '注册', dashboard: '仪表板', profile: '个人资料', search: '搜索', apply: '立即申请', welcome: '找到您梦想的实习', subtitle: '探索来自顶级公司的数千个实习机会', publicSpace: '公共空间', subscription: '订阅', resumeBuilder: '简历生成器' },
  fr: { home: 'Accueil', internships: 'Stages', jobs: 'Emplois', courses: 'Cours', login: 'Connexion', register: "S'inscrire", dashboard: 'Tableau de bord', profile: 'Profil', search: 'Rechercher', apply: 'Postuler', welcome: 'Trouvez votre stage de rêve', subtitle: 'Explorez des milliers de stages dans les meilleures entreprises', publicSpace: 'Espace Public', subscription: 'Abonnement', resumeBuilder: 'Créer un CV' },
};

export const PLANS = [
  { id: 'free', name: 'Free', price: 0, applications: 1, color: '#64748b', desc: 'Get started', perks: ['1 internship application/month', 'Basic profile', 'Browse all listings'] },
  { id: 'bronze', name: 'Bronze', price: 100, applications: 3, color: '#cd7f32', desc: 'Most Popular', perks: ['3 applications/month', 'Priority listing', 'Email alerts'] },
  { id: 'silver', name: 'Silver', price: 300, applications: 5, color: '#94a3b8', desc: 'Great Value', perks: ['5 applications/month', 'Profile boost', 'Interview prep'] },
  { id: 'gold', name: 'Gold', price: 1000, applications: Infinity, color: '#f59e0b', desc: 'Best Plan', perks: ['Unlimited applications', 'Resume builder access', 'Career coaching'] },
];

export const INTERNSHIPS = [
  { id: 1, title: 'Frontend Developer Intern', company: 'Google', location: 'Remote', stipend: '₹15,000/month', duration: '3 months', skills: ['React', 'JavaScript', 'CSS'], logo: 'G', category: 'Technology', posted: '2 days ago', openings: 5, applicants: 124 },
  { id: 2, title: 'Marketing Intern', company: 'Swiggy', location: 'Bangalore', stipend: '₹10,000/month', duration: '2 months', skills: ['Digital Marketing', 'SEO', 'Analytics'], logo: 'S', category: 'Marketing', posted: '1 day ago', openings: 3, applicants: 85 },
  { id: 3, title: 'Data Science Intern', company: 'Flipkart', location: 'Hybrid', stipend: '₹20,000/month', duration: '6 months', skills: ['Python', 'ML', 'SQL'], logo: 'F', category: 'Data Science', posted: '3 days ago', openings: 2, applicants: 203 },
  { id: 4, title: 'UI/UX Design Intern', company: 'Zomato', location: 'Remote', stipend: '₹12,000/month', duration: '3 months', skills: ['Figma', 'Sketch', 'Prototyping'], logo: 'Z', category: 'Design', posted: '5 hours ago', openings: 4, applicants: 67 },
  { id: 5, title: 'Backend Developer Intern', company: 'Razorpay', location: 'Pune', stipend: '₹25,000/month', duration: '4 months', skills: ['Node.js', 'MongoDB', 'AWS'], logo: 'R', category: 'Technology', posted: '1 week ago', openings: 3, applicants: 150 },
  { id: 6, title: 'Content Writing Intern', company: "Byju's", location: 'Remote', stipend: '₹8,000/month', duration: '2 months', skills: ['Writing', 'Research', 'SEO'], logo: 'B', category: 'Content', posted: '4 days ago', openings: 10, applicants: 312 },
  { id: 7, title: 'Finance Intern', company: 'Paytm', location: 'Noida', stipend: '₹18,000/month', duration: '3 months', skills: ['Excel', 'Finance', 'Accounting'], logo: 'P', category: 'Finance', posted: '2 days ago', openings: 5, applicants: 90 },
  { id: 8, title: 'HR Intern', company: 'Infosys', location: 'Chennai', stipend: '₹9,000/month', duration: '3 months', skills: ['Communication', 'MS Office', 'Recruitment'], logo: 'I', category: 'HR', posted: '6 hours ago', openings: 7, applicants: 45 },
];

// In a real app, this would be sent via email/SMS. For demo, use OTP: 123456
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generates a reasonably strong password for the reset flow
export function generatePassword(length = 10) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '@#$!';
  const all = upper + lower + digits + special;
  let password = '';
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  for (let i = 3; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => getStore('currentUser', null));
  const [users, setUsers] = useState(() => getStore('users', []));
  const [language, setLanguageState] = useState(() => getStore('language', 'en'));
  const [posts, setPosts] = useState(() => getStore('posts', []));
  const [loginHistory, setLoginHistory] = useState(() => getStore('loginHistory', []));
  const [pendingOTP, setPendingOTP] = useState(null);
  const [applications, setApplications] = useState(() => getStore('applications', []));
  const [resumes, setResumes] = useState(() => getStore('resumes', []));

  useEffect(() => { setStore('currentUser', user); }, [user]);
  useEffect(() => { setStore('users', users); }, [users]);
  useEffect(() => { setStore('language', language); }, [language]);
  useEffect(() => { setStore('posts', posts); }, [posts]);
  useEffect(() => { setStore('loginHistory', loginHistory); }, [loginHistory]);
  useEffect(() => { setStore('applications', applications); }, [applications]);
  useEffect(() => { setStore('resumes', resumes); }, [resumes]);

  const t = useCallback((key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  }, [language]);

  const register = useCallback((data) => {
    const existing = users.find(u => u.email === data.email);
    if (existing) return { error: 'Email already registered' };
    const newUser = {
      id: Date.now().toString(),
      ...data,
      plan: 'free',
      applicationsThisMonth: 0,
      friends: [],
      resume: null,
      avatar: data.name?.[0]?.toUpperCase() || 'U',
      joinedAt: new Date().toISOString(),
      passwordResetDate: null,
    };
    const updated = [...users, newUser];
    setUsers(updated);
    return { success: true };
  }, [users]);

  const getLoginMeta = useCallback(() => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    else if (ua.includes('Linux')) os = 'Linux';
    let device = 'Desktop';
    if (/Mobi|Android/i.test(ua)) device = 'Mobile';
    else if (/iPad|Tablet/i.test(ua)) device = 'Tablet';
    // FIXME: Replace with actual IP lookup from backend once API is ready
    const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    return { browser, os, device, ip, timestamp: new Date().toISOString() };
  }, []);

  const login = useCallback((email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (!foundUser) return { error: 'Invalid email or password' };

    const meta = getLoginMeta();

    // Trigger OTP verification for sensitive actions — in production this would be sent via email
    const otp = generateOTP();
    setPendingOTP({ otp, email, meta, foundUser });
    return { requireOTP: true, otp, email };
  }, [users, getLoginMeta]);

  const verifyLoginOTP = useCallback((enteredOTP) => {
    if (!pendingOTP) return { error: 'No pending OTP' };
    if (enteredOTP !== pendingOTP.otp) return { error: 'Invalid OTP' };
    const record = { ...pendingOTP.meta, email: pendingOTP.email, userId: pendingOTP.foundUser.id };
    const updatedHistory = [record, ...getStore('loginHistory', [])];
    setStore('loginHistory', updatedHistory);
    setLoginHistory(updatedHistory);
    setUser(pendingOTP.foundUser);
    setPendingOTP(null);
    return { success: true };
  }, [pendingOTP]);

  const logout = useCallback(() => {
    setUser(null);
    setPendingOTP(null);
  }, []);

  const changeLanguage = useCallback((code) => {
    setLanguageState(code);
    return { success: true };
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      setUsers(prevUsers => prevUsers.map(u => u.id === prev.id ? updated : u));
      setStore('currentUser', updated);
      return updated;
    });
  }, []);

  const applyToInternship = useCallback((internshipId) => {
    if (!user) return { error: 'Please login' };
    const plan = PLANS.find(p => p.id === user.plan);
    if (user.applicationsThisMonth >= plan.applications) {
      return { error: `Your ${plan.name} plan allows only ${plan.applications === Infinity ? 'unlimited' : plan.applications} application(s)/month. Upgrade to apply more!` };
    }
    const alreadyApplied = applications.find(a => a.userId === user.id && a.internshipId === internshipId);
    if (alreadyApplied) return { error: 'You have already applied to this internship.' };
    const newApp = { id: Date.now().toString(), userId: user.id, internshipId, appliedAt: new Date().toISOString(), status: 'Applied' };
    setApplications(prev => [newApp, ...prev]);
    updateUser({ applicationsThisMonth: (user.applicationsThisMonth || 0) + 1 });
    return { success: true };
  }, [user, applications, updateUser]);

  const subscribePlan = useCallback((planId) => {
    updateUser({ plan: planId, applicationsThisMonth: 0 });
    return { success: true };
  }, [updateUser]);

  const createPost = useCallback((content, mediaUrl) => {
    if (!user) return { error: 'Please login' };
    const newPost = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      mediaUrl: mediaUrl || null,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
    };
    setPosts(prev => [newPost, ...prev]);
    return { success: true };
  }, [user]);

  const likePost = useCallback((postId) => {
    if (!user) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likes.includes(user.id);
      return { ...p, likes: liked ? p.likes.filter(id => id !== user.id) : [...p.likes, user.id] };
    }));
  }, [user]);

  const commentPost = useCallback((postId, text) => {
    if (!user || !text.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return { ...p, comments: [...p.comments, { id: Date.now().toString(), userId: user.id, userName: user.name, text, createdAt: new Date().toISOString() }] };
    }));
  }, [user]);

  const resetPassword = useCallback((emailOrPhone, newPassword) => {
    const today = new Date().toDateString();
    const targetUser = users.find(u => u.email === emailOrPhone || u.phone === emailOrPhone);
    if (!targetUser) return { error: 'No account found with this email/phone.' };
    if (targetUser.passwordResetDate === today) return { error: 'Password reset is allowed only once per day.' };
    const updatedUsers = users.map(u => u.id === targetUser.id ? { ...u, password: newPassword, passwordResetDate: today } : u);
    setUsers(updatedUsers);
    return { success: true };
  }, [users]);

  const saveResume = useCallback((resumeData) => {
    const newResume = { ...resumeData, id: Date.now().toString(), createdAt: new Date().toISOString(), userId: user?.id };
    setResumes(prev => [newResume, ...prev.filter(r => r.userId !== user?.id)]);
    updateUser({ resume: newResume });
    return { success: true };
  }, [user, updateUser]);

  const getUserApplications = useCallback(() => {
    return applications.filter(a => a.userId === user?.id).map(a => ({
      ...a,
      internship: INTERNSHIPS.find(i => i.id === a.internshipId)
    }));
  }, [user, applications]);

  return (
    <AppContext.Provider value={{
      user, users, language, t, posts, loginHistory, applications, resumes, pendingOTP,
      register, login, logout, verifyLoginOTP, changeLanguage,
      updateUser, applyToInternship, subscribePlan,
      createPost, likePost, commentPost, resetPassword, saveResume,
      getUserApplications, INTERNSHIPS, PLANS, LANGUAGES
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
