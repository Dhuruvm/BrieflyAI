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
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'green': return 'text-green-600 dark:text-green-400';
      case 'amber': return 'text-amber-600 dark:text-amber-400';
      case 'red': return 'text-red-600 dark:text-red-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getBgColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'green': return 'bg-green-50 dark:bg-green-900/20';
      case 'amber': return 'bg-amber-50 dark:bg-amber-900/20';
      case 'red': return 'bg-red-50 dark:bg-red-900/20';
      default: return 'bg-blue-50 dark:bg-blue-900/20';
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
        <Card className="note-card bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-heading text-blue-600 dark:text-blue-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Title</h3>
            </div>
            <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{note.title}</h4>
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
        <Card className="note-card bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-file-text text-green-600 dark:text-green-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Summary</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{note.summary}</p>
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
        <Card className="note-card bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-list-ul text-amber-600 dark:text-amber-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Key Points</h3>
            </div>
            <ul className="space-y-3">
              {note.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
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
        <Card className="note-card bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-tasks text-red-600 dark:text-red-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Action Items</h3>
            </div>
            <div className="space-y-3">
              {note.actionItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <Checkbox className="mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
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
          <Card className="note-card bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-image text-green-600 dark:text-green-400"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Visual Cards</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {note.visualCards.map((card, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 text-center">
                    <i className={`${card.icon} ${getColorClass(card.color)} text-2xl mb-2`}></i>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{card.label}</p>
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
        <Button 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
          onClick={() => window.open(`/api/notes/${note.id}/download-pdf`, '_blank')}
        >
          <i className="fas fa-download mr-2"></i>
          Export PDF
        </Button>
        <Button 
          variant="outline"
          className="flex-1 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
        >
          <i className="fas fa-share mr-2"></i>
          Share URL
        </Button>
      </motion.div>
    </div>
  );
}
