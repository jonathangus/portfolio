'use client';

import { WorkExperienceItem } from '@/components/work-experience-item';
import { HackathonItem } from '@/components/hackathon-item';
import { workExperiences, hackathonAwards } from '@/data/resume';
import { SkillsCanvas } from '@/components/skills-canvas';
import { Navbar } from '@/components/nav-bar';
import { ProductRecordings } from '@/components/portfolio';
import { ResponsiveMouseTrail } from '@/components/responsive-mouse-trail';

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row p-6 md:mt-[230px] md:px-12 mx-auto md:justify-center">
      {/* Replace the direct MouseTrail with the responsive wrapper */}
      <ResponsiveMouseTrail />

      <div className="w-full  md:mr-[60px]  h-[100px] md:w-[150px] mb-8 md:mb-0 z-10 md:sticky md:top-0">
        <Navbar />
      </div>
      <main className="w-full max-w-4xl relative z-10">
        <div className="mx-0 md:mx-auto">
          <section className="mb-24">
            <h1 className="mb-6  text-4xl md:text-5xl font-semibold leading-tight font-mono">
              Jonathan Gustafsson
            </h1>
            <div className=" text-lg text-muted-foreground">
              <p className="mb-4">
                11+ year experienced CTO and full stack software engineer
              </p>
              <p className="mb-4">
                Thought myself to build websites at 14. Always growing by
                continuously doing things I find fun.
              </p>
              <p>
                I bring an entrepreneurial approach, leadership background, and
                product-focused mindset to every project, continually looking
                for ways to build great user experiences and work with high
                agency.
              </p>
            </div>
          </section>

          <section className="mb-24 relative md:pl-0">
            <div className="font-medium text-3xl text-muted-foreground font-mono md:absolute md:-left-20 mb-4 md:mb-0 text-left">
              01
            </div>
            <div className="text-left">
              {workExperiences.map((experience, index) => (
                <WorkExperienceItem key={index} experience={experience} />
              ))}
            </div>
          </section>

          <section className="mb-24 relative md:pl-0">
            <div className="font-medium text-3xl text-muted-foreground font-mono md:absolute md:-left-20 mb-4 md:mb-0 text-left">
              02
            </div>
            <div className="text-left">
              <h2 className="mb-8 text-2xl font-medium">Hackathons</h2>
              <div>
                {hackathonAwards.map((award, index) => (
                  <HackathonItem key={index} award={award} />
                ))}
              </div>
            </div>
          </section>

          <section className="mb-24 relative md:pl-0">
            <div className="font-medium text-3xl text-muted-foreground font-mono md:absolute md:-left-20 mb-4 md:mb-0 text-left">
              03
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-medium">Product Recordings</h2>
              <p className="text-muted-foreground mb-8">
                Unedited snapshots of previous work
              </p>
              <ProductRecordings />
            </div>
          </section>

          <section className="mb-24 relative md:pl-0">
            <div className="font-medium text-3xl text-muted-foreground font-mono md:absolute md:-left-20 mb-4 md:mb-0 text-left">
              04
            </div>
            <div className="text-left">
              <h2 className="mb-8 text-2xl font-medium">Skills</h2>
              <div className="w-full">
                <SkillsCanvas />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
