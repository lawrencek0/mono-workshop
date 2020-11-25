import * as React from 'react';
import styled from '../theme';
import { Genre } from '../redux/genres';

interface SelectionProps {
  genres: Genre[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

const Label = styled.label`
  margin-bottom: 0.725em;
  color: #555;
`;

// @TODO: reuse this style since we are frequently using it?
export const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Select = styled.select`
  max-width: 150px;
`;

const Selection: React.SFC<SelectionProps> = ({
  genres,
  selectedGenre,
  onGenreChange
}) => {
  const onChange = (event: React.FormEvent<HTMLSelectElement>) => {
    onGenreChange(event.currentTarget.value);
  };
  return (
    <FlexWrapper>
      <Label>Genre</Label>
      <Select value={selectedGenre} onChange={onChange}>
        {genres.map(genre => (
          <option key={genre.id} value={genre.name}>
            {genre.name}
          </option>
        ))}
      </Select>
    </FlexWrapper>
  );
};

export default Selection;
