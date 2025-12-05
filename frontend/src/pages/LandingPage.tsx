import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Dumbbell, TrendingUp, Users, Sparkles, Zap, Award } from "lucide-react";
import NeonButton from "../components/NeonButton";
import GlassCard from "../components/GlassCard";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden px-4">
        <div className="text-center z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-sky-light/30 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-sky-blue" />
              <span className="text-sm font-semibold text-slate-700">Level Up Your Fitness Journey</span>
            </motion.div>

            <h1 className="font-display text-7xl md:text-9xl font-black mb-6 text-gradient leading-tight">
              Fit<span className="text-sky-blue">Freak</span>
            </h1>
            
            <p className="text-2xl md:text-3xl mb-4 text-slate-600 font-medium">
              Where Every Rep Counts
            </p>
            
            <p className="text-lg md:text-xl mb-12 text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Transform your workouts into wins. Compete, earn rewards, and build the strongest version of yourself with our revolutionary fitness platform.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-sky-light/20">
                <Dumbbell className="w-5 h-5 text-sky-blue" />
                <span className="font-semibold text-slate-700">Train Hard</span>
              </div>
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-sky-light/20">
                <TrendingUp className="w-5 h-5 text-sky-blue" />
                <span className="font-semibold text-slate-700">Track Progress</span>
              </div>
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-sky-light/20">
                <Award className="w-5 h-5 text-sky-blue" />
                <span className="font-semibold text-slate-700">Win Rewards</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NeonButton
                size="lg"
                variant="primary"
                onClick={() => navigate("/self")}
                className="text-lg px-8 py-4"
              >
                Get Started Now
              </NeonButton>
              <button
                onClick={() => navigate("/auth")}
                className="px-8 py-4 text-lg font-semibold text-sky-blue bg-white/80 backdrop-blur-sm rounded-xl border-2 border-sky-blue/30 hover:bg-white hover:border-sky-blue transition-all duration-300 shadow-md"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-light/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-blue/15 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative z-10 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-gradient">
              Why Choose FitFreak?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Experience fitness like never before with cutting-edge features designed for the modern athlete
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-blue to-sky-light rounded-2xl mb-6 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4 text-slate-800">
                  Real-Time Tracking
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Advanced AI technology monitors your form and counts every rep with precision. Get instant feedback and perfect your technique.
                </p>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-blue to-sky-light rounded-2xl mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4 text-slate-800">
                  Community Challenges
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Join thousands of athletes in epic competitions. Push your limits, climb leaderboards, and celebrate victories together.
                </p>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-blue to-sky-light rounded-2xl mb-6 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4 text-slate-800">
                  Rewards & Achievements
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Earn points, unlock badges, and claim exclusive rewards. Your dedication deserves recognition and real value.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-sky-blue to-sky-light">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black text-white mb-2">50K+</div>
              <div className="text-sky-bg font-semibold">Active Users</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black text-white mb-2">1M+</div>
              <div className="text-sky-bg font-semibold">Workouts Completed</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black text-white mb-2">500+</div>
              <div className="text-sky-bg font-semibold">Daily Challenges</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black text-white mb-2">24/7</div>
              <div className="text-sky-bg font-semibold">Support Available</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center bg-white/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Join the movement. Start your journey today and become part of a community that's redefining what it means to be fit.
          </p>
          <NeonButton size="lg" onClick={() => navigate("/auth")} className="text-lg px-10 py-5">
            Start Your Journey
          </NeonButton>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
