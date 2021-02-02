import React from 'react';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import PropTypes from 'prop-types';

const Rating = ({ value, text }) => {
  const arr = [];

  for (let i = 0; i < 5; i++) {
    arr.push(
      <span key={i + 1}>
        {value >= i + 1 ? (
          <StarIcon fontSize="small" style={{ color: '#ffd600' }} />
        ) : value >= i + 0.5 ? (
          <StarHalfIcon fontSize="small" style={{ color: '#ffd600' }} />
        ) : (
          <StarBorderIcon fontSize="small" style={{ color: '#ffd600' }} />
        )}
      </span>
    );
  }

  return (
    <div className="rating">
      {arr}
      <span className="align-middle"> {text && text}</span>
      {/* double ampersand is equivalent to the following: text ? text : '' */}
    </div>
  );
};

// This allows us to type check our props
Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default Rating;
