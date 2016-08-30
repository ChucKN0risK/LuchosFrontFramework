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
    * Image optimization
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

