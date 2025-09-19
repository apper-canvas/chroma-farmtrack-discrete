import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import { financialService } from "@/services/api/financialService";
import { cropService } from "@/services/api/cropService";

const FinancialForm = ({ financial, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    cropId: ""
  });

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCrops();
if (financial) {
      setFormData({
        type: financial.type || "expense",
        category: financial.category || "",
        amount: financial.amount || "",
        description: financial.description || "",
        date: financial.date ? (financial.date.includes("T") ? financial.date.split("T")[0] : financial.date) : "",
        cropId: financial.cropId ? String(financial.cropId) : ""
      });
    }
  }, [financial]);

  const loadCrops = async () => {
    try {
      const cropData = await cropService.getAll();
      setCrops(cropData);
    } catch (error) {
      console.error("Failed to load crops:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
const financialData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        cropId: formData.cropId ? parseInt(formData.cropId) : null
      };

      if (financial) {
        await financialService.update(financial.Id, financialData);
        toast.success("Financial record updated successfully!");
      } else {
        await financialService.create(financialData);
        toast.success("Financial record created successfully!");
      }
      
      onSave();
    } catch (error) {
      toast.error(error.message || "Failed to save financial record");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      ...(name === "type" && { category: "" }) // Reset category when type changes
    }));
  };

  const getCategories = () => {
    if (formData.type === "income") {
      return [
        { value: "sales", label: "Crop Sales" },
        { value: "grants", label: "Grants & Subsidies" },
        { value: "other", label: "Other Income" }
      ];
    } else {
      return [
        { value: "seeds", label: "Seeds & Plants" },
        { value: "fertilizer", label: "Fertilizer & Chemicals" },
        { value: "equipment", label: "Equipment & Tools" },
        { value: "fuel", label: "Fuel & Energy" },
        { value: "labor", label: "Labor Costs" },
        { value: "utilities", label: "Utilities" },
        { value: "other", label: "Other Expenses" }
      ];
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {financial ? "Edit Financial Record" : "Add Financial Record"}
        </h2>
        <p className="text-gray-600">
          {financial ? "Update financial information" : "Track your farm income and expenses"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {getCategories().map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Amount ($)"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />

          <Input
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of the transaction"
          required
        />

        <Select
          label="Related Crop"
          name="cropId"
          value={formData.cropId}
          onChange={handleChange}
          placeholder="Select a crop (optional)"
        >
{crops.map((crop) => (
            <option key={crop.Id} value={crop.Id}>
              {crop.name} - {crop.fieldLocation}
            </option>
          ))}
        </Select>

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
            {loading ? "Saving..." : financial ? "Update Record" : "Add Record"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FinancialForm;