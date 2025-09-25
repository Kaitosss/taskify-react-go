package controller

import (
	"github.com/Kaitosss/Taskify/database"
	"github.com/Kaitosss/Taskify/model"
	"github.com/gofiber/fiber/v2"
)

func CreateTodo(c *fiber.Ctx) error {
	todo := &model.Todo{}

	if err := c.BodyParser(todo); err != nil {
		return err
	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo body is required"})
	}

	if err := database.DB.Create(todo).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Cannot create todo"})
	}

	return c.Status(201).JSON(todo)
}

func GetTodos(c *fiber.Ctx) error {
	var todo []model.Todo

	if err := database.DB.Find(&todo).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Cannot fetch todos"})
	}

	return c.Status(200).JSON(todo)
}

func UpdateTodo(c *fiber.Ctx) error {
	id := c.Params("id")

	var todo model.Todo

	if err := database.DB.First(&todo, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}

	todo.Completed = true;

	if err := database.DB.Save(&todo).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error in saving data"})
	}

	return c.Status(200).JSON(todo)
}

func DeleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")

	var todo model.Todo

	if err := database.DB.First(&todo, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}

	if err := database.DB.Delete(&todo).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error deleting todo"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Todo deleted"})

}
