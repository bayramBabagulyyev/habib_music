# Multiple Swagger UI Documentation

This application now supports **3 separate Swagger UI interfaces** for different types of applications accessing the same backend. Each Swagger UI shows only the relevant endpoints for that specific app type.

## Available Swagger UIs

### 1. Admin Panel API Documentation

- **URL**: `http://localhost:3000/api/admin-docs`
- **Purpose**: For admin panel operations
- **Includes**:
  - Admin authentication endpoints (`/auth/admin-login`)
  - Admin user management endpoints (`/users/*` - CRUD operations)
  - Token refresh endpoint

### 2. User Application API Documentation

- **URL**: `http://localhost:3000/api/user-docs`
- **Purpose**: For user-facing applications (web app, etc.)
- **Includes**:
  - User authentication endpoints (`/auth/login`, `/auth/register`)
  - User profile management endpoints (`/users/profile/me`)
  - Token refresh endpoint
  - Password reset endpoint

### 3. Public/Mobile API Documentation

- **URL**: `http://localhost:3000/api/public-docs`
- **Purpose**: For public or mobile applications
- **Includes**:
  - Public authentication endpoints (`/auth/login`, `/auth/register`)
  - Public information endpoints
  - Token refresh endpoint
  - Password reset endpoint

## How It Works

The system uses **API tags** to categorize endpoints by app type:

### Admin App Tags

- `admin-auth` - Admin authentication endpoints
- `admin-users` - Admin user management endpoints

### User App Tags

- `user-auth` - User authentication endpoints
- `user-profile` - User profile management endpoints

### Public App Tags

- `public-auth` - Public authentication endpoints
- `public-info` - Public information endpoints

## Adding New Endpoints

When adding new controllers or endpoints, make sure to add the appropriate `@ApiTags()` decorator:

### For Admin-only endpoints:

```typescript
@ApiTags('admin-auth') // or 'admin-users'
@Post('admin-only-endpoint')
adminOnlyMethod() {
  // implementation
}
```

### For User app endpoints:

```typescript
@ApiTags('user-profile') // or 'user-auth'
@Get('user-endpoint')
userMethod() {
  // implementation
}
```

### For Public endpoints:

```typescript
@ApiTags('public-info') // or 'public-auth'
@Get('public-endpoint')
publicMethod() {
  // implementation
}
```

### For endpoints shared across multiple apps:

```typescript
@ApiTags('admin-auth', 'user-auth', 'public-auth')
@Post('token/refresh')
refreshToken() {
  // This will appear in all three Swagger UIs
}
```

## Configuration

The configuration is located in:

- **App Types & Tags**: `src/common/enums/app-type.enum.ts`
- **Swagger Configuration**: `src/config/swagger.config.ts`
- **Main Setup**: `src/main.ts`

## Development

In development mode (NODE_ENV !== 'production'), all three Swagger UIs are automatically set up when starting the server:

```bash
npm run dev
```

Then visit:

- Admin docs: http://localhost:3000/api/admin-docs
- User docs: http://localhost:3000/api/user-docs
- Public docs: http://localhost:3000/api/public-docs

## Production

In production, you can disable Swagger completely or only enable specific ones by modifying the condition in `main.ts`.
