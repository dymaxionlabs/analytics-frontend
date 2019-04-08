import React from "react";

const isProduction = process.env.NODE_ENV === "production";

export default () =>
  isProduction && (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function() {
        var ldk = document.createElement('script');
        ldk.type = 'text/javascript';
        ldk.async = true;
        ldk.src = 'https://s.cliengo.com/weboptimizer/5ca60a88e4b0d077b85e4879/5ca60a88e4b0d077b85e487c.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ldk, s);
      })();`
      }}
    />
  );
