import React from 'react';
import './HelpPage.css';
import Header from './Header';

const HelpPage = () => {
    return (
        <div className="help-page-wrapper"> {/* <-- Changed from help-container to wrapper */}
            <Header /> 
            
            <div className="help-container">
            <h1>❓ Welcome to the Help Center</h1>
            <p className="intro">
                Find answers to common questions about managing your car inventory.
            </p>

            <hr/>
            
            <section>
                <h2>1. How to Add a New Car</h2>
                <p>
                    Navigate to the <strong>Car Form</strong> page. Fill out the fields for Make, Model, Year, and Price. Click the <strong>"Submit"</strong> button to add the car to your inventory.
                </p>
                <ul>
                    <li><strong>Make:</strong> The brand of the vehicle (e.g., Ford, Toyota).</li>
                    <li><strong>Model:</strong> The specific model (e.g., Mustang, Camry).</li>
                    <li><strong>Price:</strong> Enter the price without currency symbols.</li>
                </ul>
            </section>

            <hr/>
            
            <section>
                <h2>2. Viewing the Car List</h2>
                <p>
                    The main list displays all cars in the database. It is paginated to show <strong>10 cars per page</strong>. Use the <strong>Previous</strong> and <strong>Next</strong> buttons at the bottom to navigate.
                </p>
                <p>
                    To search for a car, click on the search box and enter keywords such as <strong>"2025"</strong> or <strong>"Toyota"</strong>. The list will update in real-time as you type.
                </p>

            </section>

            <hr/>
            
            <section>
                <h2>3. Weather Report</h2>
                <p>
                    The weather API will use your current location to automatically display weather results for the upcoming week to assist you in planning garage activities or repairs.
                </p>
            </section>

    
        </div>
        </div>
    );
};

export default HelpPage;