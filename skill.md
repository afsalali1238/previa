---
name: app-development
description: Comprehensive skill for building full-stack applications with best practices, structured workflows, and anti-hallucination measures. Use when users want to create web apps, mobile apps, or software projects from scratch.
---

# App Development Skill

A comprehensive skill for creating high-quality applications with structured development processes, best practices, and built-in safeguards against hallucination.

## Core Principles

1. **Requirements First**: Never start coding without clear, documented requirements
2. **Question Before Assume**: Ask clarifying questions to prevent hallucination
3. **Document Everything**: Maintain living documentation throughout development
4. **Modular Architecture**: Break complex systems into manageable modules
5. **Iterative Development**: Build, test, refine in small increments
6. **Code Quality**: Follow language-specific best practices and patterns

---

## Critical Pre-Development Questions

Before writing ANY code, Claude MUST ask these questions and document answers in `prd.md`:

### 1. Application Type & Scope
- What type of application? (web app, mobile app, CLI tool, API, desktop app)
- Single-page or multi-page?
- Real-time features needed?
- Expected user base size?

### 2. Technology Stack
- Frontend framework preference? (React, Vue, Svelte, vanilla JS, etc.)
- Backend framework? (Node.js/Express, Python/Flask, etc.)
- Database type? (SQL, NoSQL, both?)
- Authentication method? (OAuth, JWT, session-based, none?)

### 3. Core Features
- What are the 3-5 ESSENTIAL features? (MVP scope)
- What are nice-to-have features? (future iterations)
- Any third-party integrations required?
- File upload/download needs?

### 4. Design & UX
- Design style preference? (modern, minimal, colorful, corporate)
- Mobile-first or desktop-first?
- Accessibility requirements?
- Existing design system or brand guidelines?

### 5. Data & State
- What data needs to be stored?
- Real-time updates required?
- Data relationships and structure?
- State management complexity? (local, global, server-synced)

### 6. Deployment & Environment
- Where will this be deployed? (Vercel, AWS, local, etc.)
- Development environment? (local setup, containerized)
- Environment variables needed?
- CI/CD requirements?

### 7. Security & Compliance
- Sensitive data handling?
- User roles and permissions?
- GDPR/privacy requirements?
- Rate limiting needs?

### 8. Performance & Scale
- Expected traffic volume?
- Performance benchmarks?
- Caching strategy?
- CDN requirements?

---

## Development Workflow

### Phase 1: Discovery & Documentation (MANDATORY)

1. **Read existing docs** if they exist in `/home/claude/docs/`:
   ```bash
   view /home/claude/docs
   ```

2. **Ask clarifying questions** using the questions above

3. **Create/Update documentation files**:
   - `prd.md` - Product Requirements Document
   - `modules.md` - System architecture and module breakdown
   - `path.md` - Directory structure and file paths
   - `current.md` - Current progress tracking
   - `memory.md` - Development log and decisions

4. **Get user confirmation** before proceeding to implementation

### Phase 2: Architecture Design

1. **Design module structure** in `modules.md`:
   ```
   - Core modules (authentication, database, routing)
   - Feature modules (user management, content, etc.)
   - Utility modules (helpers, constants, types)
   - Dependencies between modules
   ```

2. **Define directory structure** in `path.md`:
   ```
   /src
     /components
     /pages
     /services
     /utils
     /hooks
     /types
     /styles
   /public
   /tests
   /docs
   ```

3. **Identify dependencies and tools**:
   - Package requirements
   - Build tools
   - Testing frameworks
   - Development tools

### Phase 3: Implementation

1. **Follow the module plan** - Build one module at a time

2. **Write clean, documented code**:
   - Use TypeScript/type hints where applicable
   - Add JSDoc/docstrings for functions
   - Include inline comments for complex logic
   - Follow naming conventions

3. **Update `current.md`** after each module:
   ```markdown
   ## Current Status: [Module Name]
   - ✅ Completed: [features]
   - 🚧 In Progress: [current work]
   - ⏳ Pending: [next steps]
   ```

4. **Log decisions in `memory.md`**:
   ```markdown
   ## [Date] - [Decision]
   ### Context
   [Why this decision was made]
   ### Implementation
   [What was implemented]
   ### Alternatives Considered
   [Other options and why they were rejected]
   ```

### Phase 4: Testing & Refinement

1. **Test each module** before moving to the next
2. **Fix bugs** and update documentation
3. **Refactor** for clarity and performance
4. **Update all docs** to reflect changes

