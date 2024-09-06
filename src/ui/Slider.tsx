import React, { useState, useEffect, useRef } from "react";

const Slider = () => {
  const [value, setValue] = useState(1.0);
  const [hover, setHover] = useState(false);
  const [showValue, setShowValue] = useState(false);
  const hoverRef = useRef(hover);

  const getLabel = (value: number) => {
    if (value >= 0.0 && value <= 0.8) return "Precise";
    if (value <= 2.0 && value >= 1.2) return "Creative";
    return "Default";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
  };

  const handleMouseEnter = () => {
    setHover(true);
    setShowValue(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
    setTimeout(() => {
      if (!hoverRef.current) {
        setShowValue(false);
      }
    }, 1000); // Delay in milliseconds
  };

  useEffect(() => {
    hoverRef.current = hover;
    if (hover) {
      setShowValue(true);
    }
  }, [hover]);

  return (
    <div className="slider-container">
      {showValue && (
        <div className="slider-label" style={{ left: `${(value / 2) * 100}%` }}>
          {getLabel(value)}
        </div>
      )}
      <input
        type="range"
        min="0.0"
        max="2.0"
        step="0.1"
        value={value}
        onChange={handleChange}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="slider form-range"
      />
    </div>
  );
};

export default Slider;
