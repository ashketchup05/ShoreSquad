# Git Setup Instructions for ShoreSquad

## Installing Git (if not already installed)

### Windows
1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/VS Code

### Alternative: GitHub Desktop
1. Download from: https://desktop.github.com/
2. Provides a GUI for Git operations

## Initial Git Setup

Once Git is installed, run these commands in the terminal:

```bash
# Navigate to project directory
cd "c:\Users\junxu\Desktop\C240"

# Initialize Git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: ShoreSquad beach cleanup community app

- HTML5 boilerplate with semantic structure
- Responsive CSS with ocean-inspired design system
- Interactive JavaScript with map and weather features
- PWA functionality with service worker
- Accessibility features (WCAG 2.1 AA)
- Live Server configuration
- Complete project documentation"

# Set up remote repository (optional)
# git remote add origin <your-repository-url>
# git branch -M main
# git push -u origin main
```

## Recommended Git Workflow

```bash
# Check status
git status

# Add specific files
git add filename.ext

# Add all changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to remote (if set up)
git push
```

## .gitignore File

The project includes a comprehensive .gitignore file that excludes:
- Node.js dependencies (node_modules/)
- Operating system files (.DS_Store, Thumbs.db)
- IDE files (.vscode/settings.json)
- Temporary files (*.tmp, *.log)
- API keys and sensitive data (.env files)

## GitHub Repository Setup (Optional)

1. Create a new repository on GitHub
2. Don't initialize with README (we already have one)
3. Copy the repository URL
4. Add it as remote origin:
   ```bash
   git remote add origin <repository-url>
   git branch -M main
   git push -u origin main
   ```

## Useful Git Commands

```bash
# View commit history
git log --oneline

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature

# Pull latest changes
git pull

# View differences
git diff
```
