import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import { taskService } from "@/services/api/taskService";
import { cropService } from "@/services/api/cropService";

const TaskForm = ({ task, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    cropId: "",
    dueDate: "",
    priority: "medium",
    category: "general",
status: "pending",
    completed: false
  });

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCrops();
    if (task) {
setFormData({
        title: task.title || "",
        description: task.description || "",
        cropId: task.cropId || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        priority: task.priority || "medium",
        category: task.category || "general",
status: task.status || "pending",
        completed: task.completed || false
      });
    }
  }, [task]);

  const loadCrops = async () => {
    try {
      const cropData = await cropService.getAll();
      setCrops(cropData);
    } catch (error) {
      console.error("Failed to load crops:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (task) {
        await taskService.update(task.Id, formData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(formData);
        toast.success("Task created successfully!");
      }
      
      onSave();
    } catch (error) {
      toast.error(error.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {task ? "Edit Task" : "Create New Task"}
        </h2>
        <p className="text-gray-600">
          {task ? "Update task details" : "Add a new task to your farm schedule"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Water tomatoes, Apply fertilizer"
          required
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of the task..."
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Related Crop"
            name="cropId"
            value={formData.cropId}
            onChange={handleChange}
            placeholder="Select a crop (optional)"
          >
{crops.map((crop) => (
              <option key={crop.Id} value={crop.Id}>
                {crop.name} - {crop.fieldLocation}
              </option>
            ))}
          </Select>

          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="planting">Planting</option>
            <option value="watering">Watering</option>
            <option value="harvesting">Harvesting</option>
            <option value="maintenance">Maintenance</option>
            <option value="fertilizing">Fertilizing</option>
            <option value="general">General</option>
          </Select>
        </div>

<Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>

        {task && (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="completed" className="text-sm font-medium text-gray-700">
              Mark as completed
            </label>
          </div>
        )}

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon="Save"
            disabled={loading}
          >
            {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TaskForm;