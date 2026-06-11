export const experiences = [
  { id:'?', company:"What's next?", role:'Seeking Next Adventure', period:'2026 →', level:null, current:false, x:.50, y:.05, description:'"The best time to build was yesterday. The second best time is now, with better models, better data, and a clearer vision of what\'s possible." Seeking DS, Applied ML, or AI Engineer roles. Open to relocation.', tech:['Open to Work','Open to Relocation'] },
  { id:'r', company:'UMD · Research Assistant', role:'Data Scientist', period:'Jul 2025 – Dec 2025', level:25, current:false, x:.65, y:.20, logo:'/logos/umd.jpeg', description:'Consolidated six years of agricultural soil data by extracting values from PDFs and lab images into structured CSV datasets, standardizing variables and measurement units. Applied KNN clustering to segment fields by nutrient similarity and correlation analysis to identify key soil relationships. Built Random Forest and XGBoost models to forecast nutrient levels and PFAS impact; presented findings to stakeholders on crop suitability under varying contaminant conditions.', tech:['Python','R','Random Forest','XGBoost','KNN','EDA'] },
  { id:'t', company:'UMD · Teaching Assistant', role:'Teaching Assistant: Statistics using R', period:'May 2025 – Dec 2025', level:24, current:false, x:.28, y:.34, logo:'/logos/umd.jpeg', description:'Lifted average assessment scores by 12% by leading weekly sessions for 60+ graduate students, translating regression, causal inference, and hypothesis testing into actionable analytical frameworks.', tech:['R','Statistics','Causal Inference','Regression','Teaching'] },
  { id:'u', company:'UMD · MS Data Science', role:'MS in Data Science', period:'2024 – May 2026', level:23, current:false, x:.66, y:.48, logo:'/logos/umd.jpeg', description:'Deep learning, causal inference, NLP. Published visualizations in Toxics 2026 (PFAS). 2nd place at xFoundry Pitch Day. Presented NeurIPS 2025 paper on RL + LLM reasoning to graduate cohort. GPA 3.83.', tech:['Deep Learning','Causal Inference','NLP','Research'] },
  { id:'o', company:'Osttra · S&P Global', role:'Data Scientist', period:'Sept 2021 – July 2024', level:20, current:false, x:.30, y:.64, logo:'/logos/sp.jpeg', description:'Built end-to-end ML models for OTC derivatives post-trade analytics. Optuna-tuned XGBoost with GroupKFold validation, STL decomposition for time-series drift detection, and Great Expectations data quality checks on live swap and CDS pipelines.', tech:['XGBoost','Optuna','GroupKFold','STL','Great Expectations'] },
  { id:'i', company:'IHS Markit', role:'Data Scientist / Analyst', period:'Aug 2020 – Sept 2021', level:18, current:false, x:.64, y:.82, logo:'/logos/ihs.svg', description:'Owned data validation and ML pipeline infrastructure across large-scale financial datasets. Built classification and anomaly detection systems, maintained data quality SLAs, and automated reporting. Real model ownership.', tech:['Python','ML Pipelines','Data Validation','SQL'] },
]

export const achievements = [
  { rank:'2nd',   label:'xFoundry Pitch Day',          color:'#FFB800', glow:'rgba(255,184,0,.18)' },
  { rank:'📄',   label:'Toxics 2026 Publication',      color:'#FF8236', glow:'rgba(255,130,54,.18)' },
  { rank:'3.83', label:'MS GPA · UMD',                 color:'#94A3B8', glow:'rgba(148,163,184,.12)' },
  { rank:'⚡',   label:'S&P Global Alum',              color:'#FF8236', glow:'rgba(255,130,54,.18)' },
  { rank:'Lead', label:'Team Lead xFoundry',            color:'#4a8a50', glow:'rgba(74,138,80,.15)' },
  { rank:'🧠',  label:'NeurIPS 2025 paper talk',       color:'#FFA866', glow:'rgba(255,168,102,.12)' },
  { rank:'231',  label:'Otto early access signups',     color:'#FFB800', glow:'rgba(255,184,0,.18)' },
]

export type Rarity = 'legendary' | 'epic' | 'rare'

