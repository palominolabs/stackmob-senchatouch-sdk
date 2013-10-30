StackMob Sencha Touch SDK Example App
=====================================

Setup
-----

1. Launch a local webserver from the root of the repository (the directory containing the `example` directory, not the
`example` directory itself).  One easy way to do so is with `python -m SimpleHTTPServer`.
1. Open a browser and navigate to the `example` directory.  Depending on how you setup your webserver, this might be
something like [http://localhost:8000](http://localhost:8000).  Note that, in development mode, this
example application will violate the same origin policy (since the files are hosted locally, but attempting to make
AJAX requests to StackMob); if you are using a browser that strictly enforces this (e.g. Chrome), launch the browser
with web security disabled.
