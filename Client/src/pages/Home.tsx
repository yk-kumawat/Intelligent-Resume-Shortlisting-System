import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="dark">
      <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-surface font-body antialiased">
        {/* Subtle AI-Atmosphere Background Element */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-tertiary/5 rounded-full blur-[120px]"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center max-w-4xl px-8 text-center">
          <div className="layout-content-container flex flex-col flex-1">
            <div className="mb-4 inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest text-primary text-xs font-semibold tracking-wider uppercase font-label mx-auto w-max">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              Powered by Neural Ranking
            </div>
            <h1 className="font-headline text-on-surface tracking-tight text-[48px] md:text-[64px] font-extrabold leading-[1.1] pb-6">
              Intelligent Resume <br />
              <span className="text-primary-dim">Shortlisting System</span>
            </h1>
            <p className="font-body text-on-surface-variant text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto pb-10">
              Streamline your recruitment process with high-precision AI-driven candidate ranking and automated screening designed for modern talent teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Action Button: Primary Gradient */}
              <button 
                onClick={() => navigate('/dashboard')}
                className="group relative flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 editorial-gradient text-on-primary text-lg font-bold transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-primary/10"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Screening
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Metadata (Subtle) */}
        <footer className="absolute bottom-10 w-full flex justify-center px-10">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-[11px] font-label uppercase tracking-widest text-on-surface-variant/40">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
              Encrypted Pipeline
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
              Bias-Reduced NLP
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
              Enterprise Scalability
            </div>
          </div>
        </footer>

        {/* Decorative Abstract Graphic */}
        <div className="absolute bottom-0 left-0 w-full h-[307px] opacity-20 pointer-events-none overflow-hidden hidden md:block">
          <div className="w-full h-full flex items-end justify-center gap-1 px-4">
            <div className="w-2 bg-primary h-[10%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[25%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[15%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[40%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[35%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[60%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[50%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[80%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[45%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[70%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[55%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[90%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[65%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[40%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[20%] rounded-t-sm"></div>
            <div className="w-2 bg-primary h-[30%] rounded-t-sm"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