export const projects = [
  {
    title: 'Otto',
    metric: '231 early access signups · YC S26 applicant · 93% gross margin at 1K MAU',
    achievement: 'Self-organizing AI notes app. Built and shipped solo.',
    about: 'A notes app that organizes itself. Next.js 15, Supabase, DeepSeek V3, Gemini embeddings. Live product, real users.',
    tech: ['Next.js 15', 'Supabase', 'DeepSeek V3', 'Product'],
    github: 'https://otto-beige.vercel.app/',
    rarity: 'legendary' as Rarity,
    featured: true,
  },
  {
    title: 'Prism',
    metric: '500K+ daily events · 87% accuracy · 5-model attribution',
    achievement: 'Predicts which customers will churn, spend more, or convert, and explains why with SHAP.',
    about: 'XGBoost tuned with Optuna and GroupKFold, served via FastAPI, monitored for drift in production.',
    tech: ['XGBoost', 'BigQuery', 'FastAPI', 'LookML', 'Optuna'],
    github: 'https://github.com/Perzy-codes',
    rarity: 'epic' as Rarity,
  },
  {
    title: 'FinTune',
    metric: '31% accuracy improvement · 40% inference compression · 60% lower eval overhead',
    achievement: 'Fine-tuned Mistral-7B with QLoRA, then aligned with GRPO-based RLHF via HuggingFace TRL.',
    about: 'Verifiable reward functions and KL regularization. Agentic eval pipeline with LLM-as-judge. 43 passing tests.',
    tech: ['QLoRA', 'GRPO', 'RLHF', 'TRL', 'Mistral-7B'],
    github: 'https://github.com/Perzy-codes/FineTune-Mistra7B',
    rarity: 'epic' as Rarity,
  },
  {
    title: 'HealthKare',
    metric: '89% retrieval precision · 2.3x faithfulness · 50K+ docs',
    achievement: 'Healthcare RAG chatbot with hybrid BM25 + dense retrieval, cross-encoder reranking, and HyDE.',
    about: 'Evaluated end-to-end with RAGAS.',
    tech: ['RAG', 'LangChain', 'FAISS', 'RAGAS', 'FastAPI'],
    github: 'https://github.com/Perzy-codes',
    rarity: 'epic' as Rarity,
  },
  {
    title: 'ProClass',
    metric: '98.39% accuracy · 60% cost reduction',
    achievement: 'Fashion product classifier shipped end-to-end on AWS with full MLOps.',
    about: 'ResNet18 with SageMaker training, Lambda deployment, and GitHub Actions CI/CD.',
    tech: ['ResNet18', 'PyTorch', 'SageMaker', 'AWS Lambda', 'GitHub Actions'],
    github: 'https://github.com/Perzy-codes',
    rarity: 'rare' as Rarity,
  },
  {
    title: 'Causal Cannabis · Traffic',
    metric: '885K+ NHTSA records · 17 states · p < 0.05',
    achievement: 'Difference-in-differences study on whether cannabis legalization changed traffic fatalities.',
    about: 'Callaway and Sant\'anna estimator across 17 states. Spoiler: it depends.',
    tech: ['Causal Inference', 'DiD', 'Callaway-Sant\'anna', 'R', 'STL'],
    github: 'https://github.com/Perzy-codes',
    rarity: 'rare' as Rarity,
  },
  {
    title: 'Campus Shield',
    metric: '2nd place · xFoundry Pitch Day (1st received $250K)',
    achievement: 'YOLOv8 weapon detection prototype for school security camera feeds with heatmap overlays.',
    about: 'Led a team of 8.',
    tech: ['YOLOv8', 'OpenCV', 'PyTorch', 'Computer Vision'],
    github: 'https://github.com/Perzy-codes',
    rarity: 'epic' as Rarity,
  },
  {
    title: 'PFAS Research Visuals',
    metric: 'Peer-reviewed · Toxics 2026 · Duncan et al., 14(3), 245',
    achievement: 'Supplementary data analysis and visualizations published in Toxics, 2026.',
    about: 'Visualised how PFAS contamination in soil affects which crops can safely grow there.',
    tech: ['Python', 'R', 'Matplotlib', 'Seaborn', 'Data Visualization'],
    github: 'https://www.mdpi.com/3781368',
    rarity: 'epic' as Rarity,
  },
  {
    title: 'GenVision',
    metric: 'IPS 0.76 to 0.88',
    achievement: 'Consistent-character story generation with StoryDiffusion CSA and IP-Adapter-style identity module.',
    about: 'Stable Diffusion 1.5 trained on PororoSV. CLIP ViT-H/14 identity encoder, LoRA rank-8.',
    tech: ['Stable Diffusion', 'IP-Adapter', 'LoRA', 'CLIP'],
    github: 'https://github.com/Perzy-codes',
    rarity: 'rare' as Rarity,
  },
  {
    title: 'NeurIPS RL + LLM',
    metric: 'NeurIPS 2025 · Graduate cohort presentation',
    achievement: 'Presented a NeurIPS 2025 paper on RL for LLM reasoning to the graduate cohort.',
    about: 'Breaking down GRPO-style training and why it improves reasoning.',
    tech: ['LLMs', 'Reinforcement Learning', 'Deep Learning', 'Research'],
    github: 'https://github.com/Perzy-codes',
    rarity: 'rare' as Rarity,
  },
]

export const socialLinks = [
  { label:'LinkedIn', url:'https://www.linkedin.com/in/pratham-dabas-218007137/', icon:'linkedin' },
  { label:'Email',    url:'mailto:dabaspratham28@gmail.com',                       icon:'mail' },
  { label:'GitHub',   url:'https://github.com/Perzy-codes',                       icon:'github' },
]

export const skills = ['Python','XGBoost','PyTorch','Scikit-learn','FastAPI','SQL','Spark','BigQuery','SageMaker','Docker','Optuna','LangChain','RAGAS','RAG','AWS','Causal Inference']
