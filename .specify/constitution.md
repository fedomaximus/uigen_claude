# UIGen Constitution

## Core Principles

### I. Type Safety First (NON-NEGOTIABLE)
TypeScript strict mode must be enabled at all times. No use of `any` type without explicit justification and approval. All component props must be fully typed with interfaces or types. API responses must have corresponding TypeScript interfaces. Use Zod or similar for runtime validation where needed.

### II. Component Architecture
Components follow atomic design principles: atoms → molecules → organisms → templates → pages. Each component must be self-contained, reusable, and independently testable. Components live in `src/components/` with co-located tests, styles, and stories. Props must be minimal - favor composition over configuration. Server components by default, client components only when necessary.

### III. Code Quality Standards
Every feature requires comprehensive tests: unit tests for utilities, integration tests for components, E2E tests for critical user flows. Code coverage minimum: 80% for utilities, 70% for components. ESLint rules are enforced - no disabling without documented justification. Prettier formatting is automatic and non-negotiable.

### IV. Performance Requirements
Core Web Vitals must meet "Good" thresholds: LCP < 2.5s, FID < 100ms, CLS < 0.1. Images use Next.js Image component with proper sizing and formats. Code splitting and lazy loading for non-critical features. Bundle size monitored - no commit that increases bundle by >10% without approval.

### V. State Management
Prefer React Server Components for data fetching when possible. Client state: useState/useReducer for local, Context for shared within tree. Server state: React Query/SWR for caching and synchronization. Global state only when truly global - avoid premature extraction. URL state for shareable/bookmarkable data.

### VI. Data Layer
Prisma ORM for database interactions with type-safe queries. Database schema changes through migrations only - no manual SQL edits. All database queries must be optimized - no N+1 queries. API routes follow RESTful conventions or tRPC for type-safe APIs. Input validation on all API routes using Zod schemas.

### VII. Testing Philosophy
Test-Driven Development encouraged but not mandatory. Tests must be meaningful - no tests just for coverage. Vitest for unit/integration tests with React Testing Library. Playwright for E2E tests focusing on critical user journeys. Mock external services in tests - use MSW for API mocking.

## Development Standards

### Code Organization
- Feature-based folder structure in `src/app/` (App Router)
- Shared utilities in `src/lib/`
- UI components in `src/components/`
- Type definitions in `src/types/`
- Database schemas in `prisma/schema.prisma`

### Naming Conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Files: kebab-case (e.g., `user-profile.tsx`)
- Functions: camelCase (e.g., `getUserProfile`)
- Types/Interfaces: PascalCase (e.g., `UserProfile`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)

### Git Workflow
- Feature branches: `feature/description` or numbered `###-feature-name`
- Commit messages: Conventional Commits format
- PR required for all changes - no direct commits to main
- Squash merges to keep history clean
- Branch cleanup after merge

### Documentation Requirements
- JSDoc comments for all public functions and complex logic
- README.md updates for architectural changes
- Component documentation in Storybook (if applicable)
- API documentation for all endpoints
- Migration guides for breaking changes

## Security & Privacy

### Authentication & Authorization
- Secure session management (NextAuth.js or similar)
- Environment variables for all secrets - never commit
- CSRF protection on all mutations
- Role-based access control where needed
- Audit logging for sensitive operations

### Data Protection
- Input sanitization on all user inputs
- SQL injection prevention through Prisma (parameterized queries)
- XSS prevention through React's default escaping
- Sensitive data encrypted at rest
- HTTPS only in production

## Performance Monitoring

### Observability
- Structured logging for errors and important events
- Error tracking (Sentry or similar) in production
- Performance monitoring for Core Web Vitals
- Database query performance monitoring
- API response time tracking

### Deployment
- Vercel for hosting (leverages Next.js optimizations)
- Preview deployments for all PRs
- Production deployments only from main branch
- Database migrations run before deployment
- Rollback plan for all deployments

## Governance

This constitution supersedes all other development practices. Any deviation requires documented justification and team approval. Amendments to this constitution require consensus and a migration plan for existing code. All code reviews must verify compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-06-30 | **Last Amended**: 2026-06-30
