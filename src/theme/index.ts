import { extendTheme } from "native-base";

// Extend the default theme provided by native-base
export const THEME = extendTheme({
        // Custom colors used in the application
        colors: {
          // Green shades
          green: {
            700: '#00875F',
            500: '#00B37E',
          },
          // Gray shades
          gray: {
            700: '#121214',
            600: '#202024',
            500: '#29292E',
            400: '#323238',
            300: '#7C7C8A',
            200: '#C4C4CC',
            100: '#E1E1E6'
          },
          // White color
          white: '#FFFFFF',
          // Red shades
          red: {
            500: '#F75A68'
          }
        },
        // Font configurations
        fonts: {
          // Font used for headings or prominent texts
          heading: 'Roboto_700Bold',
          // Default font used for general body content
          body: 'Roboto_400Regular',
        },
        // Standardized font sizes
        fontSizes: {
          xs: 12,
          sm: 14,
          md: 16,
          lg: 18,
          xl: 20,
        },
        // Custom size configurations
        sizes: {
          14: 56,
          33: 148
        }
      }
)
