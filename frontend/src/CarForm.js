import React, { useState } from 'react';
import './CarForm.css';

function CarForm() {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
  });

  const [errors, setErrors] = useState(null);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/garage/cars/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData);
        throw new Error('Server responded with an error');
      }

      const result = await response.json();
      console.log('Successfully created car:', result);

      setFormData({
        make: '',
        model: '',
        year: '',
        price: '',
      });

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="car-form">
      <h3 className="car-form-title">Add a New Car</h3>

      <div className="car-form-group">
        <label className="car-form-label">Make:</label>
        <input
          type="text"
          name="make"
          value={formData.make}
          onChange={handleChange}
          className="car-form-input"
        />
        {errors && errors.make && <p className="car-form-error">{errors.make.join(' ')}</p>}
      </div>

      <div className="car-form-group">
        <label className="car-form-label">Model:</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          className="car-form-input"
        />
        {errors && errors.model && <p className="car-form-error">{errors.model.join(' ')}</p>}
      </div>

      <div className="car-form-group">
        <label className="car-form-label">Year:</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="car-form-input"
        />
        {errors && errors.year && <p className="car-form-error">{errors.year.join(' ')}</p>}
      </div>

      <div className="car-form-group">
        <label className="car-form-label">Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          className="car-form-input"
        />
        {errors && errors.price && <p className="car-form-error">{errors.price.join(' ')}</p>}
      </div>

      {errors && errors.non_field_errors && <p className="car-form-error">{errors.non_field_errors.join(' ')}</p>}

      <button type="submit" className="car-form-button">Submit</button>
    </form>
  );
}

export default CarForm;