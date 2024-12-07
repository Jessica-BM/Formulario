// Script para paginación
const form = document.getElementById("multiStepForm");
const steps = document.querySelectorAll(".step");
const paginationItems = document.querySelectorAll(".pagination .page-item");
const prevButton = document.querySelector(".prev-step");
const nextButton = document.querySelector(".next-step");
let currentStep = 0;

// Función para mover a un paso específico
function moveToStep(newStep) {
  if (newStep < 0 || newStep >= steps.length) return;

  // Validar el paso actual antes de cambiar
  const currentStepElement = steps[currentStep];
  if (currentStepElement.querySelector("input:invalid")) {
    currentStepElement.querySelector("input:invalid").reportValidity();
    return;
  }

  // Ocultar el paso actual
  steps[currentStep].style.display = "none";
  paginationItems[currentStep + 1].classList.remove("active");

  // Mostrar el nuevo paso
  steps[newStep].style.display = "block";
  paginationItems[newStep + 1].classList.add("active");

  // Alternar visibilidad de botones
  prevButton.classList.toggle("d-none", newStep === 0);
  nextButton.classList.toggle("d-none", newStep === steps.length - 1);

  currentStep = newStep;
}

// Evento para el botón "Siguiente"
nextButton.addEventListener("click", function () {
  moveToStep(currentStep + 1);
});

// Evento para el botón "Anterior"
prevButton.addEventListener("click", function () {
  moveToStep(currentStep - 1);
});

// Evento para los ítems de paginación
paginationItems.forEach((item, index) => {
  if (item.dataset.step) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const targetStep = parseInt(item.dataset.step) - 1;
      moveToStep(targetStep);
    });
  }
});

// Inicializar primer paso
steps[0].style.display = "block";
paginationItems[1].classList.add("active");
prevButton.classList.add("d-none");

//Vistas de modales
const registroModal = new bootstrap.Modal(document.getElementById("saveInfo"));

