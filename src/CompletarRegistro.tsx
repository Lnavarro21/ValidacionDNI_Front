import { useState, useEffect } from 'react';
import './App.css';

const CompletarRegistro = () => {
  const [form, setForm] = useState({
    dni: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    genero: '',
    fechaNacimiento: '',
    email: '',
    celular: '',
    direccion: '',
    colegio3ro: '',
    colegio4to: '',
    colegio5to: '',
    modalidad: '',
    sede: '',
    facultad1: '',
    escuela1: '',
    facultad2: '',
    escuela2: ''
  });

  const [idPostulante, setIdPostulante] = useState<number | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("idPostulante");
    if (!id) {
      console.error("No hay idPostulante en localStorage");
      return;
    }
    setIdPostulante(Number(id));

    const fetchPostulante = async () => {
      try {
        const response = await fetch(
          `https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/postulanteSel?IdPostulante=${id}`
        );
        const data = await response.json();
        if (data && data.idPostulante) {
          setForm(prev => ({
            ...prev,
            dni: data.documento || '',
            nombres: data.nombres || '',
            apellidoPaterno: data.apellidoPaterno || '',
            apellidoMaterno: data.apellidoMaterno || '',
            email: data.email || '',
            celular: data.celular || '',
            modalidad: data.modalidad || '',
            sede: data.sede || '',
            escuela1: data.escuela || ''
          }));
        }
      } catch (error) {
        console.error("Error al obtener datos del postulante:", error);
      }
    };

    fetchPostulante();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!idPostulante) {
      alert("No se encontró el id del postulante.");
      return;
    }

    const genero = form.genero === 'Masculino' ? 1 : form.genero === 'Femenino' ? 2 : 0;
    const modalidad = form.modalidad === 'Ordinario' ? 1 : form.modalidad === 'Extraordinario' ? 2 : 0;
    const sede = form.sede === 'Lima' ? 1 : form.sede === 'Chiclayo' ? 2 : 0;

    const body = {
      idPostulante,
      idGenero: genero,
      fechaNacimiento: form.fechaNacimiento,
      direccion: form.direccion,
      colegio3: form.colegio3ro,
      colegio4: form.colegio4to,
      colegio5: form.colegio5to,
      idModalidad: modalidad,
      idSede: sede,
      idFacultad: 0,
      idEscuela: 0
    };

    try {
      const response = await fetch(
        "https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/completarregistro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      if (response.ok) {
        alert("Registro completado exitosamente.");
      } else {
        alert("Error al completar el registro.");
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="contenedor-principal">
      <div className="formulario">
        <div className="icono-encabezado">
          <img
            src="https://admision.usmp.edu.pe/img/oficinadeadmision2.png"
            alt="Oficina de Admisión USMP"
            className="logo-usmp"
          />
        </div>

        <div className="barra-navegacion">
          <button>Genera tu Recibo</button>
          <button>Inscripción en Línea</button>
          <button>Simulador de Escalas</button>
        </div>

        <h2 className="titulo-pagina2">COMPLETAR REGISTRO</h2>
        <div className='bloques'>
          <div className="bloque1">
            <h3>Datos Personales</h3>
            <div className="grid-form">
              <label>Documento</label><input name="dni" value={form.dni} readOnly />
              <label>Nombres</label><input name="nombres" value={form.nombres} readOnly />
              <label>Apellido Paterno</label><input name="apellidoPaterno" value={form.apellidoPaterno} readOnly />
              <label>Apellido Materno</label><input name="apellidoMaterno" value={form.apellidoMaterno} readOnly />
              <label>Género</label>
              <select name="genero" value={form.genero} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
              <label>Fecha Nacimiento</label>
              <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />
              <label>Email</label><input type="email" name="email" value={form.email} readOnly />
              <label>Celular</label><input name="celular" value={form.celular} readOnly />
              <label>Dirección</label><input name="direccion" value={form.direccion} onChange={handleChange} />
            </div>
          </div>

          <div className="bloque2">
            <h3>Educación Secundaria</h3>
            <div className="grid-form">
              <label>3ro <input name="colegio3ro" value={form.colegio3ro} onChange={handleChange} /></label>
              <label>4to <input name="colegio4to" value={form.colegio4to} onChange={handleChange} /></label>
              <label>5to <input name="colegio5to" value={form.colegio5to} onChange={handleChange} /></label>
            </div>
          </div>

          <div className="bloque3">
            <h3>Otras Preferencias</h3>
            <div className="grid-form">
              <label>Modalidad
                <select name="modalidad" value={form.modalidad} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  <option value="Ordinario">Ordinario</option>
                  <option value="Extraordinario">Extraordinario</option>
                </select>
              </label>
              <label>Sede <br />
                <select name="sede" value={form.sede} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  <option value="Lima">Lima</option>
                  <option value="Chiclayo">Chiclayo</option>
                </select>
              </label>
            </div>
            <label><b>Opción 1</b></label>
            <div className="grid-form">
              <label>Facultad<input name="facultad1" value={form.facultad1} readOnly /></label>
              <label>Escuela<input name="escuela1" value={form.escuela1} readOnly /></label>
            </div>
            <label><b>Opción 2</b></label>
            <div className="grid-form">
              <label>Facultad<input name="facultad2" value={form.facultad2} onChange={handleChange} /></label>
              <label>Escuela<input name="escuela2" value={form.escuela2} onChange={handleChange} /></label>
            </div>
          </div>
          <button className="btn-GuardarCambios" onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default CompletarRegistro;
