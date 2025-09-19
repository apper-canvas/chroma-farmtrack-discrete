// Crop service using ApperClient for database operations

class CropService {
  constructor() {
    this.tableName = 'crop_c';
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "field_location_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch crops:", response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to UI expected format
      const crops = (response.data || []).map(crop => ({
        Id: crop.Id,
        name: crop.name_c || crop.Name || '',
        variety: crop.variety_c || '',
        plantingDate: crop.planting_date_c || null,
        expectedHarvest: crop.expected_harvest_c || null,
        fieldLocation: crop.field_location_c || '',
        quantity: crop.quantity_c || 0,
        status: crop.status_c || 'planted',
        notes: crop.notes_c || ''
      }));
      
      return crops;
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "field_location_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch crop:", response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Crop not found");
      }
      
      // Map database fields to UI expected format
      const crop = {
        Id: response.data.Id,
        name: response.data.name_c || response.data.Name || '',
        variety: response.data.variety_c || '',
        plantingDate: response.data.planting_date_c || null,
        expectedHarvest: response.data.expected_harvest_c || null,
        fieldLocation: response.data.field_location_c || '',
        quantity: response.data.quantity_c || 0,
        status: response.data.status_c || 'planted',
        notes: response.data.notes_c || ''
      };
      
      return crop;
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(cropData) {
    try {
      const client = this.getApperClient();
      
      // Map UI fields to database fields (only Updateable fields)
      const dbData = {
        Name: cropData.name || 'New Crop',
        name_c: cropData.name || '',
        variety_c: cropData.variety || '',
        planting_date_c: cropData.plantingDate || null,
        expected_harvest_c: cropData.expectedHarvest || null,
        field_location_c: cropData.fieldLocation || '',
        quantity_c: parseFloat(cropData.quantity) || 0,
        status_c: cropData.status || 'planted',
        notes_c: cropData.notes || ''
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create crop:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} crops:`, failed);
          const errorMessage = failed[0]?.message || "Failed to create crop";
          throw new Error(errorMessage);
        }
        
        if (successful.length > 0) {
          const newCrop = successful[0].data;
          return {
            Id: newCrop.Id,
            name: newCrop.name_c || newCrop.Name || '',
            variety: newCrop.variety_c || '',
            plantingDate: newCrop.planting_date_c || null,
            expectedHarvest: newCrop.expected_harvest_c || null,
            fieldLocation: newCrop.field_location_c || '',
            quantity: newCrop.quantity_c || 0,
            status: newCrop.status_c || 'planted',
            notes: newCrop.notes_c || ''
          };
        }
      }
      
      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating crop:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, cropData) {
    try {
      const client = this.getApperClient();
      
      // Map UI fields to database fields (only Updateable fields)
      const dbData = {
        Id: parseInt(id),
        Name: cropData.name || 'Updated Crop',
        name_c: cropData.name || '',
        variety_c: cropData.variety || '',
        planting_date_c: cropData.plantingDate || null,
        expected_harvest_c: cropData.expectedHarvest || null,
        field_location_c: cropData.fieldLocation || '',
        quantity_c: parseFloat(cropData.quantity) || 0,
        status_c: cropData.status || 'planted',
        notes_c: cropData.notes || ''
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update crop:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} crops:`, failed);
          const errorMessage = failed[0]?.message || "Failed to update crop";
          throw new Error(errorMessage);
        }
        
        if (successful.length > 0) {
          const updatedCrop = successful[0].data;
          return {
            Id: updatedCrop.Id,
            name: updatedCrop.name_c || updatedCrop.Name || '',
            variety: updatedCrop.variety_c || '',
            plantingDate: updatedCrop.planting_date_c || null,
            expectedHarvest: updatedCrop.expected_harvest_c || null,
            fieldLocation: updatedCrop.field_location_c || '',
            quantity: updatedCrop.quantity_c || 0,
            status: updatedCrop.status_c || 'planted',
            notes: updatedCrop.notes_c || ''
          };
        }
      }
      
      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating crop:", error?.response?.data?.message || error);
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
        console.error("Failed to delete crop:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} crops:`, failed);
          const errorMessage = failed[0]?.message || "Failed to delete crop";
          throw new Error(errorMessage);
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const cropService = new CropService();