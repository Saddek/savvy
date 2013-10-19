# Savvy 2.0 #

[Savvy][1] is a framework library for writing HTML-based [single-page applications][2]. The core concept in Savvy is that an application is made up of multiple "screens". Each of these screens are in turn made up of any number of HTML partials, CSS stylesheets and JavaScript source files.

As a user navigates an application, they navigate between screens and the framework modifies the HTML partials, stylesheets and source files that reside in the DOM. When a user leaves one screen and navigates to another, the HTML, CSS and JavaScript for one screen are unloaded and the HTML, CSS and JavaScript for a new screen are loaded.

Savvy also supports "global" HTML, CSS and JavaScript. These are always present in the DOM and are not affected by transitions between screens.

## Defining an application ##

A Savvy application is defined in `/data/app.xml`. This file is made up of two distinct parts:

  * A list of screens (including the HTML, CSS and JavaScript for each)
  * A list of global HTML partials, CSS and JavaScript

The outline of `app.xml` is as follows:

    <?xml version="1.0" encoding="UTF-8" ?>
    <app>
        <screens>
            <!-- list of screens goes here -->
        </screens>
        <!-- list of global HTML partials, CSS and JavaScript goes here -->
    </app>

### Defining a screen ###

Individual screens are defined in the list of screen as follows:

    <screen id="MainMenu" title="Main Menu" default="yes">
        <html>html/partial.html</html>
        <css>css/sheet.css</css>
        <js>js/script.js</js>
    </screen>

Each screen must have an ID. By convention a screen ID begins with a capital letter. The ID must be:

1. unique;
2. a valid JavaScript variable identifier; and
3. not conflict with any property of the JavaScript `window` object.

One screen must be identified as being the default screen. That screen will normally be shown when the application starts.

A screen may have any number of HTML partials, CSS style sheets and JavaScript source files associated with it.

### Defining global HTML, CSS and JavaScript ###

Global HTML, CSS and JavaScript are listed as children of the app node, as follows:

    <html>html/partial2.html</html>
    <css>css/sheet2.css</css>
    <js>js/script2.js</js>

Any number of HTML partials, CSS stylesheets and JavaScript source files may be defined as global.

## Savvy API ##

Savvy has a very simple API. The API comprises three methods:

1. `Savvy.load`
2. `Savvy.getScreen`
3. `Savvy.getGlobalContent`

To load a new screen (and automatically unload the current one), simply call `Savvy.load` and pass the ID of the screen to load. For example:

    Savvy.load("MainMenu");

### Accessing content ###

The HTML of Savvy screens and global HTML are added to unique HTML `DIV` elements in the DOM. It can sometimes be useful to access and manipulate the content of these `DIV`s independent of Savvy.

The following method will return the `DIV` that contains the current Savvy screen:

    Savvy.getScreen();

If the screen is in transition then the new screen is returned.
 
A corresponding method returns the `DIV` that contains global HTML content:

    Savvy.getGlobalContent();
	
### Events ###

There are four events associated with screen transitions:

1. `Savvy.onBeforeChange`
2. `Savvy.onBeforeReady`
3. `Savvy.onReady`
4. `Savvy.onLoadProgress`

`Savvy.onLoadProgress` is described in the Advanced section below.

#### `Savvy.onBeforeChange` ####

`Savvy.onBeforeChange` is fired just before the process of transitioning to a new screen is executed. It can be over-ridden in order to execute code before a screen is transitioned away from.

This can be useful when some tidy-up is needed before leaving a screen or where the application should wait for a process to complete before transitioning to the new screen.

If a call to `Savvy.onBeforeChange` returns `false` then transition to the new screen will be deferred until `Savvy.change` is called explicitly.

For example, the following code will defer the start of the transition to a new screen for 5 seconds:

    Savvy.onBeforeChange = function(){
        setTimeout( function(){
            Savvy.change();
        }, 5e3 );
        
        return false;
    }

#### Savvy.onBeforeReady ####

Similarly, Savvy fires an event just before a new screen is revealed. This event is `Savvy.onBeforeReady` and, like `Savvy.onBeforeChange`, it can return `false` to defer the showing of the new screen.

This can be useful in cases where it is desirable to execute set-up code before a screen is revealed.

If `Savvy.onBeforeReady` returns `false` then `Savvy.ready` will need to be called in order to complete the transition to the new screen.

The following example will defer the final step of the transition to a new screen for 5 seconds:

    Savvy.onBeforeReady = function(){
        setTimeout( function(){
            Savvy.ready();
        }, 5e3 );
        
        return false;
    }

