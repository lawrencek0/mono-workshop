import * as React from 'react';
import styled from '../theme';
import { TMDB_IMG_BASE_URL, TMDB_IMG_FILE_SIZE } from '../constants';
import { Movie } from '../redux/movies/reducer';

class MovieItem extends React.Component<Movie> {
  render() {
    const imgUrl = `${TMDB_IMG_BASE_URL}/${TMDB_IMG_FILE_SIZE}/${
      this.props.poster_path
    }`;

    const {
      title,
      className,
      release_date: releaseDate,
      vote_average: voteAverage
    } = this.props;
    const year = releaseDate.substring(0, 4);

    return (
      <li className={className}>
        <img src={imgUrl} alt="" />
        <div className="movie-description">
          <h2>{title}</h2>
          <div className="movie-details">
            <div className="movie-year">
              <span className="title">Year</span>
              <span>{year}</span>
            </div>
            <div className="movie-rating">
              <span className="title">Rating</span>
              <span>{voteAverage}</span>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

// @TODO: GRIDIFY ME!!
// @FIXME: UGLY AF!!
const StyledMovieItem = styled(MovieItem)`
  flex-basis: 22%;
  display: flex;
  flex-direction: column;
  margin: 1.5%;
  border: 1px solid #eee;

  img {
    width: 100%;
  }

  .movie-description {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
    padding: 0 0.875rem;

    h2 {
      font-family: 'Amatic SC', cursive;
      font-weight: 700;
      font-size: 2rem;
      margin: 0.4rem 0;
    }

    .movie-details {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;

      .title {
        color: #444;
      }
      .movie-year,
      .movie-rating {
        display: flex;
        flex-direction: column;
      }

      .movie-rating {
        align-items: flex-end;
      }
    }
  }
`;

export default StyledMovieItem;
