import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Search className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-6xl font-bold text-foreground">404</h1>
        <p className="mt-3 text-lg text-muted-foreground font-display">Page not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The route <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{location.pathname}</code> doesn't exist.
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:brightness-110 transition-all shadow-sm shadow-primary/20"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl border border-border text-foreground font-display font-semibold text-sm hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;