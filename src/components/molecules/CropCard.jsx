import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format, differenceInDays } from "date-fns";

const CropCard = ({ crop, onEdit, onDelete }) => {
  const getStatusVariant = (status) => {
    switch(status?.toLowerCase()) {
      case "planted": return "info";
      case "growing": return "success";
      case "ready": return "warning";
      case "harvested": return "default";
      default: return "default";
    }
  };

  const getCropIcon = (cropName) => {
    const iconMap = {
      "corn": "Wheat",
      "wheat": "Wheat", 
      "tomato": "Apple",
      "potato": "Apple",
      "carrot": "Carrot",
      "lettuce": "Leaf",
      "beans": "Sprout"
    };
    return iconMap[cropName?.toLowerCase()] || "Sprout";
  };

  const daysUntilHarvest = differenceInDays(new Date(crop.expectedHarvest), new Date());
  const isReadyForHarvest = daysUntilHarvest <= 0;

  return (
    <Card className={`relative overflow-hidden ${isReadyForHarvest ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-md">
            <ApperIcon name={getCropIcon(crop.name)} className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{crop.name}</h3>
            {crop.variety && (
              <p className="text-sm text-gray-600">{crop.variety}</p>
            )}
          </div>
        </div>
        
        <Badge variant={getStatusVariant(crop.status)} size="sm">
          {crop.status}
        </Badge>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <ApperIcon name="MapPin" className="h-4 w-4" />
            <span>Field Location</span>
          </span>
<span className="font-medium text-gray-900">{crop.fieldLocation}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <ApperIcon name="Package" className="h-4 w-4" />
            <span>Quantity</span>
          </span>
          <span className="font-medium text-gray-900">{crop.quantity} acres</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <ApperIcon name="Calendar" className="h-4 w-4" />
            <span>Planted</span>
          </span>
          <span className="font-medium text-gray-900">
            {format(new Date(crop.plantingDate), "MMM dd, yyyy")}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <ApperIcon name="Target" className="h-4 w-4" />
            <span>Expected Harvest</span>
          </span>
          <span className={`font-medium ${isReadyForHarvest ? 'text-yellow-600' : 'text-gray-900'}`}>
            {format(new Date(crop.expectedHarvest), "MMM dd, yyyy")}
          </span>
        </div>
        
        {daysUntilHarvest > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Days to harvest</span>
            <span className="font-medium text-blue-600">{daysUntilHarvest} days</span>
          </div>
        )}
        
        {isReadyForHarvest && (
          <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <ApperIcon name="Clock" className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Ready for harvest!</span>
          </div>
        )}
      </div>
      
      {crop.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed">{crop.notes}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(crop)}
          icon="Edit"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(crop.Id)}
          icon="Trash2"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default CropCard;