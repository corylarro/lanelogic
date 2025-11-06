import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Eye,
  Waves,
  Mail,
} from "lucide-react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const featuresRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);

  // Intersection Observer for feature animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturesVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send to your backend
      console.log("Email submitted:", email);
    }
  };

  const features = [
    {
      icon: CheckCircle,
      title: "Create Meets Easily",
      description: "Set up events, lanes, and swimmers in seconds.",
      delay: "0ms",
    },
    {
      icon: Users,
      title: "Drag-and-Drop Heat Builder",
      description: "Organize heats visually, no spreadsheets needed.",
      delay: "200ms",
    },
    {
      icon: Eye,
      title: "Instant Public Results",
      description: "Publish clean, shareable results pages for every event.",
      delay: "400ms",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Navigation Header */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Waves size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#0E1F2B]">LaneLogic</h1>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/app"
              className="px-4 py-2 text-[#0E1F2B] hover:text-blue-600 font-medium transition-colors"
            >
              Try Demo
            </a>
            <a
              href="/app"
              className="px-6 py-2 bg-[#0E1F2B] hover:bg-[#1a2f3e] text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Launch App
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-cyan-200/30 to-blue-300/20 animate-pulse"></div>
        </div>

        {/* Ripple effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/10 rounded-full animate-ping"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-200/10 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-20">
          <div className="mb-8">
            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0E1F2B] mb-6 leading-tight">
              Smarter meet management
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                for swim coaches
              </span>
            </h1>

            {/* Updated Subheading */}
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Create heats, track results, and publish meet sheets in minutes —
              no more spreadsheets or chaos.
            </p>
          </div>

          {/* CTA Form */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <a
                href="/app"
                className="flex-1 px-8 py-4 bg-[#0E1F2B] hover:bg-[#1a2f3e] text-white font-semibold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Try Free Demo
                <ArrowRight size={20} />
              </a>
              <button
                onClick={() =>
                  document
                    .getElementById("waitlist-form")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-white hover:bg-slate-50 text-[#0E1F2B] font-semibold text-lg rounded-xl border-2 border-[#0E1F2B] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Join Waitlist
                <Mail size={20} />
              </button>
            </div>
          </div>

          {/* Reassuring note */}
          <p className="text-slate-500 text-sm mb-16">
            No credit card required.
          </p>

          {/* Real Dashboard Screenshot */}
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-slate-800 rounded-2xl p-4 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-lg overflow-hidden shadow-inner">
                <div className="bg-slate-100 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-slate-500">
                    lanelogic.com/app
                  </div>
                </div>
                {/* Real Dashboard Screenshot */}
                <div className="relative overflow-hidden">
                  <img
                    src="https://ucarecdn.com/51e544e5-6ab5-44e0-8d7e-edc727e7a033/-/format/auto/"
                    alt="LaneLogic Dashboard showing swim meet management interface"
                    className="w-full h-auto object-cover"
                    onLoad={() => setStatsAnimated(true)}
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-blue-600/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
            {/* Reflection effect */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-100/50 to-transparent transform translate-y-16 blur-sm"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0E1F2B] mb-6">
              Built for busy coaches
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Stop wrestling with spreadsheets and timing systems. LaneLogic
              handles the complexity so you can focus on coaching.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`
                    bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-500 group
                    ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                  `}
                  style={{
                    transitionDelay: featuresVisible ? feature.delay : "0ms",
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={28} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0E1F2B] mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section with Waitlist Form */}
      <section
        id="waitlist-form"
        className="py-24 bg-gradient-to-r from-[#0E1F2B] to-blue-900"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Be part of the first wave
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            We're inviting early coaches to shape LaneLogic before public
            release.
          </p>

          {/* Enhanced Waitlist Form */}
          {!isSubmitted ? (
            <form
              onSubmit={handleWaitlistSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6"
            >
              <div className="flex-1 relative">
                <Mail
                  className="absolute left-[18px] top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-[14px] border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow-sm"
                  style={{ fontSize: "16px", padding: "14px 18px 14px 48px" }}
                  required
                />
              </div>
              <button
                type="submit"
                className="px-[18px] py-[14px] bg-white hover:bg-slate-50 text-[#0E1F2B] font-semibold text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                style={{ fontSize: "16px", minHeight: "52px" }}
              >
                Join Early Access
                <ArrowRight size={20} />
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto p-6 bg-green-500/20 border border-green-300/30 rounded-xl mb-6">
              <div className="flex items-center justify-center gap-3 text-green-100">
                <CheckCircle size={24} />
                <span className="text-lg font-semibold">
                  You're on the list!
                </span>
              </div>
              <p className="text-green-200 mt-2">
                We'll notify you when LaneLogic is ready.
              </p>
            </div>
          )}

          <p className="text-blue-200 text-sm">
            Or{" "}
            <a
              href="/app"
              className="underline hover:text-white transition-colors"
            >
              try the demo now
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Waves size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">LaneLogic</h3>
                <p className="text-slate-400 text-sm">
                  Built by LaneLogic | © 2025
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
              <span>·</span>
              <a href="/app" className="hover:text-white transition-colors">
                App
              </a>
            </div>
          </div>

          {/* Credibility tagline */}
          <div className="text-center mt-8 pt-6 border-t border-slate-700">
            <p className="text-slate-500 text-sm">
              Built by coaches, for coaches.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .flex-col input {
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
}
