CREATE TABLE users (
    id SERIAL PRIMARY KEY,            -- Auto-increment ID (PostgreSQL/MySQL both support SERIAL)
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    address_lookup VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    other_details VARCHAR(255),
    vendor_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE catalog_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    description TEXT,
    default_scope_of_work TEXT,
    tags VARCHAR(255),
    price VARCHAR(255),
    is_subitem VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_title VARCHAR(255) NOT NULL,
    created_date VARCHAR(255) NOT NULL,
    client_contact VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    age VARCHAR(255) NOT NULL,
    confidence_percent VARCHAR(255) NOT NULL,
    estimated_revenue_min VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_description TEXT NOT NULL,
    project VARCHAR(255) NOT NULL,
    assign_to TEXT, -- comma-separated names or IDs
    due_date  VARCHAR(255),
    priority  VARCHAR(255),
    status  VARCHAR(255),
    comment TEXT,
    tags VARCHAR(255),
    subtasks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