---

## Best Coding Practices by Language

### JavaScript/TypeScript

**File Organization**
```javascript
// 1. Imports (external, then internal)
import React from 'react';
import { useState } from 'react';
import { MyComponent } from './components';

// 2. Constants
const API_URL = 'https://api.example.com';

// 3. Types/Interfaces (TypeScript)
interface User {
  id: string;
  name: string;
}

// 4. Main component/function
export default function App() {
  // Component logic
}

// 5. Helper functions (if small, otherwise separate file)
function helper() {}
```

**Naming Conventions**
- Variables/Functions: `camelCase`
- Components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.js` or `PascalCase.tsx` (components)
- Folders: `kebab-case`

**Code Quality**
```javascript
// ✅ GOOD: Clear, typed, documented
/**
 * Fetches user data from API
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<User>} User object
 */
async function fetchUser(userId: string): Promise<User> {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  const response = await fetch(`${API_URL}/users/${userId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }
  
  return response.json();
}

// ❌ BAD: No types, no validation, no error handling
async function getUser(id) {
  const res = await fetch(`${API_URL}/users/${id}`);
  return res.json();
}
```

**React Best Practices**
```javascript
// ✅ Use functional components with hooks
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (!user) return null;
  
  return <div>{user.name}</div>;
}

// ✅ Extract complex logic to custom hooks
function useUser(userId) {
  const [state, setState] = useState({ 
    user: null, 
    loading: true, 
    error: null 
  });
  
  useEffect(() => {
    // ... fetch logic
  }, [userId]);
  
  return state;
}

// ✅ Memoize expensive computations
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);
```

### Python

**File Organization**
```python
"""
Module docstring describing purpose
"""

# 1. Standard library imports
import os
import sys
from typing import List, Dict, Optional

# 2. Third-party imports
import requests
from flask import Flask, request

# 3. Local imports
from .models import User
from .utils import validate_email

# 4. Constants
API_URL = "https://api.example.com"

# 5. Classes/Functions
class UserService:
    """Service for managing users"""
    
    def __init__(self):
        """Initialize the user service"""
        pass
    
    def get_user(self, user_id: str) -> Optional[User]:
        """
        Fetch a user by ID
        
        Args:
            user_id: The unique identifier for the user
            
        Returns:
            User object if found, None otherwise
            
        Raises:
            ValueError: If user_id is invalid
        """
        if not user_id:
            raise ValueError("user_id is required")
        
        # Implementation
        pass
```

**Naming Conventions**
- Variables/Functions: `snake_case`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files/Modules: `snake_case.py`
- Private: `_leading_underscore`

**Code Quality**
```python
# ✅ GOOD: Type hints, docstrings, error handling
def calculate_total(items: List[Dict[str, float]]) -> float:
    """
    Calculate total price of items including tax
    
    Args:
        items: List of item dictionaries with 'price' and 'tax_rate'
        
    Returns:
        Total price including tax
        
    Raises:
        ValueError: If items list is empty
    """
    if not items:
        raise ValueError("Items list cannot be empty")
    
    total = sum(
        item['price'] * (1 + item.get('tax_rate', 0))
        for item in items
    )
    
    return round(total, 2)

# ❌ BAD: No types, no docs, unclear logic
def calc(i):
    t = 0
    for x in i:
        t += x['price'] * (1 + x.get('tax_rate', 0))
    return t
```

---

## Anti-Hallucination Measures

### 1. Verify Before Implementing
- **Never assume** API endpoints, library methods, or package names
- **Check documentation** for actual APIs
- **Ask user** if uncertain about requirements
- **Use web_search** to verify package versions and syntax

### 2. Document Uncertainties
When unsure about something, document it:
```markdown
## Uncertainties (in current.md)
- [ ] Confirm authentication flow (OAuth vs JWT)
- [ ] Verify database schema for user relationships  
- [ ] Check if pagination needed for user list
```

### 3. Incremental Validation
- Build smallest working version first
- Get user feedback before expanding
- Test each feature before adding next

### 4. Explicit Assumptions
State assumptions clearly:
```markdown
## Assumptions (in prd.md)
1. Users will authenticate via email/password (not social login)
2. Maximum file upload size: 10MB
3. SQLite for development, PostgreSQL for production
4. Mobile responsiveness required but no native app
```

---

## Module Structure Template

Each module should have:

```markdown
## [Module Name]

### Purpose
What this module does

### Dependencies
- Other modules it depends on
- External packages required

### Files
- `path/to/file.ext` - Description

### Key Functions/Components
- `functionName()` - What it does
- `ComponentName` - What it renders

### Data Flow
How data moves through this module

### Testing Strategy
How this module will be tested

### Status
Current implementation status
```

---

## File Templates

### memory.md
```markdown
# Development Memory Log

## [YYYY-MM-DD] - Project Initialization
### Decision: [Technology Stack]
- **Context**: Starting new [app type] project
- **Chosen**: [Technologies and why]
- **Alternatives**: [Other options considered]

## [YYYY-MM-DD] - [Feature Name]
### Implementation
- [What was built]
- [Code locations]

### Challenges
- [Problems encountered]
- [How they were solved]

### Next Steps
- [What to build next]
```

### current.md
```markdown
# Current Progress

## Project: [App Name]
**Last Updated**: [Date]

## Overall Status: [Phase]
- 📋 Planning: [X%]
- 🏗️ Development: [Y%]
- 🧪 Testing: [Z%]

## Current Sprint
### In Progress
- 🚧 [Feature/Module name]
  - Status: [Brief description]
  - Blockers: [Any issues]

### Completed This Session
- ✅ [Completed item]
- ✅ [Completed item]

### Next Up
- ⏳ [Next item]
- ⏳ [Next item]

## Module Status
- ✅ Authentication - Complete
- 🚧 User Management - In Progress  
- ⏳ Dashboard - Not Started

## Known Issues
- [ ] Issue 1
- [ ] Issue 2

## Questions for User
- [ ] Question 1?
- [ ] Question 2?
```

### prd.md
```markdown
# Product Requirements Document

## Project: [App Name]
**Version**: 1.0  
**Last Updated**: [Date]

## Executive Summary
[Brief 2-3 sentence description]

## Goals & Objectives
### Primary Goals
1. [Goal 1]
2. [Goal 2]

### Success Metrics
- [Metric 1]
- [Metric 2]

## User Personas
### Primary User
- **Who**: [Description]
- **Needs**: [What they need]
- **Goals**: [What they want to achieve]

## Functional Requirements

### Core Features (MVP)
1. **[Feature 1 Name]**
   - Description: [What it does]
   - User Story: As a [user], I want to [action] so that [benefit]
   - Acceptance Criteria:
     - [ ] Criterion 1
     - [ ] Criterion 2

2. **[Feature 2 Name]**
   - [Same structure]

### Future Features (Post-MVP)
- [Feature name] - [Brief description]

## Technical Requirements

### Technology Stack
- **Frontend**: [Framework/Library]
- **Backend**: [Framework/Language]
- **Database**: [Type/System]
- **Authentication**: [Method]
- **Hosting**: [Platform]

### System Architecture
[High-level description]

### Data Model
[Key entities and relationships]

### API Requirements
[Endpoints needed]

### Third-Party Integrations
- [Service 1] - [Purpose]
- [Service 2] - [Purpose]

## Non-Functional Requirements

### Performance
- Page load: [< X seconds]
- API response: [< Y ms]

### Security
- [Security requirement 1]
- [Security requirement 2]

### Scalability
- Expected users: [Number]
- Expected growth: [Rate]

### Accessibility
- WCAG level: [A/AA/AAA]
- Screen reader support: [Yes/No]

## Design Requirements
- Design system: [Name or description]
- Color palette: [Colors]
- Typography: [Fonts]
- Responsive breakpoints: [Sizes]

## Assumptions & Constraints

### Assumptions
1. [Assumption 1]
2. [Assumption 2]

### Constraints
1. [Constraint 1]
2. [Constraint 2]

### Out of Scope
- [Feature/Aspect 1]
- [Feature/Aspect 2]

## Timeline & Milestones
- **Week 1**: [Milestone]
- **Week 2**: [Milestone]
- **Week 3**: [Milestone]

## Risks & Mitigation
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Strategy] |

## Open Questions
- [ ] [Question 1]
- [ ] [Question 2]

## Approval
- [ ] Stakeholder approval received
- [ ] Technical feasibility confirmed
- [ ] Ready for development
```

### path.md
```markdown
# Project Structure & File Paths

## Root Directory: `/home/claude/[project-name]`

## Directory Tree
```
project-name/
├── docs/                    # Documentation
│   ├── memory.md
│   ├── current.md
│   ├── prd.md
│   ├── path.md
│   └── modules.md
│
├── src/                     # Source code
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components
│   │   └── features/       # Feature-specific components
│   │
│   ├── pages/              # Page components/routes
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   │
│   ├── services/           # API calls and business logic
│   │   ├── api.ts          # API client setup
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useUser.ts
│   │
│   ├── utils/              # Utility functions
│   │   ├── validation.ts
│   │   └── formatting.ts
│   │
│   ├── types/              # TypeScript type definitions
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   │
│   ├── styles/             # Global styles
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── assets/             # Static assets
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── config/             # Configuration files
│   │   ├── constants.ts
│   │   └── env.ts
│   │
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
│
├── public/                 # Public static files
│   ├── index.html
│   └── favicon.ico
│
├── tests/                  # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Build tool config
└── README.md              # Project documentation
```

## Key File Purposes

### Core Application Files
- `src/main.tsx` - Application entry point, renders root component
- `src/App.tsx` - Root component, sets up routing and global providers
- `src/config/constants.ts` - Application-wide constants
- `src/config/env.ts` - Environment variable handling

### Service Layer
- `src/services/api.ts` - Axios/Fetch client with interceptors
- `src/services/auth.service.ts` - Authentication logic
- `src/services/user.service.ts` - User CRUD operations

### Type Definitions
- `src/types/user.types.ts` - User-related TypeScript interfaces
- `src/types/api.types.ts` - API request/response types

### Utilities
- `src/utils/validation.ts` - Input validation helpers
- `src/utils/formatting.ts` - Data formatting functions

## Import Path Aliases
```typescript
// Configure in tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@hooks/*": ["src/hooks/*"],
      "@pages/*": ["src/pages/*"]
    }
  }
}
```

## File Naming Conventions
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Services: `camelCase.service.ts` (e.g., `auth.service.ts`)
- Utilities: `camelCase.ts` (e.g., `validation.ts`)
- Types: `camelCase.types.ts` (e.g., `user.types.ts`)
- Hooks: `useCamelCase.ts` (e.g., `useAuth.ts`)
- Pages: `PascalCase.tsx` (e.g., `Dashboard.tsx`)

## Output Location
All final files to be shared with user should be copied to:
`/mnt/user-data/outputs/[project-name]/`
```

