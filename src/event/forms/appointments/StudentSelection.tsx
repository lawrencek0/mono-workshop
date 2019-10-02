import React from 'react';
import { Link } from '@reach/router';

export type Student = {
    id: string;
    firstName: string;
    lastName: string;
    selected?: boolean;
};

type Props = {
    students: Student[];
    onStudentSelection: ({ currentTarget }: { currentTarget: HTMLInputElement }) => void;
    onSubmit: (event: React.MouseEvent) => void;
};

const StudentSelection: React.FC<Props> = ({ students, onStudentSelection, onSubmit }) => {
    return (
        <div>
            <div className="f3">Select Students</div>
            <input
                type="text"
                name="search"
                disabled={true}
                placeholder="Search Students with ElasticSearch (Coming Soon)"
            />
            {students.map(({ id, firstName, lastName, selected }) => (
                <div key={id}>
                    <input
                        type="checkbox"
                        name={id}
                        id={`student-${id}`}
                        onChange={onStudentSelection}
                        checked={selected || false}
                    />
                    <label htmlFor={`student-${id}`}>
                        {firstName} {lastName}
                    </label>
                </div>
            ))}
            <Link onClick={onSubmit} to="../3">
                Next
            </Link>
        </div>
    );
};

export { StudentSelection };
