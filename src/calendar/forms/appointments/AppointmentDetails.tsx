import React from 'react';
import { Link } from '@reach/router';
import { Detail } from 'calendar/types';

type Props = Detail & {
    onInputChange: (name: 'title' | 'description', value: string) => void;
};

const AppointmentDetailsForm: React.FC<Props> = ({ title, description, onInputChange }) => {
    const handleInputChange = ({ currentTarget }: { currentTarget: HTMLInputElement | HTMLTextAreaElement }): void => {
        onInputChange(currentTarget.name as 'title' | 'description', currentTarget.value);
    };

    return (
        <article className="ba b--black-10 pa3 ma2">
            <h1 className="f4 ttu tracked">Fill Appointment Details</h1>
            <div className="mt3">
                <label className="db fw4 lh-copy f5" htmlFor="title">
                    Title
                </label>
                <input
                    className="border-box pa2 input-reset ba bg-transparent w-100 measure"
                    type="title"
                    name="title"
                    id="title"
                    value={title}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mt3">
                <label className="db fw4 lh-copy f5" htmlFor="description">
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
                <Link className="link underline-hover black" to="../2">
                    Next
                </Link>
            </div>
        </article>
    );
};

export { AppointmentDetailsForm };
