declare const PKG_VERSION: string
declare const NODE_UID: string
declare interface Window {
  ICESTARK?: {
    store: {
      store: { curProject?: { source: { wnlProjectId: number | null } } };
      storeEmitter: { curProject };
    };
  };
}
