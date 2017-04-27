import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import { createPost } from '../../actions';

const required = value => value ? undefined : 'Required';


const renderField = ({ input, label, type, meta: { touched, error } }) =>
  <div className={`form-group ${touched && error ? 'has-danger': ''}`}>
    <label className="form-control-label">{label}</label>
    <input
      className={`form-control ${touched && error ? 'form-control-danger': ''}`}
      {...input}
      placeholder={label}
      type={type}
    />
    {touched && ((error && <span className="form-control-feedback"> {error}</span>))}
  </div>;

class PostsNew extends Component {
  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <h3>Create a new post</h3>
          <Field
            name="title" type="text" label="Title"
            component={renderField}
            validate={required}
          />
          <Field
            name="categories" type="text" label="Categories"
            component={renderField}
            validate={required}
          />
          <Field
            name="content" type="text" label="Content"
            component={renderField}
            validate={required}
          />
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    )
  }
}

export default reduxForm({
  form: 'PostsNew',
  onSubmit: createPost
})(PostsNew);