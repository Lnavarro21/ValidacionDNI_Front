import React, { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
                <label>Documento</label><input name="dni" value={form.dni} onChange={handleChange} />
                <label>Nombres</label><input name="nombres" value={form.nombres} onChange={handleChange} />
                <label>Apellido Paterno</label><input name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange} />
                <label>Apellido Materno</label><input name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange} />
                <label>Género</label>
                <select name="genero" value={form.genero} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                </select>
                <label>Fecha Nacimiento</label><input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />
                <label>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} />
                <label>Celular</label><input name="celular" value={form.celular} onChange={handleChange} />
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
                <label>Modalidad <select name="modalidad" value={form.modalidad} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    <option value="Ordinario">Ordinario</option>
                    <option value="Extraordinario">Extraordinario</option>
                </select></label>
                <label>Sede <br/> <select name="sede" value={form.sede} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    <option value="Lima">Lima</option>
                    <option value="Chiclayo">Chiclayo</option>
                </select></label>
                </div>
                <label><b>Opción 1</b></label>
                <div className="grid-form">
                <label>Facultad<input name="facultad1" value={form.facultad1} onChange={handleChange} /></label>
                <label>Escuela<input name="escuela1" value={form.escuela1} onChange={handleChange} /></label>
                </div>
                <label><b>Opción 2</b></label>
                <div className="grid-form">
                <label>Facultad<input name="facultad2" value={form.facultad2} onChange={handleChange} /></label>
                <label>Escuela<input name="escuela2" value={form.escuela2} onChange={handleChange} /></label>
                </div>
            </div>
            <button className="btn-GuardarCambios" >Guardar</button>
        </div>
      </div>

      
    </div>
  );
};

export default CompletarRegistro;
