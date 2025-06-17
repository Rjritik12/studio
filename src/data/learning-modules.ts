
import type { LearningModule } from '@/lib/types';

export const mockLearningModules: LearningModule[] = [
  {
    id: 'jee-physics',
    title: 'JEE Physics Foundation',
    description: 'Core concepts and practice problems for JEE Physics preparation. Covers mechanics, electromagnetism, optics, and modern physics.',
    difficulty: 'medium',
    icon: 'Atom', // Example Lucide icon
    dataAiHint: 'physics equations',
    sections: [
      {
        id: 'kinematics',
        title: 'Kinematics',
        topicForAI: 'JEE Kinematics',
        theory: 'Kinematics is the branch of classical mechanics that describes the motion of points, bodies (objects), and systems of bodies (groups of objects) without considering the forces that cause them to move. Key concepts include displacement, velocity, acceleration, and equations of motion for constant acceleration.'
      },
      {
        id: 'laws-of-motion',
        title: 'Newton\'s Laws of Motion',
        topicForAI: 'JEE Newton\'s Laws of Motion',
        theory: 'Newton\'s laws of motion are three basic laws of classical mechanics that describe the relationship between the motion of an object and the forces acting on it. These laws include the law of inertia, F=ma, and the law of action-reaction.'
      },
      {
        id: 'work-energy-power',
        title: 'Work, Energy, and Power',
        topicForAI: 'JEE Work Energy Power',
        theory: 'This section covers the concepts of work done by a force, kinetic energy, potential energy, the work-energy theorem, and power. Understanding these principles is crucial for solving a wide range of physics problems.'
      },
      {
        id: 'optics',
        title: 'Optics',
        topicForAI: 'JEE Optics',
        theory: 'Optics is the branch of physics that studies the behaviour and properties of light, including its interactions with matter and the construction of instruments that use or detect it. This includes reflection, refraction, lenses, and optical instruments.'
      },
      {
        id: 'electromagnetism',
        title: 'Electromagnetism Basics',
        topicForAI: 'JEE Electromagnetism',
        theory: 'Electromagnetism deals with the electromagnetic force that occurs between electrically charged particles. Key topics include electric fields, magnetic fields, electromagnetic induction, and Maxwell\'s equations (at an introductory level for JEE foundation).'
      }
    ],
  },
  // Future modules can be added here
  // {
  //   id: 'neet-biology',
  //   title: 'NEET Biology Essentials',
  //   description: 'Essential topics for NEET Biology, covering diversity, cell biology, genetics, and ecology.',
  //   difficulty: 'medium',
  //   icon: 'Dna',
  //   dataAiHint: 'biology cells',
  //   sections: [ /* ... sections ... */ ],
  // },
];
