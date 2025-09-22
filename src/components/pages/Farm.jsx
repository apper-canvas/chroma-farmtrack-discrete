import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FarmCard from '@/components/molecules/FarmCard';
import FarmForm from '@/components/organisms/FarmForm';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { farmService } from '@/services/api/farmService';

const Farm = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await farmService.getAll();
      if (!result || result.length === 0) {
        setFarms([]);
      } else {
        setFarms(result);
      }
    } catch (err) {
      console.error('Error fetching farms:', err?.response?.data?.message || err);
      setError('Failed to load farms. Please try again.');
      setFarms([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.farm_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farm.location_c?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filterLocation === 'all' || 
                          farm.location_c?.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const uniqueLocations = [...new Set(farms.map(farm => farm.location_c).filter(Boolean))];

  const handleAddFarm = () => {
    setEditingFarm(null);
    setShowForm(true);
  };

  const handleEditFarm = (farm) => {
    setEditingFarm(farm);
    setShowForm(true);
  };

  const handleDeleteFarm = async (farmId) => {
    if (!window.confirm('Are you sure you want to delete this farm? This action cannot be undone.')) {
      return;
    }

    try {
      const success = await farmService.delete(farmId);
      if (success) {
        toast.success('Farm deleted successfully');
        loadFarms();
      } else {
        toast.error('Failed to delete farm');
      }
    } catch (err) {
      console.error('Error deleting farm:', err?.response?.data?.message || err);
      toast.error('Failed to delete farm. Please try again.');
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingFarm(null);
    loadFarms();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFarm(null);
  };

  if (loading) {
    return <Loading message="Loading farms..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadFarms} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Farm Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and track all your farms in one place
          </p>
        </div>
        <Button onClick={handleAddFarm} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={20} />
          Add Farm
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search farms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
              <ApperIcon name="Home" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{farms.length}</p>
              <p className="text-gray-600">Total Farms</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-600 mr-4">
              <ApperIcon name="MapPin" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{uniqueLocations.length}</p>
              <p className="text-gray-600">Locations</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mr-4">
              <ApperIcon name="Filter" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredFarms.length}</p>
              <p className="text-gray-600">Filtered Results</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Farm List */}
      {filteredFarms.length === 0 ? (
        <Empty
          title="No farms found"
          message={searchTerm || filterLocation !== 'all' 
            ? "Try adjusting your search or filter criteria"
            : "Get started by adding your first farm"
          }
          action={
            <Button onClick={handleAddFarm}>
              <ApperIcon name="Plus" size={20} />
              Add Farm
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
            <FarmCard
              key={farm.Id}
              farm={farm}
              onEdit={() => handleEditFarm(farm)}
              onDelete={() => handleDeleteFarm(farm.Id)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <FarmForm
          farm={editingFarm}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Farm;