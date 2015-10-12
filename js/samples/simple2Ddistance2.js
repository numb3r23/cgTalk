(function() {
  var EXAMPLE = "simple2Ddistance2";


  var width = sample_defaults.height * 2;
  var height = sample_defaults.height * 2;

  window.samples.shaders.push(["assets/shader/simple2Ddistance2.frag", EXAMPLE, "fragment"]);
  window.samples.shaders.push(["assets/shader/screenQuad.vert", EXAMPLE, "vertex"]);

  window.samples.simple2Ddistance2 = {
    initialize: function(canvas, options) {
      var gl = canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' );
      console.log("Extension? " + (gl.getExtension('OES_standard_derivatives') ? "Yes" : "No"));      

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

      var plane = new THREE.PlaneGeometry(2, 2);
      var quad = new THREE.Mesh( plane, materialX );
      quad.position.z = -100;
      scene.add( quad );

      var axisHelper = new THREE.AxisHelper(50);
      scene.add( axisHelper );

      var renderer = new THREE.WebGLRenderer({"canvas": canvas});
      renderer.setSize( width, height );

      var instance = { active: false };
      var time = 0.0;
      function animate() {
        requestAnimationFrame( animate, canvas );
        if(!instance.active || sample_defaults.paused)
        {
          return;
        }
        window.hack = quad;
        time += 0.5;
        //console.log(materialX.uniforms.u_Time);
        materialX.uniforms.u_Time.value = time;

        renderer.render( scene, camera );
      }

      animate();
      return instance;
    }
  };
})();

