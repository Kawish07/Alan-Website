import React from 'react';
import { useScrollAnimation } from '../hooks/useAnimation';

const AnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fade-up',
  delay = 0 
}) => {
  const [ref, isVisible] = useScrollAnimation();

  const animationClasses = {
    'fade-up': 'opacity-0 translate-y-10',
    'fade-down': 'opacity-0 -translate-y-10',
    'fade-left': 'opacity-0 -translate-x-10',
    'fade-right': 'opacity-0 translate-x-10',
    'zoom-in': 'opacity-0 scale-95',
  };

  const visibleClasses = {
    'fade-up': 'opacity-100 translate-y-0',
    'fade-down': 'opacity-100 translate-y-0',
    'fade-left': 'opacity-100 translate-x-0',
    'fade-right': 'opacity-100 translate-x-0',
    'zoom-in': 'opacity-100 scale-100',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible ? visibleClasses[animation] : animationClasses[animation]
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;