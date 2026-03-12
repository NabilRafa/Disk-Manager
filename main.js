const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

function createWindow() {
  const win = new BrowserWindow({
    width: 660,
    height: 820,
    minWidth: 560,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
    title: 'Disk Manager',
    backgroundColor: '#0a0c0f'
  });

  win.loadFile('disk-manager.html');
}

// ─────────────────────────────────────────
// IPC: List all disks via PowerShell + WMI
// ─────────────────────────────────────────
ipcMain.handle('list-disks', async () => {
  return new Promise((resolve) => {
    const ps = [
      'Get-Disk',
      '| Select-Object Number, FriendlyName, Model, BusType, Size, OperationalStatus',
      '| ConvertTo-Json -Compress'
    ].join(' ');

    exec(`powershell -NoProfile -Command "${ps}"`, { timeout: 10000 }, (err, stdout, stderr) => {
      if (err || !stdout.trim()) {
        console.error('list-disks error:', err || stderr);
        resolve([]);
        return;
      }
      try {
        let raw = JSON.parse(stdout.trim());
        if (!Array.isArray(raw)) raw = [raw];

        const disks = raw.map(d => {
          const sizeBytes = d.Size || 0;
          const sizeGB = (sizeBytes / 1e9).toFixed(1);
          const busType = (d.BusType || '').toString();

          let type = 'HDD';
          if (busType === '17' || busType === 'USB') type = 'USB';
          else if (busType === '11' || busType === 'SATA') type = sizeBytes < 300e9 ? 'SSD' : 'HDD';
          else if (busType === '7' || busType === 'NVMe') type = 'NVMe';

          return {
            num: d.Number,
            name: d.FriendlyName || d.Model || ('Disk ' + d.Number),
            type: type,
            size: sizeGB + ' GB',
            status: (d.OperationalStatus === 'Online' || d.OperationalStatus === 1) ? 'online' : 'offline'
          };
        });

        resolve(disks);
      } catch (parseErr) {
        console.error('list-disks parse error:', parseErr);
        resolve([]);
      }
    });
  });
});

// ─────────────────────────────────────────
// IPC: Run diskpart commands via script file
// ─────────────────────────────────────────
ipcMain.handle('run-diskpart', async (event, commands) => {
  return new Promise((resolve) => {
    const tmpFile = path.join(os.tmpdir(), 'diskmanager_script.txt');

    try {
      fs.writeFileSync(tmpFile, commands, 'utf8');
    } catch (writeErr) {
      resolve({ output: 'Gagal menulis script: ' + writeErr.message, error: true });
      return;
    }

    exec(`diskpart /s "${tmpFile}"`, { shell: true, timeout: 15000 }, (err, stdout, stderr) => {
      // Cleanup temp file
      try { fs.unlinkSync(tmpFile); } catch (_) {}

      const output = (stdout || stderr || '').trim();
      resolve({
        output: output || 'Perintah selesai dijalankan.',
        error: !!err
      });
    });
  });
});

// ─────────────────────────────────────────
// App lifecycle
// ─────────────────────────────────────────
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});