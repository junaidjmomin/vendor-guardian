import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, Zap, Network, BarChart3, Lock, ArrowRight, ChevronRight, Globe, Bell, Activity, Sparkles, Check, ArrowUpRight, Radar } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import featureNetwork from "@/assets/feature-network.jpg";
import eyeGlow from "@/assets/eye-glow.png";
import logoIcon from "@/assets/logo-icon.png";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
};

const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const childFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const features = [
  { icon: Shield, title: "9-Dimension Scoring", desc: "AI composite across cyber, regulatory, operational, financial & ESG.", span: "col-span-1" },
  { icon: Zap, title: "Real-Time Threat Intel", desc: "Dark web, CVE tracking, CERT-In 6hr SLA automation.", span: "col-span-1" },
  { icon: Network, title: "Fourth-Party Mapping", desc: "Force-directed graph of hidden vendor dependencies.", span: "col-span-1 md:col-span-2", hasImage: true },
  { icon: BarChart3, title: "Regulatory Exposure", desc: "Auto-mapped RBI, CERT-In, DPDP, SEBI compliance.", span: "col-span-1" },
  { icon: Lock, title: "Consortium Intel", desc: "Anonymous threat sharing via privacy-preserving DLT.", span: "col-span-1" },
  { icon: Activity, title: "Predictive Analytics", desc: "ML risk trajectory forecasting with early warnings.", span: "col-span-1" },
];

const stats = [
  { value: "10,000+", label: "Vendors Monitored", suffix: "" },
  { value: "99.9", label: "Uptime SLA", suffix: "%" },
  { value: "<6", label: "CERT-In Response", suffix: "hrs" },
  { value: "50+", label: "Banks Trust Us", suffix: "" },
];

