// Weather service using ApperClient for database operations

class WeatherService {
  constructor() {
    this.tableName = 'weather_c';
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

  async getForecast() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch weather:", response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to UI expected format
      const weather = (response.data || []).map(w => {
        // Parse temperature string if it's in format "high,low" or JSON
        let temperature = { high: 75, low: 60 }; // defaults
        if (w.temperature_c) {
          try {
            if (w.temperature_c.includes(',')) {
              const [high, low] = w.temperature_c.split(',');
              temperature = { high: parseInt(high), low: parseInt(low) };
            } else if (w.temperature_c.includes('{')) {
              temperature = JSON.parse(w.temperature_c);
            } else {
              const temp = parseInt(w.temperature_c);
              temperature = { high: temp + 5, low: temp - 5 };
            }
          } catch (e) {
            console.warn("Error parsing temperature:", w.temperature_c);
          }
        }
        
        return {
          Id: w.Id,
          date: w.date_c || null,
          temperature: temperature,
          condition: w.condition_c || 'sunny',
          humidity: w.humidity_c || 50,
          precipitation: w.precipitation_c || 10
        };
      });
      
      return weather;
    } catch (error) {
      console.error("Error fetching weather:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getCurrentWeather() {
    try {
      const forecast = await this.getForecast();
      if (forecast.length > 0) {
        // Return the first weather record as current
        return forecast[0];
      }
      
      // Return default weather if no records
      return {
        Id: 0,
        date: new Date().toISOString().split('T')[0],
        temperature: { high: 75, low: 60 },
        condition: 'sunny',
        humidity: 50,
        precipitation: 10
      };
    } catch (error) {
      console.error("Error fetching current weather:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getWeatherByDate(date) {
    try {
      const client = this.getApperClient();
      const targetDate = new Date(date).toISOString().split('T')[0];
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        where: [
          {"FieldName": "date_c", "Operator": "EqualTo", "Values": [targetDate]}
        ]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch weather by date:", response.message);
        throw new Error(response.message);
      }
      
      if (!response.data || response.data.length === 0) {
        throw new Error("Weather data not found for this date");
      }
      
      const w = response.data[0];
      
      // Parse temperature string
      let temperature = { high: 75, low: 60 }; // defaults
      if (w.temperature_c) {
        try {
          if (w.temperature_c.includes(',')) {
            const [high, low] = w.temperature_c.split(',');
            temperature = { high: parseInt(high), low: parseInt(low) };
          } else if (w.temperature_c.includes('{')) {
            temperature = JSON.parse(w.temperature_c);
          } else {
            const temp = parseInt(w.temperature_c);
            temperature = { high: temp + 5, low: temp - 5 };
          }
        } catch (e) {
          console.warn("Error parsing temperature:", w.temperature_c);
        }
      }
      
      return {
        Id: w.Id,
        date: w.date_c || null,
        temperature: temperature,
        condition: w.condition_c || 'sunny',
        humidity: w.humidity_c || 50,
        precipitation: w.precipitation_c || 10
      };
    } catch (error) {
      console.error(`Error fetching weather for date ${date}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();