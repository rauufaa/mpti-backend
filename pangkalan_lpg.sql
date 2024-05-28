-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 28, 2024 at 06:08 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pangkalan_lpg`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_pembelian`
--

CREATE TABLE `detail_pembelian` (
  `id_pembelian` int NOT NULL,
  `jumlah` int NOT NULL,
  `tipe_pembelian` set('ISI','KOSONG','TUKAR') COLLATE utf8mb4_general_ci NOT NULL,
  `harga` int NOT NULL,
  `id_gas` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detail_pengiriman`
--

CREATE TABLE `detail_pengiriman` (
  `id_pengiriman` int NOT NULL,
  `jumlah` int NOT NULL,
  `id_gas` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detail_pengiriman`
--

INSERT INTO `detail_pengiriman` (`id_pengiriman`, `jumlah`, `id_gas`) VALUES
(1, 100, 31200);

-- --------------------------------------------------------

--
-- Table structure for table `gas`
--

CREATE TABLE `gas` (
  `id` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `harga_isi` int NOT NULL,
  `harga_kosong` int NOT NULL,
  `harga_tukar` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gas`
--

INSERT INTO `gas` (`id`, `nama`, `harga_isi`, `harga_kosong`, `harga_tukar`) VALUES
(31200, 'Gas 3Kg', 220000, 200000, 18000),
(51200, 'Gas 5,5Kg', 430000, 370000, 50000),
(71200, 'Gas 12Kg', 500000, 400000, 100000);

-- --------------------------------------------------------

--
-- Table structure for table `konsumen`
--

CREATE TABLE `konsumen` (
  `nik` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `tipe` set('Rumah Tangga','Warung') COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `konsumen`
--

INSERT INTO `konsumen` (`nik`, `nama`, `tipe`) VALUES
('', '', ''),
('1810021306030001', 'Rauuf Anugerah Akbar', 'Rumah Tangga'),
('1810021306030002', 'Faad', 'Rumah Tangga');

-- --------------------------------------------------------

--
-- Table structure for table `pembelian_gas`
--

CREATE TABLE `pembelian_gas` (
  `id` int NOT NULL,
  `tanggal` datetime NOT NULL,
  `nik_konsumen_pembelian` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `username_input_pembelian` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_pengiriman_gas` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pembelian_gas`
--

INSERT INTO `pembelian_gas` (`id`, `tanggal`, `nik_konsumen_pembelian`, `username_input_pembelian`, `id_pengiriman_gas`) VALUES
(1, '2024-05-02 03:38:21', '1810021306030001', 'rauufaa', 1);

-- --------------------------------------------------------

--
-- Table structure for table `pengiriman_gas`
--

CREATE TABLE `pengiriman_gas` (
  `id` int NOT NULL,
  `tanggal` datetime NOT NULL,
  `username_input_pengiriman` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengiriman_gas`
--

INSERT INTO `pengiriman_gas` (`id`, `tanggal`, `username_input_pengiriman`) VALUES
(1, '2024-05-02 03:30:33', 'rauufaa');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` text COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `token` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `admin` set('ADMIN','BASIC') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `nama`, `password`, `email`, `token`, `admin`) VALUES
('macan', NULL, '1234', 'raarar', NULL, NULL),
('rauufaa', 'Rauuf Anugerah Akbar', '$2b$10$9xE9U4LBSv6Hn523XUrQ6e2IfbUQSCn7dNrUs7NzY/peUVqDYRtX6', 'rauufakbar03@gmail.com', '255ae45c-47e7-4c39-9a95-1f8526e6c20a', 'ADMIN');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_pembelian`
--
ALTER TABLE `detail_pembelian`
  ADD KEY `id_pembelian` (`id_pembelian`),
  ADD KEY `id_gas` (`id_gas`);

--
-- Indexes for table `detail_pengiriman`
--
ALTER TABLE `detail_pengiriman`
  ADD KEY `id_pengiriman` (`id_pengiriman`),
  ADD KEY `id_gas` (`id_gas`);

--
-- Indexes for table `gas`
--
ALTER TABLE `gas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `konsumen`
--
ALTER TABLE `konsumen`
  ADD PRIMARY KEY (`nik`);

--
-- Indexes for table `pembelian_gas`
--
ALTER TABLE `pembelian_gas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username_input_pembelian` (`username_input_pembelian`),
  ADD KEY `nik_konsumen_pembelian` (`nik_konsumen_pembelian`),
  ADD KEY `id_pengiriman_gas` (`id_pengiriman_gas`);

--
-- Indexes for table `pengiriman_gas`
--
ALTER TABLE `pengiriman_gas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username_input_pengiriman` (`username_input_pengiriman`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`),
  ADD UNIQUE KEY `email` (`email`,`token`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pengiriman_gas`
--
ALTER TABLE `pengiriman_gas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_pembelian`
--
ALTER TABLE `detail_pembelian`
  ADD CONSTRAINT `detail_pembelian_ibfk_1` FOREIGN KEY (`id_pembelian`) REFERENCES `pembelian_gas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detail_pembelian_ibfk_2` FOREIGN KEY (`id_gas`) REFERENCES `gas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `detail_pengiriman`
--
ALTER TABLE `detail_pengiriman`
  ADD CONSTRAINT `detail_pengiriman_ibfk_1` FOREIGN KEY (`id_gas`) REFERENCES `gas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detail_pengiriman_ibfk_2` FOREIGN KEY (`id_pengiriman`) REFERENCES `pengiriman_gas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pembelian_gas`
--
ALTER TABLE `pembelian_gas`
  ADD CONSTRAINT `pembelian_gas_ibfk_1` FOREIGN KEY (`nik_konsumen_pembelian`) REFERENCES `konsumen` (`nik`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pembelian_gas_ibfk_2` FOREIGN KEY (`username_input_pembelian`) REFERENCES `users` (`username`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pembelian_gas_ibfk_3` FOREIGN KEY (`id_pengiriman_gas`) REFERENCES `pengiriman_gas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pengiriman_gas`
--
ALTER TABLE `pengiriman_gas`
  ADD CONSTRAINT `pengiriman_gas_ibfk_1` FOREIGN KEY (`username_input_pengiriman`) REFERENCES `users` (`username`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
