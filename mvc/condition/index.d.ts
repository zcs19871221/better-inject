declare module 'http' {
  interface IncomingMessage {
    params: { [key: string]: string | string[] };
  }
}
