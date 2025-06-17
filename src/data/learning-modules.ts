
import type { LearningModule } from '@/lib/types';

export const mockLearningModules: LearningModule[] = [
  {
    id: 'jee-physics',
    title: 'JEE Physics Foundation',
    description: 'Core concepts and practice problems for JEE Physics preparation. Covers mechanics, electromagnetism, optics, and modern physics.',
    difficulty: 'medium',
    icon: 'Atom',
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
  {
    id: 'neet-biology',
    title: 'NEET Biology Essentials',
    description: 'Essential topics for NEET Biology, covering diversity, cell biology, plant & human physiology, genetics, and ecology.',
    difficulty: 'medium',
    icon: 'Dna',
    dataAiHint: 'biology cells',
    sections: [
      {
        id: 'diversity-living-world',
        title: 'Diversity in Living World',
        topicForAI: 'NEET Diversity in Living World',
        theory: 'This section explores the vast variety of life forms, their classification, and systematic organization. Key concepts include taxonomy, binomial nomenclature, and the five-kingdom classification.'
      },
      {
        id: 'cell-structure-function',
        title: 'Cell Structure and Function',
        topicForAI: 'NEET Cell Biology',
        theory: 'Covers the fundamental unit of life, the cell. Topics include prokaryotic and eukaryotic cells, cell organelles (mitochondria, chloroplasts, ER, Golgi, etc.), cell membrane, and cell cycle (mitosis, meiosis).'
      },
      {
        id: 'plant-physiology',
        title: 'Plant Physiology',
        topicForAI: 'NEET Plant Physiology',
        theory: 'Deals with the life processes of plants, including transport in plants (water, minerals, food), mineral nutrition, photosynthesis, respiration, and plant growth and development (hormones).'
      },
      {
        id: 'human-physiology',
        title: 'Human Physiology',
        topicForAI: 'NEET Human Physiology',
        theory: 'Focuses on the functioning of various organ systems in the human body, such as digestion, breathing, circulation, excretion, locomotion, neural control, and chemical coordination (hormones).'
      },
      {
        id: 'genetics-evolution',
        title: 'Genetics and Evolution',
        topicForAI: 'NEET Genetics and Evolution',
        theory: 'This section covers principles of inheritance and variation (Mendel\'s laws, chromosomal theory), molecular basis of inheritance (DNA, RNA, replication, transcription, translation), and the mechanisms of evolution (Darwinism, natural selection, speciation).'
      }
    ],
  },
  {
    id: 'class-10-maths',
    title: 'Class 10 Maths Fundamentals',
    description: 'Key mathematical concepts for Class 10 students, including real numbers, polynomials, linear equations, quadratic equations, and trigonometry.',
    difficulty: 'easy',
    icon: 'Calculator', // Using Calculator icon
    dataAiHint: 'maths numbers',
    sections: [
      {
        id: 'real-numbers',
        title: 'Real Numbers',
        topicForAI: 'Class 10 Real Numbers',
        theory: 'Introduction to real numbers, Euclid\'s division lemma, fundamental theorem of arithmetic, irrational numbers, decimal expansions of rational numbers.'
      },
      {
        id: 'polynomials',
        title: 'Polynomials',
        topicForAI: 'Class 10 Polynomials',
        theory: 'Zeros of a polynomial, relationship between zeros and coefficients of quadratic polynomials, division algorithm for polynomials.'
      },
      {
        id: 'linear-equations',
        title: 'Pair of Linear Equations in Two Variables',
        topicForAI: 'Class 10 Linear Equations in Two Variables',
        theory: 'Graphical method of solution, algebraic methods (substitution, elimination, cross-multiplication), equations reducible to a pair of linear equations.'
      },
      {
        id: 'quadratic-equations',
        title: 'Quadratic Equations',
        topicForAI: 'Class 10 Quadratic Equations',
        theory: 'Standard form of a quadratic equation, solution by factorization, solution by completing the square, quadratic formula, nature of roots.'
      },
      {
        id: 'triangles',
        title: 'Triangles',
        topicForAI: 'Class 10 Triangles Similar figures',
        theory: 'Similar figures, similarity of triangles, criteria for similarity (AAA, SSS, SAS), areas of similar triangles, Pythagoras theorem.'
      },
      {
        id: 'trigonometry-intro',
        title: 'Introduction to Trigonometry',
        topicForAI: 'Class 10 Introduction to Trigonometry',
        theory: 'Trigonometric ratios of an acute angle of a right-angled triangle, trigonometric ratios of specific angles (0°, 30°, 45°, 60°, 90°), trigonometric identities.'
      }
    ],
  },
];

