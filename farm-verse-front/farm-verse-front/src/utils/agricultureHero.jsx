import React from "react";

import {
  getCropHeroImage,
  getPageHeroImage,
} from "../../utils/agricultureImages";

import "./AgricultureHero.css";

function AgricultureHero({
  type = "farm",
  category = "",
  overlay = "dark",
  height = "320px",
  children,
}) {
  const image =
    type === "crop"
      ? getCropHeroImage(category)
      : getPageHeroImage(type);

  return (
    <section
      className={`agri-hero agri-hero-${overlay}`}
      style={{
        "--hero-image": `url("${image}")`,
        "--hero-height": height,
      }}
    >
      <div className="agri-hero-content">
        {children}
      </div>
    </section>
  );
}

export default AgricultureHero;