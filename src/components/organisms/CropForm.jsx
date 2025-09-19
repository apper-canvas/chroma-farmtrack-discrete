import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import { cropService } from "@/services/api/cropService";

const CropForm = ({ crop, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    plantingDate: "",
    expectedHarvest: "",
    fieldLocation: "",
    quantity: "",
    status: "planted",
    notes: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
if (crop) {
      setFormData({
        name: crop.name || "",
        variety: crop.variety || "",
        plantingDate: crop.plantingDate ? crop.plantingDate.split("T")[0] : "",
        expectedHarvest: crop.expectedHarvest ? crop.expectedHarvest.split("T")[0] : "",
        fieldLocation: crop.fieldLocation || "",
        quantity: crop.quantity || "",
        status: crop.status || "planted",
        notes: crop.notes || ""
      });
    }
  }, [crop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cropData = {
        ...formData,
        quantity: parseFloat(formData.quantity) || 0
      };

      if (crop) {
        await cropService.update(crop.Id, cropData);
        toast.success("Crop updated successfully!");
      } else {
        await cropService.create(cropData);
        toast.success("Crop created successfully!");
      }
      
      onSave();
    } catch (error) {
      toast.error(error.message || "Failed to save crop");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {crop ? "Edit Crop" : "Add New Crop"}
        </h2>
        <p className="text-gray-600">
          {crop ? "Update crop information" : "Enter details for your new crop"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Crop Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Corn, Wheat, Tomatoes"
            required
          />

          <Input
            label="Variety"
            name="variety"
            value={formData.variety}
            onChange={handleChange}
            placeholder="e.g., Sweet Corn, Winter Wheat"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Planting Date"
            name="plantingDate"
            type="date"
            value={formData.plantingDate}
            onChange={handleChange}
            required
          />

          <Input
            label="Expected Harvest Date"
            name="expectedHarvest"
            type="date"
            value={formData.expectedHarvest}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Field Location"
            name="fieldLocation"
            value={formData.fieldLocation}
            onChange={handleChange}
            placeholder="e.g., North Field, Plot A"
            required
          />

          <Input
            label="Quantity (acres)"
            name="quantity"
            type="number"
            step="0.1"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g., 10.5"
            required
          />
        </div>

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="planted">Planted</option>
          <option value="growing">Growing</option>
          <option value="ready">Ready</option>
          <option value="harvested">Harvested</option>
        </Select>

        <Textarea
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this crop..."
          rows={4}
        />

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
            {loading ? "Saving..." : crop ? "Update Crop" : "Add Crop"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CropForm;