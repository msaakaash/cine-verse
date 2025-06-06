import React from 'react';

const MovieCard = ({movie:{Title,Poster,Year,Language}}) => {
    return ( 
        <div className='movie-card'>
          <img
        src={Poster !== 'N/A' ? Poster : './placeholder.png'}
        alt={Title}
      />
      <div className='mt-4'>
        <h3>{Title}</h3>
        <div className='content'>
            <div className='rating'>
                <img src="star.svg" alt="Star icon"/>
            </div>
            <span></span>
            <p className='lang'>{Language}</p>
            <span></span>
            <p className='year'>{Year}</p>
        </div>
      </div>
        </div>
     );
}

export default MovieCard;

