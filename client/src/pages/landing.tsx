import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import brieflyLogo from "@assets/briefly-logo.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: "fas fa-upload",
      title: "Multi-Format Input",
      description: "Upload text, PDFs, audio recordings, or video URLs. Our AI handles any format seamlessly.",
      color: "text-ai-blue"
    },
    {
      icon: "fas fa-list-check",
      title: "Structured Output",
      description: "Get organized notes with title, summary, key points, action items, and visual cards.",
      color: "text-ai-green"
    },
    {
      icon: "fas fa-bolt",
      title: "Real-time Processing",
      description: "Watch your notes generate in real-time with smooth animations and instant feedback.",
      color: "text-ai-amber"
    },
    {
      icon: "fas fa-share-nodes",
      title: "Export & Share",
      description: "Export as PDF or share via URL. Perfect for collaboration and documentation.",
      color: "text-ai-blue"
    },
    {
      icon: "fas fa-microphone",
      title: "Voice Recording",
      description: "Record directly in the app and get instant transcription and note generation.",
      color: "text-ai-green"
    },
    {
      icon: "fas fa-mobile-alt",
      title: "Mobile Optimized",
      description: "Fully responsive design with touch-friendly controls for seamless mobile experience.",
      color: "text-ai-amber"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Upload Content",
      description: "Drag and drop or select your file. Supports text, PDFs, audio, and video URLs.",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      color: "bg-ai-blue"
    },
    {
      number: 2,
      title: "AI Processing",
      description: "Our AI analyzes your content and extracts key information with advanced NLP.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      color: "bg-ai-green"
    },
    {
      number: 3,
      title: "Get Structured Notes",
      description: "Receive beautifully formatted notes with summaries, key points, and action items.",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      color: "bg-ai-amber"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-ai-black/80 backdrop-blur-lg border-b border-ai-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src={brieflyLogo} 
                alt="Briefly.AI" 
                className="h-10 w-auto"
              />
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-ai-text-secondary hover:text-ai-text transition-colors">Features</a>
              <a href="#how-it-works" className="text-ai-text-secondary hover:text-ai-text transition-colors">How it Works</a>
            </div>
            <Button 
              onClick={() => setLocation("/workspace")}
              className="bg-ai-blue hover:bg-ai-blue-dark px-6 py-2 rounded-full font-medium transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="animate-fadeIn"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 logo-text">
              AI-Powered
              <span className="text-ai-blue"> Briefing</span>
            </h1>
            <p className="text-xl md:text-2xl text-ai-text-secondary mb-8 max-w-3xl mx-auto">
              Transform any content into structured, actionable notes. Upload text, PDFs, audio, or video and get intelligent summaries in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setLocation("/workspace")}
                className="bg-ai-blue hover:bg-ai-blue-dark px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 animate-glow"
              >
                Start Creating Notes
              </Button>
              <Button
                variant="outline"
                className="border-ai-border hover:border-ai-blue px-8 py-4 rounded-full text-lg font-medium transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16"
          >
            <img 
              src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600"
              alt="Modern AI interface showing note generation"
              className="rounded-2xl shadow-2xl mx-auto max-w-4xl w-full border border-ai-border"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-ai-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 logo-text">Powerful Features</h2>
            <p className="text-xl text-ai-text-secondary max-w-2xl mx-auto">
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
                className="note-card bg-ai-surface p-8 rounded-2xl border border-ai-border"
              >
                <div className="w-16 h-16 bg-ai-blue/20 rounded-2xl flex items-center justify-center mb-6">
                  <i className={`${feature.icon} ${feature.color} text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-ai-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 logo-text">How It Works</h2>
            <p className="text-xl text-ai-text-secondary max-w-2xl mx-auto">
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
                <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold`}>
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-ai-text-secondary mb-6">{step.description}</p>
                <img 
                  src={step.image}
                  alt={step.title}
                  className="rounded-xl mx-auto"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-ai-blue/20 to-ai-green/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 logo-text">Ready to Transform Your Content?</h2>
            <p className="text-xl text-ai-text-secondary mb-8">
              Join thousands of professionals who use Briefly.AI to create better notes faster.
            </p>
            <Button
              onClick={() => setLocation("/workspace")}
              className="bg-ai-blue hover:bg-ai-blue-dark px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 animate-glow"
            >
              Start Creating Notes Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
