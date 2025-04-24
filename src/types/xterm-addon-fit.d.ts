declare module 'xterm-addon-fit' {
    import { Terminal } from 'xterm';
    
    export class FitAddon {
      activate(terminal: Terminal): void;
      fit(): void;
      dispose(): void;
    }
  }