document.getElementById("registrarBtn").addEventListener("click", function () {
  registroModal.show();
  const nameEstudiante = document.getElementById("nameEstudiante").value;
  const apEstudiante = document.getElementById("apEstudiante").value;
  const amEstudiante = document.getElementById("amEstudiante").value;
  const genero = document.getElementById("genero").value;
  const tipoSangre = document.getElementById("tsEstudiante").value;
  const fnEstudiante = document.getElementById("fnEstudiante").value;
  const selectedEnfermedad = document.querySelectorAll(
    'input[name="enfermedadOption"]:checked'
  );
  const enfermedadOp = Array.from(selectedEnfermedad).map(
    (checkbox) => checkbox.value
  );
  const enfermedad = document.getElementById("enfermedad").value;
  const religion = document.getElementById("religion").value;
  const observaciones = document.getElementById("observaciones").value;
  const nivelEscolar = document.getElementById("nivelEscolar").value;
  const gradoEscolar = document.getElementById("gradoEscolar").value;
  const cicloEscolar = document.getElementById("cicloEscolar").value;
  const promedio = document.getElementById("promedio").value;
  const escuela = document.getElementById("escuelaProcedencia").value;
  const boletaEstudiante = document.getElementById("boleta").files[0];
  const curpEstudiante = document.getElementById("curp").value;
  const curpFileEstudiante = document.getElementById("fileCurp").files[0];
  const actaNacimientoEstudiante =
    document.getElementById("actaNacimiento").files[0];
  const namePadre = document.getElementById("namePadre").value;
  const apPadre = document.getElementById("apPadre").value;
  const amPadre = document.getElementById("amPadre").value;
  const parentesco = document.getElementById("parentesco").value;
  const tipoSangrePadre = document.getElementById("tipoSangre").value;
  const fechaNacimiento = document.getElementById("fnPadre").value;
  const curpPadre = document.getElementById("curpPadre").value;
  const curpFilePadre = document.getElementById("curpFilePadre").files[0];
  const inePadre1 = document.getElementById("inePadre").files[0];
  const inePadre2 = document.getElementById("inePadre").files[1];
  const emailPadre = document.getElementById("emailPadre").value;
  const telCasa = document.getElementById("telCasa").value;
  const phone = document.getElementById("celPadre").value;
  const calle = document.getElementById("callePadre").value;
  const numero = document.getElementById("numPadre").value;
  const colonia = document.getElementById("colPadre").value;
  const cp = document.getElementById("cpPadre").value;
  const estado = document.getElementById("estadoSelect").value;
  const ciudad = document.getElementById("ciudadSelect").value;
  const ocupacion = document.getElementById("ocupacion").value;
  const estadoCivil = document.getElementById("estadoCivil").value;
  const nameContacto = document.getElementById("nameEmergencia").value;
  const apContacto = document.getElementById("apEmergencia").value;
  const amContacto = document.getElementById("amEmergencia").value;
  const parentescoContacto =
    document.getElementById("parentescoContacto").value;
  const celContacto = document.getElementById("celEmergencia").value;
  const nameCompleto = namePadre + " " + apPadre + " " + amPadre;
  const timestamp = moment(fechaNacimiento, "YYYY-MM-DD").valueOf();

  db.collection("inscripciones")
    .add({
      name: namePadre,
      primerApellido: apPadre,
      segundoApellido: amPadre,
      rol: "Padre de familia",
      parentesco: parentesco,
      tipoSangre: tipoSangrePadre,
      fechaNacimiento: timestamp
        ? firebase.firestore.Timestamp.fromMillis(timestamp)
        : null,
      curp: curpPadre,
      email: emailPadre,
      telCasa,
      phone,
      direccion: `${calle} ${numero}, ${colonia}. ${cp}. ${estado}, ${ciudad}`,
      ocupacion,
      estadoCivil,
      estudiantes: [],
      contacto: {
        name: nameContacto,
        primerApellido: apContacto,
        segundoApellido: amContacto,
        parentesco: parentescoContacto,
        phone: celContacto,
      },
      createAt: firebase.firestore.Timestamp.now(),
    })
    .then((docRef) => {
      const idDoc = docRef.id;

      const fileUploads = [
        { file: curpFilePadre, type: "curp", field: "curpFile" },
        { file: inePadre1, type: "ine", field: "ineFrente" },
        { file: inePadre2, type: "ine", field: "ineReves" },
      ].map((upload) =>
        upload.file
          ? uploadCurpFile(
              upload.file,
              nameCompleto + "_" + idDoc,
              upload.type
            ).then((downloadURL) => {
              return db
                .collection("inscripciones")
                .doc(idDoc)
                .update({ [upload.field]: downloadURL });
            })
          : Promise.resolve()
      );

      return uploadAlumno(
        idDoc,
        nameEstudiante,
        apEstudiante,
        amEstudiante,
        genero,
        tipoSangre,
        fnEstudiante,
        enfermedadOp,
        enfermedad,
        religion,
        observaciones,
        nivelEscolar,
        gradoEscolar,
        cicloEscolar,
        promedio,
        escuela,
        boletaEstudiante,
        curpEstudiante,
        curpFileEstudiante,
        actaNacimientoEstudiante
      )
        .then((idEstudiante) => {
          const nameFolder = `${nameEstudiante} ${apEstudiante} ${amEstudiante}`;

          const studentFileUploads = [
            {
              file: curpFileEstudiante,
              type: "curp",
              field: "curpFile",
            },
            {
              file: actaNacimientoEstudiante,
              type: "acta_nacimiento",
              field: "actaNacimiento",
            },
            {
              file: boletaEstudiante,
              type: "boleta",
              field: "boleta",
            },
          ].map((upload) =>
            upload.file
              ? uploadCurpFile(upload.file, nameFolder, upload.type).then(
                  (downloadURL) => {
                    return db
                      .collection("inscripciones")
                      .doc(idEstudiante)
                      .update({ [upload.field]: downloadURL });
                  }
                )
              : Promise.resolve()
          );

          return Promise.all([
            ...fileUploads,
            ...studentFileUploads,
            db
              .collection("inscripciones")
              .doc(idDoc)
              .update({
                estudiantes: [{ idEstudiante, perfil: false }],
              }),
          ]);
        })
        .then(() => {
          moveToStep(0);
          setTimeout(() => {
            Swal.fire({
              title: "¡Registro guardado con éxito!",
              icon: "success",
              confirmButtonText: "Aceptar",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "<strong><u>INFORMACIÓN DE PAGO</u></strong>",
                  html: ` <!-- Costo inscripción -->
            <div class="mb-3" style="align-items: center">
              <span
                class="input-group-text"
                style="
                  background-color: #042159;
                  color: #fff;
                  font-weight: 500;
                "
                >COSTO DE INSCRIPCIÓN</span
              >
              <p>$3, 000 por alumno</p>
            </div>
            <!-- No. de cuenta -->
            <div class="mb-3" style="align-items: center">
              <span
                class="input-group-text"
                style="
                  background-color: #042159;
                  color: #fff;
                  font-weight: 500;
                "
                >NO. DE CUENTA</span
              >
              <p>0101727834</p>
            </div>
            <!-- No. de cuenta clabe -->
            <div class="mb-3" style="align-items: center">
              <span
                class="input-group-text"
                style="
                  background-color: #042159;
                  color: #fff;
                  font-weight: 500;
                "
                >NO. DE CUENTA CLABE</span
              >
              <p>012680001017278342</p>
            </div>
            <!-- Nombre de la empresa -->
            <div class="mb-3" style="align-items: center">
              <span
                class="input-group-text"
                style="
                  background-color: #042159;
                  color: #fff;
                  font-weight: 500;
                "
                >NOMBRE DEL BENEFICIARIO</span
              >
              <p>INSTITUTO J FRANCISCO RODRIGUEZ SC</p>
            </div>
      `,
                  focusConfirm: false,
                  confirmButtonText: `<i class="fa fa-thumbs-up"></i>Entendido`,
                  confirmButtonAriaLabel: "Thumbs up, great!",
                }).then(() => {
                  // Recargar la página después de confirmar en el segundo modal
                  location.reload();
                });
              }
            });
          }, 1000);
        })
        .catch((error) => {
          console.error("Error in upload process: ", error);
        });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
});

