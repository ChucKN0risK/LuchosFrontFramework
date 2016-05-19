Lucho’s Front-End Framework
===========================

This framework is built over several years of front-end development knowledge. It is as agnostic as possible. The only thing I focused on was to make the sass as modular and automated as possible helping you writing style over fixing/maintaining it.

You can drop me a line on [@chuckn0risK](www.twitter.com/chuckn0risk)

### Requirements
* [node.js 0.12.x/npm](http://nodejs.org/download/)
* [Bower](http://bower.io/)
    * Install with `npm install -g bower`
* [Gulp](http://gulpjs.com//)
    * Install with `npm install -g gulp`

### Features

- Sanitize.css [https://github.com/jonathantneal/sanitize.css/blob/master/sanitize.scss](https://github.com/jonathantneal/sanitize.css/blob/master/sanitize.scss)  
- Responsive Typography with : [Modular Scale](https://github.com/modularscale/modularscale-sass) + [Responsive Modular Scale](https://github.com/gakimball/responsive-modular-scale)  
For further informations about Responsive Web Typography: [Pro Web Type](https://prowebtype.com)
- [SMACSS Architecture](https://smacss.com/)
- [Media Queries With Superpowers](https://github.com/sass-mq/sass-mq)
- [Automated Sass documentation](http://sassdoc.com/)  
Just go to: `path/to/your/directory/sassdoc`
- Build process with Gulp

### Getting Started

1. If you already have MAMP/WAMP installed go to the corresponding folder : `/www` for Windows or `/htdocs` for OSX.
Don’t forget to launch your Apache server.

2. Clone this repo in your dev directory via your git interface or via your CLI (Command Line Interface). I personally use [iTerm](https://iterm2.com/).

3. Once you are in the repo directory download node packages : `(sudo) npm install`. It will download all the packages listed in the `package.json` situated at the root of the project.
4. Since we use [BrowserSync](http://www.browsersync.io/) in our Gulp build process you have to set your own 'proxy’.  Modify at the root of the project the localconfig.json file so it suits your own configuration : 
```json
{
    "serverName": "localhost:XXXX/",
    "subDirectory": "path/to/your/directory",
    "enableBrowserSync": true
}
```

5. When you're done you can compile the assets with the `gulp` command.

### Some pieces of advice
  1. Take the habit of writing your css methodically as proposed by the SMACSS methodology:
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

2. Never use `#ids` in your css. [It’s bad for specificity](http://csswizardry.com/2011/09/when-using-ids-can-be-a-pain-in-the-class/).  
3. Try to separate the disposition of a component from its core style. The former will change according to the page whereas the latter should remain untouched.<br><br>
4. Monitoring closely what’s happening in the front-end world will help you improve this framework so you can tweak it and optimize it. Here are some awesome people I encourage you to follow :     
  - [@adactio](https://twitter.com/adactio)  
  - [@beep](https://twitter.com/beep)  
  - [@brad_frost](https://twitter.com/brad_frost)  
  - [@rachelandrew](https://twitter.com/rachelandrew)  
  - [@csswizardry](https://twitter.com/csswizardry)  
  - [@chriscoyier](https://twitter.com/chriscoyier)  
  - [@vlh](https://twitter.com/vlh)  
  - [@aerotwist](https://twitter.com/aerotwist)  
  - [@davidwalshblog](https://twitter.com/davidwalshblog)  
  - [@paul_irish](https://twitter.com/paul_irish)  
  - [@lukew](https://twitter.com/lukew)