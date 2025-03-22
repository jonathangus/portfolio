'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export function SkillsCanvas() {
  const skills = [
    'TypeScript',
    'JavaScript',
    'viem',
    'wagmi',
    'ethers.js',
    'Solidity',
    'React',
    'Gatsby',
    'Next.js',
    'React Native',
    'GraphQL',
    'Node',
    'Apollo',
    'Cypress',
    'Jest',
    'MongoDB',
    'evm',
    'Foundry',
    'Hardhat',
    'Hasura',
    'Docker',
    'PostgreSQL',
    'AWS',
    'Redux',
    'Mobx',
    'CSS-in-JS',
    'CI/CD',
    'Serverless',
    'SEO',
    'PWA',
    'Python',
    'Eliza',
    'Drizzle',
    'AI',
    'LLM',
    'account abstraction',
  ];

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  // Item animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="w-full lowercase overflow-y-auto rounded-lg">
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skills.map((skill, index) => (
          <li key={index} className="flex items-center">
            <span className="h-2 w-2 bg-black rounded-full mr-2"></span>
            <span className="text-black font-medium">{skill}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
