import { motion } from "framer-motion";
import { Play } from "lucide-react";

export const VideoSection = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
              <Play className="w-4 h-4" />
              <span>See FyreBot in Action</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Watch How FyreBot Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how to deploy your own AI chatbot in just a few minutes. 
              From installation to integration, we'll show you everything you need to know.
            </p>
          </div>

          {/* Video Container with SEO-friendly structure */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border bg-card"
          >
            {/* Video iframe with SEO attributes */}
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/NohtjPWUdxQ?si=hrcGIiWjLW0njJ9y"
              title="FyreBot Introduction - AI Chatbot Deployment Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              allowTransparency
              aria-controls="none"
              loading="lazy"
            />
          </motion.div>

          {/* Key Takeaways below video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">2 Minutes</div>
              <p className="text-sm text-muted-foreground">Setup Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">Zero Config</div>
              <p className="text-sm text-muted-foreground">Just plug & play</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">100% Control</div>
              <p className="text-sm text-muted-foreground">Your data, your rules</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
