export const experiences = [
  { id:'?', company:"What's next?", role:'Seeking Next Adventure', period:'2026 →', level:null, current:false, x:.50, y:.05, description:'"The best time to build was yesterday. The second best time is now — with better models, better data, and a clearer vision of what\'s possible." Seeking DS, Applied ML, or AI Engineer roles. Open to relocation.', tech:['Open to Work','Open to Relocation'] },
  { id:'r', company:'UMD · Research Assistant', role:'Data Scientist', period:'Jul 2025 — Dec 2025', level:25, current:false, x:.65, y:.20, logo:'/logos/umd.jpeg', description:'Consolidated six years of agricultural soil data by extracting values from PDFs and lab images into structured CSV datasets, standardizing variables and measurement units. Applied KNN clustering to segment fields by nutrient similarity and correlation analysis to identify key soil relationships. Built Random Forest and XGBoost models to forecast nutrient levels and PFAS impact; presented findings to stakeholders on crop suitability under varying contaminant conditions.', tech:['Python','R','Random Forest','XGBoost','KNN','EDA'] },
  { id:'t', company:'UMD · Teaching Assistant', role:'Teaching Assistant — Statistics using R', period:'May 2025 — Dec 2025', level:24, current:false, x:.28, y:.34, logo:'/logos/umd.jpeg', description:'Lifted average assessment scores by 12% by leading weekly sessions for 60+ graduate students, translating complex statistical concepts — regression, causal inference, hypothesis testing — into actionable analytical frameworks.', tech:['R','Statistics','Causal Inference','Regression','Teaching'] },
  { id:'u', company:'UMD · MS Data Science', role:'MS in Data Science', period:'2024 — 2026', level:23, current:true, x:.66, y:.48, logo:'/logos/umd.jpeg', description:'Deep learning, causal inference, NLP. Published viz in Toxics 2026 (PFAS). Won 2nd at xFoundry. Presented NeurIPS 2025 paper on RL + LLM reasoning. GPA 3.83.', tech:['Deep Learning','Causal Inference','NLP','Research'] },
  { id:'o', company:'Osttra · S&P Global', role:'Data Scientist', period:'2021 — 2023', level:20, current:false, x:.30, y:.64, logo:'/logos/sp.jpeg', description:'Built end-to-end ML models for OTC derivatives post-trade analytics. Optuna-tuned XGBoost with GroupKFold validation, STL decomposition for time-series drift detection, and Great Expectations on live swap and CDS pipelines.', tech:['XGBoost','Optuna','GroupKFold','STL','Great Expectations'] },
  { id:'i', company:'IHS Markit', role:'Data Scientist / Analyst', period:'2020 — 2021', level:18, current:false, x:.64, y:.82, logo:'/logos/ihs.svg', description:'Owned data validation and ML pipeline infrastructure across large-scale financial datasets. Built classification and anomaly detection systems, maintained data quality SLAs, and automated reporting — real model ownership.', tech:['Python','ML Pipelines','Data Validation','SQL'] },
]

export const achievements = [
  { rank:'2nd',   label:'xFoundry Pitch Day',     color:'#FFB800', glow:'rgba(255,184,0,.18)' },
  { rank:'📄',   label:'Toxics 2026 Publication', color:'#FF8236', glow:'rgba(255,130,54,.18)' },
  { rank:'3.83', label:'MS GPA · UMD',            color:'#94A3B8', glow:'rgba(148,163,184,.12)' },
  { rank:'⚡',   label:'S&P Global Alum',         color:'#FF8236', glow:'rgba(255,130,54,.18)' },
  { rank:'Lead', label:'Team Lead xFoundry',       color:'#4a8a50', glow:'rgba(74,138,80,.15)' },
  { rank:'🧠',  label:'NeurIPS Presenter',         color:'#FFA866', glow:'rgba(255,168,102,.12)' },
]

