"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ImageIcon, ShieldCheck, ChevronRight, Sparkles, Apple, Salad, Pizza, Coffee } from "lucide-react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useMemo, useRef } from "react"

export default function LandingPage() {
  const heroRef = useRef(null)
  const morphRef = useRef(null)
  
  // Deterministic particle data (avoid Math.random in render to prevent hydration issues)
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        // Simple deterministic "pseudo-random" generator based on index
        const x = (i * 37) % 100
        const y = (i * 61) % 100
        const baseScale = 0.5 + ((i * 17) % 50) / 100 // 0.5 - 1.0
        const travelX = ((i * 23) % 150) - 75 // -75 to 74
        const travelY = ((i * 29) % 150) - 75 // -75 to 74
        const scaleDelta = 0.5 + ((i * 19) % 150) / 100 // 0.5 - 2.0
        const opacityMid = 0.4 + ((i * 11) % 50) / 100 // 0.4 - 0.9
        const duration = 8 + ((i * 7) % 80) / 10 // 8 - 16

        return {
          x,
          y,
          baseScale,
          travelX,
          travelY,
          scaleDelta,
          opacityMid,
          duration,
        }
      }),
    []
  )
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const { scrollYProgress: morphProgress } = useScroll({
    target: morphRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  
  // Morphing values - removed rotation to prevent flipping
  const morphScale = useTransform(morphProgress, [0, 0.25, 0.5, 0.75, 1], [1, 1.1, 1, 0.95, 1])
  const morphX = useTransform(morphProgress, [0, 0.5, 1], ["0%", "10%", "0%"])
  const morphY = useTransform(morphProgress, [0, 0.5, 1], ["0%", "-10%", "0%"])
  
  // Smooth spring animations
  const smoothMorphScale = useSpring(morphScale, { stiffness: 100, damping: 30 })

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50"
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">HealthyME</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How it Works
            </Link>
            <Link
              href="/dashboard"
              className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="lg" asChild>
              <Link href="/dashboard">Sign In</Link>
            </Button>
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Shape Morphing */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-[#640000] via-[#420001] to-[#040B15] py-24 md:py-40">
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" 
        />
        
        {/* MORPHING FOOD SHAPES - Continuous transformation */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Morphing Circle to Apple Shape */}
          <motion.div
            className="absolute left-[10%] top-[20%]"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.svg
              width="300"
              height="300"
              viewBox="0 0 200 200"
              className="opacity-20"
            >
              <motion.path
                d="M100,20 C140,20 180,50 180,100 C180,150 140,180 100,180 C60,180 20,150 20,100 C20,50 60,20 100,20 Z"
                fill="#B67E7D"
                animate={{
                  d: [
                    "M100,20 C140,20 180,50 180,100 C180,150 140,180 100,180 C60,180 20,150 20,100 C20,50 60,20 100,20 Z",
                    "M100,10 C130,10 160,30 170,70 C180,110 170,140 140,165 C110,180 70,180 40,160 C10,130 10,80 30,50 C50,20 70,10 100,10 Z",
                    "M100,20 C140,20 180,50 180,100 C180,150 140,180 100,180 C60,180 20,150 20,100 C20,50 60,20 100,20 Z"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.svg>
          </motion.div>

          {/* Morphing Salad Bowl Shape */}
          <motion.div
            className="absolute right-[15%] top-[30%]"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.svg
              width="250"
              height="250"
              viewBox="0 0 200 200"
              className="opacity-15"
            >
              <motion.path
                fill="#10b981"
                animate={{
                  d: [
                    "M100,50 Q150,50 170,80 Q180,100 170,120 Q150,150 100,150 Q50,150 30,120 Q20,100 30,80 Q50,50 100,50 Z",
                    "M100,40 Q160,40 180,70 Q190,90 180,110 Q160,140 100,160 Q40,140 20,110 Q10,90 20,70 Q40,40 100,40 Z",
                    "M100,50 Q150,50 170,80 Q180,100 170,120 Q150,150 100,150 Q50,150 30,120 Q20,100 30,80 Q50,50 100,50 Z"
                  ]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.svg>
          </motion.div>

          {/* Morphing Pizza Slice */}
          <motion.div
            className="absolute left-[60%] bottom-[20%]"
            animate={{
              scale: [1, 1.4, 1],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              className="opacity-25"
            >
              <motion.path
                fill="#f59e0b"
                animate={{
                  d: [
                    "M100,100 L180,150 Q185,155 180,160 Q170,170 160,165 L100,130 Z",
                    "M100,100 L170,140 Q180,150 175,165 Q165,180 150,175 L100,120 Z",
                    "M100,100 L180,150 Q185,155 180,160 Q170,170 160,165 L100,130 Z"
                  ]
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.svg>
          </motion.div>
        </div>
        
        {/* HUGE 3D Animated Apple - Constantly Moving */}
        <motion.div
          className="absolute right-[-10%] top-1/2 -translate-y-1/2 pointer-events-none"
          animate={{
            y: [-50, 50, -50],
            x: [-30, 30, -30],
            rotateY: [0, 360],
            rotateX: [-10, 10, -10],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Apple className="h-[600px] w-[600px] text-[#B67E7D]/20" strokeWidth={0.5} />
          </motion.div>
        </motion.div>

        {/* Animated gradient orbs with parallax */}
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#B67E7D]/30 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]) }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
        />
        
        {/* Floating particles with parallax */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute h-3 w-3 rounded-full bg-[#B67E7D]/30"
              initial={{ 
                x: `${particle.x}%`, 
                y: `${particle.y}%`,
                scale: particle.baseScale,
              }}
              animate={{ 
                y: [`${particle.y}%`, `${particle.y + particle.travelY}%`],
                x: [`${particle.x}%`, `${particle.x + particle.travelX}%`],
                scale: [particle.baseScale, particle.scaleDelta],
                opacity: [0.2, particle.opacityMid, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>

        <motion.div style={{ y, scale }} className="container relative mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div 
              initial={{ scale: 0, opacity: 0, rotateX: -180 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.05 }}
              className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-lg text-white backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
              <span>AI-Powered Nutrition Intelligence</span>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8 text-balance text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl"
            >
              Bring Clarity to{" "}
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-[#B67E7D] via-white to-[#B67E7D] bg-clip-text text-transparent bg-[length:200%_auto] inline-block"
              >
                Every Calorie
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12 text-pretty text-xl text-white/90 md:text-2xl lg:text-3xl leading-relaxed"
            >
              Transform your nutrition journey with AI-powered analysis, myth-busting insights, and instant image
              recognition. Make informed decisions backed by science.
            </motion.p>
            
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.5,
                type: "spring",
                stiffness: 100
              }}
              className="flex flex-col items-center justify-center gap-6 sm:flex-row"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button size="lg" className="bg-[#B67E7D] text-white hover:bg-[#A56D6C] w-full sm:w-auto group shadow-2xl shadow-[#B67E7D]/50 text-lg px-8 py-6" asChild>
                  <Link href="/dashboard">
                    Start Analyzing Now
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 w-full sm:w-auto text-lg px-8 py-6"
                  asChild
                >
                  <Link href="#features">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section with Continuous Scroll Effects */}
      <section id="features" className="py-16 md:py-24 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false }}
              className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              Powerful Features for Better Health
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: false }}
              className="text-xl md:text-2xl text-muted-foreground"
            >
              Everything you need to make informed nutrition decisions in one intelligent platform
            </motion.p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* AI Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
            >
            <Card className="border-border/50 bg-card transition-all hover:shadow-xl hover:shadow-primary/10 h-full backdrop-blur-sm p-2">
              <CardHeader className="pb-4">
                <motion.div 
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <Brain className="h-8 w-8 text-primary" />
                </motion.div>
                <CardTitle className="text-2xl font-bold">AI Analysis</CardTitle>
                <CardDescription className="leading-relaxed text-lg">
                  Get instant, detailed nutritional breakdowns powered by advanced AI. Just type any food item or meal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-base text-muted-foreground">
                  {[
                    "Complete macro and micronutrient data",
                    "Portion size adjustments",
                    "Visual macro breakdown"
                  ].map((item, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      viewport={{ once: false }}
                      className="flex items-start gap-3"
                    >
                      <ChevronRight className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            </motion.div>

            {/* Myth Busting */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
            >
            <Card className="border-border/50 bg-card transition-all hover:shadow-xl hover:shadow-secondary/10 h-full backdrop-blur-sm p-2">
              <CardHeader className="pb-4">
                <motion.div 
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/10"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <ShieldCheck className="h-8 w-8 text-secondary" />
                </motion.div>
                <CardTitle className="text-2xl font-bold">Myth Busting</CardTitle>
                <CardDescription className="leading-relaxed text-lg">
                  Separate nutrition facts from fiction with AI-verified answers backed by scientific research.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-base text-muted-foreground">
                  {[
                    "Science-backed verdict system",
                    "Cited scientific sources",
                    "Clear explanations"
                  ].map((item, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      viewport={{ once: false }}
                      className="flex items-start gap-3"
                    >
                      <ChevronRight className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            </motion.div>

            {/* Image Recognition */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
            >
            <Card className="border-border/50 bg-card transition-all hover:shadow-xl hover:shadow-accent/10 h-full backdrop-blur-sm p-2">
              <CardHeader className="pb-4">
                <motion.div 
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-accent/10"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <ImageIcon className="h-8 w-8 text-accent" />
                </motion.div>
                <CardTitle className="text-2xl font-bold">Image Recognition</CardTitle>
                <CardDescription className="leading-relaxed text-lg">
                  Snap a photo of your meal and get instant nutritional analysis with AI-powered food detection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-base text-muted-foreground">
                  {[
                    "Multi-food detection",
                    "Portion size estimation",
                    "Instant nutritional data"
                  ].map((item, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      viewport={{ once: false }}
                      className="flex items-start gap-3"
                    >
                      <ChevronRight className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MORPHING FOOD SHOWCASE - Scroll-triggered */}
      <section ref={morphRef} className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="inline-block">Analyze</span>{" "}
              <motion.span
                style={{ scale: smoothMorphScale }}
                className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
              >
                Any Food
              </motion.span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground">
              From fruits to full meals, our AI understands it all
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
            {/* Food Card 1 - Real Apple Image - TESTING WITHOUT ANIMATIONS */}
            <motion.div
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 min-h-[300px]"
            >
              <img 
                src="/food/apple.png" 
                alt="Fresh Apple" 
                className="absolute inset-0 w-full h-full object-cover z-0" 
                onError={(e) => {
                  console.error('Apple image failed to load');
                  e.currentTarget.src = '/placeholder.jpg';
                }}
                onLoad={() => console.log('Apple image loaded successfully')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl font-bold drop-shadow-lg">Fruits</h3>
                <p className="text-white/90 drop-shadow-md">Vitamins & Fiber</p>
              </div>
            </motion.div>

            {/* Food Card 2 - Real Salad Image - TESTING WITHOUT ANIMATIONS */}
            <motion.div
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 min-h-[300px]"
            >
              <img 
                src="/food/salad.png" 
                alt="Fresh Salad" 
                className="absolute inset-0 w-full h-full object-cover z-0" 
                onError={(e) => {
                  console.error('Salad image failed to load');
                  e.currentTarget.src = '/placeholder.jpg';
                }}
                onLoad={() => console.log('Salad image loaded successfully')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl font-bold drop-shadow-lg">Vegetables</h3>
                <p className="text-white/90 drop-shadow-md">Nutrients & Minerals</p>
              </div>
            </motion.div>

            {/* Food Card 3 - Real Pizza Image - TESTING WITHOUT ANIMATIONS */}
            <motion.div
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 min-h-[300px]"
            >
              <img 
                src="/food/pizza.png" 
                alt="Delicious Pizza" 
                className="absolute inset-0 w-full h-full object-cover z-0" 
                onError={(e) => {
                  console.error('Pizza image failed to load');
                  e.currentTarget.src = '/placeholder.jpg';
                }}
                onLoad={() => console.log('Pizza image loaded successfully')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl font-bold drop-shadow-lg">Meals</h3>
                <p className="text-white/90 drop-shadow-md">Complete Analysis</p>
              </div>
            </motion.div>

            {/* Food Card 4 - Real Coffee Image - TESTING WITHOUT ANIMATIONS */}
            <motion.div
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-700/10 to-amber-900/10 min-h-[300px]"
            >
              <img 
                src="/food/coffee.png" 
                alt="Fresh Coffee" 
                className="absolute inset-0 w-full h-full object-cover z-0" 
                onError={(e) => {
                  console.error('Coffee image failed to load');
                  e.currentTarget.src = '/placeholder.jpg';
                }}
                onLoad={() => console.log('Coffee image loaded successfully')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl font-bold drop-shadow-lg">Beverages</h3>
                <p className="text-white/90 drop-shadow-md">Calories & Content</p>
              </div>
            </motion.div>
          </div>

          {/* Morphing text */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: false }}
            className="text-center mt-20"
          >
            <motion.p
              style={{
                scale: useTransform(morphProgress, [0, 0.5, 1], [1, 1.1, 1]),
              }}
              className="text-2xl md:text-3xl text-muted-foreground font-medium"
            >
              Watch the magic happen as you <span className="text-primary font-bold">scroll</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/30 py-16 md:py-24 relative overflow-hidden">
        {/* Animated background circles */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false }}
              className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: false }}
              className="text-xl md:text-2xl text-muted-foreground"
            >
              Three simple steps to better nutrition knowledge
            </motion.p>
          </motion.div>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-3">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: -50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-center"
              >
                <motion.div 
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 360,
                    boxShadow: "0 0 30px rgba(100, 0, 0, 0.4)"
                  }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground shadow-xl"
                >
                  1
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: false }}
                  className="mb-3 text-2xl font-semibold"
                >
                  Search or Upload
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: false }}
                  className="text-muted-foreground text-lg"
                >
                  Type in any food item or upload a photo of your meal
                </motion.p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-center"
              >
                <motion.div 
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 360,
                    boxShadow: "0 0 30px rgba(182, 126, 125, 0.4)"
                  }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-3xl font-bold text-secondary-foreground shadow-xl"
                >
                  2
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: false }}
                  className="mb-3 text-2xl font-semibold"
                >
                  AI Analysis
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: false }}
                  className="text-muted-foreground text-lg"
                >
                  Our AI instantly analyzes and provides detailed nutritional data
                </motion.p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-center"
              >
                <motion.div 
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 360,
                    boxShadow: "0 0 30px rgba(66, 0, 1, 0.4)"
                  }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent text-3xl font-bold text-accent-foreground shadow-xl"
                >
                  3
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: false }}
                  className="mb-3 text-2xl font-semibold"
                >
                  Make Decisions
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: false }}
                  className="text-muted-foreground text-lg"
                >
                  Use science-backed insights to make informed dietary choices
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 bg-[length:200%_200%]"
        />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 backdrop-blur-sm hover:shadow-2xl transition-shadow">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <CardTitle className="mb-4 text-3xl font-bold md:text-4xl">
                  Ready to Transform Your Nutrition?
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <CardDescription className="text-lg">
                  Join thousands who are making smarter food choices with AI-powered insights
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                viewport={{ once: true }}
              >
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto group shadow-lg shadow-primary/50"
                  asChild
                >
                  <Link href="/dashboard">
                    Get Started Free
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                viewport={{ once: true }}
              >
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover:bg-primary/10" asChild>
                  <Link href="/nutrition">Try Analysis</Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">HealthyME</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered nutrition analysis and myth-busting platform
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/nutrition" className="hover:text-foreground transition-colors">
                    Nutrition Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/myths" className="hover:text-foreground transition-colors">
                    Myth Busting
                  </Link>
                </li>
                <li>
                  <Link href="/history" className="hover:text-foreground transition-colors">
                    History
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 HealthyME. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
