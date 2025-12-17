import React, { useState, useEffect } from 'react';
import { LessonGoal, ReflectionEntry, Subject, UserRole, ViewState } from './types';
import { StudentForm } from './components/StudentForm';
import { TeacherDashboard } from './components/TeacherDashboard';
import { LoginModal } from './components/LoginModal'; // Import the new modal
import { APP_TITLE, SUBJECT_CONFIG } from './constants';

const App: React.FC = () => {
  // State for mock database
  const [activeGoals, setActiveGoals] = useState<LessonGoal[]>([]);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  
  // View State
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [viewState, setViewState] = useState<ViewState>({ view: 'landing' });

  // Login State
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('blink_active_goals');
    const savedReflections = localStorage.getItem('blink_reflections');
    
    if (savedGoals) setActiveGoals(JSON.parse(savedGoals));
    if (savedReflections) setReflections(JSON.parse(savedReflections));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('blink_active_goals', JSON.stringify(activeGoals));
  }, [activeGoals]);

  useEffect(() => {
    localStorage.setItem('blink_reflections', JSON.stringify(reflections));
  }, [reflections]);

  // Handlers
  const handleAddGoal = (text: string, subject: Subject) => {
    const newGoal: LessonGoal = {
      id: Date.now().toString(),
      text,
      subject,
      active: true,
      date: new Date().toLocaleDateString('nl-NL')
    };
    setActiveGoals(prev => [newGoal, ...prev]);
  };

  const handleRemoveGoal = (id: string) => {
    setActiveGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleSubmitReflection = (entry: ReflectionEntry) => {
    setReflections(prev => [entry, ...prev]);
    alert("Goed gedaan! Je reflectie is opgeslagen in je portfolio.");
    setRole(UserRole.NONE); // Return to home
    setViewState({ view: 'landing', selectedGoal: undefined });
  };

  const handleViewReflection = (entry: ReflectionEntry) => {
    setViewState({ view: 'portfolio-detail', selectedReflection: entry });
  };

  // Auth Handlers
  const handleStudentStart = () => {
    setRole(UserRole.STUDENT);
    setViewState({ view: 'student-selection' });
  };

  const handleTeacherLoginRequest = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setRole(UserRole.TEACHER);
    setViewState({ view: 'teacher-dashboard' });
    setShowLoginModal(false);
  };

  const handleSelectGoal = (goal: LessonGoal) => {
    setViewState({ view: 'student-form', selectedGoal: goal });
  };

  // Render Logic
  const renderLanding = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <h1 className="text-5xl font-bold text-green-600 mb-2">{APP_TITLE}</h1>
      <p className="text-slate-600 mb-12 text-xl">Wereldoriëntatie Portfolio</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        <button 
          onClick={handleStudentStart}
          className="bg-white border-4 border-green-400 hover:bg-green-50 p-8 rounded-3xl shadow-xl transition transform hover:-translate-y-1 group"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
          <h2 className="text-2xl font-bold text-slate-800">Ik ben leerling</h2>
          <p className="text-slate-500 mt-2">Vul je reflectie in</p>
        </button>

        <button 
          onClick={handleTeacherLoginRequest}
          className="bg-white border-4 border-blue-400 hover:bg-blue-50 p-8 rounded-3xl shadow-xl transition transform hover:-translate-y-1 group"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👩‍🏫</div>
          <h2 className="text-2xl font-bold text-slate-800">Ik ben leerkracht</h2>
          <p className="text-slate-500 mt-2">Zet lesdoelen klaar & bekijk portfolio's</p>
        </button>
      </div>

      {/* Login Modal Overlay */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onSuccess={handleLoginSuccess} 
        />
      )}
    </div>
  );

  const renderStudentSelection = () => {
    if (activeGoals.length === 0) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Er staan nog geen lesdoelen klaar.</h2>
          <p className="text-slate-500 mb-8">Vraag je leerkracht om doelen te activeren.</p>
          <button onClick={() => setRole(UserRole.NONE)} className="text-blue-500 font-bold underline">Terug</button>
        </div>
      );
    }

    const subjects: Subject[] = ['aardrijkskunde', 'geschiedenis', 'natuur_techniek'];

    return (
      <div className="min-h-screen p-6 max-w-5xl mx-auto">
        <button onClick={() => setRole(UserRole.NONE)} className="mb-8 text-slate-500 hover:underline">← Terug naar start</button>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Waar gaat de les over vandaag?</h2>
        <p className="text-slate-500 mb-8">Kies het lesdoel waar je op wilt reflecteren.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map(subject => {
            const config = SUBJECT_CONFIG[subject];
            const goals = activeGoals.filter(g => g.subject === subject);
            
            if (goals.length === 0) return null;

            return (
              <div key={subject} className="flex flex-col gap-4">
                <h3 className={`font-bold text-xl flex items-center gap-2 ${config.color}`}>
                   <span>{config.icon}</span> {config.label}
                </h3>
                {goals.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => handleSelectGoal(goal)}
                    className={`text-left p-6 rounded-2xl shadow-sm border-2 transition-all hover:scale-[1.02] hover:shadow-md ${config.bg} ${config.border} border-opacity-50 hover:border-opacity-100`}
                  >
                     <p className="font-bold text-slate-800">{goal.text}</p>
                     <p className="text-xs text-slate-500 mt-2">{goal.date}</p>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  const renderPortfolioDetail = () => {
    const entry = viewState.selectedReflection;
    if (!entry) return null;
    
    const subjectConfig = SUBJECT_CONFIG[entry.subject] || SUBJECT_CONFIG['aardrijkskunde'];

    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <button 
          onClick={() => setViewState({ view: 'teacher-dashboard' })}
          className="mb-6 text-slate-500 hover:underline font-bold"
        >
          ← Terug naar overzicht
        </button>
        <div className={`bg-white rounded-3xl shadow-lg overflow-hidden border-t-8`} style={{ borderColor: subjectConfig.color.replace('text-', 'var(--tw-text-opacity)') }}>
          <div className={`${subjectConfig.bg} p-8 border-b ${subjectConfig.border}`}>
             <div className="flex justify-between items-start">
               <h2 className="text-3xl font-bold text-slate-800 mb-2">{entry.studentName}</h2>
               <span className="text-3xl">{subjectConfig.icon}</span>
             </div>
             <p className="text-slate-500">{entry.lessonDate}</p>
             <div className="mt-4 bg-white inline-block px-4 py-2 rounded-lg shadow-sm font-medium text-slate-700">
               <span className={`font-bold ${subjectConfig.color} mr-2 uppercase text-xs tracking-wide`}>{subjectConfig.label}</span>
               {entry.lessonGoal}
             </div>
          </div>
          
          <div className="p-8 space-y-8">
            <section>
              <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">Beoordeling</h3>
              <div className="flex text-yellow-400 text-3xl">
                {[...Array(entry.rating)].map((_, i) => <span key={i}>★</span>)}
              </div>
            </section>

            <section>
              <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">Hoe behaald?</h3>
              <p className="text-lg text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl">{entry.explanation}</p>
            </section>

            <section>
              <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">Bewijs</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                {entry.evidenceFileName && (
                  <div className="flex items-center gap-2 mb-2 text-blue-600 font-medium">
                     📎 {entry.evidenceFileName}
                  </div>
                )}
                <p className="text-slate-700">{entry.evidenceDescription || "Geen beschrijving."}</p>
              </div>
            </section>

            <section>
              <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">Geleerd</h3>
              <p className={`text-lg text-slate-800 leading-relaxed p-4 rounded-xl border ${subjectConfig.bg} ${subjectConfig.border}`}>
                {entry.reflection}
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  };

  // Main Render Switch
  if (viewState.view === 'portfolio-detail') {
    return renderPortfolioDetail();
  }

  if (role === UserRole.NONE) {
    return renderLanding();
  }

  if (role === UserRole.STUDENT) {
    if (viewState.view === 'student-selection') {
      return renderStudentSelection();
    }
    if (viewState.view === 'student-form' && viewState.selectedGoal) {
      return (
        <div className="min-h-screen bg-yellow-50 p-4">
          <StudentForm 
            goal={viewState.selectedGoal}
            existingReflections={reflections} 
            onSubmit={handleSubmitReflection} 
            onBack={() => setViewState({ view: 'student-selection', selectedGoal: undefined })} 
          />
        </div>
      );
    }
    return renderStudentSelection();
  }

  if (role === UserRole.TEACHER) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <TeacherDashboard 
          activeGoals={activeGoals}
          reflections={reflections}
          onAddGoal={handleAddGoal}
          onRemoveGoal={handleRemoveGoal}
          onViewReflection={handleViewReflection}
          onBack={() => setRole(UserRole.NONE)}
        />
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default App;
