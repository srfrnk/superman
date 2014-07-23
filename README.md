#Superman

##Node based configurable proxy/router/'anything you want' project.

If you ...

* Use hosts file manager to debug your web application...
* Need to replace calls to remote servers from your client to debug your webapps.. e.g. replace a call for an image with a local image....
* Want to log all request...
* Need anything else a proxy can do...

... Superman can help you.
 
Superman is a NodeJS proxy based on [node-http-proxy](https://github.com/nodejitsu/node-http-proxy) ... Nothing new about that part.
Superman adds the ability to configure what the proxy performs in three easy ways.
It is also very easily extensible so that any other needs you may have may be quickly added.
Superman can be configured in real-time. Most settings will be applicable from the very next server request.

Superman works with rules.
A rule determines how the proxy should behave in response to a server request.
Each rule has two important parts - a matcher and an action.
A rule matcher determines which requests should be handled by the rule.
A rule action determines what response should be applied when the rule is matched to a request.

Rules are ordered by their priority - higher priority means it's going to be matched first.
Rules can be active or inactive - inactive rules will not be matched.
When a rule is matched by a request - no further rules will be matched, instead the rule is applied.
A rule that is applied to a request will have it's action performed.
It is up to the action to have the response handled correctly.
  
There are built-in matchers and built-in actions but it's very easy to construct new matchers and actions, add them and use them.
Matchers and actions use generic and specific parameters within the rule to effect their performance.
See the API below for more info.

### Documentation

#### Installation
$ npm install -g superman2

#### Running
$ superman

Set your browser proxy settings to use localhost:#### as proxy for all calls except 'localhost'. #### being the proxy port superman is setup for. (default is 8000)
Use the browser to configure superman by going to http://localhost:####/superman

Three ways to configure Superman:
* Settings file
* Web interface
* REPL interface

#### Settings File
The **settings.json** file is at the root of the project dir.
It is loaded once at server startup - Changes to it will affect next run.

#### Web Interface
When superman is up it also serves as a web-server at the same port as the proxy - on localhost.
To access the configuration web-interface open your favorite chrome browser :-) to:
*http://localhost:####/superman* - #### being the proxy port superman is setup for. (default is 8000)

The list of rules is displayed.
It can be reordered by D&D.
Rules can be deleted with the 'X' button.
New rules can be added at the top with the 'Add New...' button.
The 'Save' button applies changes to the server so they take affect immediately from next request.
Each rule can be active/inactive.
The order of the rules determines the priority in which they are processed.
Next to the active/inactive checkbox you can edit the rule description.
Below you can edit the rule matcher and the rules action.
Try no to delete the last 'catch-all' rule... :)

#### REPL Interface
When Superman is run from console you will get a 'Superman >>' cmd prompt.
You have access to the 'sm' object which contains all of superman's configurable content.
Most probably the 'sm.settings.rules' object is what you're going to use...
Any changes will take affect immediately - at the next request and on.

**The REPL offers great power over superman:**
*With great power comes great responsibility*

**Be careful not to mess the 'sm' object.... A superman restart will most likely be needed in such cases!**  

### Rules
A Rule object takes the following basic properties:
- 'active' - bool - true to process the rule, false to ignore it.
- 'priority' - int - determines order for processing rules, higher is first in order.     
- 'matcher' - string - name of mather to use for the rule. See 'Matchers'
- 'action' - string - name of action to use for the rule. See 'Actions'
- 'description' - string - description of rule - will be added to logger output when rule is used.   
- 'comment' - string - optional text to describe or add info about the rule. will not used by superman. purely for maintenance purposes.

### Matchers
A Matcher is a method to determine if a rule applies to a request.
Matchers are put into the 'sm' ruleMatchers property. They can be added or deleted.
Matchers are identified within the ruleMatchers object by name.
Each matcher is a function of the form:

*function(rule , req , proxyInfo)*

Where:
- 'rule' - object - the rule object being matched.
- 'req' - object - the ServerRequest object of the request being matched.
- 'proxyInfo' - object - the 'sm' object containing all superman's configurable content (see 'REPL')

The function must return a boolean, true if the rule is matched by this matcher for this request, false if not.

Matchers may define and use custom properties of the rule object.
Each matcher may thus require setting of additional properties.

**Current built-in matchers:**

**"url-string"**  Matches requests where the url contains a string value. 

Custom properties:

  'url' - string - a string to be searched within the request url.
  
  
**"url-regex"**  Matches requests where the url matches a regular expression value. 

Custom properties:

  'url' - string - a string containing a regex pattern to be matched against the request url.


**"match-all"**  Matches all requests. This is usually for a catch-all rule. 

Custom properties:

  None!
  
  
### Actions
An Action is a method that performs actions and determines the response for the rule.
Actions are put into the 'sm' ruleActions property. They can be added or deleted.
Actions are identified within the ruleActions object by name.
Each action is a function of the form:

*function (rule , req , res , proxyInfo)*

Where:
- 'rule' - object - the rule object.
- 'req' - object - the ServerRequest object of the request.
- 'res' - object - the ServerResponse object of the response.

'proxyInfo' - object - the 'sm' object containing all superman's configurable content (see 'REPL')
 
The function must return a string, which will be put into the log as the description of the action that was performed by the rule.

Actions may define and use custom properties of the rule object.
Each action may thus require setting of additional properties.

**Current built-in actions:**

**"static-file"**  Respond by streaming a static-file to the client. 

Custom properties:

  'filePath' - string - a path to the file to stream, relative to the superman app dir. 
  
  
**"localhost"**  Proxy the request to a server on the localhost

Custom properties:

  'localPort' - int - the local port to proxy to. defaults to 80. 
  
  
**"pass-through"**  Proxy the request to the original target. effectively passes through superman, this is usually the action of the 'catch-all' rule.

Custom properties:

  None! 
  

Hopefully didn't forget anything...
If I did - or if you need any help.... drop in an issue on GitHub...

Enjoy - and may the force be with you! 
