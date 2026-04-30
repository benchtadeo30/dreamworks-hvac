CREATE TABLE `clients` (
	`client_id` serial AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned,
	`email` varchar(150) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`address` varchar(255),
	`city_area` varchar(100),
	`property_type` enum('Residential','Commercial','Industrial') NOT NULL,
	`client_status` enum('New Client','Active','Completed') NOT NULL,
	`member_since` date,
	CONSTRAINT `clients_client_id` PRIMARY KEY(`client_id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`employee_id` serial AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned,
	`full_name` varchar(160) NOT NULL,
	`role` enum('technician','admin','super_admin') NOT NULL,
	`specialization` varchar(150),
	`contact_phone` varchar(20),
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`date_hired` date,
	CONSTRAINT `employees_employee_id` PRIMARY KEY(`employee_id`)
);
--> statement-breakpoint
CREATE TABLE `service_requests` (
	`request_id` serial AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned,
	`first_name` varchar(80) NOT NULL,
	`last_name` varchar(80) NOT NULL,
	`email` varchar(150) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`services` json NOT NULL,
	`property_type` enum('residential','commercial','industrial') NOT NULL,
	`service_details` text NOT NULL,
	`address` varchar(255) NOT NULL,
	`barangay` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`postal_code` int NOT NULL,
	`preferred_date` date NOT NULL,
	`preferred_time` varchar(20),
	`urgency` enum('emergency','urgent','standard','flexible') NOT NULL,
	`referral` varchar(20),
	CONSTRAINT `service_requests_request_id` PRIMARY KEY(`request_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` serial AUTO_INCREMENT NOT NULL,
	`first_name` varchar(80) NOT NULL,
	`last_name` varchar(80) NOT NULL,
	`email` varchar(150) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('customer','admin') NOT NULL,
	`created_at` date DEFAULT (CURRENT_DATE),
	`terms_accepted` tinyint NOT NULL,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_requests` ADD CONSTRAINT `service_requests_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;