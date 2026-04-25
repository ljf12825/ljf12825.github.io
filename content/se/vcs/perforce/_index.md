---
title: Perforce
type: file
---

# Perforce

<!--more-->

Perforce, now generally referring to Helix Core, the core tool provided by Perforce Software, is an enterprise-grade version control system (VCS). It's designed for large teams, large files, and high performance.

It uses a centralized architecture; all data resides on the server, and developers only work in their workspaces.

Perforce has very strong support for large files, making it particularly suitable for:

- Game development
- Art assets
- Binary files

### Features

#### File Locking

Perforce supports checkout locking, meaning that only one person can modify a file at a time, avoiding conflicts.

#### Performance

Perforce performs exceptionally well in handling terabyte-scale repositories, teams of thousands, and hundreds of thousands of files in a single repository.

### Core Concepts

- depot (repository), similar to a Git repository
- workspace, a local mapping
- changelist (changeset), added to the changelist before committing
- sync: pulls files from the server, similar to `git pull`, but with finer granularity
- submit: commits to the server, similar to `git push`

### Disadvantages:

- Paid service
- Branch operations are not as flexible as with Git
- Weak offline capabilities
