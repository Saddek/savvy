#Savvy#

Savvy is a very light-weigth framework for developing single-page HTML5 applicaitons. It is designed for use on tablet, phone and smart TV apps, but it can also be used on websites.

##Project structure##

Savvy apps follow a straight-forward but very particular project structure.

The app is defined in `data/app.xml`. Savvy apps are composed a descrete screens. Each screen has associated HTML, CSS and JavaScript. It is these screens are defined in `data/app.xml`. Additionally, apps can have global HTML, CSS, JavaScript and data that persists across screens. These are also defined in `data/app.xml`.

Conventionally, files within a Savvy project are also organised along a straight-forward but particular pattern. This pattern is based on the [HTML5 boilerplace](http://html5boilerplate.com/).

The directory structure for the main files are:

- `css/`: CSS files (including a `libs` directory for third-party CSS libraries)
- `html/`: HTML snipets used by the Savvy framework
- `js/`: JavaScript files (inclding a `libs` directory also)
- `assets/`: Images, audio, video, fonts and media files
- `data/`: JSON or XML files used by the app

##app.xml##

The `app.xml` file defines a series of screens used in the app. One of these screen must be the default screen, which is loaded then the app initialises. Global HTML, CSS, JavaScript and data are also defeined in `app.xml`. These are loaded before the default screen.

The essential layout of `app.xml` is as follows:

    <?xml version="1.0" encoding="UTF-8" ?>
    <app>
      <screens>
        <!-- screens are defined here -->
      </screen>
      <!-- global HTML, CSS, JavaScript and data are defined here -->
    </app>

Within the `<screens>` tag, individual screens are defined using the following pattern:

    <screen id="MainMenu" title="Main Menu" default="yes">
      <html>html/menu.html</html>
      <css>css/menu.css</css>
      <js>js/menu.js</js>
    </screen>

Each screen must have an ID attribute. The ID must be a valid JavaScript variable name and must not conflict with any property of the JavaScript `window` object. One screen must be marked as being the default screen.

Screen are composed of snippets of any number of HTML, CSS and JavaScript snippets. The path to these files is indicated as either and absolute path or relative to the root folder of the Savvy project.

The `app.xml` file may also include any number of global HTML, CSS, JavaScript and data snippets, defined as follows:

    <html>html/global.html</html>
    <css>css/styles.css</css>
    <data var="l10n">data/l10n.json</data>
    <js>js/script.js</js>

Data requires a varibale name in to which the data will be initialised as a property of the JavaScript `window` object. This must be a valid JavaScript variable name.

##API##

Savvy is very light-weight and has only a very small number of APIs to expose. The primary method that is exposed is the `go` method:

- `Savvy.go(String id)`: Loads a screen of ID `id`.
- `Savvy.go()`: Continues loading the previous screen (used when a screen transition is manually paused).

The framework also exposes two useful methods for getting the HTML DOM `div` element containing HTML

- `Savvy.getGlobal()`: Returns a HTML `div` element containing the global HTML from the Savvy framework.
- `Savvy.getScreen()`: Returns a HTML `div` element containing the current screen's HTML from the Savvy framework. During a screen transition this will return the HTML of the screen being loaded.

Savvy using a [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) pattern for messaging during screen transitions.

- `Savvy.subscribe(String type, Function action, [Object screen])`: Subcribes to messages of type `type`. The Function `action` will be called when the message is published. The optional `screen` parameter refers to Savvy screen object with which the subscription can be associated. If a subscription is associated with a particular screen then the subscription will be automatically unsubsubscribed when the a user navigates away from that screen.
- `Savvy.unsubscribe(String type, Function action)`: Unsubscribes from messages of type `type`. The original Function object must be passed as the `action` argument.
- `Savvy.publish(String type, [Object arg])`: Publishes a message of type `type`. All subscribed functions will be called and passed `args`.

For convienience, the the JavaScript `window` object and Savvy screen objects are also extended with these mthods. In particular, this allows Savvy screens to subcribe that will be automatically unscribed when a user leaves the screen. 

- `Savvy.getInfo()`: Return information about the current screen, including its ID, title, and its URL path within the Savvy framework.

##Subscriptions##

Savvy contains three default messages that can be subscribed to. These are:

- `Savvy.EXIT`: Published when a screen transition is called (the old screen is still visible).
- `Savvy.ENTER`: Published when a new screen is ready to be displayed (the old screen is still visible, the new screen is loaded but not visible).
- `Savvy.READY`: Published when a screen transition is complete (the old screen is unloaded, the new screen is visible).

To pause a screen transition, return `false` to any of these messages. To continue with the transition, call `Savvy.go()`.

The following code sample shows how to use these in practice:

    this.subscribe(Savvy.READY, function ready(){
      // HTML and JavaScript loaded, screen not visible
    });

    this.subscribe(Savvy.ENTER, function(){
      // HTML, JS and CSS loaded, screen visible
    });

    this.subscribe(Savvy.EXIT, function(){
      // Going to unload HTML, CSS and JS, screen still visible
    })

##Screen objects##

Except for global JavaScript (which is executed with the JavaScript `window` object), Savvy executes JavaScript with unique screen objects. These objects are created new everytime a screen is loaded and destroyed with a screen is unloaded.

Within a screen object, individual JavaScript snippets are scoped seperately from each other (so they may contain otherwise conflicing variable names). However, calling functions or manipulating objects within screen objects requires either explicitly exposing them or using the pub-sub feature of Savvy.

To expose functions and objects, Savvy extends the JavaScript `window` object with two further objects:

- `_screen`: A reference to the current screen object.
- `_global`: A reference to the global object (`window`). This is provided purely for syntatic consitency.

To expose a screen function or object, use the following pattern:

    function hello(world) {
      console.log("Hello, " + world);
    }
    _screen.hello = hello;

The `hello` method can then be called from anywhere using `_screen.hello()`. Additionally, screens can be referenced explicitly by ID (e.g. exposing like `MainMenu.hello = hello` or calling like `MainMenu.hello()`). The `this` keyword within a screen's JavaScript (e.g.  exposing like `this.hello = hello` or calling like `this.hello()`).

##Routing##

The Savvy framework includes automatic routing of URLs. URLs used by the Savvy framework follow a simple pattern:

- `http://www.example.com/path/to/savvy/#/id/optional/further/path`

The above URL would load a screen of ID `id`. The Savvy path of a screen, including the optional further path after the Savvy screen ID can be retrieved using `Savvy.getInfo()`.

