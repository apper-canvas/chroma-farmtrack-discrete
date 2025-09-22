const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const farmService = {
  async getAll() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
{"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "farm_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "contact_email_c"}},
          {"field": {"Name": "farm_type_c"}},
          {"field": {"Name": "farm_size_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('farm_c', params);

      if (!response.success) {
        console.error('Failed to fetch farms:', response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching farms:', error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(farmId) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
{"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "farm_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "contact_email_c"}},
          {"field": {"Name": "farm_type_c"}},
          {"field": {"Name": "farm_size_c"}}
        ]
      };

      const response = await apperClient.getRecordById('farm_c', farmId, params);

      if (!response.success) {
        console.error(`Failed to fetch farm ${farmId}:`, response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching farm ${farmId}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(farmData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const payload = {
records: [{
          Name: farmData.Name,
          Tags: farmData.Tags,
          farm_name_c: farmData.farm_name_c,
          location_c: farmData.location_c,
          contact_email_c: farmData.contact_email_c,
          farm_type_c: farmData.farm_type_c,
          farm_size_c: farmData.farm_size_c ? parseFloat(farmData.farm_size_c) : null
        }]
      };

      const response = await apperClient.createRecord('farm_c', payload);

      if (!response.success) {
        console.error('Failed to create farm:', response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} farm records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                console.error(`Field ${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) {
              console.error('Record error:', record.message);
            }
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error('Error creating farm:', error?.response?.data?.message || error);
      return null;
    }
  },

  async update(farmId, farmData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const payload = {
        records: [{
          Id: farmId,
Name: farmData.Name,
          Tags: farmData.Tags,
          farm_name_c: farmData.farm_name_c,
          location_c: farmData.location_c,
          contact_email_c: farmData.contact_email_c,
          farm_type_c: farmData.farm_type_c,
          farm_size_c: farmData.farm_size_c ? parseFloat(farmData.farm_size_c) : null
        }]
      };

      const response = await apperClient.updateRecord('farm_c', payload);

      if (!response.success) {
        console.error('Failed to update farm:', response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} farm records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                console.error(`Field ${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) {
              console.error('Record error:', record.message);
            }
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error('Error updating farm:', error?.response?.data?.message || error);
      return false;
    }
  },

  async delete(farmId) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        RecordIds: [farmId]
      };

      const response = await apperClient.deleteRecord('farm_c', payload);

      if (!response.success) {
        console.error('Failed to delete farm:', response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} farm records:`, failed);
          failed.forEach(record => {
            if (record.message) {
              console.error('Delete error:', record.message);
            }
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error('Error deleting farm:', error?.response?.data?.message || error);
      return false;
    }
  }
};