import { motion } from "framer-motion";
import { UserPlus, Upload, Key, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up and access your personal dashboard in seconds.",
    step: "01",
  },
  {
    icon: Upload,
    title: "Upload Your Data",
    description: "Add PDFs, docs, markdown, or paste text directly.",
    step: "02",
  },
  {
    icon: Key,
    title: "Get Your API Key",
    description: "Generate a secure API key from your dashboard.",
    step: "03",
  },
  {
    icon: Rocket,
    title: "Go Live",
    description: "Install the widget and your chatbot is ready to serve.",
    step: "04",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4">
            Simple Setup
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Up and running in{" "}
            <span className="text-gradient">four steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From signup to live chatbot in minutes. No complex configuration required.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Horizontal connector line for desktop */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative group"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Step number badge */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-card border-2 border-border group-hover:border-primary/50 transition-all duration-300 flex items-center justify-center shadow-lg group-hover:shadow-glow">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-md">
                      {step.step}
                    </div>
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px]">
                    {step.description}
                  </p>

                  {/* Arrow indicator for mobile/tablet */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden mt-6 w-px h-8 bg-gradient-to-b from-primary/30 to-transparent" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
