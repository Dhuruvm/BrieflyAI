import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Brain, 
  FileText, 
  Zap, 
  Share2, 
  Mic, 
  Smartphone,
  Upload,
  CheckCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import brieflyLogo from "@assets/briefly-logo.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Upload,
      title: "Multi-Format Input",
      description: "Upload text, PDFs, audio recordings, or video URLs. Our AI handles any format seamlessly.",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: FileText,
      title: "Structured Output",
      description: "Get organized notes with title, summary, key points, action items, and visual cards.",
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Watch your notes generate in real-time with smooth animations and instant feedback.",
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: Share2,
      title: "Export & Share",
      description: "Export as PDF or share via URL. Perfect for collaboration and documentation.",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Mic,
      title: "Voice Recording",
      description: "Record directly in the app and get instant transcription and note generation.",
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Fully responsive design with touch-friendly controls for seamless mobile experience.",
      color: "text-purple-600 dark:text-purple-400"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Upload Content",
      description: "Drag and drop or select your file. Supports text, PDFs, audio, and video URLs.",
      icon: Upload,
      color: "bg-blue-500"
    },
    {
      number: 2,
      title: "AI Processing",
      description: "Our AI analyzes your content and extracts key information with advanced NLP.",
      icon: Brain,
      color: "bg-green-500"
    },
    {
      number: 3,
      title: "Get Structured Notes",
      description: "Receive beautifully formatted notes with summaries, key points, and action items.",
      icon: CheckCircle,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="header-modern fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={brieflyLogo} 
                alt="Brevia AI" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-lg font-bold text-foreground">Brevia</h1>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <Badge className="status-pill-success">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            <Button 
              onClick={() => setLocation("/workspace")}
              className="btn-modern-primary"
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 gradient-subtle">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Badge className="mb-6 status-pill">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Advanced AI
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              AI-Powered
              <span className="text-primary"> Research</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform any content into structured, actionable notes. Upload text, PDFs, audio, or video and get intelligent summaries in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setLocation("/workspace")}
                className="btn-modern-primary text-lg px-8 py-4"
                size="lg"
              >
                Start Creating Notes
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="btn-modern-secondary text-lg px-8 py-4"
                size="lg"
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="modern-surface p-8 max-w-4xl mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600"
                alt="Modern AI interface showing note generation"
                className="rounded-xl w-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to transform any content into structured, actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="modern-card h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-6">
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform any content into structured notes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="w-8 h-8 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm font-bold text-foreground">{step.number}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-brand">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Transform Your Content?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of professionals who use Brevia AI to create better notes faster.
            </p>
            <Button
              onClick={() => setLocation("/workspace")}
              className="bg-white text-primary hover:bg-white/90 px-12 py-4 rounded-2xl text-xl font-semibold shadow-xl"
              size="lg"
            >
              Start Creating Notes Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