### modules.md
```markdown
# System Modules & Architecture

## Architecture Overview
[High-level description of system architecture]

## Module Breakdown

### 1. Core Modules

#### Authentication Module
**Purpose**: Handle user authentication and session management

**Files**:
- `src/services/auth.service.ts` - Auth logic
- `src/hooks/useAuth.ts` - Auth React hook
- `src/types/auth.types.ts` - Auth type definitions
- `src/components/common/AuthGuard.tsx` - Route protection

**Dependencies**:
- External: axios, jwt-decode
- Internal: None (core module)

**Key Functions**:
- `login(email, password)` - User login
- `logout()` - User logout
- `refreshToken()` - Token refresh
- `isAuthenticated()` - Check auth status

**Data Flow**:
1. User submits credentials → `login()`
2. API validates → Returns JWT token
3. Token stored in localStorage
4. Token included in all API requests
5. On expiry → `refreshToken()` called

**Status**: ⏳ Not Started

---

#### Database Module
**Purpose**: Handle all database operations

**Files**:
- `src/services/database.service.ts` - DB operations
- `src/config/database.ts` - DB configuration
- `src/types/models.types.ts` - Data models

**Dependencies**:
- External: [ORM/Database library]
- Internal: None

**Key Functions**:
- `connect()` - Initialize DB connection
- `query()` - Execute queries
- `transaction()` - Handle transactions

**Status**: ⏳ Not Started

---

### 2. Feature Modules

#### User Management Module
**Purpose**: CRUD operations for users

**Files**:
- `src/services/user.service.ts` - User operations
- `src/components/features/UserList.tsx` - User list UI
- `src/components/features/UserForm.tsx` - User form UI
- `src/types/user.types.ts` - User types

**Dependencies**:
- External: None
- Internal: Authentication Module, Database Module

**Key Functions**:
- `getUsers()` - Fetch all users
- `getUser(id)` - Fetch single user
- `createUser(data)` - Create new user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user

**Data Flow**:
1. Component calls hook → `useUsers()`
2. Hook calls service → `user.service.ts`
3. Service calls API → Backend endpoint
4. Response processed → State updated
5. UI re-renders with new data

**Status**: ⏳ Not Started

---

### 3. Utility Modules

#### Validation Module
**Purpose**: Input validation helpers

**Files**:
- `src/utils/validation.ts` - Validation functions

**Dependencies**:
- External: [Validation library if used]
- Internal: None

**Key Functions**:
- `validateEmail(email)` - Email validation
- `validatePassword(password)` - Password strength
- `validateRequired(value)` - Required field check

**Status**: ⏳ Not Started

---

## Module Dependencies Graph

```
Authentication Module (Core)
    ↓
