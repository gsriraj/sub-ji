-- Create Users table
CREATE TABLE users (
	user_id SERIAL PRIMARY KEY ,
	user_name VARCHAR(50) NOT NULL UNIQUE,
	created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP(0)
);

-- SELECT * FROM users;

-- DROP TABLE users;

INSERT INTO users (user_name)
VALUES ('gsriraj');

-- Create plans tabel

CREATE TABLE plans (
	id SERIAL PRIMARY KEY,
	plan_id VARCHAR NOT NULL,
	validity VARCHAR NOT NULL,
	cost NUMERIC(4,1) NOT NULL
);

-- SELECT * FROM plans;

INSERT INTO plans (plan_id, validity, cost)
VALUES ('FREE', 'Infinite', 0.0), ('TRIAL', '7', 0.0), ('LITE_1M', '30', 100.0), ('PRO_1M', '30', 200.0),
('LITE_6M', '180', 500.0), ('PRO_6M', '180', 900.0);


-- DROP TABLE plans;


-- Create subscriptions table

CREATE TABLE subscriptions (
	sub_id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users (user_id),
	plan_id INT REFERENCES plans (id),
	start_date DATE NOT NULL,
    active BOOLEAN NOT NULL 
);

-- SELECT * FROM subscriptions;

-- INSERT INTO subscriptions (user_id, plan_id, start_date)
-- VALUES (1, 3, '2020-10-16');
