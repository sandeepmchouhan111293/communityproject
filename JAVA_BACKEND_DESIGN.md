# Java Backend Design Documentation
## Community Management Application

### Table of Contents
1. [Application Overview](#application-overview)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [Security & Authentication](#security--authentication)
7. [Project Structure](#project-structure)
8. [Implementation Guide](#implementation-guide)
9. [Deployment Strategy](#deployment-strategy)

---

## Application Overview

### Current React Frontend Features
The React application is a comprehensive community management system with the following modules:

#### Core Features:
- **Authentication System** - Login/Signup with role-based access (Admin/Member)
- **Dashboard** - Centralized navigation and user interface
- **Profile Management** - User profiles and personal information
- **Family Tree Management** - Family member relationships and genealogy
- **Community Families** - Community-wide family directory with location filtering
- **Document Management** - Document upload, categorization, and access control
- **Event Management** - Community events and activities
- **Discussion Forums** - Community discussions and communications
- **Volunteer Management** - Volunteer opportunities and registration
- **Directory** - Community member directory
- **Admin Panel** - Administrative functions and user management

#### Key Characteristics:
- **Multi-language Support** (i18n)
- **Role-based Access Control** (Admin vs Member permissions)
- **Location-based Filtering** (Indian states, districts, cities, villages)
- **Responsive Design** (Mobile and desktop compatibility)
- **File Upload/Download** capabilities
- **Real-time Data** requirements

---

## Architecture Overview

### Recommended Java Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                           │
│     (Port: 3000 - Community Management Interface)          │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS API Calls
                      │ JWT Token Authentication
┌─────────────────────▼───────────────────────────────────────┐
│                API Gateway / Load Balancer                  │
│           (NGINX or Spring Cloud Gateway)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Java Spring Boot Backend                       │
│                 (Port: 8080)                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Web       │ │   Security  │ │   Service   │           │
│  │   Layer     │ │   Layer     │ │   Layer     │           │
│  │ (REST APIs) │ │   (JWT)     │ │ (Business)  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Repository  │ │   Caching   │ │ File Storage│           │
│  │   Layer     │ │   Layer     │ │   Service   │           │
│  │   (JPA)     │ │  (Redis)    │ │ (AWS S3)    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                Database Layer                               │
│  ┌─────────────────┐ ┌─────────────────┐                  │
│  │   PostgreSQL    │ │     Redis       │                  │
│  │   (Primary DB)  │ │   (Cache/Session)│                 │
│  │   Port: 5432    │ │   Port: 6379    │                  │
│  └─────────────────┘ └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles:
1. **Microservice-Ready Architecture** - Modular design for future scaling
2. **RESTful API Design** - Standard HTTP methods and status codes
3. **Security-First Approach** - JWT authentication, role-based access
4. **Scalable Data Layer** - Optimized queries and caching
5. **Clean Architecture** - Separation of concerns and dependency injection

---

## Technology Stack

### Core Technologies
```xml
<!-- Spring Boot Dependencies -->
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>

    <!-- Redis -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>

    <!-- File Upload -->
    <dependency>
        <groupId>software.amazon.awssdk</groupId>
        <artifactId>s3</artifactId>
    </dependency>

    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Recommended Versions:
- **Java**: 17+ (LTS)
- **Spring Boot**: 3.2.x
- **PostgreSQL**: 15+
- **Redis**: 7.x
- **Maven**: 3.9.x

---

## Database Design

### Entity Relationship Diagram

```sql
-- Core Entities and Relationships

-- Users and Authentication
users (profiles)                family_members
├─ id (UUID) PK                ├─ id (UUID) PK
├─ email (UNIQUE)              ├─ user_id (UUID) FK → users.id
├─ password_hash               ├─ name (VARCHAR)
├─ role (ENUM)                 ├─ relationship (VARCHAR)
├─ full_name                   ├─ age (INTEGER)
├─ city                        ├─ gender (ENUM)
├─ community_name              ├─ profession (VARCHAR)
├─ created_at                  ├─ date_of_birth (DATE)
├─ updated_at                  ├─ school (VARCHAR)
└─ is_active                   ├─ hobbies (TEXT)
                               └─ achievements (TEXT)

-- Content Management
documents                       events
├─ id (UUID) PK                ├─ id (UUID) PK
├─ title (VARCHAR)             ├─ title (VARCHAR)
├─ description (TEXT)          ├─ description (TEXT)
├─ category (ENUM)             ├─ event_date (TIMESTAMP)
├─ access_level (ENUM)         ├─ location (VARCHAR)
├─ file_type (VARCHAR)         ├─ created_by (UUID) FK → users.id
├─ file_size (VARCHAR)         ├─ max_participants (INTEGER)
├─ file_url (VARCHAR)          ├─ status (ENUM)
├─ uploaded_by (UUID) FK       └─ created_at
├─ created_at
└─ updated_at                  discussions
                               ├─ id (UUID) PK
volunteer_opportunities        ├─ title (VARCHAR)
├─ id (UUID) PK                ├─ content (TEXT)
├─ title (VARCHAR)             ├─ category (VARCHAR)
├─ description (TEXT)          ├─ created_by (UUID) FK → users.id
├─ requirements (TEXT)         ├─ created_at
├─ location (VARCHAR)          └─ updated_at
├─ date_time (TIMESTAMP)
├─ max_volunteers (INTEGER)    discussion_replies
├─ created_by (UUID) FK        ├─ id (UUID) PK
└─ status (ENUM)               ├─ discussion_id (UUID) FK
                               ├─ content (TEXT)
volunteer_registrations        ├─ created_by (UUID) FK → users.id
├─ id (UUID) PK                └─ created_at
├─ opportunity_id (UUID) FK
├─ user_id (UUID) FK           directory
├─ registered_at               ├─ id (UUID) PK
└─ status (ENUM)               ├─ user_id (UUID) FK → users.id
                               ├─ display_name (VARCHAR)
                               ├─ contact_info (JSONB)
                               ├─ bio (TEXT)
                               ├─ skills (TEXT[])
                               └─ is_public (BOOLEAN)
```

### Database Schema SQL

```sql
-- Database Creation
CREATE DATABASE community_management;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('ADMIN', 'MEMBER');
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE document_category AS ENUM ('GOVERNANCE', 'RESOURCES', 'MEETINGS', 'GUIDELINES', 'FORMS');
CREATE TYPE access_level AS ENUM ('PUBLIC', 'MEMBER', 'COMMITTEE', 'ADMIN');
CREATE TYPE event_status AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');
CREATE TYPE volunteer_status AS ENUM ('ACTIVE', 'FILLED', 'CANCELLED');
CREATE TYPE registration_status AS ENUM ('REGISTERED', 'CONFIRMED', 'CANCELLED');

-- Users table (equivalent to profiles in current system)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'MEMBER',
    full_name VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    district VARCHAR(255),
    community_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family members table
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    age INTEGER,
    gender gender_type,
    profession VARCHAR(255),
    date_of_birth DATE,
    school VARCHAR(255),
    hobbies TEXT,
    achievements TEXT,
    marital_status VARCHAR(50),
    spouse_family VARCHAR(255),
    spouse_city VARCHAR(255),
    marriage_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category document_category NOT NULL,
    access_level access_level NOT NULL DEFAULT 'PUBLIC',
    file_type VARCHAR(50),
    file_size VARCHAR(20),
    file_url VARCHAR(500),
    uploaded_by UUID NOT NULL REFERENCES users(id),
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    location VARCHAR(255),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    status event_status DEFAULT 'UPCOMING',
    created_by UUID NOT NULL REFERENCES users(id),
    image_url VARCHAR(500),
    registration_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status registration_status DEFAULT 'REGISTERED',
    UNIQUE(event_id, user_id)
);

-- Volunteer opportunities table
CREATE TABLE volunteer_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    location VARCHAR(255),
    date_time TIMESTAMP,
    duration_hours INTEGER,
    max_volunteers INTEGER,
    current_volunteers INTEGER DEFAULT 0,
    status volunteer_status DEFAULT 'ACTIVE',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Volunteer registrations
CREATE TABLE volunteer_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID NOT NULL REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status registration_status DEFAULT 'REGISTERED',
    notes TEXT,
    UNIQUE(opportunity_id, user_id)
);

-- Discussions table
CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    created_by UUID NOT NULL REFERENCES users(id),
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discussion replies
CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    parent_reply_id UUID REFERENCES discussion_replies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Directory table
CREATE TABLE directory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    contact_info JSONB, -- {phone, email, address}
    bio TEXT,
    skills TEXT[],
    interests TEXT[],
    social_links JSONB, -- {linkedin, twitter, etc}
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    setting_key VARCHAR(255) NOT NULL,
    setting_value JSONB,
    is_global BOOLEAN DEFAULT false, -- true for system-wide settings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, setting_key)
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_family_members_user_id ON family_members(user_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_access_level ON documents(access_level);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_discussions_category ON discussions(category);
CREATE INDEX idx_discussions_created_at ON discussions(created_at);
CREATE INDEX idx_directory_public ON directory(is_public);
CREATE INDEX idx_settings_user_key ON settings(user_id, setting_key);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add similar triggers for other tables...
```

---

## API Design

### REST API Endpoints

#### Authentication APIs
```java
POST   /api/auth/login           // User login
POST   /api/auth/register        // User registration
POST   /api/auth/logout          // User logout
POST   /api/auth/refresh         // Refresh JWT token
POST   /api/auth/forgot-password // Password reset request
POST   /api/auth/reset-password  // Password reset confirmation
GET    /api/auth/me              // Get current user info
```

#### User Management APIs
```java
GET    /api/users                // Get all users (admin only)
GET    /api/users/{id}           // Get user by ID
PUT    /api/users/{id}           // Update user
DELETE /api/users/{id}           // Delete user (admin only)
GET    /api/users/profile        // Get current user profile
PUT    /api/users/profile        // Update current user profile
POST   /api/users/avatar         // Upload avatar
```

#### Family Management APIs
```java
GET    /api/family/members              // Get family members for current user
POST   /api/family/members              // Add family member
GET    /api/family/members/{id}         // Get specific family member
PUT    /api/family/members/{id}         // Update family member
DELETE /api/family/members/{id}         // Delete family member
GET    /api/family/tree                 // Get family tree structure
GET    /api/community/families          // Get community families
GET    /api/community/families/search   // Search families with filters
```

#### Document Management APIs
```java
GET    /api/documents                   // Get documents (filtered by access level)
POST   /api/documents                   // Upload document
GET    /api/documents/{id}              // Get document details
PUT    /api/documents/{id}              // Update document
DELETE /api/documents/{id}              // Delete document
GET    /api/documents/{id}/download     // Download document
GET    /api/documents/categories        // Get document categories
```

#### Event Management APIs
```java
GET    /api/events                      // Get all events
POST   /api/events                      // Create event
GET    /api/events/{id}                 // Get event details
PUT    /api/events/{id}                 // Update event
DELETE /api/events/{id}                 // Delete event
POST   /api/events/{id}/register        // Register for event
DELETE /api/events/{id}/register        // Unregister from event
GET    /api/events/{id}/participants    // Get event participants
```

#### Volunteer Management APIs
```java
GET    /api/volunteers/opportunities     // Get volunteer opportunities
POST   /api/volunteers/opportunities     // Create opportunity
GET    /api/volunteers/opportunities/{id} // Get opportunity details
PUT    /api/volunteers/opportunities/{id} // Update opportunity
DELETE /api/volunteers/opportunities/{id} // Delete opportunity
POST   /api/volunteers/register          // Register for opportunity
GET    /api/volunteers/my-registrations  // Get user's volunteer registrations
```

#### Discussion APIs
```java
GET    /api/discussions                 // Get all discussions
POST   /api/discussions                 // Create discussion
GET    /api/discussions/{id}            // Get discussion details
PUT    /api/discussions/{id}            // Update discussion
DELETE /api/discussions/{id}            // Delete discussion
POST   /api/discussions/{id}/replies    // Add reply
GET    /api/discussions/{id}/replies    // Get discussion replies
PUT    /api/discussions/replies/{id}    // Update reply
DELETE /api/discussions/replies/{id}    // Delete reply
```

#### Directory APIs
```java
GET    /api/directory                   // Get community directory
GET    /api/directory/{id}              // Get directory entry
PUT    /api/directory                   // Update own directory entry
GET    /api/directory/search            // Search directory
```

#### Settings APIs
```java
GET    /api/settings                    // Get user settings
PUT    /api/settings                    // Update user settings
GET    /api/settings/global             // Get global settings (admin)
PUT    /api/settings/global             // Update global settings (admin)
```

#### Admin APIs
```java
GET    /api/admin/dashboard             // Admin dashboard stats
GET    /api/admin/users                 // User management
PUT    /api/admin/users/{id}/role       // Change user role
GET    /api/admin/audit-logs            // Get audit logs
GET    /api/admin/system-stats          // System statistics
POST   /api/admin/backup                // Create system backup
```

### API Response Format

```java
// Success Response
{
    "success": true,
    "data": {
        // Response data
    },
    "message": "Operation completed successfully",
    "timestamp": "2024-01-15T10:30:00Z"
}

// Error Response
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [
            {
                "field": "email",
                "message": "Email is required"
            }
        ]
    },
    "timestamp": "2024-01-15T10:30:00Z"
}

