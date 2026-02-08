// pages/admin/Departments.jsx
import { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminAPI } from '../../services/adminAPI';
import Loading from '../../components/common/Loading';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    complaintTypes: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDepartments();
      setDepartments(data.departments || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        description: dept.description || '',
        complaintTypes: dept.complaintTypes.join(', ')
      });
    } else {
      setEditingDept(null);
      setFormData({ name: '', description: '', complaintTypes: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDept(null);
    setFormData({ name: '', description: '', complaintTypes: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        complaintTypes: formData.complaintTypes.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingDept) {
        await adminAPI.updateDepartment(editingDept.id, payload);
      } else {
        await adminAPI.createDepartment(payload);
      }

      await fetchDepartments();
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save department');
    }
  };

  const handleToggleStatus = async (dept) => {
    if (!confirm(`Are you sure you want to ${dept.isActive ? 'deactivate' : 'activate'} this department?`)) {
      return;
    }

    try {
      await adminAPI.updateDepartment(dept.id, { isActive: !dept.isActive });
      await fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update department status');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
              <p className="text-gray-600 mt-2">Manage complaint departments</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Department</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className={`bg-white rounded-lg shadow-md p-6 ${
                  !dept.isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      dept.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {dept.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleOpenModal(dept)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>

                {/* Department Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{dept.description}</p>

                {/* Complaint Types */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">COMPLAINT TYPES</p>
                  <div className="flex flex-wrap gap-2">
                    {dept.complaintTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{dept.officerCount}</p>
                    <p className="text-xs text-gray-600">Officers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{dept.complaintCount}</p>
                    <p className="text-xs text-gray-600">Complaints</p>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleToggleStatus(dept)}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    dept.isActive
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {dept.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>

          {departments.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No departments found</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingDept ? 'Edit Department' : 'Add Department'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Sanitation Department"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Brief description of department responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Types * (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.complaintTypes}
                  onChange={(e) => setFormData({ ...formData, complaintTypes: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Garbage, Waste Management"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple types with commas
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {editingDept ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
