import * as React from 'react';
import InputRange from 'react-input-range';
import styled from '../theme';
import 'react-input-range/lib/css/index.css';
import { SliderData, RangeData, SliderLabel } from './SideBar';

interface SliderProps extends SliderData {
  onSliderChange: (label: SliderLabel, type: RangeData) => void;
}

const Wrapper = styled.div`
  margin: 40px 0;
`;

const Label = styled.label`
  color: #555;
  font-size: 1rem;
  margin-bottom: 20px;
  display: block;
  text-transform: capitalize;
`;

const InputRangeWrapper = styled.div`
  .input-range__slider {
    background: ${props => props.theme.primaryColor};
    border: 1px solid ${props => props.theme.primaryColor};
  }

  .input-range__track {
    background: #ddd;
  }

  .input-range__track--active {
    background: ${props => props.theme.primaryColor};
  }

  .input-range__label--value .input-range__label-container {
    background: ${props => props.theme.primaryColor};
    color: #555;
    font-size: 0.65rem;
    padding: 2px 5px;
    border-radius: 2px;
  }

  .input-range__label--min .input-range__label-container,
  .input-range__label--max .input-range__label-container {
    font-size: 0.65rem;
    color: #888;
    left: 0;
  }

  .input-range__label--max .input-range__label-container {
    left: 25%;
  }
`;

class Slider extends React.Component<SliderProps> {
  onChange = (range: RangeData) => {
    this.props.onSliderChange(this.props.label, range);
  };

  shouldComponentUpdate(nextProps: SliderProps) {
    if (nextProps.value !== this.props.value) {
      return true;
    }
    return false;
  }

  render() {
    const { min, max, step, value, label } = this.props;

    return (
      <Wrapper>
        <Label>{label}</Label>
        <InputRangeWrapper>
          <InputRange
            minValue={min}
            maxValue={max}
            step={step}
            value={value}
            onChange={this.onChange}
          />
        </InputRangeWrapper>
      </Wrapper>
    );
  }
}

export default Slider;
