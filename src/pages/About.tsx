import { Shield, Brain, Lock } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-100 mb-6">About DermaDetect AI</h1>
        <p className="text-lg text-slate-400">
          Empowering individuals with accessible, AI-driven skin health insights.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-16">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
          <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-400">
            <Brain size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Advanced AI</h3>
          <p className="text-sm text-slate-400">
            Powered by Google's Gemini Vision models to analyze visual patterns with high accuracy.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
          <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-400">
            <Lock size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Privacy First</h3>
          <p className="text-sm text-slate-400">
            Images are processed securely and are not stored on our servers permanently.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
          <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-400">
            <Shield size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Educational Tool</h3>
          <p className="text-sm text-slate-400">
            Designed to raise awareness and encourage professional medical consultation.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Our Mission</h2>
        <p className="text-slate-400 leading-relaxed mb-6">
          Skin conditions are common, but access to dermatologists can be difficult or expensive. 
          DermaDetect AI aims to bridge that gap by providing instant, preliminary analysis to help users 
          decide if they need to see a doctor.
        </p>
        <p className="text-slate-400 leading-relaxed">
          We believe that early detection is key to better health outcomes. By making skin analysis 
          accessible to everyone with a smartphone, we hope to encourage proactive health monitoring.
        </p>
      </div>
    </div>
  );
}
