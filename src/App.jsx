import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BRANCHES,
  CONTACT,
  CONTACT_INFO,
  FAQ_DATA,
  GALLERY_IMAGES,
  NAV_LINKS,
  PRICING,
  PROGRAMS,
  RESULTS,
  STATS,
  TESTIMONIALS,
  TRAINERS,
  TRUST_BADGES,
} from './data';
import * as knowledgeSource from './data';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const iconMap = {
  Target: '🎯',
  Flame: '🔥',
  TrendingUp: '📈',
  Trophy: '🏆',
  Zap: '⚡',
  Dumbbell: '🏋️',
  Swords: '🥊',
  Heart: '❤️',
  Users: '🤝',
};

const schedule = [
  {
    day: 'Monday',
    focus: 'Strength + Conditioning',
    slots: ['6:00 AM CrossFit', '7:30 AM Weight Training', '6:30 PM HIIT Boxing'],
  },
  {
    day: 'Wednesday',
    focus: 'Power + Core',
    slots: ['6:30 AM Cardio Blast', '5:30 PM Personal Training', '7:00 PM Mobility Flow'],
  },
  {
    day: 'Friday',
    focus: 'Endurance + Recovery',
    slots: ['6:00 AM Kick Boxing', '5:00 PM CrossFit', '7:30 PM Stretch & Recover'],
  },
];

const ratings = Array.from({ length: 5 });
const progressMetrics = [
  { label: 'Strength gain', value: 86, note: 'Avg. after 12 weeks' },
  { label: 'Stamina boost', value: 78, note: 'HIIT attendance' },
  { label: 'Mobility score', value: 72, note: 'Recovery program' },
];

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="max-w-2xl space-y-3">
    <p className="section-subtitle">{eyebrow}</p>
    <h2 className="section-title">{title}</h2>
    {description ? <p className="text-white/70">{description}</p> : null}
  </div>
);

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm the Adiyash Gym assistant. Ask me about memberships, programs, schedules, locations, or contact details.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const apiKey = import.meta.env.VITE_FASTROUTER_API_KEY;

  const knowledgeBase = useMemo(() => JSON.stringify(knowledgeSource, null, 2), []);

  const systemPrompt = `You are an AI chat assistant for Adiyash Gym. Answer ONLY using the information in the knowledge base below.
If the answer is not present in the knowledge base, say: "I can only answer based on the info available. Please ask about memberships, programs, schedules, locations, or contact details."

Knowledge base:
${knowledgeBase}`;

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setIsLoading(true);
    setErrorMessage('');

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'The chat service is not configured. Please add VITE_FASTROUTER_API_KEY to your environment.',
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://go.fastrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4-20250514',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: trimmed },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to reach the chat service. Please try again.');
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply || 'I can only answer based on the info available. Please ask about memberships or programs.',
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setErrorMessage(message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I ran into a problem connecting to the chat service. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      {isOpen ? (
        <div className="w-[min(360px,90vw)] overflow-hidden rounded-3xl border border-white/10 bg-black/90 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-sm font-semibold">AI Gym Assistant</p>
              <p className="text-xs text-white/50">Answers based on Adiyash Gym info</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-white/10 px-2 py-1 text-xs text-white/70 transition hover:border-brand-red hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="flex max-h-80 flex-col gap-4 overflow-y-auto px-5 py-4 text-sm">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'self-end bg-brand-red text-white'
                    : 'self-start border border-white/10 bg-white/5 text-white/80'
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading ? (
              <div className="self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/70">
                Typing…
              </div>
            ) : null}
          </div>
          <div className="border-t border-white/10 px-5 py-4">
            <label className="sr-only" htmlFor="chat-input">
              Ask a question
            </label>
            <div className="flex items-center gap-2">
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSend();
                  }
                }}
                placeholder="Ask about memberships, schedules..."
                className="flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isLoading}
                className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                Send
              </button>
            </div>
            {errorMessage ? <p className="mt-2 text-xs text-red-400">{errorMessage}</p> : null}
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-brand-red px-4 py-3 text-sm font-semibold shadow-glow transition hover:bg-brand-red-dark"
      >
        <span className="text-lg">💬</span>
        {isOpen ? 'Hide chat' : 'Ask AI'}
      </button>
    </div>
  );
};

