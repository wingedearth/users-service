# Contributing to Users Service

## Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. All commit messages must be properly formatted.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```bash
# Feature
feat(auth): add JWT authentication middleware

# Bug fix
fix(api): handle invalid user ID format correctly

# Documentation
docs: update API documentation with new endpoints

# Chore
chore: update dependencies to latest versions

# Breaking change
feat(api)!: change user ID from number to string

BREAKING CHANGE: User IDs are now MongoDB ObjectIds instead of incremental numbers
```

### Scopes

Common scopes for this project:
- **api**: API routes and endpoints
- **db**: Database related changes
- **auth**: Authentication and authorization
- **config**: Configuration changes
- **tests**: Test related changes
- **docs**: Documentation changes

### Making Commits

#### Option 1: Interactive Commit (Recommended)
```bash
npm run commit
```
This will guide you through creating a properly formatted commit message.

#### Option 2: Manual Commit
```bash
git commit -m "feat(api): add user creation endpoint"
```

### Releases and Changelog

This project uses automated versioning and changelog generation:

```bash
# Generate a new release (patch version)
npm run release

# Generate specific version types
npm run release:patch    # 1.0.0 → 1.0.1
npm run release:minor    # 1.0.0 → 1.1.0
npm run release:major    # 1.0.0 → 2.0.0

# Preview what would be released
npm run release:dry-run
```

The changelog is automatically generated based on commit messages and will be updated in `CHANGELOG.md`.

### Pre-commit Hooks

This project has pre-commit hooks that will:
1. Build the TypeScript code to ensure it compiles
2. Validate commit messages using commitlint

If the build fails or commit message is invalid, the commit will be rejected.

### Development Workflow

1. Create a feature branch: `git checkout -b feat/new-feature`
2. Make your changes
3. Build and test: `npm run build && npm run test:api`
4. Commit your changes: `npm run commit`
5. Push to GitHub: `git push origin feat/new-feature`
6. Create a Pull Request

### Release Workflow

1. Ensure all changes are committed and pushed
2. Run `npm run release`
3. Push the tag: `git push --follow-tags origin main`
4. The changelog will be automatically updated
