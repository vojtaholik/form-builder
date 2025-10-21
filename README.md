# Form Builder

A full-featured form builder with dynamic form creation, submissions, and a public API for developers.

## Features

- **Form Builder UI**: Create forms with text inputs, radio buttons, and multi-select fields
- **Dynamic Form Rendering**: Forms render dynamically based on stored schemas
- **Validation**: Client and server-side validation with Zod
- **Submissions Management**: View all form submissions with pagination
- **Public API**: RESTful API for external integrations with API key authentication
- **API Documentation**: Interactive docs with copy-paste examples

## Tech Stack

- **Next.js 16** (Beta) with React Server Components
- **TypeScript** for type safety
- **Upstash Redis** for data persistence
- **Zod** for schema validation
- **Tailwind CSS** for styling
- **Radix UI** for accessible components

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)
- Upstash Redis account

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required environment variables:

- `UPSTASH_REDIS_REST_URL`: Your Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN`: Your Upstash Redis REST token
- `SUBMIT_API_KEY`: Secret key for external API submissions
- `VERCEL_PROJECT_PRODUCTION_URL`: (Optional) Base URL for API docs

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   └── forms/
│   │       ├── route.ts        # GET /api/forms
│   │       ├── create/         # POST form creation
│   │       └── [id]/
│   │           ├── route.ts    # GET /api/forms/:id
│   │           ├── update/     # PUT form updates
│   │           ├── submit/     # POST user submissions
│   │           └── submissions/ # GET/POST submissions (API)
│   ├── forms/
│   │   ├── new/                # Form builder (create)
│   │   └── [id]/
│   │       ├── page.tsx        # Form render page
│   │       ├── edit/           # Form builder (edit)
│   │       └── submissions/    # Submissions list
│   ├── docs/                   # API documentation
│   └── page.tsx                # Landing page
├── components/
│   ├── form-builder.tsx        # Form builder component
│   ├── form-renderer.tsx       # Form renderer component
│   ├── field-editor.tsx        # Field editor component
│   └── ui/                     # UI components
└── lib/
    ├── redis.ts                # Redis helpers
    ├── types.ts                # Type definitions
    └── utils.ts                # Utilities
```

## API Endpoints

### Public Endpoints

- `GET /api/forms` - List all form IDs
- `GET /api/forms/:id` - Get form schema
- `GET /api/forms/:id/submissions` - List submissions (paginated)

### Authenticated Endpoints

- `POST /api/forms/:id/submissions` - Submit form data (requires `x-api-key` header)

### Internal Endpoints

- `POST /api/forms/create` - Create new form
- `PUT /api/forms/:id/update` - Update form
- `POST /api/forms/:id/submit` - User form submission (no auth)

## Usage

### Creating a Form

1. Go to the homepage
2. Click "Create New Form"
3. Add title, description, and fields
4. Configure field options (label, required, placeholder, etc.)
5. Reorder fields using up/down buttons
6. Click "Save Form"

### Viewing Submissions

1. From the homepage, click "Submissions" on any form
2. View all submissions in a table
3. Use pagination for large datasets

### Using the API

Visit `/docs` for full API documentation with copy-paste examples.

Example API call:

```bash
curl -X POST "http://localhost:3000/api/forms/FORM_ID/submissions" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"field_id": "value"}'
```

## Development

```bash
# Run dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format
```

## License

MIT
