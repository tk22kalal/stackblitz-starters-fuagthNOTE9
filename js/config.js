export const API_KEY = "AIzaSyAqN_GMztmKGXR5LO9SVA-gvK5yuciw9K8";
export const GOOGLE_API_KEY = "AIzaSyBZTtYR91YdEf49esNSSdMx2ZxtIb2EI0I";
export const GOOGLE_SEARCH_ENGINE_ID = "07bfb530915b74d08";

export const API_URLS = {
  text: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
  vision: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-vision:generateText?key=${API_KEY}`,
  image: `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&searchType=image&num=1`
};

export const DIFFICULTY_LEVELS = {
  'Easy': 'Questions based on standard textbooks like BD Chaurasia, Guyton, Harper, etc.',
  'Medium': 'NEET PG level questions covering both clinical and non-clinical topics',
  'Hard': 'Advanced NEET PG and INICET level clinical questions'
};

export const SUBJECTS = {
  'Anatomy': [
    'Complete Anatomy',
    'Upper Limb',
    'Lower Limb',
    'Histology'
  ],
  'Radiology': [
    'Radiology'
  ],
  'Biochemistry': [
    'Biochemistry'
  ],
  'FMT': [
    'FMT',
    'General Toxicology'
  ],
  'Pharmacology': [
    'Pharmacology'
  ],
  'Ophthalmology': [
    'Ophthalmology',
    'RETINA: ANATOMY AND INVESTIGATIONS'
  ]
};
