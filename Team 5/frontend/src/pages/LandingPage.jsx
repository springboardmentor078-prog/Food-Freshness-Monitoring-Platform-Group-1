import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Leaf, ScanLine, BarChart3, ShieldCheck, Clock, Zap,
  ArrowRight, Camera, Cpu, TrendingUp, Package
} from 'lucide-react';

const features = [
  {
    icon: ScanLine,
    title: 'AI Image Analysis',
    desc: 'Upload food images for instant freshness detection using YOLOv8 computer vision.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Clock,
    title: 'Shelf-Life Prediction',
    desc: 'Predict remaining shelf life with 96% accuracy using LightGBM machine learning.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: BarChart3,
    title: 'Freshness Scoring',
    desc: 'Weighted scoring engine combining visual analysis, storage conditions, and product age.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: Zap,
    title: 'Smart Recommendations',
    desc: 'AI-generated storage optimization and consumption priority suggestions.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Storage Compliance',
    desc: 'Monitor temperature, humidity, and environmental conditions for optimal storage.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Leaf,
    title: 'Reduce Food Waste',
    desc: 'Proactive alerts and inventory rotation to minimize waste and maximize quality.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
  },
];

const pipelineSteps = [
  {
    step: 1,
    icon: Camera,
    title: 'Upload Image',
    desc: 'Take a photo or upload an image of your food item.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    step: 2,
    icon: ScanLine,
    title: 'AI Segmentation',
    desc: 'YOLOv8 isolates individual fruit regions from the image.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    step: 3,
    icon: Cpu,
    title: 'Freshness Classification',
    desc: 'Each fruit is classified as fresh or spoiled with confidence scores.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    step: 4,
    icon: TrendingUp,
    title: 'Shelf-Life Prediction',
    desc: 'LightGBM predicts remaining days based on freshness and storage conditions.',
    color: 'from-pink-500 to-rose-500',
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-primary-400 text-sm font-medium">AI-Powered Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Food Freshness
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                Monitoring Platform
              </span>
            </h1>

            <p className="text-dark-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Harness computer vision and machine learning to assess food quality,
              predict shelf life, detect spoilage, and optimize storage — reducing waste
              and protecting consumers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="btn-primary text-base px-8 py-4 shadow-lg shadow-primary-500/20"
              >
                Get Started Free →
              </Link>
              <Link
                to={isAuthenticated ? '/scan' : '/login'}
                className="btn-secondary text-base px-8 py-4"
              >
                {isAuthenticated ? 'Scan Food Now' : 'Log In'}
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {[
                { value: '96%', label: 'Prediction Accuracy' },
                { value: '<1s', label: 'Analysis Time' },
                { value: '25+', label: 'Food Categories' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-dark-500 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — Pipeline Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto">
            Our AI pipeline processes food images through 4 stages for comprehensive freshness analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pipelineSteps.map((ps, i) => (
            <div key={ps.step} className="relative">
              {/* Connector line */}
              {i < pipelineSteps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-3 w-6">
                  <ArrowRight className="w-6 h-6 text-dark-600" />
                </div>
              )}

              <div
                className="glass-card-hover p-6 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${ps.color} flex items-center justify-center shadow-lg`}>
                  <ps.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-dark-500 text-xs font-bold uppercase tracking-widest mb-2">
                  Step {ps.step}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{ps.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{ps.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Intelligent Freshness Monitoring
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto">
            Everything you need to monitor, predict, and optimize food quality across your supply chain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="glass-card-hover p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-card p-8 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Powered By</h2>
            <p className="text-dark-400 text-sm">Industry-leading AI and modern web technologies</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'YOLOv8', desc: 'Object Detection' },
              { name: 'LightGBM', desc: 'Shelf-Life ML' },
              { name: 'FastAPI', desc: 'Backend API' },
              { name: 'React', desc: 'Frontend UI' },
              { name: 'PostgreSQL', desc: 'Database' },
              { name: 'Docker', desc: 'Deployment' },
            ].map((tech) => (
              <div key={tech.name} className="p-4 rounded-xl bg-dark-800/30 border border-dark-700/20 text-center">
                <p className="text-white font-semibold text-sm">{tech.name}</p>
                <p className="text-dark-500 text-xs mt-0.5">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
          <h2 className="text-3xl font-bold text-white mb-4 relative">
            Ready to reduce food waste?
          </h2>
          <p className="text-dark-400 mb-8 max-w-lg mx-auto relative">
            Join the platform trusted by consumers, retailers, and warehouse operators
            for intelligent food freshness monitoring.
          </p>
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="btn-primary text-base px-8 py-4 relative"
          >
            Start Monitoring Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-dark-500 text-sm">
            © 2024 FreshSense AI — Food Freshness Monitoring Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
