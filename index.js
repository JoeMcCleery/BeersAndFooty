var ghpages = require('gh-pages')

ghpages.publish('dist', {
    branch: 'master',
    repo: 'git+https://${GITHUB_TOKEN}}:x-oauth-basic@github.com/joemccleery/beersandfooty.git',
    user: {
      name: 'joemccleery',
      email: 'mccleery.joseph@gmail.com'
    }
  }, deployed());

function deployed () {
    return;
}
