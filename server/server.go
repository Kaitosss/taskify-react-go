package main

import (
	"log"
	"os"

	"github.com/Kaitosss/Taskify/database"
	"github.com/Kaitosss/Taskify/router"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("ENV") != "production" {
		if err := godotenv.Load(); err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	database.ConnectDB()

	sqlDB, err := database.DB.DB()

	if err != nil {
		log.Fatal("Failed to get sqlDB from gorm DB : ", err)
	}

	defer sqlDB.Close()

	app := fiber.New()


	app.Use(logger.New())

	router.SetupRouter(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	if os.Getenv("ENV") == "production" {
		app.Static("/","./client/dist")
	}

	log.Fatal(app.Listen(":" + port))
}
