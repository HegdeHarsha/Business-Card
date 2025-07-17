
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '../contexts/EmployeeContext';
import { Employee } from '../types';

const CardForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployeeById, addEmployee, updateEmployee } = useEmployees();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    title: '',
    companyName: '',
    phone: '',
    email: '',
    website: '',
    photoUrl: '',
    logoUrl: '',
  });

  useEffect(() => {
    if (isEditing && id) {
      const employee = getEmployeeById(id);
      if (employee) {
        setFormData(employee);
      }
    }
  }, [id, isEditing, getEmployeeById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && id) {
      updateEmployee({ ...formData, id });
    } else {
      addEmployee(formData);
    }
    navigate('/');
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary";

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">{isEditing ? 'Edit Employee Card' : 'Create New Employee Card'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title / Position</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
            <input type="text" name="website" id="website" value={formData.website} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">Photo URL</label>
            <input type="url" name="photoUrl" id="photoUrl" value={formData.photoUrl} onChange={handleChange} className={inputClass} placeholder="https://picsum.photos/400" />
          </div>
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Company Logo URL</label>
            <input type="url" name="logoUrl" id="logoUrl" value={formData.logoUrl} onChange={handleChange} className={inputClass} placeholder="https://picsum.photos/200" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={() => navigate('/')} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">{isEditing ? 'Save Changes' : 'Create Card'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardForm;
