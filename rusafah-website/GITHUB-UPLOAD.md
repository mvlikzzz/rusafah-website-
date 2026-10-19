# Rusafah website — GitHub upload

This package contains the website source, public assets, developer guides,
dependency lockfile and automated checks. It does not contain private
configuration, database records, CMS uploads, build output or Git history.

## Upload to the existing repository

Destination: https://github.com/mvlikzzz/rusafah-website-

### 1. Download and extract the source

Download the source ZIP and extract it. The extracted `rusafah-website` folder
contains `README.md`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`,
`artifacts/` and several configuration files whose names start with a dot.

Do not upload the ZIP itself as a repository file. Extract it first.

### 2. Install and sign in to GitHub Desktop

Download GitHub Desktop from https://desktop.github.com/ and sign in to the
`mvlikzzz` GitHub account. Complete authorization in your browser.

### 3. Clone the existing GitHub repository

In GitHub Desktop:

1. Select **File → Clone repository**.
2. Open the **URL** tab.
3. Enter `https://github.com/mvlikzzz/rusafah-website-.git`.
4. Choose a new local folder and select **Clone**.

An empty-repository message is normal if the repository has no commits yet.
Do not create or publish a second repository.

### 4. Copy the source into the clone

Open the cloned folder through **Repository → Show in Finder** on macOS
or **Show in Explorer** on Windows.

Copy the **contents** of the extracted `rusafah-website` folder into the cloned
repository folder. Do not copy the outer folder itself, or the website will be
unnecessarily nested.

Include the hidden configuration files and the `.github` directory:

- **macOS Finder:** press **Command + Shift + .** to show hidden files.
- **Windows Explorer:** enable **View → Show → Hidden items**.

Keep the clone's existing `.git` directory. Never delete or replace it.
The source ZIP has no `.git` directory.

If the destination already contains other work, stop and review it before
replacing files. This guide assumes the destination repository is empty.

### 5. Commit and push

Return to GitHub Desktop:

1. Confirm the changed files are the website source and guides.
2. Enter a summary such as **Initial Rusafah website**.
3. Select **Commit to main** (the button may show a different branch name).
4. Select **Push origin** or **Publish branch**, whichever is displayed.

Use the existing repository. Do not select **Publish repository**, which would
create a different repository.

### 6. Verify on GitHub

Open https://github.com/mvlikzzz/rusafah-website- and check that these are
at the repository root:

- `README.md`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `artifacts/rusafah-website/`
- `.github/workflows/website-ci.yml`

Check the **Actions** tab for the automated checks. Their result is separate
from the successful upload.

For a private company handover, confirm the repository is **Private** before
sharing access. Invite the company through the repository's collaborator/access
settings; do not give them your personal GitHub password.

## Developer handover

The development company should start with the root `README.md`, then read
`CONTRIBUTING.md` and the guides in `artifacts/rusafah-website/docs/`.
The font licenses remain included alongside their assets.

The company will need a PostgreSQL database and private environment settings
configured separately. These are intentionally not supplied in the source ZIP.
New changes made elsewhere are not automatically synchronized to this local clone;
copy and review those changes before making another commit.