export const projects = [
  {
    title: 'Prism',
    achievement: '5-model revenue attribution engine with real-time drift monitoring in production',
    about: 'Predicts which customers will churn, spend more, or convert. And tells you exactly why.',
    tech: ['XGBoost', 'BigQuery', 'FastAPI', 'LookML', 'Optuna'],
    github: 'https://github.com/Perzy-codes',
  },
  {
    title: 'Causal Cannabis · Traffic',
    achievement: 'Proved causal effect of cannabis legalization on traffic fatalities across 17 states and 885K+ records',
    about: 'Statistical study on whether legalizing cannabis makes roads more dangerous. Spoiler: it depends.',
    tech: ['Causal Inference', 'DiD', 'XGBoost', 'RAG', 'FastAPI'],
    github: 'https://github.com/Perzy-codes',
  },
  {
    title: 'ProClass',
    achievement: '98.4% accuracy on fashion product classification with full AWS MLOps: train, deploy, monitor',
    about: 'Image classifier that identifies clothing categories, shipped end-to-end on AWS',
    tech: ['ResNet18', 'PyTorch', 'SageMaker', 'AWS Lambda', 'GitHub Actions'],
    github: 'https://github.com/Perzy-codes',
  },
  {
    title: 'HealthKare',
    achievement: 'Hybrid search + cross-encoder reranking + HyDE, evaluated end-to-end with RAGAS',
    about: 'AI chatbot that answers healthcare questions by reading and reasoning over medical documents',
    tech: ['RAG', 'LangChain', 'RAGAS', 'FastAPI', 'Streamlit'],
    github: 'https://github.com/Perzy-codes',
  },
  {
    title: 'FinTune',
    achievement: 'Fine-tuned Mistral-7B on financial instruction pairs using QLoRA with automated eval pipeline',
    about: 'Taught a 7B LLM to think and talk like a finance expert using parameter-efficient fine-tuning',
    tech: ['QLoRA', 'Mistral-7B', 'PEFT', 'PyTorch', 'Knowledge Distillation'],
    github: 'https://github.com/Perzy-codes',
  },
  {
    title: 'Campus Shield',
    achievement: '2nd place at xFoundry Pitch Day. Real-time threat detection on live CCTV footage.',
    about: 'Computer vision system that watches campus cameras and flags security threats as they happen',
    tech: ['YOLOv8', 'OpenCV', 'PyTorch', 'Computer Vision'],
    github: 'https://github.com/Perzy-codes',
  },
  {
    title: 'PFAS Research Visuals',
    achievement: 'Published in Toxics journal 2026. Duncan et al., peer-reviewed.',
    about: 'Visualised how chemical contamination in soil affects which crops can safely grow there',
    tech: ['Python', 'R', 'Matplotlib', 'Seaborn', 'Data Visualization'],
    github: 'https://github.com/Perzy-codes',
  },
  {
    title: 'Celebrity Face GANs',
    achievement: 'Latent space arithmetic and CycleGAN attribute manipulation on celebrity face datasets',
    about: 'Used GANs to swap facial attributes and generate entirely new synthetic faces',
    tech: ['GANs', 'CycleGAN', 'PyTorch', 'Deep Learning'],
    github: 'https://github.com/Perzy-codes',
  },
  {
    title: 'NeurIPS RL + LLM',
    achievement: 'Presented cutting-edge RL + LLM reasoning research from NeurIPS 2025 to graduate class',
    about: 'Broke down how reinforcement learning makes large language models significantly better at reasoning',
    tech: ['LLMs', 'Reinforcement Learning', 'Deep Learning', 'Research'],
    github: 'https://github.com/Perzy-codes',
  },
]

export const socialLinks = [
  { label:'LinkedIn', url:'https://www.linkedin.com/in/prathamdabas', icon:'linkedin' },
  { label:'Email',    url:'mailto:dabaspratham28@gmail.com',                    icon:'mail' },
  { label:'GitHub',   url:'https://github.com/Perzy-codes',           icon:'github' },
]

export const skills = ['Python','XGBoost','PyTorch','Scikit-learn','FastAPI','SQL','Spark','BigQuery','SageMaker','Docker','Optuna','LangChain','RAGAS','RAG','AWS','Causal Inference']
