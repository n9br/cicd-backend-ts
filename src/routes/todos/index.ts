import { Router, Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import TodoModel from "../../database/models/TodoModel";

const TodosRouter = Router();

// Custom types for request interfaces
interface TodoQueryRequest extends Request {
  query: {
    todoId?: string;
    userId?: string;
  };
}

interface TodoUpdateRequest extends Request {
  body: {
    todoId: number;
    newTask?: string;
    newIsDone?: boolean;
    newDueDate?: string;
  };
}

interface TodoMarkRequest extends Request {
  body: {
    todoId: number;
    newIsDone: boolean;
  };
}

interface TodoCreateRequest extends Request {
  body: {
    newTask: string;
    newIsDone?: boolean;
    newDueDate: string;
    newUserId: number;
  };
}

interface TodoDeleteRequest extends Request {
  body: {
    todoId: number;
  };
}

// GET REQUESTS
TodosRouter.get("/byid", async (req: TodoQueryRequest, res: Response) => {
  const { todoId } = req.query;

  if (!todoId) {
    res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    return;
  }

  const todo = await TodoModel.findOne({ where: { id: Number(todoId) } });
  res.status(StatusCodes.OK).json({ todo });
});

// Get all Todos for a specific userId
TodosRouter.get("/byuserid", async (req: TodoQueryRequest, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send(ReasonPhrases.BAD_REQUEST + " Keine userID");
    return;
  }

  const userTodos = await TodoModel.findAll({
    where: { userId: Number(userId) },
  });
  res.status(StatusCodes.OK).json({ todos: userTodos });
});

// Get all Todos
TodosRouter.get("/all", async (_req: Request, res: Response) => {
  const todos = await TodoModel.findAll();
  res.status(StatusCodes.OK).send(todos);
});

// PUT REQUESTS
TodosRouter.put("/mark", async (req: TodoMarkRequest, res: Response) => {
  try {
    const { todoId, newIsDone } = req.body;

    if (!todoId) throw new Error("keine User Id");

    await TodoModel.update({ isDone: newIsDone }, { where: { id: todoId } });
    res.status(StatusCodes.OK).json({ updatedTodoId: todoId });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send(e.message);
  }
});

TodosRouter.put("/update", async (req: TodoUpdateRequest, res: Response) => {
  const { todoId, newTask, newIsDone, newDueDate } = req.body;

  await TodoModel.update(
    {
      task: newTask,
      isDone: newIsDone,
      dueDate: newDueDate ? new Date(newDueDate) : undefined,
    },
    { where: { id: todoId } }
  );

  res.status(StatusCodes.OK).json({ updatedTodoId: todoId });
});

// POST REQUESTS
TodosRouter.post("/create", async (req: TodoCreateRequest, res: Response) => {
  const { newTask, newIsDone = false, newDueDate, newUserId } = req.body;

  if (!newTask || !newDueDate || !newUserId) {
    throw new ReferenceError("One of my required Parameters is not defined");
  }

  const newTodo = {
    task: newTask,
    isDone: newIsDone,
    dueDate: new Date(newDueDate),
    userId: newUserId,
  };

  const todo = await TodoModel.create(newTodo);
  res.status(StatusCodes.OK).json({ todo });
});

// DELETE REQUEST
TodosRouter.delete("/delete", async (req: TodoDeleteRequest, res: Response) => {
  const { todoId } = req.body;

  await TodoModel.destroy({ where: { id: todoId } });
  res.status(StatusCodes.OK).json({ deletedTodosId: todoId });
});

export { TodosRouter };
