import { motion } from "framer-motion";
import { FileText, Database, Shield, Palette, Code2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const dataFormats = [
  { label: "PDF", icon: "📄" },
  { label: "DOCX", icon: "📝" },
  { label: "Markdown", icon: "📋" },
  { label: "JSON", icon: "🗂️" },
  { label: "Plain Text", icon: "📃" },
];

const features = [
  {
    icon: Database,
    title: "Your Data Only",
    description: "Chatbot responds exclusively from your uploaded content. No external knowledge, no hallucinations.",
  },
  {
    icon: Shield,
    title: "Privacy-First",
    description: "Your data stays yours. Encrypted at rest and in transit. Enterprise-grade security.",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Match your brand with custom colors, positioning, and behavior. Make it truly yours.",
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description: "Lightning-fast AI responses powered by state-of-the-art language models.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Data Training Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Train on Your Data
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload your knowledge base and watch your chatbot become an expert on your content.
          </p>

          {/* Supported formats */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {dataFormats.map((format) => (
              <motion.div
                key={format.label}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-all shadow-sm hover:shadow-md"
              >
                <span className="text-xl">{format.icon}</span>
                <span className="font-medium text-foreground">{format.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="flex gap-5 p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover:shadow-lg group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
