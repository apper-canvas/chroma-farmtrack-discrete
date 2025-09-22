import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { farmService } from '@/services/api/farmService';

const FarmForm = ({ farm, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    Name: '',
    farm_name_c: '',
    location_c: '',
    contact_email_c: '',
    farm_type_c: '',
    farm_size_c: '',
    Tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (farm) {
      setFormData({
Name: farm.Name || '',
        farm_name_c: farm.farm_name_c || '',
        location_c: farm.location_c || '',
        contact_email_c: farm.contact_email_c || '',
        farm_type_c: farm.farm_type_c || '',
        farm_size_c: farm.farm_size_c || '',
        Tags: farm.Tags || ''
      });
    }
  }, [farm]);

  const validateForm = () => {
    const newErrors = {};
if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
    }

    if (!formData.farm_name_c.trim()) {
      newErrors.farm_name_c = 'Farm name is required';
    }

    if (!formData.location_c.trim()) {
      newErrors.location_c = 'Location is required';
    }

    if (!formData.farm_type_c.trim()) {
      newErrors.farm_type_c = 'Farm type is required';
    }

    if (formData.farm_size_c && (isNaN(formData.farm_size_c) || parseFloat(formData.farm_size_c) <= 0)) {
      newErrors.farm_size_c = 'Please enter a valid farm size';
    }

    if (formData.contact_email_c && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email_c)) {
      newErrors.contact_email_c = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      if (farm) {
        // Update existing farm
        const success = await farmService.update(farm.Id, formData);
        if (success) {
          toast.success('Farm updated successfully');
          onSave();
        } else {
          toast.error('Failed to update farm');
        }
      } else {
        // Create new farm
        const result = await farmService.create(formData);
        if (result) {
          toast.success('Farm created successfully');
          onSave();
        } else {
          toast.error('Failed to create farm');
        }
      }
    } catch (error) {
      console.error('Error saving farm:', error?.response?.data?.message || error);
      toast.error('Failed to save farm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {farm ? 'Edit Farm' : 'Add New Farm'}
            </h2>
          </div>

          <div className="p-6 space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Name"
                  value={formData.Name}
                  onChange={(e) => handleInputChange('Name', e.target.value)}
                  error={errors.Name}
                  required
                />
              </div>
              <div>
                <Input
                  label="Farm Name"
                  value={formData.farm_name_c}
                  onChange={(e) => handleInputChange('farm_name_c', e.target.value)}
                  error={errors.farm_name_c}
                  required
                />
              </div>
              <div>
                <Input
                  label="Farm Type"
                  value={formData.farm_type_c}
                  onChange={(e) => handleInputChange('farm_type_c', e.target.value)}
                  error={errors.farm_type_c}
                  required
                />
              </div>
              <div>
                <Input
                  label="Farm Size"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.farm_size_c}
                  onChange={(e) => handleInputChange('farm_size_c', e.target.value)}
                  error={errors.farm_size_c}
                />
              </div>
            </div>

            <div>
              <Input
                label="Location"
                value={formData.location_c}
                onChange={(e) => handleInputChange('location_c', e.target.value)}
                error={errors.location_c}
                required
              />
            </div>

            <div>
              <Input
                label="Contact Email"
                type="email"
                value={formData.contact_email_c}
                onChange={(e) => handleInputChange('contact_email_c', e.target.value)}
                error={errors.contact_email_c}
              />
            </div>

            <div>
              <Input
                label="Tags"
                value={formData.Tags}
                onChange={(e) => handleInputChange('Tags', e.target.value)}
                placeholder="Enter tags separated by commas"
                helpText="Separate multiple tags with commas"
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  {farm ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} />
                  {farm ? 'Update Farm' : 'Create Farm'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default FarmForm;