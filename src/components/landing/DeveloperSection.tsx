import { motion } from "framer-motion";
import { Terminal, Check } from "lucide-react";

const codeSnippet = `import { ChatWidget } from '@fyrebot/widget';

function App() {
  return (
    <ChatWidget
      apiKey="your-api-key"
      theme={{
        primaryColor: '#10b5cb',
        position: 'bottom-right',
      }}
    />
  );
}`;

const devFeatures = [
  "Install via npm in under a minute",
  "TypeScript support out of the box",
  "React, Vue, and vanilla JS support",
  "Full customization API",
  "Webhook integrations available",
];

export const DeveloperSection = () => {
  return (
    <section id="developers" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-sm text-accent-foreground mb-6">
              <Terminal className="w-4 h-4" />
              <span>For Developers</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Integrate in{" "}
              <span className="text-gradient">minutes</span>,{" "}
              not days
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Our developer-first approach means you get a clean API, excellent documentation, 
              and minimal boilerplate. Focus on your product, not the integration.
            </p>

            <ul className="space-y-4">
              {devFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right - Code block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
                <span className="text-xs text-muted-foreground ml-2">App.tsx</span>
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-sm font-mono">
                  {codeSnippet.split('\n').map((line, i) => (
                    <div key={i} className="leading-relaxed">
                      <span className="text-muted-foreground/50 select-none mr-4 text-xs">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-muted-foreground">
                        {line
                          .replace(/import|from|function|return|export/g, (match) => `<span class="text-primary">${match}</span>`)
                          .split('').join('')}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
