CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tenant_id UUID REFERENCES tenants(id),
  key TEXT UNIQUE NOT NULL,
  label TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES blog_categories(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  snippet TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  read_time_estimate INTEGER, -- in minutes
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  scheduled_at TIMESTAMP,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);


