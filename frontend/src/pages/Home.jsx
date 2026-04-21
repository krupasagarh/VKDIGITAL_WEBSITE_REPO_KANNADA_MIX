import React from "react";
import HeroSlider from "../components/HeroSlider";
import PlansSection from "../components/PlansSection";
import { SubscribeSection, CtaSection, OttMarquee, FeatureStrip } from "../components/Sections";

const Home = () => {
  return (
    <>
      <HeroSlider />
      <PlansSection />
      <SubscribeSection />
      <CtaSection />
      <OttMarquee />
      <FeatureStrip />
    </>
  );
};

export default Home;
