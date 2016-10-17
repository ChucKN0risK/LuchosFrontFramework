Lucho’s Front-End Framework
===========================

This framework is built over several years of front-end development knowledge. It is as agnostic as possible. The only thing I focused on was to make the sass as modular and automated as possible helping you writing style over fixing/maintaining it.

You can drop me a line on [@chuckn0risK](www.twitter.com/chuckn0risk)

## Requirements
* [node.js 0.12.x/npm](http://nodejs.org/download/)

## Development Features

* Render elements consistently with [Sanitize.css](https://github.com/jonathantneal/sanitize.css/blob/master/sanitize.scss)  
* Responsive Typography with : [Modular Scale](https://github.com/modularscale/modularscale-sass) + [Responsive Modular Scale](https://github.com/gakimball/responsive-modular-scale)  
For further informations about Responsive Web Typography: [Pro Web Type](https://prowebtype.com)
* [SMACSS Architecture](https://smacss.com/)
* [Media Queries With Superpowers](https://github.com/sass-mq/sass-mq)
* [Automated Sass documentation](http://sassdoc.com/)
Just go to: `path/to/your/directory/sassdoc`
* Build process with Gulp which includes:
    * Live preview server (using [BrowserSync](http://www.browsersync.io/))
    * [Responsive Image Creation](#responsive-image-workflow)
    * CSS Autoprefixing
    * Sass compilation
    * SVG Spriting (generate PNG fallbacks with [svg4everybody](https://github.com/jonathantneal/svg4everybody) for accessibility)

## Getting Started

1. Clone this repo in your dev directory via your git interface or via your CLI (Command Line Interface). I personally use [iTerm](https://iterm2.com/).

2. Once you are in the repo directory download node packages : `(sudo) npm install` or `(sudo) npm i`. It will download all the packages listed in the `package.json` situated at the root of the project.

3. When you're done you can compile the assets and start the server by running the `gulp` command.

## Sass Architecture

```
└── scss
    ├── base
    ├── components
    ├── fonts
    ├── layouts
    ├── pages
    ├── tools
    ├── vendors
    └── style.scss
    └── styleguide.scss
```

#### Definitions

- **Base**: typography, base style, [sanitize.scss](https://github.com/jonathantneal/sanitize.css/blob/master/sanitize.scss) 
- **Components**: contains atoms and molecules (see [Atomic Design Methodology](http://atomicdesign.bradfrost.com/table-of-contents/))
- **Fonts**: just fonts imports via font-face
- **Layouts**: organisms aka wrapper templates 
- **Pages**: individual pages
- **Tools**: variables, sass functions, mixins, media-queries, utility-classes
- **Vendors**: holds 3rd party code (here [animate.css](https://github.com/daneden/animate.css))

## Some pieces of advice

* Take the habit of writing your css methodically as proposed by the SMACSS methodology:
```  
 .my-selector {  
    // mixins and extends first, unless  
    // they're specifically related to a rule  
    @include some-mixin;  
  
    // Box  
    position: relative;  
    display: block;  
    height: 200px;  
    width: 200px;  
    margin-left: auto;  
  
    // Border
    border: 1px solid $red;
    border-radius: 100%;
  
    // Background
    background-color: transparent;
    box-shadow: 10px 10px 5px $lightgrey;

    // Text
    font-family: $font1;
    font-weight: 600;
    @include rms(2);

    // Other
    z-index: 10;
    
    // pseudo-classes follow because  
    // they narrow down a selection of the parent  
    &:first-child {  
      
    }  
    
    // action-based pseudo-classes are next because  
    // they style states of the parent  
    &:focus,
    &:hover {  
  
    }  
  
    // media queries come next because  
    // they describe modifications to the parent
    @include mq($from: tablet) {  
      color: $red;  
    }
    
    /*  
    * nested elements and pseudo-elements  
    */  
      
    // pseudo-elements comes first
    &::after {  
      content: 'hey, I am a pseudo element';  
    }  
  
    // element selectors are next and are alphabetical  
    a {  
      
    }  
  
    // class name selectors are last because  
    // they can modify un-classed elements  
    .some-nested-selector {  
      
    }
}
``` 
Further reading: [idiomatic CSS](https://github.com/necolas/idiomatic-css) by [@necolas](https://twitter.com/necolas)

* When creating/renaming classes:
    * Don't delete old class names until it is safe to do so. Leave them in place and include new class names.
    * Avoid content based class names, use functional class names instead.
    * Use conventions like [BEM naming methodology](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/).

* Never use `#ids` in your css. [It’s bad for specificity](http://csswizardry.com/2011/09/when-using-ids-can-be-a-pain-in-the-class/).
* Try to separate the disposition of a component from its core style. The former will change according to the page whereas the latter should remain untouched. <br><br>

## Responsive Image Workflow

This framework helps you adopt a responsive image workflow. The idea is to quickly generate image files in several resolutions. These resolutions should be chosen according to the devices your app will be interacted on. And remember that your [breakpoints must be determined by your content](http://bradfrost.com/blog/post/7-habits-of-highly-effective-media-queries/#content) and not by your devices.

Here the devices we want to support are small, medium and large screens. Devices differ from their physical screen size (viewport) and their resolution (or, the device-pixel ratio, which is the ratio of device pixel and CSS pixel). 

In a mobile-first strategy we set a default `src` for our fallback image and set the others images in the `srcset`.

For each devices we chose here to generate 2 images:
- 1 for device with standard DPI
- 1 for device with higher DPI (@2x)

We end up with the following HTML : 
```html
<img 
    src="assets/img/landscape.png"
    srcset="assets/img/landscape.png 200w,
            assets/img/landscape@2x.png 400w,
            assets/img/landscape_medium.png 768w,
            assets/img/landscape_medium@2x.png 1536w,
            assets/img/landscape_large.png 1024w,
            assets/img/landscape_large@2x.png 2048w"
    alt="A beautiful mountain landscape">
```

The image linked in the `src` attribute is the image fallback for browsers not supporting `srcset`. As we said earlier we have 2 images per devices each corresponding to a viewport and DPI. Note that the '@2x' appended in the filename is just a convention indicating high-DPI images.

#### What does the framework does for me ?
Note: When adding an image to your project choose one of the best resolution possible. Indeed, we will need to scale it down to generate the images for the other devices with a lower DPI and smaller viewport.

The framework automates the creation of all the images of your project. You just have to choose one with a proper resolution at first. You'll find in the [gulpfile](gulpfile.js) all the tasks in charge of generating/cleaning/copying image files in our image directories: [app/assets/img-to-resize/](app/assets/img-to-resize/) and [app/assets/img/](app/assets/img/).

Everytime you add/delete image from the `img-to-resize/` folder the `img/` will be recreated with the requested images.

To sum up :
- `img-to-resize/` is the directory you will deal with
- `img/` is the directory your HTML will deal with

#### What do I have to do left ?
1. Install GraphicsMagick and ImageMagick via [Homebrew](brew.sh) : `brew install imagemagick graphicsmagick`
2. Simply choose proper images to add in your `img-to-resize/` folder and use the HTML snippet previously linked.

## People worth to follow

Monitoring closely what’s happening in the front-end world will help you improve this framework so you can tweak it and optimize it. Here are some awesome people I encourage you to follow :  <br>   
	* [@adactio](https://twitter.com/adactio)  
	* [@beep](https://twitter.com/beep)  
	* [@brad_frost](https://twitter.com/brad_frost)  
	* [@rachelandrew](https://twitter.com/rachelandrew)  
	* [@csswizardry](https://twitter.com/csswizardry)  
	* [@chriscoyier](https://twitter.com/chriscoyier)  
	* [@vlh](https://twitter.com/vlh)  
	* [@aerotwist](https://twitter.com/aerotwist)  
	* [@davidwalshblog](https://twitter.com/davidwalshblog)  
	* [@paul_irish](https://twitter.com/paul_irish)  
	* [@lukew](https://twitter.com/lukew)

