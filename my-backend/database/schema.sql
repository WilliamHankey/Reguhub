-- Create custom types
CREATE TYPE project_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE worker_role AS ENUM ('admin', 'manager', 'worker');

-- Enable RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create workers table (extends auth.users)
CREATE TABLE workers (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT NOT NULL,
    role worker_role NOT NULL DEFAULT 'worker',
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status project_status DEFAULT 'pending',
    manager_id UUID REFERENCES workers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create project_flows table
CREATE TABLE project_flows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create files table to track uploaded files
CREATE TABLE files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    content_type TEXT,
    size BIGINT,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES workers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create project_workers junction table
CREATE TABLE project_workers (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    PRIMARY KEY (project_id, worker_id)
);

-- Create RLS Policies

-- Workers policies
CREATE POLICY "Workers can view their own record" ON workers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Workers can update their own record" ON workers
    FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Anyone can view projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Managers can create projects" ON projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM workers 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Project managers can update their projects" ON projects
    FOR UPDATE USING (manager_id = auth.uid());

-- Project flows policies
CREATE POLICY "Anyone can view project flows" ON project_flows
    FOR SELECT USING (true);

CREATE POLICY "Project managers can modify flows" ON project_flows
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_flows.project_id 
            AND manager_id = auth.uid()
        )
    );

-- Files policies
CREATE POLICY "Anyone can view files" ON files
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload files" ON files
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "File owners can delete their files" ON files
    FOR DELETE USING (uploaded_by = auth.uid());

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_workers_updated_at
    BEFORE UPDATE ON workers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_flows_updated_at
    BEFORE UPDATE ON project_flows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 