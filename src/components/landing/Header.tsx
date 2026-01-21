import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center p-1">
            <Image src="/logo.png" alt="FyreBot Logo" width={400} height={400} className="object-contain" />
          </div>
          <span className="font-bold text-xl text-foreground">FyreBot</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#developers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Developers
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm">
            <Link href="/login">
            Sign In</Link>
          </Button>
          {/* <Button variant="default" size="sm">
            Get Started
          </Button> */}
        </div>
      </div>
    </motion.header>
  );
};
