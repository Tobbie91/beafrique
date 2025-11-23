// src/components/FeaturedRow.tsx

import { FeaturedBook } from "../pages/Resources";
import PressFeature from "./PressFeature";
import pressImage from "../assets/images/6.webp";    


export default function FeaturedRow() {
  return (
    <>
      {/* Book promo (compact) */}
      <FeaturedBook />

      {/* Press feature */}
      <PressFeature
        image={pressImage }
        source="Vanguard"
        dateISO="2025-08-01"
        readTime="2 min read"
        title="Be Afrique: Nigerian fashion designer brings heritage and eco-fashion to Britain"
        excerpt="Bukonla, a Nigerian-born fashion designer and writer, blends tailoring roots with academic research in sustainability to build a purposeful Fashion brand now present in the UK."
        articleUrl="https://www.vanguardngr.com/2025/08/be-afrique-nigerian-creative-brings-heritage-and-eco-fashion-to-britain/"
        secondaryHref="/about#mission-vision"
        secondaryText="Our mission & vision"
      />
    </>
  );
}
