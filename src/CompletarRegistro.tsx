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

  useEffect(() => {
    const idPostulante = localStorage.getItem("idPostulante");

    if (!idPostulante) {
      console.error("No hay idPostulante en localStorage");
      return;
    }

    const fetchPostulante = async () => {
      try {
        const response = await fetch(
          `https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/postulanteSel?IdPostulante=${idPostulante}`
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
              <select name="genero" value={form.genero} disabled>
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
              <label>Fecha Nacimiento</label><input type="date" name="fechaNacimiento" value={form.fechaNacimiento}/>
              <label>Email</label><input type="email" name="email" value={form.email} readOnly />
              <label>Celular</label><input name="celular" value={form.celular} readOnly />
              <label>Dirección</label><input name="direccion" value={form.direccion} />
            </div>
          </div>

          <div className="bloque2">
            <h3>Educación Secundaria</h3>
            <div className="grid-form">
              <label>3ro <input name="colegio3ro" value={form.colegio3ro}  /></label>
              <label>4to <input name="colegio4to" value={form.colegio4to}  /></label>
              <label>5to <input name="colegio5to" value={form.colegio5to}  /></label>
            </div>
          </div>

          <div className="bloque3">
            <h3>Otras Preferencias</h3>
            <div className="grid-form">
              <label>Modalidad
                <select name="modalidad" value={form.modalidad} disabled>
                  <option value="">Seleccionar</option>
                  <option value="Ordinario">Ordinario</option>
                  <option value="Extraordinario">Extraordinario</option>
                </select>
              </label>
              <label>Sede <br />
                <select name="sede" value={form.sede} disabled>
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
              <label>Facultad<input name="facultad2" value={form.facultad2}  /></label>
              <label>Escuela<input name="escuela2" value={form.escuela2}  /></label>
            </div>
          </div>
          <button className="btn-GuardarCambios" disabled>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default CompletarRegistro;
