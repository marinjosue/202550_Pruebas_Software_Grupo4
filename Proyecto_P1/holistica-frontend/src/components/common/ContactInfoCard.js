import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'primereact/card';

const ContactInfoCard = ({ 
  icon, 
  title, 
  content, 
  severity = 'info',
  onClick,
  className = ""
}) => {
  const severityClass = {
    success: 'icon-success',
    info: 'icon-info', 
    warning: 'icon-warning'
  }[severity];

  return (
    <Card 
      className={`contact-info-card card-elevated hover-lift ${className}`}
      onClick={onClick}
    >
      <div className="contact-info-content">
        <div className={`contact-info-icon icon-container ${severityClass}`}>
          <i className={icon}></i>
        </div>
        <div className="contact-info-text">
          <h4>{title}</h4>
          <p>{content}</p>
        </div>
      </div>
    </Card>
  );
};

ContactInfoCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['success', 'info', 'warning']),
  onClick: PropTypes.func,
  className: PropTypes.string
};

ContactInfoCard.defaultProps = {
  severity: 'info',
  onClick: null,
  className: ""
};

export default ContactInfoCard;
