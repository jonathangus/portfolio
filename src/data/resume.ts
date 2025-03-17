export interface WorkExperience {
  title: string;
  company: string;
  period: string;
  description?: string;
  videoUrl?: string;
}

export interface HackathonAward {
  event: string;
  achievement?: string;
  githubLink?: string;
  submissionLink?: string;
}

export interface ProductRecording {
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
}

export const workExperiences: WorkExperience[] = [
  {
    title: 'Chief Technical Officer',
    company: 'anotherblock',
    period: 'Jan 2022 - present',
    description:
      'Part of the founding team enabling individuals to invest in music rights from artists like Rihanna and Justin Bieber, onchain. Helped raise €7.3M and innovated on utilizing web3 for decentralization, transparency, and financial benefits for music royalties.',
  },
  {
    title: 'Freelance',
    company: 'Virtune',
    period: 'Dec 2021',
    description:
      'Conducted a case study on enabling traditional investors to invest in crypto in Sweden, resulting in Virtune.com that lets users buy cryptocurrencies like staked ETH on Avanza.',
  },
  {
    title: 'Lead Frontend Developer',
    company: 'DAO',
    period: 'June 2021 - Dec 2021',
    description:
      'Created architecture and development guidelines, released a DeFi app, developed a prediction market app, and contributed to a combined market cap of $10,000,000.',
  },
  {
    title: 'Senior Frontend Developer',
    company: '3',
    period: 'October 2019 - March 2021',
    description:
      'Launched tre.se and its new webshop while working on the architecture and foundation to improve the experience for developers, editors, and end-users. Shipped solutions to handle 100x increase in traffic during specific iPhone launches.',
  },
  {
    title: 'Senior Frontend Developer',
    company: 'Cabonline',
    period: 'February 2018 - October 2019',
    description:
      "Sweden's largest cab company, where I built consumer apps, internal apps, and public websites.",
  },
  {
    title: 'Lead Frontend Developer',
    company: 'BidTheatre',
    period: 'Nov 2016 - Feb 2018',
    description:
      'Built core web app for programmatic ad platform with real-time dashboards. Enabled precision targeting across channels, connecting advertisers to audiences on desktop, mobile, and tablet.',
  },
  {
    title: 'Fullstack Developer',
    company: 'Digitalist',
    period: 'Jul 2014 - Nov 2016',
  },
  {
    title: 'Web Developer',
    company: 'Tinymondo',
    period: 'Jan 2014 - Jun 2014',
  },
  {
    title: 'Web Developer',
    company: 'FernvikBalotis',
    period: 'Sep 2013 - Jan 2014',
  },
];

export const hackathonAwards: HackathonAward[] = [
  {
    event: 'Agentic Ethereum - 2025',
    achievement: 'Solo hacking on Eliza and AA',
    githubLink: 'https://github.com/jonathangus/based-helper',
    submissionLink: 'https://ethglobal.com/showcase/based-helper-4tev7',
  },
  {
    event: 'ETHGlobal Paris - 2023',
    achievement: 'Onboarding creators to Lens with erc-6651',
    githubLink: 'https://github.com/jonathangus/headstart',
    submissionLink: 'https://ethglobal.com/showcase/headstart-7ty8p',
  },
  {
    event: 'ETH Istanbul - 2023',
    achievement: '1st price from Aave and Unlimit',
    githubLink: 'https://github.com/jonathangus/eth-global-istanbul',
    submissionLink: 'https://ethglobal.com/showcase/aatomato-mf0sy',
  },
  {
    event: 'ETH Istanbul - 2023',
    achievement: '1st price from Aave and Unlimit',
    githubLink: 'https://github.com/jonathangus/eth-global-istanbul',
    submissionLink: 'https://ethglobal.com/showcase/aatomato-mf0sy',
  },
  {
    event: 'ETH Lisbon - 2023',
    githubLink: 'https://github.com/jonathangus/eth-lisbon-2023',
    submissionLink: 'https://ethglobal.com/showcase/tba-lens-m8ki4',
    achievement: 'Wins from Lens',
  },
  {
    event: 'Arbitrum Hackathon Bogota - 2022',
    achievement: '1st prize from Livepeer and Chainlink',
    githubLink: 'https://github.com/jonathangus/arbigates',
    submissionLink: 'https://devpost.com/software/lazy-mint',
  },

  {
    event: 'ETH Bogota - 2022',
    achievement: 'Wins from 9 sponsors',
    githubLink: 'https://github.com/jonathangus/gates',
    submissionLink: 'https://ethglobal.com/showcase/gates-wtf-qy8w8',
  },
  {
    event: 'ETH New York - 2022',
    achievement: 'Winner, Open Track and 1st prize from UMA',
    githubLink: 'https://ethglobal.com/showcase/nft-safe-launch-nckve',
    submissionLink: 'https://github.com/jonathangus/ethglobal-NYC-hackathon',
  },
  {
    event: 'ETH Lisbon - 2021',
    achievement: 'Winner, Open Track',
  },
];

export const productRecordings: ProductRecording[] = [
  {
    title: 'anotherblock',
    description: 'Music Royalties Platform',
    videoUrl: '/anotherblock.mp4',
  },
  {
    title: 'app.orakuru.io',
    description: 'Orakuru Application',
    videoUrl: '/app.orakuru.io.mp4',
  },
  {
    title: 'app.usemate',
    description: 'Usemate Application',
    videoUrl: '/app.usemate.mp4',
  },
  {
    title: 'based helper (twitter_flow)',
    description: 'Based Helper Twitter Flow',
    videoUrl: '/based_helper_twitter_flow.mp4',
  },
  {
    title: 'based helper (ui flow)',
    description: 'Based Helper UI Flow',
    videoUrl: '/based_helper_ui_flow.mp4',
  },

  {
    title: 'contrib',
    description: 'Contribution Platform',
    videoUrl: '/contrib.mp4',
  },
  {
    title: 'etablera.co',
    description: 'Etablera Platform',
    videoUrl: '/etablera.co.mp4',
  },
  {
    title: 'flygtaxi',
    description: 'Cab Service',
    videoUrl: '/flygtaxi.MP4',
  },
  {
    title: 'hexcolor',
    description: 'Color Tool',
    videoUrl: '/hexcolor.mp4',
  },
  {
    title: 'matos.club',
    description: 'Matos Club Platform',
    videoUrl: '/matos.club.mp4',
  },
  {
    title: 'tre.se',
    description: 'Telecom Website',
    videoUrl: '/tre.se.mp4',
  },
  {
    title: 'usemate.com',
    description: 'Usemate Website',
    videoUrl: '/usemate.com.mp4',
  },
  {
    title: 'usemate',
    description: 'Usemate Application',
    videoUrl: '/usemate.mp4',
  },
];
