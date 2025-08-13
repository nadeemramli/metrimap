// Userback widget type declarations

declare module "@userback/widget" {
  interface UserbackOptions {
    user_data?: {
      id: string;
      info?: {
        name?: string;
        email?: string;
        [key: string]: any;
      };
    };
    smarty?: boolean;
    delay?: number;
    [key: string]: any;
  }

  interface UserbackWidget {
    open: () => void;
    close: () => void;
    destroy: () => void;
    show: () => void;
    hide: () => void;
  }

  function Userback(token: string, options?: UserbackOptions): Promise<UserbackWidget>;
  export default Userback;
}

// Global window interface for Userback
declare global {
  interface Window {
    Userback?: {
      open: () => void;
      close: () => void;
      destroy: () => void;
      show: () => void;
      hide: () => void;
    };
  }
}
