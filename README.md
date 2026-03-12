# Disk-Manager

# DISKCTL

![Platform](https://img.shields.io/badge/platform-Windows-blue)
![Electron](https://img.shields.io/badge/built%20with-Electron-47848f)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What is DISKCTL?

DISKCTL is a Windows desktop app that lets you offline and online a disk drive through a simple GUI — no command line required.

It was built to solve a common problem: **external hard drives that refuse to eject on Windows**. When Windows shows the "device is still in use" error and won't let you safely remove the drive, you can use DISKCTL to force the disk offline through `diskpart`, making it safe to physically unplug — even when the normal eject option fails.

Under the hood, DISKCTL runs directly on top of Windows `diskpart` via PowerShell, so the result is exactly the same as doing it manually through CMD — just faster and without memorizing any commands.

---

## Features

- Scan and list all connected disks with name, type, size, and status
- Select target disk from the list or input disk number manually
- One-click **OFFLINE** — safely cuts off Windows access to the disk so it can be unplugged
- One-click **ONLINE** — brings the disk back online after reconnecting
- Manual script copy for CMD fallback
- Dark terminal UI

---

## How to Use

**To safely unplug an external drive:**
1. Close all programs and files that may be using the drive
2. Open DISKCTL as Administrator
3. Click **SCAN DISKS** to detect all connected drives
4. Select the external drive you want to remove
5. Click **OFFLINE**
6. Physically unplug the drive

**To bring the drive back:**
1. Plug the drive back in
2. Click **SCAN DISKS**
3. Select the drive
4. Click **ONLINE**

> ⚠️ Always close all programs accessing the drive before going offline. Skipping this may cause data corruption.

---

## Requirements

- Windows 10 / 11
- Run as **Administrator** (required for diskpart)

---

## Download

Grab the latest `.exe` from [Releases](../../releases).

---

## Build from Source

```bash
git clone https://github.com/yourusername/diskctl.git
cd diskctl
npm install
npm run build
```

Output `.exe` will be in the `dist/` folder.

---

## Tech Stack

- [Electron](https://www.electronjs.org/)
- PowerShell / WMI — disk detection
- Vanilla JS + HTML/CSS — UI