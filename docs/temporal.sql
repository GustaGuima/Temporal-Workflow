
CREATE SCHEMA IF NOT EXISTS `temporal` DEFAULT CHARACTER SET utf8 ;
USE `temporal` ;

-- -----------------------------------------------------
-- Table `mydb`.`credit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `temporal`.`credit` ;

CREATE TABLE IF NOT EXISTS `temporal`.`credit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `application_id` VARCHAR(45) NOT NULL,
  `pre_approval` TINYINT NOT NULL DEFAULT 0,
  `credit_score` DOUBLE NOT NULL DEFAULT 0,
  `mortgage` DOUBLE NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;