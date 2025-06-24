
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Clock, Users, MapPin, Shield, Activity, Heart } from 'lucide-react';
import Scene3D from '@/components/3D/Scene3D';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ModernHomepage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen flex items-center justify-center"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Scene3D />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-10" />
        
        {/* Hero content */}
        <div className="relative z-20 text-center max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-black tracking-tight mb-6">
              <span className="bg-gradient-to-r from-red-500 via-white to-green-500 bg-clip-text text-transparent">
                TERO
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-light text-gray-300 mb-4">
              When minutes matter, we make them count.
            </p>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              AI-powered emergency health routing platform that connects paramedics 
              with the right hospitals in critical moments.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              onClick={handleGetStarted}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Start Emergency Response <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
            >
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* Problem Section */}
      <motion.section 
        className="py-32 px-6 bg-gradient-to-b from-black to-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-bold mb-8 text-red-400">The Problem</h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Every second counts in emergency medical response. Yet paramedics often waste 
              critical time finding available hospitals with the right specialists and equipment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Time Lost", desc: "Average 12 minutes wasted per emergency call", color: "text-red-400" },
              { icon: Users, title: "Lives at Risk", desc: "30% increase in mortality when delayed", color: "text-orange-400" },
              { icon: MapPin, title: "Poor Routing", desc: "Manual hospital selection leads to inefficiency", color: "text-yellow-400" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800/50 border-gray-700 p-8 h-full hover:bg-gray-800/70 transition-all duration-300">
                  <CardContent className="text-center p-0">
                    <item.icon className={`h-16 w-16 ${item.color} mx-auto mb-6`} />
                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-gray-400 text-lg">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Solution Section */}
      <motion.section 
        className="py-32 px-6 bg-gradient-to-b from-gray-900 to-blue-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-bold mb-8 text-blue-400">The Solution</h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              TERO uses AI to instantly match patients with optimal hospitals based on 
              real-time capacity, specialist availability, and emergency severity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Activity, title: "AI Matching", desc: "Intelligent hospital routing in under 3 seconds", color: "text-blue-400" },
              { icon: Heart, title: "Real-time Data", desc: "Live hospital capacity and specialist availability", color: "text-green-400" },
              { icon: Shield, title: "Emergency Ready", desc: "Disaster mode for mass casualty events", color: "text-purple-400" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <Card className="bg-gray-800/50 border-gray-700 p-8 h-full hover:bg-gray-800/70 transition-all duration-300 hover:shadow-2xl">
                  <CardContent className="text-center p-0">
                    <item.icon className={`h-16 w-16 ${item.color} mx-auto mb-6`} />
                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-gray-400 text-lg">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Impact Section */}
      <motion.section 
        className="py-32 px-6 bg-gradient-to-b from-blue-900 to-green-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-6xl font-bold mb-8 text-green-400">The Impact</h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-16">
              TERO transforms emergency response, saving lives through intelligent routing and real-time coordination.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              { number: "73%", label: "Faster Response" },
              { number: "45%", label: "Reduced Mortality" },
              { number: "92%", label: "Hospital Efficiency" },
              { number: "24/7", label: "AI Availability" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-xl text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Button 
              onClick={handleGetStarted}
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-xl font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Join the Emergency Revolution <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">TERO</h3>
          <p className="text-gray-400 mb-8">Emergency Response. Reimagined.</p>
          <div className="flex justify-center space-x-8 text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernHomepage;
