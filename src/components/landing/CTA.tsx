import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow mb-8">
            <MessageSquare className="w-8 h-8 text-primary-foreground" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to transform your customer experience?
          </h2>

          <p className="text-lg text-muted-foreground mb-10">
            Join companies using Clarvobot to deliver instant, accurate responses to their customers—powered by their own knowledge base.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="link"  className="group">
              Start Building Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="link">
              Talk to Sales
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Free tier available • No credit card required • Setup in 5 minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
};
