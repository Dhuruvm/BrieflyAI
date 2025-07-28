import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Note } from "@shared/schema";

interface NoteCardsProps {
  note: Note;
}

export default function NoteCards({ note }: NoteCardsProps) {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'text-ai-blue';
      case 'green': return 'text-ai-green';
      case 'amber': return 'text-ai-amber';
      case 'red': return 'text-ai-red';
      default: return 'text-ai-blue';
    }
  };

  const getBgColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-ai-blue/20';
      case 'green': return 'bg-ai-green/20';
      case 'amber': return 'bg-ai-amber/20';
      case 'red': return 'bg-ai-red/20';
      default: return 'bg-ai-blue/20';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="note-card bg-ai-surface border-ai-border">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-ai-blue/20 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-heading text-ai-blue"></i>
              </div>
              <h3 className="text-xl font-semibold">Title</h3>
            </div>
            <h4 className="text-2xl font-bold text-ai-blue">{note.title}</h4>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="note-card bg-ai-surface border-ai-border">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-ai-green/20 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-file-text text-ai-green"></i>
              </div>
              <h3 className="text-xl font-semibold">Summary</h3>
            </div>
            <p className="text-ai-text-secondary leading-relaxed">{note.summary}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Points Card */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="note-card bg-ai-surface border-ai-border">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-ai-amber/20 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-list-ul text-ai-amber"></i>
              </div>
              <h3 className="text-xl font-semibold">Key Points</h3>
            </div>
            <ul className="space-y-3">
              {note.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-ai-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-ai-text-secondary">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Items Card */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="note-card bg-ai-surface border-ai-border">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-ai-red/20 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-tasks text-ai-red"></i>
              </div>
              <h3 className="text-xl font-semibold">Action Items</h3>
            </div>
            <div className="space-y-3">
              {note.actionItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <Checkbox className="mr-3" />
                  <span className="text-ai-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Visual Cards */}
      {note.visualCards && note.visualCards.length > 0 && (
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="note-card bg-ai-surface border-ai-border">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-ai-green/20 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-image text-ai-green"></i>
                </div>
                <h3 className="text-xl font-semibold">Visual Cards</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {note.visualCards.map((card, index) => (
                  <div key={index} className="bg-ai-dark p-4 rounded-xl border border-ai-border text-center">
                    <i className={`${card.icon} ${getColorClass(card.color)} text-2xl mb-2`}></i>
                    <p className="text-sm text-ai-text-secondary">{card.label}</p>
                    <p className={`text-xl font-bold ${getColorClass(card.color)}`}>{card.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Export Options */}
      <motion.div
        custom={5}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button className="flex-1 bg-ai-blue hover:bg-ai-blue-dark px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center">
          <i className="fas fa-download mr-2"></i>
          Export PDF
        </Button>
        <Button 
          variant="outline"
          className="flex-1 border-ai-border hover:border-ai-blue px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
        >
          <i className="fas fa-share mr-2"></i>
          Share URL
        </Button>
      </motion.div>
    </div>
  );
}
