import { motion } from "framer-motion";
import { UserPlus, Upload, Key, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up and access your personal dashboard in seconds.",
  },
  {
    icon: Upload,
    title: "Upload Your Data",
    description: "Add PDFs, docs, markdown, or paste text directly.",
  },
  {
    icon: Key,
    title: "Get Your API Key",
    description: "Generate a secure API key from your dashboard.",
  },
  {
    icon: Rocket,
    title: "Go Live",
    description: "Install the widget and your chatbot is ready to serve.",
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
    <section id="how-it-works" className="relative py-24 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
            Simple Setup
          </span>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Up and running in{" "}
            <span className="text-gradient">four steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From signup to live chatbot in minutes. No complex configuration required.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl"
        >
          {/* Vertical Connection Line */}
          <div className="absolute left-[50%] top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent lg:block" />

          <div className="grid gap-8 lg:gap-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className={`relative flex flex-col items-center gap-6 lg:flex-row lg:gap-16 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className={`flex-1 text-center ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div className="inline-block">
                    <span className="mb-2 inline-block text-5xl font-bold text-primary/20">
                      0{index + 1}
                    </span>
                    <h3 className="mb-2 text-xl font-bold sm:text-2xl">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Icon */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-card shadow-xl shadow-primary/15">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>

                {/* Spacer for layout */}
                <div className="hidden flex-1 lg:block" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
