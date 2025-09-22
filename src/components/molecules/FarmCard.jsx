import React from 'react';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const FarmCard = ({ farm, onEdit, onDelete }) => {
  const tags = farm.Tags ? farm.Tags.split(',').filter(tag => tag.trim()) : [];

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
            <ApperIcon name="Home" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {farm.farm_name_c || farm.Name || 'Unnamed Farm'}
            </h3>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <ApperIcon name="MapPin" size={14} className="mr-1" />
              {farm.location_c || 'Location not specified'}
            </p>
          </div>
        </div>
      </div>

      {farm.contact_email_c && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 flex items-center">
            <ApperIcon name="Mail" size={14} className="mr-2" />
            {farm.contact_email_c}
          </p>
        </div>
      )}

      {tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
          <ApperIcon name="Edit" size={16} />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700 hover:border-red-200">
          <ApperIcon name="Trash2" size={16} />
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default FarmCard;