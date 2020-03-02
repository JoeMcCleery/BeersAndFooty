# abort on errors
set -e

git remote add origin 'https://github.com/JoeMcCleery/beersandfooty.git'
git config --global user.email "mccleery.joseph@gmail.com"
git config --global user.name "joemccleery"
# # get latest version
# git pull
# git add .
# git commit
# git push

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
echo 'beersandfooty.com' > CNAME

cd -

npm run deploy
