import React, { useState, useMemo } from 'react';
import { LessonGoal, ReflectionEntry, Subject } from '../types';
import { SUBJECT_CONFIG } from '../constants';

interface TeacherDashboardProps {
  activeGoals: LessonGoal[];
  reflections: ReflectionEntry[];
  onAddGoal: (text: string, subject: Subject) => void;
  onRemoveGoal: (id: string) => void;
  onViewReflection: (entry: ReflectionEntry) => void;
  onBack: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  activeGoals, 
  reflections, 
  onAddGoal, 
  onRemoveGoal,
  onViewReflection,
  onBack 
}) => {
  const [inputs, setInputs] = useState<Record<Subject, string>>({
    aardrijkskunde: '',
    geschiedenis: '',
    natuur_techniek: ''
  });

  const [viewMode, setViewMode] = useState<'timeline' | 'students'>('timeline');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const handleInputChange = (subject: Subject, value: string) => {
    setInputs(prev => ({ ...prev, [subject]: value }));
  };

  const handleAdd = (e: React.FormEvent, subject: Subject) => {
    e.preventDefault();
    if (inputs[subject].trim()) {
      onAddGoal(inputs[subject], subject);
      setInputs(prev => ({ ...prev, [subject]: '' }));
    }
  };

  // Group reflections by student name
  const reflectionsByStudent = useMemo(() => {
    const groups: Record<string, ReflectionEntry[]> = {};
    reflections.forEach(r => {
       const name = r.studentName.trim();
       if (!groups[name]) groups[name] = [];
       groups[name].push(r);
    });
    return groups;
  }, [reflections]);

  const sortedStudentNames = Object.keys(reflectionsByStudent).sort();

  const subjects: Subject[] = ['aardrijkskunde', 'geschiedenis', 'natuur_techniek'];

  const renderReflectionCard = (entry: ReflectionEntry) => {
    const subConfig = SUBJECT_CONFIG[entry.subject || 'aardrijkskunde'];
    return (
      <div 
        key={entry.id} 
        onClick={() => onViewReflection(entry)}
        className={`border p-4 rounded-xl hover:shadow-md transition cursor-pointer bg-slate-50 group relative overflow-hidden ${subConfig.border}`}
      >
         <div className={`absolute top-0 right-0 px-2 py-1 text-[10px] font-bold uppercase rounded-bl-lg ${subConfig.bg} ${subConfig.color}`}>
          {subConfig.icon} {subConfig.label}
        </div>

        <div className="flex justify-between items-start mb-2 mt-2">
          <span className="font-bold text-slate-800">{entry.studentName}</span>
          <span className="text-xs text-slate-400">{entry.lessonDate}</span>
        </div>
        
        <div className="flex text-yellow-400 text-sm mb-2">
          {[...Array(entry.rating || 0)].map((_, i) => <span key={i}>★</span>)}
        </div>

        <p className="text-xs font-semibold text-slate-600 mb-1 truncate">Doel: {entry.lessonGoal}</p>
        <p className="text-sm text-slate-500 line-clamp-2 italic">"{entry.reflection}"</p>
        
        <div className="mt-3 text-right">
            <span className="text-xs font-bold text-blue-500 group-hover:underline">Bekijk details →</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Leerkracht Dashboard</h2>
        <button onClick={onBack} className="text-slate-500 hover:underline">Uitloggen</button>
      </div>

      {/* Goal Setting Columns */}
      <h3 className="text-xl font-bold mb-4 text-slate-700">Lesdoelen beheren</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {subjects.map((subject) => {
          const config = SUBJECT_CONFIG[subject];
          const subjectGoals = activeGoals.filter(g => g.subject === subject);

          return (
            <div key={subject} className={`bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border-t-4 ${config.border.replace('border', 'border-t')}`}>
              <div className={`${config.bg} p-4 border-b ${config.border}`}>
                <h4 className={`text-lg font-bold flex items-center gap-2 ${config.color}`}>
                  <span>{config.icon}</span> {config.label}
                </h4>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <form onSubmit={(e) => handleAdd(e, subject)} className="mb-4">
                  <textarea
                    value={inputs[subject]}
                    onChange={(e) => handleInputChange(subject, e.target.value)}
                    placeholder="Nieuw lesdoel..."
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-opacity-50 outline-none resize-none mb-2 h-20"
                    style={{ ['--tw-ring-color' as any]: config.color.replace('text-', '') }}
                  />
                  <button 
                    type="submit"
                    className={`w-full py-2 rounded-lg font-bold text-sm text-white transition opacity-90 hover:opacity-100 bg-slate-700`}
                  >
                    + Voeg toe
                  </button>
                </form>

                <div className="space-y-3 mt-2 overflow-y-auto max-h-64">
                  {subjectGoals.length === 0 && <p className="text-xs text-slate-400 italic text-center">Geen actieve doelen</p>}
                  {subjectGoals.map(goal => (
                    <div key={goal.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative group">
                      <p className="text-sm text-slate-800 pr-6">{goal.text}</p>
                      <button 
                        onClick={() => onRemoveGoal(goal.id)}
                        className="absolute top-1 right-1 text-slate-300 hover:text-red-500 p-1"
                        title="Verwijder doel"
                      >
                        ✕
                      </button>
                      <p className="text-[10px] text-slate-400 mt-1">{goal.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Portfolio List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm min-h-[400px]">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-bold">
            Reflecties <span className="text-slate-400 font-normal text-sm ml-2">({reflections.length} totaal)</span>
          </h3>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition ${viewMode === 'timeline' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              📅 Tijdlijn
            </button>
            <button
              onClick={() => setViewMode('students')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition ${viewMode === 'students' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              🎓 Per Leerling
            </button>
          </div>
        </div>
        
        {reflections.length === 0 ? (
          <div className="text-center text-slate-400 py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Nog geen reflecties ingeleverd.
          </div>
        ) : (
          <>
            {/* TIMELINE VIEW */}
            {viewMode === 'timeline' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reflections.map((entry) => renderReflectionCard(entry))}
              </div>
            )}

            {/* STUDENT GROUP VIEW */}
            {viewMode === 'students' && (
              <div className="space-y-4">
                {sortedStudentNames.map(studentName => {
                  const studentReflections = reflectionsByStudent[studentName];
                  const isExpanded = expandedStudent === studentName;

                  return (
                    <div key={studentName} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => setExpandedStudent(isExpanded ? null : studentName)}
                        className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition ${isExpanded ? 'bg-slate-50 border-b border-slate-200' : 'bg-white'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                            {studentName.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-slate-800">{studentName}</h4>
                            <p className="text-xs text-slate-500">{studentReflections.length} reflectie{studentReflections.length !== 1 && 's'}</p>
                          </div>
                        </div>
                        <div className="text-slate-400 transform transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          ▼
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 bg-slate-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                          {studentReflections.map(entry => renderReflectionCard(entry))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
