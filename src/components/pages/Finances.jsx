import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FinancialItem from "@/components/molecules/FinancialItem";
import FinancialForm from "@/components/organisms/FinancialForm";
import StatsCard from "@/components/molecules/StatsCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { financialService } from "@/services/api/financialService";

const Finances = () => {
  const [financials, setFinancials] = useState([]);
  const [filteredFinancials, setFilteredFinancials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFinancial, setEditingFinancial] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    loadFinancials();
  }, []);

  useEffect(() => {
    filterAndSortFinancials();
  }, [financials, searchTerm, typeFilter, categoryFilter, sortBy]);

  const loadFinancials = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await financialService.getAll();
      setFinancials(data);
    } catch (error) {
      setError(error.message || "Failed to load financial records");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortFinancials = () => {
    let filtered = [...financials];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(financial =>
        financial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        financial.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(financial => financial.type === typeFilter);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(financial => financial.category === categoryFilter);
    }

    // Sort financials
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date) - new Date(a.date);
        case "amount":
          return parseFloat(b.amount) - parseFloat(a.amount);
        case "description":
          return a.description.localeCompare(b.description);
        default:
          return 0;
      }
    });

    setFilteredFinancials(filtered);
  };

  const handleAddFinancial = () => {
    setEditingFinancial(null);
    setShowForm(true);
  };

  const handleEditFinancial = (financial) => {
    setEditingFinancial(financial);
    setShowForm(true);
  };

  const handleDeleteFinancial = async (financialId) => {
    if (window.confirm("Are you sure you want to delete this financial record?")) {
      try {
        await financialService.delete(financialId);
        toast.success("Financial record deleted successfully!");
        loadFinancials();
      } catch (error) {
        toast.error("Failed to delete financial record");
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingFinancial(null);
    loadFinancials();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFinancial(null);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {editingFinancial ? "Edit Financial Record" : "Add Financial Record"}
            </h1>
            <p className="text-gray-600 mt-2">
              {editingFinancial ? "Update financial information" : "Track your farm income and expenses"}
            </p>
          </div>
        </div>
        <FinancialForm
          financial={editingFinancial}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadFinancials} />;

  // Calculate stats
  const totalIncome = financials
    .filter(f => f.type === "income")
    .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
  
  const totalExpenses = financials
    .filter(f => f.type === "expense")
    .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);

  const netIncome = totalIncome - totalExpenses;
  const totalTransactions = financials.length;

  // Get all categories for filter
  const allCategories = [...new Set(financials.map(f => f.category))].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Financial Management
          </h1>
          <p className="text-gray-600 mt-2">
            Track your farm income and expenses
          </p>
        </div>
        <div className="flex items-center space-x-3">
<Button
            onClick={() => {
              setEditingFinancial(null);
              setShowForm(true);
            }}
            icon="TrendingDown"
            variant="outline"
          >
            Add Expense
          </Button>
          <Button
            onClick={() => {
              setEditingFinancial(null);
              setShowForm(true);
            }}
            icon="TrendingUp"
            variant="primary"
          >
            Add Income
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString()}`}
          icon="TrendingUp"
          color="success"
          trend="up"
          trendValue="All time"
        />
        <StatsCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon="TrendingDown"
          color="warning"
          trend="down"
          trendValue="All time"
        />
        <StatsCard
          title="Net Income"
          value={`$${netIncome.toLocaleString()}`}
          icon="DollarSign"
          color={netIncome >= 0 ? "success" : "warning"}
          trend={netIncome >= 0 ? "up" : "down"}
          trendValue={netIncome >= 0 ? "Profit" : "Loss"}
        />
        <StatsCard
          title="Transactions"
          value={totalTransactions}
          icon="Receipt"
          color="info"
          trendValue="Total records"
        />
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="description">Sort by Description</option>
          </Select>
        </div>
      </Card>

      {/* Financial Records List */}
      {filteredFinancials.length > 0 ? (
        <div className="space-y-4">
          {filteredFinancials.map((financial) => (
            <FinancialItem
              key={financial.Id}
              financial={financial}
              onEdit={handleEditFinancial}
              onDelete={handleDeleteFinancial}
            />
          ))}
        </div>
      ) : financials.length === 0 ? (
        <Empty
          title="No financial records found"
          description="Start tracking your farm finances by adding your first income or expense"
          icon="DollarSign"
          actionLabel="Add First Record"
          onAction={handleAddFinancial}
        />
      ) : (
        <Card className="text-center py-12">
          <ApperIcon name="Search" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No records match your filters</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("all");
              setCategoryFilter("all");
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Finances;