// Paginated Response
{
    "success": true,
    "data": [
        // Array of items
    ],
    "pagination": {
        "page": 1,
        "size": 20,
        "total": 150,
        "totalPages": 8
    },
    "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Security & Authentication

### JWT Authentication Implementation

```java
// JWT Configuration
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/documents").hasAnyRole("MEMBER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/documents").hasRole("ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint())
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}

// JWT Token Provider
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpirationInMs;

    public String generateToken(UserPrincipal userPrincipal) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(userPrincipal.getId().toString())
                .claim("email", userPrincipal.getEmail())
                .claim("role", userPrincipal.getRole())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException | MalformedJwtException | ExpiredJwtException |
                 UnsupportedJwtException | IllegalArgumentException ex) {
            return false;
        }
    }
}
```

### Role-Based Access Control

```java
// User Roles Enum
public enum UserRole {
    ADMIN("ROLE_ADMIN"),
    MEMBER("ROLE_MEMBER");

    private String authority;

    UserRole(String authority) {
        this.authority = authority;
    }

    public String getAuthority() {
        return authority;
    }
}

// Method-level Security
@Service
public class DocumentService {

    @PreAuthorize("hasRole('ADMIN') or @documentService.isOwner(#documentId, authentication.name)")
    public DocumentDto updateDocument(UUID documentId, UpdateDocumentRequest request) {
        // Implementation
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canAccess(#documentId, authentication.name)")
    public DocumentDto getDocument(UUID documentId) {
        // Implementation with access level check
    }
}
```

### Password Security

```java
@Configuration
public class PasswordConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public PasswordValidator passwordValidator() {
        return PasswordValidatorBuilder.create()
                .minLength(8)
                .maxLength(64)
                .requireUppercase()
                .requireLowercase()
                .requireDigits()
                .requireSpecialCharacters()
                .build();
    }
}
```

---

## Project Structure

```
community-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/community/management/
│   │   │       ├── CommunityManagementApplication.java
│   │   │       │
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── JwtConfig.java
│   │   │       │   ├── DatabaseConfig.java
│   │   │       │   ├── RedisConfig.java
│   │   │       │   ├── S3Config.java
│   │   │       │   └── CorsConfig.java
│   │   │       │
│   │   │       ├── controller/
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── UserController.java
│   │   │       │   ├── FamilyController.java
│   │   │       │   ├── DocumentController.java
│   │   │       │   ├── EventController.java
│   │   │       │   ├── VolunteerController.java
│   │   │       │   ├── DiscussionController.java
│   │   │       │   ├── DirectoryController.java
│   │   │       │   ├── SettingsController.java
│   │   │       │   └── AdminController.java
│   │   │       │
│   │   │       ├── service/
│   │   │       │   ├── AuthService.java
│   │   │       │   ├── UserService.java
│   │   │       │   ├── FamilyService.java
│   │   │       │   ├── DocumentService.java
│   │   │       │   ├── EventService.java
│   │   │       │   ├── VolunteerService.java
│   │   │       │   ├── DiscussionService.java
│   │   │       │   ├── DirectoryService.java
│   │   │       │   ├── SettingsService.java
│   │   │       │   ├── FileStorageService.java
│   │   │       │   ├── EmailService.java
│   │   │       │   ├── AuditService.java
│   │   │       │   └── CacheService.java
│   │   │       │
│   │   │       ├── repository/
│   │   │       │   ├── UserRepository.java
│   │   │       │   ├── FamilyMemberRepository.java
│   │   │       │   ├── DocumentRepository.java
│   │   │       │   ├── EventRepository.java
│   │   │       │   ├── VolunteerRepository.java
│   │   │       │   ├── DiscussionRepository.java
│   │   │       │   ├── DirectoryRepository.java
│   │   │       │   ├── SettingsRepository.java
│   │   │       │   └── AuditLogRepository.java
│   │   │       │
│   │   │       ├── entity/
│   │   │       │   ├── User.java
│   │   │       │   ├── FamilyMember.java
│   │   │       │   ├── Document.java
│   │   │       │   ├── Event.java
│   │   │       │   ├── VolunteerOpportunity.java
│   │   │       │   ├── Discussion.java
│   │   │       │   ├── DirectoryEntry.java
│   │   │       │   ├── Settings.java
│   │   │       │   └── AuditLog.java
│   │   │       │
│   │   │       ├── dto/
│   │   │       │   ├── request/
│   │   │       │   │   ├── LoginRequest.java
│   │   │       │   │   ├── RegisterRequest.java
│   │   │       │   │   ├── CreateDocumentRequest.java
│   │   │       │   │   ├── CreateEventRequest.java
│   │   │       │   │   └── ...
│   │   │       │   │
│   │   │       │   └── response/
│   │   │       │       ├── AuthResponse.java
│   │   │       │       ├── UserResponse.java
│   │   │       │       ├── DocumentResponse.java
│   │   │       │       ├── EventResponse.java
│   │   │       │       └── ...
│   │   │       │
│   │   │       ├── security/
│   │   │       │   ├── JwtTokenProvider.java
│   │   │       │   ├── JwtAuthenticationFilter.java
│   │   │       │   ├── JwtAuthenticationEntryPoint.java
│   │   │       │   ├── UserPrincipal.java
│   │   │       │   └── CustomUserDetailsService.java
│   │   │       │
│   │   │       ├── exception/
│   │   │       │   ├── GlobalExceptionHandler.java
│   │   │       │   ├── ResourceNotFoundException.java
│   │   │       │   ├── ValidationException.java
│   │   │       │   └── UnauthorizedException.java
│   │   │       │
│   │   │       ├── util/
│   │   │       │   ├── FileUtil.java
│   │   │       │   ├── ValidationUtil.java
│   │   │       │   ├── DateUtil.java
│   │   │       │   └── SecurityUtil.java
│   │   │       │
│   │   │       └── constant/
│   │   │           ├── ApiConstants.java
│   │   │           ├── SecurityConstants.java
│   │   │           └── ErrorConstants.java
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       ├── db/migration/
│   │       │   ├── V1__create_initial_schema.sql
│   │       │   ├── V2__add_indexes.sql
│   │       │   └── V3__add_audit_triggers.sql
│   │       │
│   │       └── static/
│   │           └── api-docs/
│   │
│   └── test/
│       └── java/
│           └── com/community/management/
│               ├── controller/
│               ├── service/
│               ├── repository/
│               └── integration/
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
│
├── scripts/
│   ├── deploy.sh
│   ├── backup.sh
│   └── setup-db.sh
│
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
│
├── pom.xml
└── README.md
```

---

## Implementation Guide

### Phase 1: Core Setup (Week 1-2)
1. **Project Initialization**
   - Create Spring Boot project with required dependencies
   - Set up database (PostgreSQL)
   - Configure Redis for caching
   - Set up basic security configuration

2. **User Authentication**
   - Implement JWT authentication
   - Create User entity and repository
   - Build login/register endpoints
   - Add role-based access control

### Phase 2: Core Features (Week 3-4)
1. **Profile Management**
   - User profile CRUD operations
   - Avatar upload functionality
   - Settings management

2. **Family Management**
   - Family member CRUD operations
   - Family tree structure
   - Community families view

### Phase 3: Content Management (Week 5-6)
1. **Document Management**
   - File upload/download
   - Access level controls
   - Document categorization

2. **Event Management**
   - Event CRUD operations
   - Event registration system
   - Calendar integration

### Phase 4: Community Features (Week 7-8)
1. **Discussion Forums**
   - Discussion and reply system
   - Moderation features
   - Search functionality

2. **Volunteer Management**
   - Opportunity creation
   - Registration system
   - Volunteer tracking

### Phase 5: Admin & Advanced Features (Week 9-10)
1. **Admin Panel**
   - User management
   - System monitoring
   - Audit logging

2. **Advanced Features**
   - Search and filtering
   - Notifications
   - Reporting and analytics

### Sample Entity Implementation

```java
// User Entity
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Column(unique = true, nullable = false)
    @Email
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.MEMBER;

    private String fullName;
    private String city;
    private String state;
    private String district;
    private String communityName;
    private String phone;
    private String avatarUrl;

    @Column(nullable = false)
    private Boolean isActive = true;

    private LocalDateTime lastLogin;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FamilyMember> familyMembers = new ArrayList<>();

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Event> createdEvents = new ArrayList<>();

    // Constructors, getters, setters
}

// Service Implementation
@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditService auditService;

    public UserDto createUser(RegisterRequest request) {
        // Validate request
        validateUserRegistration(request);

        // Create user entity
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(UserRole.MEMBER);

        // Save user
        User savedUser = userRepository.save(user);

        // Log audit
        auditService.logUserCreation(savedUser);

        return convertToDto(savedUser);
    }

    public UserDto updateUser(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update fields
        user.setFullName(request.getFullName());
        user.setCity(request.getCity());
        // ... other fields

        User updatedUser = userRepository.save(user);

        // Log audit
        auditService.logUserUpdate(updatedUser);

        return convertToDto(updatedUser);
    }

    private void validateUserRegistration(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already exists");
        }
        // Additional validations
    }

    private UserDto convertToDto(User user) {
        // Convert entity to DTO
        return UserDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
```

---

## Deployment Strategy

### Development Environment

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: community_management
      POSTGRES_USER: community_user
      POSTGRES_PASSWORD: community_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      DATABASE_URL: jdbc:postgresql://postgres:5432/community_management
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

### Production Deployment

```yaml
# application-prod.yml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5

  redis:
    host: ${REDIS_HOST}
    port: ${REDIS_PORT}
    password: ${REDIS_PASSWORD}

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

logging:
  level:
    com.community.management: INFO
    org.springframework.security: WARN

app:
  jwt:
    secret: ${JWT_SECRET}
    expiration: 86400000 # 24 hours

  cors:
    allowed-origins: ${ALLOWED_ORIGINS}

  file-storage:
    provider: s3
    s3:
      bucket: ${S3_BUCKET_NAME}
      region: ${AWS_REGION}
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Run tests
        run: mvn test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t community-backend .
      - name: Deploy to AWS ECS
        # AWS ECS deployment steps
```

---

This documentation provides a comprehensive guide for implementing a Java backend that seamlessly integrates with your React community management application. The design follows best practices for scalability, security, and maintainability while providing all the necessary features identified in your frontend application.