#### Savvy.onReady ####

Finally, `Savvy.onReady` is fired when a screen transition completes. It can be seen as being analogous to `window.onload` in JavaScript.

In the following example, an alert box is opened when a screen is revealed:

    Savvy.onReady = function(){
        alert("Ready!");
    }

### Routing ###

Savvy automatically includes support for screen routing and normal browser back and forward navigation.

Except for the first screen, when a screen is loaded the hash element of the HTML document location is changed to refer to the ID of the current screen. So, if the current screen is called, "MainMenu", the hash element of the HTML document location is changed to `#§MyScreen`.

If a user copies the URL of a Savvy application, including the hash element, and pastes it into a browser navigation bar then the screen referred to in the URL will be loaded. However, persistence of JavaScript data will not automatically be maintained across page reloads.

## Advanced ##

### Order of execution ###

When a screen transition is performed the following is the sequence of execution:

  * `Savvy.load`:
  
    1. Block calls to `Savvy.load`.
    2. Call `Savvy.onBeforeChange`:
      - If the response is not `false` then call `Savvy.change`.

  * `Savvy.change`:
  
    1. De-reference all Savvy screen objects.
    2. Create a non-visible `DIV` element to act as a buffer.
    3. Add the new screen's HTML partials to the buffer `DIV`.
    4. Add the new screen's CSS stylesheets to the document head.
    5. Create a new Savvy screen object.
    6. Execute the new screen's JavaScript in the scope of the new Savvy screen object.
    7. Call `Savvy.onBeforeReady`.
      - If the response is not `false` then call `Savvy.ready`.

  * `Savvy.ready`:
  
    1. Remove the old screen's HTML partials from the DOM.
    2. The old screen's CSS is removed from the document head.
    3. Make the buffer `DIV` visible.
    4. If the new screen has a title attribute then set to the JavaScript `document.title` object to this.
    5. If this is not the first screen then set the JavaScript `window.location.hash` object to `§ID`, where `ID` is the ID of the new screen.
    6. Unblock calls to `Savvy.load`.
    7. Call `Savvy.onReady`.

Once a Savvy screen object is de-referenced, garbage collection should remove the screen's JavaScript objects (variables and functions) that are no longer accessible.

HTML partials and CSS stylesheets are added to the DOM, and JavaScript is executed, in the order given in `app.xml`.

### Scoping ###

Savvy executes JavaScript code within a scope. Global JavaScript files are executed in the scope of the JavaScript `window` object. Individual JavaScript files associated with a screen are executed within their own scope.

This means that the source code of JavaScript files executed as part of screens do not need to have unique variable and function identifiers. However, it also means that JavaScript variables and functions defined in different source files associated with a sceen are not immediately accessible to each other.

JavaScript code that is `global`, on the other hand, will be available from all JavaScript source files.

### Scope pointers and persistence ###

Savvy includes two pointers that refer to different scopes:

  * `_global`
  * `_screen`

`_global` points to the JavaScript `window` object and can be used to refer to the global scope or to keep data and/or functions in memory across screen transitions.

For example, the following code will set a global variable called `currentUser` to `"Mike"`:

    _global.currentUser = "Mike";

This variable will persist across screens transitions irrespective of where it was set.

`_screen` refers to the current screen. Variables created under that pointer will not persist across screen transitions. However, this pointer can be useful to expose functions and variables from different JavaScript files associated with the same screen.

The following example exposes a function in one file (`file1.js`) and calls it from another (`file2.js`):

    // file1.js
    function Hello(str){
        alert("Hello "+ str + "!");
    }
    
    _screen.Hello = Hello; // expose Hello

    // file2.js
    _screen.Hello("world"); // "Hello world!"

Alternative, `this` or the explicit ID of a screen can be used to refer to the `_screen` scope.

For example, the following are all functionally identical:

    _screen.Hello("world");
    _this.Hello("world");
    MainMenu.Hello("world");

### Load progress ###

`Savvy.onLoadProgress` fires during start up of a Savvy app. The argument `percent`, a floating point decimal indicating the load progress out of 100, is passed to it when called.

This function can be over-ridden to create a loading screen. By default, a basic progress script is at `js/libs/savvy/progress.js` and is linked from `index.html`.

`Savvy.getScreen`, `Savvy.onBeforeChange` and `Savvy.ready` work as normal during load progress and can be used to show progress on screen.

&copy; 2013 Oliver Moran

[1]: http://en.wiktionary.org/wiki/savvy "savvy (Wiktionary)"
[2]: http://en.wikipedia.org/wiki/Single-page_application "Single-page application (Wikipedia)"