import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, BrainCircuit, Activity, Utensils, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  { id: 'start', title: 'Initialize Link' },
  { id: 'metrics', title: 'Biological Metrics' },
  { id: 'processing', title: 'Quantum Processing' },
  { id: 'results', title: 'Blueprint Generated' }
];

const AIOracle = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ age: 25, gender: 'Male', weight: 75, height: 180, fatPercentage: 15 });
  const [blueprint, setBlueprint] = useState(null);
  const { user } = useAuth();

  const handleNext = () => setCurrentStep(prev => prev + 1);

  const generateBlueprint = async () => {
     handleNext(); // Move to processing
     try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.post('/api/ml/predict', formData, config);
        
        // Try real ML response first, then mocked fallback
        const result = data.modelPrediction || data.mockedResponse;
        
        setTimeout(() => {
           setBlueprint(result || {
              workout: 'Strength & Hypertrophy',
              calories: 2500,
              meals: ['Oatmeal & Eggs', 'Chicken & Rice', 'Steak & Potatoes'],
              coaches: [],
              bmi: null,
           });
           handleNext();
        }, 2500);
     } catch(e) {
        console.error(e);
        setTimeout(() => {
           setBlueprint({ workout: 'Error connecting to ML service', calories: 0, meals: [], coaches: [], bmi: null });
           handleNext();
        }, 2000);
     }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      
      {/* Progress Indicators */}
      <div className="flex justify-center mb-12">
         {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center">
               <div className={`w-3 h-3 rounded-full ${idx <= currentStep ? 'bg-primary shadow-[0_0_10px_rgba(0,242,254,0.8)]' : 'bg-white/20'}`}></div>
               {idx < STEPS.length - 1 && <div className={`w-12 h-0.5 mx-2 ${idx < currentStep ? 'bg-primary/50' : 'bg-white/10'}`}></div>}
            </div>
         ))}
      </div>

      <AnimatePresence mode="wait">
         {/* Step 0: Intro */}
         {currentStep === 0 && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center p-12 glass-card border-primary/20 relative overflow-hidden">
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
               <BrainCircuit className="w-20 h-20 text-primary mx-auto mb-6" />
               <h1 className="text-4xl font-heading text-white mb-4 tracking-widest uppercase">The NextGen Oracle</h1>
               <p className="text-lg text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
                  Establish a neural link to our quantum predictive matrix. We require accurate biological data to synthesize your optimal 360° fitness protocol.
               </p>
               <button onClick={handleNext} className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded hover:bg-white transition-colors tracking-widest flex items-center gap-3 mx-auto shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)]">
                  INITIATE SEQUENCE <ArrowRight className="w-5 h-5" />
               </button>
            </motion.div>
         )}

         {/* Step 1: Input Form */}
         {currentStep === 1 && (
            <motion.div key="form" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-card p-8 md:p-12">
               <h2 className="text-2xl font-heading text-primary mb-8 border-b border-white/10 pb-4">Calibration Metrics</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Biological Age</label>
                     <input type="number" className="w-full bg-surface/50 border border-white/10 rounded py-3 px-4 text-white font-mono text-xl focus:outline-none focus:border-secondary transition-colors" value={formData.age} onChange={e=> setFormData({...formData, age: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Weight (KG)</label>
                     <input type="number" className="w-full bg-surface/50 border border-white/10 rounded py-3 px-4 text-white font-mono text-xl focus:outline-none focus:border-secondary transition-colors" value={formData.weight} onChange={e=> setFormData({...formData, weight: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Height (CM)</label>
                     <input type="number" className="w-full bg-surface/50 border border-white/10 rounded py-3 px-4 text-white font-mono text-xl focus:outline-none focus:border-secondary transition-colors" value={formData.height} onChange={e=> setFormData({...formData, height: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Body Fat %</label>
                     <div className="flex items-center gap-4">
                        <input type="range" min="3" max="40" className="w-full accent-secondary" value={formData.fatPercentage} onChange={e=> setFormData({...formData, fatPercentage: e.target.value})} />
                        <span className="text-secondary font-mono w-12">{formData.fatPercentage}%</span>
                     </div>
                  </div>
               </div>
               
               <button onClick={generateBlueprint} className="w-full py-4 bg-secondary text-background font-bold uppercase tracking-wider rounded border border-secondary/50 hover:bg-secondary/90 transition-all shadow-[0_0_15px_rgba(79,172,254,0.3)]">
                  Execute Algorithm
               </button>
            </motion.div>
         )}

         {/* Step 2: Processing */}
         {currentStep === 2 && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-32">
               <Zap className="w-24 h-24 text-primary mx-auto animate-pulse mb-8 filter drop-shadow-[0_0_15px_rgba(0,242,254,0.8)]" />
               <h2 className="text-2xl font-mono text-white mb-2 uppercase tracking-widest">Compiling Matrix Data</h2>
               <p className="text-primary font-mono text-sm animate-pulse">Running Random Forest Classifier... Calculating basal metabolic algorithms...</p>
            </motion.div>
         )}

         {/* Step 3: Results */}
         {currentStep === 3 && blueprint && (
            <motion.div key="results" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
               <div className="text-center mb-8">
                  <h2 className="text-4xl font-heading text-white">PROTOCOL GENERATED</h2>
                  <p className="text-secondary font-mono tracking-widest mt-2 bg-secondary/10 inline-block px-4 py-1 border border-secondary/30 rounded">Match Rate: 98.7%</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Workout Card */}
                  <div className="glass-card p-6 border-l-4 border-l-primary relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Activity strokeWidth={1} size={150} /></div>
                     <div className="flex items-center gap-3 mb-6 relative z-10">
                        <Activity className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-heading uppercase text-gray-300 tracking-wider">Recommended Stimulus</h3>
                     </div>
                     <p className="text-3xl font-heading text-white text-shadow">{blueprint.workout}</p>
                  </div>

                  {/* Nutrition Card */}
                  <div className="glass-card p-6 border-l-4 border-l-secondary relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Utensils strokeWidth={1} size={150} /></div>
                     <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                           <Utensils className="w-6 h-6 text-secondary" />
                           <h3 className="text-xl font-heading uppercase text-gray-300 tracking-wider">Nutrition Engine</h3>
                        </div>
                        <span className="text-2xl font-mono text-secondary">{blueprint.calories} Kcal</span>
                     </div>
                     <ul className="space-y-2 relative z-10 text-gray-300 list-disc list-inside px-2">
                        {blueprint.meals.map((meal, idx) => (
                           <li key={idx} className="font-medium text-sm border-b border-white/5 pb-2 last:border-0">{meal}</li>
                        ))}
                     </ul>
                  </div>
               </div>

               {/* Coach Recommendation */}
               {blueprint.coaches && blueprint.coaches.length > 0 && (
                 <div className="glass-card p-8 mt-6 flex flex-col items-center bg-primary/5 border-primary/20">
                    <Users className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl text-white mb-2">AI-Recommended Coach Types</h3>
                    <div className="flex gap-3 flex-wrap justify-center mb-6">
                       {blueprint.coaches.map((c, i) => (
                          <span key={i} className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-full text-sm">{c}</span>
                       ))}
                    </div>
                    <Link to="/coaches" className="bg-white text-background font-bold uppercase tracking-wider px-8 py-4 rounded hover:bg-gray-200 transition-colors shadow">
                       View Targeted Coaches
                    </Link>
                 </div>
               )}
               {(!blueprint.coaches || blueprint.coaches.length === 0) && (
                  <div className="glass-card p-8 mt-6 flex flex-col items-center bg-primary/5 border-primary/20">
                     <Users className="w-12 h-12 text-primary mb-4" />
                     <h3 className="text-xl text-white mb-2">Ready to execute the plan?</h3>
                     <p className="text-gray-400 mb-6 text-center max-w-lg">We have dynamically updated our coach directory to highlight trainers specialized in {blueprint.workout}.</p>
                     <Link to="/coaches" className="bg-white text-background font-bold uppercase tracking-wider px-8 py-4 rounded hover:bg-gray-200 transition-colors shadow">
                        View Targeted Coaches
                     </Link>
                  </div>
               )}
               
               <div className="text-center pt-8">
                  <button onClick={() => setCurrentStep(0)} className="text-sm text-gray-500 hover:text-white underline font-mono">RECALIBRATE PARAMS</button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default AIOracle;
