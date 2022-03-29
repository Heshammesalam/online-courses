# Gulp Starter

That's our gulp boilerplate that will include our initial gulp build alongside the pre-built components that are common in every project to reduce the development time.

## Requirements
This should be installed on your computer in order to get up and running:

- [Node.js](https://nodejs.org/en/) (Required node version is >= 10.0)
- [Gulp 4](https://gulpjs.com/)

## Dependencies
These [npm](https://www.npmjs.com/) packages are used in the Gulp Starter Kit:

- browser-sync
- del
- gulp
- gulp-autoprefixer
- gulp-clean-css
- gulp-concat
- gulp-dependents
- gulp-header-comment
- gulp-imagemin
- gulp-javascript-obfuscator
- gulp-mode
- gulp-nunjucks-render
- gulp-plumber
- gulp-purgecss
- gulp-rename
- gulp-rtlcss
- gulp-sass
- gulp-sourcemaps
- gulp-uglify
- gulp-uglify-es
- webpack-stream
- @fortawesome/fontawesome-free
- bootstrap
- jquery
- slick-carousel
- parsleyjs

For more information, take a look at the [package.json](package.json) file.


## Getting Started
In order to get started, make sure you are meeting all requirements listed above.
Then, just go ahead and clone the Gulp Starter.


### `git clone`
To download the Gulp Starter Kit is by cloning this Git repository. 
Before executing any commands, make sure you have [Git](https://git-scm.com/) installed on your computer.
Then, follow these instructions:

```bash
git clone https://github.com/moselaymd-dev/_gulp-starter-mmd.git your-project-name
```
This creates a folder called `your-project-name` (change that to your project name) at the current location where your terminal / command prompt is pointing to.

Then change your working directory to your project folder by executing `cd your-project-name`.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Gulp Starter.

```bash
npm install
```


## Usage

After use [gulp](https://gulpjs.com/) to run the project by writing the following in your terminal, that by default will run the development mode.  
```python
gulp
```

## Modes
We have different modes for each task we do to reduce the Gulp Starter compile time:
- Development mode ( Write Sourcemaps - Error Messages Not Breaking The Build)
- Production mode ( Write headers - Remove Unnecessary CSS - Uglify & Encrypt JS Code - Minify Images)


For production mode run 
```python
gulp --production
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.