import React, { useEffect, useState } from 'react';
import { Plus, Minus, Package } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import './AddOnsSelector.css';

const AddOnsSelector = ({ addOns, onSelectionChange, onTotalChange }) => {

  const [quantities, setQuantities] = useState({});

  useEffect(() => {

    function addInitialValue() {
      addOns.filter(addOn => addOn.active).map((addOn) => {

        setQuantities((prev) => {
          return {
            ...prev,
            [addOn._id]: 1
          }
        })


        onSelectionChange([{
          addOnId: addOn._id,
          quantity: 1,
          title: addOn.title,
          unitPrice: addOn.unitPrice,
          totalPrice: addOn.unitPrice
        }])

      })
    }

    addInitialValue();

  }, [])



  const handleQuantityChange = (addOnId, change) => {
    setQuantities(prev => {
      const current = prev[addOnId] || 0;
      const newQuantity = Math.max(0, current + change);
      const updated = { ...prev, [addOnId]: newQuantity };

      // Calculate selected add-ons
      const selected = addOns
        .filter(addOn => updated[addOn._id] > 0)
        .map(addOn => ({
          addOnId: addOn._id,
          quantity: updated[addOn._id],
          title: addOn.title,
          unitPrice: addOn.unitPrice,
          totalPrice: addOn.unitPrice * updated[addOn._id]
        }));

      // Notify parent
      if (onSelectionChange) {
        onSelectionChange(selected);
      }

      return updated;
    });
  };

  const getTotal = () => {
    return addOns.reduce((sum, addOn) => {
      const qty = quantities[addOn._id] || 0;
      return sum + (addOn.unitPrice * qty);
    }, 0);
  };

  // Notify parent of total change whenever quantities change
  useEffect(() => {
    const total = addOns.reduce((sum, addOn) => {
      const qty = quantities[addOn._id] || 0;
      return sum + (addOn.unitPrice * qty);
    }, 0);
    if (onTotalChange) {
      onTotalChange(total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantities, addOns]);

  const hasSelection = Object.values(quantities).some(qty => qty > 0);

  if (!addOns || addOns.length === 0) {
    return null;
  }



  return (
    <div className="premium-addons-selector">
      <div className="premium-addons-grid">
        {addOns.filter(addOn => addOn.active).map((addOn) => {
          const quantity = quantities[addOn._id] || 0;
          const totalPrice = addOn.unitPrice * quantity;

          return (
            <Card key={addOn._id} className="premium-addon-card">
              <CardContent className="premium-addon-content">
                <div className="premium-addon-layout">
                  {/* Image Section */}
                  <div className="premium-addon-image-wrapper">
                    {addOn.image ? (
                      <img
                        src={addOn.image}
                        alt={addOn.title}
                        className="premium-addon-image"
                      />
                    ) : (
                      <div className="premium-addon-image-placeholder">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="premium-addon-details">
                    <div className="premium-addon-header">
                      <h4 className="premium-addon-title">{addOn.title}</h4>
                      {addOn.description && (
                        <p className="premium-addon-description">
                          {addOn.description}
                        </p>
                      )}
                    </div>

                    <div className="premium-addon-footer">
                      {/* Unit Price */}
                      <div className="premium-addon-unit-price">
                        <span className="premium-unit-price-label">₹{addOn.unitPrice.toLocaleString('en-IN')}</span>
                        <span className="premium-unit-price-text">per unit</span>
                      </div>

                      {/* Quantity Selector & Total */}
                      <div className="premium-addon-controls">
                        {/* Quantity Selector */}
                        <div className="premium-quantity-selector">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(addOn._id, -1)}
                            disabled={quantity === 0}
                            className="premium-quantity-btn premium-quantity-btn-minus"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="premium-quantity-value">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(addOn._id, 1)}
                            className="premium-quantity-btn premium-quantity-btn-plus"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Total Price */}
                        <div className="premium-addon-total">
                          <span className="premium-total-price">₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {hasSelection && (
        <Card className="premium-addons-summary-card">
          <CardContent className="premium-addons-summary-content">
            <div className="premium-addons-summary">
              <span className="premium-summary-label">Total Add-ons:</span>
              <span className="premium-summary-amount">₹{getTotal().toLocaleString('en-IN')}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddOnsSelector;

