(function() {
  var EXAMPLE = "metaballs2D";

  var width = sample_defaults.height * 2;
  var height = sample_defaults.height * 2;


  window.samples.shaders.push(["assets/shader/metaballs2D.frag", EXAMPLE, "fragment"]);
  window.samples.shaders.push(["assets/shader/screenQuad.vert", EXAMPLE, "vertex"]);

  
  window.samples.metaballs2D = {
    initialize: function(canvas, options) {
      canv = canvas;
      var scene = new THREE.Scene();

      var camera = new THREE.PerspectiveCamera( 75, width / height, 1, 5000 );
      camera.position.z = 100;

      var materialX = new THREE.RawShaderMaterial({  
        uniforms: {
          u_Time: {type: 'f', value: 0.0}
        },
        vertexShader: loadedShaders[EXAMPLE].vertex,
        fragmentShader: loadedShaders[EXAMPLE].fragment,
      });

      //setupDatGui();

      var plane = new THREE.PlaneGeometry(2, 2);
      var quad = new THREE.Mesh( plane, materialX );
      quad.position.z = -100;
      scene.add( quad );

      var renderer = new THREE.WebGLRenderer({"canvas": canvas});
      renderer.setSize(height, height);

      var instance = { active: false };
      var time = 0.0;

      function animate() {
        requestAnimationFrame( animate, canvas );
        if(!instance.active || sample_defaults.paused)
        {
          return;
        }
        time += 0.2;
        materialX.uniforms.u_Time.value = time;
        renderer.render(scene, camera);
      }

      animate();
      return instance;
    }
  };
})();

