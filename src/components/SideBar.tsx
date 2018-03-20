import * as React from 'react';
import styled from '../theme';
import { Genre } from '../redux/genres';
import Selection from './Selection';
import Slider from './Slider';

export type SliderLabel = 'year' | 'rating' | 'runtime';

export interface RangeData {
  min: number;
  max: number;
}

export interface SliderData {
  label: SliderLabel;
  min: number;
  max: number;
  step: number;
  value: RangeData;
}
interface SideBarProps {
  genres: Genre[];
  selectedGenre: string;
  year: SliderData;
  rating: SliderData;
  runtime: SliderData;
  // tslint:disable:no-any
  onGenreChange: () => any;
  onYearSliderChange: () => any;
  onRatingSliderChange: () => any;
  onRuntimeSliderChange: () => any;
  // tslint:enable
  className?: string;
}

class SideBar extends React.Component<SideBarProps> {
  render() {
    const {
      genres,
      selectedGenre,
      year,
      rating,
      runtime,
      onGenreChange,
      onYearSliderChange,
      onRatingSliderChange,
      onRuntimeSliderChange,
      className
    } = this.props;
    return (
      <div className={className}>
        <Selection
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={onGenreChange}
        />
        <Slider {...year} onSliderChange={onYearSliderChange} />
        <Slider {...rating} onSliderChange={onRatingSliderChange} />
        <Slider {...runtime} onSliderChange={onRuntimeSliderChange} />
      </div>
    );
  }
}

const StyledBar = styled(SideBar)`
  min-width: 300px;
  flex-basis: 20%;
  padding: 1.275rem;
  display: flex;
  flex-direction: column;
`;

export default StyledBar;