User Management Module
    ↓
Dashboard Module

Database Module (Core)
    ↓
All Feature Modules

Validation Module (Utility)
    ↑
All Modules (used by)
```

## Implementation Order
1. Core Modules (Authentication, Database)
2. Utility Modules (Validation, Formatting)
3. Feature Modules (User Management, etc.)
4. UI Polish & Testing

## Testing Strategy
- **Unit Tests**: Each module's functions tested in isolation
- **Integration Tests**: Module interactions tested
- **E2E Tests**: Full user flows tested

## Module Status Legend
- ✅ Complete
- 🚧 In Progress
- ⏳ Not Started
- ❌ Blocked
```

---

## Documentation Maintenance

### When to Update Each File

**memory.md**: Update after:
- Major decisions made
- Architecture changes
- Problem solutions
- Feature completions

**current.md**: Update:
- At start of each coding session
- After completing each module/feature
- When blockers occur
- Before ending session

**prd.md**: Update when:
- Requirements change
- New features added to scope
- Assumptions proven wrong
- Technical constraints discovered

**path.md**: Update when:
- New directories created
- File structure changes
- Import aliases added

**modules.md**: Update when:
- New modules added
- Dependencies change
- Module status changes
- Implementation details finalized

---

## Quality Checklist

Before marking ANY module as complete:

