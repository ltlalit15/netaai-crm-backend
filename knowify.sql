-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 13, 2025 at 01:35 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `knowify`
--

-- --------------------------------------------------------

--
-- Table structure for table `catalog_items`
--

CREATE TABLE `catalog_items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `default_scope_of_work` text DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `is_subitem` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `client_type` varchar(255) DEFAULT NULL,
  `is_subclient` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `other_details` varchar(255) DEFAULT NULL,
  `address_lookup` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `address_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `address_type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `client_name`, `contact_name`, `client_type`, `is_subclient`, `phone`, `email`, `other_details`, `address_lookup`, `address`, `address_2`, `city`, `state`, `zip_code`, `country`, `notes`, `address_type`, `created_at`, `updated_at`) VALUES
(1, 'XYZ Corporation', 'John Doe', 'Business', 'No', '+91-9876543210', 'john.doe@abccorp.com', 'GSTIN: 27AABCU9603R1ZV, Website: www.abccorp.com', 'ABC Corp Office Mumbai', 'Building No. 5, ABC Tech Park', 'Near Western Express Highway', 'Mumbai', 'Maharashtra', '400063', 'India', 'Preferred communication via email. Client since 2022.', 'Head Office', '2025-06-12 09:42:27', '2025-06-13 06:14:34'),
(2, 'Demo Client', 'John Doe', 'person', '1', '9876543210', 'demo@example.com', 'Account #123, Website: demo.com', 'Search Term', '123 Main Street', 'Suite 100', 'New York', 'NY', '10001', 'United States', 'Important client', 'Billing', '2025-06-12 11:08:15', '2025-06-12 11:08:15'),
(3, 'Devfmo Client', 'John Doe', 'person', '1', '9876543210', 'demo@example.com', 'Account #123, Website: demo.com', 'Search Term', '123 Main Street', 'Suite 100', 'New York', 'NY', '10001', 'United States', 'Important client', 'Billing', '2025-06-12 11:08:50', '2025-06-12 11:09:31'),
(4, 'ABC Corporation', 'John Doe', 'Business', 'No', '+91-9876543210', 'john.doe@abccorp.com', 'GSTIN: 27AABCU9603R1ZV, Website: www.abccorp.com', 'ABC Corp Office Mumbai', 'Building No. 5, ABC Tech Park', 'Near Western Express Highway', 'Mumbai', 'Maharashtra', '400063', 'India', 'Preferred communication via email. Client since 2022.', 'Head Office', '2025-06-13 06:13:16', '2025-06-13 06:13:16');

-- --------------------------------------------------------

--
-- Table structure for table `contract_jobs`
--

CREATE TABLE `contract_jobs` (
  `id` int(11) NOT NULL,
  `job_name` varchar(255) DEFAULT NULL,
  `client_name` varchar(255) NOT NULL,
  `job_type` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `bid_due_date` varchar(255) DEFAULT NULL,
  `scheduling_color` varchar(50) DEFAULT NULL,
  `sales_lead` varchar(255) DEFAULT NULL,
  `project_manager` varchar(255) DEFAULT NULL,
  `job_address` text DEFAULT NULL,
  `address_optional` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `department_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `extended_description` text DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `unit_of_measure` varchar(255) DEFAULT NULL,
  `unit_price` varchar(255) DEFAULT NULL,
  `unit_cost` varchar(255) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `project_title` varchar(255) NOT NULL,
  `created_date` varchar(255) NOT NULL,
  `client_contact` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `age` varchar(255) NOT NULL,
  `confidence_percent` varchar(255) NOT NULL,
  `estimated_revenue_min` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order`
--

CREATE TABLE `purchase_order` (
  `id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `purchase_type` varchar(100) DEFAULT NULL,
  `item` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `person_to_be_reimbursed` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order`
--

INSERT INTO `purchase_order` (`id`, `created_at`, `updated_at`, `purchase_type`, `item`, `notes`, `person_to_be_reimbursed`) VALUES
(2, '2025-06-13 16:08:35', '2025-06-13 16:08:35', 'Travel', 'Flight ticket to Delhi for site visit', 'Booked via company-approved portal. Economy class.', 'Rajeev Sharma');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'Business Owner', 'Has full access to all modules and settings.'),
(2, 'Office Manager', 'Manages office operations like jobs, bills, and client communication.'),
(3, 'Project Manager', 'Handles specific jobs, task assignments, and tracking.'),
(4, 'Accountant/Bookkeeper', 'Manages all financial transactions including invoices and bills.'),
(5, 'Financial Advisor', 'Accesses reports and analytics to advise on business finances.'),
(6, 'Site Superintendent/Foreman', 'Supervises on-site tasks and coordinates with field staff.'),
(7, 'Field Employee', 'Limited access to assigned tasks and time tracking only.');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `default_scope_of_work` text DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `price` varchar(255) NOT NULL,
  `is_subitem` varchar(255) NOT NULL,
  `is_template` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `task_description` text NOT NULL,
  `project` varchar(255) NOT NULL,
  `assign_to` text DEFAULT NULL,
  `due_date` varchar(255) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `subtasks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `type_of_access` varchar(100) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `direct_manager` varchar(100) DEFAULT NULL,
  `enable_approval_authority` varchar(10) DEFAULT NULL,
  `cell_phone` varchar(20) DEFAULT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `manage_vendor_bills` varchar(10) DEFAULT NULL,
  `invoice_clients` varchar(10) DEFAULT NULL,
  `track_time` varchar(10) DEFAULT NULL,
  `manage_client_agreements` varchar(10) DEFAULT NULL,
  `schedule_resources` varchar(10) DEFAULT NULL,
  `view_financials` varchar(10) DEFAULT NULL,
  `foreman_or_approve_timecards` varchar(10) DEFAULT NULL,
  `access_quickbooks` varchar(10) DEFAULT NULL,
  `manage_or_estimate_jobs` varchar(10) DEFAULT NULL,
  `is_admin` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `vendor_name` varchar(255) NOT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `address_lookup` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `other_details` varchar(255) DEFAULT NULL,
  `vendor_type` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role_trade` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `vendor_name`, `contact_name`, `address_lookup`, `phone`, `email`, `other_details`, `vendor_type`, `created_at`, `updated_at`, `role_trade`) VALUES
(2, 'Global Supplies Pvt Ltd', 'Anita Sharma', 'Global Supplies Warehouse Delhi', '+91-9988776655', 'anita@globalsupplies.com', 'PAN: AAAPL1234C, GSTIN: 07AABCG1234L1Z9', 'Raw Materials', '2025-06-13 06:17:01', '2025-06-13 06:17:01', 'fjvn');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `catalog_items`
--
ALTER TABLE `catalog_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contract_jobs`
--
ALTER TABLE `contract_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchase_order`
--
ALTER TABLE `purchase_order`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `catalog_items`
--
ALTER TABLE `catalog_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contract_jobs`
--
ALTER TABLE `contract_jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `purchase_order`
--
ALTER TABLE `purchase_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
