document.addEventListener("DOMContentLoaded", function(event) {
  const video = document.getElementById("video");
  const canvasElement = document.getElementById("canvas");
  const canvas = canvasElement.getContext("2d");
  const qrResult = document.getElementById("qr-result");
  

  function handleSuccess(stream) {
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(tick);
  }

  function handleError(error) {
    console.error("Error al acceder a la camara: ", error);
  }

  function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.hidden = false;
      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;
      const windowHeight = window.innerHeight;
      const qrResultHeight = qrResult.offsetHeight;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });
      

      if (code) {
        qrResult.textContent = "Codigo QR detectado: " + code.data;
        stream.getTracks().forEach(track => track.stop(3000));  // esta linea no funciona por el momento. Deberia reactivar la camara a los 3 seg
        // Aqui se muestra el codigo leido, añadiriamos el codigo despues si quisieramos hacer algo con el codigo leido
      } else {
        //si no lee nada se mantiene este mensaje
        qrResult.textContent = "Escaneando...";
        qrResult.style.fontFamily = "Roboto";
        
        
        
      }

/*Aqui posicionamos y le damos estilo al poceso de escaneo*/
      if (windowHeight > qrResultHeight) {
      qrResult.style.position = "fixed";
      qrResult.style.bottom = "20%";
      qrResult.style.fontSize = "25px";
    } else {
      qrResult.style.position = "relative";
      qrResult.style.bottom = "auto";
    }
  
    }
    requestAnimationFrame(tick);
  }


  function startCamera() {
    // Acceder a la cámara del dispositivo móvil o webcam  (enviroment accede a la camara trasera solamente)
    navigator.mediaDevices.getUserMedia({ video: {facingMode:"environment"} })
      .then(handleSuccess)
      .catch(function(e) {
        // Si no se puede acceder a la cámara del dispositivo móvil, intentar acceder a la webcam
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
          .then(handleSuccess)
          .catch(handleError);
      });
  }

  //Estas lineas reactivan la camara una vez el codigo QR haya sido escaneado
  const reactivateBtn = document.getElementById("camara");  //"camara" hace referencia al ID del boton en el codigo HTML y le da la funcion de resetear dicha camara al leer el codigo

  // Escuchar evento de clic en el botón y reactiva la camara
  reactivateBtn.addEventListener("click", function() {
    startCamera();
  });

  startCamera();
});


