/**
 * Type declaration for SVG modules.
 * This enables using SVGs as React components in the application.
 * By using this declaration, when we import an SVG file,
 * TypeScript understands that it's a React component.
 */
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";

  // Define the SVG component type.
  const content: React.FC<SvgProps>;

  // Export the SVG component.
  export default content;
}