const StatCard = ({ stat }) => (
  <motion.div
    variants={fadeUp}
    className="card-elevated p-6"
    whileHover={{ translateY: -6 }}
  >
    <div className="flex items-center gap-3 text-brand-red">
      <span className="icon-pill">{iconMap[stat.icon] ?? '💪'}</span>
      <h3 className="text-lg font-semibold">{stat.title}</h3>
    </div>
    <p className="mt-3 text-sm text-white/70">{stat.description}</p>
  </motion.div>
);

const ProgressBar = ({ metric }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm text-white/70">
      <span className="font-semibold text-white">{metric.label}</span>
      <span>{metric.value}%</span>
    </div>
    <div className="progress-track">
      <span className="progress-fill" style={{ width: `${metric.value}%` }} />
    </div>
    <p className="text-xs text-white/50">{metric.note}</p>
  </div>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-brand-black text-white">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-md">
        <nav className="section-wrapper flex flex-wrap items-center justify-between gap-4 py-4 sm:flex-nowrap">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-lg font-bold">A</span>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Adiyash</p>
              <p className="font-display text-lg font-semibold">Gym & Wellness</p>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a
              href={CONTACT.whatsapp}
              className="btn-primary px-5 py-2 text-xs sm:text-sm"
            >
              Book Trial
            </a>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="inline-flex items-center justify-center rounded-full border border-white/20 p-2 text-white/70 transition hover:border-brand-red hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black md:hidden"
            >
              <span className="text-lg">{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </nav>
        {isMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-black/90 md:hidden"
            id="mobile-menu"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 text-sm">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={CONTACT.whatsapp}
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-white/80 transition hover:border-brand-red hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <span>Chat on WhatsApp</span>
                <span className="text-brand-red">→</span>
              </a>
            </div>
          </motion.div>
        ) : null}
      </header>

      <main id="main-content">
        <section id="home" className="relative overflow-hidden">
          <div className="absolute inset-0">
            <picture>
              <source
                type="image/webp"
                srcSet="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w, https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=1400 1400w, https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=1800 1800w"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
              <img
                src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Gym hero"
                className="h-full w-full object-cover"
                fetchPriority="high"
                decoding="async"
                sizes="(min-width: 1024px) 60vw, 100vw"
                srcSet="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800 800w, https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1400 1400w, https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1800 1800w"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/30" />
            <div className="hero-orb hero-orb-left" aria-hidden="true" />
            <div className="hero-orb hero-orb-right" aria-hidden="true" />
          </div>
          <div className="relative section-wrapper flex flex-col gap-12 py-20 md:flex-row md:items-center md:py-28">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl space-y-6"
            >
              <span className="chip-strong">Mumbai&apos;s Boldest Gym Experience</span>
              <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
                Build Strength. <span className="text-brand-red">Own Your Story.</span>
              </h1>
              <p className="text-white/70">
                Adiyash Gym blends high-performance training, premium equipment, and expert coaching to help you transform your body
                and mindset.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#pricing"
                  className="btn-primary w-full text-center sm:w-auto"
                >
                  View Memberships
                </a>
                <a
                  href="#programs"
                  className="btn-secondary w-full text-center sm:w-auto"
                >
                  Explore Programs
                </a>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {TRUST_BADGES.map((badge) => (
                  <div key={badge.id} className="glass-strong rounded-2xl p-4 text-sm text-white/70">
                    <p className="font-semibold text-white">{badge.title}</p>
                    <p className="mt-2 text-xs text-white/60">{badge.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card-elevated w-full max-w-md p-8"
            >
              <h3 className="font-display text-2xl font-semibold">Start your transformation</h3>
              <p className="mt-3 text-sm text-white/70">
                Book a free orientation session with our trainers and get a custom roadmap in minutes.
              </p>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <span className="text-white/70">Call us</span>
                  <span className="font-semibold">{CONTACT_INFO.phone}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <span className="text-white/70">Email</span>
                  <span className="font-semibold">{CONTACT_INFO.email}</span>
                </div>
              </div>
              <a
                href={CONTACT.whatsapp}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                WhatsApp Us
              </a>
            </motion.div>
          </div>
        </section>
        <div className="gradient-divider" aria-hidden="true" />

        <section className="section-wrapper py-16">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Why us"
              title="A performance-first approach to fitness"
              description="Purpose-built programs, measurable milestones, and a supportive community that keeps you accountable."
            />
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
              <span className="chip">Safe • Clean • Certified</span>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <StatCard key={stat.title} stat={stat} />
            ))}
          </div>
        </section>

        <section className="bg-black/50 py-16">
          <div className="section-wrapper grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-6"
            >
              <SectionHeading
                eyebrow="Progress tracking"
                title="See your gains, week after week"
                description="Inspired by top gym landing pages, we highlight clear progress metrics and member milestones to keep motivation high."
              />
              <div className="space-y-5">
                {progressMetrics.map((metric) => (
                  <ProgressBar key={metric.label} metric={metric} />
                ))}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/70">
                {['Body composition scans', 'Trainer feedback loops', 'Monthly goals reset'].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 px-4 py-2">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="relative overflow-hidden rounded-3xl border border-white/10"
            >
              <picture>
                <source
                  type="image/webp"
                  srcSet="https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=600 600w, https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=1000 1000w"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
                <img
                  src="https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Trainer tracking progress"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  srcSet="https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=600 600w, https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=1000 1000w"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Progress snapshots</p>
                <h3 className="text-2xl font-semibold">Weekly check-ins with certified coaches</h3>
                <p className="text-sm text-white/70">
                  Body metrics, lifting PRs, and recovery scores all updated inside your member dashboard.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="section-wrapper py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Results"
                title="Measurable outcomes, not just workouts"
                description="We combine data-driven programming with accountability check-ins so members see tangible results."
              />
              <a href="#contact" className="btn-secondary">
                Book a free assessment
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {RESULTS.map((result) => (
                <div key={result.id} className="surface-panel space-y-3 text-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">{result.label}</p>
                  <p className="text-3xl font-semibold text-white">{result.value}</p>
                  <p className="text-white/60">{result.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="section-wrapper space-y-10 py-16">
          <SectionHeading
            eyebrow="Experience"
            title="Immerse yourself in the Adiyash energy"
            description="A cinematic preview of our premium training floors, recovery lounges, and high-intensity zones."
          />
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40"
            >
              <video
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1600"
              >
                <source
                  src="https://videos.pexels.com/video-files/4162659/4162659-hd_1920_1080_25fps.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/20 to-transparent" />
              <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
                Live tour
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-brand-red" />
              </div>
              <div className="absolute bottom-6 left-6 space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">60-second reel</p>
                <h3 className="font-display text-2xl font-semibold">Feel the momentum</h3>
              </div>
            </motion.div>
            <div className="grid gap-4">
              {[
                {
                  title: 'Immersive lighting',
                  description: 'Dynamic LEDs sync to your workout intensity for high-energy focus.',
                },
                {
                  title: 'Recovery lounge',
                  description: 'Contrast therapy, stretch bays, and hydration bars for total reset.',
                },
                {
                  title: 'Signature coaching',
                  description: 'Guided sessions with performance analytics and custom milestones.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-strong rounded-2xl p-5"
                >
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="mt-2 text-sm text-white/70">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="programs" className="section-wrapper space-y-10 py-16">
          <SectionHeading
            eyebrow="Programs"
            title="Training built for every fitness goal"
            description="Choose from high-energy group classes, personal training, and performance coaching designed to push you forward."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map((program, index) => (
              <motion.a
                key={program.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
                href={CONTACT.whatsapp}
                aria-label={`Learn more about ${program.title}`}
                className="group block cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-brand-red/60 hover:shadow-[0_20px_50px_rgba(239,68,68,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <div className="relative h-48">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`${program.image}&fm=webp&w=400 400w, ${program.image}&fm=webp&w=600 600w`}
                      sizes="(min-width: 1024px) 20vw, (min-width: 768px) 40vw, 90vw"
                    />
                    <img
                      src={program.image}
                      alt={program.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 20vw, (min-width: 768px) 40vw, 90vw"
                      srcSet={`${program.image}&w=400 400w, ${program.image}&w=600 600w`}
                    />
                  </picture>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                  <span className="absolute left-4 top-4 rounded-full bg-brand-red/90 px-3 py-1 text-xs font-semibold">
                    {program.title}
                  </span>
                </div>
                <div className="space-y-3 p-6">
                  <div className="flex items-center gap-3 text-brand-red">
                    <span className="text-2xl">{iconMap[program.icon] ?? '💥'}</span>
                    <h3 className="text-xl font-semibold">{program.title}</h3>
                  </div>
                  <p className="text-sm text-white/70">{program.description}</p>
                  <span className="text-sm font-semibold text-brand-red transition group-hover:text-white">
                    Learn more →
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <section id="schedule" className="bg-black/50 py-16">
          <div className="section-wrapper space-y-10">
            <SectionHeading
              eyebrow="Schedule"
              title="Weekly rhythm for relentless progress"
              description="Stay consistent with our curated class schedule, blending strength, conditioning, and recovery sessions."
            />
            <div className="grid gap-6 md:grid-cols-3">
              {schedule.map((day) => (
                <motion.div
                  key={day.day}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  className="glass-strong rounded-3xl p-6"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-red">{day.day}</p>
                  <h3 className="mt-3 text-xl font-semibold">{day.focus}</h3>
                  <ul className="mt-4 space-y-3 text-sm text-white/70">
                    {day.slots.map((slot) => (
                      <li key={slot} className="flex items-center justify-between">
                        <span>{slot}</span>
                        <span className="text-brand-red">●</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="section-wrapper space-y-10 py-16">
          <SectionHeading
            eyebrow="Gallery"
            title="A look inside our training zones"
            description="Premium equipment, functional spaces, and inspiring energy in every corner."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GALLERY_IMAGES.map((image, index) => (
              <motion.div
                key={image.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.04 }}
                className="overflow-hidden rounded-2xl border border-white/10 transition hover:-translate-y-1 hover:border-brand-red/50"
              >
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`${image.src}&fm=webp&w=400 400w, ${image.src}&fm=webp&w=700 700w`}
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 90vw"
                  />
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-48 w-full object-cover transition duration-500 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 90vw"
                    srcSet={`${image.src}&w=400 400w, ${image.src}&w=700 700w`}
                  />
                </picture>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="trainers" className="bg-black/50 py-16">
          <div className="section-wrapper space-y-10">
            <SectionHeading
              eyebrow="Trainers"
              title="Coach-led guidance at every step"
              description="Certified experts dedicated to your technique, recovery, and mindset."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {TRAINERS.map((trainer, index) => (
                <motion.a
                  key={trainer.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05 }}
                  href={CONTACT.whatsapp}
                  aria-label={`Book a session with ${trainer.name}`}
                  className="group block cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-brand-red/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                <div className="relative h-56">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`${trainer.image}&fm=webp&w=400 400w, ${trainer.image}&fm=webp&w=600 600w`}
                      sizes="(min-width: 1024px) 20vw, (min-width: 768px) 45vw, 90vw"
                    />
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 20vw, (min-width: 768px) 45vw, 90vw"
                      srcSet={`${trainer.image}&w=400 400w, ${trainer.image}&w=600 600w`}
                    />
                  </picture>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-lg font-semibold">{trainer.name}</h3>
                  <p className="text-sm text-brand-red">{trainer.specialty}</p>
                  <p className="text-sm text-white/60">{trainer.experience} experience</p>
                  <span className="text-sm font-semibold text-white/70 transition group-hover:text-white">
                    Book session →
                  </span>
                </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <section className="section-wrapper space-y-10 py-16">
          <SectionHeading
            eyebrow="Testimonials"
            title="Members who chose strength"
            description="Real success stories from our community of athletes, parents, and busy professionals."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
                className="glass-strong rounded-3xl p-6"
              >
                <div className="flex items-center gap-4">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`${testimonial.image}&fm=webp&w=80 80w, ${testimonial.image}&fm=webp&w=120 120w`}
                    />
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full border border-white/20 object-cover"
                      loading="lazy"
                      decoding="async"
                      srcSet={`${testimonial.image}&w=80 80w, ${testimonial.image}&w=120 120w`}
                    />
                  </picture>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-white/60">{testimonial.duration}</p>
                  </div>
                </div>
                <div
                  className="mt-4 flex items-center gap-1 text-brand-red"
                  aria-label={`${testimonial.rating} out of 5 stars`}
                >
                  {ratings.map((_, starIndex) => (
                    <span key={`${testimonial.id}-${starIndex}`} aria-hidden="true">
                      {starIndex < testimonial.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-white/70">{testimonial.review}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="pricing" className="bg-black/50 py-16">
          <div className="section-wrapper space-y-10">
            <SectionHeading
              eyebrow="Pricing"
              title="Memberships crafted for your ambition"
              description="Flexible plans with premium amenities, personal coaching, and exclusive perks."
            />
            <div className="grid gap-6 md:grid-cols-3">
              {PRICING.map((plan, index) => (
                <motion.a
                  key={plan.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05 }}
                  href={CONTACT.whatsapp}
                  aria-label={`Start ${plan.tier} membership`}
                  className={`group block cursor-pointer relative rounded-3xl border p-6 transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                    plan.popular
                      ? 'border-brand-red bg-white/10 shadow-glow'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {plan.popular ? (
                    <span className="absolute -top-3 right-6 rounded-full bg-brand-red px-3 py-1 text-xs font-semibold">
                      Most Popular
                    </span>
                  ) : null}
                  {plan.badge ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                      {plan.badge}
                    </span>
                  ) : null}
                  <h3 className="text-xl font-semibold">{plan.tier}</h3>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-3xl font-semibold">₹{plan.price}</span>
                    <span className="text-sm text-white/60">{plan.period}</span>
                  </div>
                  <ul className="list-check mt-6 space-y-3 text-sm text-white/70">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-red px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-brand-red-dark">
                    Start {plan.tier}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <section className="section-wrapper space-y-10 py-16">
          <SectionHeading
            eyebrow="Locations"
            title="Find the branch closest to you"
            description="Train at any Adiyash Gym location with seamless access and friendly staff."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BRANCHES.map((branch, index) => (
              <motion.div
                key={branch.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.04 }}
                className="glass-strong rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold">{branch.name}</h3>
                <p className="mt-2 text-sm text-white/70">{branch.area}</p>
                <p className="mt-4 text-sm font-semibold text-brand-red">{branch.phone}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-black/50 py-16">
          <div className="section-wrapper space-y-10">
            <SectionHeading
              eyebrow="FAQ"
              title="Everything you need to know"
              description="Answers to common questions about memberships, amenities, and support."
            />
            <div className="grid gap-6 md:grid-cols-2">
              {FAQ_DATA.map((faq, index) => (
                <motion.details
                  key={faq.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.03 }}
                  className="glass-strong rounded-2xl p-6"
                >
                  <summary className="cursor-pointer text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm text-white/70">{faq.answer}</p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-wrapper space-y-10 py-16">
          <SectionHeading
            eyebrow="Contact"
            title="Ready to start? Let&apos;s talk"
            description="Reach out to our team and reserve your first session today."
          />
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="glass-strong rounded-3xl p-8"
            >
              <h3 className="text-xl font-semibold">Send us a message</h3>
              <form className="mt-6 grid gap-4 text-sm">
                <label htmlFor="full-name" className="sr-only">
                  Full name
                </label>
                <input
                  id="full-name"
                  name="fullName"
                  type="text"
                  placeholder="Full name"
                  autoComplete="name"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                />
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                />
                <label htmlFor="preferred-branch" className="sr-only">
                  Preferred branch
                </label>
                <input
                  id="preferred-branch"
                  name="preferredBranch"
                  type="text"
                  placeholder="Preferred branch"
                  autoComplete="organization"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                />
                <label htmlFor="goals" className="sr-only">
                  Tell us about your goals
                </label>
                <textarea
                  id="goals"
                  name="goals"
                  rows="4"
                  placeholder="Tell us about your goals"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                />
                <button
                  type="submit"
                  className="rounded-full bg-brand-red px-6 py-3 font-semibold shadow-glow transition hover:bg-brand-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Request Callback
                </button>
              </form>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-strong rounded-3xl p-6">
                <h4 className="text-lg font-semibold">Contact details</h4>
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  <p>Phone: {CONTACT_INFO.phone}</p>
                  <p>Email: {CONTACT_INFO.email}</p>
                  <p>Address: {CONTACT_INFO.address}</p>
                  <p>Hours: {CONTACT_INFO.hours}</p>
                </div>
              </div>
              <div className="glass-strong rounded-3xl p-6">
                <h4 className="text-lg font-semibold">Quick actions</h4>
                <div className="mt-4 space-y-3 text-sm">
                  <a
                    href={CONTACT.whatsapp}
                    className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 transition hover:border-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <span>Chat on WhatsApp</span>
                    <span className="text-brand-red">→</span>
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 transition hover:border-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <span>Email us</span>
                    <span className="text-brand-red">→</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="section-wrapper flex flex-col gap-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-white">Adiyash Gym</p>
            <p className="mt-2">High-performance training with a bold mindset.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {link.label}
              </a>
            ))}
          </div>
          <p>© 2025 Adiyash Gym. All rights reserved.</p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default App;
