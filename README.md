Step 1: Push your code to GitHub
First, you need to get your local code into a GitHub repository.

Initialize a Git repository locally (if you haven't already):

Bash
git init
git add .
git commit -m "Initial commit from AI Studio"
Go to GitHub and create a new repository.

Link your local project to the new GitHub repo and push your code:

Bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
Step 2: Connect GitHub to Cloudflare Pages
Log in to the Cloudflare Dashboard.

On the left sidebar, navigate to Workers & Pages.

Click the Create application button, then select the Pages tab.

Click Connect to Git and authorize Cloudflare to access your GitHub account.

Select the repository you just created and click Begin setup.

Step 3: Configure Build and Environment Variables
Set up the build settings:
Depending on the framework your AI Studio app generated (like Vite, Next.js, or standard React), set the framework preset:

Framework preset: Select your framework (e.g., Next.js or React).

Build command: npm run build

Build output directory: dist, build, or .next (Cloudflare usually auto-detects this based on your framework).

Add your Gemini API Key:
Scroll down to Environment variables (advanced).

Click Add variable.

Set the Variable name to GEMINI_API_KEY.

Set the Value to your actual Gemini API key (the same one you used in your .env.local file).

Click Save and Deploy.

Cloudflare will now pull your code from GitHub, build the application, and deploy it securely to a live, shareable URL. Every time you push a new update to your GitHub repository, Cloudflare will automatically rebuild and update your live site.
