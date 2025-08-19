import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({ 
  label, 
  required = false, 
  error = null, 
  children, 
  className = "" 
}) => {
  return (
    <div className={`form-field ${className}`}>
      <label className="form-label">
        {label}
        {required && <span className="required"> *</span>}
      </label>
      {children}
      {error && <small className="p-error">{error}</small>}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

FormField.defaultProps = {
  required: false,
  error: null,
  className: ""
};

export default FormField;
export { FormField };

export const FormRow = ({ children, className = 'form-row' }) => (
  <div className={className}>
    {children}
  </div>
);

FormRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

FormRow.defaultProps = {
  className: 'form-row'
};
