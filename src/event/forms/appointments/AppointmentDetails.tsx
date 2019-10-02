import React from 'react';
import { Link } from '@reach/router';

type Props = {
    title: string;
    description: string;
    onInputChange: (name: 'title' | 'description', value: string) => void;
};

const AppointmentDetailsForm: React.FC<Props> = ({ title, description, onInputChange }) => {
    const handleInputChange = ({ currentTarget }: { currentTarget: HTMLInputElement | HTMLTextAreaElement }): void => {
        onInputChange(currentTarget.name as 'title' | 'description', currentTarget.value);
    };

    return (
        <fieldset>
            <legend className="ph0 mh0 fw6">Fill Appointment Details</legend>
            <div className="mt3">
                <label className="db fw4 lh-copy f6" htmlFor="title">
                    Title
                </label>
                <input
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    type="title"
                    name="title"
                    id="title"
                    value={title}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mt3">
                <label className="db fw4 lh-copy f6" htmlFor="description">
                    Description
                </label>
                <textarea
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    name="description"
                    id="description"
                    value={description}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mt3">
                <Link to="../2">Next</Link>
            </div>
        </fieldset>
    );
};

export { AppointmentDetailsForm };
