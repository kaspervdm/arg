# Copy environment file
echo "Copying .env.example.dev to .env"
cp .env.example.dev .env

echo Clearing main Craft license key
echo "temp" > ./config/license.key

echo Clearing all plugin licenses keys from project.yaml
sed -i '' 's/licenseKey: .*/licenseKey:/' "./config/project/project.yaml"

# Prompt the user for the project name
echo "Project name (kebab-case!). Your hostname will be <name>.ddev.site:"
read project_name

# Prompt the user for the project name
echo "Project title (human friendly):"
read project_title

# Update the project name in DDEV configuration
sed -i '' "s/^name: .*/name: $project_name/" .ddev/config.yaml

# Update PRIMARY_SITE_URL in .env file
echo "Updating PRIMARY_SITE_URL in .env file"
sed -i '' "s|PRIMARY_SITE_URL=.*|PRIMARY_SITE_URL=\"https://$project_name.ddev.site\"|" .env

# Update SITE_NAME in .env file
echo "Updating SITE_NAME in .env file"
sed -i '' "s|SITE_NAME=.*|SITE_NAME=\"$project_title\"|" .env

echo "Starting Craft setup"

ddev start
ddev composer install
ddev craft setup
ddev npm install
ddev npm run build
