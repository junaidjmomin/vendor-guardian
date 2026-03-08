import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, Zap, Network, BarChart3, Lock, ArrowRight, ChevronRight, Globe, Bell, Activity } from "lucide-react";
import heroShield from "@/assets/hero-shield.png";
import featureRisk from "@/assets/feature-risk.png";
import logoIcon from "@/assets/logo-icon.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
};

const features = [
  { icon: Shield, title: "9-Dimension Risk Scoring", desc: "AI-driven composite scoring across cybersecurity, regulatory, operational, financial, and ESG dimensions." },
  { icon: Zap, title: "Real-Time Threat Intel", desc: "Dark web monitoring, CVE tracking, and CERT-In compliance clocks with 6-hour SLA automation." },
  { icon: Network, title: "Fourth-Party Mapping", desc: "Visualize hidden dependencies in your vendor ecosystem with force-directed graph analysis." },
  { icon: BarChart3, title: "Regulatory Exposure", desc: "Auto-mapped compliance against RBI, CERT-In, DPDP Act, and SEBI frameworks." },
  { icon: Lock, title: "Consortium Intelligence", desc: "Anonymous threat sharing across financial institutions via privacy-preserving analytics." },
  { icon: Activity, title: "Predictive Analytics", desc: "ML-powered risk trajectory forecasting with early warning indicators and trend analysis." },
];

const stats = [
  { value: "10K+", label: "Vendors Monitored" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<6hr", label: "CERT-In Response" },
  { value: "50+", label: "Banks Trust Us" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-subtle">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Third Eye" className="h-8 w-8" />
            <span className="font-display text-lg font-bold text-foreground tracking-tight">Third Eye</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#platform" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Platform</a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Results</a>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-display text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            Launch Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-rbi/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="visible" className="space-y-8">
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
              <div className="h-1.5 w-1.5 rounded-full bg-risk-stable animate-pulse" />
              <span className="text-xs font-display text-primary font-medium tracking-wide">AI-Powered Risk Intelligence</span>
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              <span className="text-foreground">See Every</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent">Vendor Risk</span>
              <br />
              <span className="text-foreground">Before It Hits</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Real-time third-party risk intelligence for India's financial sector. Monitor 10,000+ vendors across 9 risk dimensions with AI-driven scoring and regulatory compliance automation.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="group px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-base hover:brightness-110 transition-all shadow-xl shadow-primary/25 flex items-center gap-2"
              >
                Enter Command Center
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-3.5 rounded-xl border border-border text-foreground font-display font-semibold text-base hover:bg-secondary transition-all flex items-center gap-2">
                Watch Demo
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>

            <motion.div custom={4} variants={fadeUp} className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[0,1,2,3].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center">
                    <span className="text-[10px] font-mono text-muted-foreground">{['RB','HD','IC','SB'][i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Trusted by <span className="text-foreground font-semibold">50+ leading banks</span> across India</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-rbi/10 rounded-3xl blur-3xl" />
            <img
              src={heroShield}
              alt="Third Eye Risk Intelligence Platform"
              className="relative w-full rounded-2xl float-slow"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section id="stats" className="py-16 px-6 border-y border-border/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="font-display text-4xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-display font-semibold tracking-widest text-primary uppercase">Capabilities</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mt-3 text-foreground">
              Built for <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">Regulatory Rigor</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Purpose-built for Indian financial institutions navigating RBI, CERT-In, and DPDP compliance requirements.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group relative rounded-2xl bg-card border border-border p-7 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform visual */}
      <section id="platform" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src={featureRisk} alt="Risk network visualization" className="rounded-2xl border border-border shadow-2xl shadow-primary/5" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <span className="text-xs font-display font-semibold tracking-widest text-primary uppercase">Intelligence Engine</span>
            <h2 className="font-heading text-4xl font-bold text-foreground leading-tight">
              Map Your Entire Vendor Risk Landscape
            </h2>
            <div className="space-y-5">
              {[
                { icon: Globe, text: "Dark web & OSINT monitoring across 50+ threat feeds" },
                { icon: Bell, text: "6-hour CERT-In compliance countdown automation" },
                { icon: Eye, text: "Fourth-party dependency graphs with force-directed visualization" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="group px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              Explore the Platform
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl bg-gradient-to-br from-card via-card to-secondary border border-border p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground relative">
            Ready to See Clearly?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg relative">
            Join India's most forward-thinking financial institutions using AI-powered vendor risk intelligence.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8 relative">
            <button
              onClick={() => navigate("/dashboard")}
              className="group px-10 py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-base hover:brightness-110 transition-all shadow-xl shadow-primary/25 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Third Eye" className="h-6 w-6 opacity-60" />
            <span className="font-display text-sm text-muted-foreground">Third Eye Risk Intelligence</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 Third Eye. Built for India's financial ecosystem.</p>
        </div>
      </footer>
    </div>
  );
}