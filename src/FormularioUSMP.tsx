import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const FormularioUSMP = () => {
  const [tipoDoc, setTipoDoc] = useState<number>(1);
  const [numero, setNumero] = useState('');
  const [verificador, setVerificador] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [nombres, setNombres] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [tiposDocumento, setTiposDocumento] = useState<{ idDocumento: number; documento: string }[]>([]);
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    fetch("https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/listaTipoDocumento")
      .then(res => res.json())
      .then(data => setTiposDocumento(data.lista))
      .catch(err => console.error("Error cargando tipos de documento:", err));
  }, []);

  const handleTipoDocChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoTipo = Number(e.target.value);
    setTipoDoc(nuevoTipo);
    setNumero('');
    setVerificador('');
    setApellidoPaterno('');
    setApellidoMaterno('');
    setNombres('');
    setMensajeError('');
  };

  useEffect(() => {
    const tipoSeleccionado = tiposDocumento.find(doc => doc.idDocumento === tipoDoc);

    if (tipoSeleccionado?.documento === "DNI" && numero.length === 8 && verificador.length === 1) {
      const consultarAPI = async () => {
        try {
          const response = await axios.post(
            'https://apiperu.dev/api/dni',
            { dni: numero },
            {
              headers: {
                Authorization: 'Bearer 5ef0d9fc00e59293384a9977675e95edd75cae1e1044c4077f9f78715ffac1d8',
                'Content-Type': 'application/json',
                Accept: 'application/json'
              }
            }
          );

          if (response.data.success && String(response.data.data.codigo_verificacion) === verificador) {
            setApellidoPaterno(response.data.data.apellido_paterno);
            setApellidoMaterno(response.data.data.apellido_materno);
            setNombres(response.data.data.nombres);
            setMensajeError('');
          } else {
            setMensajeError('DNI o código incorrecto');
            setApellidoPaterno('');
            setApellidoMaterno('');
            setNombres('');
          }

          console.log('Respuesta API:', response.data);
        } catch (err) {
          console.error('Error al consultar la API:', err);
          setMensajeError('Error al consultar el DNI');
        }
      };

      consultarAPI();
    }
  }, [numero, verificador, tipoDoc, tiposDocumento]);

  const handleRegistrar = async () => {
    try {
      const body = {
        idTipoDocumento: tipoDoc,
        documento: numero,
        apellidoPaterno,
        apellidoMaterno,
        nombres,
        email: correo,
        celular: telefono
      };

      const response = await axios.post(
        'https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/registrar',
        body
      );

      if (response.data?.idTipoMensaje === 0) {
      alert('Registro realizado satisfactoriamente');
      setMensajeError('');
    } else {
      setMensajeError(response.data.mensaje || 'Error desconocido al registrar');
    }
    } catch (error) {
      console.error('Error al registrar los datos:', error);
      alert('Hubo un error al registrar los datos');
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

        <div className="seccion formulario-postulante">
          <h2>Datos del Postulante</h2>
          <div className="fila">
            <select value={tipoDoc} onChange={handleTipoDocChange}>
              {tiposDocumento.map(doc => (
                <option key={doc.idDocumento} value={doc.idDocumento}>
                  {doc.documento}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              maxLength={tipoDoc === 1 ? 8 : 15}
              pattern={tipoDoc === 1 ? '[0-9]*' : undefined}
              inputMode={tipoDoc === 1 ? 'numeric' : 'text'}
            />

            {tipoDoc === 1 && (
              <input
                type="text"
                value={verificador}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d?$/.test(val)) setVerificador(val);
                }}
                maxLength={1}
                style={{ width: '50px' }}
              />
            )}
          </div>

          {mensajeError && <p className="mensaje-error">{mensajeError}</p>}

          <div className="grid">
            <input
              type="text"
              placeholder="Apellido Paterno"
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
              readOnly={tipoDoc === 1}
            />
            <input
              type="text"
              placeholder="Apellido Materno"
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
              readOnly={tipoDoc === 1}
            />
            <input
              type="text"
              placeholder="Nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              readOnly={tipoDoc === 1}
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <input
              type="email"
              placeholder="Correo"
              className="colspan"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="botones">
            <button className="btn-rojo" onClick={handleRegistrar}>Registrar</button>
            <button className="btn-gris">Limpiar Datos</button>
          </div>
        </div>

        <div className="seccion formulario-recibo">
          <h2>Datos de Recibo</h2>
          <div className="tabs">
            {["Pregrado", "Ciclo Cero", "Postgrado", "Virtual", "Centro de Idiomas", "EPU's / Instituciones"].map((label) => (
              <button key={label}>{label}</button>
            ))}
          </div>
          <div className="grid">
            <select><option>SEDE</option></select>
            <select disabled><option>MODALIDAD</option></select>
            <select disabled><option>ESCUELA</option></select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioUSMP;
