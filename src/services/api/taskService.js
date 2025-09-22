// Task service using ApperClient for database operations

class TaskService {
  constructor() {
    this.tableName = 'task_c';
    this.apperClient = null;
  }

  getApperClient() {
    if (!this.apperClient && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
{"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch tasks:", response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to UI expected format
      const tasks = (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        dueDate: task.due_date_c || null,
        priority: task.priority_c || 'medium',
        category: task.category_c || 'general',
completed: task.completed_c || false,
        status: task.status_c || 'pending',
        cropId: task.crop_id_c?.Id || task.crop_id_c || null
      }));
      
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
{"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch task:", response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Task not found");
      }
      
      // Map database fields to UI expected format
      const task = {
        Id: response.data.Id,
        title: response.data.title_c || response.data.Name || '',
description: response.data.description_c || '',
        dueDate: response.data.due_date_c || null,
        status: response.data.status_c || 'pending',
        priority: response.data.priority_c || 'medium',
        category: response.data.category_c || 'general',
        completed: response.data.completed_c || false,
        cropId: response.data.crop_id_c?.Id || response.data.crop_id_c || null
      };
      
      return task;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const client = this.getApperClient();
      
      // Map UI fields to database fields (only Updateable fields)
      const dbData = {
        Name: taskData.title || 'New Task',
        title_c: taskData.title || '',
        description_c: taskData.description || '',
        due_date_c: taskData.dueDate || null,
        priority_c: taskData.priority || 'medium',
        category_c: taskData.category || 'general',
completed_c: taskData.completed || false,
        status_c: taskData.status || 'pending',
        crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          const errorMessage = failed[0]?.message || "Failed to create task";
          throw new Error(errorMessage);
        }
        
        if (successful.length > 0) {
          const newTask = successful[0].data;
          return {
            Id: newTask.Id,
            title: newTask.title_c || newTask.Name || '',
            description: newTask.description_c || '',
            dueDate: newTask.due_date_c || null,
            priority: newTask.priority_c || 'medium',
category: newTask.category_c || 'general',
            completed: newTask.completed_c || false,
            status: newTask.status_c || 'pending',
            cropId: newTask.crop_id_c?.Id || newTask.crop_id_c || null
          };
        }
      }
      
      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const client = this.getApperClient();
      
      // Map UI fields to database fields (only Updateable fields)
      const dbData = {
        Id: parseInt(id),
        Name: taskData.title || 'Updated Task',
        title_c: taskData.title || '',
        description_c: taskData.description || '',
        due_date_c: taskData.dueDate || null,
        priority_c: taskData.priority || 'medium',
category_c: taskData.category || 'general',
        completed_c: taskData.completed || false,
        status_c: taskData.status || 'pending',
        crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          const errorMessage = failed[0]?.message || "Failed to update task";
          throw new Error(errorMessage);
        }
        
        if (successful.length > 0) {
          const updatedTask = successful[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || updatedTask.Name || '',
            description: updatedTask.description_c || '',
            dueDate: updatedTask.due_date_c || null,
priority: updatedTask.priority_c || 'medium',
            category: updatedTask.category_c || 'general',
            status: updatedTask.status_c || 'pending',
            completed: updatedTask.completed_c || false,
            cropId: updatedTask.crop_id_c?.Id || updatedTask.crop_id_c || null
          };
        }
      }
      
      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const client = this.getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to delete task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          const errorMessage = failed[0]?.message || "Failed to delete task";
          throw new Error(errorMessage);
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const taskService = new TaskService();