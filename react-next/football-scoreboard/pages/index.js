import React from 'react';
import Button  from 'react-md/lib/Buttons'


import Layout from '../components/layout';

export default class extends React.Component {
  render() {
    return (
        <Layout>
          <div>
            Hello Project
            <Button flat label="Hello, World!" onClick={() => console.log("clicked")} />
          </div>
        </Layout>
    )
  }
}
