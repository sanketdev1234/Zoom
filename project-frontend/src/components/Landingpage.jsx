import React, { useState, useEffect, useRef } from 'react';
import { Video, MessageCircle, Shield, Calendar, Smartphone, Clipboard } from 'lucide-react';
import VideoCallingNavbar from "./ResizableNavbar";

const SanketMeetLanding = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorTrail, setCursorTrail] = useState([]);
  const animationFrameRef = useRef(null);
  const trailUpdateRef = useRef(0);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
    };

    const handleMouseMove = (e) => {
      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for smooth updates
      animationFrameRef.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        
        // Throttle trail updates (update every 3rd frame for performance)
        trailUpdateRef.current++;
        if (trailUpdateRef.current % 3 === 0) {
          setCursorTrail(prev => {
            const newTrail = [...prev, { 
              x: e.clientX, 
              y: e.clientY, 
              id: Date.now() + Math.random() 
            }];
            // Keep only last 5 trail points (reduced from 8 for performance)
            return newTrail.slice(-5);
          });
        }
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const handleClick = (e) => {
      // Create click ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      
      const container = document.getElementById('ripples-container');
      if (container) {
        container.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
          if (container.contains(ripple)) {
            container.removeChild(ripple);
          }
        }, 600);
      }

      // Create particles on click (reduced from 6 to 4 for performance)
      createClickParticles(e.clientX, e.clientY);
    };

    const createClickParticles = (x, y) => {
      for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 100;
        const hue = Math.random() * 60 + 200; // Blue to purple range
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = `hsl(${hue}, 70%, 60%)`;
        particle.style.setProperty('--random-x', randomX + 'px');
        particle.style.setProperty('--random-y', randomY + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
          if (document.body.contains(particle)) {
            document.body.removeChild(particle);
          }
        }, 2000);
      }
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleElements(prev => new Set(prev).add(entry.target.id));
        }
      });
    }, observerOptions);

    // Observe elements
    const elementsToObserve = document.querySelectorAll('[data-scroll-reveal]');
    elementsToObserve.forEach(el => observer.observe(el));

    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll('button, .feature-card, a');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      id: 'hd-video',
      icon: Video,
      title: 'HD Video Meetings',
      description: 'Experience crystal-clear video quality with advanced compression algorithms and adaptive streaming technology that ensures smooth meetings regardless of connection quality.'
    },
    {
      id: 'real-time-chat',
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Stay connected with instant messaging, file sharing, and collaborative whiteboarding. Share documents, images, and ideas seamlessly during your meetings.'
    },
    {
      id: 'privacy-security',
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Enterprise-grade end-to-end encryption, secure data centers, and compliance with international privacy standards ensure your conversations stay private.'
    },
    {
      id: 'smart-scheduling',
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent calendar integration, automated reminders, and time zone optimization make scheduling effortless. AI-powered suggestions find the perfect meeting times.'
    },
    {
      id: 'cross-platform',
      icon: Smartphone,
      title: 'Cross-Platform',
      description: 'Access SanketMeet from any device - desktop, mobile, or tablet. Seamless synchronization keeps you connected wherever you go with native apps and web access.'
    },
    {
      id: 'easy-integration',
      icon: Clipboard,
      title: 'Easy Integration',
      description: 'Connect with your favorite productivity tools, CRM systems, and workflows. Robust API support and pre-built integrations streamline your business processes.'
    }
  ];

  const FloatingElement = ({ className, children, delay = 0 }) => (
    <div 
      className={`floating-element ${className}`}
      style={{ 
        transform: `translateY(${scrollY * (0.3 + delay)}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  );

  return (
    <>
    <VideoCallingNavbar/>
      <style>{`
        /* Bootstrap CSS CDN */
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }

        .custom-bg-gradient {
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e8eaf6 100%);
          min-height: 100vh;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .floating-element {
          position: absolute;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .floating-2 {
          top: 20%;
          right: 15%;
          animation-delay: 2s;
        }
        
        .floating-3 {
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #0000FF, #667eea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: pulse 2s ease-in-out infinite;
          font-size: 5rem;
          font-weight: 900;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .gradient-text {
            font-size: 8rem;
          }
        }
        
        .shimmer-button {
          position: relative;
          overflow: hidden;
          background: linear-gradient(90deg, #2563eb, #4338ca);
          border: none;
          padding: 1rem 3rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          border-radius: 50px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .shimmer-button:hover {
          background: linear-gradient(90deg, #1d4ed8, #3730a3);
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        
        .shimmer-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .shimmer-button:hover::before {
          animation: shimmer 0.5s ease-out;
        }
        
        .scroll-reveal {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s ease;
        }
        
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .hero-section {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .hero-content {
          position: relative;
          z-index: 10;
        }

        .hero-description {
          font-size: 1.25rem;
          color: #6b7280;
          margin-bottom: 3rem;
          max-width: 48rem;
          line-height: 1.75;
        }

        @media (min-width: 768px) {
          .hero-description {
            font-size: 1.5rem;
          }
        }

        .animated-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .bg-blob-1 {
          position: absolute;
          top: 25%;
          left: 25%;
          width: 16rem;
          height: 16rem;
          background: linear-gradient(90deg, #bfdbfe, #e9d5ff);
          border-radius: 50%;
          mix-blend-mode: multiply;
          filter: blur(40px);
          opacity: 0.7;
          animation: pulse 4s ease-in-out infinite;
        }

        .bg-blob-2 {
          position: absolute;
          top: 33.333333%;
          right: 25%;
          width: 18rem;
          height: 18rem;
          background: linear-gradient(90deg, #e9d5ff, #fce7f3);
          border-radius: 50%;
          mix-blend-mode: multiply;
          filter: blur(40px);
          opacity: 0.7;
          animation: pulse 4s ease-in-out infinite;
          animation-delay: 2s;
        }

        .bg-blob-3 {
          position: absolute;
          bottom: 25%;
          left: 33.333333%;
          width: 20rem;
          height: 20rem;
          background: linear-gradient(90deg, #c7d2fe, #bfdbfe);
          border-radius: 50%;
          mix-blend-mode: multiply;
          filter: blur(40px);
          opacity: 0.7;
          animation: pulse 4s ease-in-out infinite;
          animation-delay: 4s;
        }

        .features-section {
          background: white;
          padding: 6rem 0;
          position: relative;
        }

        .section-divider {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6rem;
          background: linear-gradient(90deg, #eff6ff, #eef2ff);
          transform: skewY(-1deg);
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border: 1px solid #f3f4f6;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .feature-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          border-color: #93c5fd;
        }

        .feature-icon {
          width: 4rem;
          height: 4rem;
          background: linear-gradient(90deg, #2563eb, #4338ca);
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(10deg);
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
        }

        .feature-description {
          color: #6b7280;
          line-height: 1.75;
        }

        .features-title {
          font-size: 3rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }

        .title-underline {
          width: 6rem;
          height: 4px;
          background: linear-gradient(90deg, #2563eb, #4338ca);
          border-radius: 2px;
          margin: 0 auto;
        }

        .cursor-trail {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          width: 1.5rem;
          height: 1.5rem;
          background: linear-gradient(90deg, #60a5fa, #a78bfa);
          border-radius: 50%;
          opacity: 0.3;
          transition: all 0.1s ease-out;
          filter: blur(2px);
          transform: translate(-50%, -50%);
        }

        /* Advanced Cursor Effects */
        * {
          cursor: none;
        }

        .custom-cursor {
          position: fixed;
          width: 20px;
          height: 20px;
          border: 2px solid #2563eb;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
          transform: translate(-50%, -50%);
          will-change: transform;
        }

        .custom-cursor-dot {
          position: fixed;
          width: 4px;
          height: 4px;
          background: #2563eb;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transition: width 0.15s ease, height 0.15s ease, background 0.15s ease;
          transform: translate(-50%, -50%);
          will-change: transform;
        }

        .custom-cursor.hovering {
          width: 40px;
          height: 40px;
          border-color: #4338ca;
          background: rgba(67, 56, 202, 0.1);
          backdrop-filter: blur(10px);
        }

        .custom-cursor-dot.hovering {
          width: 6px;
          height: 6px;
          background: #4338ca;
        }

        .cursor-trail-dot {
          position: fixed;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          will-change: transform, opacity;
        }

        @keyframes trailFade {
          0% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
          }
        }

        .cursor-particles {
          position: fixed;
          pointer-events: none;
          z-index: 9997;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          animation: particleFloat 1.5s ease-out forwards;
          will-change: transform, opacity;
        }

        @keyframes particleFloat {
          0% {
            opacity: 0.8;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--random-x), var(--random-y)) scale(0);
          }
        }

        .cursor-ripple {
          position: fixed;
          border: 2px solid #2563eb;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9996;
          animation: rippleEffect 0.6s ease-out forwards;
          transform: translate(-50%, -50%);
        }

        @keyframes rippleEffect {
          0% {
            width: 0;
            height: 0;
            opacity: 0.6;
          }
          100% {
            width: 40px;
            height: 40px;
            opacity: 0;
          }
        }
      `}</style>

      <div className="custom-bg-gradient">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="hero-section d-flex align-items-center justify-content-center"
          id="home"
        >
          {/* Animated Background Pattern */}
          <div className="animated-bg">
            <div className="bg-blob-1"></div>
            <div className="bg-blob-2"></div>
            <div className="bg-blob-3"></div>
          </div>

          {/* Floating Elements */}
          <FloatingElement className="floating-1">
            <Video size={60} className="text-primary" style={{opacity: 0.2}} />
          </FloatingElement>
          <FloatingElement className="floating-2" delay={0.2}>
            <MessageCircle size={80} className="text-primary" style={{opacity: 0.2}} />
          </FloatingElement>
          <FloatingElement className="floating-3" delay={0.4}>
            <Shield size={70} className="text-primary" style={{opacity: 0.2}} />
          </FloatingElement>

          {/* Hero Content */}
          <div className="hero-content text-center container">
            <div className="row justify-content-center">
              <div className="col-lg-10 col-xl-8 ">
                <h1 className="gradient-text" style={{fontSize:"8vw"}}>
                  SanketMeet
                </h1>
                <p className="hero-description mx-auto">
                  Experience the future of video conferencing with crystal-clear connections, 
                  seamless collaboration, and enterprise-grade security.
                </p>
                <button className="shimmer-button d-inline-flex align-items-center">
                  Visit Dashboard
                  <span className="ms-2">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="features-section" id="features">
          {/* Section Divider */}
          <div className="section-divider"></div>
          
          <div className="container position-relative" style={{zIndex: 10}}>
            <div 
              className={`text-center mb-5 scroll-reveal ${visibleElements.has('features-title') ? 'visible' : ''}`}
              id="features-title"
              data-scroll-reveal
            >
              <h2 className="features-title">
                Powerful Features
              </h2>
              <div className="title-underline"></div>
            </div>

            <div className="row g-4">
              {features.map((feature, index) => (
                <div key={feature.id} className="col-lg-4 col-md-6">
                  <div
                    className={`feature-card h-100 scroll-reveal ${visibleElements.has(`feature-${index}`) ? 'visible' : ''}`}
                    id={`feature-${index}`}
                    data-scroll-reveal
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Feature Icon */}
                    <div className="feature-icon d-flex align-items-center justify-content-center">
                      <feature.icon className="text-white" size={32} />
                    </div>
                    
                    {/* Feature Content */}
                    <div className="text-center">
                      <h3 className="feature-title">
                        {feature.title}
                      </h3>
                      <p className="feature-description">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Cursor Effects */}
        <div 
          className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        />
        
        <div 
          className={`custom-cursor-dot ${isHovering ? 'hovering' : ''}`}
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        />

        {/* Cursor Trail */}
        {cursorTrail.map((point, index) => (
          <div
            key={point.id}
            className="cursor-trail-dot"
            style={{
              left: point.x,
              top: point.y,
              background: `hsl(${220 + index * 15}, 70%, ${60 + index * 8}%)`,
              animation: `trailFade 0.6s ease-out ${index * 0.03}s forwards`,
            }}
          />
        ))}

        {/* Click Ripples Container */}
        <div id="ripples-container"></div>
      </div>
      
    </>
  );
};

export default SanketMeetLanding;