const logos = ["HDFC Bank", "ICICI Bank", "SBI", "Kotak", "Axis Bank", "IndusInd"];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[900px] h-[900px] bg-primary/[0.03] rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-rbi/[0.02] rounded-full blur-[180px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-4 mt-3">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between glass rounded-2xl">
            <div className="flex items-center gap-3">
              <img src={logoIcon} alt="Third Eye" className="h-7 w-7 rounded-lg" />
              <span className="font-display text-base font-bold text-foreground tracking-tight">Third Eye</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {["Features", "Platform", "Pricing"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors font-body relative group">
                  {item}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden sm:block text-[13px] text-muted-foreground hover:text-foreground transition-colors font-body">Sign in</button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-display text-[13px] font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-40 pb-32 px-6">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <motion.div style={{ y: heroY, scale: heroScale, opacity: heroOpacity }} className="max-w-6xl mx-auto text-center relative">
          <motion.div initial="hidden" animate="visible" className="space-y-8">
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card mx-auto">
              <div className="h-2 w-2 rounded-full bg-risk-stable animate-pulse" />
              <span className="text-[12px] font-body text-muted-foreground font-medium">Now monitoring <span className="text-foreground font-semibold">10,000+ vendors</span> across India</span>
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.02] tracking-tight">
              <span className="font-display text-foreground">See every</span>
              <br />
              <span className="font-serif italic text-gradient-hero">vendor risk</span>
              <br />
              <span className="font-display text-foreground">before it hits.</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body">
              AI-powered third-party risk intelligence for India's financial sector. 
              <span className="text-foreground"> 9 risk dimensions. Real-time monitoring. Regulatory compliance.</span>
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-4 justify-center pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="group px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base hover:brightness-110 transition-all shadow-2xl shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-1 flex items-center gap-3"
              >
                Launch Command Center
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-2xl glass text-foreground font-display font-semibold text-base hover:bg-secondary/30 transition-all flex items-center gap-2.5 hover:-translate-y-1">
                Watch 2-min Demo
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Trust logos */}
            <motion.div custom={4} variants={fadeUp} className="pt-12">
              <p className="text-[11px] text-muted-foreground/50 font-body uppercase tracking-[0.3em] mb-5">Trusted by India's leading banks</p>
              <div className="flex flex-wrap justify-center gap-8">
                {logos.map((name) => (
                  <div key={name} className="px-4 py-2 rounded-xl bg-secondary/20 border border-border/20">
                    <span className="text-xs font-display font-bold text-muted-foreground/40 tracking-wider">{name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero dashboard image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto mt-20 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent rounded-[2rem] blur-2xl" />
          <div className="relative glass rounded-3xl p-1.5 shadow-2xl shadow-primary/5 shine-sweep">
            <img src={heroDashboard} alt="Third Eye Command Center Dashboard" className="w-full rounded-[1.25rem]" />
            {/* Overlay glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={childFade} className="bento-card text-center">
                <p className="font-display text-4xl sm:text-5xl font-black text-foreground">
                  {stat.value}<span className="text-primary text-2xl">{stat.suffix}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2 font-body">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features — Bento Grid */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-[11px] font-body text-primary font-semibold uppercase tracking-[0.3em] mb-4">Capabilities</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.05]">
              <span className="font-display">Built for </span>
              <span className="font-serif italic text-gradient-hero">regulatory rigor.</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-5 max-w-xl font-body">
              Purpose-built for Indian financial institutions navigating complex compliance requirements.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={childFade}
                className={`bento-card group ${feature.span} ${feature.hasImage ? 'min-h-[240px]' : ''}`}
              >
                {feature.hasImage && (
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <img src={featureNetwork} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                  </div>
                )}
                <div className="relative">
                  <div className="h-11 w-11 rounded-2xl bg-primary/8 border border-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/12 group-hover:scale-105 transition-all duration-300">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-body">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Visual — Split Layout */}
      <section id="platform" className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <p className="text-[11px] font-body text-primary font-semibold uppercase tracking-[0.3em]">Intelligence Engine</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-[1.08]">
                <span className="font-display">Map your entire </span>
                <span className="font-serif italic text-gradient-hero">risk landscape.</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Globe, text: "Dark web & OSINT monitoring across 50+ threat feeds", label: "MONITORING" },
                  { icon: Radar, text: "6-hour CERT-In compliance countdown with automated workflow", label: "COMPLIANCE" },
                  { icon: Eye, text: "Fourth-party dependency graphs with force-directed visualization", label: "VISIBILITY" },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bento-card !p-4 flex items-center gap-4"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-body text-primary/60 font-bold uppercase tracking-[0.2em] mb-0.5">{item.label}</p>
                      <p className="text-sm text-muted-foreground font-body leading-snug">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="group px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2.5 hover:-translate-y-0.5"
              >
                Explore Platform
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-8 bg-primary/[0.03] rounded-[3rem] blur-3xl" />
              <div className="relative">
                {/* Floating eye glow */}
                <div className="absolute -top-12 -right-8 z-10">
                  <img src={eyeGlow} alt="" className="h-32 w-32 float-slow opacity-60" />
                </div>
                <div className="glass rounded-3xl p-1.5 shine-sweep">
                  <img src={featureNetwork} alt="Network topology" className="rounded-[1.25rem] w-full" />
                </div>
                {/* Floating stat cards */}
                <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-risk-stable/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-risk-stable" />
                    </div>
                    <div>
                      <p className="font-mono text-lg font-bold text-foreground">87%</p>
                      <p className="text-[10px] text-muted-foreground font-body">Compliance Score</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 glass rounded-2xl p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-risk-high animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-risk-high">3 CRITICAL</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative"
        >
          <div className="bento-card !p-16 shine-sweep">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <h2 className="text-4xl sm:text-6xl font-extrabold text-foreground relative leading-[1.05]">
              <span className="font-display">Ready to </span>
              <span className="font-serif italic text-gradient-hero">see clearly?</span>
            </h2>
            <p className="text-muted-foreground mt-5 max-w-lg mx-auto text-lg relative font-body">
              Join India's forward-thinking financial institutions using AI-powered vendor risk intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10 relative">
              <button
                onClick={() => navigate("/dashboard")}
                className="group px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base hover:brightness-110 transition-all shadow-2xl shadow-primary/25 flex items-center gap-2.5 hover:-translate-y-1"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-8 relative">
              {["No credit card", "14-day trial", "SOC 2 compliant"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-risk-stable" />
                  <span className="font-body">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-12">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={logoIcon} alt="Third Eye" className="h-8 w-8 rounded-lg" />
                <span className="font-display text-lg font-bold text-foreground">Third Eye</span>
              </div>
              <p className="text-sm text-muted-foreground/60 font-body max-w-xs leading-relaxed">
                AI-powered vendor risk intelligence built for India's financial ecosystem.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-body font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">Product</p>
              <div className="space-y-3">
                {["Features", "Pricing", "Security", "Changelog"].map((item) => (
                  <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-body">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-body font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">Company</p>
              <div className="space-y-3">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-body">{item}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground/30 font-body">© 2024 Third Eye. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a key={item} href="#" className="text-xs text-muted-foreground/30 hover:text-muted-foreground transition-colors font-body">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
