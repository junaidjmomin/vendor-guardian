import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, Zap, Network, BarChart3, Lock, ArrowRight, ChevronRight, Globe, Bell, Activity, Sparkles, Check } from "lucide-react";
import heroShield from "@/assets/hero-shield.png";
import featureRisk from "@/assets/feature-risk.png";
import logoIcon from "@/assets/logo-icon.png";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
};

const features = [
  { icon: Shield, title: "9-Dimension Risk Scoring", desc: "AI-driven composite scoring across cybersecurity, regulatory, operational, financial, and ESG dimensions.", color: "from-primary/20 to-primary/5" },
  { icon: Zap, title: "Real-Time Threat Intel", desc: "Dark web monitoring, CVE tracking, and CERT-In compliance clocks with 6-hour SLA automation.", color: "from-risk-watch/20 to-risk-watch/5" },
  { icon: Network, title: "Fourth-Party Mapping", desc: "Visualize hidden dependencies in your vendor ecosystem with force-directed graph analysis.", color: "from-rbi/20 to-rbi/5" },
  { icon: BarChart3, title: "Regulatory Exposure", desc: "Auto-mapped compliance against RBI, CERT-In, DPDP Act, and SEBI frameworks.", color: "from-risk-stable/20 to-risk-stable/5" },
  { icon: Lock, title: "Consortium Intelligence", desc: "Anonymous threat sharing across financial institutions via privacy-preserving analytics.", color: "from-primary/20 to-primary/5" },
  { icon: Activity, title: "Predictive Analytics", desc: "ML-powered risk trajectory forecasting with early warning indicators and trend analysis.", color: "from-risk-high/20 to-risk-high/5" },
];

const stats = [
  { value: "10K+", label: "Vendors Monitored", icon: Eye },
  { value: "99.9%", label: "Uptime SLA", icon: Shield },
  { value: "<6hr", label: "CERT-In Response", icon: Zap },
  { value: "50+", label: "Banks Trust Us", icon: Globe },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-subtle">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Third Eye" className="h-8 w-8 rounded-lg" />
            <span className="font-display text-lg font-bold text-foreground tracking-tight">Third Eye</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Platform", "Results"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-display relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          >
            Launch Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-36 pb-24 px-6">
        {/* Dot grid bg */}
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        {/* Radial glows */}
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-rbi/4 rounded-full blur-[120px] pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative">
          <motion.div initial="hidden" animate="visible" className="space-y-8">
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-display text-primary font-semibold tracking-wide">AI-Powered Risk Intelligence</span>
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="font-heading text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.05] tracking-tight">
              <span className="text-foreground">See Every</span>
              <br />
              <span className="text-gradient-hero">Vendor Risk</span>
              <br />
              <span className="text-foreground">Before It Hits</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="text-lg text-muted-foreground max-w-lg leading-relaxed font-body">
              Real-time third-party risk intelligence for India's financial sector. Monitor 10,000+ vendors across 9 risk dimensions with AI-driven scoring.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="group px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base hover:brightness-110 transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 hover:-translate-y-0.5 flex items-center gap-2.5"
              >
                Enter Command Center
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-2xl border border-border/60 text-foreground font-display font-semibold text-base hover:bg-secondary/50 transition-all flex items-center gap-2.5 hover:-translate-y-0.5">
                Watch Demo
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>

            <motion.div custom={4} variants={fadeUp} className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2.5">
                {[0,1,2,3].map(i => (
                  <div key={i} className="h-9 w-9 rounded-full bg-gradient-to-br from-secondary to-muted border-2 border-background flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground">{['RB','HD','IC','SB'][i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-body">Trusted by <span className="text-foreground font-semibold">50+ banks</span></p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-rbi/8 rounded-3xl blur-3xl scale-110" />
            <div className="relative glass-card rounded-3xl p-2 shine-sweep">
              <img
                src={heroShield}
                alt="Third Eye Risk Intelligence Platform"
                className="w-full rounded-2xl"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section id="results" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300"
            >
              <stat.icon className="h-5 w-5 text-primary mx-auto mb-3 opacity-60" />
              <p className="font-display text-4xl font-extrabold text-gradient-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1.5 font-display">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-display font-semibold tracking-widest text-primary uppercase mb-6">
              <Sparkles className="h-3.5 w-3.5" /> Capabilities
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold mt-4 text-foreground">
              Built for <span className="text-gradient-hero">Regulatory Rigor</span>
            </h2>
            <p className="text-muted-foreground mt-5 max-w-2xl mx-auto text-lg font-body">
              Purpose-built for Indian financial institutions navigating RBI, CERT-In, and DPDP compliance.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group relative rounded-2xl glass-card p-8 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-body">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform visual */}
      <section id="platform" className="py-28 px-6 relative">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="glass-card rounded-3xl p-2 shine-sweep">
              <img src={featureRisk} alt="Risk network visualization" className="rounded-2xl" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-display font-semibold tracking-widest text-primary uppercase">
              Intelligence Engine
            </span>
            <h2 className="font-heading text-4xl font-extrabold text-foreground leading-tight">
              Map Your Entire Vendor Risk Landscape
            </h2>
            <div className="space-y-4">
              {[
                { icon: Globe, text: "Dark web & OSINT monitoring across 50+ threat feeds" },
                { icon: Bell, text: "6-hour CERT-In compliance countdown automation" },
                { icon: Eye, text: "Fourth-party dependency graphs with force-directed visualization" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 glass-card rounded-xl p-4 hover:-translate-x-1 transition-transform duration-200">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="group px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2.5 hover:-translate-y-0.5"
            >
              Explore the Platform
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl glass-card p-16 relative overflow-hidden shine-sweep"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-foreground relative">
            Ready to See Clearly?
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg relative font-body">
            Join India's most forward-thinking financial institutions using AI-powered vendor risk intelligence.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10 relative">
            <button
              onClick={() => navigate("/dashboard")}
              className="group px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base hover:brightness-110 transition-all shadow-xl shadow-primary/25 flex items-center gap-2.5 hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 relative">
            {["No credit card required", "14-day free trial", "SOC 2 compliant"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-risk-stable" />
                <span className="font-display">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Third Eye" className="h-7 w-7 opacity-50" />
            <span className="font-display text-sm text-muted-foreground/60">Third Eye Risk Intelligence</span>
          </div>
          <p className="text-xs text-muted-foreground/40 font-body">© 2024 Third Eye. Built for India's financial ecosystem.</p>
        </div>
      </footer>
    </div>
  );
}
