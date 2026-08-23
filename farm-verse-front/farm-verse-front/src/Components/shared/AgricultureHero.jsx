import React from "react";
import { getAgricultureImage, getPageHeroImage, getCropHeroImage } from "../../utils/agricultureImages";
import "./AgricultureHero.css";

/**
 * AgricultureHero — Reusable hero/background section with agricultural imagery.
 *
 * Props:
 *   type      — "crop", "farm", "expense", "input", "ai", "page", "dashboard"
 *   category  — crop name, input category, page name (used for smart image lookup)
 *   image     — optional override URL
 *   overlay   — "dark" | "warm" | "light" | "none" (default: "dark")
 *   height    — CSS height (default: "320px")
 *   compact   — boolean, uses shorter height
 *   children  — content rendered on top
 */
const AgricultureHero = ({
  type = "page",
  category = "",
  image,
  overlay = "dark",
  height,
  compact = false,
  children,
}) => {
  // Resolve image URL
  let heroImage = image;
  if (!heroImage) {
    if (type === "crop" || type === "crop-hero") {
      heroImage = getCropHeroImage(category);
    } else if (type === "page") {
      heroImage = getPageHeroImage(category);
    } else {
      heroImage = getAgricultureImage(type, category);
    }
  }

  const resolvedHeight = height || (compact ? "200px" : "320px");

  return (
    <div
      className={`ag-hero ag-hero--${overlay}`}
      style={{ height: resolvedHeight }}
    >
      <img
        src={heroImage}
        alt=""
        className="ag-hero__img"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = getPageHeroImage("dashboard");
        }}
      />
      <div className={`ag-hero__overlay ag-hero__overlay--${overlay}`} />
      {children && <div className="ag-hero__content">{children}</div>}
    </div>
  );
};

export default AgricultureHero;
