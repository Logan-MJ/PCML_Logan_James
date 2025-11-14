import React, { useState } from 'react';

function CarForm() {
  // Initial state matches the Car model fields (except id)
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
  });

  const [errors, setErrors] = useState(null);

  // This handler is generic and works for all inputs
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
      // POST to your new 'api/cars/' endpoint
      const response = await fetch('http://127.0.0.1:8000/garage/api/cars/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add CSRF token header if needed
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData); // Set validation errors from Django
        throw new Error('Server responded with an error');
      }

      const result = await response.json();
      console.log('Successfully created car:', result);

      // Clear the form on success
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
    <form onSubmit={handleSubmit}>
      <h3>Add a New Car</h3>

      <div>
        <label>Make:</label>
        <input
          type="text"
          name="make"
          value={formData.make}
          onChange={handleChange}
        />
        {/* Display validation error for 'make' from DRF */}
        {errors && errors.make && <p style={{ color: 'red' }}>{errors.make.join(' ')}</p>}
      </div>

      <div>
        <label>Model:</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
        />
        {errors && errors.model && <p style={{ color: 'red' }}>{errors.model.join(' ')}</p>}
      </div>

      <div>
        <label>Year:</label>
        <input
          type="number" // Use type="number" for IntegerField
          name="year"
          value={formData.year}
          onChange={handleChange}
        />
        {errors && errors.year && <p style={{ color: 'red' }}>{errors.year.join(' ')}</p>}
      </div>

      <div>
        <label>Price:</label>
        <input
          type="number" // Use type="number" for DecimalField
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01" // Good practice for decimal fields
        />
        {errors && errors.price && <p style={{ color: 'red' }}>{errors.price.join(' ')}</p>}
      </div>

      {/* Display non-field errors (e.g., global validation) */}
      {errors && errors.non_field_errors && <p style={{ color: 'red' }}>{errors.non_field_errors.join(' ')}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}

export default CarForm;