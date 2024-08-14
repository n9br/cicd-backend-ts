import { DataTypes, Model, Optional } from "sequelize";
import todoSequelize from "../setup/database";

// Define the Todo attributes interface
interface TodoAttributes {
  id: number;
  userId: number;
  task: string;
  isDone: boolean;
  dueDate: Date;
}

// Define the creation attributes interface, with 'id' being optional for new instances
interface TodoCreationAttributes extends Optional<TodoAttributes, "id"> {}

// Define the Todo model
class TodoModel
  extends Model<TodoAttributes, TodoCreationAttributes>
  implements TodoAttributes
{
  public id!: number;
  public userId!: number;
  public task!: string;
  public isDone!: boolean;
  public dueDate!: Date;
}

TodoModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    task: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDone: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: todoSequelize,
    tableName: "Todos",
  }
);

export default TodoModel;
