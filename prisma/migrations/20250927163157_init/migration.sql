-- CreateTable
CREATE TABLE `cache` (
    `key` VARCHAR(255) NOT NULL,
    `value` MEDIUMTEXT NOT NULL,
    `expiration` INTEGER NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cache_locks` (
    `key` VARCHAR(255) NOT NULL,
    `owner` VARCHAR(255) NOT NULL,
    `expiration` INTEGER NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `clients_name_unique`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_details` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `inspection_id` BIGINT UNSIGNED NOT NULL,
    `inspection_date` DATE NULL,
    `project_name` VARCHAR(255) NOT NULL,
    `client` VARCHAR(255) NULL,
    `project_reference` VARCHAR(255) NULL,
    `client_contact` VARCHAR(255) NULL,
    `client_rep` VARCHAR(255) NULL,
    `installer` VARCHAR(255) NULL,
    `barrier_materials_raf` VARCHAR(255) NULL,
    `barrier_materials_ceiling` VARCHAR(255) NULL,
    `third_party_acr` VARCHAR(255) NULL,
    `digital_recording` BOOLEAN NOT NULL DEFAULT false,
    `storeys` INTEGER NULL,
    `structural_frame` VARCHAR(255) NULL,
    `façade` VARCHAR(255) NULL,
    `floor_type` VARCHAR(255) NULL,
    `internal_walls` VARCHAR(255) NULL,
    `fire_stopping_materials` VARCHAR(255) NULL,
    `barrier_materials` VARCHAR(255) NULL,
    `dampers` VARCHAR(255) NULL,
    `encasements` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `inspection_details_inspection_id_foreign`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `inspection_id` BIGINT UNSIGNED NOT NULL,
    `new_value` TEXT NULL,
    `changed_at` TIMESTAMP(0) NOT NULL,
    `changed_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `inspection_logs_inspection_id_foreign`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection_options` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `site_inspection_id` BIGINT UNSIGNED NOT NULL,
    `option_name` VARCHAR(255) NOT NULL,
    `status` ENUM('checked', 'not_checked', 'absent', 'not_required', 'not_applicable', 'yes', 'no', 'not_selected') NOT NULL DEFAULT 'not_selected',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `inspection_options_site_inspection_id_foreign`(`site_inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspections` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` BIGINT UNSIGNED NOT NULL,
    `inspection_number` INTEGER UNSIGNED NOT NULL,
    `version` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `inspection_date` DATE NULL,
    `inspector_name` VARCHAR(255) NULL,
    `status` ENUM('in_progress', 'completed') NOT NULL DEFAULT 'in_progress',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `inspections_project_id_foreign`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_inspections` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `inspection_id` BIGINT UNSIGNED NOT NULL,
    `client_meeting_done` TEXT NULL,
    `urgent_matters` TEXT NULL,
    `next_inspection_date` DATE NULL,
    `bolster_notes` TEXT NULL,
    `comment` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `post_inspections_inspection_id_foreign`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pre_inspections` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `inspection_id` BIGINT UNSIGNED NOT NULL,
    `rams_info_submitted` BOOLEAN NOT NULL DEFAULT false,
    `wall_type_drawings` BOOLEAN NOT NULL DEFAULT false,
    `induction_arranged` BOOLEAN NOT NULL DEFAULT false,
    `induction_attended` BOOLEAN NOT NULL DEFAULT false,
    `ppe_checked` BOOLEAN NOT NULL DEFAULT false,
    `client_meeting` BOOLEAN NOT NULL DEFAULT false,
    `fire_drawings_available` BOOLEAN NOT NULL DEFAULT false,
    `bolster_uploads` BOOLEAN NOT NULL DEFAULT false,
    `bolster_synced` BOOLEAN NOT NULL DEFAULT false,
    `latest_eta_available` BOOLEAN NOT NULL DEFAULT false,
    `walkthrough_done` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `pre_inspections_inspection_id_foreign`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_name` VARCHAR(255) NOT NULL,
    `project_reference` VARCHAR(255) NULL,
    `client` VARCHAR(255) NULL,
    `status` ENUM('in_progress', 'completed') NOT NULL DEFAULT 'in_progress',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_inspections` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `inspection_id` BIGINT UNSIGNED NOT NULL,
    `category_name` VARCHAR(255) NOT NULL,
    `checked_status` ENUM('checked', 'not_checked') NOT NULL DEFAULT 'not_checked',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `site_inspections_inspection_id_foreign`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inspection_details` ADD CONSTRAINT `inspection_details_inspection_id_foreign` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inspection_logs` ADD CONSTRAINT `inspection_logs_inspection_id_foreign` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inspection_options` ADD CONSTRAINT `inspection_options_site_inspection_id_foreign` FOREIGN KEY (`site_inspection_id`) REFERENCES `site_inspections`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `post_inspections` ADD CONSTRAINT `post_inspections_inspection_id_foreign` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pre_inspections` ADD CONSTRAINT `pre_inspections_inspection_id_foreign` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `site_inspections` ADD CONSTRAINT `site_inspections_inspection_id_foreign` FOREIGN KEY (`inspection_id`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
