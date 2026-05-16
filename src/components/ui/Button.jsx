import React from "react";

export function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  return (
    <button className={`button ${variant} ${size} ${className}`} type="button" {...props}>
      {children}
    </button>
  );
}
