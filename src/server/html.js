import React from 'react';

export default class Html extends React.Component {

  render() {
    const {isProduction, version} = this.props;
    const appSrc = isProduction ? `/build/app.js?v=${version}`
                                : '//localhost:8888/build/app.js';
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>Noderunner GUI</title>
          {isProduction &&
            <link href={`/build/app.css?v=${version}`} rel="stylesheet"/>}


          <script src="js/jquery.min.js"></script>
          <script src="js/nprogress.js"></script>


        </head>
        <body className="nav-md">
        <script>
          NProgress.start();
        </script>
        <link href="css/bootstrap.min.css" rel="stylesheet" />

        <link href="fonts/css/font-awesome.min.css" rel="stylesheet" />
        <link href="css/animate.min.css" rel="stylesheet" />

        <link href="css/custom.css" rel="stylesheet" />
        <link href="css/maps/jquery-jvectormap-2.0.1.css" type="text/css" rel="stylesheet" />

        <div className="container body">
          <div className="right_col" role="main">
            <div id="app-root" />
            <script src="/socket.io/socket.io.js"></script>
            <script src={appSrc} type="text/javascript"/>
          </div>
        </div>
          
          
        </body>

      </html>
    );
  }

}

Html.propTypes = {
  isProduction: React.PropTypes.bool.isRequired,
  version: React.PropTypes.string.isRequired
};
