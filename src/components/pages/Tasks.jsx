import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TaskItem from "@/components/molecules/TaskItem";
import TaskForm from "@/components/organisms/TaskForm";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, searchTerm, priorityFilter, statusFilter, sortBy]);

  const loadTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      setError(error.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTasks = () => {
    let filtered = [...tasks];

    // Filter by search term
if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Filter by status
    if (statusFilter === "completed") {
      filtered = filtered.filter(task => task.completed);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(task => !task.completed);
    } else if (statusFilter === "overdue") {
      filtered = filtered.filter(task => 
        !task.completed && new Date(task.dueDate) < new Date()
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "title":
          return (a.title_c || '').localeCompare(b.title_c || '');
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (task) {
        await taskService.update(taskId, { ...task, completed: !task.completed });
        toast.success(task.completed ? "Task marked incomplete" : "Task completed!");
        loadTasks();
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        toast.success("Task deleted successfully!");
        loadTasks();
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingTask(null);
    loadTasks();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h1>
            <p className="text-gray-600 mt-2">
              {editingTask ? "Update task details" : "Add a new task to your schedule"}
            </p>
          </div>
        </div>
        <TaskForm
          task={editingTask}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  // Calculate stats
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;
  const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === "high").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Task Management
          </h1>
          <p className="text-gray-600 mt-2">
            Organize and track your farm tasks efficiently
          </p>
        </div>
        <Button
          onClick={handleAddTask}
          icon="Plus"
          variant="primary"
          size="lg"
        >
          Create New Task
        </Button>
      </div>

      {/* Stats */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-2xl font-bold text-green-800">{completedTasks}</div>
            <div className="text-sm text-green-600 font-medium">Completed</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-2xl font-bold text-blue-800">{pendingTasks}</div>
            <div className="text-sm text-blue-600 font-medium">Pending</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="text-2xl font-bold text-red-800">{overdueTasks}</div>
            <div className="text-sm text-red-600 font-medium">Overdue</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-800">{highPriorityTasks}</div>
            <div className="text-sm text-yellow-600 font-medium">High Priority</div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </Select>
        </div>
      </Card>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.Id}
              task={task}
              onComplete={handleCompleteTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description="Create your first task to start organizing your farm operations"
          icon="CheckSquare"
          actionLabel="Create First Task"
          onAction={handleAddTask}
        />
      ) : (
        <Card className="text-center py-12">
          <ApperIcon name="Search" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks match your filters</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setPriorityFilter("all");
              setStatusFilter("all");
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Tasks;