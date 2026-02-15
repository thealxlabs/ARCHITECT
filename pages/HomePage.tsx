import React from 'react';
import Hero from '../components/Hero';

const HomePage: React.FC = () => {
  const handleStart = () => {
    window.location.href = '/signup';
  };

  return <Hero onStart={handleStart} />;
};

export default HomePage;
