import React, { useState } from 'react';
import { X } from 'lucide-react';

const EventForm = ({ event, onClose, onSubmit, isDraft }) => {
  const [formData, setFormData] = useState(event || {
    title: '',
    type: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    participants: '',
    program: '',
    account: '',
    description: '',
    mainMember: '',
    financeManager: '',
    managementRep: '',
    ceoApprover: '',
    totalBudget: '',
    venueBudget: '',
    foodBudget: '',
    marketingBudget: '',
    equipmentBudget: '',
    miscBudget: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, status: isDraft ? 'draft' : 'active' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Add New Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Basic Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Event Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Event Type</option>
                  <option>Fundraiser</option>
                  <option>Plantation Drive</option>
                  <option>Education Camp</option>
                  <option>Awareness Drive</option>
                  <option>Health Camp</option>
                  <option>Community Event</option>
                  <option>Training Workshop</option>
                  <option>Blood Donation Camp</option>
                  <option>Skill Development Program</option>
                  <option>Women Empowerment Workshop</option>
                  <option>Environmental Cleanup</option>
                  <option>Food Distribution</option>
                  <option>Medical Camp</option>
                  <option>Cultural Program</option>
                  <option>Sports Event</option>
                  <option>Seminar/Conference</option>
                  <option>Charity Run/Walk</option>
                  <option>Art & Craft Workshop</option>
                  <option>Digital Literacy Program</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time *</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Venue/Location *</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expected Participants *</label>
                <input
                  type="number"
                  name="participants"
                  value={formData.participants}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Linked Program/Project *</label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Program</option>
                  <option>Education Initiative</option>
                  <option>Environmental Conservation</option>
                  <option>Healthcare Support</option>
                  <option>Community Development</option>
                  <option>Women Empowerment</option>
                  <option>Skill Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Responsible Account *</label>
                <select
                  name="account"
                  value={formData.account}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Account</option>
                  <option>SBI Main Account - 1234567890</option>
                  <option>HDFC Events Account - 0987654321</option>
                  <option>Cash Account - Petty Cash</option>
                  <option>ICICI Donation Account - 5678901234</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Description/Objective *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Team & Roles Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Main Member (Event In-charge) *</label>
                <input
                  type="text"
                  name="mainMember"
                  value={formData.mainMember}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Finance Manager *</label>
                <input
                  type="text"
                  name="financeManager"
                  value={formData.financeManager}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Management Representative *</label>
                <input
                  type="text"
                  name="managementRep"
                  value={formData.managementRep}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CEO/Approver *</label>
                <input
                  type="text"
                  name="ceoApprover"
                  value={formData.ceoApprover}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Budget Planning</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Total Budget (₹) *</label>
                <input
                  type="number"
                  name="totalBudget"
                  value={formData.totalBudget}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Venue Budget (₹)</label>
                <input
                  type="number"
                  name="venueBudget"
                  value={formData.venueBudget}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Food Budget (₹)</label>
                <input
                  type="number"
                  name="foodBudget"
                  value={formData.foodBudget}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Marketing Budget (₹)</label>
                <input
                  type="number"
                  name="marketingBudget"
                  value={formData.marketingBudget}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Equipment Budget (₹)</label>
                <input
                  type="number"
                  name="equipmentBudget"
                  value={formData.equipmentBudget}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Miscellaneous Budget (₹)</label>
                <input
                  type="number"
                  name="miscBudget"
                  value={formData.miscBudget}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            {!event && (
              <button
                type="button"
                onClick={() => onSubmit({ ...formData, status: 'draft' })}
                className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold"
              >
                Save as Draft
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
            >
              {event ? 'Update Event' : 'Create & Activate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;



