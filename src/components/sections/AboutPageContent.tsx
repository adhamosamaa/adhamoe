'use client';

import Image from 'next/image';
import { ArrowUpRight, Download, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/ui/Reveal';
import { HighlightText } from '@/components/ui/HighlightText';
import { Contact } from '@/components/sections/Contact';
import { aboutHeroParagraphs, experience, softwareList } from '@/data/about';
import { skills } from '@/data/skills';
import { processSteps } from '@/data/process';
import { siteSettings } from '@/data/settings';

export function AboutPageContent() {
  const designSoftware = softwareList.filter((item) => item.category === 'Design');
  const aiTools = softwareList.filter((item) => item.category === 'AI Tools');

  return (
    <main id="main" className="pt-36 md:pt-44 pb-0 relative">
      {/* ── Editorial Hero ────────────────────────────────────── */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
          {/* Header Tag */}
          <Reveal delay={0} direction="down" distance={12}>
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-12">
              <SectionLabel>Editorial Bio &amp; Profile</SectionLabel>
              <span className="text-xs font-mono text-gray-dim uppercase tracking-widest">
                Est. 2024 / Egypt 🇪🇬
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Main Editorial Headline & Copy (lg:col-span-7) */}
            <div className="lg:col-span-7">
              <Reveal delay={100} direction="up">
                <h1 className="text-[clamp(44px,5.5vw,76px)] font-bold tracking-[-0.04em] leading-[0.98] mb-10 text-white">
                  Design with <span className="accent-serif">purpose,</span> not decoration.
                </h1>
              </Reveal>

              <div className="space-y-6 mb-12">
                {aboutHeroParagraphs.map((paragraph, index) => (
                  <Reveal key={paragraph.id} delay={180 + index * 60} direction="up">
                    <HighlightText
                      paragraph={paragraph}
                      className="text-base md:text-lg leading-[1.85] text-gray font-light"
                    />
                  </Reveal>
                ))}
              </div>

              {/* Quick Metrics Bar */}
              <Reveal delay={300} direction="up">
                <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/10 mb-10">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">2+ Yrs</div>
                    <div className="text-[11px] font-mono text-accent uppercase tracking-wider mt-1">Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">250+</div>
                    <div className="text-[11px] font-mono text-accent uppercase tracking-wider mt-1">Monthly Output</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">5+</div>
                    <div className="text-[11px] font-mono text-accent uppercase tracking-wider mt-1">Clients Served</div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={360} direction="up">
                <div className="flex flex-wrap items-center gap-4">
                  <a href="#contact" className="btn-solid text-xs py-3 px-6">
                    Work Together
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <a
                    href={siteSettings.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-xs py-3 px-6"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Sticky Editorial Sidebar Portrait (lg:col-span-5) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <Reveal delay={200} direction="left" scale={0.97}>
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
                  <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden relative mb-5">
                    <Image
                      src="/images/adham-pro.png"
                      alt="Adham Osama"
                      width={840}
                      height={1050}
                      priority
                      className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to bottom, transparent 50%, rgba(0,13,12,0.6) 80%, var(--color-bg) 100%)',
                      }}
                    />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                      <span className="bg-black/60 px-3 py-1 rounded-full text-white backdrop-blur-md border border-white/10">
                        Adham Osama
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Available
                      </span>
                    </div>
                  </div>

                  <div className="px-2 pb-2 space-y-2 text-xs font-mono text-gray-dim">
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span>ROLE</span>
                      <span className="text-white">Graphic Designer / AI Creator</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span>LOCATION</span>
                      <span className="text-white">Egypt 🇪🇬 (Global Remote)</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>SPECIALIZATION</span>
                      <span className="text-white">Social Media &amp; Brand Systems</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Editorial Experience Section ──────────────────────── */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
          <Reveal delay={0}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <SectionLabel className="mb-3">Career History</SectionLabel>
                <h2 className="text-[clamp(36px,4.5vw,56px)] font-bold tracking-[-0.03em] text-white">
                  Where I&apos;ve <span className="accent-serif">worked.</span>
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-dim uppercase tracking-widest">
                05 Entries / 2024 - Present
              </span>
            </div>
          </Reveal>

          <div className="divide-y divide-white/10">
            {experience.map((entry, index) => {
              const tagsMap: Record<string, string[]> = {
                bareq: ['Carousel Sets', 'Brand Alignment', 'Campaign Briefs'],
                'tar-group': ['250+ Creatives/Mo', 'Multi-Industry', 'High-Volume Production'],
                'tar-group-intern': ['Photo Manipulation', 'Campaign Production', 'Agency Deadlines'],
                hosoun: ['Saudi Market', 'Digital Ads', 'Website Banners'],
                'center-focus': ['Visual Identity Overhaul', 'Marketing Collateral', 'Brand System'],
              };
              const tags = tagsMap[entry.id] || [];

              return (
                <Reveal key={entry.id} delay={index * 80} direction="up">
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.25 }}
                    className="py-10 group transition-colors hover:bg-white/[0.015] px-4 md:px-6 rounded-2xl"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Index Number & Period */}
                      <div className="lg:col-span-3 flex items-center justify-between lg:block">
                        <span className="text-2xl font-mono font-bold text-accent/40 group-hover:text-accent transition-colors">
                          0{index + 1}
                        </span>
                        <div className="text-xs font-mono text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 inline-block mt-2">
                          {entry.period}
                        </div>
                      </div>

                      {/* Role & Company */}
                      <div className="lg:col-span-4">
                        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-accent transition-colors mb-1">
                          {entry.role}
                        </h3>
                        <p className="text-xs font-mono text-gray-dim uppercase tracking-widest">
                          {entry.company}
                        </p>
                      </div>

                      {/* Description & Tags */}
                      <div className="lg:col-span-5">
                        <p className="text-sm md:text-base text-gray font-light leading-[1.8] mb-4">
                          {entry.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-mono text-gray-dim bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Editorial Capabilities Section ───────────────────── */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
          <Reveal delay={0}>
            <div className="mb-16">
              <SectionLabel className="mb-3">Skillsets</SectionLabel>
              <h2 className="text-[clamp(36px,4.5vw,56px)] font-bold tracking-[-0.03em] text-white">
                What I bring to <span className="accent-serif">the table.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <Reveal key={skill.id} delay={index * 80} direction="up">
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-accent/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-accent">{skill.number}</span>
                    <Sparkles className="w-4 h-4 text-accent/40 group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors">
                    {skill.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium text-gray bg-white/[0.04] border border-white/[0.08]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial Software & Tools Section ──────────────── */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
          <Reveal delay={0}>
            <div className="mb-16">
              <SectionLabel className="mb-3">Stack</SectionLabel>
              <h2 className="text-[clamp(36px,4.5vw,56px)] font-bold tracking-[-0.03em] text-white">
                Tools of <span className="accent-serif">the trade.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Design Suite */}
            <div>
              <div className="text-xs font-mono text-accent uppercase tracking-widest mb-6 pb-2 border-b border-white/10">
                [ DESIGN &amp; PRODUCTION SUITE ]
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {designSoftware.map((item, index) => (
                  <Reveal key={item.id} delay={index * 50} direction="up" distance={16}>
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-accent/30 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm font-semibold text-white">{item.name}</span>
                      <span className="text-[10px] font-mono text-gray-dim uppercase">Design</span>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* AI Tools */}
            <div>
              <div className="text-xs font-mono text-accent uppercase tracking-widest mb-6 pb-2 border-b border-white/10">
                [ GENERATIVE AI &amp; WORKFLOWS ]
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aiTools.map((item, index) => (
                  <Reveal key={item.id} delay={index * 50} direction="up" distance={16}>
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-accent/30 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm font-semibold text-white">{item.name}</span>
                      <span className="text-[10px] font-mono text-gray-dim uppercase">AI Tool</span>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Editorial Creative Process ────────────────────────── */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
          <Reveal delay={0}>
            <div className="mb-16">
              <SectionLabel className="mb-3">Methodology</SectionLabel>
              <h2 className="text-[clamp(36px,4.5vw,56px)] font-bold tracking-[-0.03em] text-white">
                How I <span className="accent-serif">work.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.id} delay={index * 80} direction="up">
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between group hover:border-accent/30 transition-colors h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-2xl font-serif text-accent font-italic">{step.number}</span>
                        <Icon className="w-5 h-5 text-accent/60 group-hover:text-accent transition-colors" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray font-light leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────── */}
      <Contact />
    </main>
  );
}
