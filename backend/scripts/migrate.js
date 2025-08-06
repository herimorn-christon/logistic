const db = require('../config/database');
const logger = require('../utils/logger');

const createTables = async () => {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'driver',
        permissions TEXT[],
        avatar_url TEXT,
        phone VARCHAR(20),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Vehicles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        capacity DECIMAL(10,2),
        fuel_type VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        driver_id UUID REFERENCES users(id),
        current_lat DECIMAL(10,8),
        current_lng DECIMAL(11,8),
        current_address TEXT,
        fuel_level INTEGER DEFAULT 100,
        mileage INTEGER DEFAULT 0,
        last_maintenance DATE,
        next_maintenance_date DATE,
        insurance_number VARCHAR(100),
        registration_document VARCHAR(100),
        permit_number VARCHAR(100),
        location_updated_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Drivers table
    await db.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        license_number VARCHAR(50) UNIQUE NOT NULL,
        license_expiry DATE,
        phone VARCHAR(20),
        emergency_contact VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        current_vehicle_id UUID REFERENCES vehicles(id),
        current_lat DECIMAL(10,8),
        current_lng DECIMAL(11,8),
        rating DECIMAL(3,2) DEFAULT 5.0,
        completed_deliveries INTEGER DEFAULT 0,
        on_time_deliveries INTEGER DEFAULT 0,
        safety_score INTEGER DEFAULT 100,
        fuel_efficiency_score INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Routes table
    await db.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        distance DECIMAL(10,2),
        estimated_time INTEGER,
        actual_time INTEGER,
        status VARCHAR(50) DEFAULT 'planned',
        vehicle_id UUID REFERENCES vehicles(id),
        driver_id UUID REFERENCES drivers(id),
        waypoints JSONB,
        fuel_efficiency DECIMAL(5,2),
        traffic_prediction INTEGER,
        eta_accuracy DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Deliveries table
    await db.query(`
      CREATE TABLE IF NOT EXISTS deliveries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tracking_number VARCHAR(100) UNIQUE NOT NULL,
        customer_id UUID,
        route_id UUID REFERENCES routes(id),
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        pickup_location TEXT NOT NULL,
        delivery_location TEXT NOT NULL,
        scheduled_pickup TIMESTAMP,
        scheduled_delivery TIMESTAMP,
        actual_pickup TIMESTAMP,
        actual_delivery TIMESTAMP,
        cargo_weight DECIMAL(10,2),
        cargo_dimensions JSONB,
        cargo_type VARCHAR(100),
        cargo_value DECIMAL(12,2),
        special_requirements TEXT[],
        estimated_delivery_time TIMESTAMP,
        delay_risk INTEGER DEFAULT 0,
        traffic_impact INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Maintenance records table
    await db.query(`
      CREATE TABLE IF NOT EXISTS maintenance_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_id UUID REFERENCES vehicles(id),
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        scheduled_date DATE,
        completed_date DATE,
        description TEXT,
        cost DECIMAL(10,2),
        parts_used TEXT[],
        failure_risk INTEGER DEFAULT 0,
        next_maintenance_date DATE,
        cost_estimate DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fuel records table
    await db.query(`
      CREATE TABLE IF NOT EXISTS fuel_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_id UUID REFERENCES vehicles(id),
        driver_id UUID REFERENCES drivers(id),
        amount DECIMAL(8,2) NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        location TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        mileage INTEGER,
        fuel_type VARCHAR(50),
        efficiency_score INTEGER DEFAULT 100,
        fraud_risk INTEGER DEFAULT 0,
        pattern_anomaly BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Customers table
    await db.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        company VARCHAR(255),
        address TEXT,
        type VARCHAR(50) DEFAULT 'individual',
        status VARCHAR(50) DEFAULT 'active',
        satisfaction_score DECIMAL(3,2) DEFAULT 5.0,
        delivery_preferences TEXT[],
        risk_profile VARCHAR(50) DEFAULT 'low',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // AI Predictions tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS vehicle_ai_predictions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_id UUID REFERENCES vehicles(id),
        breakdown_risk INTEGER DEFAULT 0,
        fuel_efficiency INTEGER DEFAULT 100,
        maintenance_needed BOOLEAN DEFAULT false,
        prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        model_version VARCHAR(50),
        confidence_score DECIMAL(5,2)
      )
    `);

    // Chat messages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        message TEXT NOT NULL,
        sender VARCHAR(50) NOT NULL,
        type VARCHAR(50) DEFAULT 'text',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ai_response TEXT,
        intent VARCHAR(100),
        confidence DECIMAL(5,2)
      )
    `);

    // Geofences table
    await db.query(`
      CREATE TABLE IF NOT EXISTS geofences (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        coordinates JSONB NOT NULL,
        radius DECIMAL(10,2),
        is_active BOOLEAN DEFAULT true,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contracts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS contracts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID REFERENCES customers(id),
        contract_number VARCHAR(100) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        start_date DATE,
        end_date DATE,
        value DECIMAL(12,2),
        terms TEXT,
        ai_bid_recommendation DECIMAL(12,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Documents table
    await db.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100),
        entity_type VARCHAR(50),
        entity_id UUID,
        ocr_text TEXT,
        ai_extracted_data JSONB,
        uploaded_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Invoices table
    await db.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        invoice_number VARCHAR(100) UNIQUE NOT NULL,
        customer_id UUID REFERENCES customers(id),
        delivery_id UUID REFERENCES deliveries(id),
        amount DECIMAL(12,2) NOT NULL,
        tax_amount DECIMAL(12,2) DEFAULT 0,
        total_amount DECIMAL(12,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        due_date DATE,
        paid_date DATE,
        fraud_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Compliance records table
    await db.query(`
      CREATE TABLE IF NOT EXISTS compliance_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_id UUID REFERENCES vehicles(id),
        driver_id UUID REFERENCES drivers(id),
        type VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'compliant',
        violation_details TEXT,
        fine_amount DECIMAL(10,2),
        due_date DATE,
        resolved_date DATE,
        ai_risk_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cold chain monitoring table
    await db.query(`
      CREATE TABLE IF NOT EXISTS cold_chain_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        delivery_id UUID REFERENCES deliveries(id),
        vehicle_id UUID REFERENCES vehicles(id),
        temperature DECIMAL(5,2),
        humidity DECIMAL(5,2),
        min_temp DECIMAL(5,2),
        max_temp DECIMAL(5,2),
        alert_triggered BOOLEAN DEFAULT false,
        ai_prediction DECIMAL(5,2),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    logger.info('Database tables created successfully');
  } catch (error) {
    logger.error('Error creating tables:', error);
    throw error;
  }
};

// Run migrations
createTables()
  .then(() => {
    logger.info('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Migration failed:', error);
    process.exit(1);
  });