var datGui;
$(function() {

  datGui = new dat.GUI();
  var pauseController = datGui.add(sample_defaults, "paused");

  datGui.fldr = datGui.addFolder("Parameters");  
  datGui.closed = true;

  // Listen to Shift + p to toggle pause.
  $(document).bind('keyup.shift_p', function() {
    sample_defaults.paused = !sample_defaults.paused;
    pauseController.setValue(sample_defaults.paused);
  });

  // Listen to Shift + w to toggle wireframe for blender meshes.
  $(document).bind('keyup.shift_w', function() {
    sample_defaults.wireframe = !sample_defaults.wireframe;
    wireframeController.setValue(sample_defaults.wireframe);
  });
});

function isDatGuiHidden() {
  return datGui.domElement.style.opacity == 0;
}

function removeDatGuiFolder(name) {
  datGui.__folders[name].close();
  datGui.__folders[name].domElement.parentNode.parentNode.removeChild(datGui.__folders[name].domElement.parentNode);
  datGui.__folders[name] = undefined;
  datGui.onResize();
}

function setupDatGuiFolder(data) {
    removeDatGuiFolder("Parameters");
    datGui.fldr = datGui.addFolder("Parameters");
}
  
dat.GUI.toggleHide();
