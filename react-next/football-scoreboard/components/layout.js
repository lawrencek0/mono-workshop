import Link from 'next/link';
import Head from 'next/head';

export default ({ children, title}) => (
  <div>
    <Head>
      <title>{ title } Football Scoreboard</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link rel='stylesheet' href='/static/react-md.light_blue-yellow.min.css' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Material+Icons' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' />
    </Head>
    <header>
      <nav>
        <Link href="/"><a><i className="material-icons">assignment_ind</i> Home</a></Link>
      </nav>
    </header>

    { children }

  </div>
)