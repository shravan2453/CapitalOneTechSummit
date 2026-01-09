import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ChevronRight, ChevronDown, Building2, Sliders, Zap, Download, Lock,
  Scale, Layers, GitBranch, Calculator, TrendingUp, FileText, ShieldCheck, EyeOff, DownloadCloud, Landmark
} from 'lucide-react';
import { Button } from '../components/shared';
import Footer from '../components/Footer';

interface LandingPageProps {
  setPage: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Hide Spline watermark after it loads
  useEffect(() => {
    const hideWatermark = () => {
      const viewer = document.querySelector('spline-viewer');
      if (viewer && viewer.shadowRoot) {
        const shadowRoot = viewer.shadowRoot;
        
        // Hide watermark links and elements in shadow DOM
        const links = shadowRoot.querySelectorAll('a[href*="spline"]');
        links.forEach(link => {
          (link as HTMLElement).style.display = 'none';
          (link as HTMLElement).style.visibility = 'hidden';
          (link as HTMLElement).style.opacity = '0';
        });
        
        // Hide any elements with watermark/logo classes
        const watermarkElements = shadowRoot.querySelectorAll('[class*="watermark"], [class*="logo"], [class*="branding"]');
        watermarkElements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).style.visibility = 'hidden';
          (el as HTMLElement).style.opacity = '0';
        });
      }
    };

    // Try to hide watermark when component mounts and periodically
    hideWatermark();
    const interval = setInterval(hideWatermark, 1000);
    
    // Also use MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      hideWatermark();
    });
    
    const viewer = document.querySelector('spline-viewer');
    if (viewer) {
      observer.observe(viewer, { childList: true, subtree: true });
    }
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav 
        className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md border-b border-gray-200"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => setPage('landing')}
            >
              {/* Red Crescent Shape */}
              <div 
                className="h-10 w-10 mr-3 flex items-center justify-center"
                style={{
                  position: 'relative'
                }}
              >
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 40 40" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M20 5 C 30 5, 35 10, 35 20 C 35 30, 30 35, 20 35" 
                    stroke="#C8102E" 
                    strokeWidth="6" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {/* Text */}
              <div className="flex flex-col">
                <span 
                  className="font-bold text-2xl leading-none text-cap-red"
                  style={{
                    fontFamily: 'sans-serif',
                    letterSpacing: '-0.02em'
                  }}
                >
                  ONE
                </span>
                <span 
                  className="text-sm font-medium text-gray-600 leading-none mt-0.5"
                  style={{
                    fontFamily: 'sans-serif',
                    letterSpacing: '0.01em'
                  }}
                >
                  LOAN
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <a 
                href="#features" 
                onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-sm font-medium text-gray-900 hover:text-cap-red transition-colors"
              >
                Features
              </a>
              <a 
                href="#how" 
                onClick={(e) => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-sm font-medium text-gray-900 hover:text-cap-red transition-colors"
              >
                How it Works
              </a>
              <a 
                href="#scenarios" 
                onClick={(e) => { e.preventDefault(); document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-sm font-medium text-gray-900 hover:text-cap-red transition-colors"
              >
                Scenarios
              </a>
              <a 
                href="#optimizer" 
                onClick={(e) => { e.preventDefault(); document.getElementById('optimizer')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-sm font-medium text-gray-900 hover:text-cap-red transition-colors"
              >
                Optimizer
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setPage('login')} 
                className="text-sm font-medium text-cap-navy hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <Button 
                variant="primary" 
                onClick={() => setPage('signup')}
                className="text-sm px-4 py-2"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section 
        className="relative text-white overflow-hidden pt-16"
      >
        {/* Spline 3D Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <spline-viewer 
            url="https://prod.spline.design/yIl02krjS1EQdnqY/scene.splinecode"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          ></spline-viewer>
        </div>
        
        {/* Overlay for better text readability */}
        <div 
          className="absolute inset-0 bg-black/30 z-[1]"
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-[2]">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-left mb-12 lg:mb-0">
              <div 
                className="px-8 py-8 rounded-xl border-2 border-white/50 mb-8"
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight text-white drop-shadow-lg">
                Borrow smarter.<br />
                Repay faster.<br />
                <span className="text-red-300">Stress less.</span>
              </h1>
                <p 
                  className="text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 text-white/90 font-normal"
                  style={{
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Compare loans, build scenarios, and discover the best repayment plan tailored to your financial goals.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6">
              <Button 
                variant="primary" 
                onClick={() => setPage('signup')}
                className="px-8 py-4 text-base"
              >
                Create Free Account <ArrowRight className="ml-2 w-4 h-4 inline" />
              </Button>
              <button 
                onClick={() => setPage('login')}
                className="px-8 py-4 text-base font-semibold rounded-xl text-white border-2 border-white/50 hover:bg-white/20 hover:border-white transition-all duration-200"
                style={{
                  background: 'transparent',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Sign In
              </button>
              </div>
            </div>
            
            {/* 3D Card Stack Visual */}
            <div className="lg:col-span-6 relative h-[400px] w-full flex items-center justify-center">
              {/* Back Card */}
              <div 
                className="absolute w-[80%] h-64 rounded-xl border border-white/10 shadow-xl transform rotate-6 translate-x-8 translate-y-4 z-0"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(10px)'
                }}
              ></div>
              
              {/* Middle Card */}
              <div 
                className="absolute w-[85%] rounded-xl shadow-2xl p-6 transform -rotate-3 text-gray-900 z-10 border border-cap-red/20"
                style={{
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 8px 16px rgba(200, 16, 46, 0.2)'
                }}
              >
                <div className="flex justify-between items-center mb-4 border-b border-cap-red/10 pb-2">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Top Strategy</span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">#1 Recommended</span>
                </div>
                <div className="flex items-end space-x-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Monthly</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">$342</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div>
                    <p className="text-sm text-gray-600">Total Savings</p>
                    <p className="text-3xl font-bold text-cap-red tracking-tight">$12k</p>
                  </div>
                </div>
                {/* Mini Chart */}
                <div className="flex items-end space-x-2 h-16 w-full mt-2">
                  <div className="w-1/5 bg-gray-200 rounded-t h-[40%]"></div>
                  <div className="w-1/5 bg-gray-200 rounded-t h-[55%]"></div>
                  <div className="w-1/5 bg-gray-200 rounded-t h-[70%]"></div>
                  <div className="w-1/5 bg-cap-navy rounded-t h-[85%]"></div>
                  <div className="w-1/5 bg-cap-red rounded-t h-[60%]"></div>
                </div>
              </div>

              {/* Floater Badge */}
              <div 
                className="absolute -right-4 top-20 rounded-lg shadow-lg p-3 z-20 flex items-center gap-3"
                style={{
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 4px 8px rgba(200, 16, 46, 0.15)'
                }}
              >
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Optimization</p>
                  <p className="text-sm font-bold text-gray-900">Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex md:justify-center gap-4 md:gap-8 min-w-max">
            {[
              { icon: Building2, text: 'Federal & Private' },
              { icon: Sliders, text: 'Scenario Builder' },
              { icon: Zap, text: 'Optimization Engine' },
              { icon: Download, text: 'Export Reports' },
              { icon: Lock, text: 'Privacy First' },
            ].map((item, i) => (
              <span 
                key={i}
                className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 text-sm font-medium text-gray-700"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <item.icon className="w-4 h-4 text-cap-navy" />
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Everything you need to manage student debt</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">From raw data to actionable repayment plans, we provide the toolkit to make the math work for you.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Scale, title: 'Loan Comparison', desc: 'Centralize Federal, Private, State, and CFNC loans in one dashboard to see your true total cost.' },
            { icon: Layers, title: 'Strategy Builder', desc: 'Model deferment, interest-only payments, IDR plans, and standard repayment tracks visually.' },
            { icon: GitBranch, title: 'Scenario Planning', desc: 'Create "What-If" scenarios (A/B/C) to compare aggressive payoff versus low-monthly-payment routes.' },
            { icon: Calculator, title: 'Cost Calculator', desc: 'Project interest accrual and payoff timelines with precision down to the penny.' },
            { icon: TrendingUp, title: 'Optimization Engine', desc: 'Set your budget and goals, and let our algorithm rank the top 3 strategies for your wallet.' },
            { icon: FileText, title: 'Export & Reports', desc: 'Download professional PDF summaries and data tables to share with advisors or parents.' },
          ].map((feature, i) => (
            <div 
              key={i}
              className="p-8 rounded-2xl border border-white/30 hover:border-white/50 transition-all group"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                <feature.icon className="w-6 h-6 text-cap-navy" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">How it works</h2>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { num: 1, title: 'Create Profile', desc: 'Input your loan details securely.' },
                { num: 2, title: 'Compare', desc: 'View all your loans side-by-side.' },
                { num: 3, title: 'Build Scenarios', desc: 'Test different repayment paths.' },
                { num: 4, title: 'Optimize', desc: 'Get your #1 recommended plan.', isLast: true },
              ].map((step, i) => (
                <div 
                  key={i}
                  className="p-6 rounded-xl border border-white/30 text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 ring-4 ring-white ${
                      step.isLast ? 'bg-cap-red' : 'bg-cap-navy'
                    } text-white`}
                  >
                    {step.num}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-xs text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scenarios Showcase */}
      <section id="scenarios" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:gap-16">
          <div className="lg:w-1/3 mb-10 lg:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">See the future of your finances</h2>
            <p className="text-gray-600 mb-8">Stop guessing. Visualize how small changes in monthly payments affect your freedom date and total interest paid.</p>
            <button 
              onClick={() => setPage('signup')}
              className="text-cap-red font-semibold flex items-center hover:underline"
            >
              Build My Scenarios <ChevronRight className="ml-1 w-4 h-4" />
            </button>
          </div>
          
          <div className="lg:w-2/3">
            <div 
              className="rounded-xl border border-white/30 overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                <span className="font-semibold text-gray-900">Scenario Comparison</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="border-b border-white/20" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                    <tr>
                      <th className="px-6 py-3 font-medium text-gray-900">Scenario</th>
                      <th className="px-6 py-3 font-medium text-gray-900">Monthly</th>
                      <th className="px-6 py-3 font-medium text-gray-900">Total Cost</th>
                      <th className="px-6 py-3 font-medium text-gray-900">Years</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">A: Federal Standard</td>
                      <td className="px-6 py-4">$280</td>
                      <td className="px-6 py-4">$42,000</td>
                      <td className="px-6 py-4">10.0</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors bg-blue-50/30">
                      <td className="px-6 py-4 font-medium text-cap-navy">B: Private Refi</td>
                      <td className="px-6 py-4">$310</td>
                      <td className="px-6 py-4 text-green-600 font-medium">$38,500</td>
                      <td className="px-6 py-4">8.5</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">C: Aggressive</td>
                      <td className="px-6 py-4">$500</td>
                      <td className="px-6 py-4 text-green-700 font-bold">$34,200</td>
                      <td className="px-6 py-4 font-bold text-gray-900">5.2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optimizer Showcase */}
      <section 
        id="optimizer" 
        className="py-20 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #003087 0%, #0044AA 40%, #C8102E 100%)',
        }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=")`
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="text-cap-red font-bold tracking-wider uppercase text-xs mb-2 block">The Engine</span>
            <h2 className="text-3xl font-bold tracking-tight">Optimized for your priorities</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Controls */}
            <div 
              className="space-y-8 p-8 rounded-2xl border border-white/10 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
              }}
            >
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Minimize Monthly Payment</label>
                  <span className="text-sm font-bold">High</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="80" className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Minimize Total Interest</label>
                  <span className="text-sm font-bold">Med</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="50" className="w-full" />
              </div>
              <Button 
                variant="primary" 
                onClick={() => setPage('signup')}
                className="w-full py-3"
              >
                Run Optimization
              </Button>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              <div 
                className="p-5 rounded-xl shadow-lg transform scale-105 border-l-4 border-white/40 relative border border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="absolute top-0 right-0 bg-cap-red text-white text-xs font-bold px-2 py-1 rounded-bl-lg">RANK #1</div>
                <h4 className="font-bold text-lg text-gray-900">Balanced Strategy</h4>
                <p className="text-sm text-gray-600 mb-2">Optimized for moderate payments & decent savings.</p>
                <div className="flex justify-between items-center text-sm font-medium text-gray-900">
                  <span>$350/mo</span>
                  <span>7 Years</span>
                </div>
              </div>
              <div 
                className="p-5 rounded-xl border border-white/10 opacity-70"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                }}
              >
                <h4 className="font-bold text-lg text-white">Lowest Monthly</h4>
                <p className="text-sm text-slate-300 mb-2">Maximum cash flow now, higher cost later.</p>
                <div className="flex justify-between items-center text-sm font-medium text-white">
                  <span>$210/mo</span>
                  <span>12 Years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Secure Platform', desc: 'Built with modern security standards to protect your simulated data.' },
              { icon: EyeOff, title: 'Privacy First', desc: 'We don\'t sell your data to lenders. You are our customer, not the product.' },
              { icon: DownloadCloud, title: 'Your Data', desc: 'Export your plans and delete your profile anytime.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-white/20"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <item.icon className="w-6 h-6 text-cap-navy" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 tracking-tight">Common Questions</h2>
          
          <div className="space-y-4">
            {[
              { 
                q: 'Federal vs private loans?', 
                a: 'Federal loans often offer protections like income-driven repayment and forgiveness, while private loans are credit-based. Our tool helps you compare both side-by-side.' 
              },
              { 
                q: 'What is deferment?', 
                a: 'Deferment allows you to temporarily stop making payments. However, interest may still accrue depending on your loan type.' 
              },
              { 
                q: 'How does the optimizer decide?', 
                a: 'The optimizer uses a weighted algorithm based on your inputs (total cost vs. monthly cash flow preference) to rank strategies mathematically.' 
              },
            ].map((faq, i) => (
              <div 
                key={i}
                className="rounded-lg border border-white/30 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <button 
                  className="w-full flex justify-between items-center p-5 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(i)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} 
                  />
                </button>
                {openFaq === i && (
                  <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-white/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Ready to take control of repayment?</h2>
          <p className="text-lg text-gray-600 mb-8">Join thousands of students and graduates optimizing their path to debt-free freedom.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              onClick={() => setPage('signup')}
              className="px-8 py-4 text-base"
            >
              Create Free Account
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setPage('login')}
              className="px-8 py-4 text-base"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
