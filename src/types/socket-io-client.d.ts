declare module 'socket.io-client' {
  export interface Socket {
    connected: boolean;
    on(event: string, listener: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): this;
    connect(): this;
    disconnect(): this;
  }

  export function io(
    uri?: string,
    opts?: {
      withCredentials?: boolean;
      transports?: string[];
      [key: string]: unknown;
    }
  ): Socket;
}
