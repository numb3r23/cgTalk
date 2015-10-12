// globals needed the shader loading
var eventEmitter = new EventEmitter();

window.sample_defaults = {
  addListener: function(event, listener) {
    eventEmitter.addListener(event, listener);
  },
  width: 320,
  height: 240,
  paused: false,
  wireframe: false,
};

window.samples = {};
window.samples.shaders = [];

function LoadShaders() {

  function createSample($el) {
    var index = $el.data("sample");
    var instance = window.samples[index].initialize($el[0]);
    $el.data("instance", instance);
    return instance;
  };

  function runCurrentSample(currentSlide) {
    var foundSomething = false;
    $(currentSlide).find("[data-sample]").each(function() {
      var instance = createSample($(this));
      if (instance) {
        instance.active = true;
        foundSomething = true;
        //instance.setupDatGui();
      }
    });

    if (foundSomething == isDatGuiHidden()) {
      dat.GUI.toggleHide();
    }
  };

  function countLoadedShaders() {
    var count = 0;
    for (exampleName in loadedShaders) {
      count += Object.keys(loadedShaders[exampleName]).length;
    }
    return count;
  }

  // method modified from https://github.com/codecruzer/webgl-shader-loader-js
  /**
   * Loads an external shader file asynchronously using AJAX
   * 
   * @param {Object} The shader script tag from the DOM
   * @param {String} The type of shader [vertex|fragment]
   */
  var loadShaderFile = function (url, name, type)
  {
    /**
     * Processes a shader that comes back from
     * the AJAX and stores it in the Shaders
     * Object for later on
     * 
     * @param {Object} The jQuery XHR object
     * @param {String} The response text, e.g. success, error
     */
    var onComplete = function onComplete(jqXHR, textStatus)
    {
      if (!loadedShaders[name])
      {
        loadedShaders[name] = {};
      }
      
      loadedShaders[name][type] = jqXHR.responseText;

      // check if everything isloaded ... let's see if we are on a slide with webgl...
      if (countLoadedShaders() == window.samples.shaders.length) {
        runCurrentSample($("section.present"));
      }
    }

    $.ajax(
      {
        url: url,
        dataType: "text",
        context: {
          name: name,
          type: type
        },
        complete: onComplete
      }
    );
  }

  function initializeOnLoad() {
    // Activate appropriate sample on slide change.
    Reveal.addEventListener('slidechanged', function(event) {
      // Clear all slides
      $("[data-sample]").each(function() {
        var instance = $(this).data("instance");
        if(instance) instance.active = false;
      });

      var currentSlide = event.currentSlide;
      runCurrentSample(currentSlide);
    });

    // load all samples stored in global var
    for (var i = 0; i < window.samples.shaders.length; i++) {
      var shader = window.samples.shaders[i];
      loadShaderFile(shader[0], shader[1], shader[2]);
    }

    eventEmitter.emitEvent("initialized");
  }
  
  loadedShaders = [];

  initializeOnLoad();
};