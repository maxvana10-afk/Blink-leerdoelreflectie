import React, { useState, useMemo } from 'react';
import { LessonGoal, ReflectionEntry, StarRating } from '../types';
import { TIPS, SUBJECT_CONFIG } from '../constants';
import { StarSelector } from './StarSelector';
import { InfoTip } from './InfoTip';
import { getReflectionCoaching } from '../services/geminiService';

interface StudentFormProps {
  goal: LessonGoal;
  existingReflections: ReflectionEntry[];
  onSubmit: (entry: ReflectionEntry) => void;
  onBack: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ goal, existingReflections, onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState<StarRating>(null);
  const [explanation, setExplanation] = useState('');
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [evidenceFileName, setEvidenceFileName] = useState('');
  const [reflection, setReflection] = useState('');
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isCoaching, setIsCoaching] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);

  const subjectStyle = SUBJECT_CONFIG[goal.subject];

  // Find previous reflection based on name input and current goal
  const previousEntry = useMemo(() => {
    if (name.trim().length < 2) return null;
    return existingReflections.find(
      (r) => 
        r.lessonGoal === goal.text && 
        r.studentName.trim().toLowerCase() === name.trim().toLowerCase()
    );
  }, [name, goal.text, existingReflections]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      alert("Vergeet niet je sterren te kiezen!");
      return;
    }
    const newEntry: ReflectionEntry = {
      id: Date.now().toString(),
      studentName: name,
      lessonDate: new Date().toLocaleDateString('nl-NL'),
      lessonGoal: goal.text,
      subject: goal.subject,
      rating,
      explanation,
      evidenceDescription,
      evidenceFileName,
      reflection
    };
    onSubmit(newEntry);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidenceFileName(e.target.files[0].name);
    }
  };

  const askAICoach = async (field: string, text: string) => {
    setIsCoaching(true);
    const tip = await getReflectionCoaching(goal.text, field, text);
    setAiTip(tip);
    setIsCoaching(false);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-slate-500 hover:underline">← Kies een ander doel</button>
        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-1 ${subjectStyle.bg} ${subjectStyle.color} border ${subjectStyle.border}`}>
            {subjectStyle.icon} {subjectStyle.label}
          </span>
          <h2 className="text-xl font-bold text-slate-800">{goal.text}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-slate-100">
          <label className="block text-lg font-bold mb-2">Wie ben jij?</label>
          <input
            type="text"
            required
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            placeholder="Vul hier je naam in..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          {/* Previous Reflection Notification */}
          {previousEntry && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl overflow-hidden transition-all">
              <button 
                type="button"
                onClick={() => setShowPrevious(!showPrevious)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-blue-100 transition-colors"
              >
                <div>
                  <span className="text-blue-800 font-bold block">👋 Hé {previousEntry.studentName}!</span>
                  <span className="text-blue-600 text-sm">Je hebt dit doel eerder gedaan op {previousEntry.lessonDate}.</span>
                </div>
                <span className="text-blue-500 font-bold text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                  {showPrevious ? 'Verberg' : 'Bekijk vorige'}
                </span>
              </button>
              
              {showPrevious && (
                <div className="p-4 bg-white border-t border-blue-100 text-slate-700 text-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 uppercase text-xs">Vorige score:</span>
                    <div className="flex text-yellow-400">
                      {[...Array(previousEntry.rating || 0)].map((_, i) => <span key={i}>★</span>)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-xs block mb-1">Wat hielp toen:</span>
                    <p className="italic bg-slate-50 p-2 rounded">"{previousEntry.explanation}"</p>
                  </div>
                  
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-xs block mb-1">Toen geleerd:</span>
                    <p className="italic bg-slate-50 p-2 rounded">"{previousEntry.reflection}"</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 1: Stars */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-slate-100">
          <h3 className="text-lg font-bold mb-4">1. Hoe goed beheers je het lesdoel?</h3>
          <StarSelector value={rating} onChange={setRating} />
        </div>

        {/* Step 2: Explanation */}
        <div className="bg-white p-6 rounded-2xl shadow-sm relative border-t-4 border-slate-100">
          <h3 className="text-lg font-bold mb-2">2. Welke opdracht heeft je het meest geholpen?</h3>
          <InfoTip example={TIPS.explanation.example} criteria={TIPS.explanation.criteria} />
          <textarea
            required
            className="w-full p-3 border border-slate-200 rounded-lg h-32 focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
            placeholder="Ik heb opdracht ... gedaan en dat hielp omdat..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
          <button
             type="button"
             onClick={() => askAICoach('Opdracht Uitleg', explanation)}
             className="mt-2 text-sm text-purple-600 font-semibold hover:text-purple-800 flex items-center gap-1"
          >
            ✨ Hulp nodig van de AI-coach?
          </button>
        </div>

        {/* Step 3: Evidence */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-slate-100">
          <h3 className="text-lg font-bold mb-2">3. Waar kan ik zien dat je het snapt? (Bewijs)</h3>
          <InfoTip example={TIPS.evidence.example} criteria={TIPS.evidence.criteria} />
          
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-slate-600">Upload een foto van je werk (optioneel):</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg font-medium text-slate-700 transition">
                Kies foto/bestand
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
              <span className="text-sm text-slate-500">{evidenceFileName || "Geen bestand gekozen"}</span>
            </div>
          </div>
          
          <label className="block text-sm font-semibold mb-1 text-slate-600">Of schrijf op waar het staat:</label>
          <textarea
            className="w-full p-3 border border-slate-200 rounded-lg h-24 focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
            placeholder="Kijk in mijn werkboek op bladzijde..."
            value={evidenceDescription}
            onChange={(e) => setEvidenceDescription(e.target.value)}
          />
        </div>

        {/* Step 4: Reflection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-slate-100">
          <h3 className="text-lg font-bold mb-2">4. Wat weet je nu, wat je eerst nog niet wist?</h3>
          <InfoTip example={TIPS.reflection.example} criteria={TIPS.reflection.criteria} />
          <textarea
            required
            className="w-full p-3 border border-slate-200 rounded-lg h-32 focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
            placeholder="Ik heb vandaag geleerd dat..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
           <button
             type="button"
             onClick={() => askAICoach('Reflectie', reflection)}
             className="mt-2 text-sm text-purple-600 font-semibold hover:text-purple-800 flex items-center gap-1"
          >
            ✨ Check mijn reflectie
          </button>
        </div>

        {/* AI Feedback Modal */}
        {aiTip && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-bounce-in relative border-4 border-purple-200">
              <h4 className="text-purple-700 font-bold text-lg mb-2">Tips van de AI Coach 🤖</h4>
              <p className="text-slate-700 mb-4">{aiTip}</p>
              <button
                type="button"
                onClick={() => setAiTip(null)}
                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold"
              >
                Bedankt, ik ga het aanpassen!
              </button>
            </div>
          </div>
        )}

         {/* Loading Overlay */}
         {isCoaching && (
          <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
            <div className="text-purple-600 font-bold animate-pulse">De coach denkt even na...</div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-xl shadow-lg transform transition active:scale-95"
        >
          ✅ Verstuur mijn reflectie
        </button>
      </form>
    </div>
  );
};
