/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import Config from 'config';
import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import {
  MusicLibrary,
  OwnPlaylist,
  OwnPlaylistConfig,
  TrackDb,
} from 'renderer/types';
import buildTrackDb, { loadTrackDb } from './db-builder/track-db-builder';
import {
  deleteOwnPlaylist,
  writeOwnPlaylist,
} from './playlist-loader/own-playlists';
import loadAllPlaylistsFromDirectory, {
  createCategoryInfoForPlaylists,
} from './playlist-loader/playlist-loader';
import { resolveHtmlPath } from './utils';

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

let mainWindow: BrowserWindow | null = null;

// const config = app.commandLine.getSwitchValue('config') || 'config.yaml';

// const buildDb =
//   app.commandLine.getSwitchValue('builddb') ||
//   '/Users/vgriebel/Documents/github/juricane';
// if (buildDb) {
//   console.log('Build track database');
//   buildTrackDb(buildDb);
//   app.exit(0);
// }

ipcMain.handle('dialog:loadConfig', async () => {
  const filename = app.commandLine.getSwitchValue('config') || 'config.json';

  let config: string;
  try {
    config = await fs.readFile(filename, 'utf8');
  } catch (error) {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openFile'],
      title: 'Bitte öffne die config.json Datei',
    });

    if (result.canceled) return null;

    config = await fs.readFile(result.filePaths[0], 'utf8');
  }

  return JSON.parse(config);
});

ipcMain.handle(
  'files:loadLibrary',
  async (event, config: Config): Promise<MusicLibrary> => {
    let trackDb: TrackDb;
    try {
      trackDb = await loadTrackDb(config.trackDirectory);
    } catch (error) {
      try {
        await buildTrackDb(
          config.trackDirectory,
          config.artistSeparators,
          config.genreSeparators
        );
      } catch (err) {
        console.log(err);
        throw err;
      }
      trackDb = await loadTrackDb(config.trackDirectory);
    }

    const playlists = await loadAllPlaylistsFromDirectory(
      config.playlistDirectory
    );

    const playlistsMerged = createCategoryInfoForPlaylists(
      playlists,
      trackDb,
      config.trackDirectory
    );
    return { ...trackDb, playlists: playlistsMerged };
  }
);

ipcMain.handle(
  'files:updateOwnPlaylist',
  async (
    event,
    config: Config,
    playlist: OwnPlaylist,
    library: MusicLibrary
  ) => {
    await writeOwnPlaylist(config.ownPlaylistDirectory, playlist, library);
  }
);

ipcMain.handle(
  'files:deleteOwnPlaylist',
  async (event, config: Config, playlistName: string) => {
    await deleteOwnPlaylist(config.ownPlaylistDirectory, playlistName);
  }
);

ipcMain.handle(
  'files:loadOwnPlaylists',
  async (event, config: Config, library: MusicLibrary) => {
    const playlists = await loadAllPlaylistsFromDirectory(
      config.ownPlaylistDirectory
    );

    const playlistsMerged = createCategoryInfoForPlaylists(
      playlists,
      library,
      config.trackDirectory,
      false
    );

    return playlistsMerged.map<OwnPlaylist>((x) => ({
      name: x.name,
      trackIds: x.trackIds,
    }));
  }
);

ipcMain.handle('files:loadOwnPlaylistConfig', async (event, config: Config) => {
  try {
    const p = path.join(config.ownPlaylistDirectory, 'config.json');
    return JSON.parse(await fs.readFile(p, 'utf-8'));
  } catch (error) {
    const defaultValue: OwnPlaylistConfig = { scheduledPlaylists: [] };
    return defaultValue;
  }
});

ipcMain.handle(
  'files:saveOwnPlaylistConfig',
  async (event, config: Config, data: OwnPlaylistConfig) => {
    const p = path.join(config.ownPlaylistDirectory, 'config.json');
    await fs.writeFile(p, JSON.stringify(data), 'utf-8');
  }
);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: false,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
