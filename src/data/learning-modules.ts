
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
        topicForAI: 'JEE Main & Advanced Kinematics (1D and 2D motion)',
        theory: 'This section provides a comprehensive understanding of motion. Key concepts include:\n- Displacement, velocity (average and instantaneous), acceleration (average and instantaneous).\n- Equations of motion for uniformly accelerated linear motion.\n- Graphical representation of motion (x-t, v-t, a-t graphs) and their interpretations.\n- Relative velocity in one and two dimensions.\n- Projectile motion: analysis of motion, range, maximum height, time of flight, and motion on an inclined plane.\n- Uniform circular motion: centripetal acceleration, angular velocity, and relation to linear velocity.\n- Introduction to non-uniform circular motion (tangential and radial acceleration).'
      },
      {
        id: 'laws-of-motion',
        title: 'Newton\'s Laws of Motion',
        topicForAI: 'JEE Main & Advanced Newton\'s Laws of Motion & Friction',
        theory: 'A deep dive into the foundational laws governing motion and forces. Topics include:\n- Newton\'s First Law (Law of Inertia) and inertial frames of reference.\n- Newton\'s Second Law (F=ma): application to various systems, impulse, and momentum.\n- Newton\'s Third Law (Action-Reaction): identifying action-reaction pairs.\n- Free Body Diagrams: systematic approach to problem-solving.\n- Equilibrium of concurrent forces.\n- Friction: static and kinetic friction, laws of friction, rolling friction, applications in block-on-block problems and motion on inclined planes.\n- Dynamics of circular motion: centripetal force, motion in a vertical circle, banking of roads.'
      },
      {
        id: 'work-energy-power',
        title: 'Work, Energy, and Power',
        topicForAI: 'JEE Main & Advanced Work, Energy, Power, and Conservation Laws',
        theory: 'Explores the concepts of work, energy, and power, and their conservation principles. Includes:\n- Work done by a constant force and a variable force (integration method).\n- Kinetic energy and the Work-Energy Theorem.\n- Potential Energy: gravitational potential energy, elastic potential energy (springs).\n- Conservative and non-conservative forces.\n- Conservation of Mechanical Energy.\n- Power: average and instantaneous power.\n- Collisions: elastic and inelastic collisions in one and two dimensions, coefficient of restitution.'
      },
      {
        id: 'optics',
        title: 'Geometrical & Wave Optics',
        topicForAI: 'JEE Main & Advanced Geometrical Optics and Wave Optics',
        theory: 'Covers the behavior of light as rays and waves. Key areas:\n- Geometrical Optics: Reflection and refraction at plane and spherical surfaces, mirrors, lenses (thin lens formula, lens maker\'s formula, magnification, power of a lens), combination of lenses, prisms, dispersion, optical instruments (microscope, telescope).\n- Wave Optics: Huygens\' principle, interference (Young\'s double-slit experiment, coherent sources, path difference, phase difference), diffraction (single slit), polarization.'
      },
      {
        id: 'electromagnetism',
        title: 'Electromagnetism Basics',
        topicForAI: 'JEE Main & Advanced Electrostatics and Magnetism',
        theory: 'Fundamental principles of electric and magnetic fields and their interactions. Includes:\n- Electrostatics: Electric charge, Coulomb\'s law, electric field, electric potential, Gauss\'s law and its applications, capacitors, dielectrics.\n- Current Electricity: Electric current, Ohm\'s law, resistivity, Kirchhoff\'s laws, series and parallel combinations of resistors and cells.\n- Magnetic Effects of Current and Magnetism: Biot-Savart law, Ampere\'s circuital law, magnetic force on a moving charge and current-carrying conductor, torque on a current loop, magnetic dipole moment, Earth\'s magnetism.\n- Electromagnetic Induction and AC: Faraday\'s laws, Lenz\'s law, self and mutual inductance, alternating currents, LCR circuits.'
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
        topicForAI: 'NEET Biology: Diversity in Living World, Classification, Taxonomy',
        theory: 'This section explores the vast variety of life forms, their classification, and systematic organization. Key concepts include:\n- What is living? Characteristics of living organisms.\n- Taxonomy and Systematics: Basic concepts, nomenclature (binomial), taxonomic hierarchy.\n- Five Kingdom Classification: Monera, Protista, Fungi, Plantae, Animalia - salient features and examples.\n- Viruses, Viroids, and Lichens.'
      },
      {
        id: 'cell-structure-function',
        title: 'Cell: Structure and Function',
        topicForAI: 'NEET Biology: Cell Biology, Cell Organelles, Cell Cycle',
        theory: 'Covers the fundamental unit of life, the cell. Topics include:\n- Cell Theory.\n- Prokaryotic and Eukaryotic cells: Detailed structure and differences.\n- Cell Membrane: Structure (fluid mosaic model), functions, transport across membrane.\n- Cell Wall: Structure and functions in plants and fungi.\n- Endomembrane system: Endoplasmic reticulum, Golgi apparatus, lysosomes, vacuoles.\n- Mitochondria, Plastids (chloroplasts), Ribosomes, Cytoskeleton.\n- Nucleus: Structure, nuclear membrane, nucleolus, chromatin.\n- Cell cycle, Mitosis, Meiosis and their significance.'
      },
      {
        id: 'plant-physiology',
        title: 'Plant Physiology',
        topicForAI: 'NEET Biology: Plant Physiology (Transport, Nutrition, Photosynthesis, Respiration, Growth)',
        theory: 'Deals with the life processes of plants, including:\n- Transport in Plants: Means of transport (diffusion, facilitated diffusion, active transport), plant-water relations (imbibition, water potential, osmosis, plasmolysis), long-distance transport of water (ascent of sap), transpiration, uptake and transport of mineral nutrients, phloem transport (mass flow hypothesis).\n- Mineral Nutrition: Essential minerals, macro and micronutrients and their role, deficiency symptoms, toxicity, nitrogen metabolism.\n- Photosynthesis in Higher Plants: Site of photosynthesis, pigments involved, photochemical and biosynthetic phases, C3 and C4 pathways, photorespiration, factors affecting photosynthesis.\n- Respiration in Plants: Cellular respiration, glycolysis, fermentation, TCA cycle, electron transport system (ETS), factors affecting respiration.\n- Plant Growth and Development: Phases of plant growth, growth rates, conditions for growth, differentiation, dedifferentiation, redifferentiation, sequence of developmental process in a plant cell, plant growth regulators (auxin, gibberellin, cytokinin, ethylene, ABA).'
      },
      {
        id: 'human-physiology',
        title: 'Human Physiology',
        topicForAI: 'NEET Biology: Human Physiology (All Systems)',
        theory: 'Focuses on the functioning of various organ systems in the human body:\n- Digestion and Absorption: Alimentary canal and digestive glands, role of digestive enzymes, absorption of digested products.\n- Breathing and Exchange of Gases: Respiratory organs, mechanism of breathing, exchange and transport of gases, regulation of respiration.\n- Body Fluids and Circulation: Blood, lymph, human circulatory system (heart, blood vessels), cardiac cycle, ECG, double circulation, regulation of cardiac activity, disorders.\n- Excretory Products and their Elimination: Modes of excretion, human excretory system, urine formation, regulation of kidney function, disorders.\n- Locomotion and Movement: Types of movement, muscle, skeletal system and its functions, joints, disorders.\n- Neural Control and Coordination: Neuron and nerves, human nervous system (central, peripheral, visceral), generation and conduction of nerve impulse, reflex action, sensory reception and processing (eye, ear).\n- Chemical Coordination and Integration: Endocrine glands and hormones, human endocrine system, mechanism of hormone action, role of hormones in homeostasis, disorders.'
      },
      {
        id: 'genetics-evolution',
        title: 'Genetics and Evolution',
        topicForAI: 'NEET Biology: Principles of Inheritance, Molecular Basis of Inheritance, Evolution',
        theory: 'This section covers:\n- Principles of Inheritance and Variation: Mendel’s laws of inheritance, deviations from Mendelism (incomplete dominance, co-dominance, multiple alleles, pleiotropy), chromosomal theory of inheritance, sex determination, linkage and recombination, pedigree analysis, genetic disorders (Mendelian and chromosomal).\n- Molecular Basis of Inheritance: Structure of DNA and RNA, DNA packaging, DNA replication, Central dogma, transcription, genetic code, translation, gene expression and regulation (lac operon), genome and human genome project, DNA fingerprinting.\n- Evolution: Origin of life, biological evolution and evidences for biological evolution, Darwin’s contribution, modern synthetic theory of evolution, mechanism of evolution (variation, mutation, recombination and natural selection), Hardy-Weinberg’s principle, adaptive radiation, human evolution.'
      }
    ],
  },
  {
    id: 'class-10-maths',
    title: 'Class 10 Maths Fundamentals',
    description: 'Key mathematical concepts for Class 10 students, including real numbers, polynomials, linear equations, quadratic equations, and trigonometry.',
    difficulty: 'easy',
    icon: 'Calculator',
    dataAiHint: 'maths numbers',
    sections: [
      {
        id: 'real-numbers',
        title: 'Real Numbers',
        topicForAI: 'Class 10 Mathematics: Real Numbers (Euclid\'s Lemma, Fundamental Theorem of Arithmetic)',
        theory: 'This chapter introduces the system of real numbers. Key topics include:\n- Euclid’s division lemma and algorithm: Finding HCF of two positive integers.\n- Fundamental Theorem of Arithmetic: Prime factorization of integers.\n- Revisiting Irrational Numbers: Proofs of irrationality of √2, √3, √5 etc.\n- Revisiting Rational Numbers and Their Decimal Expansions: Terminating and non-terminating repeating decimals.'
      },
      {
        id: 'polynomials',
        title: 'Polynomials',
        topicForAI: 'Class 10 Mathematics: Polynomials (Zeros, Coefficients, Division Algorithm)',
        theory: 'Understanding algebraic expressions called polynomials. Content includes:\n- Definition of a polynomial, degree of a polynomial, types of polynomials (linear, quadratic, cubic).\n- Geometrical meaning of the Zeros of a Polynomial.\n- Relationship between Zeros and Coefficients of a Polynomial (specifically quadratic polynomials).\n- Division Algorithm for Polynomials with examples.'
      },
      {
        id: 'linear-equations',
        title: 'Pair of Linear Equations in Two Variables',
        topicForAI: 'Class 10 Mathematics: Pair of Linear Equations in Two Variables (Graphical and Algebraic Solutions)',
        theory: 'Solving systems of linear equations. This section covers:\n- Pair of linear equations in two variables and their graphical representation.\n- Conditions for consistency/inconsistency of solutions (intersecting lines, parallel lines, coincident lines).\n- Algebraic methods of solving a pair of linear equations:\n  - Substitution method.\n  - Elimination method.\n  - Cross-multiplication method (if included in current syllabus).\n- Equations reducible to a pair of linear equations in two variables.'
      },
      {
        id: 'quadratic-equations',
        title: 'Quadratic Equations',
        topicForAI: 'Class 10 Mathematics: Quadratic Equations (Solutions, Nature of Roots)',
        theory: 'In-depth study of quadratic equations. Topics are:\n- Standard form of a quadratic equation: ax² + bx + c = 0, a ≠ 0.\n- Solution of quadratic equations by factorization.\n- Solution of quadratic equations by completing the square.\n- Solution of quadratic equations by using the quadratic formula (Shreedharacharya’s formula).\n- Nature of roots based on the discriminant (D = b² - 4ac).\n- Applications of quadratic equations to solve word problems.'
      },
      {
        id: 'triangles',
        title: 'Triangles',
        topicForAI: 'Class 10 Mathematics: Triangles (Similarity, Theorems)',
        theory: 'Focuses on the properties of similar triangles. Includes:\n- Concept of similar figures and similarity of triangles.\n- Criteria for similarity of triangles: AAA (Angle-Angle-Angle), SSS (Side-Side-Side), SAS (Side-Angle-Side).\n- Proofs of important theorems related to similar triangles:\n  - Basic Proportionality Theorem (Thales Theorem) and its converse.\n  - Theorem on areas of similar triangles.\n  - Pythagoras Theorem and its converse.'
      },
      {
        id: 'trigonometry-intro',
        title: 'Introduction to Trigonometry',
        topicForAI: 'Class 10 Mathematics: Introduction to Trigonometry (Ratios, Identities)',
        theory: 'Introduction to the ratios involving angles and sides of a right-angled triangle. Covers:\n- Trigonometric ratios of an acute angle of a right-angled triangle (sin, cos, tan, cosec, sec, cot).\n- Values of trigonometric ratios for specific angles: 0°, 30°, 45°, 60°, 90°.\n- Relationship between the ratios.\n- Trigonometric ratios of complementary angles.\n- Trigonometric identities: sin²A + cos²A = 1, sec²A - tan²A = 1, cosec²A - cot²A = 1 and their applications.'
      }
    ],
  },
];

    