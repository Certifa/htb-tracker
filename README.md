# HTB Tracker

A personal pentest tracker built for HackTheBox. Tailored to my exact workflow — not a generic checklist.

## Features

- **OS-aware** — pick Linux or Windows/AD at the start, only relevant phases load
- **Technique-based** — one item per goal, tool hints as subtle reminders
- **Note-first** — every step has a note field for findings, creds, hashes, commands
- **/etc/hosts helper** — built into recon, auto-fills IP, just type the domain
- **Obsidian export** — one click copies a formatted markdown note ready to paste
- **History view** — completed boxes logged with flags captured and key findings

## Phases

| Linux | Windows / AD |
|---|---|
| Recon | Recon |
| Enumeration (web-focused) | Enumeration (SMB, LDAP, Kerberos, DNS) |
| Exploitation | Exploitation |
| Post-Exploitation (linpeas, GTFOBins) | Post-Exploitation (BloodHound, Certipy, bloodyAD, Impacket) |
| Loot & Obsidian | Loot & Obsidian |

## Stack

Vite + React, deployed via GitHub Actions to GitHub Pages.

## Live

[certifa.github.io/htb-tracker](https://certifa.github.io/htb-tracker)
