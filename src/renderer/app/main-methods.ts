export const openPlaylistDirectory = () => {
  return window.electron.ipcRenderer.openPlaylistDirectory() as Promise<
    string | null
  >;
};

export default null;
