#Savvy#

Savvy is an easy-to-use framework for developing single-page HTML5 applications. It is intended for development of tablet, smart phone and smart TV apps, but it can also be used on websites.

Savvy emphasises HTML, CSS and JavaScript as distinct technologies and employs a [Model-View-Presenter](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter)-style paradigm for app development.

Alongside HTML, CSS and JavaScript, Savvy can parse [JSON](http://www.json.org/) (and [JXON](https://developer.mozilla.org/en-US/docs/JXON)) data models right out of the box.

##Project structure##

Savvy apps follow a straight-forward project structure based on the [HTML5 Boilerplate](http://html5boilerplate.com/).

The app is defined in `data/app.xml` (mandatory). Conventionally, other files are organised in directories as follows:

- `css/`: CSS snippets (including a `libs` directory for third-party CSS libraries)
- `html/`: HTML snippets used by the Savvy framework
- `js/`: JavaScript snippets (including a `libs` directory also)
- `assets/`: Image, audio, video and other media files
- `data/`: JSON or JXON models (including `app.xml`, which defines the app)

##Composing screens##

Savvy apps are composed of desecrate screens. Each screen is composed of any number of HTML, CSS and JavaScript snippets. These screens are defined in `data/app.xml`. One of these screen MUST be the default screen.

Additionally, apps may be composed of any number of "global" HTML, CSS, JavaScript snippets (including external libraries) as well as data that persists across screens. The "global" elements of an app are also defined in `data/app.xml`.

###`app.xml`###

The essential layout of `app.xml` is as follows:

    <?xml version="1.0" encoding="UTF-8" ?>
    <app cache="auto">
      <screens>
        <!-- screens are defined here -->
      </screen>
      <!-- global HTML, CSS, JSON and JavaScript is defined here -->
    </app>

Within the `<screens>` tag, individual screens are defined using the following pattern:

    <screen id="MainMenu" title="Main Menu" default="yes">
      <html>html/menu.html</html>
      <css>css/menu.css</css>
      <js>js/menu.js</js>
    </screen>

Each `<screen>` MUST have an `id` attribute. The value of the `id` attribute MUST be a valid JavaScript identifier, it MUST be unique and MUST NOT conflict with any other object in the scope of the JavaScript `window` object.

Each `<screen>` SHOULD have a `title` attribute. The value of the `title` attribute will be set assigned to `window.title` when the screen is loaded.

Exactly one `<screen>` MUST be have a `default` attribute with a value of `yes`. The default screen will be displayed when the application starts.

###Code snippets###

Screens are composed of any number of HTML, CSS and JavaScript code snippets. The path to these snippet files MUST be indicated as EITHER an absolute path OR a relative path from the root directory of the Savvy project.

A Savvy app MAY include any number of global HTML, CSS, JavaScript and JSON snippets. Example:

    <html>html/global.html</html>
    <css>css/styles.css</css>
    <data>data/l10n.json</data>
    <js>js/script.js</js>

###Data files###

`<data>` snippets MUST be [valid JSON](http://www.json.org/) (or [Algorithm #3-style JXON](https://developer.mozilla.org/en-US/docs/JXON)).

Data will be initialised to a child of the JavaScript `window` object. The name of this child MAY be indicated using the `name` attribute of the `<data>` element (e.g. <data name="myData">path/to/data.json</data>`).

If no `name` attribute is provided, Savvy will initialise the data to an identifier based on the file name. For example, `<data>data/l10n.json</data>` will be initialised to `l10n`.

In either case, the identifier MUST be a valid JavaScript identifier and SHOULD not conflict with any other child of the JavaScript `window` object.

##Moving between screens##

The primary means to navigate through the screens of a Savvy app is the `Savvy.go()` method:

- `Savvy.go(String id)`: Loads a screen of ID `id`.

For example, the following JavaScript will load a screen with the ID of "MainMenu":

    Savvy.go("MainMenu");

The JavaScript `history` object can also be used to navigate between screens. For example, `history.back()` will navigate back one screen in the navigation history. Whereas, `history.forward(2)` will navigation forward two screens in the navigation history.

###Screen life cycle###

The life cycle of a screen in Savvy can be monitored using three event:

* Savvy.EXIT
* Savvy.READY
* Savvy.ENTER

####Savvy.EXIT####

`Savvy.EXIT` is fired when a screen transition is about called. It provides an opportunity for an app to perform clean-up or other operations before a transition occurs.

####Savvy.READY####

`Savvy.READY` is fired when a mid-point through the screen transition process. The old screen's JavaScript has been unlinked and the new screen's HTML and JavaScript has been added to the DOM and executed. However, the new screen is not visible. The old screen's HTML is still in the DOM and it's CSS is still live.

This event provides and opportunity for an app to preform preparatory operations with the new screen's HTML in the DOM and JavaScript fully linked but before the screen transition is finalised.

####Savvy.ENTER####

`Savvy.ENTER` is fired as the last step in a screen transition. It signals that the screen transition is complete and the new screen is visible to the user.

After `Savvy.READY` is fired, the old screen's HTML and CSS is unloaded and the new screen's CSS is made live. The new screen is made visible, the window title is set to the new screen's title and the window location is set to Screen 2's ID (e.g. `http://www.example.com/!#/ScreenID`). Then `Savvy.ENTER` is fired.

####Pausing transition####

If a `Savvy.EXIT` or `Savvy.READY` event message returns `false`, the screen transition will be paused at that step in the life cycle. This can be useful, for example, to wait until an AJAX call complete before continuing with the transition.

To continue the transition, call `Savvy.go()` without passing any parameters. Calling `Savvy.go(...)` with any the ID of another screen will cancel the transition and start a new one.

###Event subscriptions###

####Subscribing to events####

Messages can be subscribed to from individual screens (in which case they will be unsubscribed from when the screen unloads) or they can be subscribed to using the `Savvy` object (in which case the subscription will persist across screens). In general, snippets of JavaScript that are used by screen should subscribe to messages using the former technique. Snippets of JavaScript that are "global" will always subscribe using the latter.

These can be subscribed to from an screen's JavaScript snippet as follows: 

    this.subscribe(Savvy.READY, function ready(){
      // code goes here
    });

    this.subscribe(Savvy.ENTER, function(){
      // code goes here
    });

    this.subscribe(Savvy.EXIT, function(){
      // code goes here
    })

In "global" JavaScript contexts, the Savvy object can subscribe to these events as follows:

    Savvy.subscribe(Savvy.READY, function ready(){
      // code goes here
    });

    Savvy.subscribe(Savvy.ENTER, function(){
      // code goes here
    });

    Savvy.subscribe(Savvy.EXIT, function(){
      // code goes here
    })

####Unsubscribing from events###

To unsubscribe from an event, call `Savvy.unsubscribe(...)` and pass the type of message to unsubscribe and the function that was subscribed. For example:

    function callback(){
      // fires at all 
    }

    Savvy.subscribe(Savvy.ENTER, callback); // subscribe
    Savvy.unsubscribe(Savvy.ENTER, callback); // unsubscribe

###Accessing the DOM###

Savvy provides two methods to access the DOM:

`Savvy.getGlobal()` returns the HTML `div` element containing global HTML.

`Savvy.getScreen()` returns the HTML `div` element containing the current screen's HTML. During a transition, this methods returns the new screen after the `Savvy.EXIT` message. is fired.

##Screen objects##

Savvy executes every screen's JavaScript snippet within an unique screen objects.

These objects are created new everytime a screen is loaded (immediately prior to Savvy.READY) and destroyed with a screen is unloaded (immediately after Savvy.EXIT).

###Accessing screen objects###

When a JavaScript snippet is executed within a screen object, the `this` keyword will ordinarily refer to the screen object. The screen object may also be accessed literally using the screen ID.

For example, for a screen with an ID "MainMenu", the screen object may be accessed in the following way:

    this
    MainMenu

Screen objects are children of the JavaScript `window` object, so they can be accessed from "global" JavaScript (including in-line JavaScript on DOM elements) using the screen's ID.

###Individual closures###

Within a screen object, individual JavaScript snippets have seperate [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures).

This means that different scripts used on the same screen may contain identical identifiers for different variables (e.g. `myVar` in one JavaScript snippet will ordinarily be a different object to `myVar` in another snippet).

However, this also means that in order to call a function or access an variable in one script from another, the functino or variable needs to be explicitly exposed.

Script 1:

    function hello(world) {
      console.log("Hello, " + world);
    }

    this.hello = hello;

Script 2:

    var world = "Mars";
    this.hello(world); // Hello, Mars

###`_screen` and `_global`###

Savvy extends the JavaScript `window` object with two helper objects: `_screen` and `_global`.

`_screen` is a reference to the current screen object. `_global` is a reference to the JavaScritpt `window` object (and is provided solely for syntatic consitency).

`_screen` is set to the current screen object immediately after the `Savvy.EXIT` event.

##Routing##

The Savvy framework includes automatic routing of URLs to specific screen within an app. URLs used by the Savvy framework follow a simple pattern:

    http://www.example.com/path/to/savvy/#!/id/optional/further/path

The above URL would load a screen with the ID `id`.

The portion of the URL after `id` (i.e. `/optional/further/path`) is not used by the framework. However, it can be used applications to create REST-like URLs. For example, the following URL could be used to access a screen with the ID of `indox`. The application could then further interpret the URL to load the inbox of an individual user (`john`):

    http://www.example.com/path/to/savvy/#!/inbox/john

The Savvy path of a screen, including the optional further path after the Savvy screen ID can be retrieved using `Savvy.getInfo()`. In the case of teh above example, this would return the following object:

    {
      id: "inbox",
      title: "Inbox",
      isDefault: false,
      path: "/inbox/john"
    }

##License##

The Savvy framework is open source and released under the [MIT license](http://opensource.org/licenses/MIT). The [pirate image](http://thenounproject.com/noun/pirate/#icon-No13422) used by the project was designed by [Anne Caroline Bittencourt Gonçalves](http://thenounproject.com/anne1003) from The Noun Project.