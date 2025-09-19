// Financial service using ApperClient for database operations

class FinancialService {
  constructor() {
    this.tableName = 'financial_c';
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch financials:", response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to UI expected format
      const financials = (response.data || []).map(financial => ({
        Id: financial.Id,
        type: financial.type_c || 'expense',
        category: financial.category_c || '',
        amount: financial.amount_c || 0,
        description: financial.description_c || financial.Name || '',
        date: financial.date_c || null,
        cropId: financial.crop_id_c?.Id || financial.crop_id_c || null
      }));
      
      return financials;
    } catch (error) {
      console.error("Error fetching financials:", error?.response?.data?.message || error);
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch financial:", response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Financial record not found");
      }
      
      // Map database fields to UI expected format
      const financial = {
        Id: response.data.Id,
        type: response.data.type_c || 'expense',
        category: response.data.category_c || '',
        amount: response.data.amount_c || 0,
        description: response.data.description_c || response.data.Name || '',
        date: response.data.date_c || null,
        cropId: response.data.crop_id_c?.Id || response.data.crop_id_c || null
      };
      
      return financial;
    } catch (error) {
      console.error(`Error fetching financial ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

async create(financialData) {
    try {
      const client = this.getApperClient();
      
      // Map UI fields to database fields (only Updateable fields - exclude Name)
      const dbData = {
        type_c: financialData.type || 'expense',
        category_c: financialData.category || '',
        amount_c: parseFloat(financialData.amount) || 0,
        description_c: financialData.description || '',
        date_c: financialData.date || null,
        crop_id_c: financialData.cropId ? parseInt(financialData.cropId) : null
      };
      const params = {
        records: [dbData]
      };
      
      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create financial:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} financials:`, failed);
          const errorMessage = failed[0]?.message || "Failed to create financial record";
          throw new Error(errorMessage);
        }
        
        if (successful.length > 0) {
          const newFinancial = successful[0].data;
          return {
            Id: newFinancial.Id,
            type: newFinancial.type_c || 'expense',
            category: newFinancial.category_c || '',
            amount: newFinancial.amount_c || 0,
            description: newFinancial.description_c || newFinancial.Name || '',
            date: newFinancial.date_c || null,
            cropId: newFinancial.crop_id_c?.Id || newFinancial.crop_id_c || null
          };
        }
      }
      
      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating financial:", error?.response?.data?.message || error);
      throw error;
    }
  }

async update(id, financialData) {
    try {
      const client = this.getApperClient();
      
      // Map UI fields to database fields (only Updateable fields - exclude Name)
      const dbData = {
        Id: parseInt(id),
        type_c: financialData.type || 'expense',
        category_c: financialData.category || '',
        amount_c: parseFloat(financialData.amount) || 0,
        description_c: financialData.description || '',
        date_c: financialData.date || null,
        crop_id_c: financialData.cropId ? parseInt(financialData.cropId) : null
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update financial:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} financials:`, failed);
          const errorMessage = failed[0]?.message || "Failed to update financial record";
          throw new Error(errorMessage);
        }
        
        if (successful.length > 0) {
          const updatedFinancial = successful[0].data;
          return {
            Id: updatedFinancial.Id,
            type: updatedFinancial.type_c || 'expense',
            category: updatedFinancial.category_c || '',
            amount: updatedFinancial.amount_c || 0,
            description: updatedFinancial.description_c || updatedFinancial.Name || '',
            date: updatedFinancial.date_c || null,
            cropId: updatedFinancial.crop_id_c?.Id || updatedFinancial.crop_id_c || null
          };
        }
      }
      
      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating financial:", error?.response?.data?.message || error);
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
        console.error("Failed to delete financial:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} financials:`, failed);
          const errorMessage = failed[0]?.message || "Failed to delete financial record";
          throw new Error(errorMessage);
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting financial:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const financialService = new FinancialService();