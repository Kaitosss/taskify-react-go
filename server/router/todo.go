package router

import (
	"github.com/Kaitosss/Taskify/controller"
	"github.com/gofiber/fiber/v2"
)

func SetupRouter(app *fiber.App) {
	app.Get("/api/todos", controller.GetTodos)
	app.Post("/api/todos", controller.CreateTodo)
	app.Put("/api/todos/:id", controller.UpdateTodo)
	app.Delete("/api/todos/:id", controller.DeleteTodo)
}