### Code Quality
- [ ] All functions have JSDoc/docstrings
- [ ] TypeScript/type hints used throughout
- [ ] No hardcoded values (use constants)
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Edge cases considered

### Documentation
- [ ] Module documented in `modules.md`
- [ ] Progress updated in `current.md`
- [ ] Key decisions logged in `memory.md`
- [ ] File paths updated in `path.md`
- [ ] Inline comments for complex logic

### Testing
- [ ] Manual testing completed
- [ ] Unit tests written (if applicable)
- [ ] Integration points verified
- [ ] Error cases tested

### User Experience
- [ ] Loading states implemented
- [ ] Error messages clear
- [ ] Success feedback provided
- [ ] Responsive design verified

---

## Common Pitfalls to Avoid

### 1. Starting Code Too Early
❌ **Wrong**: Jump straight into coding
✅ **Right**: Ask questions → Document requirements → Design architecture → Then code

### 2. Assuming Requirements
❌ **Wrong**: "Users probably want X feature"
✅ **Right**: Ask user explicitly about X

### 3. Over-Engineering
❌ **Wrong**: Build complex, flexible system for simple need
✅ **Right**: Start simple, add complexity only when needed

### 4. Under-Documenting
❌ **Wrong**: Code without comments or docs
✅ **Right**: Document as you build

### 5. Ignoring Error Handling
❌ **Wrong**: Happy path only
✅ **Right**: Handle errors, edge cases, loading states

### 6. No Version Control Mindset
❌ **Wrong**: Make sweeping changes without tracking
✅ **Right**: Small, incremental changes with clear documentation

### 7. Skipping Testing
❌ **Wrong**: "It works on my first try"
✅ **Right**: Test thoroughly, especially error cases

### 8. Unclear Naming
❌ **Wrong**: `function x(a, b) {}`
✅ **Right**: `function calculateUserTotal(userId, items) {}`

---

## Success Criteria

A successful app development session includes:

1. ✅ All required documentation files created/updated
2. ✅ Clear requirements documented in PRD
3. ✅ Module architecture defined
4. ✅ Code follows best practices for chosen language
5. ✅ Each module tested before moving to next
6. ✅ All uncertainties documented and resolved
7. ✅ User receives working code in `/mnt/user-data/outputs/`
8. ✅ Clear next steps identified

---

## Final Notes

Remember: **Good code is readable, maintainable, and well-documented code.**

The goal isn't just to make it work—it's to make it work reliably, perform well, and be easy for others (or future you) to understand and modify.

When in doubt:
1. Ask the user
2. Search for best practices
3. Document your assumptions
4. Build incrementally
5. Test thoroughly

Happy building! 🚀
