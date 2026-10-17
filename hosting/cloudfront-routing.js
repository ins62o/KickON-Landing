// Associate with CloudFront Viewer request when deploying to S3.
function handler(event) {
  var request = event.request;
  var pages = {
    '/features': '/features/index.html',
    '/matchday': '/matchday/index.html',
    '/policies': '/policies/index.html',
    '/terms': '/terms/index.html',
    '/privacy': '/privacy/index.html',
    '/account-deletion': '/account-deletion/index.html'
  };
  var path = request.uri.replace(/\/index\.html$/, '').replace(/\/$/, '');
  if (pages[path]) request.uri = pages[path];
  return request;
}
