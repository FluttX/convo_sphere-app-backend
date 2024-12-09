-- Create users table
CREATE TABLE users (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	username VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create conversations table
CREATE TABLE conversations (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	participant_one UUID REFERENCES users(id),
	participant_two UUID REFERENCES users(id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE messages (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	conversation_id UUID REFERENCES conversations(id),
	sender_id UUID REFERENCES users(id),
	content TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE (user_id, contact_id)
)


-- Start a conversation between two people
INSERT INTO conversations (participant_one, participant_two) 
VALUES ('809c4410-97c3-46a8-ac45-4cfafec41713', 'ef6d0dd1-50d6-40ab-9215-7468182180bf');

-- Insert a message from participant_one
INSERT INTO messages (conversation_id, sender_id, content)
VALUES (
    '0e0248c7-41d8-4776-ad70-378bdf27f6d4',
    '809c4410-97c3-46a8-ac45-4cfafec41713',
    'Hey, how are you?'
);

-- Insert a reply from participant_two
INSERT INTO messages (conversation_id, sender_id, content)
VALUES (
    '0e0248c7-41d8-4776-ad70-378bdf27f6d4',
    'ef6d0dd1-50d6-40ab-9215-7468182180bf',
    'I am good, thanks! How about you?'
);

-- Another message from participant_one
INSERT INTO messages (conversation_id, sender_id, content)
VALUES (
    '0e0248c7-41d8-4776-ad70-378bdf27f6d4',
    '809c4410-97c3-46a8-ac45-4cfafec41713',
    'I am doing well, just working on some projects.'
);