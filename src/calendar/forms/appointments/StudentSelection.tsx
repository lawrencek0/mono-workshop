import React from 'react';
import { Link } from '@reach/router';
import { FaUserCircle } from 'react-icons/fa';

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
        <article className="ba b--black-10 pa3 ma2">
            <h1 className="f4 ttu tracked">Select Students</h1>
            <div className="mv3">
                <label className="db fw4 lh-copy f5" htmlFor="search">
                    Search Students
                </label>
                <input
                    type="text"
                    id="search"
                    name="search"
                    className="border-box pa2 input-reset ba w-100 measure"
                    disabled={true}
                    placeholder="Search Students with ElasticSearch (Coming Soon)"
                />
            </div>
            <ul className="list pl0 measure">
                {students.map(({ id, firstName, lastName, selected }) => (
                    <li className="flex items-center lh-copy bb b--black-10 pa3 ph0" key={id}>
                        <input
                            type="checkbox"
                            className="mr3"
                            name={id}
                            id={`student-${id}`}
                            onChange={onStudentSelection}
                            checked={selected || false}
                        />
                        <FaUserCircle size="3em" />
                        <div className="pl3 flex-auto">
                            <label htmlFor={`student-${id}`}>
                                <span className="f6 db black-70">
                                    {firstName} {lastName}
                                </span>
                                <span className="f6 db black-70">Junior</span>
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt3">
                <Link className="link underline-hover black" onClick={onSubmit} to="../3">
                    Next
                </Link>
            </div>
        </article>
    );
};

export { StudentSelection };