function uploadCurpFile(file, usuario, carpeta) {
  // Validate inputs
  if (!file || !usuario || !carpeta) {
    console.error("Missing file, usuario, or carpeta parameter");
    return Promise.reject("Invalid input");
  }

  // Initialize storage reference
  const storage = firebase.storage();
  const storageRef = storage.ref();
  const uploadPath = `inscripciones/${usuario}/${carpeta}/${file.name}`;
  const uploadTask = storageRef.child(uploadPath).put(file);

  return new Promise((resolve, reject) => {
    // Listen for state changes, errors, and completion of the upload
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log(`Upload is ${progress.toFixed(2)}% done`);

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // 'paused'
            // console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // 'running'
            // console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle errors
        console.error("Upload failed", error);
        switch (error.code) {
          case "storage/unauthorized":
            console.error("User doesn't have permission to access the object");
            break;
          case "storage/canceled":
            console.error("User canceled the upload");
            break;
          case "storage/unknown":
            console.error("Unknown error occurred:", error.serverResponse);
            break;
        }
        reject(error);
      },
      () => {
        // Upload completed successfully, now get the download URL
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then((downloadURL) => {
            // console.log("File available at", downloadURL);
            resolve(downloadURL);
          })
          .catch((error) => {
            console.error("Failed to get download URL", error);
            reject(error);
          });
      }
    );
  });
}

async function uploadAlumno(
  idDoc,
  nameEstudiante,
  apEstudiante,
  amEstudiante,
  genero,
  tipoSangre,
  fnEstudiante,
  enfermedadOp,
  enfermedad,
  religion,
  observaciones,
  nivelEscolar,
  gradoEscolar,
  cicloEscolar,
  promedio,
  escuela,
  boletaEstudiante,
  curpEstudiante,
  curpFileEstudiante,
  actaNacimientoEstudiante
) {
  try {
    // Add document to Firestore

    // Upload files concurrently
    const timestamp = moment(fnEstudiante, "YYYY-MM-DD").valueOf();

    const docRef = await db.collection("inscripciones").add({
      idPadre: idDoc,
      name: nameEstudiante,
      primerApellido: apEstudiante,
      segundoApellido: amEstudiante,
      genero,
      tipoSangre,
      fechaNacimiento: firebase.firestore.Timestamp.fromMillis(timestamp),
      enfermedad,
      religion,
      observaciones,
      nivelEscolar,
      grado: gradoEscolar,
      cicloEscolar,
      escuelaProveniente: escuela,
      curp: curpEstudiante,
      createAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}
