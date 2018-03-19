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
  className?: string;
}

interface SideBarState {
  selectedGenre: string;
  year: SliderData;
  rating: SliderData;
  runtime: SliderData;
}

class SideBar extends React.Component<SideBarProps, SideBarState> {
  state = {
    selectedGenre: 'comedy',
    year: {
      label: 'year' as SliderLabel,
      min: 1990,
      max: 2017,
      step: 1,
      value: { min: 2000, max: 2017 }
    },
    rating: {
      label: 'rating' as SliderLabel,
      min: 0,
      max: 10,
      step: 1,
      value: { min: 8, max: 10 }
    },
    runtime: {
      label: 'runtime' as SliderLabel,
      min: 0,
      max: 300,
      step: 15,
      value: { min: 60, max: 120 }
    }
  };
  onGenreChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({
      selectedGenre: event.currentTarget.value
    });
  };

  onSliderChange = (label: SliderLabel, data: RangeData) => {
    this.setState({
      // @FIXME: https://github.com/Microsoft/TypeScript/issues/13948#issuecomment-336682927
      // tslint:disable-next-line:no-any
      [label as any]: {
        ...this.state[label],
        value: data
      }
    });
  };

  render() {
    const { selectedGenre, year, rating, runtime } = this.state;
    return (
      <div className={this.props.className}>
        <Selection
          genres={this.props.genres}
          selectedGenre={selectedGenre}
          onGenreChange={this.onGenreChange}
        />
        <Slider {...year} onSliderChange={this.onSliderChange} />
        <Slider {...rating} onSliderChange={this.onSliderChange} />
        <Slider {...runtime} onSliderChange={this.onSliderChange} />
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
