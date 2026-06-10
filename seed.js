/**
 * Vintern — MongoDB Seed Script
 * Creates 1 employer + 20 diverse job postings
 *
 * Usage:
 *   node seed.js
 *
 * Requires MONGO_URI in environment or edit the uri below directly.
 * Run from the /server directory (or anywhere with mongoose installed):
 *   cd server && node ../seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://230008:aqa7kenzhebek@cluster0.q3n2c.mongodb.net/vijmp?appName=Cluster0';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB:', MONGO_URI);

  const UserSchema = new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: String,
    role: String, bio: String, company: String, skills: [String],
    education: String, portfolioLink: String, avatar: String,
  }, { timestamps: true });
  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const JobSchema = new mongoose.Schema({
    title: String, company: String, description: String, requirements: String,
    location: String, type: String, skills: [String], salary: String,
    employer: mongoose.Schema.Types.ObjectId, isActive: Boolean,
  }, { timestamps: true });
  const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

  // ── 1. Create Employer ──────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password123', 12);

  const existingEmployer = await User.findOne({ email: 'techcorp@example.com' });
  let employer;
  if (existingEmployer) {
    employer = existingEmployer;
    console.log('Employer already exists, skipping creation.');
  } else {
    employer = await User.create({
      name: 'TechCorp HR',
      email: 'techcorp@example.com',
      password: hashedPassword,
      role: 'employer',
      company: 'TechCorp',
      bio: 'TechCorp is a fast-growing tech company focused on building innovative products.',
    });
    console.log('✅ Employer created:', employer.email);
  }

  // ── 2. Create 20 Jobs ───────────────────────────────────────────────────────
  const jobs = [
    {
      title: 'Frontend Developer Intern',
      description: 'Join our product team to build modern web interfaces using React. You will work closely with designers and backend engineers to deliver high-quality user experiences.',
      requirements: 'Experience with React and JavaScript. Familiarity with CSS/Tailwind. Basic understanding of REST APIs.',
      location: 'Remote',
      type: 'internship',
      skills: ['React', 'JavaScript', 'CSS', 'Tailwind'],
      salary: '$800/month',
    },
    {
      title: 'Backend Developer Intern',
      description: 'Help build and maintain our Node.js APIs. You will work on database modeling, REST endpoints, and server-side logic.',
      requirements: 'Knowledge of Node.js and Express. Understanding of MongoDB or SQL. Good grasp of HTTP and REST.',
      location: 'Remote',
      type: 'internship',
      skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
      salary: '$900/month',
    },
    {
      title: 'Full Stack Developer',
      description: 'We are looking for a full stack developer to own features end to end. You will build React frontends and Node.js backends deployed on AWS.',
      requirements: '2+ years with React and Node.js. Experience with cloud platforms. Strong understanding of databases.',
      location: 'Almaty, Kazakhstan',
      type: 'full-time',
      skills: ['React', 'Node.js', 'AWS', 'PostgreSQL', 'TypeScript'],
      salary: '$2,500/month',
    },
    {
      title: 'UI/UX Design Intern',
      description: 'Create beautiful and intuitive designs for our web and mobile applications. Work with Figma, run user research, and ship designs to production.',
      requirements: 'Proficiency in Figma. Portfolio of UI/UX work. Understanding of design systems and accessibility.',
      location: 'Remote',
      type: 'internship',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
      salary: '$700/month',
    },
    {
      title: 'Data Analyst Intern',
      description: 'Analyze product and business data to generate insights. You will build dashboards, write SQL queries, and present findings to stakeholders.',
      requirements: 'Strong SQL skills. Experience with Excel or Google Sheets. Knowledge of Python pandas is a plus.',
      location: 'Astana, Kazakhstan',
      type: 'internship',
      skills: ['SQL', 'Python', 'Excel', 'Data Visualization'],
      salary: '$750/month',
    },
    {
      title: 'Mobile Developer (React Native)',
      description: 'Build cross-platform mobile apps for iOS and Android. Work with our team to create smooth, performant user experiences.',
      requirements: '1+ year with React Native. Understanding of native APIs. Experience publishing apps to App Store / Play Store.',
      location: 'Remote',
      type: 'full-time',
      skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Expo'],
      salary: '$2,000/month',
    },
    {
      title: 'DevOps Engineer Intern',
      description: 'Help maintain and improve our CI/CD pipelines, Docker containers, and Kubernetes clusters. You will learn real infrastructure at scale.',
      requirements: 'Familiarity with Linux, Docker, and Git. Basic scripting in Bash or Python. Interest in cloud infrastructure.',
      location: 'Remote',
      type: 'internship',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'AWS'],
      salary: '$850/month',
    },
    {
      title: 'QA Engineer Intern',
      description: 'Write automated tests, perform manual testing, and help ensure the quality of our software releases.',
      requirements: 'Understanding of software testing concepts. Experience with Cypress or Playwright is a plus. Attention to detail.',
      location: 'Remote',
      type: 'internship',
      skills: ['QA Testing', 'Cypress', 'Manual Testing', 'Automation'],
      salary: '$700/month',
    },
    {
      title: 'Machine Learning Engineer',
      description: 'Build and deploy ML models for our recommendation and fraud detection systems. Work with large datasets and modern ML frameworks.',
      requirements: '2+ years with Python and ML frameworks. Experience with TensorFlow or PyTorch. Strong math/statistics background.',
      location: 'Almaty, Kazakhstan',
      type: 'full-time',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'SQL'],
      salary: '$3,000/month',
    },
    {
      title: 'Cybersecurity Intern',
      description: 'Assist with vulnerability assessments, penetration testing, and security audits. Learn real-world security practices from experienced engineers.',
      requirements: 'Basic knowledge of networking and security principles. Familiarity with Linux. Interest in ethical hacking.',
      location: 'Astana, Kazakhstan',
      type: 'internship',
      skills: ['Network Security', 'Linux', 'Penetration Testing', 'Python'],
      salary: '$800/month',
    },
    {
      title: 'Product Manager Intern',
      description: 'Help define product roadmaps, write user stories, and coordinate between engineering and design teams. Learn product management at a fast-paced startup.',
      requirements: 'Strong communication skills. Analytical mindset. Familiarity with Agile/Scrum. No coding required.',
      location: 'Remote',
      type: 'internship',
      skills: ['Product Management', 'Agile', 'Jira', 'User Stories'],
      salary: '$750/month',
    },
    {
      title: 'Technical Writer',
      description: 'Write clear and concise API documentation, user guides, and developer tutorials. Work closely with engineers to document new features.',
      requirements: 'Excellent English writing skills. Ability to understand technical concepts. Experience with Markdown or Docs-as-Code.',
      location: 'Remote',
      type: 'part-time',
      skills: ['Technical Writing', 'Markdown', 'API Docs', 'English'],
      salary: '$600/month',
    },
    {
      title: 'Cloud Infrastructure Engineer',
      description: 'Design and manage our AWS infrastructure. Implement IaC with Terraform, monitor systems, and optimize costs.',
      requirements: '2+ years with AWS. Experience with Terraform or Pulumi. Strong networking knowledge.',
      location: 'Remote',
      type: 'full-time',
      skills: ['AWS', 'Terraform', 'Networking', 'Linux', 'Python'],
      salary: '$2,800/month',
    },
    {
      title: 'iOS Developer Intern',
      description: 'Build features for our iOS app using Swift and SwiftUI. Collaborate with designers and backend engineers on end-to-end feature delivery.',
      requirements: 'Basic Swift knowledge. Understanding of UIKit or SwiftUI. Interest in mobile development.',
      location: 'Almaty, Kazakhstan',
      type: 'internship',
      skills: ['Swift', 'SwiftUI', 'iOS', 'Xcode'],
      salary: '$850/month',
    },
    {
      title: 'Android Developer',
      description: 'Develop and maintain our Android application. Work with Kotlin, Jetpack Compose, and modern Android architecture patterns.',
      requirements: '1+ year with Kotlin. Experience with Jetpack components. Understanding of MVVM architecture.',
      location: 'Remote',
      type: 'full-time',
      skills: ['Kotlin', 'Android', 'Jetpack Compose', 'MVVM'],
      salary: '$2,200/month',
    },
    {
      title: 'Blockchain Developer Intern',
      description: 'Explore and prototype Web3 features. Write smart contracts in Solidity and integrate with our platform using ethers.js.',
      requirements: 'Basic understanding of blockchain concepts. Some Solidity or JavaScript experience. Curiosity and willingness to learn.',
      location: 'Remote',
      type: 'internship',
      skills: ['Solidity', 'Ethereum', 'Web3', 'JavaScript'],
      salary: '$900/month',
    },
    {
      title: 'Marketing Analyst (Digital)',
      description: 'Analyze marketing campaigns, manage SEO/SEM performance, and produce reports to guide growth strategy.',
      requirements: 'Google Analytics experience. Knowledge of SEO principles. Data-driven mindset.',
      location: 'Astana, Kazakhstan',
      type: 'part-time',
      skills: ['Google Analytics', 'SEO', 'SEM', 'Excel', 'Marketing'],
      salary: '$700/month',
    },
    {
      title: 'Python Backend Developer',
      description: 'Build high-performance APIs and microservices using Python. Work with FastAPI, PostgreSQL, and Redis.',
      requirements: 'Strong Python skills. Experience with FastAPI or Django. Understanding of async programming.',
      location: 'Remote',
      type: 'full-time',
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
      salary: '$2,400/month',
    },
    {
      title: 'Business Intelligence Intern',
      description: 'Build dashboards and reports using BI tools. Help the business team make data-driven decisions through clear visualizations.',
      requirements: 'Experience with Tableau, Power BI, or Metabase. SQL skills required. Good communication skills.',
      location: 'Almaty, Kazakhstan',
      type: 'internship',
      skills: ['Tableau', 'Power BI', 'SQL', 'Data Visualization'],
      salary: '$700/month',
    },
    {
      title: 'Game Developer Intern',
      description: 'Work on our casual mobile game projects using Unity. Implement game mechanics, UI elements, and integrate backend APIs.',
      requirements: 'Basic Unity and C# knowledge. Interest in game development. Portfolio or personal projects preferred.',
      location: 'Remote',
      type: 'internship',
      skills: ['Unity', 'C#', 'Game Development', 'Mobile'],
      salary: '$750/month',
    },
  ];

  let created = 0;
  for (const job of jobs) {
    const exists = await Job.findOne({ title: job.title, employer: employer._id });
    if (!exists) {
      await Job.create({ ...job, employer: employer._id, company: 'TechCorp', isActive: true });
      created++;
    }
  }

  console.log(`✅ ${created} jobs created (${jobs.length - created} already existed)`);
  console.log('\n─────────────────────────────────────');
  console.log('Employer login credentials:');
  console.log('  Email:    techcorp@example.com');
  console.log('  Password: password123');
  console.log('─────────────────────────────────────\n');

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
