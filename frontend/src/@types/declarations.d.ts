import 'react-native';

declare module 'react-native' {
  export interface ViewStyle {
    px?: number;
    pt?: number;
    mb?: number;
    // Adicione quaisquer outras propriedades personalizadas que você queira usar
  }
  export interface TextStyle {
    fontSize?: string | number;
  }
}
