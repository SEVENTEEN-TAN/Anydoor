-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2024-04-19 16:31:38
-- 服务器版本： 5.7.40-log
-- PHP 版本： 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `anydoor`
--

-- --------------------------------------------------------

--
-- 表的结构 `CookiesInfo`
--

CREATE TABLE `CookiesInfo` (
  `serial_no` int(11) NOT NULL,
  `project_id` text,
  `project_name` text,
  `domain` text,
  `cookie` text,
  `is_use` varchar(6) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `RoleInfo`
--

CREATE TABLE `RoleInfo` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `RoleInfo`
--

INSERT INTO `RoleInfo` (`role_id`, `role_name`, `create_time`, `update_time`) VALUES
(1, 'Admin', '2024-04-19 00:00:00', '2024-04-19 00:00:00'),
(2, 'User', '2024-04-19 00:00:00', '2024-04-19 00:00:00'),
(3, 'Guest', '2024-04-19 00:00:00', '2024-04-19 00:00:00');

-- --------------------------------------------------------

--
-- 表的结构 `UserInfo`
--

CREATE TABLE `UserInfo` (
  `user_id` int(11) NOT NULL,
  `user_name` text,
  `user_pwd` text,
  `is_use` varchar(6) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `UserInfo`
--

INSERT INTO `UserInfo` (`user_id`, `user_name`, `user_pwd`, `is_use`, `create_time`, `update_time`) VALUES
(1, 'admin', '21232f297a57a5a743894a0e4a801fc3', '1', '2024-04-18 00:00:00', '2024-04-18 00:00:00');

-- --------------------------------------------------------

--
-- 表的结构 `UserRole`
--

CREATE TABLE `UserRole` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `UserRole`
--

INSERT INTO `UserRole` (`user_id`, `role_id`, `create_time`, `update_time`) VALUES
(1, 1, '2024-04-19 15:11:19', '2024-04-19 15:11:19'),
(1, 2, '2024-04-19 15:11:19', '2024-04-19 15:11:19'),
(1, 3, '2024-04-19 15:11:19', '2024-04-19 15:11:19');

--
-- 转储表的索引
--

--
-- 表的索引 `CookiesInfo`
--
ALTER TABLE `CookiesInfo`
  ADD PRIMARY KEY (`serial_no`);

--
-- 表的索引 `RoleInfo`
--
ALTER TABLE `RoleInfo`
  ADD PRIMARY KEY (`role_id`);

--
-- 表的索引 `UserInfo`
--
ALTER TABLE `UserInfo`
  ADD PRIMARY KEY (`user_id`);

--
-- 表的索引 `UserRole`
--
ALTER TABLE `UserRole`
  ADD PRIMARY KEY (`user_id`,`role_id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `CookiesInfo`
--
ALTER TABLE `CookiesInfo`
  MODIFY `serial_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- 使用表AUTO_INCREMENT `UserInfo`
--
ALTER TABLE `UserInfo`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
