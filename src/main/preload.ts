// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import Config from 'config';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { MusicLibrary } from 'renderer/types';

export type Channels = 'ipc-example' | 'open-playlists';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    loadConfig(): Promise<Config | null> {
      return ipcRenderer.invoke('dialog:loadConfig');
    },
    loadMusicLibrary(config: Config): Promise<MusicLibrary> {
      return ipcRenderer.invoke('files:loadLibrary', config);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
