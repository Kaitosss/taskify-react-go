package database

import (
	"fmt"
	"log"
	"os"

	"github.com/Kaitosss/Taskify/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error),
	})

	if err != nil {
		log.Fatal("Failed to connect database : ", err)
	}

	db.AutoMigrate(new(model.Todo))

	fmt.Print("Database connected successfully")
	DB = db

}
